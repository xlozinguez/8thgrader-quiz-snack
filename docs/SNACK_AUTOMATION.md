# 📱 Automated Expo Snack Publishing

This guide explains how to set up automated Expo Snack publishing via GitHub Actions.

## 🚀 What It Does

Every time you push to the `master` branch, the CI will:
1. ✅ Run all tests and validation checks
2. 📦 Create a Snack-compatible package
3. 📱 Automatically publish/update your Expo Snack
4. 💬 Comment on commits with the Snack URL
5. 📊 Provide detailed deployment summaries

## ⚙️ Setup Instructions

### 1. Get Your Expo Authentication Token

```bash
# Login to Expo (if not already logged in)
npx expo login

# Get your authentication token
npx expo whoami --auth-token
```

Copy the token that's displayed.

### 2. Add Repository Secrets

Go to your GitHub repository:
1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Required |
|-------------|-------|----------|
| `EXPO_TOKEN` | Your auth token from step 1 | ✅ Yes |
| `EXPO_USERNAME` | Your Expo username | ⚠️ Optional |

### 3. Test the Automation

1. Make any change to your code
2. Commit and push to `master`:
   ```bash
   git add .
   git commit -m "Test automated Snack publishing"
   git push origin master
   ```
3. Check the **Actions** tab in GitHub to see the workflow run
4. Look for commit comments with the Snack URL

## 📋 What Gets Published

The automation creates a clean Snack package containing:
- All React Native screens and components
- Flashcard data (460+ cards)
- Navigation setup
- Expo-compatible `app.json`
- User-friendly README for Snack users

## 🔧 Customization Options

### Snack Metadata
Edit the workflow file (`.github/workflows/ci.yml`) to customize:
- Snack name and description
- SDK version
- Dependencies

### Publishing Conditions
By default, Snacks are published only on:
- Pushes to `master` branch
- When all CI tests pass

To change this, modify the `if` condition in the `publish-snack` job.

### Manual Override
You can also manually trigger Snack creation:
1. Go to **Actions** tab
2. Select **CI/CD** workflow
3. Click **Run workflow**
4. Choose the branch to deploy

## 🎯 Best Practices

### Version Management
- Each push creates a new Snack version
- Previous versions remain accessible via Expo dashboard
- Consider using semantic versioning in commit messages

### Testing Before Publishing
- The workflow only publishes if all tests pass
- Data integrity checks ensure 460+ flashcards are valid
- Security audits prevent publishing vulnerable code

### Sharing Your Snack
Once published, share your Snack via:
- **Direct URL**: `https://snack.expo.dev/@yourusername/8thgrader-quiz-snack`
- **QR Code**: Available on the Snack page
- **Expo Go**: Search for your Snack in the app

## 🛠️ Troubleshooting

### Common Issues

**"EXPO_TOKEN secret not found"**
- Add the `EXPO_TOKEN` secret to your repository
- Make sure the token is valid (test with `npx expo whoami`)

**"Authentication failed"**
- Your token may have expired
- Generate a new token with `npx expo whoami --auth-token`

**"Snack publishing failed"**
- Check the GitHub Actions logs for detailed error messages
- Ensure all dependencies are compatible with Expo Snack
- Verify your Expo account has Snack publishing permissions

### Getting Help

1. Check the **Actions** tab for detailed logs
2. Review commit comments for status updates
3. Visit [Expo Documentation](https://docs.expo.dev/workflow/snack/) for Snack-specific help

## 📊 Monitoring

### GitHub Actions Dashboard
- View all workflow runs in the **Actions** tab
- Each run shows test results, validation status, and publishing logs
- Failed runs include detailed error messages

### Commit Comments
Every successful deployment adds a comment to the commit with:
- ✅ CI status
- 📱 Snack URL (if published)
- 📊 Data validation results
- 🎯 App features summary

### Expo Dashboard
- Visit [expo.dev](https://expo.dev) to manage your published Snacks
- View usage analytics and user feedback
- Update Snack settings and permissions

---

🎓 **Perfect for educators!** Students can instantly access the latest version of the quiz app by scanning the QR code or visiting the Snack URL.