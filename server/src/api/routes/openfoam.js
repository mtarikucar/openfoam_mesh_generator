import { Router } from 'express';
import generateMesh from '../controllers/generateMesh.js';


const router = Router();


router.post('/generateMesh', generateMesh);



export default router