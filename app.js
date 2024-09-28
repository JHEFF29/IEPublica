const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const { connectToDatabase, sql } = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');


const app = express();

// Middleware para servir archivos estáticos (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Ruta para la página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Ruta para la página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Ruta protegida (Dashboard)
app.get('/dashboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});


// Registro de usuario
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Faltan datos');
    }

    try {
        const pool = await connectToDatabase();
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, hashedPassword)
            .query('INSERT INTO Users (username, password) VALUES (@username, @password)');
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Login de usuario
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Faltan datos');
    }

    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                req.session.user = user;
                return res.redirect('/dashboard');
            }
        }
        res.status(401).send('Credenciales incorrectas');
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Servidor escuchando
app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});
