/*version 1 de TD
import { Router } from 'express';
import { getUsers, addUser } from '../controllers/user.controller';

const router = Router();*/

/**
 * GET /users : Récupère la liste des utilisateurs
 */
/*router.get('/', getUsers);*/

/**
 * POST /users : Ajoute un nouvel utilisateur
 */
/*router.post('/', addUser);

export default router;*/
import { Router } from "express";
import {
  getUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);        // GET /users
router.post("/", addUser);        // POST /users
router.get("/:id", getUserById);  // GET /users/:id
router.put("/:id", updateUser);   // PUT /users/:id
router.delete("/:id", deleteUser);// DELETE /users/:id

export default router;

