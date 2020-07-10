import {Router} from 'express'

import {addModel,getModel} from '../controllers/model'
const router = Router();

router.post("/add",addModel)
router.get("/get",getModel)

export default router;