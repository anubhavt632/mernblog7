import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    postId: {
        type: String, // Consider using mongoose.Schema.Types.ObjectId if postId refers to an _id from another collection
        required: true,
    },
    userId: {
        type: String, // Similarly, consider using mongoose.Schema.Types.ObjectId for referencing user _id
        required: true,
    },
    likes: {
        type: Array,
        default: [],
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    },
}, { timestamps: true }); // Correct placement of the timestamps option

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
