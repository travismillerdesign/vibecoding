const chromium = require('chrome-aws-lambda');
const path = require('path');
const fs = require('fs');

// Vercel's writable directory
const anonyPath = `/tmp/thumbnails`;

// Ensure the directory exists
if (!fs.existsSync(anonyPath)) {
    fs.mkdirSync(anonyPath, { recursive: true });
}

module.exports = async (req, res) => {
    const { sketch } = req.query;
    if (!sketch) {
        return res.status(400).send('Sketch parameter is required.');
    }

    // Construct the URL to the sketch
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = req.headers.host;
    const sketchUrl = `${protocol}://${host}/sketch.html?sketch=${sketch}&source=puppeteer`;
    const thumbnailPath = path.join(anonyPath, `${path.basename(sketch, '.js')}.png`);

    let browser = null;
    try {
        browser = await chromium.puppeteer.launch({
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 400, height: 300 });
        await page.goto(sketchUrl, { waitUntil: 'networkidle0' });

        await page.waitForSelector('canvas', { timeout: 10000 });
        await new Promise(resolve => setTimeout(resolve, 6000));

        const canvas = await page.$('canvas');
        if (canvas) {
            await canvas.screenshot({ path: thumbnailPath });

            // Read the file and send it back in the response
            const imageBuffer = fs.readFileSync(thumbnailPath);
            res.setHeader('Content-Type', 'image/png');
            res.status(200).send(imageBuffer);

            // Clean up the temp file
            fs.unlinkSync(thumbnailPath);
        } else {
            throw new Error('Canvas element not found.');
        }
    } catch (error) {
        console.error(`Failed to capture thumbnail for ${sketch}:`, error);
        return res.status(500).send(`Failed to capture thumbnail for ${sketch}.`);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};