import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim : true,
        minlength: 5,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase:true,

    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:6,
    },
    refreshAccessToken: {
        type:String,
    }
}, {
    timestamps: true,
});

//if password is not modified we pass our function to next - else we hash the password 
userSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hashSync(this.password, 10);
    next();
})

userSchema.methods.isPasswordValid = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(){

    return jwt.sign(
       //payload
       {
        _id : this._id,
        username : this.username,
        email : this.email,
       },
       process.env.ACCESS_TOKEN,
       {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
       } 
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        //payload
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

const User = mongoose.model("User", userSchema);


export default User;
