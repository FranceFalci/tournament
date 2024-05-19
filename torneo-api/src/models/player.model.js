import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../bd/config.js'

const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class PlayerModel {
  static async getAllByTeam ( { idTeam } ) {
    try {
      // eslint-disable-next-line quotes
      const [players] = await connection.query( `SELECT * FROM jugador WHERE id_equipo = ? AND nombre NOT LIKE 'en contra %';`, [idTeam] )
      return players
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting players' )
    }
  }

  static async getAllByMatch ( { idMatch } ) {
    try {
      const [players] = await connection.query( `
            SELECT DISTINCT jugadores.nombre , jugadores.id_jugador
         FROM (
        SELECT jug1.nombre ,jug1.id_jugador
        FROM partido
        INNER JOIN resultado_partido ON partido.id_partido = resultado_partido.id_partido
        INNER JOIN equipo AS equipo1 ON resultado_partido.id_eq_uno = equipo1.id_equipo
        INNER JOIN jugador AS jug1 ON jug1.id_equipo = equipo1.id_equipo
        WHERE partido.id_partido = ?

        UNION

        SELECT jug2.nombre,jug2.id_jugador
        FROM partido
        INNER JOIN resultado_partido ON partido.id_partido = resultado_partido.id_partido
        INNER JOIN equipo AS equipo2 ON resultado_partido.id_eq_dos = equipo2.id_equipo
        INNER JOIN jugador AS jug2 ON jug2.id_equipo = equipo2.id_equipo
        WHERE partido.id_partido = ?
      ) AS jugadores;
    `, [idMatch, idMatch] )
      return players
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting players' )
    }
  }

  static async getById ( { idPlayer } ) {
    try {
      const [jugador] = await connection.query(
        'SELECT * FROM jugador WHERE id_jugador = ?;', [idPlayer] )
      if ( jugador.length === 0 ) return
      return jugador[0]
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting team ' )
    }
  }

  static async create ( { idTeam, name } ) {
    let insertId = null
    console.log( name )
    try {
      const [response] = await connection.query(
        'INSERT INTO jugador (nombre, id_equipo) VALUES (?,?);',
        [name, idTeam]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating player' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }
    if ( insertId !== null ) {
      const [player] = await connection.query(
        `SELECT *
        FROM jugador WHERE id_jugador = ?;`, [insertId]
      )

      if ( player.length > 0 ) {
        return player[0]
      } else {
        throw new Error( 'player not found' )
      }
    }
  }

  static async createOwnGoalScorer ( { idTeam, name } ) {
    let insertId = null
    const editedName = 'en contra' - name
    try {
      const [response] = await connection.query(
        'INSERT INTO jugador (nombre, id_equipo) VALUES (?,?);',
        [editedName, idTeam]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating player' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    if ( insertId !== null ) {
      return true
    } else {
      throw new Error( 'Error inserting player' )
    }
  }

  static async updateInfo ( { idPlayer, input } ) {
    const { name, idTeam } = input
    // todo controlar si el torneo existe
    try {
      const [response] = await connection.query(
        'UPDATE jugador SET nombre = IFNULL(?, nombre), id_equipo = IFNULL(?, id_equipo) WHERE id_jugador = ?;',
        [name, idTeam, idPlayer]
      )
      if ( response && response.affectedRows > 0 ) {
        const [updatedPlayer] = await connection.query(
          'SELECT * FROM jugador WHERE id_jugador = ?;',
          [idPlayer]
        )
        return updatedPlayer[0]
      }
      throw new Error( 'Player update failed' )
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating player ' )
    }
  }

  static async updateStatics ( { idPlayer, input } ) {
    const { goals, yellowCards, redCards } = input
    // todo controlar si el torneo existe
    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        'UPDATE jugador SET goles = goles + IFNULL(?, 0) , tarjetas_amarillas = tarjetas_amarillas +IFNULL(?, 0) , tarjetas_rojas= tarjetas_rojas + IFNULL(?, 0) WHERE id_jugador= ?',
        [goals, yellowCards, redCards, idPlayer]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedPlayer] = await connection.query(
          'SELECT * FROM jugador WHERE id_jugador = ?;',
          [idPlayer]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedPlayer.length > 0 ) {
          return updatedPlayer[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated player not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'Player update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating player ' )
    }
  }

  static async delete ( { idPlayer } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM jugador WHERE id_jugador = ?;',
        [idPlayer]
      )

      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'Player not found or already deleted' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting Player' )
    }
  }

  static async getScorersByCategory ( { idCategory } ) {
    try {
      const [scorers] = await connection.query(
        `SELECT  jugador.nombre,equipo.nombre as equipo, COUNT(*) AS goles FROM jugador INNER JOIN ficha USING(id_jugador) INNER JOIN 
    partido USING(id_partido) INNER JOIN equipo USING(id_equipo) WHERE ficha.tipo = 0 AND partido.id_categoria = ? AND jugador.nombre NOT LIKE 'en contra%'
    GROUP BY jugador.id_jugador, jugador.nombre, equipo.nombre ORDER BY goles DESC, nombre; `, [idCategory] )
      if ( scorers.length === 0 ) return []
      return scorers
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting team ' )
    }
  }

  static async getCardsByCategory ( { idCategory } ) {
    try {
      const [cards] = await connection.query(
        `SELECT jugador.nombre, equipo.nombre as equipo,
    COUNT(CASE WHEN ficha.tipo = 1 THEN 1 END) AS tarjetas_amarillas,
    COUNT(CASE WHEN ficha.tipo = 2 THEN 1 END) AS tarjetas_rojas FROM jugador INNER JOIN ficha USING (id_jugador)
    INNER JOIN partido USING (id_partido)INNER JOIN equipo USING (id_equipo) WHERE id_categoria = ? GROUP BY
    jugador.id_jugador, jugador.nombre,equipo.nombre ORDER BY tarjetas_amarillas DESC,tarjetas_rojas DESC; `, [idCategory] )
      if ( cards.length === 0 ) return []
      return cards
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting team ' )
    }
  }

  static async getStaticsByPlayer ( { idPlayer } ) {
    try {
      const [player] = await connection.query(
        `SELECT jugador.nombre, equipo.nombre as equipo,
    COUNT(CASE WHEN ficha.tipo = 0 THEN 1 END) AS goles,
    COUNT(CASE WHEN ficha.tipo = 1 THEN 1 END) AS tarjetas_amarillas,
    COUNT(CASE WHEN ficha.tipo = 2 THEN 1 END) AS tarjetas_rojas
    FROM jugador INNER JOIN ficha USING (id_jugador) INNER JOIN
    partido USING (id_partido) INNER JOIN equipo USING (id_equipo)
    WHERE id_jugador = ? GROUP BY jugador.id_jugador, jugador.nombre,equipo.nombre;`, [idPlayer] )
      if ( player.length === 0 ) return
      return player[0]
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting player ' )
    }
  }
}
