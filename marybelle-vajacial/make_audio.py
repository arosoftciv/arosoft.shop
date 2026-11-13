# Generates soft music bed + chimes, mixes voice-off at scene timings -> output/soundtrack.m4a
import numpy as np, wave, subprocess
SR=44100; DUR=71.0; N=int(SR*DUR); t=np.arange(N)/SR
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
fx=bell(0.15,[84,88,91])+bell(0.9,[76,79],.14)+bell(6.7,[84,88])+bell(16,[84,88])+bell(19.6,[84,88])+bell(25.2,[84,88])+bell(36.6,[84,88])+bell(45.6,[84,88])+bell(52.2,[84,88])+bell(60.2,[84,88])+bell(55.9,[84,88,91,96],.16)
mus=pad+fx
fade=np.clip(t/1.5,0,1)*np.clip((DUR-t)/2.0,0,1); mus*=fade
st=np.stack([mus,mus],1); st/=np.abs(st).max()/0.6
with wave.open('audio/music.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes())

# Voix-off : ElevenLabs (voix « Louise »), découpée en audio/vo1..vo9.wav, placée au début de chaque scène.
USE_VO=True
offs=[0.3, 6.95, 16.25, 19.85, 25.45, 36.85, 45.85, 52.45, 60.45]
if USE_VO:
    inp=['-i','audio/music.wav']; flt=[]
    for i,o in enumerate(offs,1):
        inp+=['-i',f'audio/vo{i:02d}.wav']; flt.append(f'[{i}]adelay={int(o*1000)}|{int(o*1000)}[v{i}]')
    flt.append(''.join(f'[v{i}]' for i in range(1,len(offs)+1))+'amix=inputs='+str(len(offs))+':normalize=0[vo]')
    flt.append('[0]volume=0.32[m];[vo]apad,atrim=0:71,asplit[vo1][vo2];[m][vo2]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=400[md]')
    flt.append('[md][vo1]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.0,atrim=0:71[out]')
else:
    inp=['-i','audio/music.wav']; flt=['[0]loudnorm=I=-16:TP=-1.0,atrim=0:71[out]']
subprocess.run(['ffmpeg','-nostdin','-v','error','-y',*inp,'-filter_complex',';'.join(flt),'-map','[out]','-ar','44100','-c:a','aac','-b:a','192k','output/soundtrack.m4a'],check=True)
print('ok')
