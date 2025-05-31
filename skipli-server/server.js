// 
const express = require('express');
const app = express();
const cors = require('cors');
const { db } = require('./firebase/firebase'); 
app.use(express.json());
require('dotenv').config();
const axios = require('axios');
const { sendSMS } = require('./twilioService'); 


const corsOptions = { 
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204 
};
app.use(cors(corsOptions));


app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from Skipli Server!'
  });
});
app.use(express.json());

function formatPhoneNumber(phoneNumber) {
  if (phoneNumber.startsWith('0')) {
    return '+84' + phoneNumber.slice(1);
  }

  
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }

  
  return phoneNumber;
}


// app.get('/test-firebase', async (req, res) => {
//   try {
//     const docRef = db.collection("test").doc("demo");
//     await docRef.set({ createdAt: new Date().toISOString() });
//     res.send({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false });
//   }
// });

// POST /CreateNewAccessCode
app.post('/CreateNewAccessCode', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'phoneNumber is required' });
    }

    const userRef = db.collection('users').doc(phoneNumber);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData.accessCode) {
        return res.status(400).json({ error: 'Access code already generated. Please verify first.' });
      }
    }

    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    await userRef.set({
      phoneNumber,
      accessCode,
      createdAt: new Date().toISOString()
    });

    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    await sendSMS(formattedPhone, `Your OTP code is: ${accessCode}`)

    res.json({ 
      success: true,
      accessCode: accessCode,
      phoneNumber: formattedPhone,
      message: 'Access code sent successfully' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.post('/ValidateAccessCode', async (req, res) => {
  try {
    const { phoneNumber, accessCode } = req.body;

    if (!phoneNumber || !accessCode) {
      return res.status(400).json({ error: 'Missing phoneNumber or accessCode' });
    }

   
    const userRef = db.collection('users').doc(phoneNumber);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    if (userData.accessCode !== accessCode) {
      return res.status(401).json({ error: 'Invalid access code' });
    }

    await userRef.update({ accessCode: "" });
    return res.json({ success: true, message: 'Access code validated successfully' });

  } catch (err) {
    console.error('Error validating code:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/searchGithubUsers', async (req, res) => {
  const { q, page = 1, per_page = 10, phone_number } = req.query;

  if (!q || !phone_number) {
    return res.status(400).json({ error: 'Missing query or phone_number' });
  }

  try {
    
    const githubRes = await axios.get('https://api.github.com/search/users', {
      params: { q, per_page, page },
      headers: {
        'User-Agent': 'SkipliApp',
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    const githubUsers = githubRes.data.items;

    
    const snapshot = await db
      .collection('favorite_github_users')
      .where('phoneNumber', '==', phone_number)
      .get();

    const likedIds = [];
    snapshot.forEach(doc => {
      likedIds.push(doc.data().githubUserId);
    });

    
    const users = githubUsers.map(u => ({
      id: u.id,
      login: u.login,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
      followers_url: u.followers_url,
      repos_url: u.repos_url,
      isLike: likedIds.includes(Number(u.id)),
    }));

    res.json(users);
  } catch (err) {
    console.error('GitHub error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/findGithubUserProfile', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing search query (q)' });
  }

  try {
    const githubRes = await axios.get(`https://api.github.com/users/${q}`, {
      headers: {
        'User-Agent': 'SkipliApp',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      }
    });

    const u = githubRes.data;

    const userProfile = {
      id: u.id,
      login: u.login,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
      followers_url: u.followers_url,
      repos_url: u.repos_url,
    };

    res.json(userProfile);
  } catch (err) {
    console.error('GitHub error:', err.response?.data || err.message);
    res.status(500).json({ error: 'GitHub API failed' });
  }
});

app.post('/likeGithubUser', async (req, res) => {
  const { phoneNumber, githubUserId } = req.body;

  if (!phoneNumber || !githubUserId) {
    return res.status(400).json({ error: 'Missing phoneNumber or githubUserId' });
  }

  const userRef = db.collection('users').doc(phoneNumber);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return res.status(404).json({ error: 'User not found' });
  }

  const likeRef = db.collection('favorite_github_users').doc(`${phoneNumber}_${githubUserId}`);
  const likeDoc = await likeRef.get();

  if (likeDoc.exists) {
    await likeRef.delete();
    return res.json({ success: true, message: 'User unliked successfully' });
  } else {
    
    await likeRef.set({
      phoneNumber,
      githubUserId,
      createdAt: new Date().toISOString()
    });
    return res.json({ success: true, message: 'User liked successfully' });
  }
});

app.get('/getUserProfile', async (req, res) => {
  const phoneNumber = req.query.phone_number;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Missing phone_number' });
  }

  try {
    
    const snapshot = await db.collection('favorite_github_users')
      .where('phoneNumber', '==', phoneNumber)
      .get();

    if (snapshot.empty) {
      return res.json({ favorite_github_users: [] });
    }

    const githubUserIds = snapshot.docs.map(doc => doc.data().githubUserId);

    
    const githubUsers = await Promise.all(
      githubUserIds.map(async (id) => {
        try {
          const res = await axios.get(`https://api.github.com/user/${id}`, {
            headers: {
              'User-Agent': 'SkipliApp',
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
            }
          });
          return {
            id: res.data.id,
            login: res.data.login,
            avatar_url: res.data.avatar_url,
            html_url: res.data.html_url,
            followers_url: res.data.followers_url,
            repos_url: res.data.repos_url,
          };
        } catch (err) {
          console.error(`Failed to fetch GitHub user ${id}:`, err.message);
          return null;
        }
      })
    );

    const filteredUsers = githubUsers.filter(u => u !== null);
    res.json({ 
      phoneNumber,
      favorite_github_users: filteredUsers 
    });

  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(8080, () => {
  console.log('Skipli Server is running on http://localhost:8080');
  debugger;
});