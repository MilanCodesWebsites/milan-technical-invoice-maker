import React from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';

export const Summary: React.FC = () => {
  const { invoiceData, updateInvoiceData, amountInWords } = useInvoice();
  
  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const taxRate = parseFloat(e.target.value) || 0;
    updateInvoiceData({ taxRate });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between py-2 border-b">
        <span className="font-medium text-gray-700">Subtotal:</span>
        <span className="font-medium">
          ₦ {invoiceData.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className="flex items-center justify-between py-2 border-b">
        <div className="flex items-center">
          <span className="font-medium text-gray-700 mr-2">Tax (%):</span>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={invoiceData.taxRate}
            onChange={handleTaxRateChange}
            className="w-16 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <span className="font-medium">
          ₦ {invoiceData.tax.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className="flex justify-between py-2 border-b">
        <span className="text-lg font-semibold text-gray-800">Total:</span>
        <span className="text-lg font-semibold text-blue-900">
          ₦ {invoiceData.total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className="pt-2">
        <span className="block text-sm font-medium text-gray-700 mb-1">Amount in Words:</span>
        <div className="p-3 bg-gray-50 rounded-md text-gray-700 text-sm">
          {amountInWords}
        </div>
      </div>
    </div>
  );
};