FROM hseeberger/scala-sbt

WORKDIR /app

COPY project /app/project

COPY build.sbt /app/build.sbt

RUN sbt update

COPY . /app

RUN sbt assembly

ADD ./target/scala-2.12/user-service.jar /app/user_service.jar

ENTRYPOINT ["java", "-jar", "\/app\/user_service.jar"]