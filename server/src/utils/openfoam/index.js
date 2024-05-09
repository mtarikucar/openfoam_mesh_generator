// Required for math operations and rounding
import * as math from 'mathjs';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __mainpath = path.join(__dirname, '..', '..', '..');


function ellipseFind(ellipseW, ellipseH, x, region) {
    let y = Math.abs(Math.sqrt((ellipseH**2) - ((ellipseH**2) * (x**2) / (ellipseW**2))));
    return y * region;
}


function movement(list, staticLoc, staticPos) {
    let vertList = [];
    if (staticPos === 2) {
        list.forEach(i => {
            vertList.push([i, staticLoc]);
        });
    } else {
        list.forEach(i => {
            vertList.push([staticLoc, i]);
        });
    }
    return vertList;
}

function ellipsePoints(verticesPoint, ellipsePoint, ellipseW, ellipseH) {
    for (let region of [-1, 1]) { // region defines the y value location
        ellipsePoint.forEach(x => {
            let y = ellipseFind(ellipseW, ellipseH, x, region);
            verticesPoint.push([x, y]);
        });
        ellipsePoint = ellipsePoint.slice().reverse().slice(1, -1);
    }
    return verticesPoint;
}

// 
function vertices2DTo3DAndWrite(verticesPoint, vertices) {
    let number = 0;
    for (let z of [0, 1]) {
        verticesPoint.forEach(([x, y]) => {
            number++;
            let point = `(${math.round(x, 3)} ${math.round(y, 2)} ${z})`;
            vertices += point + Array(20 - point.length).join(" ") + `////${number-1}\n`;
        });
        vertices += '\n\n';
    }
    return vertices;
}


function vertices(recH, recW, ellipseW, ellipseH, ellipseWOuter, ellipseHOuter, focInnerX, focOuterX) {
    let focOuterY = ellipseFind(ellipseWOuter, ellipseHOuter, focOuterX, 1);

    let recX = [-recW, -focOuterX, 0, focOuterX, recW];
    let recY = [-recH, -focOuterY, 0, focOuterY, recH];

    let verticesStr = "vertices ( \n\n";
    let verticesPoint = [];

    verticesPoint = verticesPoint.concat(movement(recX, -recH, 2));
    verticesPoint = verticesPoint.concat(movement(recY.slice(1), recW, 1));
    verticesPoint = verticesPoint.concat(movement(recX.slice(1, -1).reverse(), recH, 2));
    verticesPoint = verticesPoint.concat(movement(recY.slice(1).reverse(), -recW, 1));

    let ellipsePointOuter = [-ellipseWOuter, -focOuterX, 0, focOuterX, ellipseWOuter];
    let ellipsePointInner = [-ellipseW, -focInnerX, 0, focInnerX, ellipseW];

    verticesPoint = ellipsePoints(verticesPoint, ellipsePointOuter, ellipseWOuter, ellipseHOuter);
    verticesPoint = ellipsePoints(verticesPoint, ellipsePointInner, ellipseW, ellipseH);

    verticesStr = vertices2DTo3DAndWrite(verticesPoint, verticesStr) + ")";

    return verticesStr + "; \n\n";
}



function cellGrade(cellNumber) {
    let k = Math.floor(Math.sqrt(cellNumber / 20));  

    let grades = [
        [2*k, k, 1], [k, k, 1], [k, k, 1], [2*k, k, 1],
        [2*k, k, 1], [2*k, k, 1], [2*k, k, 1], [k, k, 1],
        [k, k, 1], [2*k, k, 1], [2*k, k, 1], [2*k, k, 1]
    ];




    
    for (let i = 0; i < 8; i++) {
        grades.push([k, k, 1]);  
    }

    return grades;
}



function blocks(cellNumber) {
    let blockRear = [
        [0, 1, 17, 15], [1, 2, 18, 17], [2, 3, 19, 18], [3, 4, 5, 19],
        [19, 5, 6, 20], [20, 6, 7, 21], [21, 7, 8, 9], [22, 21, 9, 10],
        [23, 22, 10, 11], [13, 23, 11, 12], [14, 16, 23, 13],
        [15, 17, 16, 14], [16, 17, 25, 24], [17, 18, 26, 25],
        [18, 19, 27, 26], [19, 20, 28, 27], [28, 20, 21, 29],
        [30, 29, 21, 22], [31, 30, 22, 23], [24, 31, 23, 16]
    ];

    let block = blockRear.map(block => block.concat(block.map(point => point + 32)));

    let line = "blocks  ( \n\n";
    let grades = cellGrade(cellNumber);

    block.forEach((currentBlock, i) => {
        let currentLine = "hex (" + currentBlock.join('  ') + ") ";
        currentLine += "(" + grades[i].join(' ') + ") ";
        currentLine += "simpleGrading (1 1 1)";
        line += currentLine + Array(70 - currentLine.length).fill(' ').join('') + " // Block Number " + i + "\n\n";
    });

    line += ");";
    return line;
}



// 
function script(ellipseW, ellipseH, xPoint1, xPoint2, xPoint1Name, xPoint2Name, region, z) {
    let a = ellipseW;
    let b = ellipseH;
    let line = `polyLine ${xPoint1Name} ${xPoint2Name} (`;

    let lis = Array.from({ length: 50 }, (_, i) => xPoint1 + (xPoint2 - xPoint1) * i / 49);

    lis.forEach(x => {
        let y = Math.abs(Math.sqrt((b**2) - ((b*b*x*x)/(a*a))));
        line += `(${x} ${y * region} ${z})\n`;
    });

    line += `)\n\n`;
    return line;
}


function edgesPoints(ellipseW, ellipseH, vertices, xPoints) {
    let line = "";
    for (let i = 0; i < vertices.length - 1; i++) {
        let xRear1 = vertices[i];
        let xRear2 = vertices[i + 1];
        let xFront1 = vertices[i] + 32;
        let xFront2 = vertices[i + 1] + 32;
        let region = (xRear1 >= vertices[4]) ? 1 : -1;

        line += script(ellipseW, ellipseH, xPoints[i], xPoints[i + 1], xRear1, xRear2, region, 0);
        line += script(ellipseW, ellipseH, xPoints[i], xPoints[i + 1], xFront1, xFront2, region, 1);
    }
    return line;
}


function edges(ellipseW, ellipseH, ellipseWOuter, ellipseHOuter, focInnerX, focOuterX) {
    let line = "";

    
    let verticesOuter = Array.from({ length: 8 }, (_, i) => 16 + i);
    let verticesInner = Array.from({ length: 8 }, (_, i) => 24 + i);

    
    verticesOuter.push(verticesOuter[0]);
    verticesInner.push(verticesInner[0]);

    
    let xInner = [-ellipseW, -focInnerX, 0, focInnerX, ellipseW];
    xInner = xInner.concat(xInner.slice().reverse().slice(1));

    
    let xOuter = [-ellipseWOuter, -focOuterX, 0, focOuterX, ellipseWOuter];
    xOuter = xOuter.concat(xOuter.slice().reverse().slice(1));

    
    line += edgesPoints(ellipseW, ellipseH, verticesInner, xInner);
    line += edgesPoints(ellipseWOuter, ellipseHOuter, verticesOuter, xOuter);

    return "edges (\n\n" + line + ");";
}



export default function generateMesh( recH, recW, ellipseH, ellipseW, cellNumber, fileName) {

    console.log(recH, recW, ellipseH, ellipseW, cellNumber, fileName)
    const baseDir = path.join(__mainpath, "public", fileName);
    const systemDirectory = path.join(baseDir, "system");

    ensureDirectories(systemDirectory);

    let line = `
/*--------------------------------*- C++ -*----------------------------------*\\
  =========                 |
  \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox
   \\    /   O peration     | Website:  https://openfoam.org
    \\  /    A nd           | Version:  10
     \\/     M anipulation  |
\\*---------------------------------------------------------------------------*/
FoamFile
{
    format      ascii;
    class       dictionary;
    object      blockMeshDict;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * // \n\n\n`;


    // 
    const facX = 1.25;
    const facY = 1.25;

    
    const ellipseWOuter = ellipseW * facX;
    const ellipseHOuter = ellipseH * facY;
    let focInnerX, focOuterX, focOuterY;

    if (ellipseW > ellipseH) {
        focInnerX = Math.abs(Math.sqrt((ellipseW**2) - (ellipseH**2)));
        focOuterX = Math.abs(Math.sqrt((ellipseWOuter**2) - (ellipseHOuter**2)));
        focOuterY = ellipseFind(ellipseWOuter, ellipseHOuter, focOuterX, 1);
    } else {
        focOuterY = Math.abs(Math.sqrt((ellipseWOuter**2) - (ellipseHOuter**2)));
        focOuterX = Math.abs(Math.sqrt((ellipseWOuter**2) - ((ellipseWOuter**2) * (focOuterY**2) / (ellipseHOuter**2))));
        focInnerX = Math.abs(Math.sqrt((ellipseW**2) - ((ellipseW**2) * (focOuterY**2) / (ellipseH**2))));
    }

    


    line += "convertToMeters 1;\n";
    line += vertices(recH, recW, ellipseW, ellipseH, ellipseWOuter, ellipseHOuter, focInnerX, focOuterX);
    line += blocks(cellNumber) + "\n\n";
    line += edges(ellipseW, ellipseH, ellipseWOuter, ellipseHOuter, focInnerX, focOuterX) + "\n\n";
    line += `
boundary
(
    
);`; 

    // Write to file
    fs.writeFileSync(path.join(systemDirectory, "blockMeshDict"), line);
    fs.writeFileSync(path.join(systemDirectory, "fvSolution"), fvSolution());
    fs.writeFileSync(path.join(systemDirectory, "fvSchemes"), fvSchemes());
    fs.writeFileSync(path.join(systemDirectory, "controlDict"), controlDict());
    fs.writeFileSync(path.join(baseDir, fileName + ".OpenFOAM"),"");
    

    run(baseDir);
}



function ensureDirectories(systemDirectory) {
    if (!fs.existsSync(systemDirectory)) {
        fs.mkdirSync(systemDirectory, { recursive: true });
    }
}


function run(baseDir) {
    try {

        process.chdir(baseDir);
        

        // Execute blockMesh and output to the console
        console.log('Running blockMesh...');
        let output = execSync('blockMesh', { encoding: 'utf-8' });
        console.log(output);

        // Execute checkMesh and output to the console
        console.log('Running checkMesh...');
        output = execSync('checkMesh', { encoding: 'utf-8' });
        console.log(output);

    } catch (error) {
        console.error(`Error occurred: ${error}`);
    }
}


function fvSolution() {
    let line = `

	/*--------------------------------*- C++ -*----------------------------------*\
  =========                 |
  \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox
   \\    /   O peration     | Website:  https://openfoam.org
    \\  /    A nd           | Version:  10
     \\/     M anipulation  |
\*---------------------------------------------------------------------------*/
FoamFile
{
    format      ascii;
    class       dictionary;
    location    "system";
    object      fvSolution;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

solvers
{
    p
    {
        solver          PCG;
        preconditioner  DIC;
        tolerance       1e-06;
        relTol          0.05;
    }

    pFinal
    {
        $p;
        relTol          0;
    }

    U
    {
        solver          smoothSolver;
        smoother        symGaussSeidel;
        tolerance       1e-05;
        relTol          0;
    }
}

PISO
{
    nCorrectors     2;
    nNonOrthogonalCorrectors 0;
    pRefCell        0;
    pRefValue       0;
}


// ************************************************************************* //
`;

    return line;
}

function fvSchemes() {
    let line = `
    /*--------------------------------*- C++ -*----------------------------------*\
    =========                 |
    \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox
     \\    /   O peration     | Website:  https://openfoam.org
      \\  /    A nd           | Version:  10
       \\/     M anipulation  |
  \*---------------------------------------------------------------------------*/
  FoamFile
  {
      format      ascii;
      class       dictionary;
      location    "system";
      object      fvSchemes;
  }
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
  
  ddtSchemes
  {
      default         Euler;
  }
  
  gradSchemes
  {
      default         Gauss linear;
      grad(p)         Gauss linear;
  }
  
  divSchemes
  {
      default         none;
      div(phi,U)      Gauss linear;
  }
  
  laplacianSchemes
  {
      default         Gauss linear orthogonal;
  }
  
  interpolationSchemes
  {
      default         linear;
  }
  
  snGradSchemes
  {
      default         orthogonal;
  }
  
  
  // ************************************************************************* //
    `;
    
        return line;
}


function controlDict() {
    let line = `
    
/*--------------------------------*- C++ -*----------------------------------*\
=========                 |
\\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox
 \\    /   O peration     | Website:  https://openfoam.org
  \\  /    A nd           | Version:  10
   \\/     M anipulation  |
\*---------------------------------------------------------------------------*/
FoamFile
{
  format      ascii;
  class       dictionary;
  location    "system";
  object      controlDict;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

application     icoFoam;

startFrom       startTime;

startTime       0;

stopAt          endTime;

endTime         0.5;

deltaT          0.005;

writeControl    timeStep;

writeInterval   20;

purgeWrite      0;

writeFormat     ascii;

writePrecision  6;

writeCompression off;

timeFormat      general;

timePrecision   6;

runTimeModifiable true;


// ************************************************************************* //`

    return line;
}