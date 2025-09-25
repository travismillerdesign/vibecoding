const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const sketches = require('../sketches.json').sketches;

const port = 8080;
const baseUrl = `http://localhost:${port}`;
const thumbnailsDir = path.join(__dirname, '../thumbnails');

if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir);
}

function startServer() {
    const serverProcess = spawn('npx', ['serve', '-l', port.toString()], {
        detached: true,
    });

    return new Promise((resolve, reject) => {
        serverProcess.stdout.on('data', (data) => {
            if (data.toString().includes('Accepting connections')) {
                console.log('Server is ready.');
                resolve(serverProcess);
            }
        });

        serverProcess.on('error', (err) => {
            reject(err);
        });

        setTimeout(() => {
            reject(new Error('Server start timed out'));
        }, 15000);
    });
}

async function createPlaceholder(browser, sketch, thumbnailPath) {
    const placeholderPage = await browser.newPage();
    await placeholderPage.setViewport({ width: 200, height: 150 });
    await placeholderPage.setContent(`
        <div style="width: 200px; height: 150px; background-color: #e0e0e0; display: flex; justify-content: center; align-items: center; text-align: center; font-family: sans-serif; color: #333; border: 1px solid #ccc;">
            <div style="padding: 10px;">
                <strong>Thumbnail Failed</strong>
                <br>
                <span style="font-size: 12px;">${sketch.replace('.js', '').replace(/_/g, ' ')}</span>
            </div>
        </div>
    `);
    await placeholderPage.screenshot({ path: thumbnailPath });
    console.log(`Created placeholder for ${sketch}`);
    await placeholderPage.close();
}

(async () => {
    let server;
    try {
        server = await startServer();

        const browser = await puppeteer.launch({
            headless: true, // Use `true` for better compatibility
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--ignore-gpu-blacklist',
                '--enable-gpu-rasterization',
                '--enable-webgl',
            ],
        });

        for (const sketch of sketches) {
            const thumbnailPath = path.join(thumbnailsDir, `${path.basename(sketch, '.js')}.png`);
            let page;
            try {
                page = await browser.newPage();
                await page.setViewport({ width: 400, height: 300 });
                const url = `${baseUrl}/sketch.html?sketch=${sketch}`;
                await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

                await page.waitForSelector('canvas', { timeout: 10000 });
                await new Promise(resolve => setTimeout(resolve, 2000));

                const canvas = await page.$('canvas');
                if (canvas) {
                    await canvas.screenshot({ path: thumbnailPath });
                    console.log(`Generated thumbnail for ${sketch}`);
                } else {
                    throw new Error('Canvas element not found after page load.');
                }
            } catch (error) {
                console.error(`Could not generate thumbnail for ${sketch}. Reason: ${error.message}`);
                await createPlaceholder(browser, sketch, thumbnailPath);
            } finally {
                if (page && !page.isClosed()) {
                    await page.close();
                }
            }
        }

        await browser.close();
    } catch (error) {
        console.error('An error occurred during thumbnail generation:', error);
        process.exit(1);
    } finally {
        if (server) {
            console.log('Stopping server...');
            try {
                process.kill(-server.pid);
                console.log('Server stopped.');
            } catch (e) {
                // Ignore errors if the process is already gone
            }
        }
    }
})();