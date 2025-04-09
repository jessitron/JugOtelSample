# Build stage
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables from build arguments
ARG NG_APP_COMMERCE_ENDPOINT
ARG NG_APP_CHAT_ENDPOINT
ARG NG_APP_OTLP_ENDPOINT
ARG COMMERCE_ENDPOINT
ARG CHAT_ENDPOINT
ARG OTLP_ENDPOINT

# Debug: Print the environment variables
RUN echo "Commerce Endpoint: $NG_APP_COMMERCE_ENDPOINT" && \
    echo "Chat Endpoint: $NG_APP_CHAT_ENDPOINT" && \
    echo "OTLP Endpoint: $NG_APP_OTLP_ENDPOINT" && \
    echo "Commerce Endpoint: $COMMERCE_ENDPOINT" && \
    echo "Chat Endpoint: $CHAT_ENDPOINT" && \
    echo "OTLP Endpoint: $OTLP_ENDPOINT"

RUN NG_APP_OTLP_ENDPOINT=${NG_APP_OTLP_ENDPOINT} \
    NG_APP_COMMERCE_ENDPOINT=${NG_APP_COMMERCE_ENDPOINT} \
    NG_APP_CHAT_ENDPOINT=${NG_APP_CHAT_ENDPOINT} \
    npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy the built app to nginx html directory
COPY --from=builder /app/dist/ecommerce-app/browser /usr/share/nginx/html

# Copy and configure nginx
COPY nginx.conf /etc/nginx/nginx.conf.template

# Add envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Expose port 80
EXPOSE 80

# Start nginx with environment variable substitution
CMD ["/bin/sh", "-c", "envsubst '${COMMERCE_ENDPOINT} ${CHAT_ENDPOINT} ${OTLP_ENDPOINT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"] 