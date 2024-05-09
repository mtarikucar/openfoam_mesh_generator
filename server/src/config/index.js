export { default as swaggerConfig } from './swagger.config.js'
import { config } from 'dotenv';
config();

const {  PORT } = process.env

export const port = PORT || 3000;
export const prefix = '/api';
export const specs = "/docs";