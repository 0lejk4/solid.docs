FROM hseeberger/scala-sbt

WORKDIR /app

COPY . /app

RUN sbt assembly

ADD ./target/scala-2.12/user-service.jar /app/user_service.jar

ENTRYPOINT ["java", "-jar", "\/app\/user_service.jar"]