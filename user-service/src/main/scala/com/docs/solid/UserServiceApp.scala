package com.docs.solid

import akka.actor.ActorSystem
import akka.http.scaladsl.server.HttpApp
import com.docs.solid.HttpClientComponent.AkkaHttpClientComponent
import com.docs.solid.UserModel._
import com.typesafe.config.Config
import scalest.admin.AdminExtension
import scalest.admin.slick.SlickModelAdmin
import slick.basic.DatabaseConfig
import slick.jdbc.PostgresProfile

import scala.concurrent.ExecutionContext

object UserServiceApp extends HttpApp
  with UserServiceComponent
  with UserServiceApi
  with UserServiceEnvironment
  with AkkaHttpClientComponent
  with App {

  implicit val system: ActorSystem = ActorSystem()
  val config: Config = system.settings.config
  implicit val ec: ExecutionContext = system.dispatcher
  implicit val dc: DatabaseConfig[PostgresProfile] = DatabaseConfig.forConfig[PostgresProfile]("slick", config)
  val jwtSecret = config.getString("jwt.secret")
  val systemToken = config.getString("systemToken")

  println(config)

  val httpClient = new AkkaHttpClient

  val userService = new UserService()

  val admin = AdminExtension(SlickModelAdmin(Users))

  override protected def routes = admin.route ~ authRoutes

  startServer("0.0.0.0", config.getInt("http.port"), system)
}
