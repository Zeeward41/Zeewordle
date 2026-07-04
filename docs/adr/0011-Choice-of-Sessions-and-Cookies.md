# ADR 0011: Choice of Sessions and Cookies

**Status:** ✅ Accepted
**Date:** 04/07/2026

## 1. Context

To manage user authentication and maintain state across an Express application, a secure mechanism is required. Several approaches are available in the Node.js/Express ecosystem, including JWT (JSON Web Tokens) stored in LocalStorage or cookies, server-side Sessions paired with HTTP cookies (Stateful), or external protocols such as `OAuth2 + OIDC`.

## 2. Decision

We decided to adopt **Sessions and Cookies (Stateful Authentication)**.

While JWTs are highly practical for stateless architectures, handling instant token revocation (e.g., during a logout or user ban) is notoriously complex and often requires introducing a centralized blocklist. Server-side sessions solve this issue natively and elegantly: if a session is destroyed on the server, the user is instantly logged out.

## 3. Consequences

### Pros (Positive)

* **Instant Revocation:** Complete control over user sessions; destroying the session on the server side instantly invalidates the user's access.
* **Enhanced Security:** By using cookies configured with `HttpOnly` and `SameSite` flags, we naturally protect the application against XSS (Cross-Site Scripting) token theft.
* **Simplicity:** Session handling and cookie exchange are managed transparently by both browsers and testing tools like Postman via standard headers.

### Cons / Risks (Negative)

* **Scalability Issues:** By default, sessions are stored in memory. If the application scales horizontally across multiple servers, we will need to implement a shared session store (such as Redis).
* **CSRF Vulnerability:** Relying on cookies exposes the application to CSRF (Cross-Site Request Forgery) attacks. This requires strict configuration of the `SameSite` attribute and potentially setting up CSRF protection middleware.
