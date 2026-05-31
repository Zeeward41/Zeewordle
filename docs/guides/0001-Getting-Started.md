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
