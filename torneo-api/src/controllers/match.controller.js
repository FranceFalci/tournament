import { validateMatch, validatePartialMatch } from '../schemas/match.schema .js'
import { validatePartialPlayer, validatePlayer, validatePlayerStatics } from '../schemas/player.schema.js'
export class MatchController {
  constructor ( { matchModel } ) {
    this.matchModel = matchModel
  }

  getAllByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const matches = await this.matchModel.getAllByCategory( { idCategory } )
      if ( matches ) return res.json( matches )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getAllByPhase = async ( req, res ) => {
    const { idPhase } = req.params
    try {
      const matches = await this.matchModel.getAllByPhase( { idPhase } )
      if ( matches ) return res.json( matches )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getById = async ( req, res ) => {
    const { idMatch } = req.params
    try {
      const match = await this.matchModel.getById( { idMatch } )
      if ( match ) return res.json( match )
      res.status( 404 ).json( { message: 'match not found' } )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    try {
      const result = validateMatch( req.body )
      if ( !result.success ) {
        return res.status( 422 ).json( { message: JSON.parse( result.error.message ) } )
      }
      const { idCategory } = req.params
      const input = {
        ...result.data,
        idCategory
      }
      const newMatch = await this.matchModel.create( { input } )
      const newMatchWithResults = await this.matchModel.createResult( { idMatch: newMatch.id_partido, input: result.data } )
      res.status( 201 ).json( newMatchWithResults )
    } catch ( error ) {
      return res.status( 400 ).json( { message: error.message } )
    }
  }

  updateInfo = async ( req, res ) => {
    try {
      console.log( req.body )
      const result = validatePartialMatch( req.body )

      if ( !result.success ) {
        return res.status( 400 ).json( { message: JSON.parse( result.error.message ) } )
      }

      const { idMatch } = req.params
      await this.matchModel.update( { idMatch, input: result.data } )
      const updatedMatchWithResults = await this.matchModel.updateResult( { idMatch, input: result.data } )

      return res.json( updatedMatchWithResults )
    } catch ( error ) {
      return res.status( 400 ).json( { message: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idMatch } = req.params
    try {
      const result = await this.matchModel.delete( { idMatch } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Match not found' } )
      }
      return res.json( { ok: true } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Match not deleted' } )
    }
  }
}
