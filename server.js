const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');


// Configuração do servidor
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'cadastro_animais',
});


// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1); // Encerra o processo em caso de erro
    }
    console.log('Conectado ao banco de dados MySQL.');
});


// Rota para cadastrar um novo animal
app.post('/api/animals', (req, res) => {
    const { numero, raca, data, sexo } = req.body;

    const sql = 'INSERT INTO animals (numero, raca, data, sexo) VALUES (?, ?, ?, ?)';
    db.query(sql, [numero, raca, data, sexo], (err) => {
        if (err) {
            console.error('Erro ao inserir dados:', err.message);
            res.status(500).send('Erro ao cadastrar o animal.');
            return;
        }
        res.status(201).send('Animal cadastrado com sucesso!');
    });
});

// Rota para buscar animais com filtros
app.get('/api/animals', (req, res) => {
    const { numero, raca, data, sexo } = req.query;

    let sql = 'SELECT * FROM animals WHERE 1=1'; // Sempre verdadeiro para construir a query dinamicamente
    const params = [];

    if (numero) {
        sql += ' AND numero = ?';
        params.push(numero);
    }

    if (raca) {
        sql += ' AND raca LIKE ?';
        params.push(`%${raca}%`);
    }

    if (data) {
        sql += ' AND data = ?';
        params.push(data);
    }

    if (sexo) {
        sql += ' AND sexo = ?';
        params.push(sexo);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar os animais com filtros:', err.message);
            res.status(500).send('Erro ao buscar os animais.');
            return;
        }

        res.status(200).json(results);
    });
});

// Rota para excluir um animal pelo ID
app.delete('/api/animals/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM animals WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir o animal:', err.message);
            res.status(500).send('Erro ao excluir o animal.');
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send('Animal não encontrado.');
            return;
        }

        res.status(200).send('Animal excluído com sucesso!');
    });
});

// Rota para listar todos os animais
app.get('/api/animals', (req, res) => {
    const sql = 'SELECT * FROM animals';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados:', err.message);
            res.status(500).send('Erro ao buscar os animais.');
            return;
        }
        res.status(200).json(results);
    });
});


// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');})