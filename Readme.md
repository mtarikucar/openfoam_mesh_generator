# Application Startup Guide

This guide explains how to launch the application using Docker and `make`. The application consists of a frontend (React), a backend (Node.js), openfoam mesh generation simulation.

## Prerequisites

- Docker must be installed.
- `make` command should be available in Linux/MacOS environments. Alternative commands for Windows users are provided.


## Launch Procedures

### For Linux/MacOS Users

notice: ! continue with root user or use sudo
```bash
cd path/to/your/project
make build
make run
```
### For Windows Users
```bash
cd path/to/your/project/client
docker build -t openfoam-client .
cd ..
cd server
docker build -t openfoam-server .
cd ..
docker-compose up
```

## Accessing the Application
Your application should now be running at http://localhost:8080 for the frontend and http://localhost:3000 for the backend.

## API Documentation
The API documentation is available at http://localhost:3000/api/docs/#/ when you reach the project.


## tech stack
- React
- Node.js
- Docker
- Swagger
- OpenFoam


## how to work
```
The generateMesh function in the provided code is designed to automate the generation of a mesh configuration for CFD (Computational Fluid Dynamics) simulations using OpenFOAM, a popular open-source CFD software. Here’s a brief overview of how this function works:
Initial Setup: The function starts by logging some initial parameters and setting up directory paths based on a given file name. It ensures that necessary directories exist where output files will be stored.
Parameter Calculations: It computes several geometric parameters such as the focal points and dimensions of inner and outer ellipses based on the input rectangle height (recH), rectangle width (recW), and ellipse dimensions. These calculations are important for defining the shapes within the mesh.
```
```
Mesh Definition:
Vertices Calculation: It computes vertices for the rectangular and elliptical sections of the mesh by combining linear and elliptical movements. These vertices are defined in both 2D and 3D spaces.
Blocks Generation: It defines the hexahedral blocks used in the mesh. These blocks are fundamental elements in OpenFOAM meshes, defining how the domain is discretized for simulation.
Edges Definition: Curved edges of the mesh are defined using polynomial lines that approximate the shape of the ellipses.
```
```
File Writing:
The function constructs a string that contains the entire mesh configuration in OpenFOAM's blockMeshDict format. This includes all vertices, blocks, edges, and additional necessary settings.
It writes this configuration along with other simulation settings (fvSolution, fvSchemes, controlDict) to specific files within the system directory.
Execution of Mesh Utilities: After setting up the configuration files, the function changes the current directory to the base directory of the simulation and executes OpenFOAM utilities like blockMesh and checkMesh. These utilities generate the mesh based on the provided configuration and check it for errors, respectively.
Logging and Error Handling: The function logs outputs from these utilities and handles any errors that might occur during the execution process, providing feedback on the success or failure of the mesh generation.
In summary, generateMesh automates the creation of a mesh for CFD simulations by setting up necessary configurations and invoking OpenFOAM's tools, making it easier to start simulations with custom-defined geometries.
```