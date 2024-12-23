const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Route to keep the server alive
app.get('/', (req, res) => {
    res.send('Bot is alive!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Keep-alive server running on port ${PORT}`);
});
