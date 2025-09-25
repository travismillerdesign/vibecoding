const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const thumbnailsDir = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir);
}

app.use(express.static(__dirname));

app.get('/capture-thumbnail', async (req, res) => {
    const sketch = req.query.sketch;
    if (!sketch) {
        return res.status(400).send('Sketch parameter is required.');
    }

    const sketchUrl = `http://localhost:${port}/sketch.html?sketch=${sketch}&source=puppeteer`;
    const thumbnailPath = path.join(thumbnailsDir, `${path.basename(sketch, '.js')}.png`);

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--ignore-gpu-blacklist',
                '--enable-gpu-rasterization',
                '--enable-webgl',
            ],
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 400, height: 300 });
        await page.goto(sketchUrl, { waitUntil: 'networkidle0' });

        await page.waitForSelector('canvas', { timeout: 10000 });
        await new Promise(resolve => setTimeout(resolve, 6000));

        const canvas = await page.$('canvas');
        if (canvas) {
            await canvas.screenshot({ path: thumbnailPath });
            console.log(`Generated thumbnail for ${sketch}`);
            res.send(`Thumbnail generated for ${sketch}`);
        } else {
            throw new Error('Canvas element not found.');
        }

        await browser.close();
    } catch (error) {
        console.error(`Failed to capture thumbnail for ${sketch}:`, error);
        res.status(500).send(`Failed to capture thumbnail for ${sketch}.`);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});