import {Router} from 'express';
import { getCartItems,addCartItem,deleteCartItem } from '../controllers/cartController.js';
const router = Router();

router.get('/cart/:id',getCartItems);
router.post('/cart/:id',addCartItem);
router.delete('/cart/:userId/:itemId',deleteCartItem);

export default router;