package com.docs.solid


import com.docs.solid.Model.{ErrorResponse, LoginRequest, RegisterRequest, SuccessResponse, User}
import slick.basic.DatabaseConfig
import slick.jdbc.H2Profile

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

//Todo: JWT token and encyption methods
trait AuthServiceComponent {
  val authService: AuthService

  val secret: String
  val dc: DatabaseConfig[H2Profile]
  implicit val ec: ExecutionContext

  import dc.profile.api._

  class AuthService {

    def register(request: RegisterRequest): Future[Either[ErrorResponse, SuccessResponse]] = {
      import request._

      val register = for {
        user <- findByUsername(username).headOption if user.isEmpty
        result <- Users.save(User(username = username, password = password))
      } yield result

      val query = register.asTry.flatMap {
        case Success(_) => DBIO.successful(Right(SuccessResponse("info.register.success")))
        case Failure(_) => DBIO.successful(Left(ErrorResponse("error.user.exists")))
      }

      dc.db.run(query)
    }

    def login(request: LoginRequest): Future[Either[ErrorResponse, String]] = {
      import request._

      val userQuery = for {
        user <- findByUsername(username).head
      } yield user

      val query = userQuery.asTry.flatMap {
        case Success(u) => DBIO.successful {
          if (u.password == password) Right("user.token")
          else Left(ErrorResponse("error.password.not-match"))
        }
        case Failure(_) => DBIO.successful(Left(ErrorResponse("error.user.not-found")))
      }

      dc.db.run(query)
    }
  }

  private def findByUsername(username: String) = {
    Users.query.filter(_.username === username).result
  }
}
