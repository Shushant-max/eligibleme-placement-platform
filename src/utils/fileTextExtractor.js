import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker safely
try {
  if (typeof window !== 'undefined' && pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

/**
 * Extract plain text from an ArrayBuffer of a PDF
 * Uses PDF.js with fallback to raw stream text extraction.
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<string>}
 */
export async function extractTextFromPdf(arrayBuffer) {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    if (fullText.trim().length > 20) {
      return fullText;
    }
  } catch (err) {
    console.warn('[extractTextFromPdf] PDF.js extraction notice, trying fallback reader:', err);
  }

  // Fallback string extraction from PDF binary stream
  try {
    const uint8 = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const raw = decoder.decode(uint8);
    // Find text inside parentheses in PDF text operators (e.g., (text) Tj)
    const matches = raw.match(/\(([^()]+)\)\s*T[jJ]/g);
    if (matches && matches.length > 0) {
      return matches.map(m => m.replace(/^\(/, '').replace(/\)\s*T[jJ]$/, '')).join(' ');
    }
  } catch (fallbackErr) {
    console.warn('Fallback PDF extraction error:', fallbackErr);
  }

  throw new Error('Unable to parse text from the uploaded PDF. You can also paste your resume text directly.');
}

/**
 * Extract text from an uploaded File object
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file) {
  if (!file) throw new Error('No file provided.');

  const fileName = file.name.toLowerCase();

  // Plain text, Markdown, JSON
  if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.json') || fileName.endsWith('.rtf')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read text file.'));
      reader.readAsText(file);
    });
  }

  // PDF files
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    return await extractTextFromPdf(arrayBuffer);
  }

  // Fallback read as text for any other formats
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file contents.'));
    reader.readAsText(file);
  });
}
