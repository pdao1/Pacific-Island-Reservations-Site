const snippetList = document.querySelector('#props')
const loggedOutLinks = document.querySelectorAll('.logged-out')
const loggedInLinks = document.querySelectorAll('.logged-in')
const accountDetails = document.querySelector('.account-details')
const setupUI = (user) => {
  if (user) {
    fs.collection('Users').doc(user.uid).get().then(doc => {
  
    const html = `
    <div class='info'>Logged in as ${user.email}</div>
    `;
    // accountDetails.innerHTML = html;
  })

    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }

}

const snippets = (data) => {
if (data.length) {

  let html = '';
  data.forEach(doc =>{
    const snip = doc.data();
    const li = `
		<div class="group relative">
		<div
			class="min-h-80 aspect-w-16 aspect-h-11 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 aspect-video lg:h-50 shadow-md">
			<img src="./img/ocean-estate.jpg" alt="${snip.propertyName}"
				class="object-cover object-center lg:h-full lg:w-full">
		</div>
		<div class="mt-4 flex justify-between">
			<div>
				<h3 class="text-sm text-gray-700">
					<a href="#">
						<span aria-hidden="true" class="absolute inset-0"></span>
						${snip.propertyName}
					</a>
				</h3>
				<p class="mt-1 text-sm text-gray-500">${snip.propertyNeighborhood}</p>
			</div>
			<p class="text-sm font-medium text-gray-900">${snip.propertyPrice}</p>
		</div>
	</div>
  `
  html += li;
  });
  snippetList.innerHTML = html;
} else {
  snippetList.innerHTML = '<h5>Login to see collection </h5>'
  }
}