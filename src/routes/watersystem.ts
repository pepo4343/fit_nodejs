import {Router} from 'express'

import {listSchedule ,setSchedule} from '../controllers/watersystem'
const router = Router();

router.get("/schedule/list",listSchedule)

router.post("/schedule/set",setSchedule)

export default router;