import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import { UserModel } from '../models/user.model.js'

export const userRouter = Router()

// const tournamentModel = new TournamentModel()
const userController = new UserController( { userModel: UserModel } )

userRouter.post( '/', userController.create )
userRouter.post( '/sign-in', userController.signIn )

userRouter.put( '/:id', userController.update )

// userRouter.delete( '/:id', userController.delete )
