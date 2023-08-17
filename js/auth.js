const firebaseConfig = {
  apiKey: "AIzaSyA_BmBTu14_7XR-I6lCOpsxB2kPJRdwoUU",
  authDomain: "pacific-islands-reservations.firebaseapp.com",
  projectId: "pacific-islands-reservations",
  storageBucket: "pacific-islands-reservations.appspot.com",
  messagingSenderId: "325818624480",
  appId: "1:325818624480:web:cb61cca5535e62e5256385"
};

 // Initialize Firebase
 const app = firebase.initializeApp(firebaseConfig);
 const db = app.database();
 const fs = app.firestore();
 const auth = app.auth();
 const storage = firebase.storage();
 auth.useDeviceLanguage();
 
// LOGIN
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	
	// Get the email and password fields from the login form
var email = document.getElementById('login-email').value;
var password = document.getElementById('login-password').value;

// Call the signInWithEmailAndPassword method to sign in the user
auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // User is signed in, display a confirmation message
    console.log("User is logged in");
		$('#login-modal').removeClass('modal-toggle').addClass('modal');
    $('#logged-in-success').show()
    setTimeout(function(){
      $('#logged-in-success').hide();
    }, 3000)
  })
  .catch((error) => {
    // Handle login errors
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error logging in: " + errorMessage);
    $('#logged-in-error').show()
    setTimeout(function(){
      $('#logged-in-error').hide();
    }, 3000)
  });
})

  //Logout
  const logout = document.querySelector('#logout');
  logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    $('#logged-out-success').show()
    setTimeout(function(){
      $('#logged-out-success').hide();
    }, 3000)
  });


  // Tracking auth status
  auth.onAuthStateChanged(user => {
    if (user) {
      fs.collection('Properties').onSnapshot(snapshot => {
        snippets(snapshot.docs)
        setupUI(user)
      }, err =>{
        console.log(err.message)
      })
    } else {
      setupUI();
     snippets([]);
    }
  })

  const URL = [];
	var fileInput = document.getElementById('property-images');
  var fileInput2 = document.querySelectorAll('.image-upload')
  
	function handleFileUpload(e) {
		// Get the list of files selected by the user
		var files = e.target.files;
		var folder = document.querySelector('#property-name').value
		// Loop through the files and upload them to Firebase Storage
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var filename = file.name;
			var storageRef = storage.ref().child(folder + '/' + file.name);
			var uploadTask = storageRef.put(file);
	
			// Listen for upload completion and save the download URL to Firestore
			uploadTask.on('state_changed',
				function(snapshot) {
					// Track upload progress if needed
				},
				function(error) {
					console.log('Error uploading file: ' + error);
				},
				function() {
				
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            	// Save the download URL to Firestore
						fs.collection('Properties').add({
                url: downloadURL
						}).then(function(docRef) {
                URL.push(downloadURL)
						}).catch(function(error) {
							console.log('Error saving download URL to Firestore: ' + error);
						});
					});
				}
			);
		}
	}
	
	const createProperty = document.querySelector('#add-property-form');
  createProperty.addEventListener('submit', (e) => {
    e.preventDefault();
    
    fs.collection('Properties').add({
      propertyName: createProperty['property-name'].value,
      propertyPrice: createProperty['property-price'].value,
			propertyNeighborhood: createProperty['property-neighborhood'].value,
      propertyTag: createProperty['property-tag'].value,
      // propertyURL: createProperty['property-URL'].value,
      // propertyAlbum: createProperty['property-album'].value,
      amenities: createProperty['amenities'].value,
      amenities: createProperty['amenities-array'].value,
			url: URL
    }).then(() => { 
      $('#add-property').removeClass('modal-toggle').addClass('modal');
      }).catch(err => {
        console.log('insufficient permissions')
        alert('insufficient permissions')
      })
  })

	fs.collection('Properties').get().then(snapshot =>{
    snippets(snapshot.docs)
 })



// Get the file input element from the HTML page


// Listen for changes to the file input element
fileInput.addEventListener('change', handleFileUpload);
fileInput2.addEventListener('change', handleFileUpload);

// Function to handle file uploads
