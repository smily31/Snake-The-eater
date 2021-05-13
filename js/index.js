// Gaming constant and variables 
let inputDir = {x:0,y:0};
const foodSound = new Audio('../sounds/food.mp3');
const moveSound = new Audio('../sounds/move.mp3');
const musicSound = new Audio('../sounds/music.mp3');
const gameoverSound = new Audio('../sounds/gameover.mp3');
let speed = 12;
let lastPaintTime = 0;
let score = 0;  //stores current score 
let snakeArr = [{x: 13,y: 15}];    // starting head location
let food = {x: 6, y: 7};

// Gaming Functions

//1
function main (ctime)
{
    window.requestAnimationFrame(main);
    // console.log(ctime);
    if((ctime-lastPaintTime)/1000 < 1/speed)
    {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

//2
//collide checking function
function isCollide(snake)
{
    // if snake bump into itself
    for(let i = 1; i<snakeArr.length; i++)
    {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y)
        {
            return true;
        }
    }
    // if snake collide with board wall
    if(snake[0].x >=18 || snake[0].x<0 || snake[0].y >=18 || snake[0].y<0)
    {
        return true;
    } 
    return false;
}

//3
function gameEngine()
{
    // Part 1 : Updating the snake array and food 

    //if the snake collide with wall then gameover and show alert then if user says ok then again start game
    if(isCollide(snakeArr))
    {
        gameoverSound.play();
        musicSound.pause();
        inputDir ={x:0,y:0}; // original 
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x:13,y:15}];  //snake ko wapas starting position pe 
        musicSound.play();
        score=0;
    }

    //if snake has eaten the food then increment the current score and regenerate the food
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y)
    {
        foodSound.play();
        score += 1;
        //hiscore section
        if(score > hiscoreval)
        {
            hiscoreval=score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML="HiScore : "+hiscoreval; // ye to game khelte samay print hoga
        }
        scoreBox.innerHTML = "Score :"+score;
        snakeArr.unshift({x: snakeArr[0].x+inputDir.x , y: snakeArr[0].y+inputDir.y});  // learn about unshift -> this will insert new element at the start of the array 

        // food ko to randomly position denge 
        // lenient game rkhne ke liye 2 to 16 ke beech generate krenge coordinates waise 0to 17 kr skte h apne case me
        let a =2;
        let b =16;
        food = { x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random()) }
    }

    // moving the snake 

    //first approach is starting from second last element of snake array till 0 and then shifting previous element with its
    for(let i = snakeArr.length-2 ; i>=0; i--)
    {
        snakeArr[i+1] = {...snakeArr[i]};   // direct initialise nhi kr skte , isko destructure krke ek object bana ke krna hoga so this the way and i dont know much about this 
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2 : Display the snake and food 

    // display the snake 
    board.innerHTML ="";   // jb bhi updated snake display krenge tb hme pichla kuch display nhi chahiye
    snakeArr.forEach((e,index)=>{
        snakeElement = document.createElement('div');  //sanke bana rhe update krke
        snakeElement.style.gridRowStart = e.y;  // us div ko location de rhe here->row
        snakeElement.style.gridColumnStart = e.x;  // here column
        if(index === 0)
        {
            snakeElement.classList.add('head');  
        }
        else{
            snakeElement.classList.add('snakebody');  // adding class so that we can see it through styles
        }
        board.appendChild(snakeElement);   // finally adding the snake element to board
    });

    // display the food 
    foodElement = document.createElement('div');  //food bana rhe 
    foodElement.style.gridRowStart = food.y;  // us div ko location de rhe here->row
    foodElement.style.gridColumnStart = food.x;  // here column
    foodElement.classList.add('food');  // adding class so that we can see it through styles
    board.appendChild(foodElement);   // finally adding the food element to board
}


//Main game logic starts here
musicSound.play();

// we will store hi-score in our local storage 
// isme hme json wgrh use krna hoga 
let hiscore = localStorage.getItem("hiscore");  // ye jo hiscore variable hai wo local storage ka variable hai 
if(hiscore === null)
{
    hiscoreval = 0;  // ek variable h jisse hm localstorage me value assign krenge 
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore : "+hiscore;     // ye jab bhi new game start hoga tb hiscore show krega acc to previous game 
}


window.requestAnimationFrame(main);
window.addEventListener('keydown', e=>{
inputDir = {x:0,y:1}     // Start the game -> ye encounter hote hi x=0 y 1 se increase ho rha to ye niche ki taraf badhte jayega 
// notice krna ye cheez starting me qki jo board ka origin hai wo top left me hota h in js.
moveSound.play();
switch (e.key) {
    case "ArrowUp":
        inputDir.x = 0; 
        inputDir.y = -1;
        break;
    case "ArrowDown":
        inputDir.x = 0;
        inputDir.y = 1;
        break;
    case "ArrowLeft":
        inputDir.x = -1;
        inputDir.y = 0;
        break;
    case "ArrowRight":
        inputDir.x = 1;
        inputDir.y = 0;
        break;
                    
        default:
            break;
        }
    });
    
    