const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.sendFile(__dirname+'/index.html'));
app.get("/validateURL", (req,res) => {
    fetch(req.query.URL, {mode:"no-cors"})
    .then(response => { 
      if (response.status !== 200) throw new Error("Invalid Url")
      else return res.status(200).json({message: "ok"})
      })
    .catch(err => (console.error(err), res.status(406).json({message: err.message})))
})

app.listen(80, ()=> console.log("Server Running @ port 80"));
