package com.docs.solid

import java.time.LocalDateTime

import io.circe.syntax._
import scalest.admin.FieldTypeSchema
import scalest.json.{CirceJsonSupport, `E&D`}

object UserModel extends CirceJsonSupport {

  case class User(id: Option[Int] = None,
                  username: String,
                  password: String,
                  email: String,
                  creationDate: LocalDateTime,
                  modificationDate: Option[LocalDateTime] = None)

  object User {
    def tupled = (User.apply _).tupled

    implicit val ed: `E&D`[User] = circeObject
  }

  case class LoginRequest(username: String, password: String)

  object LoginRequest {
    implicit val ed: `E&D`[LoginRequest] = circeObject
  }

  case class RegisterRequest(username: String, password: String, email: String)

  object RegisterRequest {
    implicit val ed: `E&D`[RegisterRequest] = circeObject
  }

  case class ErrorResponse(error: String)

  object ErrorResponse {
    implicit val ed: `E&D`[ErrorResponse] = circeObject
  }

  case class TokenResponse(token: String)

  object TokenResponse {
    implicit val ed: `E&D`[TokenResponse] = circeObject
  }

  implicit val date: FieldTypeSchema[LocalDateTime] = FieldTypeSchema(Some("string-input"), Some("string-output"), Some("".asJson))

}
