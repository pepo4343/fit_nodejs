import {Router} from 'express'

import {addDevice,getDevice,deleteDevice} from '../controllers/device'
const router = Router();

router.post("/add",addDevice)
router.get("/get",getDevice)
router.post("/delete",deleteDevice)

export default router;