const express = require('express'); // Express Cofiguration
const mongoose = require('mongoose'); //MongoDB Configuration
const Note = require('./models/notes') // Models import
const cookieSession = require('cookie-session'); //Cookie session libray
const md = require('marked'); //Markdown import

const app = express();

mongoose.connect('mongodb://localhost:27017/notes', {useNewUrlParser: true});

app.set('view engine', 'pug'); // Pug configuration
app.set('views', 'views'); //Pug configuration
app.use(express.urlencoded({extended: true})); //Middleware for translation of body to js
app.use(cookieSession({
    secret: 'a_secret_string',
    maxAge: 24*60*60*1000
})); //Cookie session configuration
app.use('/assets', express.static('assets')); // Public services, static files

//Show the list of notes
app.get('/', async (req, res) => {

    const notes = await Note.find();
    res.render('index', {notes}); // Render of index.js
});

// New form to do a note
app.get('/notes/new', async (req, res) => {
    const notes = await Note.find();
    res.render('new', {notes});    
});

// To create a note
app.post("/notes", async (req, res, next) => {
    const data = {
        title: req.body.title,
        body: req.body.body,
    };

    try {
        const note = new Note(data);
        await note.save();
    }catch (err) {
        return next(err)
    }
    
    res.redirect('/');
});

//To show a note
app.get('/notes/:id', async (req, res) => {
    const notes = await Note.find();
    const note = await Note.findById(req.params.id);
    res.render('show', {notes: notes, currentNote: note, md: md});
});

//To show the form to edit
app.get('/notes/:id/edit', async (req, res, next) => {
    try {
        const notes = await Note.find();
        const note = await Note.findById(req.params.id);

        res.render('edit', {notes:notes, currentNote: note});
    } catch (error) {
        return next(error);
    }
});

//To update a note
app.patch('/notes/:id', async (req, res, next) => {
    const id = req.params.id;
    const note = await Note.findById(id);

    note.title = req.body.title;
    note.body = req.body.body;

    try {
        await note.save({});
        res.status(204).send({});
    } catch (error) {
        return next(error);
    }
});

//To delete a note
app.delete('/notes/:id', async (req, res, next) => {
    try {
        await Note.deleteOne({_id: req.params.id});
        res.status(204).send({});
    } catch (error) {
        return next(error);
    }
});


//Error middleware
app.use((err, req, res, next) => {
    console.log(err.stack); //backend message
    res.status(500).send(`<h1>Something went wrong</h1><p>${err.message}</p>`); //frontend message
});

app.listen(3000, () => console.log('listening on port 3000'));

