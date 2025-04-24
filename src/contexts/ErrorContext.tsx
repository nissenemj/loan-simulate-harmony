
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

interface ErrorContextType {
  error: {
    message: string;
    severity: ErrorSeverity;
    details?: string;
  } | null;
  setError: (error: {
    message: string;
    severity: ErrorSeverity;
    details?: string;
  } | null) => void;
  clearError: () => void;
  captureError: (error: unknown, fallbackMessage?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setErrorState] = useState<{
    message: string;
    severity: ErrorSeverity;
    details?: string;
  } | null>(null);

  const setError = (newError: {
    message: string;
    severity: ErrorSeverity;
    details?: string;
  } | null) => {
    setErrorState(newError);
    
    // Log errors to console in development
    if (newError) {
      console.error(`[${newError.severity.toUpperCase()}] ${newError.message}`, newError.details);
      
      // Show toast for non-fatal errors
      if (newError.severity !== 'fatal') {
        toast[newError.severity === 'error' ? 'error' : 
              newError.severity === 'warning' ? 'warning' : 'info'](
          newError.message
        );
      }
    }
  };

  const clearError = () => {
    setErrorState(null);
  };
  
  // Helper function to capture and format errors
  const captureError = (error: unknown, fallbackMessage = "An unexpected error occurred") => {
    let message = fallbackMessage;
    let details = undefined;
    
    if (error instanceof Error) {
      message = error.message;
      details = error.stack;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      message = String(error);
      details = JSON.stringify(error, null, 2);
    }
    
    setError({
      message,
      severity: 'error',
      details
    });
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError, captureError }}>
      {children}
      {error && error.severity === 'fatal' && (
        <div className="fixed inset-0 bg-destructive/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-xl max-w-lg border border-destructive">
            <h2 className="text-xl font-bold text-destructive mb-4">Application Error</h2>
            <p className="mb-4">{error.message}</p>
            {error.details && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Details:</p>
                <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-40">
                  {error.details}
                </pre>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                onClick={clearError}
              >
                Dismiss
              </button>
              <button
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                onClick={() => window.location.reload()}
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}
