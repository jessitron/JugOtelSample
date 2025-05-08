# GSUG Spring OTEL Demo - April 2025

This is a basic Java/Spring application server and React frontend running a full-stack application, instrumented with OpenTelemetry, and the Honeycomb Web SDK.

## Tech stack

- Spring-based Spring Data JPA database
- Migrations provided via Flyway
- Spring Web Controllers
- Frontend is a Vite React application
- Docker is used (with Docker Compose) to set up the backend of the application
- The frontend (currently) is running in development mode to facilitate rapid development

## Running the application

- copy `.env-sample` to `.env`
- Create a Honeycomb free account and set your `HONEYCOMB_API_KEY` in the `.env` file
- Run `docker compose up` to boot the backend services, which are:
  - Postgres database (localhost port 5432)
  - Spring application server (localhost port 8081)
  - OpenTelemetry Collector (localhost port 4318)
- In another window run `cd ecommerce-react-app; npm install` and then start the frontend with `npm run dev`
- Browse to `http://localhost:5173`
