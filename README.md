# Campus Connect

This Project is hosted on - https://c-taskboard.web.app/ (Not updated to latest Release yet To run the bug FREE App do local installation)

Campus Connect is a collaborative task management platform built using React and Firebase. Designed for campus communities, it allows users to post, accept, and manage tasks with real-time updates, secure authentication, and a modern, responsive design.

## Tech Stack
- **React**: Frontend library for building the UI
- **Firebase**: 
  - Firestore for real-time data management
  - Firebase Authentication for secure login/signup
- **Tailwind CSS**: Styling for responsive and modern design
- **Framer Motion**: Animations for a smooth user experience

---

## Features
- **User Authentication**: Secure login and signup using Firebase Authentication.
- **Real-Time Task Management**: Task posting, acceptance, and updates in real time using Firestore.
- **User Profiles**: Detailed profiles displaying users’ posted and completed tasks.
- **Responsive Design**: Tailored for all devices using Tailwind CSS.
- **Animations**: Framer Motion for smooth and engaging animations.

---

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine
- Firebase project set up with Firestore and Authentication

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Campus-Taskboard.git
   cd Campus-Taskboard

2. Install dependencies:
Install dependencies:

3.Set up Firebase:

Go to the Firebase Console and create a new project.
Enable Firestore Database and Authentication (Email/Password sign-in).
Create a web app in Firebase, and obtain your Firebase config object.

4. Setup Enviroment Variable
In the root of this project, create a .env file and add the following environment variables:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

Replace your_* with the values from your Firebase project.

5. Start the development server:
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





