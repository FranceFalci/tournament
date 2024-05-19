import { Router } from 'express'
import { PlayerController } from '../controllers/player.controller.js'
import { PlayerModel } from '../models/player.model.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const playerRouter = Router()

const playerController = new PlayerController( { playerModel: PlayerModel } )

playerRouter.get( '/team/:idTeam', playerController.getAllByTeam )
playerRouter.get( '/:idPlayer', playerController.getById )
playerRouter.get( '/scorers/:idCategory', playerController.getScorersByCategory )
playerRouter.get( '/cards/:idCategory', playerController.getCardsByCategory )
playerRouter.get( '/statics/:idPlayer', playerController.getStaticsByPlayer )
playerRouter.get( '/match/:idMatch', playerController.getAllByMatch )

playerRouter.use( verifyToken )
playerRouter.post( '/:idTeam', playerController.create )

playerRouter.put( '/info/:idPlayer', playerController.updateInfo )
playerRouter.put( '/:idPlayer', playerController.updateStatics )

playerRouter.delete( '/:idPlayer', playerController.delete )
