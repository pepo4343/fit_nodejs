import {Router} from 'express'

import {listSchedule ,setSchedule ,listScheduleCSV} from '../controllers/watersystem'
const router = Router();

router.get("/schedule/list",listSchedule)
router.get("/schedule/list/csv",listScheduleCSV)

router.post("/schedule/set",setSchedule)

export default router;