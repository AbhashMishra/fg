var PLAY = 1;
var END = 0;
var gameState = PLAY;
var background4;
var round;
var planet;
var mount3;
var c;
var g;
var points;

var rocket;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstacle

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

var planetland,PT;

var iconsImg;

function preload(){
  mount3 = loadImage("planet.png");
  round = loadImage("GROUND.png");
  background4 = loadImage("th.png");
  rocket = loadImage("spaceship.png");

  obstacle = loadImage("planet2.png");
  
  restartImg = loadImage("reset.png");
  gameOverImg = loadImage("gameover2.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
  planetland = loadImage("land.png");
  
  PT = loadImage("planet4.png");
  
  c = loadImage("d.png");
  
  g = loadImage("t.png");
  
  iconsImg = loadImage("icon.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  //BG2 = createSprite(width/2,height-590,width,125);
  //BG2.addImage(planetland);
  //BG2.scale = 4.5;
  //BG2.visible = false;
   
  BG = createSprite(width/2,height-380);
  BG.addImage(background4);
  BG.scale = 5;
  BG.velocityX = -5;
  BG.x = width/2;
  BG.visible = true;

  var message = "This is a message";
  console.log(message)
  
  rocket1 = createSprite(100,200,width,50);
  rocket1.addImage(rocket);
  rocket1.visible = true;
  

  rocket1.scale = 0.3;
  
  ground = createSprite(width/2,1400,width,125);
  ground.scale = 4.5;
  ground.addImage(round);
  ground.x = width/2;
  ground.visible = true;
  
  gameOver = createSprite(130,height-285);
  //320
  gameOver.scale = 0.3;
  gameOver.addImage(gameOverImg);
  gameOver.visible = true;
  
  restart = createSprite(122,height-220);
  restart.scale = 0.7;
  restart.addImage(restartImg); 
  restart.visible = true;
  
  invisibleGround = createSprite(width/2,height-13,width,510);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups            
  aliensGroup = createGroup();
  MTGroup = createGroup();
  helmetGroup = createGroup();
  //PT2Group = createGroup();
  
  f = createSprite(125,height-387,width,50);
  f.addImage(c);
  f.scale = 0.9;
  
  icons1 = createSprite(25,height-35,width,50);
  icons1.addImage(iconsImg);
  icons1.scale = 0.8;
 
  rocket1.setCollider("rectangle",0,0,rocket1.width,rocket1.height);
  //trex.debug = true
  
  score = 0;
  points = 0;

}

function draw() {  
  background(180);  
  if (BG.x < 0){
      BG.x = BG.width/2;
  }
  
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3 * score/100);
    
    score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score % 100 === 0){
       checkPointSound.play();
    }
    
    //scoring
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("space")) && rocket1.y >= height-420) {
        rocket1.velocityY = -12; 
        jumpSound.play();
        touches = [];
    }
    
    //add gravity
    rocket1.velocityY = rocket1.velocityY + 0.8;
  
    //spawn obstacles on the ground
    spawnAlien();
    Mount();
    spawnSP();
    //spawnPT2();
    
    if(aliensGroup.isTouching(rocket1)||MTGroup.isTouching(rocket1)){
        //trex.velocityY = -12;    
        jumpSound.play();
        gameState = END;
        dieSound.play();
      
    }
    
    if(helmetGroup.isTouching(rocket1)) {
       helmetGroup.destroyEach();
       points = points + 1;
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
          
      ground.velocityX = 0;
      rocket1.velocityY = 0;
      
     
      //set lifetime of the game objects so that they are never destroyed
      aliensGroup.setLifetimeEach(-1);
      MTGroup.setLifetimeEach(-1);
      helmetGroup.setLifetimeEach(-1);
      BG.lifeTime = -1;
     
      aliensGroup.setVelocityXEach(0);
      MTGroup.setVelocityXEach(0);
      helmetGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart)) {
        reset();
     }
   }
  
 
  //stop trex from falling down
  rocket1.collide(invisibleGround);
  drawSprites();
  //plan = createSprite(350,200);
  //plan.scale = 0.2;
  //plan.addImage(planet);
  //displaying score

  
  fill("white");
  textSize(8);
  text("T H E   I N F I N I T E   R O C K E T  I N  G A L A X Y",32,height-545);
  
  fill("white");
  stroke("white");
  strokeWeight(3);
  textSize(33);
  text("G  A  L  A  X  Y",15,height-560);

  textSize(30);
  fill("lightblue");
  strokeWeight(3);
  stroke("lightblue");
  text("S",50,height-25);
  fill("pink");
  strokeWeight(3);
  stroke("pink");
  text("C",72,height-25);
  fill("yellow");
  strokeWeight(3);
  stroke("yellow");
  text("O",97,height-25);
  fill("lightgreen");
  strokeWeight(3);
  stroke("lightgreen");
  text("R",122,height-25);
  fill("orange");
  strokeWeight(3);
  stroke("orange");
  text("E",147,height-25);
  fill("white");
  strokeWeight(3);
  stroke("white");
  text("     :  "+ score,140,height-25);
  
  
  textSize(20);
  strokeWeight(0);
  stroke(0);
  text("   "+ points,125,height-390);
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  aliensGroup.destroyEach();
  MTGroup.destroyEach();
  helmetGroup.destroyEach();
  rocket1.changeAnimation(rocket);
  score = 0;
  points = 0;
}

function Mount(){
 if (frameCount % 120 === 0){
   var MT = createSprite(1900,height-295,width,125);
   MT.addImage(mount3);
   MT.velocityX = -(6 + score/100);
   MT.scale = 0.3;
   MT.setCollider("circle",1,7,120);
   MT.debug = false;
   MT.visible = true;
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
   
    rocket1.depth = MT.depth + 1;
   
    //assign scale and lifetime to the obstacle           
    MT.scale = 0.6;
    MT.lifetime = 800;
   
   //add each obstacle to the group
    MTGroup.add(MT);
 }
}

function spawnAlien(){
 if (frameCount % 350 === 0){
   var alien = createSprite(1900,height-295,width,125);
   alien.addImage(obstacle);
   alien.velocityX = -(6 + score/100);
   alien.setCollider("circle",1,7,298);
   alien.debug = false;
   alien.visible = true;
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
   
    rocket1.depth = alien.depth + 1;
   
    //assign scale and lifetime to the obstacle
    alien.scale = 0.2;
    alien.lifetime = 800;
   
   //add each obstacle to the group
    aliensGroup.add(alien);
 }
}
function spawnSP() {
  if(frameCount % 500 === 0) {           
    helmet = createSprite(1900,height-340,width,50); 
    helmet.addImage(g);
    helmet.velocityX = -(6 + score/100);
    helmet.scale = 1.5;
    helmet.lifetime = 800;
    
    var rand = Math.round(random(1,4));
    
    helmetGroup.add(helmet);
  }
}
//function spawnPT2() {
  //if (frameCount % 100 === 0){
    //var PT2 = createSprite(1900,height-400,width,125);
    //PT2.addImage(PT);
    //PT2.velocityX = -(6 + score/100);
    //PT2.scale = 0.2;
    //PT2.lifetime = 800;
    //PT2.visible = true;
    //PT2Group.add(PT2);
  //}
//}