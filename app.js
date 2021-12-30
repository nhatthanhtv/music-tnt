const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Thanh Playing";

const btnStart = $(".btn-start");
const player = $(".player");
const line = $(".line");
const btnLogin = $(".btn-login");
const formLogin = $(".form-login");
const backFormLogin = $(".icon-back");
const playlist = $(".playlist");
const dashboard = $(".dashboard");
const cdthumb = $(".cd-thumb");
const title = $(".title");
const author = $(".author");
const audio = $("audio");
const btnPlay = $(".btn-play-toger");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const progress = $(".progress");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const searchMp3 = $("#search-mp3");
const listSongsSearch = $(".list_song_search-list");
const inputMP3z = $(".input_search__MP3");

const app = {
    currentIndex: 0,
    isSongPlay: false,
    isRandom: false,
    isRepeat: false,

    songList: [],

    listTopMp3: [],

    songs: [
        // {
        //     name: "Light It Up",
        //     singer: "Robin Hustin x TobiMorrow",
        //     path: "https://aredir.nixcdn.com/NhacCuaTui968/LightItUp-RobinHustinTobimorrowJex-5619031.mp3?st=kzpVQ5kKnf2LlcAqM6lnxg&e=1623143881",
        //     image: "https://avatar-ex-swe.nixcdn.com/song/2019/01/08/1/3/d/a/1546913843457_640.jpg",
        // },
        // {
        //     name: "Yoru ni kakeru",
        //     singer: "YOASOBI",
        //     path: "https://aredir.nixcdn.com/NhacCuaTui992/YoruNiKakeru-YOASOBI-6149490.mp3?st=68hnFhtGF6RukKDcDcW9Mw&e=1623132179",
        //     image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/16788ee5-3436-474a-84fd-6616063a1a9a/de2f4eq-bc67fa17-8dae-46a9-b85d-fe8082c34841.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE2Nzg4ZWU1LTM0MzYtNDc0YS04NGZkLTY2MTYwNjNhMWE5YVwvZGUyZjRlcS1iYzY3ZmExNy04ZGFlLTQ2YTktYjg1ZC1mZTgwODJjMzQ4NDEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dABuqANeQEs6FBfslZHdG1lW_gDwzf61yqiSABROSx0",
        // }
    ],

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    renderSongs: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${
                index === this.currentIndex ? "active" : ""
            } " data-index="${index}">
            <div class="song-img" style="background-image: url(${
                song.image
            });"></div>
            <div class="song-content">
                <h3 class="song-content-heading">
                    ${song.name}
                </h3>
                <p class="song-content-author">
                    ${song.singer}
                </p>
            </div>
            <div class="song-option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>

            `;
        });
        playlist.innerHTML = htmls.join("");
    },
    loadCurrentSong: function () {
        cdthumb.style = `background-image: url(${this.currentSong.image});`;
        title.textContent = this.currentSong.name;
        author.textContent = this.currentSong.singer;
        audio.src = this.currentSong.path;
    },

    handleEvent: function () {
        const _this = this;

        const cdThumbAnimate = cdthumb.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        // xử lí bấm start hiện player
        btnStart.onclick = function () {
            player.classList.add("show");
            inputMP3z.classList.add("active");
        };
        // bấm tắt player
        line.onclick = function () {
            player.classList.remove("show");
            $(".input_search__MP3.active").classList.remove("active");
        };
        // click login home
        btnLogin.onclick = function () {
            formLogin.classList.add("active");
        };
        // back form login login
        backFormLogin.onclick = function () {
            formLogin.classList.remove("active");
        };
        // bấm play
        btnPlay.onclick = function () {
            if (_this.isSongPlay) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        audio.onplay = function () {
            cdThumbAnimate.play();
            _this.isSongPlay = true;
            player.classList.add("active");
        };
        audio.onpause = function () {
            cdThumbAnimate.pause();
            _this.isSongPlay = false;
            player.classList.remove("active");
        };
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            _this.loadCurrentSong();
            audio.play();
            _this.renderSongs();
            _this.scrollToActiveSong();
        };
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            _this.loadCurrentSong();
            audio.play();
            _this.renderSongs();
            _this.scrollToActiveSong();
        };
        audio.ontimeupdate = function () {
            const degSong = (audio.currentTime / audio.duration) * 100;
            if (audio.currentTime) {
                progress.value = degSong;
            }
            let timeSongUp = Math.floor(audio.currentTime)
            if(audio.duration === NaN){
                console.log('a');
            }
            console.log();
        };

        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        btnRandom.onclick = function () {
            _this.isRandom = !_this.isRandom;
            btnRandom.classList.toggle("active", _this.isRandom);
        };
        //   xử lí phát lai 1 bài hát
        btnRepeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            btnRepeat.classList.toggle("active", _this.isRepeat);
        };

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        };
        playlist.onclick = function (e) {
            // xử lí khi click bài đo
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".song-option")) {
                // xử lí click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.renderSongs();
                    audio.play();
                }
                // xử lí click vào option
                if (e.target.closest(".song-option")) {
                }
            }
        };

        // tìm kiếm
        searchMp3.oninput = function (e) {
            let ApiUrl = `http://ac.mp3.zing.vn/complete?type=artist,song,key,code&num=500&query=${e.target.value.trim()}`;
            if (e.target.value != "") {
                $(".list_song_search").classList.add("active");
            } else {
                $(".list_song_search.active").classList.remove("active");
            }

            _this.searchMp3Api(ApiUrl);
        };
        searchMp3.onchange = function (e) {
            _this.clickItemSearch();
            e.target.value = ''

        };
        // click bài hát search
    },

    clickItemSearch: function () {
        let listSongs = document.querySelectorAll(".songs__search");
        const _this = this
        listSongs.forEach(function (song) {
            song.onclick = function (e) {
                let cha = e.target.closest(".songs__search");
                //   console.log(e);
                let songInfo = {
                    name: cha.querySelector(".song-content h3").textContent.trim(),
                    singer: cha.querySelector(".song-content p").textContent.trim(),
                    path: `http://api.mp3.zing.vn/api/streaming/audio/${cha.getAttribute("id-song")}/128`,
                    image: cha.querySelector(".songs-item-search").src,
                };
                _this.songs.unshift(songInfo)
                _this.loadCurrentSong();
                _this.renderSongs();
                $('.list_song_search.active').classList.remove('active');
                audio.play();

            };
        });
    },

    searchMp3Api: function (dataSearch) {
        const list = fetch(dataSearch)
            .then((listSongs) => listSongs.json())
            .then((dataSongs) => {
                let a = dataSongs.data[0].song;

                this.songList = a;
            })
            .then((items) => {
                this.renderSongSearch();
            });
    },

    renderSongSearch: function () {
        // viewSearch
        let abc = this.songList.map((item) => {
            return `
            <li class="list_song_search-item">
                        <div class="song songs__search" id-song=${item.id}>
                            <img src="https://photo-zmp3.zadn.vn/${item.thumb}" alt="" class="song-img songs-item-search">
                            <div class="song-content">
                                <h3 class="song-content-heading">
                                    ${item.name}
                                </h3>
                                <p class="song-content-author">
                                    ${item.artist}
                                </p>
                            </div>
                        </div>
                    </li>
            `;
        });
        // console.log(abc.join(''));
        listSongsSearch.innerHTML = abc.join("");
    },

    getSongTopZingMp3: function () {
        fetch(
            "https://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1"
        )
            .then((songs) => songs.json())
            .then((dataSongs) => {
                let data = dataSongs.data.song;
                // console.log(dataSongs);
                this.listTopMp3 = data;
            })
            .then((song) => {
                this.addListSongToptoAPP();
            });
    },

    addListSongToptoAPP: function () {
        const listTopMp3s = this.listTopMp3.map((song) => {
            // console.log(song);
            return {
                name: song.name,
                singer: song.artists_names,
                path: `http://api.mp3.zing.vn/api/streaming/audio/${song.id}/128`,
                image: song.thumbnail,
            };
        });
        this.songs = listTopMp3s;
        this.loadCurrentSong();
        this.renderSongs();
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex == this.songs.length) {
            this.currentIndex = 0;
        }
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
            console.log(this.currentIndex);
        }
    },
    // đang suy ngẫm
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex);
        {
            this.currentIndex = newIndex;
            this.loadCurrentSong();
        }
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 500);
    },

    start: function () {
        this.getSongTopZingMp3();
        // this.addListSongToptoAPP()
        this.renderSongs();
        this.handleEvent();
        this.defineProperties();
        // this.loadCurrentSong();
        console.log(
            "%cThành xin chào mọi người! \ud83d\ude4b",
            "color: #29c4a9;font-size: 16px;font-weight: 600;"
        );
    },
};
app.start();
