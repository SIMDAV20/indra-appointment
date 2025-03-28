import serverless from 'serverless-http';

import fastify from '../server';

export const handler = serverless(fastify);
