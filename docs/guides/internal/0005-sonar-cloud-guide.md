# Guide to configure SonarQube Cloud.

## Step 1 - Configure SonarQube Token

[SonarQube Token Creation Guide](./0002-How-to-Setup-SonarQube.md)

## Step 2 - Workflow Configuration

⚠️ Important:
Do not use a `sonar-project.properties` file at the root level. Since I use a matrix workflow, the configuration must be inlined directly as workflow arguments to prevent path resolution conflicts.

⚠️ Important: Do not write comments (using #) inside the `args block`, as SonarQube will try to parse them as arguments and crash the pipeline.

Add the following step to your GitHub Actions workflow file:
```txt
- name: Run SonarQube Analysis
  uses: sonarsource/sonarqube-scan-action@v8.1.0
  env:
      SONAR_TOKEN: ${{ secrets.SONARQUBECLOUD_TOKEN }}
  with:
      projectBaseDir: apps/${{ matrix.changes }}
      args: |
          -Dsonar.projectKey=Zeeward41_Zeewordle_${{ matrix.changes }}
          -Dsonar.organization=zeeward41
          -Dsonar.projectName=Zeewordle-${{ matrix.changes }}
          -Dsonar.sources=src
          -Dsonar.tests=src/tests
          -Dsonar.exclusions=src/tests/**
          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
          -Dsonar.qualitygate.wait=true
          -Dsonar.qualitygate.timeout=150
          -Dsonar.branch.name=main

```

To find your `project Key`. Go to `Favorite projects` -> `Zeewordle` -> `Project Information`

![Image - Favorite projects](../../../images/0005-sonar-cloud-guide/2026-05-28-17-34-57.png)
![Image - Project Key](../../../images/0005-sonar-cloud-guide/2026-05-28-17-35-53.png)

### Note: Test Coverage

To allow `SonarQube` to display your test coverage percentage, ensuring Vitest generates the `LCOV report` is mandatory. Update your `package.json` scripts:
```txt
"test": "vitest run --coverage.enabled=true --coverage.reporter=lcov"
```

