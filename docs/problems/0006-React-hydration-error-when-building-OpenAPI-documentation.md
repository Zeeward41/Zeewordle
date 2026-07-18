# Issue: React hydration error when building OpenAPI documentation

## Problem
After building the API documentation via Redocly and placing it in the frontend's public folder, in order to create
an `/api-doc` route to access the API documentation from the site, several React errors related to hydration occurred in the console.

## Errors observed
- `Uncaught Error: Minified React error #418`
- `Uncaught Error: Minified React error #423`

The page content still rendered correctly, but the console errors indicated a hydration mismatch happening
during the initial load of the generated documentation.

## Root cause
This is a known upstream bug in `@redocly/cli`, related to the download button component causing a
hydration mismatch between the pre-rendered static HTML and the client-side React render. The issue has
been reported and persists across several versions of the CLI. See:
- https://github.com/Redocly/redocly-cli/issues/2113
- https://github.com/Redocly/redoc/issues/2734

## Resolution
Disabling the documentation's download button fixed the problem. Simply adding
`--theme.openapi.hideDownloadButton` during the build resolved it.

### Command used
```bash
pnpm exec redocly build-docs ../../docs/api/openapi.yaml -o ../frontend/public/docs/api-docs.html --theme.openapi.hideDownloadButton
```

## Trade-off
The download button is no longer available in the API doc UI. This was considered an acceptable
trade-off since it's not a critical feature for our use case.
