# 🌌 SocialSphere

SocialSphere is a modern, full-featured social media platform designed for seamless connection, rich media sharing, and real-time interaction. It is powered by a robust **Spring Boot** backend and a dynamic, beautifully styled **React + Vite** frontend.

---

## 🚀 Key Features

*   **👥 Social Network & Connections:**
    *   Complete user profile customization (Bio, profile picture, edit details).
    *   Search system to find and explore other users' profiles and posts.
    *   Follower and following system with live counts and listing modal.
*   **📝 Interactive Content Feed:**
    *   Rich-text post creation with media (images/photos) uploads.
    *   Real-time post liking, unliking, and commenting.
    *   Responsive and scrollable feed with interactive components.
*   **⚡ Real-Time Chat & "Echo Rooms":**
    *   Interactive chat rooms (Echo Rooms) with WebSocket integration.
    *   Instantly broadcast and receive messages.
    *   Live user status and online indicators.
*   **📸 Stories & Reels:**
    *   24-hour temporary media stories with automatic expiration.
    *   Interactive stories bar at the top of the feed featuring a progress-bar driven viewer.
*   **🔔 Dynamic Notifications:**
    *   Instant notifications for likes, follows, comments, and new chat room events.
    *   Interactive dropdown bell component on the navigation bar.
*   **🎨 Premium Design System:**
    *   Fully integrated Dark/Light mode theme system.
    *   Vibrant accents, smooth transitions, glassmorphic widgets, and cards with subtle micro-animations.

---

## 🛠️ Technology Stack

### Backend
*   **Language:** Java 21
*   **Framework:** Spring Boot 4.x (Spring Web, Spring Security)
*   **Database:** MySQL
*   **ORM:** Spring Data JPA
*   **Authentication:** JSON Web Tokens (JWT) with HS256 encryption (`jjwt`)
*   **Real-time Communication:** Spring WebSocket
*   **Build Tool:** Maven

### Frontend
*   **Framework:** React 18 + Vite (for lightning-fast development builds)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (fully responsive, custom theme variables)
*   **State Management:** React Context API (Auth & Theme)
*   **HTTP Client:** Axios (configured with automated JWT interceptors)
*   **WebSocket Protocol:** Native WebSocket Integration

---

## 📂 Project Structure

```text
SOCIALSPHERE
├── pom.xml                        # Maven configuration for Spring Boot
├── mvnw / mvnw.cmd                # Maven wrapper scripts
├── uploads/                       # Directory for uploaded post/profile media
├── src/
│   └── main/java/com/example/demo/
│       ├── config/                # Security, JWT, Web, & WebSocket configuration
│       ├── controller/            # REST API & WebSocket endpoints
│       ├── dto/                   # Request/Response Data Transfer Objects
│       ├── entity/                # JPA Database Entities
│       ├── repository/            # Spring Data Repository interfaces
│       └── service/               # Core business logic implementation
│
└── socialsphere-frontend/         # React SPA frontend
    ├── package.json               # Node.js dependencies
    ├── vite.config.ts             # Vite bundler configuration
    ├── tailwind.config.js         # Tailwind utility styling config
    └── src/
        ├── api/                   # Axios API instances & service functions
        ├── components/            # Reusable UI elements (Navbar, Modals, Stories)
        ├── context/               # Global React Contexts (Auth, Theme)
        ├── hooks/                 # Custom React hooks (WebSockets, etc.)
        ├── pages/                 # Full pages (Feed, Rooms, Profiles, Auth)
        └── types/                 # TypeScript interface/type definitions
```

---

## ⚙️ Backend Setup & Configuration

Since `application.properties` contains sensitive database credentials, it is excluded from Git tracking. You must create it manually before starting the backend.

### 1. Create Configuration File
Create the file `src/main/resources/application.properties` inside the directory `src/main/resources/` (create the `resources` folder if it does not exist) and add the following contents:

```properties
# Server Configuration
server.port=8080

# Database Configuration (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/socialsphere?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# File Upload Configuration
file.upload-dir=uploads
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Security & JWT Configuration (Must be at least 256 bits / 32 characters long)
jwt.secret=your_super_secret_key_which_should_be_long_enough_and_random_for_security
```

### 2. Start the Backend Server
From the root directory, run the Maven helper command:
```bash
./mvnw spring-boot:run
```
The server will boot and run on `http://localhost:8080`.

---

## 💻 Frontend Setup & Execution

### 1. Install Dependencies
Navigate to the frontend folder and install the required Node modules:
```bash
cd socialsphere-frontend
npm install
```

### 2. Launch Local Development Server
Launch Vite development server:
```bash
npm run dev
```
The frontend application will be served at `http://localhost:5173`.

---

## 📡 REST API Endpoints

| Category | Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/signup` | `POST` | Public | Register a new user account |
| | `/api/auth/login` | `POST` | Public | Login and obtain JWT token |
| **Users** | `/api/users/me` | `GET` | Authenticated | Fetch active user context |
| | `/api/users/{username}` | `GET` | Public | View a specific user profile |
| | `/api/users/profile` | `PUT` | Authenticated | Update user information |
| | `/api/users/search?q={query}`| `GET`| Public | Search for registered users |
| **Follow**| `/api/follow/{userId}` | `POST` | Authenticated | Follow or unfollow a user |
| | `/api/follow/{username}/followers` | `GET` | Public | List followers of a user |
| | `/api/follow/{username}/following` | `GET` | Public | List users followed by a user |
| **Posts** | `/api/posts` | `POST` | Authenticated | Create a new post with optional image |
| | `/api/posts` | `GET` | Public | Retrieve social feed posts |
| | `/api/posts/{id}/like` | `POST` | Authenticated | Like/Unlike a specific post |
| **Comments**| `/api/posts/{postId}/comments` | `POST` | Authenticated | Post a comment under a post |
| | `/api/posts/{postId}/comments` | `GET` | Public | List all comments on a post |
| **Chat** | `/api/rooms` | `POST` | Authenticated | Create a new Echo Room |
| | `/api/rooms` | `GET` | Public | Fetch all available chat rooms |
| | `/api/rooms/{id}/messages` | `GET` | Authenticated | Load historical chat room messages |
| **Stories**| `/api/stories` | `POST` | Authenticated | Upload a 24h temporary story |
| | `/api/stories` | `GET` | Public | View active stories from followed users |

---

## 🌐 WebSocket Gateway
*   **Connection URL:** `ws://localhost:8080/ws`
*   **Destination Prefix:** `/app`
*   **Subscription Prefixes:** `/topic`
*   **Chat Room Topics:** `/topic/room/{roomId}`
*   **System Notification Topics:** `/topic/notifications/{userId}`

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
