const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// Operaciones CRUD para citas

app.get('/api/citas', (req, res) => {
    db.query('SELECT * FROM citas', (err, results) => {
        if (err) {
            console.error('Error fetching appointments:', err);
            res.status(500).send('Error fetching appointments');
        } else {
            res.json(results);
        }
    });
});

app.post('/api/citas', (req, res) => {
  const { fecha, hora, servicio, id_cliente, id_barbero } = req.body;
  db.query(
    'INSERT INTO citas (fecha, hora, servicio, id_cliente, id_barbero) VALUES (?, ?, ?, ?, ?)',
    [fecha, hora, servicio, id_cliente, id_barbero],
    (err, result) => {
      if (err) {
        console.error('Error creating appointment:', err);
        res.status(500).send('Error creating appointment');
      } else {
        res.status(201).json({ id: result.insertId, ...req.body });
      }
    }
  );
});

app.put('/api/citas/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'UPDATE citas SET ? WHERE id_cita = ?',
    [req.body, id],
    (err) => {
      if (err) {
        console.error('Error updating appointment:', err);
        res.status(500).send('Error updating appointment');
      } else {
        res.sendStatus(200);
      }
    }
  );
});


app.delete('/api/citas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM citas WHERE id_cita = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting appointment:', err);
      res.status(500).send('Error deleting appointment');
    } else {
      res.sendStatus(200);
    }
  });
});


// Operaciones CRUD para barberos

app.get('/api/barberos', (req, res) => {
    db.query('SELECT * FROM barberos', (err, results) => {
        if (err) {
            console.error('Error fetching barbers:', err);
            res.status(500).send('Error fetching barbers');
        } else {
            res.json(results);
        }
    });
});

app.post('/api/barberos', (req, res) => {
  const { nombre_barbero, telefono_barbero, especialidad, turno, activo } = req.body;
  db.query(
    'INSERT INTO barberos (nombre_barbero, telefono_barbero, especialidad, turno, activo) VALUES (?, ?, ?, ?, ?)',
    [nombre_barbero, telefono_barbero, especialidad, turno, activo],
    (err, result) => {
      if (err) {
        console.error('Error creating barber:', err);
        res.status(500).send('Error creating barber');
      } else {
        res.status(201).json({ id: result.insertId, ...req.body });
      }
    }
  );
});

app.put('/api/barberos/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'UPDATE barberos SET ? WHERE id_barbero = ?',
    [req.body, id],
    (err) => {
      if (err) {
        console.error('Error updating barber:', err);
        res.status(500).send('Error updating barber');
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.delete('/api/barberos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM barberos WHERE id_barbero = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting barber:', err);
      res.status(500).send('Error deleting barber');
    } else {
      res.sendStatus(200);
    }
  });
});

// Operaciones CRUD para Clientes

app.get('/api/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
        if (err) {
            console.error('Error fetching clients:', err);
            res.status(500).send('Error fetching clients');
        } else {
            res.json(results);
        }
    });
});

app.post('/api/clientes', (req, res) => {
  const { nombre_cliente, correo, telefono_cliente, frecuente } = req.body;
  db.query(
    'INSERT INTO clientes (nombre_cliente, correo, telefono_cliente, frecuente) VALUES (?, ?, ?, ?)',
    [nombre_cliente, correo, telefono_cliente, frecuente],
    (err, result) => {
      if (err) {
        console.error('Error creating client:', err);
        res.status(500).send('Error creating client');
      } else {
        res.status(201).json({ id: result.insertId, ...req.body });
      }
    }
  );
});

app.put('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'UPDATE clientes SET ? WHERE id_cliente = ?',
    [req.body, id],
    (err) => {
      if (err) {
        console.error('Error updating client:', err);
        res.status(500).send('Error updating client');
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.delete('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE id_cliente = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting client:', err);
      res.status(500).send('Error deleting client');
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
