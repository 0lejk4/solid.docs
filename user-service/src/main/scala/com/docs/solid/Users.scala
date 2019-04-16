package com.docs.solid

import com.docs.solid.Model.User
import scalest.admin.admin.H2ProfileProvider
import scalest.admin.slick.EntityActions

object Users extends EntityActions with H2ProfileProvider {

  import jdbcProfile.api._

  type Id = Int
  type Model = User
  type EntityTable = UsersTable

  override val idData = IdData(_.id, _.copy(_))

  val query = TableQuery[UsersTable]

  class UsersTable(tag: Tag) extends Table[User](tag, "users") with Identified {

    val id = column[Int]("id", O.AutoInc, O.PrimaryKey)

    val username = column[String]("username")

    val password = column[String]("passwrod")

    override def * = (id.?, username, password).mapTo[User]
  }

}
