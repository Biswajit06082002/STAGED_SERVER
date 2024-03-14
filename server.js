const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const app = express();
const cors = require('cors');
const UsersModel = require("./Models/users.js");
const RecordModel = require("./Models/records.js");
const MoviesModel = require("./Models/movies.js");
app.use(express.json());
require('dotenv').config();

const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})

//Sign Up
app.post('/SignUp', async (req, res)=>{

    const {
        username,
        email,
        password,
        signin_type
    } = req.body;
    try {
        let user = await UsersModel.findOne({
            email
        });
        if (user) {
            return res.status(400).json({
                msg: "User Already Exists"
            });
        }
        
        user = new UsersModel({
            username,
            email,
            password,
            creation_date: new Date(),
            signin_type
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        const dataToSave = await user.save();
        res.status(200).json(dataToSave);
 
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

//Log In
app.post('/LogIn', async (req, res)=>{

    const { username, password } = req.body;
    try {
        let user = await UsersModel.findOne({
          username
        });
        if (!user)
        return res.status(400).json({
          message: "User Does Not Exist"
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({
                message: "Incorrect Password !"
              });
             
        }else{
            res.status(200).json(user);
        }
    }catch(error){
        res.status(400).json({message: error.message})

    }
})


//Check Username
app.post('/Auth/CheckUserName', async (req, res)=>{
    const { username } = req.body;
    try {
        let user = await UsersModel.findOne({
          username
        });
        if (user){
            return res.status(400).json({
                message: "Username Not Available!"
              });
        }else{
            return res.status(400).json({
                message: "Username Available."
              });
        }
        
             
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

//Add to history
app.post('/History/Add', async (req, res)=>{
    const { userId, videoId,  videoTitle, videoThumbnailLink} = req.body;
    try {
        record = new RecordModel({
            userId,
            videoId,
            videoTitle,
            videoThumbnailLink,
            timeStamp: new Date()
        });
        const dataToSave = await record.save();
        res.status(200).json(dataToSave);
             
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

//Get History
app.post('/History/Get', async (req, res) => {
    const { userId } = req.body;
    try {

        const records = await RecordModel.find({ userId }).sort({ timeStamp: -1 });
        if (records.length === 0) {
            return res.status(404).json({ message: "No history found for the provided user ID" });
        }

        res.status(200).json({ records });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});

//Get User by Id
app.post('/GetUserById', async (req, res) => {
    const { userId } = req.body;
    try {

        const user = await UsersModel.find({ userId });
        if(!user){
            return res.status(400).json({
                message: "User not found!!"
              });
        }
        res.status(200).json({ user });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});

//Add Movie Link 
app.post('/Movie/AddLink', async (req, res)=>{
    const { videoIframe, videoId,  isAvailable} = req.body;
    try {
        movie = new MoviesModel({
            videoId,
            videoIframe,
            isAvailable
          
        });
        const dataToSave = await movie.save();
        res.status(200).json(dataToSave);
             
    }catch(error){
        res.status(400).json({message: error.message})
    }
})


//Update Movie Link 
app.put('/Movie/UpdateLink', async (req, res) => {
    const { videoIframe, videoId, isAvailable } = req.body;
    try {
     
        let movie = await MoviesModel.findOne({ videoId });
         if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
         movie.videoIframe = videoIframe;
        movie.isAvailable = isAvailable;
        const updatedMovie = await movie.save();
         res.status(200).json(updatedMovie);
    } catch (error) {
       
        res.status(400).json({ message: error.message });
    }
});

//Delete movie Link
app.delete('/Movie/Delete', async (req, res) => {
    const { videoId } = req.body;
    try {
      
        const deletedMovie = await MoviesModel.findOneAndDelete({ videoId });

      
        if (!deletedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        
        res.status(200).json(deletedMovie);
    } catch (error) {
    
        res.status(400).json({ message: error.message });
    }
});

//Get all movies
app.get('/Movie/GetAll', async (req, res) => {
    try {

        const movies = await MoviesModel.find();
        if (movies.length === 0) {
            return res.status(404).json({ message: "No movies found" });
        }
         res.status(200).json({ movies });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





database.once('connected', () => {
    console.log('Database Connected');
})

app.listen(8000, () => {
    console.log(`Server Started at port ${8000}`)
})

