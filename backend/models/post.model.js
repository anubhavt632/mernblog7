// Import mongoose library for creating schema
import mongoose from "mongoose";

// Define the schema for the post model
const postSchema = new mongoose.Schema(
    {
        // User ID associated with the post
        userId: {
            type: String,
            required: true,
        },
        // Content of the post
        content: {
            type: String,
            required: true,
        },
        // Title of the post
        title: {
            type: String,
            required: true,
            unique: true,
        },
        // Image URL for the post (default image provided)
        image: {
            type: String,
            default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
        },
        // Category of the post (default is uncategorized)
        category:{
            type:String,
            default: 'uncategorized',
        },
        // Slug for the post URL (generated from title)
        slug: {
            type:String,
            required: true,
            unique: true,
        },
    }, 
    // Enable timestamps for createdAt and updatedAt fields
    { timestamps: true }
);

// Create the Post model using the schema
const Post = mongoose.model('Post', postSchema);

// Export the Post model for use in other files
export default Post;
