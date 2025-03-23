# Build stage
FROM maven:3.9-eclipse-temurin-23 AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:23-jdk-alpine

# Set working directory
WORKDIR /app

ENV HONEYCOMB_API_KEY=${HONEYCOMB_API_KEY}
# Copy the JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]

