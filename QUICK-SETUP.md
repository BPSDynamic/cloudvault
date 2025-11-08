# CloudVault - One-Line Setup

Copy and paste this entire command block into your Terminal:

```bash
cd ~/Documents/App_Clone && \
mkdir -p cloudvault && \
cd cloudvault && \
git init && \
git branch -m main && \
echo "Setup complete! Now download the files (README.md, .gitignore, setup-cloudvault.sh) and place them here, then run: ./setup-cloudvault.sh"
```

## What this does:
1. ✅ Navigates to your App_Clone directory
2. ✅ Creates the cloudvault folder
3. ✅ Initializes Git repository
4. ✅ Renames default branch to 'main'

## Next Steps:
1. Download these files and place them in `~/Documents/App_Clone/cloudvault/`:
   - README.md
   - .gitignore
   - setup-cloudvault.sh

2. Make the script executable and run it:
   ```bash
   cd ~/Documents/App_Clone/cloudvault
   chmod +x setup-cloudvault.sh
   ./setup-cloudvault.sh
   ```

3. Done! Your code will be pushed to: https://github.com/BPSDynamic/cloudvault

---

## Even Faster: Clone Existing Repo (if it has content)

If the GitHub repo already has files, you can just clone it:

```bash
cd ~/Documents/App_Clone && \
git clone https://github.com/BPSDynamic/cloudvault.git && \
cd cloudvault && \
echo "✅ Repository cloned successfully!"
```
