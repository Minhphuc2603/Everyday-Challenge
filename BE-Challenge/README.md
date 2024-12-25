# OnlyFuns_Backend

This repository contains the backend codebase for the OnlyFuns social media platform. The backend is responsible for handling data storage, business logic, and API endpoints. This repository works best when combined with OnlyFuns_Frontend repository. 

## Technologies Used

- Node.js: JavaScript runtime environment for server-side development.
- Express.js: Web application framework for building RESTful APIs.
- MongoDB: NoSQL database for storing user data, posts, and other content.
- JWT (JSON Web Tokens): Authentication mechanism for securing API endpoints.
- Mongoose: Object Data Modeling (ODM) library for MongoDB.
- ...

## Setup

1. Clone the repository:
```bash
git clone https://github.com/DuyThaiddt/OnlyFuns_Backend
```

2. Install dependencies:
```bash
cd OnlyFuns_Backend
npm install
```

3. Configure environment variables:
Create a .env file in the root directory and specify the following environment variables:
```bash
PORT=3000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
```
4. Start the server:
```bash
npm start
```
## API Documentation
updating

## Features
- User Authentication: Register, login, and logout functionality with JWT-based authentication.
- User Management: CRUD operations for managing user accounts.
- Post Management: CRUD operations for creating, reading, updating, and deleting posts.
- Content Moderation: Moderation tools for managing user-generated content, including posts and comments.
- Error Handling: Proper error handling and validation for API requests.
- Middleware: Implementation of middleware functions for authentication, logging, and error handling.
- Security Measures: Security headers, password hashing, and other security enhancements.
- Scalability: Design considerations for scalability and performance optimization.

## Contribution
Contributions are welcome! Please follow the contribution guidelines.

