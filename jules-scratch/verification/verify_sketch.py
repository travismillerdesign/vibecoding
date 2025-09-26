from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/sketch.html?sketch=colorful_distorted_mesh")
        # Wait for the canvas to be rendered, which can take a moment for WebGL sketches
        page.wait_for_selector('canvas', timeout=10000)
        # Add an extra delay to ensure the sketch is fully drawn
        page.wait_for_timeout(2000)
        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

if __name__ == "__main__":
    run()