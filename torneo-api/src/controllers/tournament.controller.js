// import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
//  TODO TRYCATCH
import { validatePartialTournament, validateTournament } from '../schemas/tournament.schema.js'

export class TournamentCrontrolles {
  constructor ( { tournamentModel } ) {
    this.tournamentModel = tournamentModel
  }

  getAll = async ( req, res ) => {
    try {
      const tournaments = await this.tournamentModel.getAll()
      res.json( tournaments )
    } catch ( error ) {
      res.status( 400 ).json( { message: error.message } )
    }
  }

  getById = async ( req, res ) => {
    const { id } = req.params
    const tournament = await this.tournamentModel.getById( { id } )
    if ( tournament ) return res.json( tournament )
    res.status( 404 ).json( { message: 'tournament not found' } )
  }

  create = async ( req, res ) => {
    const result = validateTournament( req.body )
    if ( !result.success ) {
      return res.status( 400 ).json( { message: JSON.parse( result.error.message ) } )
    }
    try {
      const idUser = req.user.id
      const input = {
        ...result.data,
        idUser
      }
      const newTournament = await this.tournamentModel.create( { input } )

      res.status( 201 ).json( newTournament )
    } catch ( error ) {
      res.status( 400 ).json( { message: error.message, ok: false } )
    }
  }

  delete = async ( req, res ) => {
    const { id } = req.params

    const result = await this.tournamentModel.delete( { id } )

    if ( result === false ) {
      return res.status( 404 ).json( { message: 'Tournament not found', ok: false } )
    }

    return res.json( { message: 'Tournament deleted' } )
  }

  update = async ( req, res ) => {
    const result = validatePartialTournament( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { message: JSON.parse( result.error.message ) } )
    }

    const { id } = req.params

    const updatedTournament = await this.tournamentModel.update( { id, input: result.data } )

    return res.json( updatedTournament )
  }
}
