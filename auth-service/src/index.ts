import app, { connectDB } from './app';

const PORT = process.env.PORT || 3005;

const start = async () =>{
 try{
    await connectDB();
    app.listen(PORT, ()=>{
        console.log(`Auth Service is running on ${PORT}`);
    });
 }catch(err){
    console.error('Failed to start server', err);
 }
}

start();