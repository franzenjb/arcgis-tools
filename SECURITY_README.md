# Security Update - 2026-01-28

## 🔒 Security Incident Resolved

### What Happened:
- Hardcoded API tokens were discovered in `open-lab.html`
- Tokens included: Mapbox, Cesium Ion, and an unknown API key
- These tokens were publicly exposed in the GitHub repository

### Actions Taken:
1. **Tokens Removed**: All hardcoded tokens have been removed from the code
2. **Environment Variables**: Tokens now use environment variables
3. **Security Warning**: Added security notice to the application
4. **Documentation**: Created `.env.example` and this security guide

### Immediate Next Steps:

#### 1. **Rotate Exposed Tokens** (URGENT):
- **Mapbox**: Log into https://account.mapbox.com/access-tokens/ and revoke the exposed token
- **Cesium Ion**: Log into https://cesium.com/ion/tokens and revoke the exposed token
- **Unknown API Key**: Identify the service and rotate the key

#### 2. **Set Up Environment Variables**:
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual tokens
nano .env  # or use your preferred editor
```

#### 3. **Update .gitignore**:
Make sure `.env` is in your `.gitignore` file:
```
# Environment variables
.env
.env.local
.env.*.local
```

### For Development:
```bash
# Set environment variables
export MAPBOX_ACCESS_TOKEN="your_token_here"
export CESIUM_ION_ACCESS_TOKEN="your_token_here"
export ARCGIS_API_KEY="your_token_here"

# Or use a .env file with a tool like dotenv
```

### For Production/Deployment:
- Use your hosting platform's environment variable settings
- Never commit actual tokens to version control
- Use different tokens for different environments

### Security Best Practices:
1. **Never hardcode tokens** in source code
2. **Use environment variables** for all configuration
3. **Rotate tokens regularly** (every 90 days recommended)
4. **Use token restrictions** when available (IP whitelisting, rate limits)
5. **Monitor token usage** for suspicious activity

### Verification:
- [ ] All exposed tokens have been rotated
- [ ] `.env` file is created with new tokens
- [ ] `.env` is added to `.gitignore`
- [ ] Application works with environment variables
- [ ] Old tokens are revoked in their respective services

### Contact:
If you have questions or need help with token rotation, please reach out.

---
*Last updated: 2026-01-28*  
*Security audit conducted by automated security scanning*