# Wild Spots API

RESTful API for the Wild Spots application, built with Node.js, Express, and Supabase.

## Deployed Application

https://main.ds390r36pvryt.amplifyapp.com/

### Notes
- Incomplete Features: Couldn't get OTP through Supabase to work
- Support Contact: jaelder@csuchico.edu
- Announcement: I have given my best to get the app running to the best of my ability

## Features

- User authentication and authorization with JWT
- Profile management
- Campsite discovery and management
- Reviews and comments
- User lists and favorites
- Verification system
- Content reporting and moderation
- User following system

## API Documentation

For detailed API documentation, please refer to the OpenAPI specification in `docs/openapi.yaml` or access the interactive documentation when the API is running.

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Supabase project with database schema set up

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jaelder363/wildspots.git
   cd wildspots/api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `api` directory with the following variables:
   ```env
   PORT=8080
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations (if any):
   ```bash
   # Check the migrations directory for SQL files
   ```

### Running the Application

```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:8080` by default.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate token

### Profiles
- `GET /profiles` - List profiles
- `GET /profiles/:profile_id` - Get profile by ID
- `POST /profiles` - Create or update profile
- `PUT /profiles/:profile_id` - Update profile

### Campsites
- `GET /campsites` - List campsites with filters
- `POST /campsites` - Create a new campsite
- `GET /campsites/:campsite_id` - Get campsite by ID
- `PUT /campsites/:campsite_id` - Update campsite
- `DELETE /campsites/:campsite_id` - Delete campsite

### Reviews
- `GET /reviews` - List reviews with filters
- `POST /reviews` - Create a new review
- `GET /reviews/:review_id` - Get review by ID
- `PUT /reviews/:review_id` - Update review
- `DELETE /reviews/:review_id` - Delete review

### Comments
- `GET /comments` - List comments with filters
- `POST /comments` - Create a new comment
- `GET /comments/:comment_id` - Get comment by ID
- `PUT /comments/:comment_id` - Update comment
- `DELETE /comments/:comment_id` - Delete comment

### Lists
- `GET /lists` - Get user's lists
- `POST /lists` - Create a new list
- `GET /lists/:list_id` - Get list by ID
- `PUT /lists/:list_id` - Update list
- `DELETE /lists/:list_id` - Delete list

### List Items
- `GET /list-items` - Get list items
- `POST /list-items` - Add item to list
- `GET /list-items/:list_item_id` - Get list item by ID
- `PUT /list-items/:list_item_id` - Update list item
- `DELETE /list-items/:list_item_id` - Remove item from list

### Verification Requests
- `GET /verification-requests` - List verification requests (admin)
- `POST /verification-requests` - Submit verification request
- `GET /verification-requests/my-request` - Get current user's verification request
- `POST /verification-requests/:request_id/approve` - Approve request (admin)
- `POST /verification-requests/:request_id/reject` - Reject request (admin)

### Reports
- `GET /reports` - List reports (admin/moderator)
- `GET /reports/my-reports` - Get current user's reports
- `POST /reports` - Submit a report
- `GET /reports/:report_id` - Get report by ID
- `PUT /reports/:report_id/status` - Update report status (admin/moderator)

### Follows
- `GET /follows` - Get follow relationships
- `POST /follows/:user_id` - Follow a user
- `DELETE /follows/:user_id` - Unfollow a user
- `GET /follows/check/:user_id` - Check if following a user

## Error Handling

The API uses standard HTTP status codes and provides JSON error responses in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details (if any)
    }
  }
}
```

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer your_jwt_token
```

## Rate Limiting

API requests are rate limited to prevent abuse. The current limits are:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

## Deployment

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | Port to run the server on (default: 8080) |
| NODE_ENV | No | Environment (development, production) |
| SUPABASE_URL | Yes | Supabase project URL |
| SUPABASE_ANON_KEY | Yes | Supabase anon/public key |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Supabase service role key |
| JWT_SECRET | Yes | Secret for signing JWT tokens |
| RATE_LIMIT_WINDOW_MS | No | Rate limit window in milliseconds (default: 60000) |
| RATE_LIMIT_MAX | No | Max requests per window (default: 100) |

### Deployment to Production

1. Set up a production database and update the connection string
2. Set `NODE_ENV=production`
3. Use a process manager like PM2 to run the application:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name wildspots-api
   ```
4. Set up a reverse proxy (Nginx, Apache) with SSL termination
5. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployed Application
https://main.ds390r36pvryt.amplifyapp.com/ 

Imcomplete Features- couldn't get otp through supabase to work

Support Contact Method
jaelder@csuchico.edu

Announcement - I have given my best to get the app running hopefully to good enough ability 