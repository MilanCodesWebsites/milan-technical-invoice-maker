import React, { useState } from 'react';
import { useInvoice, InvoiceData } from '../contexts/InvoiceContext';
import { X, Trash2, FolderOpen, Plus, FileText, Search, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'form' | 'preview') => void;
  showToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTab, 
  showToast 
}) => {
  const { history, loadInvoice, deleteInvoice, createNewInvoice } = useInvoice();
  const [filter, setFilter] = useState<'all' | 'invoice' | 'quotation'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history
    .filter(doc => filter === 'all' || doc.type === filter)
    .filter(doc => {
      const query = searchQuery.toLowerCase();
      return (
        doc.invoiceNumber.toLowerCase().includes(query) ||
        doc.clientName.toLowerCase().includes(query) ||
        (doc.clientCompany && doc.clientCompany.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  const handleLoad = (doc: InvoiceData) => {
    loadInvoice(doc);
    onSelectTab('form');
    showToast(`Loaded ${doc.type === 'invoice' ? 'Invoice' : 'Quotation'} ${doc.invoiceNumber}`, 'success');
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, invoiceNumber: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete document ${invoiceNumber}?`)) {
      deleteInvoice(invoiceNumber);
      showToast(`Deleted ${invoiceNumber} from history`, 'info');
    }
  };

  const handleCreateNew = (type: 'invoice' | 'quotation') => {
    createNewInvoice(type);
    onSelectTab('form');
    showToast(`Created new ${type}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Dark Glassmorphic Backdrop Overlay */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
          onClick={onClose}
        ></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          {/* Slide-over panel */}
          <div className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700">
            <div className="flex h-full flex-col bg-white shadow-2xl border-l border-slate-100">
              
              {/* Header */}
              <div className="px-6 py-6 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2" id="slide-over-title">
                    <FileText size={22} className="text-blue-900" />
                    Document History
                  </h2>
                  <button 
                    onClick={onClose}
                    className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 focus:outline-none transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">View and reload your saved invoices and quotations.</p>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-white border-b border-slate-100 space-y-3">
                {/* Create New Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCreateNew('invoice')}
                    className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-md text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-sm gap-1"
                  >
                    <Plus size={14} />
                    New Invoice
                  </button>
                  <button
                    onClick={() => handleCreateNew('quotation')}
                    className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-md text-blue-900 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200/50 gap-1"
                  >
                    <Plus size={14} />
                    New Quote
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by number, client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Filters */}
                <div className="flex rounded-lg p-0.5 bg-slate-100 text-xs">
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 py-1 rounded-md text-center font-medium transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('invoice')}
                    className={`flex-1 py-1 rounded-md text-center font-medium transition-all ${filter === 'invoice' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Invoices
                  </button>
                  <button
                    onClick={() => setFilter('quotation')}
                    className={`flex-1 py-1 rounded-md text-center font-medium transition-all ${filter === 'quotation' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Quotes
                  </button>
                </div>
              </div>

              {/* List Container */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-3">
                {filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-600">No documents found</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                      {searchQuery ? 'Try adjusting your search criteria.' : 'Create an invoice or quotation and save it to history.'}
                    </p>
                  </div>
                ) : (
                  filteredHistory.map((doc) => (
                    <div 
                      key={doc.invoiceNumber}
                      onClick={() => handleLoad(doc)}
                      className="group relative flex flex-col justify-between p-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-200 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              doc.type === 'invoice' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200/30' 
                                : 'bg-purple-100 text-purple-800 border border-purple-200/30'
                            }`}>
                              {doc.type}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {doc.invoiceNumber}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-600 truncate max-w-[200px]">
                            {doc.clientName || doc.clientCompany || 'Unnamed Client'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            {format(new Date(doc.issueDate), 'dd MMM yyyy')}
                          </p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">
                            ₦{doc.total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-xs text-slate-400 group-hover:text-blue-900 transition-colors">
                        <span className="flex items-center gap-1">
                          <FolderOpen size={12} />
                          Click to load
                        </span>
                        
                        <button
                          onClick={(e) => handleDelete(e, doc.invoiceNumber)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all focus:outline-none"
                          title="Delete document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
                Milan Technical Company • Persistent Storage
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
