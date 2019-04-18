lazy val scalestV: String = "0.0.2-SNAPSHOT"

resolvers += Resolver.sonatypeRepo("snapshots")

name := "user-service"

version := "0.0.1"

scalaVersion := "2.12.8"

scalacOptions += "-Ypartial-unification"

libraryDependencies ++= Seq(
  "io.github.0lejk4" %% "scalest-core" % scalestV, // core,
  "io.github.0lejk4" %% "scalest-admin-slick" % scalestV, // slick concrete admin panel
  "org.postgresql" % "postgresql" % "42.2.5",
  "com.pauldijou" %% "jwt-core" % "2.1.0",
  "com.pauldijou" %% "jwt-circe" % "2.1.0"
  )