import React from 'react';
import { format } from 'date-fns';
import { useInvoice } from '../../contexts/InvoiceContext';

export const PDFDocument: React.FC = () => {
  const { invoiceData, amountInWords } = useInvoice();
  
  return (
    <div 
      id="pdf-content" 
      className="text-gray-800 font-['DM_Sans',sans-serif] relative bg-white"
      style={{
        backgroundImage: 'url(/letterhead.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Content container with padding to avoid header and footer */}
      <div 
        style={{
          paddingTop: '100px',    // Space for header
          paddingBottom: '140px', // Space for footer
          paddingLeft: '40px',
          paddingRight: '40px',
        }}
      >
        {/* Invoice/Quotation Header */}
        <div className="mb-6">
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase text-blue-900">
              {invoiceData.type === 'invoice' ? 'INVOICE' : 'QUOTATION'}
            </h2>
            <p className="text-sm"><strong>No:</strong> {invoiceData.invoiceNumber}</p>
            <p className="text-sm"><strong>Date:</strong> {format(invoiceData.issueDate, 'dd/MM/yyyy')}</p>
            {invoiceData.type === 'invoice' && (
              <p className="text-sm"><strong>Due Date:</strong> {format(invoiceData.dueDate, 'dd/MM/yyyy')}</p>
            )}
          </div>
        </div>
        
        {/* Client Info */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-1">To:</h3>
          {invoiceData.clientTitle && <p className="font-medium">{invoiceData.clientTitle}</p>}
          <p className="font-bold">{invoiceData.clientName}</p>
          {invoiceData.clientCompany && <p>{invoiceData.clientCompany}</p>}
          <p>{invoiceData.clientAddress}</p>
          {invoiceData.clientEmail && <p>Email: {invoiceData.clientEmail}</p>}
          {invoiceData.clientPhone && <p>Phone: {invoiceData.clientPhone}</p>}
        </div>
        
        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border border-gray-300 px-2 py-2 text-left">S/N</th>
                <th className="border border-gray-300 px-2 py-2 text-left">QTY</th>
                <th className="border border-gray-300 px-2 py-2 text-left">UNIT</th>
                <th className="border border-gray-300 px-2 py-2 text-left">DESCRIPTION</th>
                <th className="border border-gray-300 px-2 py-2 text-right">RATE (₦)</th>
                <th className="border border-gray-300 px-2 py-2 text-right">AMOUNT (₦)</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.quantity}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.unit}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.description}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    {item.rate.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                    {item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="border border-gray-300 px-2 py-1"></td>
                <td className="border border-gray-300 px-2 py-1 text-right font-medium">Subtotal</td>
                <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                  {invoiceData.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              {invoiceData.taxRate > 0 && (
                <tr>
                  <td colSpan={4} className="border border-gray-300 px-2 py-1"></td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                    VAT ({invoiceData.taxRate}%)
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                    {invoiceData.tax.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
              <tr className="bg-blue-900 text-white">
                <td colSpan={4} className="border border-gray-300 px-2 py-1"></td>
                <td className="border border-gray-300 px-2 py-1 text-right font-bold">Total</td>
                <td className="border border-gray-300 px-2 py-1 text-right font-bold">
                  ₦{invoiceData.total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Amount in Words */}
        <div className="mb-6 border-t border-b border-gray-300 py-2">
          <p className="text-sm"><strong>AMOUNT IN WORDS:</strong> {amountInWords}</p>
        </div>
        
        {/* Payment Terms */}
        {invoiceData.type === 'invoice' && invoiceData.paymentTerms && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-1">Payment Terms:</h3>
            <p className="text-sm">{invoiceData.paymentTerms}</p>
          </div>
        )}
        
        {/* Signature Section */}
        <div className="mt-8">
          <p className="text-sm">Thanks,</p>
          {invoiceData.signature ? (
            <div className="my-1">
              <img 
                src={invoiceData.signature} 
                alt="Signature" 
                className="max-h-16"
              />
            </div>
          ) : (
            <div className="h-12 my-1 border-b border-dotted border-gray-400 w-48"></div>
          )}
          <p className="font-bold text-sm text-blue-900">OKECHUKWU IZUEHIE</p>
          <p className="text-sm italic text-red-600">Milan Technical Company</p>
        </div>
      </div>
    </div>
  );
};