# Campus Connect

Campus Connect is a collaborative task management platform built using React and Firebase. Designed for campus communities, it allows users to post, accept, and manage tasks with real-time updates, secure authentication, and a modern, responsive design.



This Project is hosted on - https://c-taskboard.web.app/ (Most Stable Version)

To run the Project with all Features Working in Stable mode Follow The installation Instruction Below and RUN This locally



## Tech Stack
### React: Frontend library for building the user interface with reusable components and state management.

### Firebase:
Firestore: Real-time data storage and synchronization, ensuring all users see the latest task updates instantly.

### Firebase Authentication: Secure and streamlined user login and signup with support for role-based permissions.

### Tailwind CSS: Utility-first CSS framework for creating responsive, modern designs that look great on any device.

### Framer Motion: Library for animations, adding smooth transitions and interactive effects to improve the user experience.

## Features

### User Authentication:

Secure user login and registration using Firebase Authentication.
Role-based access control to manage task posting and acceptance.
Real-Time Task Management:

Users can post, browse, and accept tasks, with instant updates on task status.
Task filtering and search functionality to help users quickly find relevant tasks.
User Profiles:

Each user has a detailed profile displaying posted and accepted tasks, task completion history, and achievements.
Reputation system with scores and badges to recognize contributions.

### Responsive Design:

Designed with Tailwind CSS to ensure compatibility and seamless functionality across all device sizes.

### Animations:

Integrated animations with Framer Motion to provide a visually engaging and fluid user experience.

---

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine
- Firebase project set up with Firestore and Authentication

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/misanthropic-codes/Campus-Connect.git
   cd Campus-Connect

2. Install dependencies:
Install dependencies: npm install



3. Start the development server:
npm run dev

The app should now be running on http://localhost:300

Available Scripts
npm run dev: Runs the app in development mode on http://localhost:3000.
npm run build: Builds the app for production in the dist folder.
npm run lint: Lints the codebase for consistency.

Environment Variables
The project requires environment variables to be stored in a .env file at the root level for Firebase configuration. The necessary variables are:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id


Contributing
If you’d like to contribute to Campus Taskboard, please fork the repository and create a pull request. All contributions are welcome!

License
This project is licensed under the MIT License. See the LICENSE file for details.





