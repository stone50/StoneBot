require('dotenv').config()
const app = require('express')()
const { google } = require('googleapis')
const { authorize } = require('./authorize')

let server = null

const start = async () => {
    server = app.listen(process.env.SERVER_PORT)

    let auth = await authorize()

    const result = await google.youtube('v3').channels.list({
        auth: auth,
        part: 'snippet',
        mine: true
    })

    console.log(result)
}

const onServerError = async err => {
    console.log(err)
    if (server) {
        server.close()
    }
}

start().catch(onServerError)