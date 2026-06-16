# CrewNex 🚀

> **A Next-Gen Collaboration Platform for Creators & Seekers**

CrewNex is a full-stack platform designed to bridge the gap between creative professionals and talented job seekers. Creators can post projects, manage applications, and assemble their dream teams, while seekers can explore opportunities, apply for projects, and build their professional portfolio.

![CrewNex Preview](./Frontend/src/assets/logo.gif)

---

## 🌟 Key Features

### For Seekers
- **Explore Projects**: Browse through a curated list of active projects across different domains.
- **Apply Seamlessly**: Submit applications with an integrated resume and portfolio.
- **Track Applications**: Monitor application statuses directly from your personalized dashboard.
- **Skill Showcasing**: Build an interactive profile with bio, skills, and experience levels.

### For Creators & Admins
- **Project Management**: Create, edit, and manage project listings effortlessly.
- **Application Review**: Review candidate applications, assess skills, and conduct interviews.
- **Admin Dashboard**: Comprehensive overview of platform statistics and user activity.

### Technical Highlights
- **Authentication**: Secure JWT-based authentication with role-based access control (RBAC).
- **Responsive Design**: Mobile-first architecture using Tailwind CSS v4.
- **Dockerized Environment**: Containerized frontend and backend for seamless development and deployment.
- **RESTful API**: Scalable Express.js backend with MongoDB for flexible data modeling.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: React Router DOM v7
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **File Uploads**: Cloudinary & Multer

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git & GitHub

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized setup)
- [MongoDB](https://www.mongodb.com/) (if running locally without Docker)

### Installation (Manual)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CrewNex.git
   cd CrewNex
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

### Installation (Using Docker)

To run the entire application stack using Docker Compose:

1. Run the following command from the root directory:
   ```bash
   docker-compose up --build
   ```
2. The frontend will be available at `http://localhost:4001` and the backend at `http://localhost:8081`.

---

## 📁 Project Structure

```text
CrewNex/
├── Backend/                 # Express Server & API
│   ├── config/              # Database configurations
│   ├── controller/          # Route handlers & logic
│   ├── middleware/          # Auth, Uploads, & Error handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express API routes
│   └── utils/               # Helpers (e.g., token generation, emailer)
├── Frontend/                # React Vite Application
│   ├── public/              # Static assets
│   └── src/
│       ├── assets/          # Images & SVGs
│       ├── Components/      # Reusable UI components
│       └── Pages/           # Route views (Home, Login, Dashboard, etc.)
├── docker-compose.yml       # Multi-container orchestration
└── README.md                # Project documentation
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
