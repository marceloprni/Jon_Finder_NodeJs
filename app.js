let express = require('express');
const { engine  } = require('express-handlebars')
let app = express();
const path = require("path")
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3500;

app.listen(PORT, function () {
    console.log(`Aplicação está funcionando na porta ${PORT}`);
})

// body parser
app.use(bodyParser.urlencoded({ extended: false }))

// handle bars
//app.set("views", path.join(__dirname, "views"));
//app.engine("handlebars", engine({ defaultLayout: "main" }));
//app.set("view engine", "handlebars");
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static(path.join(__dirname, "public")));

// conexão do banco de dados
db.authenticate().then(() => {console.log('Conectou ao banco com sucesso!')}).catch(err => { console.log('Ocorreu um erro ao cnectar', err)});

app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%'

    if(!search) {
        Job.findAll({ order: [
        ['createdAt', 'DESC']
        ]}).then( jobs => {
            res.render('index', {
                jobs
            });
        }).catch( err => console.log(err));
    } else {
        Job.findAll({ 
            where: {title: {[Op.like]: query}},
            order: [
                ['createdAt', 'DESC']
            ]}).then( jobs => {
                res.render('index', {
                    jobs, search
                });
            }).catch( err => console.log(err));
    }

    
} )

// Job route
app.use('/jobs', require('./routes/jobs'))


