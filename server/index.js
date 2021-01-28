const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */


app.get('/members', routes.getMembers);

app.get('/addshift/:userid/:start/:end/:type', routes.addShift);

app.get('/notifications', routes.sendNotifications);

app.get('/notifications/:token/:message', routes.sendNotifications);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});