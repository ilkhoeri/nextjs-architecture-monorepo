'use client';
import { HttpErrorProps } from './lib';
import { ErrorBlockBody, ErrorBlockHead } from './block';
import { useEffect } from 'react';

import './error.css';

export function ErrorMessages({ error, reset }: HttpErrorProps) {
  const isDev = process.env.NODE_ENV !== 'production';

  function printError(error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error('Non-standard error:', error);
    }
  }

  useEffect(() => {
    // Log the error to an error reporting service
    if (isDev) printError(error);
  }, [isDev, error]);

  if (!error) return null;

  return (
    <div data-error-dialog-root="">
      <ErrorBlockHead error={error} />

      <div className="error-overlay-dialog-container">
        <div className="overflow-y-auto h-full">
          <ErrorBlockBody error={error} reset={reset} />
        </div>
      </div>
    </div>
  );
}
