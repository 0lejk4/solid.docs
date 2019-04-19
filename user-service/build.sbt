
lazy val scalestV: String = "0.0.2-SNAPSHOT"

resolvers += Resolver.sonatypeRepo("snapshots")

name := "user-service"

version := "0.0.1"

scalaVersion := "2.12.8"

scalacOptions += "-Ypartial-unification"

assemblyJarName in assembly := "user-service.jar"

test in assembly := {}

libraryDependencies ++= Seq(
  "io.github.0lejk4" %% "scalest-core" % scalestV, // core,
  "io.github.0lejk4" %% "scalest-admin-slick" % scalestV, // slick concrete admin panel
  "org.postgresql" % "postgresql" % "42.2.5",
  "com.pauldijou" %% "jwt-core" % "2.1.0",
  "com.pauldijou" %% "jwt-circe" % "2.1.0",
  "org.scalatest" %% "scalatest" % "3.0.5" % "test",
  "com.dimafeng" %% "testcontainers-scala" % "0.24.0" % Test,
  "org.testcontainers" % "postgresql" % "1.11.2" % Test,
  "com.typesafe.akka" %% "akka-testkit" % "2.5.20" % Test,
  "com.typesafe.akka" %% "akka-stream-testkit" % "2.5.20" % Test,
  "com.typesafe.akka" %% "akka-http-testkit" % "10.1.7" % Test
)