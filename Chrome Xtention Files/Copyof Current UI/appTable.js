// Table Creation
var email;
chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
    email = info.email;
    console.log(email);
    if (email) {
        RealTimeData();
    } else {
        console.error('Email is empty or undefined.');
    }
});

var tbody = document.getElementById('tbody1');

function AddItemToTable(companyName, date, jobTitle, status){
    let trow = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');

    td1.innerHTML = companyName;
    td2.innerHTML = date;
    td3.innerHTML = jobTitle;
    td4.innerHTML = status;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);

    tbody.appendChild(trow); 
}

function AddAllItemsToTable(TheUser){
    tbody.innerHTML = '';
    TheUser.forEach((element) => {
        AddItemToTable(element.companyName, element.date, element.jobTitle, element.status);
    });
}

// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_OG0ZWhO9r8Cv9Csm5QH700kCjGe5MWQ",
  authDomain: "applify-9f7a9.firebaseapp.com",
  projectId: "applify-9f7a9",
  storageBucket: "applify-9f7a9.appspot.com",
  messagingSenderId: "810543153664",
  appId: "1:810543153664:web:383acfa1494286ffa28ee5",
  measurementId: "G-62GSL4N3VZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

/// Function to import CSV data
async function importData(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async function(e) {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.split(','));
      const batch = db.batch();
      for (const row of rows) {
          const [companyName, date, jobTitle, status] = row;
          const docRef = doc(collection(db, email), companyName);
          batch.set(docRef, { date, jobTitle, status });
      }
      await batch.commit();
      console.log('CSV data imported successfully');
  }
  reader.readAsText(file);
}

// Event listener for file input
document.getElementById('fileInput').addEventListener('change', importData);

// Fetching all the data from the database
async function GetAllData(){
    try {
        const querySnapshot = await getDocs(collection(db, email));
        const user = [];
        querySnapshot.forEach((doc) => {
            user.push(doc.data());
        });
        AddAllItemsToTable(user);
    } catch (error) {
        console.error('Error in GetAllData:', error);
    }
}

// Fetching the data in real-time
async function RealTimeData(){
    try {
        const dbRef = collection(db, email);
        onSnapshot(dbRef, (querySnapshot) => {
            const user = [];
            querySnapshot.forEach((doc) => {
                user.push(doc.data());
            });
            AddAllItemsToTable(user);
        });
    } catch (error) {
        console.error('Error in RealTimeData:', error);
    }
}
