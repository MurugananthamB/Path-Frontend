# 🧪 Pathology Frontend - React + Vite

A modern, responsive frontend built with **React, Vite, and Tailwind CSS**, designed specifically for Pathology patient management, test reporting, and lab workflows. Seamlessly integrates with backend APIs to deliver an efficient, user-friendly experience.

---

## 🚀 Features

- 👨‍⚕️ **Patient Management Interface**
- 🧾 **Lab Test Entry & Report Viewing**
- 🖨️ **PDF & Excel Report Generation** using jsPDF and xlsx
- 🏷️ **Barcode Generation** with jsbarcode
- 🌐 **API Integration** with secure Axios calls
- 💨 Fast performance using **Vite**
- 🎨 Styled using **Tailwind CSS**
- 🔗 **React Router DOM** for smooth navigation

---

## 🛠️ Tech Stack

| Technology        | Purpose                                    |
|-------------------|--------------------------------------------|
| React             | Frontend UI Framework                      |
| Vite              | Fast build tool & dev server               |
| Tailwind CSS      | Utility-first styling                      |
| Axios             | API integration                            |
| jsPDF / AutoTable | PDF report generation                      |
| xlsx              | Excel export                               |
| jsbarcode         | Barcode creation                           |
| React Router DOM  | Routing & navigation                       |
| dotenv            | Environment configuration                  |
| ESLint            | Code linting                               |

---

## 📂 Project Structure

```
├── public/            // Static files
├── src/               // Main source code
│   ├── components/    // Reusable UI components
│   ├── pages/         // Page-level components
│   ├── services/      // API services (Axios)
│   └── App.jsx        // Main App component
├── tailwind.config.js // Tailwind CSS configuration
├── vite.config.js     // Vite configuration
└── README.md
```

---

## 🏁 Installation & Running Locally

```bash
# Clone the repo
git clone https://github.com/MurugananthamB/Path-Frontend.git
cd Path-Frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

---

## 🌐 Live Preview & Deployment

Deploy easily on platforms like **Netlify**, **Vercel**, or your custom server:

```bash
npm run build
npm run preview
```

---

## 📦 Dependencies

- react
- react-dom
- react-icons
- react-router-dom
- axios
- jsbarcode
- jspdf & jspdf-autotable
- xlsx
- dotenv
- tailwindcss
- express (for any express-based support if used)

---

## 📃 License

This project is licensed under the ISC License.

---

## 🙌 Contribution

Feel free to fork, contribute, or raise issues to improve and expand the project.

---
