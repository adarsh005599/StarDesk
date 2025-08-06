import express from 'express'
import { auth } from '../middleware/auth.js'
import { getPublishedCreation, getUserCreations, toggleLikeCreation } from '../controllers/userController.js'


export const userRouter = express.Router()

userRouter.get('/get-user-creation', auth, getUserCreations)
userRouter.get('/get-published-creation', auth, getPublishedCreation)
userRouter.post('/get-like-creation', auth, toggleLikeCreation)
