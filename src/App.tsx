import React, { useState, useEffect } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceProvider, useInvoice } from './contexts/InvoiceContext';
import { InstallPrompt } from './components/InstallPrompt';
import { HistoryPanel } from './components/HistoryPanel';
import { FileText, Eye, History, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

function MainApp() {
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  
  const { invoiceData, isSaving } = useInvoice();

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Milan Technical Company - Invoice Generator
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`py-2 px-4 text-xs font-semibold rounded-l-lg border border-gray-200 transition-colors ${
                  activeTab === 'form'
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } flex items-center gap-2`}
              >
                <FileText size={16} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-4 text-xs font-semibold rounded-r-lg border border-l-0 border-gray-200 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } flex items-center gap-2`}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Dynamic Auto-save Indicator */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 text-[11px] font-semibold text-slate-500 border border-slate-100 transition-all select-none">
                {isSaving ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>Saved</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="inline-flex items-center gap-2 py-2 px-3 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Open history panel"
              >
                <History size={16} className="text-slate-500" />
                History
              </button>
            </div>
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
      
      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* History Slide-over Drawer */}
      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelectTab={setActiveTab}
        showToast={showToast}
      />

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-slideIn">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl text-white text-xs font-semibold transition-all duration-300 border ${
            toast.type === 'success' 
              ? 'bg-emerald-600 border-emerald-500 shadow-emerald-600/10' 
              : toast.type === 'error' 
                ? 'bg-rose-600 border-rose-500 shadow-rose-600/10' 
                : 'bg-blue-600 border-blue-500 shadow-blue-600/10'
          }`}>
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'info' && <Info size={16} />}
            {toast.type === 'error' && <AlertTriangle size={16} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <InvoiceProvider>
      <MainApp />
    </InvoiceProvider>
  );
}

export default App;