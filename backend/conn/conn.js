const moongoose=require("mongoose")

const conn=async () => {

    try {
        console.log(process.env.URI)
        await moongoose.connect(process.env.URI)
        console.log("Connected to DataBase")
     }

    catch (error) {
        console.log(error)
    }
}

conn();