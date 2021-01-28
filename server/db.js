var firebase = require('./firebaseConfig');

const firestore = firebase.firestore();
const usersRef = firestore.collection('users');
const shiftsRef = firestore.collection('shifts');

async function getAllMembers() {
    const snapshot = await usersRef.get();
    return snapshot.docs.map(doc => doc.data());
}

async function addShiftDocument(dataObj) {
    //TODO: Error handling
    // Add a new document with a generated id.
    await shiftsRef.add(dataObj);
}

module.exports = {
    getAllMembers: getAllMembers,
    addShiftDocument: addShiftDocument
}