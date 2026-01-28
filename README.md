# ArcGIS Python API Tools

Production-ready tools for managing ArcGIS Online content programmatically.

## ⚠️ Security Notice (2026-01-28)

**Important Security Update:** All API tokens have been moved to environment variables. 
Exposed tokens have been removed from the codebase. Please:
1. Rotate your exposed tokens immediately (see `SECURITY_README.md`)
2. Set up environment variables using `.env.example`
3. Never commit `.env` to version control

[View Security Update Details](SECURITY_README.md)

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up credentials (SECURITY CRITICAL)
cp .env.example .env
# Edit .env with your credentials (NEVER commit this file!)

# 3. Test connection
python auth.py

# 4. Run your first audit
python dependency_mapper.py --audit
```

## Tools

### 🔍 Dependency Mapper

Know what breaks before you delete anything.

```bash
# Check if an item is safe to delete
python dependency_mapper.py --item-id abc123def456

# Full content audit - find orphaned layers
python dependency_mapper.py --audit

# Export orphans to CSV
python dependency_mapper.py --audit --export orphans.csv
```

### 📊 Coming Soon

- `scheduled_sync.py` - Auto-sync FEMA/NOAA data
- `content_lifecycle.py` - Find stale content, generate inventories
- `change_detection.py` - Track overnight changes
- `deploy_webmap.py` - CI/CD for GIS configurations

## Project Structure

```
arcgis-tools/
├── auth.py                 # Authentication module (import this)
├── dependency_mapper.py    # Content dependency analysis
├── requirements.txt        # Python dependencies
├── .env.example           # Credential template
└── README.md              # This file
```

## Red Cross Specifics

- Org URL: `https://arc-nhq-gis.maps.arcgis.com`
- Always run dependency check before ANY delete during disaster ops
- Tag convention: `project-name`, `year`, `region`, `data-type`

## Documentation

Full documentation with 20+ capability examples:
- `arcgis-python-api-capabilities.md`
- `arcgis-python-starter-templates.md`

---

*Built for Dragon (Jeff Franzen) - GIS Developer, American Red Cross*
