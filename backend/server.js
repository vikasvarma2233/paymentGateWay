import app from './src/app/app.js'
import connectDB from './src/app/config/db.js'




await connectDB()

app.listen(3000,()=>{
    console.log("server is processing...")
})