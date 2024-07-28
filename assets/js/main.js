const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const playlist = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd__thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".app");
const progress = $("#progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const song = $(".song");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  songs: [
    {
      name: "Young Dumb & Broke",
      author: "Khalid",
      thumb: "./assets/images/song-1.jpg",
      path: "./assets/music/song-1.mp3",
    },
    {
      name: "Circle",
      author: "Post Malone",
      thumb: "./assets/images/song-2.jpg",
      path: "./assets/music/song-2.mp3",
    },
    {
      name: "Better",
      author: "Khalid",
      thumb: "./assets/images/song-3.jpg",
      path: "./assets/music/song-3.mp3",
    },
    {
      name: "Hold My Hand",
      author: "Jess Glynne",
      thumb: "./assets/images/song-4.jpg",
      path: "./assets/music/song-4.mp3",
    },
    {
      name: "In My Feelings",
      author: "Drake",
      thumb: "./assets/images/song-5.jpg",
      path: "./assets/music/song-5.mp3",
    },
    {
      name: "Psycho",
      author: "Post Malone",
      thumb: "./assets/images/song-6.jpg",
      path: "./assets/music/song-6.mp3",
    },
    {
      name: "See You Again (feat. Charlie Puth)",
      author: "Wiz Khalifa, Charlie Puth",
      thumb: "./assets/images/song-7.jpg",
      path: "./assets/music/song-7.mp3",
    },
    {
      name: "What Makes You Beautiful",
      author: "One Direction",
      thumb: "./assets/images/song-8.jpg",
      path: "./assets/music/song-8.mp3",
    },
    {
      name: "What Do You Mean?",
      author: "Justin Bieber",
      thumb: "./assets/images/song-9.jpg",
      path: "./assets/music/song-9.mp3",
    },
    {
      name: "Summertime Sadness",
      author: "Lana Del Rey",
      thumb: "./assets/images/song-10.jpg",
      path: "./assets/music/song-10.mp3",
    },
  ],

  //   Render HTMl Song List
  render() {
    const __this = this;
    var htmls = __this.songs.map(function (song, index) {
      return `
        <div class="song ${
          index === __this.currentIndex ? "active" : ""
        }" data-id = ${index}>
            <div class="singer-image" style="background-image: url('${
              song.thumb
            }');"></div>
            <div class="song-info">
                <h3 class="song-title">${song.name}</h3>
                <span class="song-name">${song.author}</span>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
      `;
    });

    playlist.innerHTML = htmls.join("");
  },

  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },

  loadCurrentSong() {
    var currentSong = this.currentSong;
    heading.textContent = currentSong.name;
    cdThumb.style.backgroundImage = "url(" + currentSong.thumb + ")";
    audio.src = currentSong.path;
  },

  nextsong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  handleEvents() {
    const __this = this;
    var cdWidth = cd.offsetWidth;
    const cdThumbAnimate = cdThumb.animate(
      [
        // keyframes
        { transform: "rotate(360deg)" },
      ],
      {
        // timing options
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // Zoom in and out
    document.addEventListener("scroll", function () {
      var scroll = window.scrollY;
      var newCdWidth = cdWidth - scroll;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    });

    // When the song starts playing
    playBtn.onclick = function () {
      if (!__this.isPlaying) {
        audio.play();
        cdThumbAnimate.play();
      } else {
        audio.pause();
        cdThumbAnimate.pause();
      }
    };

    audio.onplay = function () {
      __this.isPlaying = true;
      player.classList.add("playing");
      __this.render();
      __this.scrollToActiveSong();
    };

    // When the song ends playing
    audio.onpause = function () {
      __this.isPlaying = false;
      player.classList.remove("playing");
    };

    // Get the time of the song
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const percent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = percent;
      }
    };

    // Get the change oninput
    progress.oninput = function (e) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    };

    // Next song
    btnNext.onclick = function () {
      if (__this.isRandom) {
        __this.randomSong();
      } else {
        __this.nextsong();
      }
      audio.play();
    };

    // Prev song
    btnPrev.onclick = function () {
      if (__this.isRandom) {
        __this.randomSong();
      } else {
        __this.prevSong();
      }
      audio.play();
    };

    // Random song
    btnRandom.onclick = function () {
      __this.isRandom = !__this.isRandom;
      __this.setConfig("isRandom", __this.isRandom);
      this.classList.toggle("active", __this.isRandom);
    };

    // audio onend
    audio.onended = function () {
      if (__this.isRepeat) {
        audio.loop = true;
      } else {
        btnNext.click();
      }
    };

    // Repeat

    btnRepeat.onclick = function () {
      __this.isRepeat = !__this.isRepeat;
      __this.setConfig("isRepeat", __this.isRepeat);
      this.classList.toggle("active", __this.isRepeat);
    };

    playlist.addEventListener("click", function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode) {
        const index = parseInt(songNode.dataset.id);
        __this.currentIndex = index;
        __this.loadCurrentSong();
        audio.play();
      }
    });
  },

  scrollToActiveSong() {
    const songActive = $(".song.active");
    setTimeout(() => {
      songActive.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }, 500);
  },

  start() {
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
