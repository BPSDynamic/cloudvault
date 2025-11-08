# CloudVault Repository Setup Instructions

Repository: **https://github.com/BPSDynamic/cloudvault.git**

## Quick Start (Automated)

1. **The repository already exists on GitHub at:**
   https://github.com/BPSDynamic/cloudvault

2. **Set up locally:**
   ```bash
   cd ~/Documents/App_Clone
   mkdir cloudvault
   cd cloudvault
   git init
   git branch -m main
   ```

3. **Download the starter files:**
   - Download README.md and .gitignore from this conversation
   - Place them in the cloudvault directory

4. **Run the setup script:**
   ```bash
   chmod +x setup-cloudvault.sh
   ./setup-cloudvault.sh
   ```
   - The script will automatically push everything to GitHub

## Manual Setup (Alternative)

If you prefer to do it manually:

```bash
cd ~/Documents/App_Clone
mkdir cloudvault
cd cloudvault
git init
git branch -m main

# Add the starter files (README.md and .gitignore)

# Configure git (if needed)
git config user.email "your-email@example.com"
git config user.name "Rendani Tshivhangani"

# Commit
git add .
git commit -m "Initial commit: CloudVault project setup"

# Add remote
git remote add origin https://github.com/BPSDynamic/cloudvault.git

# Push to GitHub
git push -u origin main
```

## Verify Setup

After setup, verify everything worked:

```bash
git remote -v
git status
git log
```

You should see:
- Remote origin pointing to your GitHub repository
- A clean working tree
- Your initial commit in the log

## Next Steps

Your CloudVault repository is now ready! You can:
- Start developing your cloud storage solution
- Add collaborators on GitHub
- Set up CI/CD pipelines
- Configure branch protection rules

## Troubleshooting

**If push fails with authentication error:**
- GitHub now requires personal access tokens or SSH keys
- Create a token at: https://github.com/settings/tokens
- Or set up SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**If repository already exists:**
```bash
git remote remove origin
git remote add origin https://github.com/BPSDynamic/cloudvault.git
git push -u origin main
```

**If you need to update your email:**
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Rendani Tshivhangani"
```
