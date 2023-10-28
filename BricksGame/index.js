const grid = document.querySelector('.grid') 
const scoreDisplay = document.querySelector('#score')
const btn = document.querySelector('.btn')
const startAudio = document.getElementById('startAudio');
const gameOver = document.getElementById('gameOverAudio')



const blockWidth = 100
const blockHeight = 20
const bordWidth = 560
const bordHeight = 300
const userStart = [230, 10]
let CurrentPosition = userStart;

const ballStart = [270,40]
let ballCurrentPos = ballStart
let timerID
let ballDiameter = 20
let xDirection = -2
let yDirection = 2
let score = 0;
let isGameRunning = false

// start or pause button EventListener
btn.addEventListener("click", startOrPauseGame)
 // Function to start or pause the game
function startOrPauseGame(){
     // Play the start audio
     startAudio.play();
     
    if(!isGameRunning){
        // start the game 
timerID = setInterval(moveBall, 30) // the speed of the game
document.addEventListener('keydown', moveUser)
isGameRunning = true
    }else{
        // pause the game
        
        clearInterval(timerID)
        document.removeEventListener('keydown',moveUser)
        isGameRunning = false
    }
}

btn.innerHTML = "Start"
btn.addEventListener('click', function(){
    if(!isGameRunning){
        btn.innerHTML='Pause'
        btn.style.backgroundColor='grey'
    }else{
        btn.innerHTML='Resume'
        btn.style.backgroundColor='green'
    }
})


// Array of colors
const blockColors = ["red","blue","purple","white","violet","orange","turkis","yellow"]


// create a class of blocks
class Block {
    constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis,yAxis]  
    this.bottomRight = [xAxis + blockWidth,yAxis]
    this.topLeft = [xAxis,yAxis +blockHeight]
    this.topRight = [xAxis +blockWidth, yAxis +blockHeight]
    // Randomly color
    this.color = blockColors[Math.floor((Math.random() *blockColors.length) )]

    }
}
// create blocks
const blocks = [
    new Block(10,270), new Block(120,270),
    new Block(230,270), new Block(360,270),
    new Block(450,270),new Block(10,240),
    new Block(160,240), new Block(130,240),
    new Block(450,240), new Block(340,240),
    new Block(10,210), new Block(160,210),
    new Block(280,210), new Block(230,270),
    new Block(300,210), new Block(350,270),
    new Block(350,180), new Block(150,180),
    new Block(40,180), new Block(150,180),
]


// draw all the blocks
function addBlocks(){
    for (let i = 0; i < blocks.length;i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left  = blocks[i].bottomLeft[0] +'px' 
    block.style.bottom = blocks[i].bottomLeft[1]+'px'
    block.style.backgroundColor = blocks[i].color;    
    grid.appendChild(block)
}
    
}
addBlocks()
 // add user
const user = document.createElement('user')
user.classList.add('user')
drawUser()
grid.appendChild(user)

// Draw the user 
function drawUser(){
    user.style.left = CurrentPosition[0]+ 'px'
    user.style.bottom = CurrentPosition[1]+ 'px'
}
// Draw ball
function drawBall(){
 ball.style.left = ballCurrentPos[0]+'px'
ball.style.bottom = ballCurrentPos[1]+'px'
}

// move user

function moveUser(e){
    switch(e.key){
        case 'ArrowLeft':
            if(CurrentPosition[0] > 0){
                CurrentPosition[0] -=10
                drawUser()
            }
        
        break;
        case 'ArrowRight':
            if(CurrentPosition[0] < bordWidth - blockWidth){
                CurrentPosition[0] +=10
                drawUser()
            }
            break;
    }
}



// add ball

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

// move the ball

function moveBall(){
    ballCurrentPos[0] +=xDirection
    ballCurrentPos[1] +=yDirection
    drawBall()
    checkForCollisions()
}

// check for collisions
function checkForCollisions(){

for(let i =0; i<blocks.length;i++){
   if (
    (ballCurrentPos[0] > blocks[i].bottomLeft[0] && ballCurrentPos[0] < blocks[i].bottomRight[0])
   &&  ((ballCurrentPos[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPos[1] <
   blocks[i].topLeft[1])
    ){
      const allBlocks = Array.from(document.querySelectorAll('.block')) 
      allBlocks[i].classList.remove('block')
      blocks.splice(i,1)
      changeDirection()
      score++
      scoreDisplay.innerHTML = score

      // check for win
      if(blocks.length === 0){
        scoreDisplay.innerHTML='YOU WIN!'
        scoreDisplay.style.color='green'
        scoreDisplay.style.fontSize = '30px'
        scoreDisplay.style.backgroundColor='grey'
        clearInterval(timerID)
        document.removeEventListener('keydown',moveUser)
      }
    }
}

// check for collisions
if(ballCurrentPos[0] >= (bordWidth - ballDiameter) ||
 ballCurrentPos[1] >= (bordHeight - ballDiameter) ||
 ballCurrentPos[0]  <= 0 )
 {
    changeDirection()
}

// check for user collision
if(
    (ballCurrentPos[0] > CurrentPosition[0] && ballCurrentPos[0] < CurrentPosition[0]+ 
    blockWidth) && (ballCurrentPos[1] > CurrentPosition[1]
        && ballCurrentPos[1] < CurrentPosition[1] + blockHeight )                 
){
    changeDirection()
}

// check for gameover
if(ballCurrentPos[1] <= 0){
    gameOver.play()
    clearInterval(timerID)
    // stop the start audio
    startAudio.pause()
    startAudio.src ='';
    
    scoreDisplay.innerHTML='You Lose'
    scoreDisplay.style.color='red';
    scoreDisplay.style.fontSize = '30px'
    document.removeEventListener('keydown',moveUser)
}
}

// change direction of the ball
function changeDirection(){
 if(xDirection === 2 && yDirection === 2){
    yDirection = -2
    return
 }
 if(xDirection === 2 && yDirection === -2){
    xDirection = -2
    return
 }
 if(xDirection === -2 && yDirection === -2){
    yDirection = 2
    return
 }
 if(xDirection === -2 && yDirection === 2){
    xDirection = 2 
    return
 }
}

