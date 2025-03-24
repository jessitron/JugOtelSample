# Build stage
FROM maven:3.9-eclipse-temurin-23 AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src
COPY opentelemetry-javaagent.jar ./opentelemetry-javaagent.jar

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:23-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar
# Copy the OpenTelemetry Java Agent from builder stage
COPY --from=builder /app/opentelemetry-javaagent.jar opentelemetry-javaagent.jar

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-javaagent:./opentelemetry-javaagent.jar", "-jar", "./app.jar"]

