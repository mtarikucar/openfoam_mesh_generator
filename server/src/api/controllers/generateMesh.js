import {errorHelper, logger} from '../../utils/index.js';
import generateMesh from '../../utils/openfoam/index.js';

export default async (req, res) => {
    try {
        const { recHeight, recWidth, ellipseHeight, ellipseWidth, cellCount, documentName, xDivision,yDivision } = req.body;

        await generateMesh(recHeight, recWidth, ellipseHeight, ellipseWidth, cellCount, documentName,xDivision,yDivision);
        
        res.send("Mesh generation initiated successfully.");
    } catch (error) {
        console.error('Error during mesh generation:', error);
        res.status(500).send(error.message);
    }
}

/**
 * @swagger
 * /mesh/generate:
 *   post:
 *     summary: Initiates Mesh Generation
 *     description: This endpoint initiates mesh generation based on the provided parameters such as dimensions, cell count, and divisions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recHeight:
 *                 type: number
 *                 description: The height of the rectangle in the mesh.
 *                 example: 10
 *               recWidth:
 *                 type: number
 *                 description: The width of the rectangle in the mesh.
 *                 example: 5
 *               ellipseHeight:
 *                 type: number
 *                 description: The height of the ellipse in the mesh.
 *                 example: 3
 *               ellipseWidth:
 *                 type: number
 *                 description: The width of the ellipse in the mesh.
 *                 example: 2
 *               cellCount:
 *                 type: number
 *                 description: The number of cells in the mesh.
 *                 example: 500
 *               documentName:
 *                 type: string
 *                 description: The name of the document to save the mesh data.
 *                 example: "meshData"
 *               xDivision:
 *                 type: number
 *                 description: The number of divisions along the x-axis.
 *                 example: 10
 *               yDivision:
 *                 type: number
 *                 description: The number of divisions along the y-axis.
 *                 example: 10
 *     tags:
 *       - Mesh Management
 *     responses:
 *       "200":
 *         description: Successfully initiated mesh generation. Returns a confirmation message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mesh generation initiated successfully."
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
