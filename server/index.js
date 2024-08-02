const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const EmployeeModal = require('./models/Employee');
const { message } = require("statuses");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://ganeshdadipelli43:Ganesh123@cluster0.edezifa.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");

    app.post("/register", async(req, res) => {
      try{

        const { name, email, password } = req.body;

        if(!name || !email || !password){
          return res.send({message:"Name is required"})
        }

        //check user
        const exisitingUser = await EmployeeModal.findOne({email})
        if(exisitingUser){
          return res.status(200).send({
            success:false,
            message:"Already registerd login"
          })
        }
        
        const user  = new EmployeeModal({name,email,password}).save();
        res.status(201).send(
          console.log("registerd successfully")
        )
      }catch(error){
        console.log(error)
      }
    
     
    });

    app.post("/login", (req, res) => {
      const { email, password } = req.body;

      EmployeeModal.findOne({ email: email })
        .then(user => {
          if (user) {
            if (user.password === password) {
              res.json("success");
            } else {
              res.json("the password is incorrect");
            }
          } else {
            res.json("User not found");
          }
        })
        .catch(err => {
          console.error("Error during login:", err);
          res.status(500).json({ error: "An error occurred during login." });
        });
    });

    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch(err => console.error("Could not connect to MongoDB...", err));
