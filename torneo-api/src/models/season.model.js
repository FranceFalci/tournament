import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../bd/config.js'
// TODO ver si la temporada existe o no

const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class SeasonModel {
  static async getAllByTorneo ( { idTorneo } ) {
    try {
      const [seasons] = await connection.query( 'SELECT * FROM temporada WHERE id_torneo = ?;', [idTorneo] )
      return seasons
    } catch ( error ) {
      throw new Error( 'Error getting seasons' )
    }
  }

  static async getActiveSeasonByUserId ( { idUser } ) {
    try {
      const [season] = await connection.query( 'SELECT id_temporada , temporada.nombre FROM torneo INNER JOIN temporada using(id_torneo) WHERE id_usuario = ? AND activa= 1', [idUser] )
      return season[0]
    } catch ( error ) {
      throw new Error( 'Error getting seasons' )
    }
  }

  static async create ( { input } ) {
    const {
      name,
      idTournament,
      startDate
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO temporada (nombre, id_torneo, fecha_inicio)
          VALUES ( ?, ?, ?);`,
        [name, idTournament, startDate]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      // puede enviarle información sensible
      console.log( e.message )
      throw new Error( 'Error creating season' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [seasons] = await connection.query(
        `SELECT *
        FROM temporada WHERE id_temporada = ?;`, [insertId]
      )

      // Verificar si se encontró algún torneo
      if ( seasons.length > 0 ) {
        return seasons[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'season not found' ) // Si no se encuentra ningún torneo
      }
    } else {
      throw new Error( 'Error inserting season' ) // Si insertId es null
    }
  }

  static async update ( { id, input } ) {
    const { name } = input
    // todo controlar si el torneo existe
    try {
      const [response] = await connection.query(
        'UPDATE temporada SET nombre = ? WHERE id_temporada = ?;',
        [name, id]
      )
      if ( response && response.affectedRows > 0 ) {
        const [updatedTournament] = await connection.query(
          'SELECT * FROM temporada WHERE id_temporada = ?;',
          [id]
        )

        if ( updatedTournament.length > 0 ) {
          return updatedTournament[0]
        } else {
          throw new Error( 'Updated season not found' )
        }
      } else {
        throw new Error( 'season update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating tournament: ' )
    }
  }

  static async delete ( { id } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM temporada WHERE id_temporada = ?;',
        [id]
      )

      if ( response && response.affectedRows > 0 ) {
        return true // Devolver verdadero si se eliminó correctamente
      } else {
        throw new Error( 'Season not found or already deleted' ) // Si el torneo no se encuentra o ya ha sido eliminado
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting season' )
    }
  }
}
