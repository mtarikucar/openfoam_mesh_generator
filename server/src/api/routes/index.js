import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { specs, swaggerConfig } from '../../config/index.js';
const router = Router();

const specDoc = swaggerJsdoc(swaggerConfig);

router.use(specs, serve);
router.get(specs, setup(specDoc, { explorer: true }));


import files from "./files.js"
import opanfoam from "./openfoam.js"

router.use('/openfoam', opanfoam);
router.use('/files', files);

export default router;