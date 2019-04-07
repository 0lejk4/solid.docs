package com.docs.solid

import scalest.json.{CirceJsonSupport, `E&D`}

object Model extends CirceJsonSupport {

  case class User(id: Option[Int] = None,
                  username: String,
                  password: String)

  object User {
    def tupled = (User.apply _).tupled

    implicit val ed: `E&D`[User] = circeObject
  }

  case class LoginRequest(username: String, password: String)

  object LoginRequest {
    implicit val ed: `E&D`[LoginRequest] = circeObject
  }

  case class RegisterRequest(username: String, password: String)

  object RegisterRequest {
    implicit val ed: `E&D`[RegisterRequest] = circeObject
  }

  case class ErrorResponse(error: String)

  object ErrorResponse {
    implicit val ed: `E&D`[ErrorResponse] = circeObject
  }

  case class SuccessResponse(info: String)

  object SuccessResponse {
    implicit val ed: `E&D`[SuccessResponse] = circeObject
  }

}
