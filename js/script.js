

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list")
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
//load eventi site ilk açılışında gerçekleşen işlemler
window.addEventListener("load",()=>{
    loadMusic(musicIndex); 
    playingNow();
});

// müziği yüklemek için yazılan fonks
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
};

// müziği oynatmak için
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
};

// müziği durdurmak için
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
};

// sonraki müziğe geçme fonksiyonu
function nextMusic(){
    // musicIndex'i 1 arttırırsak bi sonraki şarkının indexi gelir
    musicIndex++;
    // eğer music index en sonuncu şarkıdaysa tıkladığında music indexi 1 yap, değilse devam
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex); 
    playMusic();
    playingNow();
};

// önceki müziğe geçme fonksiyonu
function prevMusic(){
    musicIndex--;
    // eğer müzik index'i 1den küçükse allMusic'in length'i kadar olan müziğe git yani dizinin sonuna değilse devam
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
};

// oynatmak ya da durdurmak için click eventli ternary operatorlu
playPauseBtn.addEventListener("click", () =>{ // contain icermek demek
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    // isMusicPaused true ise pauseMusic()'i calıstırcak false ise playMusic'i calıstırıcak
    playingNow();
});

// sonraki müziğe geçmek için buton eventi
nextBtn.addEventListener("click",() =>{
    nextMusic();
});

// önceki müziğe geçmek için buton eventi
prevBtn.addEventListener("click", () => {
    prevMusic();
});


mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // şarkının o anki saniyesini alıyor
    const duration = e.target.duration; // şarkının toplam süresini alıyor
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    
    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {

        // şarkının toplam süresini yazma
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // şarkının saniyesi 10dan küçükse soluna 0 ekliyo
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
        });
        
        //şarkının güncel saniyesini gösterme
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10){
            currentSec = `0${currentSec}`;
        }
        musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// progress bardaki şarkının ilerleme sürecini güncelleme
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
})

// repeat butonunun title'ını değiştirme
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
})

 
mainAudio.addEventListener("ended", ()=>{  
    let getText = repeatBtn.innerText; 

    switch(getText){
      case "repeat":
        nextMusic(); 
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; 
        loadMusic(musicIndex); 
        playMusic(); 
        break;
      case "shuffle":
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1); 
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex); 
        musicIndex = randIndex; 
        loadMusic(musicIndex);
        playMusic();
        playingSong();
        playingNow();
        break;
    }
  });


showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
})

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
})


const ulTag = wrapper.querySelector("ul");

for(let i = 0; i < allMusic.length; i++){
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {

        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ 
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
};


const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for(let j = 0; j < allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}


function clicked(element){
    let gelLiIndex = element.getAttribute("li-index");
    musicIndex = gelLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
