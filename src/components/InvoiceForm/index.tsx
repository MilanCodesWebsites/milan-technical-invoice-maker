import React from 'react';
import { ClientInfo } from './ClientInfo';
import { InvoiceDetails } from './InvoiceDetails';
import { ItemsTable } from './ItemsTable';
import { Summary } from './Summary';
import { SignatureSection } from './SignatureSection';
import { DocumentType } from './DocumentType';

export const InvoiceForm: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Settings</h2>
        <DocumentType />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Client Information</h2>
          <ClientInfo />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Details</h2>
          <InvoiceDetails />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
        <ItemsTable />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Signature</h2>
          <SignatureSection />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
          <Summary />
        </div>
      </div>
    </div>
  );
};