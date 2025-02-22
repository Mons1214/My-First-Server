const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000; // Puerto donde correrá el servidor


//Esta funcion consologuea la fecha, la hora, el metodo y la url
const logger = (req, res, next) => {
  const logEntry = {
    timeStamp: new Date().toISOString(),
    method: req.method,
    url: req.url 
  };

  fs.readFile("log.json", "utf8", (err, data) =>  {
   
    let logs = []
    if(!err && data ){
      logs = JSON.parse(data)
    };
  
    logs.push(logEntry)
    
    //fileSistem
    fs.writeFile("log.json", JSON.stringify(logs, null, 2), (err) => {
      if(err){
        console.log("error en guardar el archivo log.json")
      };
    });
  });
  next()//Next nos indica  que ya termino y puede continuar con lo siguiente
};

//Vuelve los archivos estaticos y permite utilizarlos
app.use(express.static("public")) 
app.use(logger)

//Esta es la página principal
app.get("/", (req, res) => { res.sendFile(path.join(__dirname,"public","principal.html")); });

// Esta es la primer página
app.get("/primera", (req, res) => {
  res.sendFile(path.join(__dirname,"public","primer","index.html"));
});

//Esta es la segunda página
app.get("/segunda", (req, res) => {
  res.sendFile(path.join(__dirname,"public","segunda","index.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});