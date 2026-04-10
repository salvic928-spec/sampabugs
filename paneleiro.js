const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1492222385124802651/3ru1SOHc4KfLg56a4rIviQbv0m32kujjidBn6RSvfPqR84MT8BYK2KaAOXJR74jUmb5e';

app.post('/reportar-bug', async (req, res) => {
    const { jogador, categoria, descricao } = req.body;

    if (!jogador || !categoria || !descricao) {
        return res.status(400).send({ error: "Campos obrigatórios ausentes" });
    }

    const embed = {
        username: "Central de Bugs | SAMPA ROLEPLAY",
        embeds: [{
            title: "Novo Reporte de Bug",
            color: 16711680,
            fields: [
                { name: "Jogador", value: jogador, inline: true },
                { name: "Categoria", value: categoria, inline: true },
                { name: "Descrição", value: descricao },
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });

        if (response.ok) {
            res.status(200).send({ message: "Enviado" });
        } else {
            const errData = await response.text();
            res.status(response.status).send({ error: "Erro no Discord", detail: errData });
        }
    } catch (error) {
        res.status(500).send({ error: "Falha na conexão com o Webhook" });
    }
});

app.get('/calculator', (req, res) => {
    res.sendFile(path.join(__dirname, 'calculator.html'));
});

app.use((req, res) => {
    res.status(404).send("Rota não encontrada");
});

app.listen(PORT, () => console.log(`🚀 Sampa RP: Servidor rodando em http://localhost:${PORT}`));
