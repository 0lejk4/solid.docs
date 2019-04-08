package com.docs.solid

import akka.http.scaladsl.server.{Directives, Route}
import com.docs.solid.Model.{LoginRequest, RegisterRequest}

trait AuthServiceApi extends Directives { self: AuthServiceComponent =>

  val authRoutes: Route = pathPrefix("auth") {
    pathPrefix("login") {
      pathEndOrSingleSlash {
        entity(as[LoginRequest]) { request =>
          complete(authService.login(request))
        }
      }
    } ~
      pathPrefix("register") {
        pathEndOrSingleSlash {
          entity(as[RegisterRequest]) { request =>
            complete(authService.register(request))
          }
        }
      }
  }
}
