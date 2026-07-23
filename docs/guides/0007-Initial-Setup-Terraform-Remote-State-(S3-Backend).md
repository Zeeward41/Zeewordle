# Initial Setup: Terraform Remote State (S3 Backend)

When deploying this project for the **very first time**, you need to follow a quick 2-step bootstrapping process. This avoids a classic "chicken-and-egg" issue: Terraform cannot read or store state in an S3 bucket that doesn't exist yet.

### Why is this necessary?

Terraform evaluates the `backend "s3"` configuration **before** running any code. On a fresh environment, the bucket hasn't been created yet, so `terraform init` will fail if the remote backend is active right away.

### Step 1: Create the S3 Bucket locally

1. Open your configuration file (e.g., `main.tf` or `provider.tf`) and **temporarily comment out** the `backend "s3"` block:

```hcl
terraform {
  # backend "s3" {
  #   bucket       = "zeewordle-tfstate-zeeward41"
  #   key          = "terraform/state"
  #   region       = "eu-west-3"
  #   encrypt      = true
  #   use_lockfile = true
  # }
}

```

2. Initialize Terraform locally:
```bash
terraform init
```

3. Create **only** the S3 state bucket without deploying the rest of the infrastructure:
```bash
terraform apply -target=aws_s3_bucket.terraform_state
```

💡 **Note:** The `-target` flag ensures Terraform ignores all other resources (databases, networking, servers, etc.) and provisions only the bucket.

### Step 2: Migrate State to S3 & Deploy Infrastructure

1. **Uncomment** the `backend "s3"` block in your code.

2. Re-initialize Terraform to connect to the newly created S3 bucket:
```bash
terraform init
```

3. **Confirm the migration:** Terraform will detect your local `terraform.tfstate` file and ask:
*Do you want to copy existing state to the new backend?*

Type **`yes`** to confirm.

4. **Clean up local state files:** Once the state is safely migrated to S3, delete the leftover local state files to prevent sensitive data leaks:
```bash
rm terraform.tfstate terraform.tfstate.backup
```

5. Deploy the rest of your architecture safely:

```bash
terraform apply
```

Your infrastructure state is now securely stored and locked in Amazon S3!

