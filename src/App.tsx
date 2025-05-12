import React, { useState } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { FileText, Eye } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Milan Technical Company - Invoice Generator
            </h1>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`py-2 px-4 text-sm font-medium rounded-l-lg ${
                  activeTab === 'form'
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } flex items-center gap-2`}
              >
                <FileText size={18} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-4 text-sm font-medium rounded-r-lg ${
                  activeTab === 'preview'
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } flex items-center gap-2`}
              >
                <Eye size={18} />
                Preview
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'form' ? <InvoiceForm /> : <InvoicePreview />}
          </div>
        </main>

        <footer className="bg-white py-4 px-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Milan Technical Company. All rights reserved.
          </div>
        </footer>
      </div>
    </InvoiceProvider>
  );
}

export default App;