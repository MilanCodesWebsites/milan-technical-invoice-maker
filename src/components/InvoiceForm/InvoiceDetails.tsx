import React from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useInvoice } from '../../contexts/InvoiceContext';

export const InvoiceDetails: React.FC = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateInvoiceData({ [name]: value } as any);
  };
  
  const handleDateChange = (field: 'issueDate' | 'dueDate', date: Date) => {
    updateInvoiceData({ [field]: date } as any);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
          {invoiceData.type === 'invoice' ? 'Invoice' : 'Quotation'} Number*
        </label>
        <input
          type="text"
          id="invoiceNumber"
          name="invoiceNumber"
          value={invoiceData.invoiceNumber}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Issue Date*
        </label>
        <DatePicker
          selected={invoiceData.issueDate}
          onChange={(date: Date) => handleDateChange('issueDate', date)}
          dateFormat="dd/MM/yyyy"
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <DatePicker
          selected={invoiceData.dueDate}
          onChange={(date: Date) => handleDateChange('dueDate', date)}
          dateFormat="dd/MM/yyyy"
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
          Payment Terms
        </label>
        <select
          id="paymentTerms"
          name="paymentTerms"
          value={invoiceData.paymentTerms}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Due on receipt">Due on receipt</option>
          <option value="Net 15">Net 15 days</option>
          <option value="Net 30">Net 30 days</option>
          <option value="Net 45">Net 45 days</option>
          <option value="Net 60">Net 60 days</option>
        </select>
      </div>
    </div>
  );
};