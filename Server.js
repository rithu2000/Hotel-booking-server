import express from 'express'
import cors from 'cors'
import connect from './database/conn.js';
import userRoute from './router/userRoute.js'
import adminRoute from './router/adminRoute.js'


const app = express();
const port = 8000;

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
    })
);
app.use(express.json());
app.use('/api', userRoute);
app.use('/admin', adminRoute);

connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log('Cannot connect to the Server');
    }
}).catch(error => {
    console.log('Invalid Database connection...!');
})