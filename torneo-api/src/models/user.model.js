import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../bd/config.js'

const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class UserModel {
  static async getByName ( { name } ) {
    try {
      const [user] = await connection.query(
        'SELECT * FROM usuario WHERE name = ?;', [name] )

      if ( user.length === 0 ) return false
      return user[0]
    } catch ( error ) {
      console.log( error )
      throw new Error( 'Error  finding email' )
    }
  }

  static async getById ( { id } ) {
    try {
      const [user] = await connection.query(
        'SELECT * FROM usuario WHERE id_usuario = ?;', [id] )

      if ( user.length === 0 ) return false
      return user[0]
    } catch ( error ) {
      console.log( error )
      throw new Error( 'Error  finding user' )
    }
  }

  static async create ( { input } ) {
    console.log( input )
    const {
      name,
      password
    } = input

    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO usuario (name, contrasenia)
          VALUES ( ?, ?);`,
        [name, password]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
      console.log( insertId, response )
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating user' )
    }

    if ( insertId !== null ) {
      const [user] = await connection.query(
        `SELECT *
        FROM usuario WHERE id_usuario = ?;`, [insertId]
      )

      if ( user.length > 0 ) {
        return user[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'User not found' ) // Si no se encuentra ningún torneo
      }
    } else {
      throw new Error( 'Error inserting user' ) // Si insertId es null
    }
  }

  static async update ( { id, input } ) {
    const { password } = input

    try {
      const [response] = await connection.query(
        'UPDATE usuario SET contrasenia = ? WHERE id_usuario = ?;',
        [password, id]
      )
      console.log( response )
      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'User update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error user tournament: ' )
    }
  }

  static async delete ( { id } ) {
    try {
      const [response] = await connection.query( 'DELETE FROM usuario WHERE id_usuario = ?;', [id] )

      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'user not found or already deleted' )
      }
    } catch ( e ) {
      throw new Error( 'Error deleting tournament: ' )
    }
  }
}
