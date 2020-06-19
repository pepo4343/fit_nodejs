import {Router} from 'express'

import {listSchedule} from '../controllers/watersystem'
const router = Router();

router.get("/schedule/list",listSchedule)

export default router;