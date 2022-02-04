const db = require('../database');
const { generateToken, verifyUserFromToken } = require('../security/token-utils');
const Crypto = require('crypto-js');

exports.createRouters = (app) => {

    app.post('/account/create', async (req, res) => {

        try {

            const erros = validateUser(req.body);
            if (Object.keys(erros).length > 0) {
                res.status(422).send(erros);
                return;
            }

            const knex = db.getKnex();
            const config = {
                general: {
                    sound_notify: true,
                    confirm_exclusion: false,
                    task_important_top: true,
                    new_task_top: false
                },
                user_theme: {
                    theme: 'auto',
                    accent_color: '5, 100, 240',
                    modal_opacity: '0.7',
                }
            };
            const user = {
                email: req.body.email,
                name: req.body.name,
                password: Crypto.SHA256(req.body.password).toString(),
                config: config
            };

            const result = await knex.raw('SELECT email FROM users WHERE email = ?', [user.email]);
            if (result.rows.length !== 0) {

                res.status(422).send({message: 'Existing email'});

                return;
            }

            await knex.raw('INSERT INTO users (name, email, password, config) VALUES (?, ?, ?, ?)',
            [user.name ,user.email, user.password, JSON.stringify(user.config)]);

            res.send({});
        }
        catch(error) {

            console.error(error);

            res.status(422).send({message: 'Falha ao criar conta'});
        }
    });

    app.post('/account/login', async (req, res) => {

        try {

            const knex = db.getKnex();
            const user = {
                email: req.body.email,
                password: Crypto.SHA256(req.body.password).toString()
            };

            const result = await knex.raw('SELECT id FROM users WHERE ? = email and ? = password',
            [user.email.toLowerCase(), user.password]);

            if (result.rows.length === 0) {

                res.status(422).send({message: 'E-mail ou senha inválido'});
                return;
            }

            const token = generateToken(result.rows[0].id);

            res.send({token});
        }
        catch (error) {

            console.error(error);

            res.status(422).send({message: 'Failed to perform operation'});
        }
    });

    app.get('/account/me', async (req, res) => {

        try {
            const knex = db.getKnex();

            const userData = verifyUserFromToken(req, res);
            if(!userData) return;

            const result = await knex.raw('SELECT id, name, email, config FROM users WHERE id = ?', [ userData.userId ]);

            res.send(result.rows[0]);
        }
        catch(error) {

            console.error(error);

            res.status(422).send({message: 'Houve um error'});
        }
    });

    app.put('/account/config', async (req, res) => {

        const userData = verifyUserFromToken(req, res);
        if(!userData) return;

        let config = req.body;
        if (!config) {
            res.status(422).send({message: 'Informe os dados'});
            return;
        };

        let result;
        try {
            const knex = db.getKnex();
            result = await knex.raw('SELECT config FROM users WHERE id = ?', [ userData.userId ]);

            let userConfig = JSON.parse(result.rows[0].config);
            const newConfig = {
                ...userConfig,
                ...config
            };
            await knex.raw('UPDATE users SET config = ? WHERE id = ?', [ JSON.stringify(newConfig), userData.userId ]);
            res.send();
        }
        catch(error) {
            console.error(error);
            res.status(422).send({message: 'Houve um erro'});
        }
    });

    const validateUser = (user) => {

        const erros = {};

        if (!user) {

            erros.message = 'Informe os dados';

            return erros;
        }

        if (!user.name) {

            erros.name = 'Nome obrigatório';
        }
        else if (user.name.length > 50) {

            erros.name = 'Nome deve conter no máximo 50 caracters';
        }

        if (!user.email) {

            erros.email = 'E-mail obrigatório';
        }
        else if (user.email.length > 50) {

            erros.email = 'E-mail deve conter no máximo 50 caracters';
        }

        if (!user.password) {

            erros.password = 'Senha obrigatório';
        }
        else if (user.password.length > 30) {

            erros.password = 'Senha deve conter no máximo 30 caracters';
        }
        else if (user.password.length < 6) {

            erros.password = 'Senha deve conter no minimo 6 caracters';
        }

        return erros;
    };
};