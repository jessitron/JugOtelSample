// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

console.dir(window.location);
import {HoneycombWebSDK} from "@honeycombio/opentelemetry-web";
import {getWebAutoInstrumentations} from "@opentelemetry/auto-instrumentations-web";
import {ZoneContextManager} from "@opentelemetry/context-zone";
import {RandomIdGenerator} from '@opentelemetry/sdk-trace-base';

const configDefaults = {
  ignoreNetworkEvents: true,
  propagateTraceHeaderCorsUrls: [ /^(.+)$/ ]
}

const OTEL_ENDPOINT = import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT;

// for session id generation - keep this for duration of spa
const generator = new RandomIdGenerator();
// re-use the traceId generator, a useful uuid
export const sessionId = generator.generateTraceId();
// HACK hold this in session storage so our context can access it
sessionStorage.setItem('session.id', sessionId);

export function initialize() {
  try {
    // doesn't specify SDK endpoint, defaults to us v1/traces endpoint
    const sdk = new HoneycombWebSDK({
      contextManager: new ZoneContextManager(),
      endpoint: OTEL_ENDPOINT,
      serviceName: 'ecommerce-react-app',
      skipOptionsValidation: true,
      instrumentations: [
        getWebAutoInstrumentations({
          // Loads custom configuration for xml-http-request instrumentation.
          '@opentelemetry/instrumentation-xml-http-request': configDefaults,
          '@opentelemetry/instrumentation-fetch': configDefaults,
          '@opentelemetry/instrumentation-document-load': configDefaults,
          '@opentelemetry/instrumentation-user-interaction': {enabled: true}
        })
      ],
      // Feature added in 0.15.0 of the HoneycombWebSDK - allows
      // control of the session id generation. ours will live as
      // a variable
      sessionProvider: {
        getSessionId: () => sessionId
      }
    });
    sdk.start();
    console.log("Frontend tracer is configured and running.");
    console.log("Session ID is", sessionId)
  } catch (e) {
    // report and continue on
    console.log('startup failed for HoneycombWebSDK. No telemetry is exported.')
    console.error(e);
  }
}
