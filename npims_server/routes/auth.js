const express = require('express');
const router = express.Router();

// Static list of users (replace with your real 50 pairs)
const users = [
  { username: 'npims_admin', password: 'npims_admin@2025', role: 'admin' },
  { username: 'mmingua', password: 'mmingua@01', role: 'user' },  
  { username: 'psmurillo', password: 'psmurillo@02', role: 'user' },
  { username: 'mraltiche', password: 'mraltiche@03', role: 'user' },
  { username: 'aocatelo', password: 'aocatelo@04', role: 'user'  },
  { username: 'aabueno', password: 'aabueno@05', role: 'user'  },
  { username: 'ildelossantos', password: 'ildelossantos@06', role: 'user' },  
  { username: 'mspanday', password: 'mspanday@07', role: 'user' },
  { username: 'cgbalmes', password: 'cgbalmes@08', role: 'user' },
  { username: 'ahconcibido', password: 'ahconcibido@09', role: 'user'  },
  { username: 'vpalcantara', password: 'vpalcantara@10', role: 'user'  },
  { username: 'esdaradar', password: 'esdaradar@11', role: 'user' },  
  { username: 'elsadrescalante', password: 'elsadrescalante@12', role: 'user' },
  { username: 'romacgelloani', password: 'romacgelloani@13', role: 'user' },
];

router.post('/', (req, res) => {
  console.log("Login route hit");
  console.log("Request body:", req.body);

  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    console.log("User not found or wrong password");
    return res.status(401).json({ message: 'Wrong username or password' });
  }

  console.log("User authenticated");
  return res.json({ 
    message: 'Login successful',
    username: user.username,
    role: user.role
  });
});



module.exports = router;