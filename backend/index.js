import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from "path";
import cors from 'cors'; // Import cors

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Use cors middleware
// This allows all origins
app.use(cors());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cookieParser());

app.use('/backend/user', userRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/post', postRoutes);
app.use('/backend/comment', commentRoutes);

// Serve static files from the 'frontend/dist' directory
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Route for all other requests to serve the frontend's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
