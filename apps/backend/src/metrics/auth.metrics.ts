import client from 'prom-client';
import { myRegister } from './registry.ts';

// ############################################################################
// REGISTER
// ############################################################################

//##########################
// Performance and latency
//##########################

// Measures response time distribution for account creations
export const zeewordle_register_request_duration_seconds = new client.Histogram(
    {
        name: 'zeewordle_register_request_duration_seconds',
        help: 'Duration of POST /register requests in seconds',
        labelNames: ['status', 'reason'],
        registers: [myRegister],
        buckets: [0.1, 0.5, 1, 1.5, 2],
    }
);

//##########################
// Security
//##########################

// Tracks registration attempts using an already existing email or username
export const zeewordle_register_duplicate_attempts_total = new client.Counter({
    name: 'zeewordle_register_duplicate_attempts_total',
    help: 'Total count of registration attempts with existing email or username',
    registers: [myRegister],
});

// Tracks registration requests blocked by rate limiting rules
export const zeewordle_register_rate_limited_total = new client.Counter({
    name: 'zeewordle_register_rate_limited_total',
    help: 'Total count of registration requests rate-limited',
    registers: [myRegister],
});

//##########################
// Business and Conversion
//##########################

// Tracks successfully created accounts in the database
export const zeewordle_register_success_total = new client.Counter({
    name: 'zeewordle_register_success_total',
    help: 'Total count of successful user registrations',
    registers: [myRegister],
});

// Tracks failures originating from third-party services (e.g. database, email provider)
export const zeewordle_register_dependency_failures_total = new client.Counter({
    name: 'zeewordle_register_dependency_failures_total',
    help: 'Total count of registration failures caused by external dependencies',
    registers: [myRegister],
});

// ############################################################################
// login
// ############################################################################

//##########################
//Activity and Safety Metrics
//##########################

// Count the total number of successful logins
export const zeewordle_login_success_total = new client.Counter({
    name: 'zeewordle_login_success_total',
    help: 'Total count of successful user logins',
    registers: [myRegister],
});

// Count the number of failures due to invalid credentials
export const zeewordle_login_failures_total = new client.Counter({
    name: 'zeewordle_login_failures_total',
    help: 'Total count of failed login attempts due to invalid credentials',
    registers: [myRegister],
});

// Count the errors caught in the catch block
export const zeewordle_login_dependency_failures_total = new client.Counter({
    name: 'zeewordle_login_dependency_failures_total',
    help: 'Total count of login request failures caused by internal or external dependency errors',
    registers: [myRegister],
});

//##########################
// Performance
//##########################

// Maintain the distribution of the total request processing time for login (in seconds)
export const zeewordle_login_duration_seconds = new client.Histogram({
    name: 'zeewordle_login_duration_seconds',
    help: 'Execution duration of bcrypt password verification in seconds',
    registers: [myRegister],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
});

// Maintain the distribution of the specific duration of the getUserByEmail call
export const zeewordle_login_db_lookup_duration_seconds = new client.Histogram({
    name: 'zeewordle_login_db_lookup_duration_seconds',
    help: 'Execution duration of the database user lookup by email in seconds',
    registers: [myRegister],
    buckets: [0.025, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 1, 2],
});

// ############################################################################
// logout
// ############################################################################

//##########################
// Business & Security Counters
//##########################

// Tracks total successful logouts when a valid session is destroyed
export const zeewordle_logout_success_total = new client.Counter({
    name: 'zeewordle_logout_success_total',
    help: 'Total count of successful user logouts',
    registers: [myRegister],
});

// Tracks unauthenticated logout attempts (e.g. missing or invalid session ID)
export const zeewordle_logout_unauthorized_total = new client.Counter({
    name: 'zeewordle_logout_unauthorized_total',
    help: 'Total count of logout attempts rejected due to unauthenticated requests',
    registers: [myRegister],
});

// Tracks internal server or session store failures during logout execution
export const zeewordle_logout_dependency_failures_total = new client.Counter({
    name: 'zeewordle_logout_dependency_failures_total',
    help: 'Total count of logout failures caused by session store or server errors',
    registers: [myRegister],
});

//##########################
// Performance Histograms
//##########################

// Measures overall logout processing latency broken down by HTTP status code
export const zeewordle_logout_duration_seconds = new client.Histogram({
    name: 'zeewordle_logout_duration_seconds',
    help: 'Execution duration of the logout request in seconds',
    labelNames: ['status', 'reason'],
    registers: [myRegister],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
});
