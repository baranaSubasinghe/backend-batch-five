import User  from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export function createUser(req, res) {
    // Check if the new user is being created as an admin
    if (req.body.role === "admin") {
        // Ensure the request is coming from a logged-in user
        if (req.user != null) {
            // If logged-in user is NOT admin, block the request
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    message: "You are not allowed to create admin accounts"
                });
            }
        } else {
            // If no user is logged in
            return res.status(403).json({
                message: "You are not allowed to create admin accounts. Please login first."
            });
        }
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Create new user object
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    });

    // Save user to database
    user.save()
        .then(() => {
            res.json({
                message: "User saved"
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Data not saved",
                error: err.message
            });
        });
}

 export function loginUser(req,res){
   
       const email = req.body.email 
       const password = req.body.password

       User.findOne({email : email}).then((user)=>{
        if(user==null){
            res.status(404).json({
                message:"user not found"
            })
        }else{
            const isPasswordMatch = bcrypt.compareSync(password,user.password)
            if(isPasswordMatch){
//gnerate token and send it to user
        const token=jwt.sign({
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            role:user.role,
            img:user.image
},
"secretKey"
)

                res.json({
                    message:"login success",
                    token:token
                   
                })
            }else{
                res.status(401).json({
                    message:"invalid password"
                })
                
            }
       }
        }
       )

 }

export function isAdmin(req){
    if(req.user==null){
   
    return false
}
if(req.user.role!="admin"){

    return false
    
}
return true
}
 
