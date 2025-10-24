# Product Requirements Document (PRD)


## WildSpots


- Purpose: Community-driven platform to post, share, and discover camping sites.
- Core features: Photo uploads, reviews, wildlife tags, remoteness ratings, filters (terrain, price), profile verification.


## Scope v0


- Anonymous browse
- Auth with Supabase
- Create/list campsites
- Reviews + ratings
- Basic filters
#  WildSpots – Product Requirements Document


## Project Description
WildSpots is a **community-driven camping application** designed to help users discover, share, and review unique camping sites.  
The app encourages campers to upload photos, rate campsites, tag wildlife, and describe site conditions.  
Users can filter campsites by distance, terrain, price, and available resources — while verified profiles ensure trustworthy, authentic content.  
Offline functionality supports adventurers who explore remote areas without stable internet access.


---


## Technical Architecture


**Frontend:**
- React (Vite) – Progressive Web App optimized for iOS, Android, and desktop  
- TailwindCSS for UI design and responsive styling  
- Map integration using Leaflet or Google Maps API  
- IndexedDB + Service Workers for offline caching and saved maps  


**Backend:**
- Node.js with Express API for campsite data, user posts, and reviews  
- Supabase (PostgreSQL) for data storage, file uploads, and authentication  
- JWT-based user sessions for security and verified profiles  
- RESTful endpoints for posts, comments, verification requests, and reports  


**Offline Functionality:**
- Service workers to store and retrieve offline data  
- IndexedDB for caching saved campsites and map tiles  
- Background sync for uploading posts once reconnected  


**Tools & Infrastructure:**
- **Windsurf** for project management and workflow tracking  
- **GitHub** for source control and versioning  
- **Vercel / Netlify** for front-end deployment  
- **Supabase** for hosting backend + database  
- **Postman** for API testing and documentation  


---


## Core Features


| Feature | Description |
|----------|--------------|
| **Campsite Posting** | Upload photos, reviews, ratings, wildlife tags, and remoteness scores |
| **Search & Filter** | Find campsites by terrain, price, distance, or resource availability |
| **Map View** | Display campsite results on an interactive map |
| **Offline Maps** | Download detailed maps and saved campsite data for offline use |
| **Verification System** | Request verification to display a checkmark badge on profiles |
| **Community Interaction** | Follow, comment, and engage with other campers’ posts |
| **Admin Tools** | Approve verifications, review reports, and moderate content |


---


## Target Users


**Campers (General Users):**
- Frequent outdoor explorers seeking authentic and detailed campsite information.  
- **Goals:** Share experiences, find reliable recommendations, and contribute verified data.


**Casual Users:**
- Occasional campers or beginners who browse or save locations.  
- **Goals:** Quickly discover safe, affordable, and nearby campsites.


**Administrators:**
- Moderators ensuring the accuracy and integrity of user content.  
- **Goals:** Verify users, remove false data, and maintain community standards.


---


## Usage Context
- **Platforms:** iOS, Android, Desktop (via PWA)  
- **Primary Environments:** Home, travel planning, and outdoor (campgrounds, trails)  
- **Conditions:**  
  - Internet connection required for uploading and syncing posts  
  - Offline mode supported for viewing saved maps and campsite data  


---


## Success Metrics
- Growth in verified users (% of total users)  
- Increase in active campsite posts and reviews  
- Reduction in reported or flagged content  
- Average user retention rate after 30 days  
- Map feature usage and offline downloads  


---


## Risks & Mitigation


| Risk | Mitigation |
|------|-------------|
| False or misleading campsite data | Implement verification badges and admin moderation |
| Poor connectivity in remote areas | Enable offline storage and map caching |
| Storage issues from media uploads | Use Supabase storage with compression and file limits |
| Security and privacy concerns | Use encrypted auth tokens and secure database rules |


---


## Future Enhancements
- Gamification (badges, leaderboards for verified explorers)  
- Group trip planner and shared itineraries  
- Advanced wildlife tagging and environmental overlays  
- Route tracking and navigation integration  
- Social features like DMs or camping groups  


---


## Repository
**GitHub:** [https://github.com/jaelder363/wildspots](https://github.com/jaelder363/wildspots).
