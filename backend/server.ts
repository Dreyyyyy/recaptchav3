import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('OK');
});

app.post('/api/verify-recaptcha', async (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }
    const secretKey = process.env.SECRET_KEY;

    try {
        const params = new URLSearchParams({
            secret: secretKey || '',
            response: token,
        });
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });
        const data = await response.json();
        res.json({ success: data.success, ...data });
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});