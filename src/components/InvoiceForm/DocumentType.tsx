import React from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';
import { FileText, FileCheck } from 'lucide-react';

export const DocumentType: React.FC = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="inline-flex items-center">
        <label className="text-sm font-medium text-gray-700 w-32">Document Type:</label>
        <div className="flex items-center space-x-4">
          <div 
            className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
              invoiceData.type === 'invoice' 
                ? 'bg-blue-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => updateInvoiceData({ type: 'invoice' })}
          >
            <FileText size={20} />
            <span>Invoice</span>
          </div>
          
          <div 
            className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
              invoiceData.type === 'quotation' 
                ? 'bg-blue-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => updateInvoiceData({ type: 'quotation' })}
          >
            <FileCheck size={20} />
            <span>Quotation</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-32">Currency:</label>
        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
          ₦ (Naira)
        </div>
      </div>
    </div>
  );
};