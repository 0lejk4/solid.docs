package com.docs.solid


import java.time.LocalDateTime

import akka.http.scaladsl.model.HttpMethods.POST
import akka.http.scaladsl.model.{HttpEntity, HttpRequest, HttpResponse}
import com.docs.solid.JwtUtils.JwtContent
import com.docs.solid.UserModel.{ErrorResponse, LoginRequest, RegisterRequest, TokenResponse, User, UserQuery}
import com.docs.solid.UserServiceComponent.{PasswordNotMatch, UserExists, UserNotFound}

import scala.concurrent.Future
import scala.util.{Failure, Success}

trait UserServiceComponent { self: UserServiceEnvironment
  with HttpClientComponent =>
  val userService: UserService

  class UserService {

    import dc.profile.api._

    def create(user: User): Future[Int] = execute(Users.create(user))

    def upsert(user: User): Future[Option[User]] = execute(Users.save(user))

    def findBy(query: UserQuery): Future[Seq[User]] = execute {
      import query._

      Users.query
        .filterOpt(username)(_.username === _)
        .filterOpt(email)(_.email === _)
        .result
    }

    def deleteBy(query: UserQuery): Future[Int] = execute {
      import query._

      Users.query
        .filterOpt(username)(_.username === _)
        .filterOpt(email)(_.email === _)
        .delete
    }

    def login(request: LoginRequest): Future[Either[ErrorResponse, TokenResponse]] = {
      import request._

      execute(findByUsername(username).headOption).map {


        _.toRight(ErrorResponse(UserNotFound)).flatMap { user =>
          if (user.password == password) Right(TokenResponse(JwtUtils.token(jwtSecret, JwtContent(username))))
          else {
            Left(ErrorResponse(PasswordNotMatch))
          }
        }
      }
    }

    def register(request: RegisterRequest): Future[Either[ErrorResponse, TokenResponse]] = {
      import request._

      val register = for {
        existingUser <- findByUsername(username).headOption if existingUser.isEmpty

        newUser = User(
          username = username,
          password = password,
          email = email,
          creationDate = LocalDateTime.now()
        )

        result <- Users.save(newUser)
      } yield result

      val query = register.asTry.flatMap {
        case Success(_) =>
          val response = TokenResponse(JwtUtils.token(jwtSecret, JwtContent(username)))
          DBIO.successful(Right(response))
        case Failure(_) =>
          val response = ErrorResponse(UserExists)
          DBIO.successful(Left(response))
      }

      for {
        result <- execute(query)
        _ <- if (result.isLeft) Future.unit else onRegisterRequest(username)
      } yield result
    }

    def onRegisterRequest(username: String): Future[HttpResponse] = {
      val request = HttpRequest(
        method = POST,
        uri = s"http://storage:3000/createsubdir?systemToken=$systemToken",
        entity = HttpEntity(s"""{ "username" : "$username" }""")
      )

      httpClient.request(request)
    }

    def execute[T](action: DBIO[T]): Future[T] = {
      dc.db.run(action)
    }

    private def findByUsername(username: String) = {
      Users.query.filter(_.username === username).result
    }
  }

}

object UserServiceComponent {
  val UserNotFound = "error.user.not-found"
  val PasswordNotMatch = "error.password.not-match"
  val UserExists = "error.user.exists"
}
