const fs = require('fs').promises
const path = require('path')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

const TOKEN_PATH = path.resolve('.secrets/token.json')
const CREDENTIALS_PATH = path.resolve('.secrets/credentials.json')

const authorize = async () => {
    try {
        return google.auth.fromJSON(JSON.parse(await fs.readFile(TOKEN_PATH)))
    } catch (err) {
        client = await authenticate({
            scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
            keyfilePath: CREDENTIALS_PATH,
        })
        if (client.credentials) {
            const keys = JSON.parse(await fs.readFile(CREDENTIALS_PATH))
            const key = keys.installed || keys.web
            await fs.writeFile(TOKEN_PATH, JSON.stringify({
                type: 'authorized_user',
                client_id: key.client_id,
                client_secret: key.client_secret,
                refresh_token: client.credentials.refresh_token,
            }))
        }
        return client
    }
}

module.exports = { authorize }