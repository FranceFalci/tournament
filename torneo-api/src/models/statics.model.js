import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../bd/config.js'
// TODO ver si la temporada existe o no

const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class StaticsModel {
  static async getPositionsByZone ( { idZone } ) {
    try {
      const [positions] = await connection.query( `SELECT e.nombre,
        (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE(id_eq_uno = e.id_equipo OR id_eq_dos = e.id_equipo) AND estado = 0) AS PJ,
      (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE((id_eq_uno = e.id_equipo AND res_uno = res_dos) OR(id_eq_dos = e.id_equipo AND res_dos = res_uno)) AND estado = 0) AS PE,
        (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE((id_eq_uno = e.id_equipo AND res_uno < res_dos) OR(id_eq_dos = e.id_equipo AND res_dos < res_uno)) AND estado = 0) AS PP,
          (SELECT COUNT(*) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE((id_eq_uno = e.id_equipo AND res_uno > res_dos) OR(id_eq_dos = e.id_equipo AND res_dos > res_uno)) AND estado = 0) AS PG,
            (
              (SELECT COALESCE(SUM(res_uno), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_uno = e.id_equipo) +
                (SELECT COALESCE(SUM(res_dos), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_dos = e.id_equipo)--goles a favor
    ) AS GF,
        (
          (SELECT COALESCE(SUM(res_dos), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_uno = e.id_equipo) +
            (SELECT COALESCE(SUM(res_uno), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_dos = e.id_equipo)--goles en contra
    ) AS GC,
        (
          (SELECT COALESCE(SUM(res_uno), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_uno = e.id_equipo) +
            (SELECT COALESCE(SUM(res_dos), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_dos = e.id_equipo)--goles a favor
    )
      -
        (
          (SELECT COALESCE(SUM(res_dos), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_uno = e.id_equipo) +
            (SELECT COALESCE(SUM(res_uno), 0) FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_eq_dos = e.id_equipo)--goles en contra
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
      throw new Error( 'Error getting sheets' )
    }
  }
}
