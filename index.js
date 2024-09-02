const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const heading = $('.dashboard header h2')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const bar = $('.progress')
const btnRandom = $('.btn-random')
const btnNext = $('.btn-next')
const btnPre = $('.btn-prev')
const btnRepeat = $('.btn-repeat')

const app = {
    playMusic : false,
    currentIndex : 0,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "We Don't Talk Anymore",
            singer: "Charlie Puth x Selena Gomez",
            path: "./audio/We Don't Talk Anymore.mp3",
            image: "https://i1.sndcdn.com/artworks-000144608849-4nygrt-t500x500.jpg"
        },
        {
            name: "Em Đừng Đi",
            singer: "Sơn Tùng M-TP | Prod. by SenTfour",
            path: "./audio/(Synthwave Disco 80s) Em Đừng Đi - Sơn Tùng M-TP _ Prod. by SenTfour.mp3",
            image: "https://i1.sndcdn.com/artworks-4BMFYYc6P1Yv4pMm-xLLe5g-t500x500.jpg"
        },
        {
            name: "Band4Band",
            singer: "Central Cee ft. Lil Baby & Pop Smoke",
            path: "./audio/CENTRAL CEE FT. LIL BABY - BAND4BAND (MUSIC VIDEO).mp3",
            image: "https://i1.sndcdn.com/artworks-gziACcISuY9OtI9k-ZPeBbQ-t500x500.jpg"
        },
        {
            name: "FORREST GUMP",
            singer: "ROBE",
            path: "./audio/Forrest Gump - H$ Robe ( Lyrics Video ).mp3",
            image: "https://i1.sndcdn.com/artworks-9kynIlMmkCDfyKkM-bjw5rA-t500x500.jpg"
        },
        {
            name: "Dân Chơi Sao Phải Khóc ",
            singer: "Andree Right Hand Ft RHYDER x WOKEUP ",
            path: "./audio/Andree Right Hand - Dân Chơi Sao Phải Khóc ft. RHYDER, WOKEUP _ Official MV.mp3",
            image: "https://i1.sndcdn.com/artworks-Xmz7Wg5OQp3uxUYJ-68RzNg-t500x500.jpg"
        },
        {
            name: "Sẽ Luôn Yêu Em",
            singer: "RPT Groovie",
            path: "./audio/[MV] RPT Groovie - Sẽ Luôn Yêu Em.mp3",
            image: "https://i1.sndcdn.com/artworks-000477738909-cha2cm-t500x500.jpg"
        },
        {
            name: "Muốn anh đau",
            singer: "Winno ft. Hustlang Robber",
            path: "./audio/Winno - Muốn anh đau ft. Hustlang Robber _ TO LOVE AND BE LOVED Album.mp3",
            image: "https://i1.sndcdn.com/artworks-x5tyXqIhZ7aY8Sla-bW6p8A-t500x500.jpg"
        },
        {
            name: "GIAYPHUT",
            singer: "kidsai",
            path: "./audio/kidsai - GIAYPHUT (Official Audio).mp3",
            image: "https://i1.sndcdn.com/artworks-XcVtCyIGgjIF13jZ-DHlUUQ-t500x500.jpg"
        }
    ],
    defineProperties(){
        Object.defineProperty(this, 'currentSong', {
            get(){
                return this.songs[this.currentIndex]
            }
        }  
    )},
    render(){
        var html = this.songs.map((song ,index) => {
            return `
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        })
        playlist.innerHTML = html.join('')
    },
    loadCurrentSong(){
        heading.innerText = this.currentSong.name
        audio.src = this.currentSong.path
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
    },
    handleEvents(){
        const _this = this;
        const cdWidth = cd.offsetWidth;
        
        // Xử lý CD quay / dừng
        // Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        document.onscroll = () => {
            const scrolltop = window.scrollTop || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrolltop

            cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0 
            cd.style.opacity = newCdWidth / cdWidth
        }

        playBtn.onclick = () => {
            if(_this.playMusic === false){
                audio.play()
            }
            else{
                audio.pause()
            }
        }

        audio.onplay = () => {
            _this.playMusic = true
            cdThumbAnimate.play();
            player.classList.add("playing")
        }

        audio.onpause = () => {
            _this.playMusic = false
            cdThumbAnimate.pause()
            player.classList.remove("playing")
        }

        audio.ontimeupdate = () => {
            progress.value = (audio.currentTime / audio.duration) * 100
        }

        progress.onchange = () => {
            audio.currentTime = (progress.value / 100) * audio.duration
        }

        btnRandom.onclick = () => {
            if(_this.isRandom){
                btnRandom.classList.remove("active")
                _this.isRandom = false
            }
            else{
                btnRandom.classList.add("active")
                _this.isRandom = true
            }
        }

        btnRepeat.onclick = () => {
            if(_this.isRepeat){
                btnRepeat.classList.remove("active")
                _this.isRepeat = false
            }
            else{
                btnRepeat.classList.add("active")
                _this.isRepeat = true
            }
        }

        btnNext.onclick = () => {
            if(_this.isRandom){
                _this.playRandomSong()
            }
            else{
                _this.playNextSong()
            }
        }

        btnPre.onclick = () => {
            if(_this.isRandom){
                _this.playRandomSong()
            }
            else{
                _this.playPreSong()
            }
        }

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        };

        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                // Handle when clicking on the song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option
                // Handle when clicking on the song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    playRandomSong(){
        let indexRd = Math.floor(Math.random()*this.songs.length)
        if(indexRd === this.currentIndex){ indexRd+=2}
        this.currentIndex = indexRd
        this.loadCurrentSong()
        this.render()
        audio.play()
    },
    playNextSong(){
        if(this.currentIndex + 1 > (this.songs.length - 1)){
            this.currentIndex = 0
            this.loadCurrentSong()
            this.render()
            audio.play()
        }
        else{
            this.currentIndex += 1
            this.loadCurrentSong()
            this.render()
            audio.play()
        }
    },
    playPreSong(){
        if(this.currentIndex === 0 ){
            this.currentIndex = this.songs.length - 1
            this.loadCurrentSong()
            this.render()
            audio.play()
        }
        else{
            this.currentIndex -= 1
            this.loadCurrentSong()
            this.render()
            audio.play()
        }
    },
    start(){
        this.defineProperties()
        this.render()
        this.loadCurrentSong()
        this.handleEvents()
    }
}

app.start()