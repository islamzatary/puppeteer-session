
const puppeteer = require('puppeteer');


(async () => {
  console.log("launching puppeteer....");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.bayt.com/en/jordan/', { waitUntil: 'networkidle2' });
  await page.waitFor(300);
  //await page.screenshot({path: 'output/bayt.png'});
  await page.pdf({
        path: 'output/bayt.pdf'
        , format: 'A4'
        , printBackground: true
        , landscape: true
        , margin: { top: "0", right: "0", bottom: "0", left: "0" }
    });
  console.log("Done.")
  await browser.close();
})();

