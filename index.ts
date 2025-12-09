import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.ts';
dotenv.config();

const app = express();

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Server is running')
})

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

connectDB().then(() => {
    console.log("connected to database")
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch(error => {
    console.log("failed to start server due to database connection error", error)
})
