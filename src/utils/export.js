import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

export function exportAsTxt(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, `${filename}.txt`)
}

export function exportAsMd(html, filename) {
  // Simple HTML to markdown
  const md = html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<[^>]+>/g, '')
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  saveAs(blob, `${filename}.md`)
}

export function exportAsHtml(html, filename) {
  const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${filename}</title></head><body>${html}</body></html>`
  const blob = new Blob([full], { type: 'text/html;charset=utf-8' })
  saveAs(blob, `${filename}.html`)
}

export function exportAsPdf(text, filename) {
  const doc = new jsPDF()
  const lines = doc.splitTextToSize(text, 180)
  doc.text(lines, 15, 15)
  doc.save(`${filename}.pdf`)
}

export async function exportAsDocx(text, filename) {
  const paragraphs = text.split('\n').filter(Boolean).map(
    line => new Paragraph({ children: [new TextRun(line)] })
  )
  const doc = new Document({ sections: [{ children: paragraphs }] })
  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${filename}.docx`)
}

export function exportAsEpub(title, author, text, filename) {
  // Basic ePub as zip — for a full implementation a dedicated library is needed
  const content = `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${title}</title></head><body><p>${text.replace(/\n/g, '</p><p>')}</p></body></html>`
  const blob = new Blob([content], { type: 'application/xhtml+xml' })
  saveAs(blob, `${filename}.xhtml`)
}
