import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { environment } from './environments/envrionment';
import { ZoneContextManager } from '@opentelemetry/context-zone-peer-dep';

const configDefaults = {
  ignoreNetworkEvents: true,
  propagateTraceHeaderCorsUrls: [
    /.+/g, // Regex to match your backend URLs. Update to the domains you wish to include.
  ]
}
const sdk = new HoneycombWebSDK({
  debug: true, // Set to false for production environment.
  contextManager: new ZoneContextManager(),
  apiKey: environment.honeycombApiKey,
  serviceName: 'angular-frontend',
  instrumentations: [getWebAutoInstrumentations({
    // Loads custom configuration for xml-http-request instrumentation.
    '@opentelemetry/instrumentation-xml-http-request': configDefaults,
    '@opentelemetry/instrumentation-fetch': configDefaults,
    '@opentelemetry/instrumentation-document-load': configDefaults,
    '@opentelemetry/instrumentation-user-interaction': {enabled: true}
  })],
  // resourceAttributes: { // Data in this object is applied to every trace emitted.
  //   "user.id": user.id, // Specific to your app.
  //   "user.role": user.role, // Specific to your app.
  // },
});
sdk.start();

// Application instantiation code
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));
