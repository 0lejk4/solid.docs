package com.docs.solid


import java.time.LocalDateTime

import akka.http.scaladsl.model.HttpMethods.POST
import akka.http.scaladsl.model.{HttpEntity, HttpRequest}
import akka.http.scaladsl.{Http, HttpExt}
import com.docs.solid.JwtUtils.JwtContent
import com.docs.solid.UserModel.{ErrorResponse, LoginRequest, RegisterRequest, TokenResponse, User, UserQueryFilter}

import scala.concurrent.Future
import scala.util.{Failure, Success}

trait UserServiceComponent { self: UserServiceEnvironment =>
  val userService: UserService

  class UserService {

    import dc.profile.api._

    val http: HttpExt = Http(system)

    def createTable(): Future[Unit] = execute(Users.query.schema.createIfNotExists)

    def create(user: User): Future[Int] = execute(Users.create(user))

    def upsert(user: User): Future[Option[User]] = execute(Users.save(user))

    def findBy(userQuery: UserQueryFilter): Future[Seq[User]] = execute {
      import userQuery._

      Users.query
        .filterOpt(username)(_.username === _)
        .filterOpt(email)(_.email === _)
        .result
    }

    def deleteBy(userQuery: UserQueryFilter): Future[Int] = execute {
      import userQuery._

      Users.query
        .filterOpt(username)(_.username === _)
        .filterOpt(email)(_.email === _)
        .delete
    }

    def login(request: LoginRequest): Future[Either[ErrorResponse, TokenResponse]] = {
      import request._

      execute(findByUsername(username).headOption).map {
        _.toRight(ErrorResponse("error.user.not-found")).flatMap { user =>
          if (user.password == password) Right(TokenResponse(JwtUtils.token(jwtSecret, JwtContent(username))))
          else Left(ErrorResponse("error.password.not-match"))
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
          val response = ErrorResponse("error.user.exists")
          DBIO.successful(Left(response))
      }

      for {
        result <- execute(query)
        _ <- onRegisterRequest(username)
      } yield result
    }

    private def onRegisterRequest(username: String) = {
      val request = HttpRequest(
        method = POST,
        uri = s"http://storage/createsubdir?systemToken=$systemToken",
        entity = HttpEntity(s"{ username : $username }")
      )

      http.singleRequest(request)
    }

    def execute[T](action: DBIO[T]): Future[T] = {
      dc.db.run(action)
    }

    def findByUsername(username: String) = {
      Users.query.filter(_.username === username).result
    }
  }


}
