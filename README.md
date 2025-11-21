

# TD : Création d’une API REST avec Node.js et TypeScript

Ce projet a été réalisé dans le cadre du module **Technologies du Web**, sous la direction de **M. Robert Tomczak**.
L’objectif était de construire une **API REST complète** avec Node.js, Express et TypeScript, tout en respectant la structure imposée du TD et en effectuant les tests avec Postman et PowerShell.
Dans ce Readme je vais vous aidez a pratiquer et créer un API en suivant les memes étapes que j'ai fait durant le TP jusqu'aux tests réalisés . 

##  Objectif du projet

L’objectif de ce TD était de comprendre le **fonctionnement complet d’une API REST** :

* Comment le serveur reçoit et interprète une requête HTTP,
* Comment il la redirige vers la bonne route,
* Comment le contrôleur traite les données,
* Et comment la réponse JSON est renvoyée au client.

Le projet porte sur la **gestion d’utilisateurs (CRUD)** avec une **base de données SQLite**, afin que les données restent enregistrées même après arrêt du serveur.



## PARTIE 1 — De la préparation à la première exécution

### 1. Téléchargement ou clonage du projet


* **Depuis fichier ZIP :**

  1. Télécharger le fichier ZIP depuis GitHub.
  2. Le décompresser .
  3. Ouvrir le dossier dans **Visual Studio Code**.
  4. Ouvrir un **nouveau terminal intégré** (`Ctrl + u`).



### 2. Installation de Node.js et des dépendances

Si Node.js n’est pas encore installé :

1. Aller sur [https://nodejs.org/](https://nodejs.org/).
2. Télécharger la version **LTS** (recommandée).
3. Vérifier ensuite dans le terminal :

 
   node -v
   npm -v
 

Ensuite, installer toutes les dépendances du projet :

npm install

Cela installe automatiquement :

* `express` (framework de serveur web)
* `dotenv` (variables d’environnement)
* `typescript`, `ts-node`
* `@types/node`, `@types/express` (typages)
* `nodemon` (rechargement automatique)



### 3. Configuration des  fichiers et Structure du projet : 

```
src/
 ├── index.ts              → point d’entrée du serveur Express
 ├── database.ts           → gestion de la base SQLite
 ├── controllers/
 │     └── user.controller.ts → logique métier (ajout, lecture, suppression)
 └── routes/
       └── user.routes.ts     → définition des routes /users
.env
nodemon.json
tsconfig.json
package.json
```

Chaque dossier a un rôle précis :

* **index.ts** : démarre le serveur et charge les routes.
* **routes** : gère les chemins (`GET`, `POST`, etc.).
* **controllers** : contient les fonctions exécutées quand une route est appelée.
* **database.ts** : initialise et gère la base de données SQLite.

### 4. Lancer le projet en mode développement

Exécuter la commande suivante dans le terminal et vérifier que vous etes dans le dossier contenant package.json  :
npm run dev
Si tout est bien configuré, le terminal affiche :


 Serveur démarré sur http://localhost:4000

![Serveur démarré](images/serveurdémarré.png)
Cela signifie que le  serveur fonctionne correctement.



### 5. Vérifier le bon fonctionnement du serveur

Ouvrez votre navigateur et entrez l’URL :

http://localhost:4000/

Le navigateur affiche :

 API Node.js avec TypeScript fonctionne !


C’est la preuve que votre serveur Express est opérationnel.






##  Tests de la Partie 1

L’objectif ici est de tester les deux routes principales :
`GET /users` et `POST /users`.

### 1️ Test GET /users

#### a) Dans le terminal :


curl -X GET http://localhost:4000/users


**Résultat attendu :**


{ "message": "Liste des utilisateurs" }


#### b) Ou via PowerShell :

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:4000/users"
```



### 2️ Test POST /users

#### a) Avec PowerShell :


$body = @{ name = "Alice"; email = "alice@example.com" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://localhost:4000/users" -Body $body -ContentType "application/json"
`

**Résultat attendu :**


{ "message": "Utilisateur Alice ajouté avec succès !", "email": "alice@example.com" }


#### b) Avec Postman :

1. Ouvrir Postman
2. Choisir la méthode **POST**
3. URL : `http://localhost:4000/users`
4. Aller dans **Body → raw → JSON**
5. Coller :


{ "name": "Alice", "email": "alice@example.com" }


6. Cliquer sur **Send**



##  PARTIE 2 — Ajout du stockage et CRUD complet

Après la première version fonctionnelle, la deuxième partie du TD consiste à :

1. Ajouter un **stockage en mémoire**, puis
2. Mettre en place une **base de données SQLite** pour garder les utilisateurs.



### 1. Ajout du stockage en mémoire

Le TD proposait d’abord une version simple avec un tableau `users[]` :

* `GET /users` affiche la liste du tableau.
* `POST /users` ajoute un utilisateur au tableau.

**Limite :** les données disparaissent quand le serveur redémarre.
 D’où le passage à une base de données SQLite.



### 2. Mise en place de la base SQLite

#### Étape 1 — Installer la base sur terminal  :


npm install sqlite3 sqlite


#### Étape 2 — Initialiser la table automatiquement :

Lors du premier démarrage, le fichier `users.db` est créé avec la table :


CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);


#### Étape 3 — Vérifier la persistance :

Quand on ajoute un utilisateur, il reste dans la base même après redémarrage.

##  Tests CRUD complets

Les 5 routes principales sont désormais actives :
```
| Méthode | Route        | Description                    |
| - |  |  |
| GET     | `/users`     | Liste tous les utilisateurs    |
| POST    | `/users`     | Ajoute un utilisateur          |
| GET     | `/users/:id` | Récupère un utilisateur précis |
| PUT     | `/users/:id` | Met à jour un utilisateur      |
| DELETE  | `/users/:id` | Supprime un utilisateur        |
```


###  Exemple de tests PowerShell


# 1️ Créer
$u = @{ name = "Meriem"; email = "meriem@example.com" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://localhost:4000/users" -Body $u -ContentType "application/json"

# 2️ Lister
Invoke-RestMethod -Method GET -Uri "http://localhost:4000/users"

# 3️ Consulter un utilisateur
Invoke-RestMethod -Method GET -Uri "http://localhost:4000/users/1"

# 4️ Mettre à jour
$update = @{ name = "Meriem Fahmi"; email = "fahmi@example.com" } | ConvertTo-Json
Invoke-RestMethod -Method PUT -Uri "http://localhost:4000/users/1" -Body $update -ContentType "application/json"

# 5️ Supprimer
Invoke-RestMethod -Method DELETE -Uri "http://localhost:4000/users/1"


###  Résultats observés

* Les réponses JSON s’affichent correctement dans le terminal.
* Les utilisateurs sont bien enregistrés dans `users.db`.
* Les tests restent valides même après redémarrage.



##  Bilan technique
```
| Critère                             | Description                         | Statut |
| -- | -- |  |
| Structure du projet                 | src/, routes/, controllers/ séparés | fait     |
| Configuration TypeScript            | Fichier tsconfig complet et correct | fait     |
| Routes GET/POST                     | Réponses JSON correctes             | fait     |
| Contrôleurs typés                   | getUsers / addUser bien séparés     | fait     |
| Gestion des données                 | Mémoire puis base SQLite            | fait     |
| Variables d’environnement           | .env fonctionnel avec dotenv        | fait     |
| Tests (cURL / PowerShell / Postman) | Validés                             | fait     |
| Documentation                       | Projet clair et reproductible       | fait     |
| Bonus                               | CRUD complet + persistance          | fait     |
```

##  Conclusion personnelle

Ce TD m’a permis de comprendre le **fonctionnement interne d’une API REST** :

* la gestion des routes avec Express,
* la séparation du code en couches claires (routes, contrôleurs, base),
* l’utilisation de TypeScript pour éviter les erreurs,
* et l’importance de tester systématiquement chaque requête.

La partie bonus avec **SQLite** m’a fait découvrir la persistance réelle des données.
C’est un projet formateur, qui montre la logique complète d’un développement backend professionnel.



**Auteure :** Meriem Fahmi
**Année universitaire :** 2025
**Module :** Technologies du Web – Création d’API avec Node.js






