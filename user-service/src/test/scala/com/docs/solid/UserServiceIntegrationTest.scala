package com.docs.solid

import akka.actor.ActorSystem
import akka.http.scaladsl.model.{HttpResponse, StatusCodes}
import akka.http.scaladsl.testkit.ScalatestRouteTest
import com.docs.solid.JwtUtils.JwtContent
import com.docs.solid.UserModel.{ErrorResponse, LoginRequest, RegisterRequest, TokenResponse, User, UserQuery}
import com.typesafe.config.Config
import scalest.json.CirceJsonSupport
import slick.basic.DatabaseConfig
import slick.jdbc.PostgresProfile

import scala.concurrent.ExecutionContext
import scala.concurrent.Future.successful
import scala.language.postfixOps

class UserServiceIntegrationTest extends RichFunSuite
  with TestAppComponent
  with TestDatabaseContainer
  with ScalatestRouteTest
  with CirceJsonSupport
  with TestHelpers { self =>

  override implicit val patienceConfig: PatienceConfig = PatienceConfig(2 seconds, interval = 100 millis)

  override def createActorSystem(): ActorSystem = ActorSystem(this.getClass.getSimpleName, config)

  var app: TestApp = _


  override protected def afterEach(): Unit = {
    super.afterEach()
    app.userService.deleteBy(UserQuery())
  }

  override def afterStart(): Unit = {
    super.afterStart()

    app = new TestApp {
      implicit val system: ActorSystem = self.system
      implicit val ec: ExecutionContext = system.dispatcher
      implicit val dc: DatabaseConfig[PostgresProfile] = DatabaseConfig.forConfig[PostgresProfile]("slick", self.config)
      val config: Config = system.settings.config
      val jwtSecret: String = config.getString("jwt.secret")
      val systemToken: String = config.getString("systemToken")

      val userService = new UserService()
    }
  }

  test("login success") {
    val user = createTestUser()

    app.userService.create(user).futureValue

    Post("/auth/login", LoginRequest(user.username, user.password)) ~> app.authRoutes ~> check {
      status == StatusCodes.OK
      responseAs[TokenResponse].token shouldBe JwtUtils.token(app.jwtSecret, JwtContent(user.username))
    }
  }

  test("login user don`t exist") {
    val user = createTestUser()

    Post("/auth/login", LoginRequest(user.username, user.password)) ~> app.authRoutes ~> check {
      status == StatusCodes.BadRequest
      responseAs[ErrorResponse].error shouldBe UserServiceComponent.UserNotFound
    }
  }


  test("login password not match") {
    val user = createTestUser()

    app.userService.create(user).futureValue

    Post("/auth/login", LoginRequest(user.username, "incorrect")) ~> app.authRoutes ~> check {
      status == StatusCodes.BadRequest
      responseAs[ErrorResponse].error shouldBe UserServiceComponent.PasswordNotMatch
    }
  }

  test("register success") {
    val req = RegisterRequest("pavel", "kravec", "pavel@kravec.com")

    (app.httpClient.request _).expects(*).once().returning(successful(HttpResponse()))

    Post("/auth/register", req) ~> app.authRoutes ~> check {
      status == StatusCodes.OK
      responseAs[TokenResponse].token shouldBe JwtUtils.token(app.jwtSecret, JwtContent(req.username))
    }

    val query = UserQuery(Some(req.username), Some(req.email))

    val user = app.userService.findBy(query).futureValue.headOption.value

    inside(user) { case User(_, username, _, email, _, _) =>
      username shouldBe req.username
      email shouldBe req.email
    }
  }

  test("register existing user") {
    val existingUser = createTestUser()

    app.userService.create(existingUser).futureValue

    val req = RegisterRequest(existingUser.username, existingUser.password, existingUser.email)

    Post("/auth/register", req) ~> app.authRoutes ~> check {
      status == StatusCodes.BadRequest
      responseAs[ErrorResponse].error shouldBe UserServiceComponent.UserExists
    }
  }
}
