# Generates soft music bed + chimes, mixes voice-off at scene timings -> output/soundtrack.m4a
import numpy as np, wave, subprocess
SR=44100; DUR=44.0; N=int(SR*DUR); t=np.arange(N)/SR
def hz(m): return 440*2**((m-69)/12)
chords=[[53,57,60,64],[57,60,64,67],[50,57,60,65,64],[46,53,57,62]]  # Fmaj7 Am7 Dm9 Bbmaj7
pad=np.zeros(N); L=4.5
for i in range(int(DUR/L)+1):
    s=i*L; ch=chords[i%4]; idx=(t>=s-.6)&(t<s+L+1.2); tt=t[idx]-s
    env=np.clip((tt+.6)/1.2,0,1)*np.clip((L+1.2-tt)/1.8,0,1)
    for m in ch:
        f=hz(m); pad[idx]+=env*(np.sin(2*np.pi*f*tt)+.35*np.sin(2*np.pi*2*f*tt+.3)+.12*np.sin(2*np.pi*3.01*f*tt))*.06
pad*=0.85+0.15*np.sin(2*np.pi*.25*t)
def bell(at,notes,amp=.12):
    out=np.zeros(N)
    for k,m in enumerate(notes):
        s=at+k*.09; idx=t>=s; tt=t[idx]-s; f=hz(m)
        out[idx]+=amp*np.exp(-tt*2.2)*(np.sin(2*np.pi*f*tt)+.4*np.sin(2*np.pi*2.76*f*tt)*np.exp(-tt*3))
    return out
fx=bell(.15,[84,88,91])+bell(4.5,[86,89])+bell(9.3,[81,86])+bell(24.4,[81,84,88])+bell(28.9,[84,88,91,96],.16)+bell(33.2,[84,88,91])+bell(39.3,[88,91])
mus=pad+fx
fade=np.clip(t/1.5,0,1)*np.clip((DUR-t)/2.0,0,1); mus*=fade
st=np.stack([mus,mus],1); st/=np.abs(st).max()/0.6
with wave.open('audio/music.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes())
# Voix-off désactivée pour l'instant : musique seule.
# Pour réactiver plus tard : déposer audio/vo1.wav … vo5.wav (enregistrement humain) et mettre USE_VO=True.
USE_VO=False
offs=[0.8,4.4,17.4,24.6,33.4]  # (si voix-off réactivée)
if USE_VO:
    inp=['-i','audio/music.wav']; flt=[]
    for i,o in enumerate(offs,1):
        inp+=['-i',f'audio/vo{i}.wav']; flt.append(f'[{i}]adelay={int(o*1000)}|{int(o*1000)}[v{i}]')
    flt.append(''.join(f'[v{i}]' for i in range(1,6))+'amix=inputs=5:normalize=0[vo]')
    flt.append('[0]volume=0.32[m];[vo]apad,atrim=0:44,asplit[vo1][vo2];[m][vo2]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=400[md]')
    flt.append('[md][vo1]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.0,atrim=0:44[out]')
else:
    inp=['-i','audio/music.wav']; flt=['[0]loudnorm=I=-16:TP=-1.0,atrim=0:44[out]']
subprocess.run(['ffmpeg','-nostdin','-v','error','-y',*inp,'-filter_complex',';'.join(flt),'-map','[out]','-ar','44100','-c:a','aac','-b:a','192k','output/soundtrack.m4a'],check=True)
print('ok')
