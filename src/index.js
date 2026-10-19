
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// ตรวจสอบว่า API ทำงานหรือไม่
app.get('/api', (req, res) => {
  res.json({
    message: 'Internship Log API is running',
    project: 'ระบบบันทึกการฝึกงาน'
  });
});

// แสดงรายการบันทึกการฝึกงาน
app.get('/api/internships', (req, res) => {
  res.json({
    message: 'รายการบันทึกการฝึกงาน',
    data: []
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


