FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY opentelemetry-javaagent.jar .

EXPOSE 8081

# Default logging level is INFO
ENV OTEL_LOGS_EXPORTER=none

ENTRYPOINT ["sh", "-c", "java -javaagent:opentelemetry-javaagent.jar  -jar app.jar"] 