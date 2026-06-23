import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { format } from 'date-fns';

export interface Item {
  id: string;
  quantity: number;
  unit: string;
  description: string;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  type: 'invoice' | 'quotation';
  
  // Client Info
  clientName: string;
  clientCompany: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  clientTitle: string;
  
  // Invoice Details
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  paymentTerms: string;
  
  // Items and Calculations
  items: Item[];
  tax: number;
  taxRate: number;
  subtotal: number;
  total: number;
  
  // Signature
  signature: string | null;

  // Payment Details
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface InvoiceContextType {
  invoiceData: InvoiceData;
  updateInvoiceData: (data: Partial<InvoiceData>) => void;
  addItem: () => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  removeItem: (id: string) => void;
  recalculateTotals: () => void;
  amountInWords: string;
  
  // History Operations
  history: InvoiceData[];
  saveCurrentToHistory: () => void;
  loadInvoice: (invoice: InvoiceData) => void;
  deleteInvoice: (invoiceNumber: string) => void;
  createNewInvoice: (type?: 'invoice' | 'quotation') => void;
  isSaving: boolean;
}

const defaultInvoiceData: InvoiceData = {
  type: 'invoice',
  
  clientName: '',
  clientCompany: '',
  clientAddress: '',
  clientEmail: '',
  clientPhone: '',
  clientTitle: '',
  
  invoiceNumber: `INV-${format(new Date(), 'yyyyMMdd')}-001`,
  issueDate: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  paymentTerms: 'Due on receipt',
  
  items: [
    {
      id: '1',
      quantity: 1,
      unit: 'pc',
      description: '',
      rate: 0,
      amount: 0
    }
  ],
  tax: 0,
  taxRate: 7.5, // Nigeria VAT rate
  subtotal: 0,
  total: 0,
  
  signature: null,

  bankName: '',
  accountName: '',
  accountNumber: ''
};

const generateNextDocumentNumber = (type: 'invoice' | 'quotation', existingHistory: InvoiceData[]): string => {
  const prefix = type === 'invoice' ? 'INV' : 'QUO';
  const todayStr = format(new Date(), 'yyyyMMdd');
  
  // Find all items of the same type generated today
  const todayDocs = existingHistory.filter(doc => 
    doc.type === type && doc.invoiceNumber.startsWith(`${prefix}-${todayStr}-`)
  );
  
  if (todayDocs.length === 0) {
    return `${prefix}-${todayStr}-001`;
  }
  
  // Extract serial numbers
  const serials = todayDocs.map(doc => {
    const parts = doc.invoiceNumber.split('-');
    const serialStr = parts[parts.length - 1];
    return parseInt(serialStr, 10) || 0;
  });
  
  const nextSerial = Math.max(...serials) + 1;
  const paddedSerial = nextSerial.toString().padStart(3, '0');
  
  return `${prefix}-${todayStr}-${paddedSerial}`;
};

const parseInvoiceFromStorage = (doc: any): InvoiceData => {
  return {
    ...doc,
    issueDate: doc.issueDate ? new Date(doc.issueDate) : new Date(),
    dueDate: doc.dueDate ? new Date(doc.dueDate) : new Date(),
    items: doc.items || [],
  };
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<InvoiceData[]>(() => {
    const saved = localStorage.getItem('milan_invoice_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(parseInvoiceFromStorage);
      } catch (e) {
        console.error('Failed to parse history:', e);
        return [];
      }
    }
    return [];
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem('milan_current_invoice_draft');
    if (saved) {
      try {
        return parseInvoiceFromStorage(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse active draft:', e);
        return defaultInvoiceData;
      }
    }
    return defaultInvoiceData;
  });

  const [amountInWords, setAmountInWords] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Auto-save draft on data changes + debounced history save
  useEffect(() => {
    localStorage.setItem('milan_current_invoice_draft', JSON.stringify(invoiceData));
    setIsSaving(true);

    const timer = setTimeout(() => {
      setHistory(prev => {
        const exists = prev.some(item => item.invoiceNumber === invoiceData.invoiceNumber);
        let newHistory;
        if (exists) {
          newHistory = prev.map(item => 
            item.invoiceNumber === invoiceData.invoiceNumber ? invoiceData : item
          );
        } else {
          newHistory = [...prev, invoiceData];
        }
        localStorage.setItem('milan_invoice_history', JSON.stringify(newHistory));
        return newHistory;
      });
      setIsSaving(false);
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [invoiceData]);

  const updateInvoiceData = (data: Partial<InvoiceData>) => {
    setInvoiceData(prev => {
      const updated = { ...prev, ...data };
      
      // If type changes, update invoice number
      if (data.type && data.type !== prev.type) {
        updated.invoiceNumber = generateNextDocumentNumber(data.type, history);
      }
      
      return updated;
    });
    recalculateTotals();
  };

  const addItem = () => {
    const newItem: Item = {
      id: (invoiceData.items.length + 1).toString(),
      quantity: 1,
      unit: 'pc',
      description: '',
      rate: 0,
      amount: 0
    };
    
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setInvoiceData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          
          // Recalculate amount if quantity or rate changed
          if ('quantity' in updates || 'rate' in updates) {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
    
    recalculateTotals();
  };

  const removeItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    
    recalculateTotals();
  };

  const recalculateTotals = () => {
    setInvoiceData(prev => {
      const subtotal = prev.items.reduce((sum, item) => sum + item.amount, 0);
      const tax = (subtotal * prev.taxRate) / 100;
      const total = subtotal + tax;
      
      // Convert amount to words
      const words = convertAmountToWords(total);
      setAmountInWords(words);
      
      return {
        ...prev,
        subtotal,
        tax,
        total
      };
    });
  };

  const convertAmountToWords = (amount: number): string => {
    if (amount === 0) return 'Zero Naira Only';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numToWords = (num: number): string => {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numToWords(num % 100) : '');
      if (num < 1000000) return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numToWords(num % 1000) : '');
      if (num < 1000000000) return numToWords(Math.floor(num / 1000000)) + ' Million' + (num % 1000000 ? ' ' + numToWords(num % 1000000) : '');
      return numToWords(Math.floor(num / 1000000000)) + ' Billion' + (num % 1000000000 ? ' ' + numToWords(num % 1000000000) : '');
    };
    
    const wholePart = Math.floor(amount);
    const decimalPart = Math.round((amount - wholePart) * 100);
    
    let result = numToWords(wholePart) + ' Naira';
    if (decimalPart > 0) {
      result += ' and ' + numToWords(decimalPart) + ' Kobo';
    }
    
    return result + ' Only';
  };

  const saveCurrentToHistory = () => {
    setHistory(prev => {
      const exists = prev.some(item => item.invoiceNumber === invoiceData.invoiceNumber);
      let newHistory;
      if (exists) {
        newHistory = prev.map(item => 
          item.invoiceNumber === invoiceData.invoiceNumber ? invoiceData : item
        );
      } else {
        newHistory = [...prev, invoiceData];
      }
      localStorage.setItem('milan_invoice_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const loadInvoice = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    const words = convertAmountToWords(invoice.total);
    setAmountInWords(words);
  };

  const deleteInvoice = (invoiceNumber: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.invoiceNumber !== invoiceNumber);
      localStorage.setItem('milan_invoice_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const createNewInvoice = (type: 'invoice' | 'quotation' = 'invoice') => {
    setHistory(currentHistory => {
      const nextNumber = generateNextDocumentNumber(type, currentHistory);
      const newDoc: InvoiceData = {
        ...defaultInvoiceData,
        type,
        invoiceNumber: nextNumber,
        issueDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      };
      setInvoiceData(newDoc);
      const words = convertAmountToWords(newDoc.total);
      setAmountInWords(words);
      return currentHistory;
    });
  };

  // Recalculate totals on load/mount
  useEffect(() => {
    recalculateTotals();
  }, []);

  return (
    <InvoiceContext.Provider
      value={{
        invoiceData,
        updateInvoiceData,
        addItem,
        updateItem,
        removeItem,
        recalculateTotals,
        amountInWords,
        history,
        saveCurrentToHistory,
        loadInvoice,
        deleteInvoice,
        createNewInvoice,
        isSaving
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};