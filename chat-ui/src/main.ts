import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { environment } from './environments/envrionment';

const configDefaults = {
  ignoreNetworkEvents: true,
  propagateTraceHeaderCorsUrls: [
    /.+/g, // Regex to match your backend URLs. Update to the domains you wish to include.
  ]
}
const sdk = new HoneycombWebSDK({
  // endpoint: "https://api.eu1.honeycomb.io/v1/traces", // Send to EU instance of Honeycomb. Defaults to sending to US instance.
  debug: true, // Set to false for production environment.
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

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
