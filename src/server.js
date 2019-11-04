const app = require('./app');
const {PORT} = require('./config');
const uuid = require('uuid/v4');

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(uuid());
});