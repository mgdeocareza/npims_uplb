const express = require('express');
const router = express.Router();

// Static list of users (replace with your real 50 pairs)
const users = [
  { username: 'admin1', password: 'admin2025!', role: 'admin' },
  { username: 'admin2', password: 'admin2025!', role: 'admin' },  
  { username: 'user1', password: 'pass1', role: 'user' },
  { username: 'user2', password: 'pass2', role: 'user' },
  { username: 'user3', password: 'pass3', role: 'user'  },
  { username: 'user4', password: 'pass4', role: 'user'  },
  { username: 'user5', password: 'pass5', role: 'user'  },
  { username: 'user6', password: 'pass6', role: 'user'  },
  { username: 'user7', password: 'pass7', role: 'user'  },
  { username: 'user8', password: 'pass8', role: 'user'  },
  { username: 'user9', password: 'pass9', role: 'user'  },
  { username: 'user10', password: 'pass10', role: 'user'  },
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