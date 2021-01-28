var firebase = require('./firebaseConfig');
var db = require('./db.js');

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

async function getMembers(req, res) {
  var members = await db.getAllMembers();
  res.json(members)
};

async function addShift(req, res) {
  console.log('addShift called')
  var userId = req.params.userid;
  var startTime = new Date(req.params.start);
  var endTime = new Date(req.params.end);
  var shiftType = req.params.type;

  let shift = {
    userId: userId,
    startTime: startTime,
    endTime: endTime,
    shiftType: shiftType
  }
  // //TODO: add error handling
  await db.addShiftDocument(shift);
  
  console.log(shift)
  res.sendStatus(200)
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getMembers: getMembers,
  addShift: addShift,
}