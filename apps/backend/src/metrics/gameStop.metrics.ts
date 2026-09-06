import client from 'prom-client';
import { myRegister } from './registry.ts';

// ############################################################################
// GAME STOP
// ############################################################################

// ##########################
// Performance and latency
// ##########################

// Measures response time distribution for POST /stop requests
export const zeewordle_game_stop_duration_seconds = new client.Histogram({
    name: 'zeewordle_game_stop_duration_seconds',
    help: 'Duration of POST /api/v1/game/stop requests in seconds',
    labelNames: ['status', 'reason'],
    registers: [myRegister],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2],
});

// Measures total requests count for POST /stop
export const zeewordle_game_stop_requests_total = new client.Counter({
    name: 'zeewordle_game_stop_requests_total',
    help: 'Total number of POST /api/v1/game/stop requests',
    registers: [myRegister],
});

// ##########################
// Security and access
// ##########################

// Tracks unauthorized access attempts
export const zeewordle_game_stop_unauthorized_total = new client.Counter({
    name: 'zeewordle_game_stop_unauthorized_total',
    help: 'Total unauthorized access attempts on POST /api/v1/game/stop',
    registers: [myRegister],
});

// ##########################
// Validation and state
// ##########################

// Tracks requests when no active game was found to stop
export const zeewordle_game_stop_not_found_total = new client.Counter({
    name: 'zeewordle_game_stop_not_found_total',
    help: 'Total stop attempts when no active game was found',
    registers: [myRegister],
});

// ##########################
// Business metrics
// ##########################

// Tracks games manually abandoned by users
export const zeewordle_game_abandoned_total = new client.Counter({
    name: 'zeewordle_game_abandoned_total',
    help: 'Total number of games abandoned by users',
    registers: [myRegister],
});
