# Sticker PDF Generator 📄✨

This project generates a printable PDF with sticker-style images laid out on A4 pages.  
It reads image files from a folder, resizes them, and places them in a grid format—perfect for organizing or printing collectible stickers.

##  🛠️ Features

    - Automatically reads `.png`, `.jpg`, and `.jpeg` images from the `input/` folder.
    - Arranges them into rows of 5 stickers each.
    - Automatically starts a new page when space runs out.
    - Outputs a high-quality PDF ready for printing.

##  🧪 Requirements

    - Node.js (v16 or higher recommended)
    - npm or yarn

##  📦 Installation

    ```bash
    npm install
    ```

##  🚀 Usage
    1. Put your images into the input/ folder.
    2. Run the script:

    ```bash
    node index.js
    ```

    3. The resulting PDF will appear in the output/ folder as stickers.pdf.

##  🧹 Notes
    - Images are resized to fit uniformly (110x150 points).
    - Each image is repeated 5 times per row.
    - Designed for A4 paper layout.

##  📜 License
MIT License

Made with ❤️ by GomezWare using pdfkit and sharp.
