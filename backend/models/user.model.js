import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    profilePicture:{
        type:String,
        default:"https://image.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-260nw-2264922221.jpg"
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},
{timestamps:true}
);

const User = mongoose.model('User',userSchema);

export default User;