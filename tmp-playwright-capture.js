const { chromium } = require('playwright');
const fs = require('fs');
(async() => {
  const browser = await chromium.launch({headless:true});
  const cases = [
    {w:390,h:844,name:'390x844'},
    {w:393,h:852,name:'393x852'},
    {w:430,h:932,name:'430x932'},
    {w:360,h:800,name:'360x800'},
  ];
  fs.mkdirSync('tmp-shots',{recursive:true});
  for (const c of cases) {
    const context = await browser.newContext({ viewport: { width: c.w, height: c.h } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `tmp-shots/before-${c.name}.png`, fullPage: false });
    await context.close();
  }
  await browser.close();
})();
