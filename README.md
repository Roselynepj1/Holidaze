# Holidaze Front-End Application

## Project Overview

Holidaze is a modern accommodation booking platform with two main interfaces:
1. **Customer-facing side**: Allows users to search for, view, and book venues.
2. **Admin-facing side**: Provides functionality for venue managers to manage venues and bookings.

This project implements a front-end application using the [Holidaze API](https://noroff-api-docs.netlify.app/) and adheres to the technical requirements specified in the brief. It incorporates advanced features for users and venue managers, creating an intuitive user experience with a responsive design.

---

## Features Implemented

### Customer Features:
- View a list of venues.
- Search for venues using keywords.
- View detailed venue pages, including calendars with availability.
- Register as a customer with a `stud.noroff.no` email.
- Create and view bookings.

### Venue Manager Features:
- Register as a venue manager using a `stud.noroff.no` email.
- Create, update, and delete venues.
- View bookings for managed venues.

### General Features:
- User registration and login.
- Avatar upload and update for registered users.
- Logout functionality.

---

## Tech Stack

- **JavaScript Framework**: React 18
- **CSS Framework**: TailwindCSS
- **Routing**: React Router DOM
- **State Management**: React Hook Form
- **Validation**: Yup and @hookform/resolvers
- **Calendar**: React Big Calendar
- **UI Animations**: Framer Motion
- **Map Integration**: @react-google-maps/api 
- **Build Tool**: Vite

---

## Project Setup

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (version 16 or higher)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/Roselynepj1/Holidaze.git
cd holidaze
```

### Install Dependencies
Run the following command to install all dependencies:
```bash
npm install
```

### Start Development Server
Run the development server locally:
```bash
npm run dev
```

### Build for Production
To build the project for production, use:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

---

## Deployment
This project is hosted on **Netlify**. The live demo is accessible at: [Holidaze Live Demo](https://holidaze-vacation.netlify.app/).

---

## Design and Planning Resources

- **Gantt Chart**: [View Gantt Chart](#)
- **Design Prototype**: [View Prototype](https://www.figma.com/design/RTxpQI0PV5wj7eb7glKHbK/Holidaze?node-id=0-1&t=yggGVNdgnaeVtBoN-1)
- **Style Guide**: [View Style Guide](#)
- **Kanban Board**: [View Kanban Board](#)
- **Repository**: [GitHub Repository](#)

---

## Testing Instructions
### Running the App Locally:
1. Clone the repository and install dependencies as described above.
2. Start the development server using `npm run dev`.
3. Access the app at `http://localhost:3000`.

### Key Areas to Test:
1. **Venue Features**: View venue list, search venues, view venue details and availability calendar.
2. **User Registration**: Test email validation for `stud.noroff.no`.
3. **Booking Functionality**: Ensure users can create and view bookings.
4. **Venue Management**: Test creation, updating, deletion of venues, and viewing bookings.

---

## Contact
For any questions or support, please contact:  
**Developer**: [Roselyne P Johansen]  
**Email**: [roselynepj1@gmail.com]   