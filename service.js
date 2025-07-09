// index.js
const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const cors = require("cors");

// อ่านไฟล์ตัวอย่าง
const Prompt = fs.readFileSync('promptengine.txt', 'utf8');
app.use(express.json());
app.use(cors());

app.post('/api/generate/content', async (req, res) => {
  // รับข้อความจาก body
  const text  = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  try {
    const response = await axios.post(process.env.API, {
      model: process.env.Model || 'gpt-4', // ใช้โมเดลที่กำหนดใน environment variable หรือ gpt-4 เป็นค่าเริ่มต้น
      messages: [
        { role: 'system', content: Prompt },
        // { role: 'developer', content: 'You are a helpful assistant.' },
        { role: 'user', content: text.text || "" }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        // 'Cookie': '__cf_bm=yrjxGfrjVPZd8R3C8nCbVuOqEqTalcQyTzQJNonDkmU-1751986823-1.0.1.1-FX33VyqMgKXpF1O1ntBZOCnh6Jn1txuCcYlgkFA5jXl_uz0MfgtMFpve9W06lb0jJsgD9Krt1tDhmLWqz0AUtwvl0rQ4BQdiJu5fbG6ogMo; _cfuvid=WXhR1wnOp1BWaoLbWIVpO0bugcxPhJ9IJq4guI8xj9I-1751986823705-0.0.1.1-604800000'
      }
    });

    const content = response.data.choices[0].message.content;
    res.json({ content });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการติดต่อ GPT', detail: err.response?.data || err.message });
  }
});
app.listen(3000, () => console.log('Node.js API running on port 3000'));
