#  WildSpots – Workspace Rules


This document defines the development workflow, naming conventions, and collaboration standards for the **WildSpots** project.  
All contributors should follow these rules to maintain consistency, code quality, and smooth integration between teams.


---


##  Repository Structure
- **`main`** – Production-ready branch; always stable and deployable.  
- **`dev`** – Integration branch; all approved feature branches merge here first.  
- **`feature/*`** – New features or enhancements.  
- **`bugfix/*`** – Fixes for reported issues.  
- **`hotfix/*`** – Urgent fixes directly from production (merged back into `main` and `dev`).  
- **`docs/*`** – Documentation updates only.


**Example:**
feature/offline-map-caching
bugfix/profile-verification-error
docs/update-readme


markdown
Copy code


---


##  Naming Conventions


**Branches:**
- Use lowercase with hyphens:  
  - `feature/add-map-component`  
  - `bugfix/fix-rating-stars`


**Files & Folders:**
- Use **kebab-case** for files: `campsite-card.js`, `map-filter-panel.css`
- Use **PascalCase** for React components: `MapView.jsx`, `UserProfile.jsx`
- Use **camelCase** for variables and functions:  
  ```js
  const fetchUserData = async () => {...}



