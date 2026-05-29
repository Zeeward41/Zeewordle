# How to Activate the Dependency Graph and Security Alerts

Some tools in our CI workflow (like Syft SBOM) require GitHub's data features to be active, otherwise the pipeline will fail with a 404 error.

## Step 1 - Go to Advanced Security of your Repository

Go to your **Repository** -> **Settings** -> **Advanced Security**.

![Image - Settings - Advanced Security](../../images/0004-How-to-Activate-Dependabot-and-Dependency-graph/2026-05-29-21-02-30.png)

## Step 2 - Enable Data Services

Find **Dependency graph** and click **Enable**.

![Image - Dependency graph](../../images/0004-How-to-Activate-Dependabot-and-Dependency-graph/2026-05-29-21-05-01.png)

## Step 2 - Enable Security Alerts

On the same page, find **Dependabot alerts** and click **Enable**.

![Image - Dependabot](../../images/0004-How-to-Activate-Dependabot-and-Dependency-graph/2026-05-29-21-07-56.png)

*(This allows GitHub to scan your dependencies in the background and notify you under the "Security" tab if a vulnerability is found).*

## Step 3 - Grouped Security Updates (Optional but Recommended)

1. Enable **Dependabot security updates**.
2. Ensure **Grouped security updates** is checked so GitHub doesn't spam you with 15 different Pull Requests if a major flaw impacts multiple packages.

![Image - security updates](../../images/0004-How-to-Activate-Dependabot-and-Dependency-graph/2026-05-29-21-08-18.png)
