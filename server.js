const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
    return res.status(200).send({
        msg: 'Hello'
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});