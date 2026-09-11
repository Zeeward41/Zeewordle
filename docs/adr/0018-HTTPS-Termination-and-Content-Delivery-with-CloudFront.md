# ADR 0018: HTTPS Termination and Content Delivery with CloudFront

**Status:** ✅ Accepted
**Date:** 11/09/2026

## 1. Context

To make the project publicly accessible, several decisions needed to be made: whether to use a dedicated domain name or a subdomain of an existing domain, and how to serve the application to end users in an optimal way.

## 2. Decision

To avoid additional financial cost, we decided to reuse an already-existing domain and deploy the project as a subdomain of it, rather than purchasing a dedicated domain name.

Since the infrastructure already runs on AWS, using CloudFront to serve the site to users was a natural choice, as it comes at no additional cost within our current setup.

To keep the architecture simple, HTTPS is only enforced on the **viewer protocol** (the connection between the end user and CloudFront). The connection between CloudFront and the Nginx origin (EC2) is done over **HTTP**. To keep this reasonably secure despite the lack of end-to-end encryption, the EC2 security group only allows inbound traffic on the origin port from CloudFront's managed IP range, preventing direct access to the origin from the public internet.

**Alternatives considered:**

- **Full end-to-end encryption via Let's Encrypt on both ends**: would provide true end-to-end TLS, but certificate rotation becomes problematic on EC2 spot instances, since the instance can be destroyed and recreated frequently — each cycle would require re-issuing the certificate, risking Let's Encrypt rate limits and downtime during regeneration. Given this is a showcase project, this overhead was not considered justified.

- **ACM for the viewer protocol + Let's Encrypt for the origin protocol**: would also provide end-to-end encryption while keeping ACM's free automatic renewal on the viewer side. However, it introduces the complexity of managing two separate certificate systems, compounded by the same spot-instance rotation problem described above on the origin side.

## 3. Consequences

### Positive (Pros)
- No additional financial cost.
- Simple to implement and maintain.
- No need to manage a second certificate on the origin side, since ACM certificates cannot be attached directly to EC2 instances.
- The security group restriction to CloudFront's IP range ensures that origin traffic only originates from within AWS's internal network, rather than being exposed to the public internet — mitigating, in part, the lack of end-to-end encryption.

### Negative / Risks (Cons)
- Not an optimal security posture, since traffic between CloudFront and the origin (Nginx) is unencrypted.
- The project does not have its own dedicated domain name, and remains dependent on the parent domain.
