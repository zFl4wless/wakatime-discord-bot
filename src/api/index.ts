import express from 'express';
import axios from 'axios';
import qs from 'qs';

const app = express();

app.get('/redirect', async (req, res) => {
    const code = req.query.code;

    try {
        const response = await axios('https://wakatime.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: `${process.env.API_URL}/callback`,
                code,
                grant_type: 'authorization_code',
            }),
        });

        // TODO: Save the access token to the database

        res.send('Success! You can close this window now.');
    } catch (_error) {}
});

const port = process.env.API_PORT || 3000;
app.listen(port, () => {
    console.log('API is running on port ' + port);
});
