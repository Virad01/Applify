// const express = require('express');
// const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccount.json');
// const csv = require('csv-parser');
// const fs = require('fs');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const ejs = require('ejs');
// const app = express();
// const cors = require("cors")

// app.use(cors({
//   origin: "*",
// }))


// // Initialize the Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();


// const port = 4000;

// app.post('/upload', upload.single('csv'), (req, res) => {
//   const { collectionName } = req.body;

//   if (!collectionName) {
//     return res.status(400).send('Collection name is required');
//   }

//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const filePath = req.file.path;

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       db.collection(collectionName).add(row)
//         .then(() => console.log('Document added successfully'))
//         .catch((error) => console.error('Error adding document:', error));
//     })
//     .on('end', () => {
//       console.log('CSV file uploaded successfully');
//       fs.unlinkSync(filePath); // Delete the temporary uploaded file
//       res.send('CSV file uploaded successfully');
//     });
// });

// // Serve the HTML file for the root route
// app.get('/', (req, res) => {
//   res.render('index', { collectionName: '', csvFile: '' }); // Render the EJS template with initial values
// });

// // Serve static files from the public directory
// app.use(express.static('ImportAPI'));
// app.set('view engine', 'ejs');

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });



//Hardcode 





const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ejs = require('ejs');
const app = express();
const cors = require("cors")

app.use(cors({
  origin: "*",
}))

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const port = 4000;

app.post('/upload', upload.single('csv'), (req, res) => {
  const collectionName = 'iamvirad09@gmail.com';

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      db.collection(collectionName).add(row)
        .then(() => console.log('Document added successfully'))
        .catch((error) => console.error('Error adding document:', error));
    })
    .on('end', () => {
      console.log('CSV file uploaded successfully');
      fs.unlinkSync(filePath); // Delete the temporary uploaded file
      res.send('CSV file uploaded successfully');
    });
});

// Serve the HTML file for the root route
app.get('/', (req, res) => {
  res.render('index', { collectionName: '', csvFile: '' }); // Render the EJS template with initial values
});

// Serve static files from the public directory
app.use(express.static('ImportAPI'));
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
