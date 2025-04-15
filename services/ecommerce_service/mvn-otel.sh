#!/bin/bash
export OTEL_SERVICE_NAME=ecommerce-service
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
export OTEL_EXPORTER_OTLP_HEADERS=x-honeycomb-team=${HONEYCOMB_API_KEY}
export POSTGRES_HOST=localhost
export POSTGRES_DB=ordersdb
export POSTGRES_USER=orders
export POSTGRES_PASSWORD=orderspass
export POSTGRES_PORT=5432

mvn -P otel "$@"
