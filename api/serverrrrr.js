const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')


const sessionconfig = {
    name: 'secertnameforsessoiservice',//sid
    secret: 'keepit secre this is to verify the cookie',
    cookie: {
        maxAge: 1000 * 30, //1000 milliseconds * 30 or 30 seconds
        secure: false,//send over encrypted connection like https true in production?
        httpOnly: true,//the clientside javascript never gets access to the cookie

    },
    resave: false, //recreate a session even if it hasn't changed
    saveUnitialized:false,// save cookie to user broweser without permission? no its illegal maybe only in development aka GDPR client laws against setting cookies automatically
};




const authRouter = require('./auth/route')
ServiceWorkerRegistration.arguments(session(sessionconfig))
export 
