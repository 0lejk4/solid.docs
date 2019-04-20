package com.docs.solid

import java.time.LocalDateTime

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import akka.testkit.TestKit
import com.dimafeng.testcontainers.{ForAllTestContainer, PostgreSQLContainer}
import com.docs.solid.HttpClientComponent.AkkaHttpClientComponent
import com.docs.solid.UserModel._
import com.typesafe.config.{Config, ConfigFactory}
import org.flywaydb.core.Flyway
import org.scalamock.scalatest.MockFactory
import org.scalatest.concurrent.{Eventually, ScalaFutures}
import org.scalatest.time.SpanSugar
import org.scalatest.{BeforeAndAfterAll, Suite, _}
import scalest.admin.AdminExtension
import scalest.admin.slick.SlickModelAdmin

import scala.concurrent.duration._

sealed trait GenericTest extends Suite
  with Informing
  with Matchers
  with Inside
  with Eventually
  with ScalaFutures
  with GivenWhenThen
  with BeforeAndAfterAll
  with BeforeAndAfterEach
  with SpanSugar
  with OptionValues

trait RichFunSuite extends FunSuiteLike with GenericTest with MockFactory

trait TestHelpers {
  def createTestUser(id: Option[Int] = None,
                     username: String = "Pavel",
                     password: String = "Kravec",
                     email: String = "pavel@kravec.com",
                     creationDate: LocalDateTime = LocalDateTime.now(),
                     modificationDate: Option[LocalDateTime] = None): User = {
    User(
      id = id,
      username = username,
      password = password,
      email = email,
      creationDate = creationDate,
      modificationDate = modificationDate
    )
  }
}

trait TestDatabaseContainer extends ForAllTestContainer { self: TestSuite =>
  val system: ActorSystem
  var config: Config = _

  override val container = PostgreSQLContainer("postgres:9.6.9")

  override def afterStart(): Unit = {
    import container._

    config = ConfigFactory.parseString {
      s"""
         |slick.db.url = "$jdbcUrl"
         |slick.db.user = "$username"
         |slick.db.password = "$password"
      """.stripMargin
    }.withFallback(system.settings.config)

    Flyway.configure()
      .dataSource(jdbcUrl, username, password)
      .load()
      .migrate()
  }
}


trait TestActorSystem extends BeforeAndAfterAll { self: Suite =>

  implicit val system: ActorSystem = ActorSystem(s"${this.getClass.getSimpleName}System")
  val config: Config = system.settings.config

  implicit val mat: ActorMaterializer = ActorMaterializer()

  override protected def afterAll(): Unit = {
    println("TestActorSystem.afterAll()")
    TestKit.shutdownActorSystem(system, 30 seconds, verifySystemShutdown = true)
    super.afterAll()
  }
}


trait TestAppComponent { self: MockFactory =>

  trait TestApp extends UserServiceEnvironment
    with UserServiceComponent
    with AkkaHttpClientComponent
    with UserServiceApi {

    val httpClient: HttpClient = mock[HttpClient]

    def admin = AdminExtension(SlickModelAdmin(Users))

    def routes = admin.route ~ authRoutes
  }

}