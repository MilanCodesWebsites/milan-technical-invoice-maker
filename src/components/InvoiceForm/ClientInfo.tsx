import React from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';

export const ClientInfo: React.FC = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateInvoiceData({ [name]: value } as any);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col">
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name*
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={invoiceData.clientName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter client name"
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="clientTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Client Title
          </label>
          <input
            type="text"
            id="clientTitle"
            name="clientTitle"
            value={invoiceData.clientTitle}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. The Procurement Manager"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="clientCompany" className="block text-sm font-medium text-gray-700 mb-1">
            Client Company
          </label>
          <input
            type="text"
            id="clientCompany"
            name="clientCompany"
            value={invoiceData.clientCompany}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter company name"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="clientAddress"
            name="clientAddress"
            value={invoiceData.clientAddress}
            onChange={handleChange}
            rows={2}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter client address"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              value={invoiceData.clientEmail}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="client@example.com"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              value={invoiceData.clientPhone}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+234 XXX XXX XXXX"
            />
          </div>
        </div>
      </div>
    </div>
  );
};