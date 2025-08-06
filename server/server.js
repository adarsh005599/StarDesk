import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware, requireAuth} from '@clerk/express'
import aiRouter from './routes/aiRoutes.js'
import cloudinary from './configs/cloudinary.js'
import { userRouter } from './routes/userRoutes.js'


const app =  express()

// connect cloudinary

cloudinary.api.ping((err, result) => {
  if (err) {
    console.error("❌ Cloudinary connection failed:", err);
  } else {
    console.log("✅ Cloudinary connected:", result);
  }
});

app.use(cors())._router
app.use(express.json())
// clerk midd
app.use(clerkMiddleware())


app.get('/', (req, res) => res.send('server is live now!!'))

app.use(requireAuth()) 

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("server is running on this port", PORT);
})