# p5.js Sketch Showcase

This project is a showcase for p5.js sketches, featuring an automated system for generating thumbnails.

## Features

- **Dynamic Sketch Loading:** The gallery on the main page is generated from the `sketches.json` file.
- **Automatic Thumbnail Generation:** Thumbnails for all sketches are automatically generated when you install dependencies (`npm install`) or when you start the application (`npm start`).
- **Grid Layout:** Sketches are displayed in a responsive grid layout, with thumbnails and titles.
- **Error Handling:** If a thumbnail fails to generate for a sketch, a placeholder image will be created automatically.

## Getting Started

To get started with this project, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd p5-sketch-showcase
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    This will also automatically generate the thumbnails for the existing sketches.

3.  **Start the application:**
    ```bash
    npm start
    ```
    This will start a local web server, and you can view the sketch gallery at `http://localhost:8080`.

## Adding a New Sketch

To add a new sketch to the showcase, follow these steps:

1.  **Create your sketch file:**
    -   Add your new p5.js sketch file (e.g., `my_new_sketch.js`) to the `sketches/` directory.

2.  **Update the sketches list:**
    -   Open `sketches.json` and add the filename of your new sketch to the `sketches` array.

    ```json
    {
        "sketches": [
            "test_sketch.js",
            "gradient_ripple.js",
            "my_new_sketch.js"
        ]
    }
    ```

3.  **Generate thumbnails:**
    -   The thumbnails will be generated automatically the next time you run `npm start`. Alternatively, you can generate them manually by running:
    ```bash
    npm run generate-thumbnails
    ```

Your new sketch will now appear in the gallery on the main page.