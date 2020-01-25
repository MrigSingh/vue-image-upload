const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const cors = require('cors');
const storage = require('./upload-config')
const upload = multer(storage);
const fs = require('fs');

const app = express();
app.use(express.static('uploads'))
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

//ROUTES
app.post('/upload', upload.array('files'), async (req, res, next) => {
    res.json({ file : req.files });
});

app.delete('/delete/:file',(req, res) => {
    fs.unlinkSync(`./uploads/${req.params.file}`);
})

app.get('/uploads', (req, res, next) => {
    next();
});

app.use('/uploads', (req, res) => {
    fs.readdir('./uploads', function(err, items) {
        res.json({file: items});
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));