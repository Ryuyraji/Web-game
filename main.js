var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var img3 = new Image();
img3.src = 'background.png';
img3.onload = function() {
    프레임마다실행();
};

var img2 = new Image();
img2.src = 'rabbit.png';
var dino = {
    x: 70,
    y: 460,
    width: 55,
    height: 55,
    draw() {
        ctx.drawImage(img2, this.x, this.y);
    }
};

var img1 = new Image();
img1.src = 'mushroom.png';

class Cactus {
    constructor() {
        this.x = 500;
        this.y = 460;
        this.width = 50;
        this.height = 50;
    }
    draw() {
        ctx.drawImage(img1, this.x, this.y);
    }
}

var failImg = new Image();
failImg.src = 'fail.png';

var retryImg = new Image();
retryImg.src = 'restart.png'; // 다시 실행하기 이미지 경로

var retryButton = document.createElement('img');
retryButton.src = retryImg.src;
retryButton.style.position = 'absolute';
retryButton.style.top = '75%';
retryButton.style.left = '75%';
retryButton.style.transform = 'translate(-50%, -50%)';
retryButton.style.display = 'none';
document.body.appendChild(retryButton);

var timer = 0;
var cactuses = [];
var 점프timer = 0;
var 점프중 = false;
var animation;
var gameOver = false;
var passedCactusCount = 0; // 넘어간 장애물 개수 카운트 변수

retryButton.addEventListener('click', function() {
    gameOver = false;
    timer = 0;
    cactuses = [];
    점프timer = 0;
    점프중 = false;
    passedCactusCount = 0; // 재시작 시 넘어간 장애물 개수 초기화
    retryButton.style.display = 'none';
    프레임마다실행();
});

function 프레임마다실행() {
    animation = requestAnimationFrame(프레임마다실행);

    ctx.drawImage(img3, 0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        if (timer % 200 === 0) {
            var cactus = new Cactus();
            cactuses.push(cactus);
        }

        cactuses.forEach((a, i, o) => {
            if (a.x < 0) {
                o.splice(i, 1);
                passedCactusCount++; // 장애물이 화면을 벗어나면 개수 증가
            }
            a.x--;
            충돌(dino, a);
            a.draw();
        });

        if (점프중 == true) {
            dino.y--;
            점프timer++;
        }
        if (점프중 == false) {
            if (dino.y < 460) {
                dino.y++;
            }
        }
        if (점프timer > 100) {
            점프중 = false;
            점프timer = 0;
        }

        dino.draw();
        timer++;
    } else {
        ctx.drawImage(failImg, canvas.width / 2 - failImg.width / 2, canvas.height / 2 - failImg.height / 2);

        retryButton.style.display = 'block';
        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px "Roboto Mono"'
        ctx.fillText('피한 버섯 갯수: ' + passedCactusCount, canvas.width / 2-75, canvas.height / 2 + 50);
    }
}

function 충돌(dino, cactus) {
    var x축차이 = cactus.x - (dino.x + dino.width);
    var y축차이 = cactus.y - (dino.y + dino.height);
    if (x축차이 < 0 && y축차이 < 0) {
        gameOver = true;
    }
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !gameOver) {
        점프중 = true;
    }
});
