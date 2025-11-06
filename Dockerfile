# ====== Stage 1: Build the application ======
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies (caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ====== Stage 2: Run the application ======
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy the built jar from previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port your app runs on
EXPOSE 8080

# Set environment variables for MySQL (Render will inject these)
ENV DB_URL=jdbc:mysql://sql12.freesqldatabase.com:3306/sql12806015
ENV DB_USERNAME=sql12806015
ENV DB_PASSWORD=JSGguTRxcf

# Start the application
ENTRYPOINT ["java","-jar","app.jar"]
