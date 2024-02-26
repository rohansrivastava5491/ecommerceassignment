import Cart from "../models/cartModel.js";
import Item from "../models/itemModel.js"; // Changed 'items' to 'Item'

export const getCartItems = async (req, res) => {
    const userId = req.params.id;
    try {
        let cart = await Cart.findOne({ userId }); // Changed 'cart' to 'Cart'
        if (cart && cart.items.length > 0) {
            res.send(cart);
        } else {
            res.send(null);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
}

export const addCartItem = async (req, res) => {
    const userId = req.params.id;
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId }); // Changed 'cart' to 'Cart'
        let item = await Item.findOne({ _id: productId }); // Changed 'items' to 'Item'
        if (!item) {
            return res.status(404).send('Item not found!'); // Return added
        }
        const price = item.price;
        const name = item.title;

        if (cart) {
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            if (itemIndex > -1) {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            } else {
                cart.items.push({ productId, name, quantity, price });
            }
            cart.bill += quantity * price;
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            const newCart = await Cart.create({ // Changed 'cart' to 'Cart'
                userId,
                items: [{ productId, name, quantity, price }],
                bill: quantity * price
            });
            return res.status(201).send(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
}
export const deleteCartItem = async(req,res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send('Cart not found for the user');
        }

        const itemIndex = cart.items.findIndex(item => item.productId == itemId);

        if (itemIndex === -1) {
            return res.status(404).send('Item not found in the cart');
        }

        const deletedItem = cart.items.splice(itemIndex, 1)[0];
        cart.bill -= deletedItem.quantity * deletedItem.price;

        await cart.save();

        res.status(200).send({ message: 'Item deleted successfully', cart });
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
}