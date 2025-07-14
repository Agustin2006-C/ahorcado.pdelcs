const express = require("express");
const mysql = require("./mysql2");
const cors = require("cors");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "score"
});

app.get("/api/score", (req, res) => {
  db.query("SELECT * FROM score ORDER BY puntos DESC LIMIT 10", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post("/api/score", (req, res) => {
  const { nombre, puntos, tiempo, fecha } = req.body;
  db.query("INSERT INTO score (nombre, puntos, tiempo, fecha) VALUES (?, ?, ?, ?)",
    [nombre, puntos, tiempo, fecha],
    err => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
});

app.get("/api/pdf", (req, res) => {
  const { nombre, puntos, tiempo } = req.query;

  const doc = new PDFDocument();
  res.setHeader("Content-Disposition", "attachment; filename=score.pdf");
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);
  doc.fontSize(20).text("Resultado del Juego Ahorcado", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Jugador: ${nombre}`);
  doc.text(`Puntos: ${puntos}`);
  doc.text(`Tiempo: ${tiempo} segundos`);
  doc.end();
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
