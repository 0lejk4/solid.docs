package com.docs.solid

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import pdi.jwt.{JwtAlgorithm, JwtCirce, JwtClaim}

object JwtUtils {

  case class JwtContent(username: String)

  object JwtContent {
    implicit val (e, d) = (deriveEncoder[JwtContent], deriveDecoder[JwtContent])
  }

  def token(secret: String, jwtContent: JwtContent): String = {
    val claim = JwtClaim(content = jwtContent.asJson.noSpaces)

    JwtCirce.encode(claim, secret, JwtAlgorithm.HS256)
  }

}
