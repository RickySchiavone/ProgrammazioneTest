require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("✅ Connesso a MongoDB");
})
.catch((err) => {
    console.log("❌ Errore connessione:", err);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});