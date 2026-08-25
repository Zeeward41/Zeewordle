import client from 'prom-client';
import { myRegister } from './registry.ts';

// ############################################################################
// me
// ############################################################################

//##########################
// Business & Security Counters
//##########################

// Tracks successful profile fetch requests
export const zeewordle_me_success_total = new client.Counter({
    name: 'zeewordle_me_success_total',
    help: 'Total count of successful user profile retrievals',
    registers: [myRegister],
});

// Tracks requests rejected due to missing or unauthenticated sessions
export const zeewordle_me_unauthorized_total = new client.Counter({
    name: 'zeewordle_me_unauthorized_total',
    help: 'Total count of profile requests rejected due to missing active session',
    registers: [myRegister],
});

// Tracks cases where a session exists but the referenced user ID is missing in database
export const zeewordle_me_not_found_total = new client.Counter({
    name: 'zeewordle_me_not_found_total',
    help: 'Total count of profile requests where the session user ID was not found in database',
    registers: [myRegister],
});

// Tracks internal server or database errors during profile retrieval
export const zeewordle_me_dependency_failures_total = new client.Counter({
    name: 'zeewordle_me_dependency_failures_total',
    help: 'Total count of profile request failures caused by database or server errors',
    registers: [myRegister],
});

//##########################
// Performance Histograms
//##########################

// Measures specific duration of the getUserById database query
export const zeewordle_me_db_lookup_duration_seconds = new client.Histogram({
    name: 'zeewordle_me_db_lookup_duration_seconds',
    help: 'Execution duration of the database user lookup by ID in seconds',
    registers: [myRegister],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
});

// Measures overall processing duration of the /me endpoint broken down by status code
export const zeewordle_me_duration_seconds = new client.Histogram({
    name: 'zeewordle_me_duration_seconds',
    help: 'Execution duration of the /me profile request in seconds',
    labelNames: ['status', 'reason'],
    registers: [myRegister],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
});
