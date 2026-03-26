import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool, { initDb } from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Initialize DB on start
initDb();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware to log actions
const logAction = async (userId, action, details = {}) => {
  try {
    await pool.query(
      'INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)',
      [userId, action, JSON.stringify(details)]
    );
  } catch (err) {
    console.error('Failed to log action:', err);
  }
};

// --- AUTH API ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'patient']
    );

    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    await logAction(user.id, 'LOGIN', { email });
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- HEALTH DATA API ---
app.get('/api/health/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check access if caller is doctor
    if (req.user.role === 'doctor') {
      const [access] = await pool.query(
        'SELECT * FROM access_control WHERE patient_id = ? AND doctor_id = ? AND status = "granted"',
        [patientId, req.user.id]
      );
      if (access.length === 0) {
        return res.status(403).json({ error: 'Access denied to this patient data' });
      }
    }

    const [data] = await pool.query('SELECT * FROM health_data WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1', [patientId]);
    
    // Return mock data if empty
    if (data.length === 0) {
      return res.json({
        patient_id: patientId,
        vitals: { heartRate: 72, bloodPressure: '120/80', temperature: 98.6 },
        reports: [{ type: 'Blood Test', date: '2026-03-01', status: 'Normal' }],
        trends: { heartRate: [70, 72, 75, 71, 72] }
      });
    }

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- INSIGHTS API ---
app.post('/api/analyze', authenticateToken, async (req, res) => {
  try {
    const { patientId, dataToAnalyze } = req.body;
    
    // Mock AI Analysis
    const mockInsight = "Patient vitals show normal trends. Resting heart rate is stable. Recommended to maintain current diet and exercise routine.";
    
    await pool.query(
      'INSERT INTO insights (patient_id, content) VALUES (?, ?)',
      [patientId, mockInsight]
    );

    await logAction(req.user.id, 'GENERATE_INSIGHT', { patientId });

    res.json({ insight: mockInsight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/insights', authenticateToken, async (req, res) => {
  try {
    // If patient, fetch their own. If doctor, fetch for patients they have access to.
    let query = 'SELECT * FROM insights';
    let params = [];

    if (req.user.role === 'patient') {
      query += ' WHERE patient_id = ? ORDER BY created_at DESC';
      params.push(req.user.id);
    } else {
      query += ' WHERE patient_id IN (SELECT patient_id FROM access_control WHERE doctor_id = ? AND status = "granted") ORDER BY created_at DESC';
      params.push(req.user.id);
    }

    const [insights] = await pool.query(query, params);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ACCESS CONTROL API ---
app.post('/api/grant-access', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (req.user.role !== 'patient') return res.status(403).json({ error: 'Only patients can grant access' });

    await pool.query(
      'INSERT INTO access_control (patient_id, doctor_id, status) VALUES (?, ?, "granted") ON DUPLICATE KEY UPDATE status = "granted"',
      [req.user.id, doctorId]
    );

    await logAction(req.user.id, 'GRANT_ACCESS', { doctorId });
    res.json({ message: 'Access granted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/revoke-access', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (req.user.role !== 'patient') return res.status(403).json({ error: 'Only patients can revoke access' });

    await pool.query(
      'UPDATE access_control SET status = "revoked" WHERE patient_id = ? AND doctor_id = ?',
      [req.user.id, doctorId]
    );

    await logAction(req.user.id, 'REVOKE_ACCESS', { doctorId });
    res.json({ message: 'Access revoked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access-status', authenticateToken, async (req, res) => {
  try {
    let query = '';
    let params = [];

    if (req.user.role === 'patient') {
      query = 'SELECT a.*, u.name as doctor_name FROM access_control a JOIN users u ON a.doctor_id = u.id WHERE a.patient_id = ? AND a.status = "granted"';
      params.push(req.user.id);
    } else {
      query = 'SELECT a.*, u.name as patient_name FROM access_control a JOIN users u ON a.patient_id = u.id WHERE a.doctor_id = ? AND a.status = "granted"';
      params.push(req.user.id);
    }

    const [accessList] = await pool.query(query, params);
    res.json(accessList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- LOGS API ---
app.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const [logs] = await pool.query('SELECT * FROM logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50', [req.user.id]);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logs', authenticateToken, async (req, res) => {
  try {
    const { action, details } = req.body;
    await logAction(req.user.id, action, details);
    res.status(201).json({ message: 'Log created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
