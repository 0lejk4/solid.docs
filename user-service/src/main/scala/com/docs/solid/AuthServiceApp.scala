package com.docs.solid

import akka.actor.ActorSystem
import akka.http.scaladsl.server.HttpApp
import scalest.admin.AdminExtension
import scalest.admin.slick.SlickModelAdmin
import slick.basic.DatabaseConfig
import slick.jdbc.H2Profile

import scala.concurrent.ExecutionContext

object AuthServiceApp extends HttpApp
  with AuthServiceComponent
  with AuthServiceApi
  with App {

  val system = ActorSystem()

  override val secret = system.settings.config.getString("jwt.secret")

  implicit val ec: ExecutionContext = system.dispatcher

  implicit val dc: DatabaseConfig[H2Profile] = DatabaseConfig.forConfig[H2Profile]("slick", system.settings.config)

  val authService = new AuthService()

  val admin = new AdminExtension(SlickModelAdmin(Users))

  override protected def routes = admin.route ~ authRoutes

  startServer("0.0.0.0", 9000, system)
}
