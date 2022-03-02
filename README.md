# shelly-spotify-remote
This app should enable you, to use a shelly button as remote control for musicplayback on spotify.
Always uses the active device, main functions: Play, Pause, Next, Previous

## Todo's
- <input type="checkbox" disabled /> add OOP
- <input type="checkbox" disabled /> add automatically refresh for refresh_token
- <input type="checkbox" disabled /> design
- <input type="checkbox" disabled /> testing
- <input type="checkbox" disabled /> updated to node-fetch v3 (ESM)


## Install & requirements
### Serverside
1. Create an application on Spotify (https://developer.spotify.com/)
2. Rename .env.example to .env
3. Copy your CLIENT_ID & CLIENT_SECRET and paste it to the .env file
4. Run `yarn`
5. Run `yarn run start:dev` for developing, out of the box with nodemon
6. Build `yarn run build`
7. Deploy 

### ShellyClient
1. Open your shelly config page to configure your button
2. 1x short pressed - Pause/Play - http://host:8888/pause
3. 2x short pressed - Next track - http://host:8888/next
4. 3x short pressed - Previous track - http://host:8888/previous


Have fun with your shelly button ;)
Shelly Button could be find on amazon: [Black](https://amzn.to/35hn0GE) | [White](https://amzn.to/3hzsL4I)
