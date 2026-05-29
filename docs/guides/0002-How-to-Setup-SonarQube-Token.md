# Configuration of SonarQube Cloud

In this note, we will configure SonarQube Cloud for a monorepo matrix workflow.

## Step 1 - Log into SonarQube Cloud

Go to: `https://sonarcloud.io/login`

## Step 2 - Add a New Project to your organization

1. Click to `Analyze new project`:

![Image - Add a project](../../images/0002-How-to-Setup-SonarQube-Token/2026-05-28-17-09-34.png)

2. Select your repository:

![Image - Select the project](../../images/0002-How-to-Setup-SonarQube-Token/2026-05-28-17-10-40.png)

## Step 3 - Create a Token

1. Go to `my acount`:

![Image - Go to my account](../../images/0002-How-to-Setup-SonarQube-Token/2026-05-28-17-12-13.png)

2. Open the `Security` tab.
3. Generate a new Token:

![Image - Generate Token](../../images/0002-How-to-Setup-SonarQube-Token/2026-05-28-17-14-43.png)

4. Save the Token. ⚠️⚠️ Make sure you copy it now, you won't be able to see it again! ⚠️⚠️

## Step 4 - Add the SonarQube Cloud Token in Github

1. In your GitHub repository, go to `settings` -> `Secrets and variables` -> `actions` -> `New repository secret`

![Image - secrets and variables](../../images/0002-How-to-Setup-SonarQube-Token/2026-05-28-17-25-13.png)

2. Add the `sonarQube Cloud Token` as a secret.

![Image - Add secret](../../images/0002-How-to-Setup-SonarQube-Token/2026-05-28-17-27-04.png)

