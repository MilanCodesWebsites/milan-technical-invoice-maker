import React, { createContext, useState, useContext, ReactNode } from 'react';
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
}

interface InvoiceContextType {
  invoiceData: InvoiceData;
  updateInvoiceData: (data: Partial<InvoiceData>) => void;
  addItem: () => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  removeItem: (id: string) => void;
  recalculateTotals: () => void;
  amountInWords: string;
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
  
  signature: null
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);
  const [amountInWords, setAmountInWords] = useState<string>('');

  const updateInvoiceData = (data: Partial<InvoiceData>) => {
    setInvoiceData(prev => {
      const updated = { ...prev, ...data };
      
      // If type changes, update invoice number
      if (data.type && data.type !== prev.type) {
        const prefix = data.type === 'invoice' ? 'INV' : 'QUO';
        updated.invoiceNumber = `${prefix}-${format(new Date(), 'yyyyMMdd')}-001`;
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

  return (
    <InvoiceContext.Provider
      value={{
        invoiceData,
        updateInvoiceData,
        addItem,
        updateItem,
        removeItem,
        recalculateTotals,
        amountInWords
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