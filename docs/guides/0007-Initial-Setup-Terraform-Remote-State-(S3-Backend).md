# Initial Setup: Infrastructure Deployment

When deploying this project for the **very first time**, you need to follow a 2-step process to set up the infrastructure. This avoids the classic "chicken-and-egg" issue: Terraform cannot store state in an S3 bucket that doesn't exist yet.

To solve this, the architecture is split into two folders:

* `00_bootstrap`: Provisions the remote S3 backend bucket.
* `showcase`: Deploys the main application infrastructure using the newly created S3 backend.

---

## Step 1: Bootstrap the S3 Backend (`00_bootstrap`)

1. Navigate to the bootstrap directory:

```bash
cd 00_bootstrap
```

2. Fill in the `env.auto.tfvars` file with your configuration values (such as the name, region, and project_name tags).
3. Initialize and apply the bootstrap configuration to create the S3 state bucket:

```bash
terraform init
terraform apply
```

---

## Step 2: Deploy Main Infrastructure (`showcase`)

1. Navigate to the main project directory:

```bash
cd ../showcase
```

2. Fill in the `env.auto.tfvars` file with your configuration values (such as the name, region, and project_name tags).

3. Open `main.tf` and update the `backend "s3"` block with the exact bucket name configured in `00_bootstrap`:

```hcl
terraform {
  backend "s3" {
    bucket       = "zeewordle-tfstate-zeeward41" # Match your bootstrap bucket name
    key          = "terraform/state"
    region       = "eu-west-3"
    encrypt      = true
    use_lockfile = true
  }
}

```

4. Initialize Terraform to connect to the remote S3 backend:

```bash
terraform init

```

5. Deploy the infrastructure:

```bash
terraform apply

```

Your infrastructure state is now securely stored and locked in Amazon S3!
