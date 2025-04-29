
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { ErrorProvider } from '@/contexts/ErrorContext';

export function AppRoutes() {
  return (
    <ErrorProvider>
      <RouterProvider router={router} />
    </ErrorProvider>
  );
}
