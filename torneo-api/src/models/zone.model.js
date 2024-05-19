import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../bd/config.js'
// TODO ver si la temporada existe o no

const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class ZoneModel {
  static async getAllByCategory ( { idCategory } ) {
    try {
      const [zones] = await connection.query( 'SELECT * FROM zona WHERE id_categoria= ?;', [idCategory] )
      return zones
    } catch ( error ) {
      throw new Error( 'Error getting zones' )
    }
  }

  static async create ( { input } ) {
    const {
      name,
      idCategory
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO zona (nombre, id_categoria)
          VALUES ( ?, ? );`,
        [name, idCategory]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message, 'aqio' )
      throw new Error( 'Error creating zone' )
      // sendLog(e)
    }

    if ( insertId !== null ) {
      const [seasons] = await connection.query(
        `SELECT *
        FROM zona WHERE id_zona = ?;`, [insertId]
      )

      if ( seasons.length > 0 ) {
        return seasons[0]
      } else {
        throw new Error( 'Zone not found' )
      }
    } else {
      throw new Error( 'Error inserting zone' )
    }
  }

  static async update ( { idZone, input } ) {
    const { name } = input
    try {
      const [response] = await connection.query(
        'UPDATE zona SET nombre = ? WHERE id_zona = ?;',
        [name, idZone]
      )
      if ( response && response.affectedRows > 0 ) {
        const [updatedZone] = await connection.query(
          'SELECT * FROM zona WHERE id_zona = ?;',
          [idZone]
        )

        if ( updatedZone.length > 0 ) {
          return updatedZone[0]
        } else {
          throw new Error( 'Updated zone not found' )
        }
      } else {
        throw new Error( 'Zone update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating zone ' )
    }
  }

  static async delete ( { idZone } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM zona WHERE id_zona = ?;',
        [idZone]
      )

      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'Zone not found or already deleted' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting Zone' )
    }
  }
}
