import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { PDFDocument } from './PDFDocument';
import { useInvoice } from '../../contexts/InvoiceContext';
import { generatePDF } from '../../utils/pdfGenerator';

export const InvoicePreview: React.FC = () => {
  const { invoiceData } = useInvoice();
  
  const handleGeneratePDF = () => {
    generatePDF(invoiceData);
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {invoiceData.type === 'invoice' ? 'Invoice' : 'Quotation'} Preview
        </h2>
        
        <button
          onClick={handleGeneratePDF}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download size={18} className="mr-2" />
          Download PDF
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="max-w-4xl mx-auto p-8">
          <PDFDocument />
        </div>
      </div>
    </div>
  );
};