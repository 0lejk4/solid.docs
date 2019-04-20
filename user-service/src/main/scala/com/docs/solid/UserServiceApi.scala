package com.docs.solid

import akka.http.scaladsl.server.{Directives, Route}
import com.docs.solid.UserModel._

trait UserServiceApi extends Directives { self: UserServiceComponent =>

  def authRoutes: Route = pathPrefix("auth") {
    pathPrefix("login") {
      pathEndOrSingleSlash {
        entity(as[LoginRequest]) { request =>
          complete(userService.login(request))
        }
      }
    } ~
      pathPrefix("register") {
        pathEndOrSingleSlash {
          entity(as[RegisterRequest]) { request =>
            complete(userService.register(request))
          }
        }
      }
    //Todo: user-api
  }
}
