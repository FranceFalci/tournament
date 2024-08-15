import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../bd/config.js'
// TODO ver si la temporada existe o no

const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class TeamModel {
  static async getAllByZone ( { idZone } ) {
    try {
      const [teams] = await connection.query( 'SELECT * FROM equipo WHERE id_zona = ?;', [idZone] )
      return teams
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting teams' )
    }
  }

  static async getAllByCategory ( { idCategory } ) {
    try {
      const [teams] = await connection.query( 'SELECT id_equipo , equipo.nombre , logo_url ,zona.id_categoria FROM equipo INNER JOIN zona  ON equipo.id_zona = zona.id_zona WHERE id_categoria =  ?', [idCategory] )
      return teams
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting teams' )
    }
  }

  static async getById ( { idTeam } ) {
    try {
      const [team] = await connection.query(
        'SELECT * FROM equipo WHERE id_equipo = ?;', [idTeam] )
      if ( team.length === 0 ) return []
      return team[0]
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting team ' )
    }
  }

  static async getPositionsByZone ( { idZone } ) {
    try {
      const [positions] = await connection.query( `SELECT e.nombre,  e.logo_url ,
        (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE(id_eq_uno = e.id_equipo OR id_eq_dos = e.id_equipo) AND estado = 0 AND id_fase is null ) AS PJ,
      (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE((id_eq_uno = e.id_equipo AND res_uno = res_dos) OR(id_eq_dos = e.id_equipo AND res_dos = res_uno)) AND estado = 0 AND id_fase is null ) AS PE,
        (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE((id_eq_uno = e.id_equipo AND res_uno < res_dos) OR(id_eq_dos = e.id_equipo AND res_dos < res_uno)) AND estado = 0 AND id_fase is null ) AS PP,
          (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE((id_eq_uno = e.id_equipo AND res_uno > res_dos) OR(id_eq_dos = e.id_equipo AND res_dos > res_uno)) AND estado = 0 AND id_fase is null ) AS PG,
            (
              (SELECT COALESCE(SUM(res_uno), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_uno = e.id_equipo) +
                (SELECT COALESCE(SUM(res_dos), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_dos = e.id_equipo)
    ) AS GF,
        (
          (SELECT COALESCE(SUM(res_dos), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_uno = e.id_equipo) +
            (SELECT COALESCE(SUM(res_uno), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_dos = e.id_equipo)
    ) AS GC,
        (
          (SELECT COALESCE(SUM(res_uno), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_uno = e.id_equipo) +
            (SELECT COALESCE(SUM(res_dos), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_dos = e.id_equipo)
    )
      -
        (
          (SELECT COALESCE(SUM(res_dos), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_uno = e.id_equipo) +
            (SELECT COALESCE(SUM(res_uno), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_dos = e.id_equipo)
    ) as DG,
        (
          (3 * (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE(id_eq_uno = e.id_equipo AND res_uno > res_dos) OR(id_eq_dos = e.id_equipo AND res_dos > res_uno)))
      +
        ((SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE(id_eq_uno = e.id_equipo AND res_uno = res_dos) OR(id_eq_dos = e.id_equipo AND res_dos = res_uno)))
    ) AS PTS
      FROM 
    equipo e
      WHERE
      e.id_zona = ?
        ORDER BY PTS DESC, DG DESC;`, [idZone] )
      return positions
    } catch ( error ) {
      console.log( error )
      throw new Error( 'Error getting teams' )
    }
  }

  static async create ( { input } ) {
    const {
      name,
      photoUrl, idZone
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        'INSERT INTO torneo.equipo (nombre, logo_url ,id_zona) VALUES (?,IFNULL(?, logo_url),?);',
        [name, photoUrl, idZone]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating team' )
      // sendLog(e)
    }

    if ( insertId !== null ) {
      const [team] = await connection.query(
        `SELECT *
        FROM equipo WHERE id_equipo = ?;`, [insertId]
      )

      if ( team.length > 0 ) {
        return team[0]
      } else {
        throw new Error( 'Team not found' )
      }
    } else {
      throw new Error( 'Error inserting team' )
    }
  }

  static async createOwnGoalScorer ( { idTeam, name } ) {
    let insertId = null
    const editedName = 'en contra - ' + name
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

  static async updateInfo ( { idTeam, input } ) {
    const { name, photoUrl } = input
    // todo controlar si el torneo existe
    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        'UPDATE equipo SET nombre = IFNULL(?, nombre) , logo_url = IFNULL(?, logo_url) WHERE id_equipo = ?;',
        [name, photoUrl, idTeam]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedTeam] = await connection.query(
          'SELECT * FROM equipo WHERE id_equipo = ?;',
          [idTeam]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedTeam.length > 0 ) {
          return updatedTeam[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated team not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'Team update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating team ' )
    }
  }

  static async getPlayersAndStaticsByTeam ( { idTeam } ) {
    try {
      const [players] = await connection.query( `
    SELECT jugador.nombre, equipo.nombre as equipo,
    COUNT(CASE WHEN ficha.tipo = 0 THEN 1 END) AS goles,
    COUNT(CASE WHEN ficha.tipo = 1 THEN 1 END) AS tarjetas_amarillas,
    COUNT(CASE WHEN ficha.tipo = 2 THEN 1 END) AS tarjetas_rojas
    FROM jugador LEFT JOIN ficha USING (id_jugador) LEFT JOIN 
    partido USING (id_partido) INNER JOIN equipo USING (id_equipo)
    WHERE id_equipo = ? AND nombre NOT LIKE 'en contra %' GROUP BY jugador.id_jugador, jugador.nombre,equipo.nombre;`, [idTeam] )
      return players
    } catch ( error ) {
      console.log( error )
      throw new Error( 'Error getting players' )
    }
  }

  static async delete ( { idTeam } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM equipo WHERE id_equipo = ?;',
        [idTeam]
      )

      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'Team not found or already deleted' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting Team' )
    }
  }
}
