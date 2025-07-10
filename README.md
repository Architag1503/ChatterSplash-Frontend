# React Chat Application

A real-time chat application built with React, Socket.io, and Zustand.

## Documentation

1. [Project Structure](PROJECT_STRUCTURE.md)
2. [Core Packages](CORE_PACKAGES.md)
3. [Code Flow](CODE_FLOW.md)
4. [State Management](STATE_MANAGEMENT.md)
5. [Socket Integration](SOCKET_INTEGRATION.md)
6. [Styling Guidelines](STYLING.md)

## Getting Started

See [Setup Instructions](SETUP.md) for installation and configuration.

## Features

- Real-time messaging
- User authentication
- Channel/private chats
- File sharing
- Responsive UI

# Project Structure

```text
src/
├── assets/                # Static assets
├── components/            # Reusable UI components
├── context/               # React contexts
├── lib/                   # Utility functions
├── pages/                 # Main page components
├── store/                 # Zustand state slices
├── utils/                 # Constants and helpers
├── App.jsx                # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles


# Core Packages Used 

This document lists and explains the core packages and libraries used in the **frontend** of the chat application.

---

## 📚 Package Overview 

| Package           | Purpose                                                      |
|-------------------|--------------------------------------------------------------|
| **React**         | A JavaScript library for building user interfaces            |
| **React Router**  | Enables client-side routing and navigation                   |
| **Zustand**       | Lightweight state management library for React               |
| **Socket.io-client** | Enables real-time bi-directional communication with backend |
| **Axios**         | Promise-based HTTP client for making API requests            |
| **Tailwind CSS**  | Utility-first CSS framework for rapid UI development         |
| **shadcn/ui**     | Modern and customizable UI component library built on Radix  |
| **Lottie**        | Library to render Adobe After Effects animations as SVGs/JSON|

---

## 📝 Detailed Description

### ✅ React
Used for building the component-based UI structure, supporting fast updates with the virtual DOM.

### 🔁 React Router
Used to manage navigation within the SPA (Single Page Application), enabling routing without full page reloads.

### 📦 Zustand
Manages global state (e.g., selected chat, user details, socket connection) with minimal boilerplate and great performance.

### ⚡ Socket.io-client
Establishes a WebSocket connection with the backend for real-time chat, message notifications, and channel updates.

### 🌐 Axios
Simplifies HTTP request handling such as `GET`, `POST`, `PUT`, `DELETE` to backend APIs with automatic JSON parsing.

### 🎨 Tailwind CSS
Allows utility-first styling using predefined classes that speed up UI development with responsive design.

### 🧩 shadcn/ui
Provides accessible and customizable UI components like buttons, inputs, cards, and modals with modern aesthetics.

### ✨ Lottie
Displays rich animations using JSON files exported from Adobe After Effects, enhancing user experience and interactivity.

---

# 🔁 Code Flow

This document explains the core flow of the frontend application, including initialization, authentication, and real-time communication.

---

## 🚀 Initialization

1. **`main.jsx`**  
   - Entry point of the React application.
   - Renders the `<App />` component wrapped inside:
     - `<BrowserRouter>`: Enables client-side routing.
     - `<SocketProvider>`: Sets up Socket.IO connection and shares it via context.
     - `<AppStoreProvider>` (if Zustand with context is used): Provides global app state.

2. **`App.jsx`**  
   - Sets up all the routes using `React Router`.
   - Handles auth status:
     - Checks for a valid JWT cookie.
     - If logged in, fetches user profile info from `/api/auth/user-info`.
   - Conditionally renders protected and public routes.

3. **User Info Fetching**  
   - On successful token verification, sends a request to:
     ```
     GET /api/auth/user-info
     ```
   - This returns user data including `email`, `firstName`, `image`, `color`, etc.
   - This data is stored globally (e.g., Zustand) to personalize the app UI.

---

## 🔐 Authentication Flow

1. **Unauthenticated Users**  
   - Redirected to `/auth` route.
   - Presents either login or signup form.

2. **Signup/Login API Calls**  
   - `POST /api/auth/signup` or `POST /api/auth/login`
   - On success:
     - JWT is stored in a **cookie**.
     - Server responds with user object.
   - A `setUser()` action is triggered in global store.

3. **Post Authentication Routing**  
   - If `profileSetup` is `false`:
     - Redirected to `/profile-setup`
     - Allows setting `firstName`, `lastName`, and profile color.
   - If profile is already complete:
     - Redirects to `/dashboard` or home route.

---

## 🔴 Real-time Communication (Socket.IO)

The app uses `socket.io-client` to support real-time updates:

1. **Connection Initialization**  
   - On login, user’s `userId` is passed as a query param to the socket server:
     ```js
     io("http://localhost:3000", {
       query: { userId }
     });
     ```
   - This socket is stored in context and accessed throughout the app.

2. **Sending Direct Messages**  
   - Triggered via:
     ```js
     socket.emit("sendMessage", messagePayload);
     ```
   - Backend stores the message and emits it to both sender and receiver:
     ```js
     socket.on("recieveMessage", (message) => { ... });
     ```

3. **Channel Messaging**  
   - Messages sent to a channel:
     ```js
     socket.emit("send-channel-message", messagePayload);
     ```
   - Backend pushes the message to the channel and emits it to all members:
     ```js
     socket.on("recieve-channel-message", (message) => { ... });
     ```

4. **Live Updates**  
   - Contacts and channels automatically update when new messages arrive.
   - Sorted by most recent interaction (via `lastMessageTime` or `updatedAt`).

5. **File Upload Progress Tracking**  
   - When a file is uploaded:
     - It's first uploaded via REST API (`POST /api/messages/file`)
     - Upload progress is shown using `onUploadProgress` in `axios`.

---

## 🧭 Route Structure Overview
# 📡 API Routes Reference

This table lists all available backend API endpoints grouped by their purpose.

---

# 📡 API Routes Reference

This document outlines all available backend API endpoints used in the chat application. Routes are grouped by category for clarity.

---

## 🔐 Authentication Routes

| Endpoint                                  | Method | Description                                             |
|-------------------------------------------|--------|---------------------------------------------------------|
| `/api/auth/signup`                        | POST   | Register a new user with email and password            |
| `/api/auth/login`                         | POST   | Authenticate user and return profile info + JWT cookie |
| `/api/auth/user-info`                     | GET    | Retrieve the currently logged-in user’s profile         |
| `/api/auth/update-profile`                | PUT    | Update first name, last name, and profile color         |
| `/api/auth/add-profile-image`             | POST   | Upload and set a profile image                          |
| `/api/auth/remove-profile-image`          | DELETE | Remove user’s profile picture from server               |
| `/api/auth/logout`                        | POST   | Logout the user and clear the authentication cookie     |

---

## 👥 Contact Routes

| Route                                          | Method | Description                                 |
|------------------------------------------------|--------|---------------------------------------------|
| `/api/contacts/search`                         | POST   | Search users by name or email               |
| `/api/contacts/get-contacts-for-dm`            | GET    | Get direct message contacts with last chat  |
| `/api/contacts/get-all-contacts`               | GET    | Get all registered users except self        |

---

## 💬 Messages Routes

| Endpoint                                  | Method | Description                                                        |
|-------------------------------------------|--------|--------------------------------------------------------------------|
| `/api/messages/get-messages`              | POST   | Get all direct messages exchanged between two users                |
| `/api/messages/upload-file`               | POST   | Upload file (image, document, etc.) and return file path URL       |

---

## 🧑‍🤝‍🧑 Channel Routes

| Route                                    | Method | Description                                      |
|------------------------------------------|--------|--------------------------------------------------|
| `/api/channel/create-channel`            | POST   | Create a new group channel                       |
| `/api/channel/get-user-channels`         | GET    | Fetch channels the user is part of               |
| `/api/channel/get-channel-messages`      | GET    | Get all messages for a specific channel  
---

> ℹ️ **Note:** All routes (except `/signup` and `/login`) require the user to be authenticated via a valid JWT token stored in cookies.


> ⚠️ Note: All routes (except `/signup` and `/login`) require a valid JWT token to be sent as a cookie for authentication.

# ⚙️ State Management with Zustand & Socket.io Integration

This document explains how application state is managed using **Zustand**, and how **Socket.io** is integrated for real-time communication.

---

## 🧠 Zustand – Global State Management

Zustand is used to manage global state for both authentication and chat features without needing context providers or reducers.

---

### 🔐 Auth Slice

Manages the state related to the currently authenticated user.

| State / Action      | Type     | Description                                 |
|---------------------|----------|---------------------------------------------|
| `userInfo`          | object   | Stores user details (id, name, email, etc.) |
| `setUserInfo(info)` | function | Updates the `userInfo` state                |

✅ Usage Example:
```javascript
const { userInfo, setUserInfo } = useAppStore();
setUserInfo(newUserData);

# 📧 Chatting App Backend

This is a **Node.js + Express** based backend for a real-time chat application supporting:

* Authentication (Signup/Login/Logout)
* Contact search and list
* One-on-one messaging
* Group channels
* File/image upload
* Real-time communication using Socket.IO

---

# 🧠 State Management with Zustand

Zustand is used to manage global state for both authentication and chat features.

✅ Example:

```javascript
const { setSelectedChatType, setSelectedChatData } = useAppStore();
setSelectedChatType("contact");
setSelectedChatData(userObject);
```

# Auth Slice

Manages the state related to the currently authenticated user.

---

| State / Action    | Type     | Description                                 |
|-------------------|----------|---------------------------------------------|
| userInfo          | object   | Stores user details (id, name, email, etc.) |
| setUserInfo(info) | function | Updates the `userInfo` state                |

---

# Chat Slice

Manages the state of the currently selected chat, whether a DM or channel.

---

| State / Action               | Type     | Description                                           |
|------------------------------|----------|-------------------------------------------------------|
| selectedChatType             | string   | Either `'contact'` or `'channel'`                     |
| selectedChatData             | object   | Metadata of the selected user or channel              |
| selectedChatMessages         | array    | Message history of the selected conversation          |
| setSelectedChatType(type)    | function | Updates chat type (`'contact'` / `'channel'`)         |
| setSelectedChatData(data)    | function | Sets current chat context (user or channel object)    |
| setSelectedChatMessages()    | function | Updates message list for selected chat                |

### 🏪 Store Composition

```javascript
// store/index.js
import { create } from 'zustand';
import authSlice from './auth_slice';
import chatSlice from './chat_slice';

const useAppStore = create((...a) => ({
  ...authSlice(...a),
  ...chatSlice(...a),
}));

export default useAppStore;
```

---

# 🔌 Socket.io Integration

Socket.io is used for real-time messaging between users and channels.

### 🔗 Connection Setup

```javascript
import { io } from 'socket.io-client';

const socket = io(SERVER_URL, {
  query: { userId }, // Passed from authenticated user
  transports: ['websocket'],
  withCredentials: true
});
```

This establishes a WebSocket connection between the frontend and backend. The server uses `userId` to track the user’s socket session.

### 📩 Sending Messages

**Direct message (DM):**

```javascript
socket.emit("sendMessage", {
  sender: userId,
  recipient: otherUserId,
  content: "Hello!",
  messageType: "text",
  timestamp: new Date()
});
```

**Channel message:**

```javascript
socket.emit("send-channel-message", {
  sender: userId,
  channelId,
  content: "Hello team!",
  messageType: "text",
  timestamp: new Date()
});
```

### 📥 Receiving Messages

```javascript
socket.on("recieveMessage", (message) => {
  // Append new DM to chat state
});

socket.on("recieve-channel-message", (message) => {
  // Append new channel message to chat state
});
```

Messages are automatically received in real time, allowing the UI to update without polling.

### 🔌 Disconnection Handling

When a socket disconnects (e.g., tab closed or network lost), the server:

* Removes the socket ID from the user tracking map
* Stops message delivery until reconnected

No manual cleanup is required on the client unless performing custom logic like presence indication.

### 💡 Socket with Zustand

You can enhance socket usage by storing the socket instance in Zustand:

```javascript
set({ socketInstance: socket });
```

Then access it anywhere:

```javascript
const socket = useAppStore((state) => state.socketInstance);
```
---

# Key Socket Events

---

| Event                     | Direction   | Description                  |
|---------------------------|-------------|------------------------------|
| sendMessage               | Outgoing    | Direct message               |
| recieveMessage            | Incoming    | Direct message               |
| send-channel-message      | Outgoing    | Channel message              |
| recieve-channel-message   | Incoming    | Channel message              |

---

## State Updates

- New messages are added to the currently active chat  
- Contact/channel lists are reordered based on most recent interaction  

---

## Styling Guidelines  

### Tailwind CSS  

- Uses a utility-first approach for rapid UI development.  
- Custom colors and theme overrides are managed in `index.css` or `tailwind.config.js`.  
- Supports dark/light theme switching for improved accessibility and UX.  

---

## Component Library - shadcn/ui  

- Provides headless, accessible UI components built on top of Radix.  
- Fully customizable using Tailwind CSS.  
- Includes components like buttons, modals, inputs, and more.  



