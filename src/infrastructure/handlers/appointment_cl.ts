import serverless from 'serverless-http';

import fastify from '../server.js';

export const handler = serverless(fastify);
