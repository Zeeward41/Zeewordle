# Issue: Backend Environment Conflict with Vite

## Problem
Ran into configuration friction while trying to dynamically map the `PORT` and environment variables via SOPS/dotenv inside the Vite-backed server setup. 

## Quick Resolution
Bypassed Vite execution for the backend and switched the dev runtime to `nodemon` + `tsx`. Kept Vite config files dormant to prevent monorepo workspace breakage.

## Long-term Architectural Decision
This friction triggered a deeper discussion about bundlers vs runtimes for our backend API. 
👉 **See detailed justification in [ADR 009: Backend Execution Environment](../adr/0009-Backend-Execution-Environment-with-Nodemon-and-TSX.md)**.
