const moongoose= require('mongoose');

const user=new moongoose.Schema(
    {
        username:
        {
            type:String,
            required:true,
            unique:true
        },
        email:
        {
            type:String,
            required:true,
            unique:true
        },
        password:
        {
            type:String,
            required:true,
        },
        address:
        {
            type:String,
            require:true
        },
        avatar:
        {
            type:String,
            default:"https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"
        },
        role:
        {
            type:String,
            default:"user",
            enum:["user","admin","publisher"],
        },
        favourites: [{   // Make it an array
            type: moongoose.Types.ObjectId,
            ref: "book"
        }],
        cart: [{   // Make it an array
            type: moongoose.Types.ObjectId,
            ref: "book"
        }],
        order: [{   // Array for multiple orders
            type: moongoose.Types.ObjectId,
            ref: "order"
        }]
    },
    {timestamps:true}

)
module.exports=moongoose.model("users",user)