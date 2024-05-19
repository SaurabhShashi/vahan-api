const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create Table
app.post("/define", async (req, res) => {
  const { tableName, fields } = req.body; // Expect fields to be an array of { fieldName, type }
  const fieldDefinitions = fields
    .map((f) => `${f.fieldName} ${f.type}`)
    .join(", ");
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (id SERIAL PRIMARY KEY, ${fieldDefinitions})`;

  try {
    await pool.query(query);
    res.status(200).send(`Table ${tableName} created successfully.`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create table");
  }
});

// Insert Data
app.post("/insert/:tableName", async (req, res) => {
  const { tableName } = req.params;
  const keys = Object.keys(req.body);
  const values = Object.values(req.body).map((value) => `'${value}'`);
  const query = `INSERT INTO ${tableName} (${keys.join(
    ", "
  )}) VALUES (${values.join(", ")}) RETURNING *`;

  try {
    const result = await pool.query(query);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to insert data");
  }
});

// Read Data
app.get("/getAll/:tableName", async (req, res) => {
  const { tableName } = req.params;
  const query = `SELECT * FROM ${tableName}`;

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to retrieve data");
  }
});

// Update Data
app.put("/update/:tableName/:id", async (req, res) => {
  const { tableName, id } = req.params;
  const updates = Object.keys(req.body)
    .map((key) => `${key} = '${req.body[key]}'`)
    .join(", ");
  const query = `UPDATE ${tableName} SET ${updates} WHERE id = ${id} RETURNING *`;

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update data");
  }
});

// Delete Data
app.delete("/delete/:tableName/:id", async (req, res) => {
  const { tableName, id } = req.params;
  const query = `DELETE FROM ${tableName} WHERE id = ${id}`;

  try {
    await pool.query(query);
    res.status(200).send("Record deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete data");
  }
});

const PORT = process.env.PORT;

const server = async () => {
  //   const result = await db.raw("SELECT 1");
  console.log("database connected");
  app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
};

server();
