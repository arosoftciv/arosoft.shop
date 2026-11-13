const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.resolve('cover.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
await p.screenshot({path:'output/MaryBelle_Vajacial_Couverture_TikTok.png'});await b.close();})();
