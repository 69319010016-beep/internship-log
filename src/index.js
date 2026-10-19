
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// ข้อมูลสมาชิกตามใบงานข้อ 2.3
const members = [
  {
    id: 1,
    name: 'ธีรภัทร ช่วงชาวนา',
    role: 'Project Leader / Developer A'
  }
];

// ข้อมูลโครงงาน
const project = {
  team: 'ทีม Internship Log',
  topic: 'ระบบบันทึกการฝึกงาน',
  problem: 'การบันทึกและติดตามความคืบหน้าการฝึกงานยังไม่เป็นระบบ',
  users: ['นักศึกษา', 'ครูที่ปรึกษา', 'สถานประกอบการ'],
  members
};

// ข้อมูลฝึกงานตั้งต้น เก็บในหน่วยความจำ
let internships = [
  {
    id: 1,
    studentName: 'ธีรภัทร ช่วงชาวนา',
    company: 'บริษัทตัวอย่าง',
    workDate: '2026-10-19',
    details: 'ศึกษาระบบ Back-End และการพัฒนา API',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    studentName: 'นักศึกษาตัวอย่าง',
    company: 'บริษัทเทคโนโลยี',
    workDate: '2026-10-18',
    details: 'ฝึกพัฒนาเว็บไซต์และทดสอบระบบ',
    status: 'done',
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// API ทักทายตามใบงาน
app.get('/hello', (req, res) => {
  res.json({ message: 'สวัสดี Back-End!' });
});

// API ข้อมูลโครงงานตามใบงาน
app.get('/project', (req, res) => {
  res.json(project);
});

// ตรวจสอบ API
app.get('/api', (req, res) => {
  res.json({
    message: 'Internship Log API is running',
    project: project.topic
  });
});

// R: ดูบันทึกฝึกงานทั้งหมด รองรับ ?status=pending
app.get('/api/internships', (req, res) => {
  const { status } = req.query;

  if (status) {
    const allowed = ['pending', 'doing', 'done'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: 'status ต้องเป็น pending, doing หรือ done'
      });
    }

    return res.json(internships.filter(item => item.status === status));
  }

  res.json({
    total: internships.length,
    data: internships
  });
});

// R: ดูบันทึกฝึกงาน 1 รายการ
app.get('/api/internships/:id', (req, res) => {
  const id = Number(req.params.id);
  const internship = internships.find(item => item.id === id);

  if (!internship) {
    return res.status(404).json({
      message: 'ไม่พบข้อมูลฝึกงาน'
    });
  }

  res.json(internship);
});

// C: เพิ่มบันทึกฝึกงาน
app.post('/api/internships', (req, res) => {
  const { studentName, company, workDate, details } = req.body;

  if (!studentName || !company || !workDate || !details) {
    return res.status(400).json({
      message: 'กรุณากรอก studentName, company, workDate และ details ให้ครบ'
    });
  }

  const internship = {
    id: nextId++,
    studentName,
    company,
    workDate,
    details,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  internships.push(internship);

  res.status(201).json({
    message: 'บันทึกข้อมูลฝึกงานสำเร็จ',
    data: internship
  });
});

// U: แก้ไขข้อมูลฝึกงาน
app.put('/api/internships/:id', (req, res) => {
  const id = Number(req.params.id);
  const internship = internships.find(item => item.id === id);

  if (!internship) {
    return res.status(404).json({
      message: 'ไม่พบข้อมูลฝึกงาน'
    });
  }

  const { studentName, company, workDate, details, status } = req.body;
  const allowed = ['pending', 'doing', 'done'];

  if (status && !allowed.includes(status)) {
    return res.status(400).json({
      message: 'status ต้องเป็น pending, doing หรือ done'
    });
  }

  if (studentName !== undefined) internship.studentName = studentName;
  if (company !== undefined) internship.company = company;
  if (workDate !== undefined) internship.workDate = workDate;
  if (details !== undefined) internship.details = details;
  if (status !== undefined) internship.status = status;

  res.json({
    message: 'แก้ไขข้อมูลฝึกงานสำเร็จ',
    data: internship
  });
});

// D: ลบบันทึกฝึกงาน
app.delete('/api/internships/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = internships.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: 'ไม่พบข้อมูลฝึกงาน'
    });
  }

  internships.splice(index, 1);
  res.status(204).send();
});

// ไม่ตรงกับ route ใดเลย
app.use((req, res) => {
  res.status(404).json({
    message: `ไม่มี ${req.method} ${req.path} ในระบบ`
  });
});

// เปิดเซิร์ฟเวอร์
app.listen(PORT, (err) => {
  if (err) {
    return console.log('เปิดเซิร์ฟเวอร์ไม่ได้:', err.message);
  }

  console.log(`Server running at http://localhost:${PORT}`);
});
