import { validatePartialSeason, validateSeason } from '../schemas/season.schema.js'

export class SeasonController {
  constructor ( { seasonModel } ) {
    this.seasonModel = seasonModel
  }

  getAllByTorneo = async ( req, res ) => {
    const { id } = req.params
    try {
      const seasons = await this.seasonModel.getAllByTorneo( { idTorneo: id } )
      if ( seasons ) return res.json( seasons )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getActiveSeasonByUserId = async ( req, res ) => {
    const { id } = req.params
    try {
      const season = await this.seasonModel.getActiveSeasonByUserId( { idUser: id } )
      if ( season ) return res.status( 200 ).json( season )
      res.status( 404 ).json( { message: 'No existe una temporada' } )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    const result = validateSeason( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { message: JSON.parse( result.error.message ) } )
    }
    try {
      const startDate = new Date().toISOString().substring( 0, 10 ) // Convierte a ISOString y elimina la parte de la hora
      const newSeasonData = {
        ...result.data,
        startDate
      }
      const newSeason = await this.seasonModel.create( { input: newSeasonData } )
      res.status( 201 ).json( newSeason )
    } catch ( error ) {
      return res.status( 400 ).json( { message: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialSeason( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { message: JSON.parse( result.error.message ) } )
    }

    const { id } = req.params
    try {
      const updatedSeason = await this.seasonModel.update( { id, input: result.data } )
      return res.json( updatedSeason )
    } catch ( error ) {
      return res.status( 400 ).json( { message: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { id } = req.params
    try {
      const result = await this.seasonModel.delete( { id } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Season not found' } )
      }
      return res.json( { message: 'Season deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Season not deleted' } )
    }
  }
}
