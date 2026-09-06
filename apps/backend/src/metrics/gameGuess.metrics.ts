import client from 'prom-client';
import { myRegister } from './registry.ts';

// ############################################################################
// GAME GUESS
// ############################################################################

// ##########################
// Performance and latency
// ##########################

// Measures response time distribution for POST /guess requests
export const zeewordle_game_guess_duration_seconds = new client.Histogram({
    name: 'zeewordle_game_guess_duration_seconds',
    help: 'Duration of POST /api/v1/game/guess requests in seconds',
    labelNames: ['status', 'reason'],
    registers: [myRegister],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2],
});

// Measures total requests count for POST /guess
export const zeewordle_game_guess_requests_total = new client.Counter({
    name: 'zeewordle_game_guess_requests_total',
    help: 'Total number of POST /api/v1/game/guess requests',
    labelNames: ['status'],
    registers: [myRegister],
});

// ##########################
// Security and access
// ##########################

// Tracks unauthorized access attempts
export const zeewordle_game_guess_unauthorized_total = new client.Counter({
    name: 'zeewordle_game_guess_unauthorized_total',
    help: 'Total unauthorized access attempts on POST /api/v1/game/guess',
    registers: [myRegister],
});

// ##########################
// Validation and state
// ##########################

// Tracks guess attempts when no active game was found
export const zeewordle_game_guess_not_found_total = new client.Counter({
    name: 'zeewordle_game_guess_not_found_total',
    help: 'Total guess attempts when no active game was found',
    registers: [myRegister],
});

// Tracks invalid word submissions
export const zeewordle_game_guess_invalid_input_total = new client.Counter({
    name: 'zeewordle_game_guess_invalid_input_total',
    help: 'Total invalid word guess submissions',
    labelNames: ['reason'],
    registers: [myRegister],
});

// ##########################
// Business metrics
// ##########################

// Tracks total valid word guesses submitted
export const zeewordle_game_guess_submitted_total = new client.Counter({
    name: 'zeewordle_game_guess_submitted_total',
    help: 'Total valid word guesses submitted',
    registers: [myRegister],
});

// Tracks game outcome counts (WON or LOST)
export const zeewordle_game_outcomes_total = new client.Counter({
    name: 'zeewordle_game_outcomes_total',
    help: 'Total completed games categorized by outcome',
    labelNames: ['status'],
    registers: [myRegister],
});

// Measures distribution of attempt counts required to win a game
export const zeewordle_game_winning_attempts = new client.Histogram({
    name: 'zeewordle_game_winning_attempts',
    help: 'Number of attempts taken to win a game',
    registers: [myRegister],
    buckets: [1, 2, 3, 4, 5, 6],
});
