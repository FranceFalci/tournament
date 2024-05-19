import { Router } from 'express'
import { MatchController } from '../controllers/match.controller.js'
import { MatchModel } from '../models/match.model.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const matchRouter = Router()

const matchController = new MatchController( { matchModel: MatchModel } )

matchRouter.get( '/:idMatch', matchController.getById )

matchRouter.get( '/category/:idCategory', matchController.getAllByCategory )
matchRouter.get( '/phase/:idPhase', matchController.getAllByPhase )

matchRouter.use( verifyToken )
matchRouter.post( '/:idCategory', matchController.create )

matchRouter.put( '/:idMatch', matchController.updateInfo )

matchRouter.delete( '/:idMatch', matchController.delete )
