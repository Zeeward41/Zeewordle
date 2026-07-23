# How to Launch the Project

## Step 1 - Clone the Repository

To clone the repository, click on `Code` -> `HTTPS` -> `copy the link`, then run:

```bash
git clone <link>

```

## Step 2 - Configure the Repository Settings

You must configure a few critical settings to successfully replicate this project.

### 1. Understand How GitHub Actions Work

This project uses GitHub Actions for Continuous Integration. It is important to know that whenever a workflow is launched, GitHub automatically generates a temporary `GITHUB_TOKEN` with permissions to act on behalf of your repository.

### 2. Restrict the Permissions of the GITHUB_TOKEN

To ensure the best security possible, it is vital to apply the principle of least privilege to this automatic token.
👉 [Token restriction Guide](./0003-Token-Restriction-Guide.md)

### 3. Activate the Dependency Graph and Security Features

Several security tools in our workflow require specific GitHub features to be enabled before they can upload their data.
👉 [Dependency Graph and Security Alerts Guide](./0004-How-to-Activate-Dependabot-and-Dependency-graph.md)

### 4. Create a SONAR_TOKEN (for SonarQube Cloud) and use SONAR_TOKEN

This token is mandatory for the CI workflow (`.github/workflows/ci.yaml`) to run successfully. SonarQube Cloud requires it to authenticate and publish code quality reports.
To use the SonarQube token securely without hardcoding it, you must save it as an encrypted GitHub Actions Secret.
👉 [SonarQube Token Creation Guide](./0002-How-to-Setup-SonarQube.md)

### 5. Configure SOPS & Age Secrets for Backend Environment Variables

The backend uses SOPS and Age to securely encrypt environment variables directly in the repository.
To allow continuous deployment or CI workflows to decrypt these secrets properly, you must store your private key securely in GitHub Actions.
👉 [Managing .env Files & Secrets Guide](../guides/0006-Managing-env-Files-&-Secrets-with-SOPS-Age-(Frontend-&-Backend).md)
### 6. Configure S3 Remote Backend for Terraform State

Terraform requires a remote S3 bucket to securely store and share its state file across team members and CI/CD pipelines.
Because the backend S3 bucket cannot exist prior to its deployment, you must follow a 2-step bootstrap process when setting up the environment for the first time.
👉 [Initial Setup: Terraform Remote State (S3 Backend)](./0007-Initial-Setup-Terraform-Remote-State-(S3%20Backend).md)
