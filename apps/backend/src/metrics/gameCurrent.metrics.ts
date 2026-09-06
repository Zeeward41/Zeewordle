import client from 'prom-client';
import { myRegister } from './registry.ts';

// ############################################################################
// GAME CURRENT
// ############################################################################

// ##########################
// Performance and latency
// ##########################

// Measures response time distribution for GET /current requests
export const zeewordle_game_current_duration_seconds = new client.Histogram({
    name: 'zeewordle_game_current_duration_seconds',
    help: 'Duration of GET /api/v1/game/current requests in seconds',
    labelNames: ['status', 'reason'],
    registers: [myRegister],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2],
});

// Measures total requests count for GET /current
export const zeewordle_game_current_requests_total = new client.Counter({
    name: 'zeewordle_game_current_requests_total',
    help: 'Total number of GET /api/v1/game/current requests',
    registers: [myRegister],
});

// ##########################
// Security and access
// ##########################

// Tracks unauthorized access attempts
export const zeewordle_game_current_unauthorized_total = new client.Counter({
    name: 'zeewordle_game_current_unauthorized_total',
    help: 'Total unauthorized access attempts on GET /api/v1/game/current',
    registers: [myRegister],
});

// ##########################
// System errors
// ##########################

// Tracks dictionary service failures when fetching a random word
export const zeewordle_game_dictionary_word_unavailable_total =
    new client.Counter({
        name: 'zeewordle_game_dictionary_word_unavailable_total',
        help: 'Total times dictionary failed to return a word',
        registers: [myRegister],
    });

// ##########################
// Business metrics
// ##########################

// Tracks total newly created games
export const zeewordle_game_created_total = new client.Counter({
    name: 'zeewordle_game_created_total',
    help: 'Total number of new games created',
    registers: [myRegister],
});
