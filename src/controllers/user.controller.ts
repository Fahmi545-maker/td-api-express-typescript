import { Request, Response } from "express";
import { openDb } from "../database";

// Création de la table 
async function ensureTable() {
  const db = await openDb();
  await db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL)"
  );
  return db;
}

// POST /users  — Ajouter un utilisateur
export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Nom et email requis" });

    const db = await ensureTable();
    const result = await db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    const created = { id: result.lastID, name, email };
    return res.status(201).json({ message: `Utilisateur ${name} ajouté avec succès !`, user: created });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /users — Récupérer tous les utilisateurs
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const db = await ensureTable();
    const users = await db.all("SELECT * FROM users");
    return res.json({ users });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /users/:id — Récupérer un utilisateur spécifique
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "id invalide" });

    const db = await ensureTable();
    const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    return res.json({ user });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /users/:id — Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body as { name?: string; email?: string };
    if (Number.isNaN(id)) return res.status(400).json({ message: "id invalide" });
    if (!name && !email) return res.status(400).json({ message: "Rien à mettre à jour" });

    const db = await ensureTable();
    const current = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!current) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const newName = name ?? current.name;
    const newEmail = email ?? current.email;

    await db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [newName, newEmail, id]);
    return res.json({ message: "Utilisateur mis à jour", user: { id, name: newName, email: newEmail } });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE /users/:id — Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "id invalide" });

    const db = await ensureTable();
    const existing = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ message: "Utilisateur non trouvé" });

    await db.run("DELETE FROM users WHERE id = ?", [id]);
    return res.json({ message: "Utilisateur supprimé", id });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
