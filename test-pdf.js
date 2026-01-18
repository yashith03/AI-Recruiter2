//test-pdf.js

const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium-min');

async function test() {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent('<h1>Hello World</h1>');
    const pdf = await page.pdf({ format: 'A4' });
    console.log('PDF generated, size:', pdf.length);
    await browser.close();
  } catch (e) {
    console.error('Test failed:', e);
  }
}

test();
