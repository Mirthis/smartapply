// Getting pdfjs to work is tricky. The following 3 lines would make it work
// https://stackoverflow.com/a/63486898/7699841
import * as pdfjs from "pdfjs-dist";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import type { TextItem as PdfjsTextItem } from "pdfjs-dist/types/src/display/api";

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker as string;
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.js";

interface ReadPdfReturn {
  text: string[];
  numPages: number;
  textLength: number;
}

export const readPdf = async (fileUrl: string): Promise<ReadPdfReturn> => {
  const pdfFile = await pdfjs.getDocument(fileUrl).promise;
  const text: string[] = [];

  let textLength = 0;

  for (let i = 1; i <= pdfFile.numPages; i++) {
    // Parse each page into text content
    const page = await pdfFile.getPage(i);
    const textContent = await page.getTextContent();

    // Convert Pdfjs TextItem type to new TextItem type
    textContent.items.forEach((item) => {
      const str = (item as PdfjsTextItem).str;
      textLength += str.length;
      text.push(str);
    });
  }

  return { text, numPages: pdfFile.numPages, textLength };
};
