import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../bd/config.js'

const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class MatchModel {
  static async getAllByCategory ( { idCategory } ) {
    try {
      const [matches] = await connection.query( `SELECT 
        partido.id_partido, num_fecha, fecha, hora, cancha, id_categoria, id_eq_dos, id_eq_uno, res_uno, res_dos,
        equipo1.nombre AS nombre_eq_uno,
        equipo2.nombre AS nombre_eq_dos,
        equipo1.logo_url as logo_eq_uno,
        equipo2.logo_url as logo_eq_dos
        FROM partido INNER JOIN  resultado_partido ON partido.id_partido = resultado_partido.id_partido
        INNER JOIN equipo AS equipo1 ON resultado_partido.id_eq_uno = equipo1.id_equipo
        INNER JOIN equipo AS equipo2 ON resultado_partido.id_eq_dos = equipo2.id_equipo
        WHERE partido.id_categoria = ? ORDER BY partido.num_fecha`, [idCategory] )
      return matches
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting matches' )
    }
  }

  static async getAllByPhase ( { idPhase } ) {
    try {
      const [matches] = await connection.query( `SELECT partido.id_partido, id_categoria, id_eq_dos, id_eq_uno, res_uno, res_dos,
        equipo1.nombre AS nombre_eq_uno,
        equipo2.nombre AS nombre_eq_dos,
         equipo1.logo_url as logo_eq_uno,
        equipo2.logo_url as logo_eq_dos FROM partido INNER JOIN resultado_partido USING(id_partido)
          INNER JOIN equipo AS equipo1 ON resultado_partido.id_eq_uno = equipo1.id_equipo
        INNER JOIN equipo AS equipo2 ON resultado_partido.id_eq_dos = equipo2.id_equipo
        WHERE id_fase = ?   `, [idPhase] )
      return matches
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting matches' )
    }
  }

  static async getById ( { idMatch } ) {
    try {
      const [match] = await connection.query(
        'SELECT * FROM partido INNER JOIN resultado_partido WHERE id_partido = ?;', [idMatch] )
      if ( match.length === 0 ) return null

      return match[0]
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting match ' )
    }
  }

  static async create ( { input } ) {
    const {
      date,
      hour,
      field,
      state,
      numDate,
      idCategory,
      idPhase
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        'INSERT INTO partido (fecha,hora,cancha,estado,num_fecha,id_categoria ,id_fase) VALUES (?,?,?,?,?,?,?);',
        [date, hour, field, state, numDate, idCategory, idPhase]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating match' )
      // enviar la traza a un servicio interno
    }

    if ( insertId !== null ) {
      const [match] = await connection.query(
        `SELECT *
        FROM partido WHERE id_partido = ?;`, [insertId]
      )

      if ( match.length > 0 ) {
        return match[0]
      } else {
        throw new Error( 'match not found' )
      }
    } else {
      throw new Error( 'Error inserting match' )
    }
  }

  static async createResult ( { idMatch, input } ) {
    const {
      idTeamOne,
      idTeamTwo,
      resultOne,
      resultTwo

    } = input
    console.log( resultOne, resultTwo )
    const resulOneFinal = ( resultTwo !== undefined && resultOne === undefined ) ? 0 : resultOne
    const resulTwoFinal = ( resultOne !== undefined && resultTwo === undefined ) ? 0 : resultTwo

    try {
      const [response] = await connection.query( 'INSERT INTO resultado_partido (id_partido,id_eq_uno,id_eq_dos,res_uno,res_dos) VALUES (?,?,?,?,?);',

        [idMatch, idTeamOne, idTeamTwo, resulOneFinal, resulTwoFinal]
      )
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating match' )
      // enviar la traza a un servicio interno
    }

    const [match] = await connection.query(
      `SELECT *
        FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_partido = ?;`, [idMatch]
    )

    if ( match.length > 0 ) {
      return match[0]
    } else {
      throw new Error( 'match not found' )
    }
  }

  static async update ( { idMatch, input } ) {
    const {
      state,
      numDate,
      date,
      hour,
      field,
      idPhase

    } = input
    try {
      const [response] = await connection.query(
        'UPDATE partido SET estado = IFNULL(?, estado) , num_fecha  = IFNULL(?, num_fecha) ,fecha = IFNULL(?,fecha),hora = IFNULL(?,hora),cancha = IFNULL(?,cancha) ,id_fase = IFNULL(?,id_fase) WHERE id_partido = ?;',
        [state, numDate, date, hour, field, idPhase, idMatch]
      )

      if ( response && response.affectedRows > 0 ) {
        const [updatedMatch] = await connection.query(
          'SELECT * FROM partido WHERE id_partido = ?;',
          [idMatch]
        )

        if ( updatedMatch.length > 0 ) {
          return updatedMatch[0]
        } else {
          throw new Error( 'Updated match not found' )
        }
      } else {
        throw new Error( 'Match update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating match ' )
    }
  }

  static async updateResult ( { idMatch, input } ) {
    const {
      idTeamOne,
      idTeamTwo,
      resultOne,
      resultTwo
    } = input
    const resulOneFinal = ( resultTwo !== undefined && resultOne === undefined ) ? 0 : resultOne
    const resulTwoFinal = ( resultOne !== undefined && resultTwo === undefined ) ? 0 : resultTwo
    // if(resultOne && resulTwoFinal)
    console.log( resulOneFinal, resulTwoFinal )
    try {
      const [response] = await connection.query(
        'UPDATE resultado_partido SET id_eq_uno = IFNULL(?, id_eq_uno) , id_eq_dos  = IFNULL(?, id_eq_dos) ,res_uno = ?,res_dos = ? WHERE resultado_partido.id_partido = ?;',
        [idTeamOne, idTeamTwo, resulOneFinal, resulTwoFinal, idMatch]
      )

      if ( response && response.affectedRows > 0 ) {
        const [updatedMatch] = await connection.query(
          'SELECT * FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_partido = ?;',
          [idMatch]
        )

        if ( updatedMatch.length > 0 ) {
          return updatedMatch[0]
        } else {
          throw new Error( 'Updated match not found' )
        }
      } else {
        throw new Error( 'Match update failed' )
      }
    } catch ( e ) {
      console.log( e.message, 'aqui' )
      throw new Error( 'Error updating result match ' )
    }
  }

  static async delete ( { idMatch } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM partido WHERE id_partido = ?;',
        [idMatch]
      )

      if ( response && response.affectedRows > 0 ) {
        return true // Devolver verdadero si se eliminó correctamente
      } else {
        throw new Error( 'Match not found or already deleted' ) // Si el torneo no se encuentra o ya ha sido eliminado
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting Match' )
    }
  }
}
