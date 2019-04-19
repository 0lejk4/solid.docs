package com.docs.solid

import akka.actor.ActorSystem
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.testkit.ScalatestRouteTest
import com.docs.solid.JwtUtils.JwtContent
import com.docs.solid.UserModel.{LoginRequest, TokenResponse}
import com.typesafe.config.Config
import scalest.json.CirceJsonSupport
import slick.basic.DatabaseConfig
import slick.jdbc.PostgresProfile

import scala.concurrent.ExecutionContext
import scala.language.postfixOps

class UserServiceIntegrationTest extends RichFunSuite
  with TestDatabaseContainer
  with ScalatestRouteTest
  with CirceJsonSupport
  with TestHelpers { self =>

  override implicit val patienceConfig: PatienceConfig = PatienceConfig(2 seconds, interval = 100 millis)

  override def createActorSystem(): ActorSystem = ActorSystem(this.getClass.getSimpleName, config)

  var app: TestApp = _

  override def afterStart(): Unit = {
    super.afterStart()

    app = new TestApp {
      implicit val system: ActorSystem = self.system
      implicit val ec: ExecutionContext = system.dispatcher
      implicit val dc: DatabaseConfig[PostgresProfile] = DatabaseConfig.forConfig[PostgresProfile]("slick", self.config)
      val config: Config = system.settings.config
      val jwtSecret = config.getString("jwt.secret")
      val systemToken = config.getString("systemToken")

      val userService = new UserService()

      userService.createTable().futureValue
    }
  }

  test("login success") {
    val user = createTestUser(id = Some(0))

    app.userService.create(user).futureValue

    Post("/auth/login", LoginRequest(user.username, user.password)) ~> app.authRoutes ~> check {
      status == StatusCodes.OK
      responseAs[TokenResponse].token shouldBe JwtUtils.token(app.jwtSecret, JwtContent(user.username))
    }
  }
}
