import { Router } from 'express'
import { TeamController } from '../controllers/team.controller.js'
import { TeamModel } from '../models/team.model.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const teamRouter = Router()

const teamController = new TeamController( { teamModel: TeamModel } )

teamRouter.get( '/zone/:idZone', teamController.getAllByZone )
teamRouter.get( '/:idTeam', teamController.getById )
teamRouter.get( '/category/:idCategory', teamController.getAllByCategory )
teamRouter.get( '/position/:idZone', teamController.getPositionsByZone )
teamRouter.get( '/statics/:idTeam', teamController.getPlayersAndStaticsByTeam )

teamRouter.use( verifyToken )

teamRouter.post( '/:idZone', teamController.create )

teamRouter.put( '/info/:idTeam', teamController.updateInfo )
teamRouter.put( '/:idTeam', teamController.updateStatics )

teamRouter.delete( '/:idTeam', teamController.delete )
