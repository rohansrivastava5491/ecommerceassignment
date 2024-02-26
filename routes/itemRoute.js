import { Router } from "express";
import { getItem, updateItem, deleteItem, postItem, getSingleItem } from "../controllers/itemController.js";

const router = Router();

router.post('/item',postItem);
router.get('/',getItem);
router.get('/item/edit/:id',getSingleItem);
router.put('/item/:id',updateItem);
router.delete('/item/:id',deleteItem);
export default router;