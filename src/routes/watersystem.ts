import {Router} from 'express'

import {getWaterSystem ,addWaterSystem,updateSchedule,deleteWaterSystem} from '../controllers/watersystem'
const router = Router();



router.post("/add",addWaterSystem)
router.get("/get",getWaterSystem)
router.get("/get/:alias",getWaterSystem)
router.post("/delete",deleteWaterSystem)


router.post("/schedule/update",updateSchedule)



export default router;