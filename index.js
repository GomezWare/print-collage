import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

// Get current file and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input and output paths
const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_FILE = path.join(__dirname, 'output', 'stickers.pdf');

// A4 size in points
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

// Layout settings
const MARGIN = 20;
const STICKER_WIDTH = 110;
const STICKER_HEIGHT = 150;
const SPACE_X = 5;
const SPACE_Y = 5;

const IMAGES_PER_ROW = 5;

const generatePDF = async () => {
  try {
    // Read and filter image files from input directory
    const files = (await fs.readdir(INPUT_DIR))
      .filter(f => /\.(png|jpe?g)$/i.test(f))
      .sort();

    if (files.length === 0) {
      console.warn('⚠️ No images found in the "input" folder.');
      return;
    }

    // Ensure the output directory exists
    await fs.ensureDir(path.dirname(OUTPUT_FILE));

    // Create a new PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    doc.pipe(fs.createWriteStream(OUTPUT_FILE));

    let x = MARGIN;
    let y = MARGIN;

    for (const file of files) {
      const inputPath = path.join(INPUT_DIR, file);

      try {
        // Resize the image to a higher resolution and convert to PNG buffer
        const buffer = await sharp(inputPath)
          .resize({
            width: STICKER_WIDTH * 3, // Resize to higher resolution for better quality
            height: STICKER_HEIGHT * 3,
            fit: 'cover',
            position: 'center'
          })
          .png()
          .toBuffer();

        // Repeat the same image 5 times per row
        for (let i = 0; i < IMAGES_PER_ROW; i++) {
          doc.image(buffer, x, y, {
            width: STICKER_WIDTH,
            height: STICKER_HEIGHT
          });

          x += STICKER_WIDTH + SPACE_X;

          // Move to the next row after placing 5 images
          if (i === IMAGES_PER_ROW - 1) {
            x = MARGIN;
            y += STICKER_HEIGHT + SPACE_Y;

            // Add new page if vertical space is exceeded
            if (y + STICKER_HEIGHT > A4_HEIGHT - MARGIN) {
              doc.addPage();
              x = MARGIN;
              y = MARGIN;
            }
          }
        }
      } catch (imgErr) {
        console.error(`❌ Error processing "${file}":`, imgErr.message);
      }
    }

    doc.end();
    console.log(`✅ PDF successfully generated at: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('💥 General error while generating the PDF:', err.message);
  }
};

generatePDF();
