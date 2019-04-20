package com.docs.solid

import akka.http.scaladsl.model.{HttpRequest, HttpResponse}
import akka.http.scaladsl.{Http, HttpExt}

import scala.concurrent.Future

trait HttpClientComponent {
  val httpClient: HttpClient

  trait HttpClient {
    def request(httpRequest: HttpRequest): Future[HttpResponse]
  }

}

object HttpClientComponent {

  trait AkkaHttpClientComponent extends HttpClientComponent { self: UserServiceEnvironment =>

    class AkkaHttpClient extends HttpClient {
      val http: HttpExt = Http(system)

      override def request(request: HttpRequest): Future[HttpResponse] = http.singleRequest(request)
    }

  }

}
