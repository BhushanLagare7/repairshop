# 💻 Computer Repair Shop Management System

A full-stack modern web application built with [Next.js](https://nextjs.org/) for managing computer repair shop customers and service tickets.

## 📸 Screenshots

<p align="center">
  <img src="public/light-mode.png" alt="Light Mode" width="48%">
  &nbsp;
  <img src="public/dark-mode.png" alt="Dark Mode" width="48%">
</p>

## 📑 Table of Contents

- [What the project does](#what-the-project-does)
- [Why the project is useful](#why-the-project-is-useful)
- [How users can get started](#how-users-can-get-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Where users can get help](#where-users-can-get-help)
- [Who maintains and contributes](#who-maintains-and-contributes)
  - [Contribution Guidelines](#contribution-guidelines)
- [Contact](#contact)

## 🛠️ What the project does

The Computer Repair Shop Management System provides a streamlined administrative interface to track customers and their corresponding repair tickets. It helps shop owners and technicians register new customers, log details about items brought in for repair, assign tickets to specific technicians, and track the status of repairs from drop-off to completion.

## ✨ Why the project is useful

- 👥 **Customer Management**: Maintain a centralized database of customers with contact details, addresses, and notes.
- 🎫 **Ticket Tracking**: Create, assign, and manage repair tickets associated with specific customers.
- 🔒 **Secure Access**: Integrated authentication to ensure only authorized personnel can access shop data.
- 🚀 **Modern Tech Stack**: Built for performance and developer experience using Next.js App Router, Tailwind CSS, and Drizzle ORM.
- ✅ **Reliable Data**: Type-safe database queries and form validations prevent bad data from entering your system.

## 🚀 How users can get started

### 📋 Prerequisites

- 🟢 Node.js (v20+ recommended)
- 🐘 A PostgreSQL database (e.g., [Neon](https://neon.tech/))
- 🔑 A [Kinde Auth](https://kinde.com/) account for authentication

### ⚙️ Installation & Setup

1. **Clone the repository** (if you haven't already)

   ```bash
   git clone https://github.com/BhushanLagare7/repairshop.git
   cd repairshop
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root of the project with the following essential keys (refer to any provided `.env.example` if applicable):

   ```env
   # Database Configuration
   DATABASE_URL="postgres://user:password@host/dbname"

   # Kinde Auth Configuration
   KINDE_CLIENT_ID="your_client_id"
   KINDE_CLIENT_SECRET="your_client_secret"
   KINDE_ISSUER_URL="https://your_kinde_domain.kinde.com"
   KINDE_SITE_URL="http://localhost:3000"
   KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
   KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/tickets"
   ```

   _(Note: Ensure your `.env.local` stays ignored in version control)._

4. **Prepare the Database**
   Generate and push the database schema using Drizzle:

   ```bash
   # Generate migration files
   npm run db:generate

   # Apply migrations to your database
   npm run db:migrate
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Your app should now be running on [http://localhost:3000](http://localhost:3000).

## 🆘 Where users can get help

- 📘 **Next.js Documentation**: For questions regarding routing, rendering, and framework features, see the [Next.js Docs](https://nextjs.org/docs).
- 💧 **Drizzle ORM**: For database queries and schema definitions, check the [Drizzle Documentation](https://orm.drizzle.team/docs/overview).
- 🐛 **Issue Tracker**: If you find bugs or have feature requests, please open an issue on the repository.

## 🤝 Who maintains and contributes

This project is maintained by **BhushanLagare7**.

### 📝 Contribution Guidelines

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes. (We recommend conventional commits).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please see our [CONTRIBUTING.md](docs/CONTRIBUTING.md) (if available) for detailed guidelines.

## 📬 Contact

- GitHub: [@BhushanLagare7](https://github.com/BhushanLagare7)

---

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![Version](https://img.shields.io/badge/Version-0.1.0-green.svg) ![Dependencies](https://img.shields.io/badge/Dependencies-Up_to_date-brightgreen.svg)
