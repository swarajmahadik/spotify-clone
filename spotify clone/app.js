let targetSong = document.querySelector("#play-button");
let cards = document.querySelectorAll(".card");
let navButtons = document.querySelectorAll(".nav-img");
let playList = document.querySelector(".playlist-div");
let cardContainer = document.querySelector(".card-container");
let playlistContainer = document.querySelector(".playlist-container");
let playBtn=document.getElementById("playBtn");
let pauseBtn=document.getElementById("pauseBtn");
let tempAudio;
let card1 = false;
let card2 = false;
let card3 = false;
let cardClicked = [card1, card2, card3];
let songs1 = [];
let songs2 = [];
let songs3 = [];
let img1,img2;


let playlists = [songs1, songs2, songs3];



//onclick function for removing playlist button
function removePlayListBtn() {
  let target = document.querySelector("#create-playlist");
  target.innerHTML = "";
  target.classList.add("hide");
  let plus = document.querySelector("#plus");
  plus.classList.remove("hide");
}

//function that shows the + button when create-playlist is pressed
function addSong() {
  let target = document.querySelector("#create-playlist");
  target.classList.remove("hide");
}

//function which displays the song list according to playlist
function displaySong(cardIndex) {
  let playListsongs = document.querySelectorAll(".playlist-song");
  cardClicked[cardIndex] = true;

  for (let index = 0; index < playListsongs.length; index++) {
    let newDivClass = playListsongs[index];

    if (Number.parseInt(newDivClass.classList[0]) != cardIndex) {
      newDivClass.classList.add("hide");
    } else {
      newDivClass.classList.remove("hide");
    }
  }
}



//seekbar play pause button function


  function pause1(){
    pauseBtn.classList.add("hide");
    playBtn.classList.remove("hide");
    img2.classList.add("hide");
    img1.classList.remove("hide");
    tempAudio.pause();
  }
  
  function play1(){
    pauseBtn.classList.remove("hide");
    playBtn.classList.add("hide");
    img2.classList.remove("hide");
    img1.classList.add("hide");
    tempAudio.play();
  }

let flag=false;

//funtion whch controls the nav buttons for next and previous page
function navButtonFunc() {
  for (const button of navButtons) {
    let buttonNo = Number.parseInt(button.classList[1]);
    button.addEventListener("click", () => {
      if (buttonNo == 1) {
        cardContainer.classList.remove("hide");
        playlistContainer.classList.add("hide");
      } else if (buttonNo == 2 && flag===true) {
        cardContainer.classList.add("hide");
        playlistContainer.classList.remove("hide");
      }
    });
  }
}




//function which plays and pause the audio
let audioElements = {};

function play() {
  let songDivs = document.querySelectorAll(".playlist-song");

  songDivs.forEach((song) => {
    song.addEventListener("click", () => {
      document.querySelector(".controls").classList.remove("hide");
      let playListIndex = parseInt(song.classList[0]);
      let songIndex = parseInt(song.classList[3]);
      let imgArray=song.getElementsByTagName("img");
      img1=imgArray[0];
      img2=imgArray[1];
      
      // Check if an audio element for this song already exists
      if (!audioElements[`${playListIndex}-${songIndex}`]) {
        // If not, create a new audio element
        audioElements[`${playListIndex}-${songIndex}`] = new Audio(
          playlists[playListIndex - 1][songIndex]
        );
      }
      

      let audio = audioElements[`${playListIndex}-${songIndex}`];
      tempAudio=audio;
      // Play or pause the audio based on its current state
      if (audio.paused) {
        // Pause any other playing songs
        Object.values(audioElements).forEach((otherAudio) => {
          if (otherAudio !== audio && (!otherAudio.paused || otherAudio.paused  )) {
            otherAudio.pause();
            otherAudio.currentTime = 0;
             
          }
        });
        
        
        img2.classList.remove("hide");
        img1.classList.add("hide");
        audio.play();
        console.log("Play");
        pauseBtn.classList.remove("hide");
        playBtn.classList.add("hide");
        
        
      } else {
        audio.pause();
        console.log("Pause");
        img2.classList.add("hide");
        img1.classList.remove("hide");
        pauseBtn.classList.add("hide");
        playBtn.classList.remove("hide");
        
      }

      
    });
  });
}



async function creatingElements() {
  navButtonFunc();

  for (const card of cards) {
    card.addEventListener("click", () => {
      flag=true;
      cardContainer.classList.add("hide");
      playlistContainer.classList.remove("hide");
      playList.classList.remove("hide");

      let cardNo = Number.parseInt(card.classList[1]);
      let songs = playlists[`${cardNo - 1}`];
      var newImg = document.querySelector("#artist-img");
      newImg.src = `./spotify${cardNo}-img.jpeg`;
      
      let cardIndex = Number.parseInt(`${cardNo}`);

      if (!cardClicked[cardIndex]) {
        for (let i = 0; i < songs.length; i++) {
          var newDiv = document.createElement("div");
          newDiv.className = `${cardIndex} playlist-song flex  ${i} `;
          parentDiv = document.querySelector(".songList-div");

          let urlString = songs[i];

          // Extract the substring between the last '/' and '.mp3'
          let startIndex = urlString.lastIndexOf("/") + 1;
          let endIndex = urlString.lastIndexOf(".mp3");
          let extractedString = urlString.substring(startIndex, endIndex);

          // Replace "%20" with space
          let finalString = extractedString.replace(/%20/g, " ");
          
          newDiv.innerHTML = `<img  class="music-img static-music" src="output-onlinetools.png" alt=""><img id="" class="music-img hide moving-music" src="movingSong.svg" alt=""><h5> ${finalString} </h5>`;

          parentDiv.appendChild(newDiv);
        }
      }
      displaySong(cardIndex);
      play();

     

      setInterval(() => {
        if (tempAudio && tempAudio.duration) {
          const currentTime = tempAudio.currentTime;
          const duration = tempAudio.duration;
          const percentage = (currentTime / duration) * 100;
          
          document.getElementById('seekSlider').value = percentage;
        }
      }, 10);
      
    });
  }
}


let songArray = [];

async function getSong() {
  let a = await fetch("http://localhost:5500/music/");
  let responce = await a.text();
  let div = document.createElement("div");

  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");

  for (const a of as) {
    if (a.href.endsWith(".mp3")) {
      if (a.href.includes("trending")) {
        songs3.push(a.href);
      } else if (a.href.includes("rahat")) {
        songs2.push(a.href);
      } else {
        songs1.push(a.href);
      }
    }
  }
  return [songs1, songs2, songs3];
}
async function main() {
  let res = await getSong();
  creatingElements();
}
main();






