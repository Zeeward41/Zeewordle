# Issue: SonarQube Configuration File Not Found in Matrix Workflow

## Problem

Since I am using a GitHub Actions matrix strategy based on frontend and backend paths, the SonarQube Action is unable to locate the configuration file situated at the project root.

## Cause

By using `projectBaseDir: apps/${{ matrix.changes }}`, the GitHub Action switches its working directory directly into the application's subfolder (e.g., `apps/frontend`) and looks for a `sonar-project.properties` file there. Because the file remains at the global root of the monorepo, SonarQube finds no configuration and fails.

## Solution

Instead of creating two separate configuration files for the frontend and backend, I integrate the configuration settings directly into the workflow file as arguments.
