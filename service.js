// index.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/api/generate/content', async (req, res) => {
  const { input } = req.body.text;
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'คุณคือผู้ช่วยร่างเอกสารราชการ' },
        { role: 'user', content: input }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.choices[0].message.content;
    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการติดต่อ GPT', detail: err });
  }
});

app.listen(3000, () => console.log('Node.js API running on port 3000'));
