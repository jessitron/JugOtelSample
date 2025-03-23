#!/bin/bash

# TODO - get env vars from here into Docker build/runtime
# obviously don't bake honeycom api key into the image
source ../../.env
echo $HONEYCOMB_API_KEY
export OTEL_EXPORTER_OTLP_ENDPOINT="https://api.honeycomb.io:443"
export OTEL_EXPORTER_OTLP_HEADERS="x-honeycomb-team=${HONEYCOMB_API_KEY}"
export OTEL_SERVICE_NAME="chat-service"
export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
mvn package
java -javaagent:./opentelemetry-javaagent.jar -jar ./target/chat-service-0.0.1-SNAPSHOT.jar
