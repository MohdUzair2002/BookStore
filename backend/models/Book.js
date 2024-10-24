const moongoose=require("mongoose")

const book=new moongoose.Schema(
    {  pub_id:
        {
            type:moongoose.Types.ObjectId,
            required:true

        },
        url:
        {
            type:String,
            required:true,
        },
        title:
        {
            type:String,
            required:true,
        },
        author:
        {
            type:String,
            required:true,
        },
        price:
        {
            type:Number,
            required:true,
        },
        desc:
        {
            type:String,
            required:true,
        },
        language:
        {
            type:String,
            required:true,
        },
        
        
    },
    {timestamps:true}

)
module.exports=moongoose.model("book",book)