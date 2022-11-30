/** 
 * 1 - Render songs
 * 2 - Play, pause, seek ,set volume
 * 3 - Show up playlist 
 * 4 - CD rotate
 * 5 - Next, previous 
 * 6 - Random song 
 * 7 - Next or Repeat when ended
 * 8 - active song trong playlist
 * 9 - Scroll active song lên view
 * 10 - Play song khi click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER_STORAGE_KEY';

const playlist = $('.playlist');

const singerName = $('.header-title h4');
const heading = $('.header-title h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');

const playBtn = $('.btn-toggle-play');
const app_music= $('.app_music');

const progress = $('#progress');

// timer
const durationTime = $('.duration');
const remainingTime = $('.remaining');

// audio
const showVolume = $('.show-volume');
const volumeUp = $('.volume-icon');    
const volumeMuted = $('.volume-muted');
const volumeBar= $('.volume-item');
let theVolume = 100;

// show up playlist
const iconPlaylist = $('.icon-playlist');

// next/prev song
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Cơn mưa xa dần',
            singer: 'Sơn Tùng M-TP',
            path: './assets/audio/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Waiting for you',
            singer: 'Mono',
            path: './assets/audio/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Hayya Hayya (Better Together)',
            singer: 'Trinidad Cardona, Davido and Aisha.',
            path: './assets/audio/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Diễn viên tồi',
            singer: 'Đen Vâu',
            path: './assets/audio/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Replay trên con Guây',
            singer: 'Phúc Du',
            path: './assets/audio/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Bài hát này không để đi diễn',
            singer: 'Anh Tú',
            path: './assets/audio/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Mặt mộc',
            singer: 'Phạm Nguyên Ngọc, Vanh, và Ân Nhi',
            path: './assets/audio/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Stereo hearts',
            singer: 'Adam Levine',
            path: './assets/audio/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Người đi bao',
            singer: 'Low G, Tlinh',
            path: './assets/audio/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Vì anh đâu có biết',
            singer: 'Madihu (Feat. Vũ.)',
            path: './assets/audio/song10.mp3',
            image: './assets/img/song10.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    // 1. Render songs
    render: function() {
        const html = this.songs.map((song, index) => {
            // 8. Active song trong playlist
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <h4 class="singer">${song.singer}</h4>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = html.join('');
        remainingTime.innerText = `00 : 00`;
        durationTime.innerText = `00 : 00`;
    },

    // Định nghĩa...
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    // 2. Play, pause, seek ,set volume
    handleEvents: function() {
        const _this = this;

        // 4. Cd rotate
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song play(event: play)
        audio.onplay = function() {
            _this.isPlaying = true;
            app_music.classList.add('playing');
            cdThumbAnimate.play();
        };

        // Khi song pause(event: pause)
        audio.onpause = function() {
            _this.isPlaying = false;
            app_music.classList.remove('playing');
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }

            let allSong = audio.duration;
            let currentTime = audio.currentTime;
            let minutes = Math.floor(allSong / 60);
            let seconds = Math.floor(allSong - minutes * 60);
            let currentMinutes = Math.floor(currentTime / 60);
            let currentSeconds = Math.floor(currentTime - currentMinutes * 60);

            if(audio.duration) {
                remainingTime.textContent = 
                `${currentMinutes < 10 ? '0' + currentMinutes : currentMinutes} : ${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;

                durationTime.textContent = 
                `${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds} `;
            }
        };

        // Xử lý khi tua // Xử lý làm tròn để tua không bị xước
        progress.oninput = (e) => {
            if (audio.currentTime) {
                // toFixed(làm tròn số)
                const seekTime = (audio.duration * e.target.value / 100).toFixed(0);
                audio.currentTime = seekTime;                   
            }
        };

        // Xử lý khi mute âm thanh
        volumeBar.oninput = function(e) {
            theVolume = e.target.value / 100;
            audio.volume = theVolume;
            if(theVolume === 0) {
                volumeUp.classList.remove('appear');
                volumeMuted.classList.add('appear');
            } else {
                volumeMuted.classList.remove('appear');
                volumeUp.classList.add('appear');
            }
        };

        // Xử lý khi tắt âm thanh
        volumeUp.onclick = function() {
            volumeUp.classList.remove('appear');
            volumeMuted.classList.add('appear');
            audio.volume = 0;
            volumeBar.value = 0;
        };

        // Xử lý khi bật âm thanh
        volumeMuted.onclick = function() {
            volumeMuted.classList.remove('appear');
            volumeUp.classList.add('appear');
            audio.volume = 1;
            volumeBar.value = 100;
        };
        

        // 3. Show up playlist
        iconPlaylist.onclick = function() {
            iconPlaylist.classList.toggle('active');
            playlist.classList.toggle('active');
            playlist.classList.remove('non-active');
        };

        // 5. Next, previous 
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToView();
        };

        // Xử lý khi prevSong
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToView();
        };

        // 7. Next or Repeat when ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // 6. Random song 
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('on', _this.isRandom);
        };

        // Xử lý khi repeatSong
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('on', _this.isRepeat);
        };

        // 10. Play song khi click
        // Xử lý khi click playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            if(songNode || optionNode) {
            // Xử lý khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.scrollToView();
                    _this.render();
                };

            // Xử lý khi click vào option
                if(optionNode) {

                };
            };
        };
    },

    // loadCurrentSong
    loadCurrentSong: function() {
        singerName.textContent = this.currentSong.singer;
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path; 
    },

    // loadConfig
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    // nextSong
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },

    // prevSong
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },

    // randomSong
    randomSong: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    // 9. Scroll to view
    scrollToView: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 500);
    },

    start: function() {
        // Xử lý gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Xử lý sự kiện
        this.handleEvents();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        
        // Tải thông tin bài hát vào UI khi chạy ứng  dụng
        this.loadCurrentSong();

        // Render playlist 
        this.render();

        // Hiển thị trạng thái ban đầu của button
        randomBtn.classList.toggle('on', this.isRandom);
        repeatBtn.classList.toggle('on', this.isRepeat);
    },
};

app.start();
