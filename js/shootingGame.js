//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImg, spaceshipImg, bulletImg, alienImg, gameOverImg;
let gameOver = false; //true이면 게임이 끝남, false이면 게임이 안끝남
let score = 0;

//우주선 좌표
let spaceshipX = canvas.width/2-28;
let spaceshipY = canvas.height-60;

let bulletlist = [];
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX + 18;
        this.y = spaceshipY;
        this.alive = true; // true면 살아있는 총알, false면 죽은 총알
        bulletlist.push(this);
    };

    this.update = function(){
        this.y -= 7;
    };

    this.checkHit = function(){
        for(let i=0; i<alienlist.length; i++){
            if(this.y <= alienlist[i].y && this.x >= alienlist[i].x && this.x <= alienlist[i].x+48){
                //총알과 외계인이 없어지고 점수 획득
                score++;
                this.alive = false; //죽은 총알
                alienlist.splice(i,1); //없어진 총알은 배열에서 빠지게
            }
        }

    }
}

//외계인 좌표
function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

let alienlist = [];
function alien(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0,canvas.width-48); 
        alienlist.push(this);
    };
    this.update = function(){
        this.y += 2; //적군의 속도 조절

        if(this.y >= canvas.height-48){
            gameOver = true;
            console.log("gameOver");
        }
    }
}


//이미지 불러오기
function loadImage(){
    backgroundImg = new Image();
    backgroundImg.src = "img/game_bg.gif";

    spaceshipImg = new Image();
    spaceshipImg.src = "img/spaceship.png";
    
    bulletImg = new Image();
    bulletImg.src = "img/bullet.png";
    
    alienImg = new Image();
    alienImg.src = "img/alien.png";
    
    gameOverImg = new Image();
    gameOverImg.src = "img/gameOver.png";
}

//방향키를 누르면
let ketsDown={}
function setUpKeyboard(){
    document.addEventListener("keydown",(e)=>{
        ketsDown[e.keyCode] = true;
    });
    document.addEventListener("keyup",(e)=>{
        delete ketsDown[e.keyCode];
        
        if(e.keyCode == 32){
            createBullet(); //총알생성
        }
    })
}

//총알 새로 만들기
function createBullet(){
    let newbullet = new Bullet();
    newbullet.init();
    console.log("새로운 총알 리스트", bulletlist);
}

//외계인 새로 만들기
function createAlien(){
    const interval = setInterval(function(){
        let newA = new alien();
        newA.init();
    }, 1000)
}

// 정보 업데이트
function update(){
    if(39 in ketsDown){
        spaceshipX += 3; //우주선 속도
    } //right
    if(37 in ketsDown){
        spaceshipX -= 3; 
    } //left

    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-60){
        spaceshipX = canvas.width-60;
    }

    //총알의 y좌표 업데이트하는 함수 호풀
    for(let i=0; i<bulletlist.length; i++){
        if(bulletlist[i].alive){
            bulletlist[i].update();
            bulletlist[i].checkHit();
        }
    }

    for(let i=0; i<alienlist.length; i++){
        alienlist[i].update();
    }

}

function render(){
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY);
    ctx.fillText(`score : ${score}`, 20, 30);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial"

    for(let i=0; i<bulletlist.length; i++){
        if(bulletlist[i].alive){
            ctx.drawImage(bulletImg, bulletlist[i].x, bulletlist[i].y);
        }
    }

    for(let i=0; i<alienlist.length; i++){
        ctx.drawImage(alienImg, alienlist[i].x, alienlist[i].y);
    }
}

function main(){ 
    if(!gameOver){
        update(); //죄표값 업데이트
        render(); 
        requestAnimationFrame(main);
    } else{
        ctx.drawImage(gameOverImg, 2, 100, 380, 380);
    }

}

//만들어준 함수 불러오기
loadImage();
setUpKeyboard();
createAlien();
main();


