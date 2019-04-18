package com.docs.solid

import java.time.LocalDateTime

import com.docs.solid.UserModel.User
import scalest.admin.slick.JdbcProfileProvider.PostgresProfileProvider
import scalest.admin.slick.SlickModel

object Users extends SlickModel with PostgresProfileProvider {

  import jdbcProfile.api._

  type Id = Int
  type Model = User
  type ModelTable = UsersTable

  override val idData = IdData(_.id, _.copy(_))

  val query = TableQuery[UsersTable]

  class UsersTable(tag: Tag) extends SlickModelTable(tag, "users") {

    val id = column[Int]("id", O.AutoInc, O.PrimaryKey)

    val username = column[String]("username")

    val password = column[String]("password")

    val email = column[String]("email")

    val creationDate = column[LocalDateTime]("creation_date")

    val modificationDate = column[Option[LocalDateTime]]("modification_date")

    override def * = (id.?, username, password, email, creationDate, modificationDate).mapTo[User]
  }

}
