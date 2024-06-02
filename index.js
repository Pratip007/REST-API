const express = require("express");
const user = require("./MOCK_DATA.json")
const fs = require("fs");
const mongoose = require("mongoose");
const { log } = require("console");


const app = express()
const PORT = 8000
app.use(express.json())

// middleware - plugin
app.use(express.urlencoded({extended : false}))

app.use((req,res,next)=>{
   console.log('hello from middleware 1') 
    next()
})

app.use((req, res, next)=>{
   console.log('hello from middlewar 2')
   
  // res.send({status : "can not send request "})
    next()

})


//Rout
app.get('/user' ,(req, res)=>{
    res.setHeader('X-Name' , 'Pratip ')
    const html =`
    <ul>
    ${user.map((user)=> `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html)

})

app.get('/api/user' ,(req, res)=>{
    return res.json(user)
    
})


app
.route('/api/user/:id')
//getting data 
.get((req, res)=>{
   const id =Number(req.params.id);
   const userIndex = user.find((user)=> user.id === id);
  
   return res.json(userIndex);
})

.patch(async (req, res) => {
    const userId = Number(req.params.id);
    const userData = req.body; // Data to update

    // Find the index of the user with the given ID
    const userIndex = user.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
 console.log(userData);
    // Update the user data
    user[userIndex] = { ...user[userIndex], ...userData };

    // Write the updated data back to the JSON file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user), (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json({ status: 'User updated successfully' });
    });
})


.delete((req, res) => {
    // delete the user with given id
    const userId = Number(req.params.id);
    const userIndex = user.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    user.splice(userIndex, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user), (err, data) => {
        return res.json({ status: 'User deleted successfully' });
    });
});




app.post('/api/user',async (req ,res) =>{
  // create new user
  const alien  = await req.body

 user.push({
   ...alien ,id: user.length +1
 })
//   console.log(user)
//   const body = req.params.body;
//   console.log(body);
//   if(!body || !body.first_name || !body.last_name ){
//     return res.status(400).json({msg : "fields aer requare"})
//   }
  // id cannot get from front end , the lopp is for generate the id
//   user.push({...body,id : user.length +1})
 fs.writeFile("./MOCK_DATA.json", JSON.stringify(user),(err, data)=>{
    return res.status(201).json({status : "success", id : user.length })
 })
   console.log(alien)

})






app.listen(PORT ,()=> console.log(`server is running, port is : ${PORT}`))