package com.docs.solid

import akka.actor.ActorSystem
import com.typesafe.config.Config
import slick.basic.DatabaseConfig
import slick.jdbc.PostgresProfile

import scala.concurrent.ExecutionContext

trait UserServiceEnvironment {
  implicit val system: ActorSystem
  implicit val ec: ExecutionContext
  implicit val dc: DatabaseConfig[PostgresProfile]
  val config: Config
  val jwtSecret: String
  val systemToken: String
}
