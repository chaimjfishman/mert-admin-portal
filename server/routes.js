var firebase = require('./firebaseConfig');
var db = require('./db.js');

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

async function getMembers(req, res) {

};

async function addShift(req, res) {

};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getMembers: getMembers,
  addShift: addShift,
}