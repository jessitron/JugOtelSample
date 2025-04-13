#!/bin/bash
export OTEL_SERVICE_NAME=maven-build
export OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io:443
export OTEL_EXPORTER_OTLP_HEADERS=x-honeycomb-team=${HONEYCOMB_API_KEY}
mvn -P otel "$@"
