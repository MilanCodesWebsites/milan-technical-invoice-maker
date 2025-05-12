import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Upload } from 'lucide-react';
import { useInvoice } from '../../contexts/InvoiceContext';

export const SignatureSection: React.FC = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [signatureType, setSignatureType] = useState<'draw' | 'upload'>('draw');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      updateInvoiceData({ signature: null });
    }
  };

  const save = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL('image/png');
      updateInvoiceData({ signature: signatureData });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateInvoiceData({ signature: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setSignatureType('draw')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            signatureType === 'draw'
              ? 'bg-blue-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Draw Signature
        </button>
        <button
          type="button"
          onClick={() => setSignatureType('upload')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            signatureType === 'upload'
              ? 'bg-blue-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upload Signature
        </button>
      </div>

      {signatureType === 'draw' ? (
        <div className="space-y-3">
          <div className="border border-gray-300 rounded-md bg-white">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 500,
                height: 150,
                className: 'signature-canvas w-full',
              }}
              onEnd={save}
            />
          </div>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Eraser size={18} className="mr-2" />
            Clear
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <div
            onClick={triggerFileUpload}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
          >
            <Upload size={24} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload signature image</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 2MB</p>
          </div>
          
          {invoiceData.signature && signatureType === 'upload' && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                src={invoiceData.signature} 
                alt="Signature" 
                className="max-h-24 border border-gray-200 rounded-md p-2"
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Dispersed by:</p>
        <p className="font-bold text-gray-800">OKECHUKWU IZUEHIE</p>
        <p className="text-sm text-gray-600">Milan Technical Company</p>
      </div>
    </div>
  );
};