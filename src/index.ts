import 'dotenv/config';
import express from 'express';
import Utils from './utils';
import { URLSearchParams } from 'url';
import { Buffer } from 'buffer';

import { RequestInfo, RequestInit } from 'node-fetch';
const fetch = (url:RequestInfo, init?:RequestInit) => import('node-fetch').then(module => module.default(url, init));

const port = process.env.PORT || 3000;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = `http://localhost:${port}/callback`;

const app = express();
const state = Utils.generateString(16);
let accessToken = '';

app.get('/login', async(req, res) => {
    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
    const querystring = new URLSearchParams();
    querystring.append('client_id', client_id as string);
    querystring.append('redirect_uri', redirect_uri);
    querystring.append('scope', scope);
    querystring.append('state', state);
    querystring.append('response_type', 'code');

    res.redirect('https://accounts.spotify.com/authorize?' + querystring.toString());
});


app.get('/callback', async(req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
  
    if (state === null) {
      res.redirect('/#error=state_mismatch');
    } else {
        const querystring = new URLSearchParams();
        querystring.append('grant_type', 'authorization_code');
        querystring.append('redirect_uri', redirect_uri);
        querystring.append('code', code as string);

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: querystring,
            headers: {
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            }
        });

        const json = await result.json();

        accessToken = json.access_token;
      
        return res.send('successfully logged in');
    }
});

app.get('/next', async(req, res) => {
    const result = await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (result.status === 204) {
        return res.send('successfully skipped');
    };

    return res.send('failed to skip');
});

app.get('/previous', async(req, res) => {
    const result = await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (result.status === 204) {
        return res.send('successfully skipped');
    };

    return res.send('failed to skip');
});

app.get('/pause', async(req, res) => {
    const result = await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (result.status === 204) {
        return res.send('successfully paused');
    };

    const retry = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (retry.status === 204) {
        return res.send('successfully played');
    };

    return res.send('operation failed');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));