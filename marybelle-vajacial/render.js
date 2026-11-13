// Frame-accurate capture of ad.html -> output/MaryBelle_Vajacial_1080x1920.mp4
const {chromium}=require('playwright');const path=require('path');const {spawn}=require('child_process');
const FPS=30;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.resolve('ad.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
const DUR=await p.evaluate(()=>DUR);const N=Math.round(DUR*FPS);
const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-i','output/soundtrack.m4a',
 '-map','0:v','-map','1:a','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-profile:v','high','-c:a','copy','-movflags','+faststart','-shortest','output/MaryBelle_Vajacial_1080x1920.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/FPS);const buf=await p.screenshot({type:'jpeg',quality:95});
 if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r)); if(i%150===0) console.log('frame',i,'/',N);}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done');})();
