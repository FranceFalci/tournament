import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../bd/config.js'

const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class TournamentModel {
  static async getAll () {
    try {
      const [tournaments] = await connection.query( 'SELECT * FROM torneo' )
      return tournaments
    } catch ( error ) {
      console.log( error )
      throw new Error( 'chau' )
    }// 'SELECT id, name FROM genre WHERE LOWER(name) = ?;')
  }

  static async getById ( { id } ) {
    const [torunament] = await connection.query(
      'SELECT * FROM torneo WHERE id_torneo = ?;', [id] )

    if ( torunament.length === 0 ) return null

    return torunament[0]
  }

  static async create ( { input } ) {
    const {
      name,
      phone,
      instagram,
      photoUrl,
      idUser
    } = input

    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO torneo (nombre, celular, instagram, foto_url,id_usuario)
          VALUES ( ?, ?, ?, ?,?);`,
        [name, phone, instagram, photoUrl, idUser]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
      console.log( insertId, response )
    } catch ( e ) {
      console.log( e.message )
      if ( e.code === 'ER_DUP_ENTRY' ) throw new Error( 'Can not create more than one tournament' )
      throw new Error( 'Error creating tournament' )
      // enviar la traza a un servicio interno
    }

    if ( insertId !== null ) {
      const [tournaments] = await connection.query(
        `SELECT *
        FROM torneo WHERE id_torneo = ?;`, [insertId]
      )

      if ( tournaments.length > 0 ) {
        return tournaments[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'Tournament not found' )
      }
    } else {
      throw new Error( 'Error inserting tournament' )
    }
  }

  static async update ( { id, input } ) {
    const { name, phone, instagram, photoUrl } = input

    try {
      const [response] = await connection.query(
        `UPDATE torneo SET nombre = IFNULL(?, nombre),celular = IFNULL(?, celular),
        instagram = IFNULL(?, instagram), foto_url = IFNULL(?, foto_url) WHERE id_torneo = ?;`,
        [name, phone, instagram, photoUrl, id]
      )
      if ( response && response.affectedRows > 0 ) {
        const [updatedTournament] = await connection.query(
          'SELECT * FROM torneo WHERE id_torneo = ?;',
          [id]
        )

        if ( updatedTournament.length > 0 ) {
          return updatedTournament[0]
        } else {
          throw new Error( 'Updated tournament not found' )
        }
      } else {
        throw new Error( 'Tournament update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating tournament: ' )
    }
  }

  static async delete ( { id } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM torneo WHERE id_torneo = ?;',
        [id]
      )

      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'Tournament not found or already deleted' )
      }
    } catch ( e ) {
      throw new Error( 'Error deleting tournament: ' + e.message )
    }
  }
}
