import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_FILE = path.join(__dirname, 'output', 'estampitas.pdf');

// Tamaño A4 en puntos
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

// Ajustes de layout
const MARGIN = 20;
const STAMP_WIDTH = 110;
const STAMP_HEIGHT = 150;
const SPACE_X = 5;
const SPACE_Y = 5;

const IMAGES_PER_ROW = 5;

const generatePDF = async () => {
  try {
    const files = (await fs.readdir(INPUT_DIR))
      .filter(f => /\.(png|jpe?g)$/i.test(f))
      .sort();

    if (files.length === 0) {
      console.warn('⚠️ No hay imágenes en la carpeta "input".');
      return;
    }

    await fs.ensureDir(path.dirname(OUTPUT_FILE));
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    doc.pipe(fs.createWriteStream(OUTPUT_FILE));

    let x = MARGIN;
    let y = MARGIN;

    for (const file of files) {
      const inputPath = path.join(INPUT_DIR, file);

      try {
        // Genera la imagen una sola vez y reutiliza el buffer
        const buffer = await sharp(inputPath)
          .resize({
            width: STAMP_WIDTH * 3, // Generamos en más resolución para mantener calidad
            height: STAMP_HEIGHT * 3,
            fit: 'cover',
            position: 'center'
          })
          .png()
          .toBuffer();

        // Repite la misma imagen 5 veces por fila
        for (let i = 0; i < 5; i++) {
          doc.image(buffer, x, y, {
            width: STAMP_WIDTH,
            height: STAMP_HEIGHT
          });

          x += STAMP_WIDTH + SPACE_X;

          if (i === 4) {
            x = MARGIN;
            y += STAMP_HEIGHT + SPACE_Y;

            if (y + STAMP_HEIGHT > A4_HEIGHT - MARGIN) {
              doc.addPage();
              x = MARGIN;
              y = MARGIN;
            }
          }
        }
      } catch (imgErr) {
        console.error(`❌ Error procesando "${file}":`, imgErr.message);
      }
    }

    doc.end();
    console.log(`✅ PDF generado con éxito en: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('💥 Error general al generar el PDF:', err.message);
  }
};

generatePDF();