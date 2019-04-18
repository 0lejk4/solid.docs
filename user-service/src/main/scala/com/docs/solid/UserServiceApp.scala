package com.docs.solid

import akka.actor.ActorSystem
import akka.http.scaladsl.server.HttpApp
import scalest.admin.AdminExtension
import scalest.admin.slick.SlickModelAdmin
import slick.basic.DatabaseConfig
import slick.jdbc.PostgresProfile
import UserModel._

import scala.concurrent.ExecutionContext

object UserServiceApp extends HttpApp
  with UserServiceComponent
  with UserServiceApi
  with App {

  val system = ActorSystem()

  override val secret = system.settings.config.getString("jwt.secret")

  implicit val ec: ExecutionContext = system.dispatcher

  implicit val dc: DatabaseConfig[PostgresProfile] = DatabaseConfig.forConfig[PostgresProfile]("slick", system.settings.config)

  val authService = new AuthService()

  val admin = AdminExtension(SlickModelAdmin(Users))

  override protected def routes = admin.route ~ authRoutes

  startServer("0.0.0.0", system.settings.config.getInt("http.port"), system)
}
