'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { openApiDocument } from './document';

// import SwaggerUI from 'swagger-ui-react';
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

import 'swagger-ui-react/swagger-ui.css';
import './swagger.css';

export default function ReactSwagger({ spec = openApiDocument, ...props }: React.ComponentProps<typeof SwaggerUI>) {
  return (
    <React.Suspense>
      <section className="min-h-[100dvh]">
        <SwaggerUI {...props} spec={spec} />
      </section>
    </React.Suspense>
  );
}
