import client from 'prom-client';

export const myRegister = new client.Registry();

// Metrics system Node.js
client.collectDefaultMetrics({ register: myRegister });

export default client;
