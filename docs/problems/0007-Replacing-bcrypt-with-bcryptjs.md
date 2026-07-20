# Issue: Replacing bcrypt with bcryptjs

## Problem
When building the backend Docker image, using `node:26-alpine` (chosen to reduce the final image size) caused issues with `bcrypt`, which requires compiling a native binding (C++) during installation. This compilation needs tools absent from the Alpine image (`node-gyp`, `python3`, `make`, `g++`), and the compiled binding isn't guaranteed to be compatible between glibc (Debian) and musl (Alpine) anyway.

## Resolution
Rather than adding compilation tools to the image (which would have increased its size, defeating the original purpose), the chosen solution was to replace `bcrypt` and `@types/bcrypt` with `bcryptjs` and `@types/bcryptjs`, a pure JavaScript implementation with no native binding, offering a strictly compatible API (`hash`, `compare`, `genSalt`).

## Trade-off
Since `bcryptjs` is a pure JS implementation, it's slightly slower than native `bcrypt` at high hashing costs. This difference is negligible for this showcase project.
