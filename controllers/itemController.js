import items from '../models/itemModel.js';
import multer from "multer";

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const postItem = async (req, res) => {
    try {
        // Use upload.single("image") middleware here to handle file upload
        upload.single("image")(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                // Handle Multer errors
                return res.status(400).json({
                    success: false,
                    message: "Error uploading image: " + err.message
                });
            } else if (err) {
                // Handle other errors
                return res.status(500).json({
                    success: false,
                    message: "Server error: " + err.message
                });
            }

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload an image file"
                });
            }

            const { title, description, category, price } = req.body;
            if (!title || !description || !category || !price) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide all required fields: title, description, category, price"
                });
            }

            // Convert the image data to base64 format
            const imageData = req.file.buffer.toString('base64');
            const contentType = req.file.mimetype;

            // Create a new item object with image data as base64
            const newItem = new items({
                title,
                description,
                category,
                price,
                image: imageData, // Store image as base64 string
                contentType: contentType // Store MIME type
            });

            // Save the new item to the database
            const savedItem = await newItem.save();

            res.status(201).json({
                success: true,
                message: "New item created",
                item: savedItem
            });
        });
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export const getItem = async(req,res) => {
    try {
        items.find().sort({date: -1}).then(item=> res.json(item));        
    } catch (error) {
        res.status(500).send(error);
    }
}
export const getSingleItem = async(req, res) => {
    const id = req.params.id; 
    try {
        // Assuming items is a collection or an array
        // Change `findById` according to your database or data structure
        const item = await items.findById(id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item); // Sending the found item in the response
    } catch (error) {
        res.status(500).send(error);
    }
}
export const updateItem = async(req,res) => {
    try {
        const updatedItem = await items.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }
    
        return res.json({
            success: true,
            message: "Item updated successfully",
            item: updatedItem
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
    
}
export const deleteItem = async(req,res) => {
    try {
        items.findByIdAndDelete({_id: req.params.id}).then(function(item){
        res.json({success: true});
        });    
    } catch (error) {
        res.status(500).send(error);
    }
    
}