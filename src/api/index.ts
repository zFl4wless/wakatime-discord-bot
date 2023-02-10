import express from 'express';
import axios from 'axios';
import qs from 'qs';
import { encrypt, formatNonceAndChipertext } from '../utils/crypto';
import { keys } from '..';
import { isUser, saveUser } from '../db/user/user';

export const userStates = new Map<string, string>();

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
                redirect_uri: `${process.env.API_URL}/redirect`,
                grant_type: 'authorization_code',
                code,
            }),
        });

        const userId = userStates.get(req.query.state.toString());
        if (!userId) {
            res.send('Error: Invalid state - Try requesting a new authentication link.');
            return;
        }

        const userExists = await isUser(userId);
        if (userExists) {
            res.send('You are already authenticated.');
            return;
        }

        const { access_token, refresh_token } = qs.parse(response.data);
        const { nonce: accessTokenNonce, chipertext: accessTokenChipertext } = encrypt(access_token.toString(), keys);
        const { nonce: refreshTokenNonce, chipertext: refreshTokenChipertext } = encrypt(
            refresh_token.toString(),
            keys,
        );

        await saveUser(
            userId,
            formatNonceAndChipertext(accessTokenNonce, accessTokenChipertext),
            formatNonceAndChipertext(refreshTokenNonce, refreshTokenChipertext),
        );

        res.send('Success! You can close this window now.');
    } catch (error) {
        const errorData = qs.parse(error.response.data);
        res.send(`Error: ${errorData.error} - ${errorData.error_description}`);
    }
});

const port = process.env.API_PORT || 3000;
app.listen(port, () => {
    console.log('API is running on port ' + port);
});
