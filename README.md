# Gestion des Contacts Professionnels – APMF

Application web de gestion des contacts professionnels, développée lors d'un stage
à l'APMF .

## Fonctionnalités

- Ajout et gestion des contacts professionnels
- Interface utilisateur responsive (React.js + TailwindCSS)
- API REST pour les opérations CRUD
- Exportation des contacts en fichier xls
- Authentification simple

## Stack technique

| Couche    | Technologie          |
|-----------|----------------------|
| Frontend  | React.js, TailwindCSS |
| Backend   | Express.js, Node.js  |
| Base de données | PostgreSQL          |

## Installation locale

```bash
# Cloner le repo
git clone https://github.com/clarcki-RAS/gestion-contacts-apmf.git
cd gestion-contacts-apmf

# Backend
cd backend
npm install
cp .env.example .env  # configurer les variables
node index.js

# Frontend
cd ../frontend
npm install
npm run dev
```

## Variables d'environnement

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=contacts_db
```
