  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA8ZDD0h5FT1UXTdJfC8uUe64rypS_0gH0",
    authDomain: "apifinal.firebaseapp.com",
    databaseURL: "https://apifinal.firebaseio.com",
    projectId: "apifinal",
    storageBucket: "apifinal.appspot.com",
    messagingSenderId: "556094912495",
    appId: "1:556094912495:web:c4b1150bc3dc14eb"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // #1 - get a reference to the databse
  let database = firebase.database();
  
  // #2 - refer to a root node named `scores`
  let ref = database.ref('searches');
 
 // #3 - create some data
  let searchData = {
  	search: "Bowie"
  };
  
  // #4 - send data, in this case we are adding it to the `scores` node
  
  
  //My component
  /*
Vue.component('pageHead',{
props:['title'],
template: `	<div class="myheader">
		<h1>{{title}}</h1>
		<p>Search any artist to find instructional tabs to play along to on <b>Songsterr</b></p>
	</div>`
});
*/
const app = new Vue({
	el: '#app',
	data: {
	title: "Can you Pick it?",
	result: [{"artist": {"name":"Rockers"}}], // from songsterr
	reccs: [{"strArtistThumb": "https://www.theaudiodb.com/images/media/album/cdart/vuyruy1429191547.png",
			 "strBiography": "English Bio",
			 "strBiographyEN": "English Bio"}], // from ADB
	limit: "5",
	language: "EN",
	bio: "They did stuff",
	artist: "The Doors",
	country: "US",
	current: {"bio": "The Doors were an American rock band formed in 1965 in Los Angeles, California",
				"name": "The Doors",
				"thumb": "https://www.theaudiodb.com/images/media/artist/thumb/vvsvrv1455456582.jpg"
			},
	key: "&k=334779-JustinCo-OMZUZQSP",
	link: "http://www.songsterr.com/a/wa/song?id="
	},
	// Local Storage
	mounted() {
		if (localStorage.artist) {
		  this.artist = localStorage.artist;

		}
	  },
	watch: {
		artist(newArtist) {
		  localStorage.artist = newArtist;
		}
	  },
	methods:{
	
	search(){
		
	//Firebase call
		searchData.search = this.artist;
		let path = 'searches/' + this.artist;
		firebase.database().ref(path).set({ // over-writes old values
		search: this.artist
	});
		
	// Songsterr API
		//if (! this.term.trim()) return;
		fetch('https://www.songsterr.com/a/ra/songs/byartists.json?artists="'+this.artist+'"')
		.then(response => {
			if(!response.ok){
				throw Error(`ERROR: ${response.statusText}`);
			}
			return response.json();
		})
		.then(json => {
			this.result=[];

			for(let i=0;i<this.limit;i++)
			{
				this.result[i] = json[i];
			}
			for(let i=0;i<this.limit;i++)
			{
				this.result[i].id = ''+this.link+this.result[i].id+'';
			}

		})
		
	// AudioDB API
		//if (! this.term.trim()) return;
		fetch('https://www.theaudiodb.com/api/v1/json/1/search.php?s='+this.artist)
		.then(response => {
			if(!response.ok){
				throw Error(`ERROR: ${response.statusText}`);
			}
			return response.json();
		})
		.then(json => {
			this.reccs=[];


			this.reccs = json.artists;
			
			if(this.language == "EN")
			{
				this.bio = this.reccs[0].strBiographyEN;
			}
			
			if(this.language == "ES")
			{
				this.bio = this.reccs[0].strBiographyES;
			}
			
			if(this.language == "FR")
			{
				this.bio = this.reccs[0].strBiographyFR;
			}
			
			let currentArtist = new Artist(this.result[0].artist.name,this.reccs[0].strArtistThumb,this.bio);
			
			this.current = currentArtist;

		})
	   } // end search
	}, // end methods
	created(){
		this.search();
	}
});
// custom class
class Artist{
	constructor(name,thumb,bio){
		this.name = name;
		this.thumb = thumb;
		this.bio = bio;
	}
}


