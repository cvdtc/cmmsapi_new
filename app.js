const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./utils/router.js');
const path = require('path')
const docAuth = require('express-basic-auth');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const fs = require('fs');
const http = require('http');
const https = require('https')

//uncomment this line below if api runned in local server
// const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// };


//variable for devlopment port without ssl
var httpdev = http.createServer(app);
//variable for deployment port with ssl
//uncomment this line below if api runned in local server
// var httpserverwithssl = https.createServer(options, app);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
//allow access images directory from url for express web
app.use('/images', express.static(path.join(__dirname, '/images')));
//base url of api
app.use('/api', router);
//ALLOW EJS
app.set('view engine', 'ejs')
app.use('/views', express.static(path.join(__dirname, '/views')));app.get('/', function(req, res){
    res.render('index', {
        judul: 'SYAHRUL',
        isi: 'testing'
    })
})
//Add Swagger documentation
const swaggerOption = {
    //definition of swagger header documentation
    definition: {
        openapi: "3.0.3",
        info:{
            title: "Home Of Api Horang",
            version: "1.0.0",
            description: "This is a documentation of API HORANG, you can access this api with new url  `baseurl/api/{url you want}` dont forget everything needed access token with jwt format. this API using 2 port `9992` port without ssl and `9993` port within ssl, you can use `9992 for development` and `9993 for deployment`.",
            contact:{
                email: "info.cvdtc@gmail.com",
                url: "horang.id"
            }
        },
        //API url
        servers: [
            {
                url: process.env.DB_HOST,
                description: "Database server running server"
            },
            {
                url: "http://dev.horang.id:9992/api",
                description: "Server for development without ssl"
            },
            {
                url: "http://dev.horang.id:9993/api",
                description: "Server for development within ssl"
            },
            {
                url: "http://server.horang.id:9992/api",
                description: "Server for deployment without ssl"
            },
            {
                url: "http://server.horang.id:9993/api",
                description: "Server for deployment without ssl"
            }
        ],
    },
    //allow access swagger in controller directory
    apis: ["./controller/*.js"]
}
const specs = swaggerJsDoc(swaggerOption);
//base url of swagger documentation
app.use('/secret-docs-api', docAuth({
    //add user and password for access this api
    users: {
        'admindoc': 'hanyaadminyangtau'
    },
    challenge: true
}), swaggerUi.serve, swaggerUi.setup(specs));
//Setup Port api without ssl
httpdev.listen(process.env.APP_PORT, () => console.log(process.env.TYPE_OF_DEPLOYMENT+" Berjalan di PORT "+process.env.APP_PORT+" VERSION : "+process.env.API_VERSION));
//Setup port api within ssl
//uncomment this line below if api runned in local server
// httpserverwithssl.listen(process.env.HTTPS_APP_PORT, () => console.log(process.env.TYPE_OF_DEPLOYMENT+" Berjalan di PORT "+process.env.APP_PORT+" VERSION : "+process.env.API_VERSION));