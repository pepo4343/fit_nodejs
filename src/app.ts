import express, { NextFunction ,Response,Request} from 'express';

import watersystemRoutes from './routes/watersystem'

const app = express();

app.use("/watersystem", watersystemRoutes)


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({message:err.message});
})

app.listen(3000, () => {
    console.log("running on port 3000");

});