// index.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/api/generate/content', async (req, res) => {
  // console.log("text:>", req.body.text);
  
  const text = JSON.parse(req.body);
  console.log("text:>", text.text);
  
  try {
    const response = await axios.post('https://ai.jkomala.com/v1/chat/completions', {
      model: 'openthaigpt/openthaigpt-r1-32b',
      messages: [
        { role: 'system', content: 'คุณคือผู้ช่วยร่างเอกสารราชการ' },
        { role: 'user', content: text.text || "" }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("response:>", response);
    
    const content = response.choices[0].message.content;
    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการติดต่อ GPT', detail: err });
  }
});

app.listen(3000, () => console.log('Node.js API running on port 3000'));
