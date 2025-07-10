import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { nanoid } from 'nanoid';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

const links = {};

app.post('/api/create', (req, res) => {
  const { url } = req.body;
  const id = nanoid(6);
  links[id] = { url, clicks: 0 };
  res.json({ short: `${req.protocol}://${req.get('host')}/go/${id}` });
});

app.get('/go/:id', (req, res) => {
  const link = links[req.params.id];
  if (link) {
    link.clicks++;
    res.send(`<script>
      if (confirm("Are you human?")) {
        window.location.href = "${link.url}";
      }
    </script>`);
  } else {
    res.status(404).send('Link não encontrado.');
  }
});

app.get('/api/stats', (req, res) => {
  res.json(links);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});
