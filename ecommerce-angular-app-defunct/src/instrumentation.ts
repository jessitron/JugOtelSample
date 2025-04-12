import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ZoneContextManager } from '@opentelemetry/context-zone-peer-dep';

const configDefaults = {
  ignoreNetworkEvents: true,
  propagateTraceHeaderCorsUrls: [
    /.+/g, // Regex to match your backend URLs. Update to the domains you wish to include.
  ]
};

const otelEndpoint = import.meta.env.NG_APP_OTLP_ENDPOINT;
if (!otelEndpoint) {
  throw new Error('NG_APP_OTLP_ENDPOINT is not set');
} else {

  const sdk = new HoneycombWebSDK({
    debug: true, // Set to false for production environment.
    contextManager: new ZoneContextManager(),
    endpoint: otelEndpoint,
    globalErrorsInstrumentationConfig:  {
      enabled: false,
    },
    serviceName: 'ecommerce-app',
    instrumentations: [getWebAutoInstrumentations({
      // Loads custom configuration for xml-http-request instrumentation.
      '@opentelemetry/instrumentation-xml-http-request': configDefaults,
      '@opentelemetry/instrumentation-fetch': configDefaults,
      '@opentelemetry/instrumentation-document-load': configDefaults,
      '@opentelemetry/instrumentation-user-interaction': {enabled: true}
    })],
  });

  sdk.start(); 
}