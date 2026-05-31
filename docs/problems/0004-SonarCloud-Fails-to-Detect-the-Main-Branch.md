# Issue: SonarCloud Fails to Detect the Main Branch in Monorepo

## Problem
We are using the Free Plan of SonarCloud for this project. Since the free tier only supports scanning the primary branch, SonarCloud must be able to correctly identify our `main` branch. 

However, during the initial workflow run, the scanner fails to bind properly and throws a `Project not found` error or updates the wrong context because it cannot automatically detect or match our `main` branch.

## Cause
According to the SonarCloud/SonarQube documentation (*Setting up the branch analysis*):

> "SonarQube keeps its own notion of the project’s main branch. That branch can differ from the default branch in your SCM or CI (for example, your repository uses develop as the main branch while SonarQube uses main as the main branch). When they don’t match, an analysis of your repository’s default branch can update the wrong branch in SonarQube.
> 
> This often happens because:
> - The CI's main branch name is available in the CI environment variables, but the SonarScanner does not set it explicitly as the main branch for SonarQube.
> - SonarQube then defaults to using its current main branch to receive the analysis.
> 
> The result is that you analyze your default branch in CI (in the example, develop) but SonarQube applies the results to a different branch (in the example, main)."

In our specific monorepo setup, because the project keys are generated dynamically by the GitHub Actions matrix, SonarCloud cannot automatically provision the projects with the correct branch bindings on the very first scan.

## Solution
To fix this, each project inside the monorepo **must be created manually on SonarCloud prior to running the first CI scan**. This ensures the branch bindings and project keys are correctly initialized.

The setup guide has been updated to reflect these mandatory configuration steps:
👉 [How to setup SonarQube / SonarCloud](../guides/0002-How-to-Setup-SonarQube.md)
