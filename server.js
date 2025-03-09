require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Define Schema & Model for First Google Form (Name, Email, Score)
const responseSchema = new mongoose.Schema({
    name: String,
    email: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});
const Response = mongoose.model('Response', responseSchema);

// Define Schema & Model for Personality Google Form (Now Includes Name & Email)
const personalitySchema = new mongoose.Schema({
    name: String,
    email: String,
    extraversion: String,
    agreeableness: String,
    emotionalStability: String,
    conscientiousness: String,
    timestamp: { type: Date, default: Date.now }
});
const PersonalityResponse = mongoose.model('PersonalityResponse', personalitySchema);

// ✅ Default Route (For Debugging)
app.get('/', (req, res) => {
    res.send("API is running...");
});

// ✅ API Endpoint to Store Google Form Responses
app.post('/submit', async (req, res) => {
    try {
        if ('name' in req.body && 'email' in req.body && 'score' in req.body) {
            // Handling First Form (Name, Email, Score)
            const { name, email, score } = req.body;
            const newResponse = new Response({ name, email, score });
            await newResponse.save();
            return res.status(201).json({ message: 'Response saved successfully for Form 1!' });
        } 
        else if ('name' in req.body && 'email' in req.body && 'extraversion' in req.body && 'agreeableness' in req.body) {
            // Handling Personality Form (Now Includes Name & Email)
            const { name, email, extraversion, agreeableness, emotionalStability, conscientiousness } = req.body;
            const newResponse = new PersonalityResponse({ name, email, extraversion, agreeableness, emotionalStability, conscientiousness });
            await newResponse.save();
            return res.status(201).json({ message: 'Personality response saved successfully!' });
        } 
        else {
            return res.status(400).json({ error: 'Invalid request format' });
        }
    } catch (error) {
        console.error("Error saving response:", error);
        res.status(500).json({ error: 'Error saving response' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
