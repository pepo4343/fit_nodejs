import {Router} from 'express'

import {listSchedule ,setSchedule, listAllSchedule,saveSchedule,listScheduleMin} from '../controllers/watersystem'
const router = Router();
router.get("/schedule/list",listAllSchedule)
router.get("/schedule/list/:alias",listSchedule)
router.get("/schedule/list/min/:alias",listScheduleMin)

router.post("/schedule/set/:alias",setSchedule)

router.post("/schedule/save/:alias",saveSchedule)

export default router;