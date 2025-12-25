import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const installed = localStorage.getItem('milan-invoice-installed');
    if (installed === 'true') {
      setIsInstalled(true);
      return;
    }

    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      localStorage.setItem('milan-invoice-installed', 'true');
      return;
    }

    // Check if user dismissed the prompt before
    const dismissed = localStorage.getItem('milan-invoice-prompt-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      // Show again after 7 days
      const daysDiff = Math.floor((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Only show on desktop or tablet (screen width >= 768px)
      if (window.innerWidth >= 768) {
        // Delay showing the prompt for better UX
        setTimeout(() => {
          setShowPrompt(true);
        }, 2000);
      }
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('milan-invoice-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      localStorage.setItem('milan-invoice-installed', 'true');
    }
    
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('milan-invoice-prompt-dismissed', new Date().toISOString());
  };

  // Don't render if installed or no prompt to show
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <img 
              src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/032f5adf-90be-4e53-a1a5-48afccb076f3-Screenshot%202025-12-24%20234944.png"
              alt="Milan Technical"
              className="w-12 h-12 rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              Install Milan Invoice
            </h3>
            <p className="text-gray-600 text-xs mt-1">
              Install the app for quick access and offline use. Create invoices anytime!
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white text-xs font-medium rounded-md hover:bg-blue-800 transition-colors"
              >
                <Download size={14} />
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
