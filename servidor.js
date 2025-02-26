const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000; // Puerto donde correrá el servidor


// Función para obtener el nombre del archivo de log del día actual
const getLogFileName = () => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `log-${date}.json`;
};

// Middleware de logging
const logger = (req, res, next) => {
  const staticExtensions = ['.css', '.js'];
  const ext = path.extname(req.url);
  
  if (!staticExtensions.includes(ext)) {
    const logEntry = {
      timeStamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    };
    
    const logFileName = getLogFileName();
    
    fs.readFile(logFileName, "utf8", (err, data) => {
      let logs = [];
      if (!err && data) {
        try {
          logs = JSON.parse(data);
        } catch (parseError) {
          console.error("Error parsing log file", parseError);
        }
      }
      
      logs.push(logEntry);
      
      fs.writeFile(logFileName, JSON.stringify(logs, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar el archivo de log", err);
        }
      });
    });
  }
  next();
};


app.use(logger)
//Vuelve los archivos estaticos y permite utilizarlos
app.use(express.static("public")) 

//Esta es la página principal
app.get("/", (req, res) => { res.sendFile(path.join(__dirname,"public","principal.html")); });

// Esta es la primer página
app.get("/primera", (req, res) => {
  res.sendFile(path.join(__dirname,"public","primer","index.html"));
});

//Esta es la segunda página
app.get("/two", (req, res) => {
  res.sendFile(path.join(__dirname,"public","segunda","index.html"));
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});