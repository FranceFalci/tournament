import { validatePartialPlayer, validatePlayer, validatePlayerStatics } from '../schemas/player.schema.js'
export class PlayerController {
  constructor ( { playerModel } ) {
    this.playerModel = playerModel
  }

  getAllByTeam = async ( req, res ) => {
    const { idTeam } = req.params
    try {
      const players = await this.playerModel.getAllByTeam( { idTeam } )
      if ( players ) return res.json( players )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getById = async ( req, res ) => {
    const { idPlayer } = req.params
    try {
      const player = await this.playerModel.getById( { idPlayer } )
      if ( player ) return res.json( player )
      res.status( 404 ).json( { message: 'Player not found' } )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getScorersByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const scorers = await this.playerModel.getScorersByCategory( { idCategory } )
      if ( scorers ) return res.json( scorers )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getCardsByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const cards = await this.playerModel.getCardsByCategory( { idCategory } )
      if ( cards ) return res.json( cards )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getAllByMatch = async ( req, res ) => {
    const { idMatch } = req.params
    try {
      const players = await this.playerModel.getAllByMatch( { idMatch } )
      if ( players ) return res.json( players )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  getStaticsByPlayer = async ( req, res ) => {
    const { idPlayer } = req.params
    try {
      const player = await this.playerModel.getStaticsByPlayer( { idPlayer } )
      if ( player ) return res.json( player )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    // console.log( req.body )
    const result = validatePlayer( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { message: JSON.parse( result.error.message ) } )
    }
    // console.log( 'est' )
    const { idTeam } = req.params
    const input = {
      ...result.data,
      idTeam
    }
    console.log( input )
    try {
      const newPlayer = await this.playerModel.create( input )
      console.log( 'exito' )

      res.status( 201 ).json( newPlayer )
    } catch ( error ) {
      console.log( error.message )

      return res.status( 400 ).json( { ok: false, message: error.message } )
    }
  }

  updateInfo = async ( req, res ) => {
    const result = validatePartialPlayer( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { message: JSON.parse( result.error.message ) } )
    }

    const { idPlayer } = req.params
    try {
      const updatedPlayer = await this.playerModel.updateInfo( { idPlayer, input: result.data } )
      return res.json( updatedPlayer )
    } catch ( error ) {
      return res.status( 400 ).json( { ok: false, message: error.message } )
    }
  }

  updateStatics = async ( req, res ) => {
    const result = validatePlayerStatics( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { ok: false, message: JSON.parse( result.error.message ) } )
    }

    const { idPlayer } = req.params
    try {
      const updaterPlayer = await this.playerModel.updateStatics( { idPlayer, input: result.data } )
      return res.json( updaterPlayer )
    } catch ( error ) {
      return res.status( 400 ).json( { ok: false, message: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idPlayer } = req.params
    try {
      const result = await this.playerModel.delete( { idPlayer } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Player not found', ok: false } )
      }
      return res.json( { message: 'Player deleted', ok: true } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Player not deleted', ok: false } )
    }
  }
}
