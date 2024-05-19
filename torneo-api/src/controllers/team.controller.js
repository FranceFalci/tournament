import { validatePartialTeam, validateTeam, validateTeamStatics } from '../schemas/team.schema.js'
export class TeamController {
  constructor ( { teamModel } ) {
    this.teamModel = teamModel
  }

  getAllByZone = async ( req, res ) => {
    const { idZone } = req.params
    try {
      const teams = await this.teamModel.getAllByZone( { idZone } )
      if ( teams ) return res.json( teams )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  getAllByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const teams = await this.teamModel.getAllByCategory( { idCategory } )
      if ( teams ) return res.json( teams )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  getPositionsByZone = async ( req, res ) => {
    const { idZone } = req.params
    try {
      const teams = await this.teamModel.getPositionsByZone( { idZone } )
      if ( teams ) return res.json( teams )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  getPlayersAndStaticsByTeam = async ( req, res ) => {
    const { idTeam } = req.params

    try {
      const players = await this.teamModel.getPlayersAndStaticsByTeam( { idTeam } )
      if ( players ) return res.json( players )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  getById = async ( req, res ) => {
    const { idTeam } = req.params
    try {
      const team = await this.teamModel.getById( { idTeam } )
      if ( team ) return res.json( team )
      res.status( 404 ).json( { ok: false, message: 'Team not found' } )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  create = async ( req, res ) => {
    // console.log( req.body )
    const result = validateTeam( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { ok: false, message: JSON.parse( result.error.message ) } )
    }
    console.log( result.data.photoUrl )

    const { idZone } = req.params
    const input = {
      ...result.data,
      idZone
    }
    try {
      const newTeam = await this.teamModel.create( { input } )
      await this.teamModel.createOwnGoalScorer( { idTeam: newTeam.id_equipo, name: newTeam.nombre } )
      res.status( 201 ).json( newTeam )
    } catch ( error ) {
      return res.status( 400 ).json( { ok: false, message: error.message } )
    }
  }

  updateInfo = async ( req, res ) => {
    const result = validatePartialTeam( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { ok: false, message: JSON.parse( result.error.message ) } )
    }

    const { idTeam } = req.params
    try {
      const updatedTeam = await this.teamModel.updateInfo( { idTeam, input: result.data } )
      return res.json( updatedTeam )
    } catch ( error ) {
      return res.status( 400 ).json( { ok: false, message: error.message } )
    }
  }

  updateStatics = async ( req, res ) => {
    const result = validateTeamStatics( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { message: JSON.parse( result.error.message ) } )
    }

    const { idTeam } = req.params
    try {
      const updatedTeam = await this.teamModel.updateStatics( { idTeam, input: result.data } )
      return res.json( updatedTeam )
    } catch ( error ) {
      return res.status( 400 ).json( { message: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idTeam } = req.params
    try {
      const result = await this.teamModel.delete( { idTeam } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Zone not found' } )
      }
      return res.json( { message: 'Zone deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Zone not deleted' } )
    }
  }
}
