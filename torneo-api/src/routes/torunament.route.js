import { Router } from 'express'
import { TournamentCrontrolles } from '../controllers/tournament.controller.js'
import { TournamentModel } from '../models/tournament.model.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const tournamentRouter = Router()

// const tournamentModel = new TournamentModel()
const tournamentController = new TournamentCrontrolles( { tournamentModel: TournamentModel } )

tournamentRouter.get( '/', tournamentController.getAll )
tournamentRouter.get( '/:id', tournamentController.getById )

tournamentRouter.use( verifyToken )
tournamentRouter.post( '/', tournamentController.create )

tournamentRouter.put( '/:id', tournamentController.update )

tournamentRouter.delete( '/:id', tournamentController.delete )
