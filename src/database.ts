import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Fonction pour ouvrir  la base de données
export async function openDb() {
  return open({
    filename: "./users.db", 
    driver: sqlite3.Database,
  });
}
