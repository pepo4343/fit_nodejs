import {Router} from 'express'

import {listSchedule ,setSchedule ,addSchedule,listScheduleMin} from '../controllers/watersystem'
const router = Router();

router.get("/schedule/list",listSchedule)
router.get("/schedule/list/min",listScheduleMin)

router.post("/schedule/set",setSchedule)

router.post("/schedule/add",addSchedule)

export default router;