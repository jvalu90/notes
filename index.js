const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello World, my name is Jimmy Valencia Urbano</h1>');
})

app.listen(3000, () => console.log('listening on port 3000'));