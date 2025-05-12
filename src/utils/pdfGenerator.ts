import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { InvoiceData } from '../contexts/InvoiceContext';

export const generatePDF = async (invoiceData: InvoiceData) => {
  // Get the HTML element to be converted to PDF
  const element = document.getElementById('pdf-content');
  if (!element) return;

  // Add some space to avoid cutting off content
  const originalPadding = element.style.padding;
  element.style.padding = '10px';

  try {
    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable loading of images from other domains
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Revert padding to original
    element.style.padding = originalPadding;

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions to maintain aspect ratio
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm (210mm)
    const pageHeight = 297; // A4 height in mm (297mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename based on invoice/quotation number and date
    const docType = invoiceData.type === 'invoice' ? 'Invoice' : 'Quotation';
    const dateStr = format(invoiceData.issueDate, 'yyyyMMdd');
    const filename = `${docType}_${invoiceData.invoiceNumber}_${dateStr}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  }
};