// lib/HoneycombProvider.tsx
'use client';

import { useEffect } from 'react';
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { RandomIdGenerator } from '@opentelemetry/sdk-trace-base';
import { ReactRouterSpanProcessor } from './ReactRouterSpanProcessor';
import { createBrowserRouter } from 'react-router-dom';

const configDefaults = {
  ignoreNetworkEvents: true,
  propagateTraceHeaderCorsUrls: [/^(.+)$/],
};

const generator = new RandomIdGenerator();
export const sessionId = generator.generateTraceId();
sessionStorage.setItem('session.id', sessionId);

interface HoneycombProviderProps {
  router: ReturnType<typeof createBrowserRouter>;
}

export function HoneycombProvider({ router }: HoneycombProviderProps) {
  useEffect(() => {
    try {
      const sdk = new HoneycombWebSDK({
        contextManager: new ZoneContextManager(),
        endpoint: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
        serviceName: 'ecommerce-react-app',
        skipOptionsValidation: true,
        instrumentations: [
          getWebAutoInstrumentations({
            '@opentelemetry/instrumentation-xml-http-request': configDefaults,
            '@opentelemetry/instrumentation-fetch': configDefaults,
            '@opentelemetry/instrumentation-document-load': configDefaults,
            '@opentelemetry/instrumentation-user-interaction': { enabled: true },
          }),
        ],
        sessionProvider: {
          getSessionId: () => sessionId,
        },
        spanProcessors: [new ReactRouterSpanProcessor({ router })],
      });

      // Inject our custom React Router span processor

      sdk.start();
      console.log('Frontend tracer is configured and running.');
    } catch (e) {
      console.error('Honeycomb SDK failed to start', e);
    }
  }, [router]);

  return null;
}