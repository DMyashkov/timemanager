# Time Manager Project Documentation

## 1. Project Overview and Goals

### 1.1 Project Purpose
The Time Manager is a comprehensive time tracking and task management application designed to help users efficiently manage their time, track tasks, and improve productivity. The system supports nested tags and records sessions of focused periods and breaks, which are tagged with a particular tag/project. The app is designed for both individual productivity and, in the future, team collaboration.

### 1.2 Core Functionalities
- **Task Management and Tracking:** Create, edit, delete, and organize tasks with priorities, due dates, and completion status.
- **Time Session Recording:** Start, pause, resume, and stop time tracking sessions for tasks, with automatic duration calculation.
- **Tag-based Organization:** Use a nested tag structure (activities/projects) to categorize tasks and sessions.
- **User Authentication and Authorization:** Secure user accounts and data with JWT-based authentication.
- **Cross-platform Support:** Built with React Native and Expo for iOS, Android, and potentially web.
- **Real-time Data Synchronization:** Sync tasks, tags, and sessions between local (mobile) and backend (cloud) databases.
- **AI Assistance:** Use AI to help users create or update tasks and tags (planned/experimental).

### 1.3 User Stories

#### Task Management
- As a user, I want to create new tasks so that I can track my work.
- As a user, I want to edit existing tasks to update their details.
- As a user, I want to delete tasks that are no longer needed.
- As a user, I want to view all my tasks in a list format.
- As a user, I want to filter tasks by status and tags.

#### Time Tracking
- As a user, I want to start a time session for a specific task.
- As a user, I want to pause and resume time sessions.
- As a user, I want to stop a time session and save the duration.
- As a user, I want to view my time tracking history.
- As a user, I want to get insights about my time usage.

#### Tag Management
- As a user, I want to create custom tags which are held in a nested structure to categorize tasks.
- As a user, I want tags which are classified as either activities or projects.
- As a user, I want to assign multiple tags to a task.
- As a user, I want to filter tasks by tags.
- As a user, I want to manage my tag collection.

#### AI
- As a user, I want AI to help me create or update tasks and tags (e.g., by suggesting task breakdowns or tag assignments).

### 1.4 Use Cases

#### Task Management Use Cases
1. **Creating a New Task**
   - User navigates to task creation screen.
   - Fills in task details (title, description, due date, priority).
   - Assigns tags (activity/project).
   - Saves the task (locally, then syncs to backend).

2. **Time Tracking Use Case**
   - User selects a task.
   - Starts time tracking.
   - System records start time.
   - User can pause/resume.
   - User stops tracking.
   - System calculates duration and saves session (with tag/project association).

3. **Tag Management Use Case**
   - User accesses tag management.
   - Creates new tag with name, color, and type (activity/project).
   - Assigns tag to tasks.
   - Views tasks filtered by tag.

4. **AI Assistance Use Case**
   - User invokes AI assistant.
   - AI suggests task breakdowns, tag assignments, or helps generate new tasks based on user input.

## 2. Technical Architecture

### 2.1 Technology Stack

#### Backend
- **Django 5.1.3:** A high-level Python web framework that encourages rapid development and clean, pragmatic design. Used for the REST API, business logic, and admin interface.
- **Django REST Framework 3.15.2:** A powerful and flexible toolkit for building Web APIs in Django. Handles serialization, authentication, and API endpoint management.
- **PostgreSQL 14:** An advanced open-source relational database. Stores all persistent user data, tasks, tags, and sessions.
- **JWT Authentication:** Uses JSON Web Tokens for stateless, secure authentication between frontend and backend.
- **Docker:** Containerizes the backend and database for consistent development, testing, and deployment environments.

#### Frontend
- **React Native with Expo:** Cross-platform mobile app framework. Expo simplifies development and deployment, providing hot reloading, OTA updates, and easy device testing.
- **TypeScript:** Strongly-typed JavaScript for safer, more maintainable code.
- **SQLite:** Local embedded database for offline-first functionality. Stores tasks, tags, and sessions on the device.
- **Drizzle ORM:** TypeScript ORM for SQLite (and other SQL databases). Provides type-safe queries and schema management.
- **React Navigation:** Handles navigation and routing in the mobile app.
- **Material UI components:** Provides a consistent, modern UI/UX.

### 2.2 System Architecture
The application follows a client-server architecture with offline-first support:

1. **Backend Services**
   - **Django REST API:** Exposes endpoints for tasks, tags, sessions, and user management.
   - **Authentication Service:** Handles user registration, login, and JWT issuance/validation.
   - **Task/Tag/Session Services:** CRUD operations and business logic for core entities.

2. **Frontend Application**
   - **React Native Mobile App:** Main user interface, runs on iOS/Android.
   - **Local SQLite Database:** Stores user data for offline access and syncs with backend when online.
   - **State Management:** Uses React context/hooks for app state.
   - **UI Components:** Custom and Material UI-based components for a modern look.

3. **Database Layer**
   - **PostgreSQL (Backend):** Central data store for all users.
   - **SQLite (Mobile):** Local data store for offline use and fast access.

4. **Synchronization Logic**
   - On app startup or when connectivity is restored, the app syncs local changes (tasks, tags, sessions) to the backend and pulls down updates from the server.
   - Conflict resolution is handled by timestamps and sync status flags (e.g., `synced`, `deleted`).
   - Only changed/unsynced records are sent to the backend to minimize data transfer.

### 2.3 Database Schema

#### PostgreSQL Tables (Backend)
- **Users**
  - id (PK), username, email, password_hash, created_at, updated_at
- **Tasks**
  - id (PK), user_id (FK), title, description, due_date, priority, completed, created_at, updated_at
- **TimeSessions**
  - id (PK), user_id (FK), task_id (FK), tag_id (FK), start_time, end_time, duration, created_at
- **Tags**
  - id (PK), user_id (FK), name, color, type (activity/project), parent_id (FK, nullable), created_at
- **TaskTags**
  - id (PK), task_id (FK), tag_id (FK)

#### SQLite Tables (Mobile)
- **LocalTasks**
  - id (PK), title, description, date, priority, completed, tagId, synced, deleted, updated_at
- **LocalTimeSessions**
  - id (PK), taskId, tagId, start_time, end_time, duration, synced, deleted, updated_at
- **LocalTags**
  - id (PK), name, color, type, parentId, synced, deleted, updated_at
- **SyncStatus**
  - id (PK), entity_type, entity_id, last_synced_at, sync_status

#### Example Entity Relationships
- A **Task** can have multiple **Tags** (many-to-many via TaskTags).
- A **Tag** can have a parent (for nesting activities/projects).
- A **TimeSession** is linked to a Task and a Tag.

## 3. Development and Deployment

### 3.1 Development Environment
- **Node.js >= 20.6.0:** Required for React Native/Expo and frontend tooling.
- **Python 3.x:** Required for Django backend.
- **Docker and Docker Compose:** For running backend and database locally.
- **Expo CLI:** For building, running, and deploying the mobile app.
- **PostgreSQL 14:** Backend database.

### 3.2 Deployment Architecture
- **Docker containers:** Backend (Django) and database (PostgreSQL) run in containers for easy deployment and scaling.
- **Mobile app deployment:** Built and published via Expo (supports OTA updates).
- **CI/CD pipeline:** Automated testing and deployment using GitHub Actions.

### 3.3 Security Measures
- **JWT-based authentication:** Stateless, secure user sessions.
- **Secure password hashing:** Passwords are never stored in plain text.
- **API rate limiting:** Prevents abuse and DoS attacks.
- **Input validation:** Both frontend and backend validate user input.
- **SQL injection prevention:** ORM and parameterized queries.
- **CORS configuration:** Only allows requests from trusted origins.

## 4. Testing Strategy

### 4.1 Unit Testing
- **Backend:** Django test framework for models, views, and serializers.
- **Frontend:** Jest for React Native components and logic.
- **Component testing:** Isolate and test UI components.
- **Service testing:** Test business logic and data services.

### 4.2 Integration Testing
- **API endpoint testing:** Ensure backend endpoints work as expected.
- **Database integration tests:** Test data flow between app and database.
- **Authentication flow testing:** Test login, registration, and token refresh.

### 4.3 End-to-End Testing
- **User flow testing:** Simulate real user actions across the app.
- **Cross-platform testing:** Ensure consistent behavior on iOS and Android.
- **Offline functionality testing:** Test app behavior with/without connectivity.

## 5. Performance Considerations

### 5.1 Scalability
- **Horizontal scaling:** Use Docker containers to scale backend services.
- **Database indexing:** Optimize queries for large datasets.
- **Caching strategies:** Use caching for frequently accessed data.
- **Efficient API design:** Minimize payloads and use pagination.

### 5.2 Optimization
- **Lazy loading:** Only load data/components as needed.
- **Image optimization:** Compress and resize images for mobile.
- **Code splitting:** Reduce initial bundle size.
- **Database query optimization:** Use efficient queries and indexes.

## 6. Future Enhancements

### 6.1 Planned Features
- **Team collaboration:** Share tasks and projects with others.
- **Project management:** Advanced project tracking and reporting.
- **Advanced analytics:** Insights into time usage and productivity.
- **Calendar integration:** Sync with Google/Outlook calendars.
- **Export functionality:** Export data to CSV, PDF, etc.

### 6.2 Technical Improvements
- **Real-time updates:** Use WebSockets or push notifications for live sync.
- **Offline-first architecture:** Further improve offline capabilities.
- **Performance optimization:** Ongoing improvements for speed and efficiency.
- **Enhanced security features:** 2FA, audit logs, etc.

## 7. Maintenance and Support

### 7.1 Monitoring
- **Error tracking:** Use tools like Sentry for error reporting.
- **Performance monitoring:** Track app and server performance.
- **Usage analytics:** Understand user behavior and app usage.
- **Server health checks:** Automated checks for uptime and reliability.

### 7.2 Backup Strategy
- **Database backups:** Regular automated backups of PostgreSQL.
- **User data backup:** Ensure user data is never lost.
- **Configuration backup:** Backup environment and config files.

## 8. Documentation

### 8.1 API Documentation
- **Swagger/OpenAPI documentation:** Auto-generated API docs for backend endpoints.
- **Endpoint documentation:** Details on each API route, parameters, and responses.
- **Authentication flow:** How to obtain and use JWT tokens.
- **Error handling:** Standard error codes and messages.

### 8.2 User Documentation
- **Installation guide:** How to set up the project locally.
- **User manual:** How to use the app's features.
- **Troubleshooting guide:** Common issues and solutions.
- **FAQ:** Frequently asked questions.

## 9. Project Timeline

### Phase 1: Setup and Basic Infrastructure (Completed)
- Project initialization
- Basic architecture setup
- Development environment configuration

### Phase 2: Core Development (Completed)
- Backend API development
- Frontend mobile app development
- Database implementation

### Phase 3: Testing and Deployment (Current)
- Unit testing
- Integration testing
- Deployment setup
- Documentation

### Phase 4: Enhancement and Optimization (Planned)
- Performance optimization
- Feature enhancements
- Security improvements
- User feedback implementation

---

## 10. Glossary

- **JWT (JSON Web Token):** A compact, URL-safe means of representing claims to be transferred between two parties. Used for authentication.
- **ORM (Object-Relational Mapping):** A technique for converting data between incompatible type systems (e.g., Drizzle ORM for TypeScript/SQL).
- **Expo:** A framework and platform for universal React applications, providing tools and services for building, deploying, and quickly iterating on apps.
- **Drizzle ORM:** A type-safe ORM for TypeScript, used for interacting with SQLite in the mobile app.
- **SQLite:** A lightweight, embedded SQL database engine, used for local storage on mobile devices.
- **PostgreSQL:** A powerful, open-source object-relational database system.
- **Docker:** A platform for developing, shipping, and running applications in containers.
- **Swagger/OpenAPI:** Tools for describing and documenting RESTful APIs.
- **Material UI:** A popular React UI framework implementing Google's Material Design.
- **Sync:** The process of reconciling local and remote data, ensuring consistency between the mobile app and backend server.
- **TimeSession:** A record of a period spent working on a task, with start/end times and duration.
- **Tag:** A label (activity or project) used to categorize tasks and sessions, supporting nesting.

---

*This documentation is intended to be a living document. Please update it as the project evolves and new features or technologies are introduced.* 