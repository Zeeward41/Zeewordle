# Managing .env Files & Secrets with SOPS + Age (Frontend & Backend)

This guide explains how to set up environment variables for both the frontend and backend.
Please note that the backend uses **SOPS** and **Age** to encrypt `.env` files, allowing them to be safely committed to the Git repository.

## Frontend

Setting up the frontend is straightforward. A `.env.example` file is provided with all the necessary variables required for the project to run.

1. Copy the example file to create your local `.env` file:
```bash
cp .env.example .env

```


2. Update the variables in `.env` with your desired local values.

## Backend

The backend setup is a bit more advanced, as it requires installing **SOPS** and **Age** to encrypt and decrypt sensitive project files.

For installation instructions, please refer to their official repositories:
* **SOPS**: [github.com/getsops/sops](https://github.com/getsops/sops)
* **Age**: [github.com/FiloSottile/age](https://github.com/FiloSottile/age)

---

### Step 1 — Generating Public and Private Keys with Age

Run the following command:

```bash
age-keygen -o key.txt

```

This generates a key file containing both a public and a private key:

![Image - key file](../../images/0006-Managing-env-Files-&-Secrets-with-SOPS-Age-(Frontend-&-Backend)/2026-07-23-14-20-21.png)

⚠️ **Important:** Move your `key.txt` file to the default SOPS directory (e.g., `~/.config/sops/age/keys.txt` on Linux/macOS or `%AppData%\sops\age\keys.txt` on Windows),
or export its path via the `SOPS_AGE_KEY_FILE` environment variable:
 ```bash
export SOPS_AGE_KEY_FILE="$HOME/.config/sops/age/keys.txt"
```
 
 

---

### Step 2 — Configuring SOPS

To avoid passing the public key manually with every command, a `.sops.yaml` configuration file is placed at the root of the project.

![Image - 2 - configuring sops](../../images/0006-Managing-env-Files-&-Secrets-with-SOPS-Age-(Frontend-&-Backend)/2026-07-23-14-24-42.png)

**Tip:** The `path_regex` rule automatically applies this Age public key to any file ending with `.enc.env`. This clearly distinguishes encrypted files from plain text files.

---

### Step 3 — Creating Your Local `development.enc.env` File

1. Delete the default encrypted file from `config/development.enc.env`

2. Create a local plain text file named `development.env` with your desired values:

```env
NODE_ENV=development
PORT=5000
SESSION_SECRET=SomethingReallySecret

```

3. Encrypt it using SOPS:

```bash
sops --encrypt development.env > development.enc.env

```

*(Since `.sops.yaml` is configured, SOPS automatically detects the target public key.)*
3. You can now safely delete the unencrypted `development.env` file.

---

### 💡 Useful Commands

* **View decrypted content directly in the terminal:**

```bash
sops -d development.enc.env
```

* **Edit an encrypted file in place:**

```bash
sops development.enc.env
```

### Step 4 — Adding the Age Key to GitHub Secrets

To allow GitHub Actions to decrypt your secrets during deployment:

1. Go to your repository on GitHub: **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Name: `SOPS_AGE_KEY`
4. Value: Paste the entire content of your `key.txt` file (including the `AGE-SECRET-KEY-1...` line).
