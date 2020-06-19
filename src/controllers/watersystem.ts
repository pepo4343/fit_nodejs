import { RequestHandler} from 'express'

export  const listSchedule:RequestHandler = (req,res,next)=>{
    res.status(201).json({
        morningStartHour:8,
        morningStartMinute:0,
        morningTimePerStation:15,
        eveningStartHour:16,
        eveningStartMinut:0,
        eveningTimePerStation:15,
    })
}