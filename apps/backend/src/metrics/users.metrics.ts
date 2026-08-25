import client from 'prom-client';
import { myRegister } from './registry.ts';

// ############################################################################
// Get Profile
// ############################################################################

//##########################
// Business & Security Counters
//##########################

// Tracks successful profile fetch requests
export const zeewordle_profile_success_total = new client.Counter({
    name: 'zeewordle_profile_success_total',
    help: 'Total count of successful user profile retrievals',
    registers: [myRegister],
});

// Tracks requests rejected due to missing or unauthenticated sessions
export const zeewordle_profile_unauthorized_total = new client.Counter({
    name: 'zeewordle_profile_unauthorized_total',
    help: 'Total count of profile requests rejected due to missing active session',
    registers: [myRegister],
});

// Tracks cases where a session exists but the referenced user ID is missing in database
export const zeewordle_profile_not_found_total = new client.Counter({
    name: 'zeewordle_profile_not_found_total',
    help: 'Total count of profile requests where the session user ID was not found in database',
    registers: [myRegister],
});

// Tracks internal server or database errors during profile retrieval
export const zeewordle_profile_dependency_failures_total = new client.Counter({
    name: 'zeewordle_profile_dependency_failures_total',
    help: 'Total count of profile request failures caused by database or server errors',
    registers: [myRegister],
});

//##########################
// Performance Histograms
//##########################

// Measures specific duration of the getUserById database query
export const zeewordle_profile_db_lookup_duration_seconds =
    new client.Histogram({
        name: 'zeewordle_profile_db_lookup_duration_seconds',
        help: 'Execution duration of the database user lookup by ID in seconds',
        registers: [myRegister],
        buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
    });

// Measures overall processing duration of the profile endpoint broken down by status code
export const zeewordle_profile_duration_seconds = new client.Histogram({
    name: 'zeewordle_profile_duration_seconds',
    help: 'Execution duration of the profile request in seconds',
    labelNames: ['status', 'reason'],
    registers: [myRegister],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
});

// ############################################################################
// Delete Account
// ############################################################################

//##########################
// Business & Security Counters
//##########################

// Tracks total successful account deletions
export const zeewordle_delete_account_success_total = new client.Counter({
    name: 'zeewordle_delete_account_success_total',
    help: 'Total count of successfully deleted user accounts',
    registers: [myRegister],
});

// Tracks deletion attempts rejected due to missing or unauthenticated sessions
export const zeewordle_delete_account_unauthorized_total = new client.Counter({
    name: 'zeewordle_delete_account_unauthorized_total',
    help: 'Total count of account deletion attempts rejected due to missing active session',
    registers: [myRegister],
});

// Tracks deletion attempts where the authenticated user ID no longer exists in database
export const zeewordle_delete_account_not_found_total = new client.Counter({
    name: 'zeewordle_delete_account_not_found_total',
    help: 'Total count of account deletion requests where the session user ID was not found in database',
    registers: [myRegister],
});

// Tracks internal server, database, or session store failures during account deletion
export const zeewordle_delete_account_dependency_failures_total =
    new client.Counter({
        name: 'zeewordle_delete_account_dependency_failures_total',
        help: 'Total count of account deletion failures caused by database, session store, or server errors',
        registers: [myRegister],
    });

//##########################
// Performance Histograms
//##########################

// Measures specific duration of the getUserById check before account deletion
export const zeewordle_delete_account_db_lookup_duration_seconds =
    new client.Histogram({
        name: 'zeewordle_delete_account_db_lookup_duration_seconds',
        help: 'Execution duration of the database user lookup check before deletion in seconds',
        registers: [myRegister],
        buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
    });

// Measures specific duration of the deleteUserById database query execution
export const zeewordle_delete_account_db_delete_duration_seconds =
    new client.Histogram({
        name: 'zeewordle_delete_account_db_delete_duration_seconds',
        help: 'Execution duration of the database deleteUserById query in seconds',
        registers: [myRegister],
        buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
    });

// Measures overall processing duration of the delete account endpoint broken down by status code
export const zeewordle_delete_account_duration_seconds = new client.Histogram({
    name: 'zeewordle_delete_account_duration_seconds',
    help: 'Execution duration of the account deletion request in seconds',
    labelNames: ['status', 'reason'],
    registers: [myRegister],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
});
