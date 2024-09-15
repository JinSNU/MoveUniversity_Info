require('dotenv').config();  // 환경 변수 로드
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 정적 파일 제공
app.use(express.static('public'));

// Body parser 미들웨어 추가
app.use(bodyParser.json());

// 기사 정보를 가져오는 API 엔드포인트
app.get('/api/vehicles', async (req, res) => {
  const { data, error } = await supabase.from('vehicles').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// 새로운 기사 정보 등록 API 엔드포인트
app.post('/api/vehicles', async (req, res) => {
  const newVehicle = req.body;
  const { data, error } = await supabase.from('vehicles').insert([newVehicle]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// 기존 기사 정보 수정 API 엔드포인트
app.put('/api/vehicles/:id', async (req, res) => {
  const id = req.params.id;
  const updatedVehicle = req.body;

  const { data, error } = await supabase.from('vehicles').update(updatedVehicle).eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// 기사 정보 삭제 API 엔드포인트
app.delete('/api/vehicles/:id', async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase.from('vehicles').delete().eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
