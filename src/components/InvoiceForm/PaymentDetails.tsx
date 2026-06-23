import React from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';

export const PaymentDetails: React.FC = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateInvoiceData({ [name]: value } as any);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
          Bank Name
        </label>
        <input
          type="text"
          id="bankName"
          name="bankName"
          value={invoiceData.bankName || ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="e.g. Access Bank"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
          Account Name
        </label>
        <input
          type="text"
          id="accountName"
          name="accountName"
          value={invoiceData.accountName || ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="e.g. Milan Technical Company"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Account Number
        </label>
        <input
          type="text"
          id="accountNumber"
          name="accountNumber"
          value={invoiceData.accountNumber || ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="e.g. 0123456789"
        />
      </div>
    </div>
  );
};
