const firebaseConfig = {
apiKey: "AIzaSyDzz9jCnZ3tiWCC-pAU3oS7_xD0uYBk3vY",
authDomain: "bca-church-finance.firebaseapp.com",
projectId: "bca-church-finance"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();