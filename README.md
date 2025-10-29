
# TD : Création d’une API avec Node.js et TypeScript

Ce projet a été réalisé dansle  module **technologies web ** encadré par **M. Robert Tomczak**.
L’objectif était de créer une **API REST** avec Node.js et TypeScript, en respectant une structure claire .

---

## 1. Objectifs du TD

* Comprendre la structure d’un projet Node.js avec TypeScript.
* Créer un serveur Express et des routes simples (GET et POST).
* Mettre en place des contrôleurs séparés pour la logique métier.
* Utiliser un fichier `.env` pour définir des variables d’environnement.
* Ajouter un système de stockage (en mémoire, puis en base de données).
* Implémenter un CRUD complet (bonus).

---

## 2. Structure du projet

```
api-node-ts/
├── src/
│   ├── index.ts
│   ├── database.ts
│   ├── controllers/
│   │   └── user.controller.ts
│   └── routes/
│       └── user.routes.ts
├── .env
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md
```

* **index.ts** : point d’entrée de l’application (Express + configuration des routes).
* **user.routes.ts** : définition des routes utilisateurs (GET, POST, etc.).
* **user.controller.ts** : logique métier (traitement des requêtes).
* **database.ts** : gestion de la base SQLite (bonus).
* **.env** : variables d’environnement (port du serveur).

---

## 3. Étape 1 : Configuration du projet

1. Initialiser le projet :

```bash
npm init -y
```

2. Installer les dépendances :

```bash
npm install express dotenv
npm install -D typescript ts-node @types/node @types/express nodemon
```

3. Créer le fichier TypeScript :

```bash
npx tsc --init
```

4. Configurer `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": true
  }
}
```

---

## 4. Étape 2 : Création de l’API de base

### Fichier `src/index.ts`

```ts
import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import userRoutes from './routes/user.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('API Node.js avec TypeScript fonctionne !');
});

app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

---

### Fichier `src/routes/user.routes.ts`

```ts
import { Router } from 'express';
import { getUsers, addUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.post('/', addUser);

export default router;
```

---

### Fichier `src/controllers/user.controller.ts`

```ts
import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
  res.json({ message: 'Liste des utilisateurs' });
};

export const addUser = (req: Request, res: Response) => {
  const { name, email } = req.body;
  res.json({ message: `Utilisateur ${name} ajouté avec succès !`, email });
};
```

---

## 5. Étape 3 : Variables d’environnement

Créer un fichier `.env` à la racine :

```
PORT=4000
```

---

## 6. Étape 4 : Configuration Nodemon

Fichier `nodemon.json` :

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node -r dotenv/config src/index.ts"
}
```

---

## 7. Étape 5 : Tests de base

### a) Lancer le serveur

```bash
npm run dev
```

### b) Tester les routes

#### GET /users

```bash
curl -X GET http://localhost:4000/users
```

Réponse attendue :

```json
{ "message": "Liste des utilisateurs" }
```

#### POST /users

```bash
curl -X POST http://localhost:4000/users -H "Content-Type: application/json" -d '{"name": "Alice", "email": "alice@example.com"}'
```

Réponse attendue :

```json
{
  "message": "Utilisateur Alice ajouté avec succès !",
  "email": "alice@example.com"
}
```

---

## 8. Étape 6 : Bonus – Stockage persistant avec SQLite

### Installation de SQLite

```bash
npm install sqlite3
npm install -D @types/sqlite3
```

---

### Fichier `src/database.ts`

```ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './users.db',
    driver: sqlite3.Database
  });
}
```

---

### Fichier `src/controllers/user.controller.ts` (version finale CRUD)

```ts
import { Request, Response } from 'express';
import { openDb } from '../database';

// Création automatique de la table si elle n'existe pas
async function initDb() {
  const db = await openDb();
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )`);
}

// GET /users
export const getUsers = async (req: Request, res: Response) => {
  const db = await openDb();
  const users = await db.all('SELECT * FROM users');
  res.json({ users });
};

// POST /users
export const addUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Nom et email requis' });
  }
  const db = await openDb();
  await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  res.json({ message: `Utilisateur ${name} ajouté avec succès !`, email });
};

// GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
  const db = await openDb();
  const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
  res.json(user || { message: 'Utilisateur non trouvé' });
};

// PUT /users/:id
export const updateUser = async (req: Request, res: Response) => {
  const db = await openDb();
  const { name, email } = req.body;
  await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);
  res.json({ message: 'Utilisateur mis à jour avec succès' });
};

// DELETE /users/:id
export const deleteUser = async (req: Request, res: Response) => {
  const db = await openDb();
  await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'Utilisateur supprimé' });
};

initDb();
```

---

### Fichier `src/routes/user.routes.ts` (version finale CRUD)

```ts
import { Router } from 'express';
import { getUsers, addUser, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
```

---

## 9. Tests CRUD (PowerShell)

### Ajouter un utilisateur

```powershell
$body = @{ name = "Alice"; email = "alice@example.com" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://localhost:4000/users" -Body $body -ContentType "application/json"
```

### Lister tous les utilisateurs

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:4000/users"
```

### Mettre à jour un utilisateur

```powershell
$body = @{ name = "Alice Dupont"; email = "alice.dupont@example.com" } | ConvertTo-Json
Invoke-RestMethod -Method PUT -Uri "http://localhost:4000/users/1" -Body $body -ContentType "application/json"
```

### Supprimer un utilisateur

```powershell
Invoke-RestMethod -Method DELETE -Uri "http://localhost:4000/users/1"
```

---

## 10. Conclusion

Ce projet m’a permis de comprendre la création d’une API avec Node.js et TypeScript,
d’utiliser des contrôleurs pour séparer la logique du code, et de manipuler une base de données SQLite.

La première partie m’a appris à configurer une API simple avec Express et à gérer les requêtes HTTP.
La seconde partie (bonus) m’a permis d’ajouter une base de données et d’implémenter un CRUD complet.

Cette expérience m’a aidée à mieux comprendre le fonctionnement d’une API REST, la structure d’un projet backend,
et les bonnes pratiques de développement en TypeScript.
-------------------------------------------------------

## ✅ *Technologies Web– Université Polytechnique Hauts-de-France.*

