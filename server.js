const bodyParser = require('body-parser');
const express = require('express')
const path = require('path')
const config = require('config')
const mongoose = require('mongoose')
const app = express()

const port = process.env.PORT || config.get('port');


app.get('/', function(req, res){
    res.render('form');
});

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'build')))

    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/award', require('./routes/award.routes'))


// app.use(express.static(__dirname));

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(port, () => console.log(`App has been started on port ${port}...`))
    } catch (e) {
        console.log('ServerError', e.message)
        process.exit(1)
    }
}

start()