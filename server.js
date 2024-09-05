const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');  
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/RegisterForm')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        
        const newUser = new User({ username, email, password });
        await newUser.save();
        
        res.send('User registered successfully!');
    } catch (err) {
        res.status(500).send('Error registering user: ' + err);
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
