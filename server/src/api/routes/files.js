import { Router } from 'express';
import {list,download} from '../controllers/files/index.js';


const router = Router();


router.get('/list', list);
router.get('/download', download);





export default router