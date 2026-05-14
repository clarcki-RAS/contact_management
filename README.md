# 📇 Gestion des Contacts Professionnels – APMF

## 📖 Overview

Application web de gestion des contacts professionnels développée lors d’un stage à l’APMF.

La plateforme permet de centraliser et gérer efficacement les contacts professionnels à travers une interface moderne, responsive et sécurisée.

---

# 🚀 Features

## 👥 Contact Management
- Ajout de contacts professionnels
- Modification et suppression des contacts
- Recherche et gestion des informations
- Interface utilisateur responsive

## 🔐 Authentication
- Authentification simple
- Gestion sécurisée des accès

## 📤 Export Features
- Exportation des contacts en fichier XLS
- Gestion simplifiée des données

## 🌐 API
- API REST pour les opérations CRUD
- Communication frontend/backend optimisée

---

# 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| Frontend | React.js, TailwindCSS |
| Backend | Express.js, Node.js |
| Database | PostgreSQL |

---

# 🔗 Architecture

```text
Frontend (React.js) → API Express.js → PostgreSQL
```

---

# 📦 Installation

## 🔧 Backend

```bash
cd backend
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

```bash
cp .env.example .env
```

### Run backend server

```bash
node index.js
```

---

## 💻 Frontend

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Run frontend server

```bash
npm run dev
```

---

# ⚙️ Environment Variables

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=contacts_db
```

---

# 📸 Application Preview

<div align="center">

## 🔐 Login Page
<img src="assets/login.png" width="700" alt="Login"/>

<br><br>

## 📝 Sign Up
<img src="assets/sign up.png" width="700" alt="Sign Up"/>

<br><br>

## 🏠 Application Home
<img src="assets/app acccueil.png" width="700" alt="Accueil Application"/>

<br><br>

## 📊 Dashboard
<img src="assets/dashboard.png" width="700" alt="Dashboard"/>

<br><br>

## 🔢 Assign Number
<img src="assets/assign numbur.png" width="700" alt="Assign Number"/>

<br><br>

## 🔑 Key Security
<img src="assets/key sec.png" width="700" alt="Key Security"/>

<br><br>

## 🚪 Resignation Page
<img src="assets/resign.png" width="700" alt="Resign"/>

</div>

---

# 📁 Project Structure

```bash
gestion-contacts-apmf/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── ...
│
└── README.md
```
