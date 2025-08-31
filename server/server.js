import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'

const app = express()

await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())



app.get('/', (req, res) => {
    res.send("Server is live!")
})

app.use(requireAuth())
app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

// Catch Clerk auth errors
app.use((err, req, res, next) => {
  if (err.name === "ClerkAuthError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    })
  }
  next(err)
})
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('The server is runnning on port ', PORT);
})
