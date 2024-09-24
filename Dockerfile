# Base image olarak daha yeni bir Java sürümü (Java 19) kullanılıyor
FROM openjdk:19-jdk-alpine

# Uygulama JAR dosyasını ekle
COPY target/todoApp-0.0.1-SNAPSHOT.jar todo-app.jar

# Uygulamanın başlatılacağı komut
ENTRYPOINT ["java", "-jar", "/todo-app.jar"]