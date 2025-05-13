# Étape de build
FROM gradle:8.14.0-jdk21 as build
WORKDIR /app
COPY . /app
RUN gradle build -x test --no-daemon

# Étape finale pour l'exécution
FROM openjdk:21
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]