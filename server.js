const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CI/CD Pipeline Demo</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #0f0f0f; color: white; }
        h1 { color: #00d4ff; font-size: 3em; }
        .box { background: #1a1a2e; padding: 30px; border-radius: 15px; margin: 20px auto; max-width: 600px; }
        .badge { display: inline-block; background: #00d4ff; color: black; 
                 padding: 5px 15px; border-radius: 20px; margin: 5px; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>🚀 CI/CD Pipeline Demo</h1>
      <div class="box">
        <h2>Pipeline Stack</h2>
        <span class="badge">Docker</span>
        <span class="badge">Jenkins</span>
        <span class="badge">Azure</span>
        <span class="badge">Vercel</span>
        <span class="badge">SonarQube</span>
        <p>Build: SUCCESS ✅ | Deployed via Jenkins CI/CD</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});