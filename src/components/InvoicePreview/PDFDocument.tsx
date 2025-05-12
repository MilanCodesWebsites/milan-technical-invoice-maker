import React from 'react';
import { format } from 'date-fns';
import { useInvoice } from '../../contexts/InvoiceContext';
import { MapPin, Mail, Phone } from 'lucide-react';

export const PDFDocument: React.FC = () => {
  const { invoiceData, amountInWords } = useInvoice();
  
  return (
    <div id="pdf-content" className="text-gray-800 font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">MILAN TECHNICAL COMPANY</h1>
            <div className="flex items-center gap-2 text-sm mt-1">
              <MapPin size={16} className="text-gray-600" />
              <p>121 Aba Road, Port Harcourt, Nigeria</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} className="text-gray-600" />
              <p>milantechnical@yahoo.co.uk</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-gray-600" />
              <p>+234 803 309 9465</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase">
              {invoiceData.type === 'invoice' ? 'INVOICE' : 'QUOTATION'}
            </h2>
            <p className="text-sm"><strong>No:</strong> {invoiceData.invoiceNumber}</p>
            <p className="text-sm"><strong>Date:</strong> {format(invoiceData.issueDate, 'dd/MM/yyyy')}</p>
            {invoiceData.type === 'invoice' && (
              <p className="text-sm"><strong>Due Date:</strong> {format(invoiceData.dueDate, 'dd/MM/yyyy')}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Client Info */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">To:</h3>
        <p className="font-medium">{invoiceData.clientTitle || ''}</p>
        <p className="font-bold">{invoiceData.clientName}</p>
        {invoiceData.clientCompany && <p>{invoiceData.clientCompany}</p>}
        <p>{invoiceData.clientAddress}</p>
        {invoiceData.clientEmail && <p>Email: {invoiceData.clientEmail}</p>}
        {invoiceData.clientPhone && <p>Phone: {invoiceData.clientPhone}</p>}
      </div>
      
      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">S/N</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">QTY</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">UNIT</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">DESCRIPTION</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm">RATE (₦)</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm">AMOUNT (₦)</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{item.unit}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{item.description}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-right">
                  {item.rate.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-right font-medium">
                  {item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="border border-gray-300 px-4 py-2"></td>
              <td className="border border-gray-300 px-4 py-2 text-right font-medium">Subtotal</td>
              <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                {invoiceData.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            {invoiceData.taxRate > 0 && (
              <tr>
                <td colSpan={4} className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                  Tax ({invoiceData.taxRate}%)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                  {invoiceData.tax.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            )}
            <tr className="bg-gray-100">
              <td colSpan={4} className="border border-gray-300 px-4 py-2"></td>
              <td className="border border-gray-300 px-4 py-2 text-right font-bold">Total</td>
              <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                {invoiceData.total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Amount in Words */}
      <div className="mb-8 border-t border-b border-gray-300 py-4">
        <p><strong>AMOUNT IN WORDS:</strong> {amountInWords}</p>
      </div>
      
      {/* Payment Terms */}
      {invoiceData.type === 'invoice' && (
        <div className="mb-8">
          <h3 className="text-md font-semibold mb-2">Payment Terms:</h3>
          <p>{invoiceData.paymentTerms}</p>
        </div>
      )}
      
      {/* Footer / Signature */}
      <div className="mt-12 flex justify-end">
        <div className="text-right">
          <p>Dispersed by:</p>
          {invoiceData.signature ? (
            <div className="mb-2 mt-1 flex justify-end">
              <img 
                src={invoiceData.signature} 
                alt="Signature" 
                className="max-h-20"
              />
            </div>
          ) : (
            <div className="h-16 mb-2"></div>
          )}
          <p className="font-bold">OKECHUKWU IZUEHIE</p>
          <p>Milan Technical Company</p>
        </div>
      </div>
    </div>
  );
};