# Guide to configure SonarQube Cloud.

## Step 1 - Configure SonarQube Token

[SonarQube Token Creation Guide](./0002-How-to-Setup-SonarQube-Token.md)

## Step 2 - Workflow Configuration

⚠️ Important:
Do not use a `sonar-project.properties` file at the root level. Since I use a matrix workflow, the configuration must be inlined directly as workflow arguments to prevent path resolution conflicts.

⚠️ Important: Do not write comments (using #) inside the `args block`, as SonarQube will try to parse them as arguments and crash the pipeline.

Add the following step to your GitHub Actions workflow file:
```txt
- name: 🚀 Run SonarQube Analysis
uses: sonarsource/sonarqube-scan-action@v8.1.0
env:
  SONAR_TOKEN: ${{ secrets.SONARQUBECLOUD_TOKEN }}
with:
  projectBaseDir: apps/${{ matrix.changes }}
  args: |
# Defines the unique identifier used by SonarCloud to track this specific application
    -Dsonar.projectKey=Zeeward41_Zeewordle_${{ matrix.changes }}
    -Dsonar.organization=zeeward41
# Sets the display name that will appear on the SonarCloud web dashboard interface
    -Dsonar.projectName=Zeewordle-${{ matrix.changes }}
# The paths to the code and tests
    -Dsonar.sources=src
# We tell SonarQube which files in src are tests
    -Dsonar.tests=src/tests
# We ask SonarQube to ignore these files in the analysis of the main source code
    -Dsonar.exclusions=src/tests/**
# Tell SonarQube where to find the Vitest test coverage report to display the percentage of tested code
    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.inf

```

To find your `project Key`. Go to `Favorite projects` -> `Zeewordle` -> `Project Information`

![Image - Favorite projects](../../images/0002-config-sonarQubeCloud/2026-05-28-17-34-57.png)
![Image - Project Key](../../images/0002-config-sonarQubeCloud/2026-05-28-17-35-53.png)

### Note: Test Coverage

To allow `SonarQube` to display your test coverage percentage, ensuring Vitest generates the `LCOV report` is mandatory. Update your `package.json` scripts:
```txt
"test": "vitest run --coverage.enabled=true --coverage.reporter=lcov"
```

