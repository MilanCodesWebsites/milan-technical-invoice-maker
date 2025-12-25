import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { InvoiceData } from '../contexts/InvoiceContext';

export const generatePDF = async (invoiceData: InvoiceData) => {
  const element = document.getElementById('pdf-content');
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null, // Transparent to show letterhead
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 297;
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

    const docType = invoiceData.type === 'invoice' ? 'Invoice' : 'Quotation';
    const dateStr = format(invoiceData.issueDate, 'yyyyMMdd');
    const filename = `${docType}_${invoiceData.invoiceNumber}_${dateStr}.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  }
};