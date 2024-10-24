const moongoose=require("mongoose")

const order=new moongoose.schema(
    {
        user:
        {
            type:moongoose.Types.ObjectId,
            ref:"user",
        },
        book:
        {
            type:moongoose.Types.ObjectId,
            ref:"books",
        },
        status:
        {
            type:moongoose.Types.ObjectId,
            default:"Order Placed",
            enum:["Order Placed","Out for Delivery","Canceled"]
        },
    },
    {timestamps:true}

)
module.exports=moongoose.model("order",order)