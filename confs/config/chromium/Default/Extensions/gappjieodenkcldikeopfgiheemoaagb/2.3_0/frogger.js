window.onload = start;
var canvas;
var ctx;
var interval;
var int;
var coins=0;
var lives=1;
var r1=Math.floor(Math.random()*255);
var r2=Math.floor(Math.random()*255);
var r3=Math.floor(Math.random()*255);
var g1=Math.floor(Math.random()*255);
var g2=Math.floor(Math.random()*255);
var g3=Math.floor(Math.random()*255);
var b1=Math.floor(Math.random()*255);
var b2=Math.floor(Math.random()*255);
var b3=Math.floor(Math.random()*255);
var yellow = false;
var yellow2=false;
var yellow3=false;
var yellow4=false;
var yellow5=false;
var yellow6=false;
var yellow7=false;
var yellow8=false;
var yellow9=false;
var yellow10=false;
var enter = false;
var back=false;
var coinInc=1;
var ka;
var skinNumber;
chrome.storage.local.get('skinnum', function(data){
    skinNumber=data.skinnum;
   });
var x1;
var y1;
var x;
var y;
var car;
var score=0;
var setStore=false;
var highscore;
chrome.storage.local.get('high', function(data){
    highscore=data.high;
   });
var totalCoins;
chrome.storage.local.get('coins', function(data){
    totalCoins=data.coins;
   });
var skin2;
chrome.storage.local.get('skin2', function(data){
    skin2=data.skin2;
   });
var skin3;
chrome.storage.local.get('skin3', function(data){
    skin3=data.skin3;
   });
var skin4;
chrome.storage.local.get('skin4', function(data){
    skin4=data.skin4;
   });
var xp = 285;
var yp = 470;
var up=false;
var left=false;
var right=false;
var down=false;
var speed = 45;
var cars = [];
var spot=0;
var ts=0;
var win=false;
var slow=false;
for(var i =0; i<6; i++)
  cars[i] = {x:0, y:0, s:0, r:Math.floor(Math.random()*255), g:Math.floor(Math.random()*255), b:Math.floor(Math.random()*255), convert: Math.floor(Math.random()*3+1)};
function start()
{
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  document.addEventListener("keyup", keyUpHandler,false);
  document.addEventListener("mouseup", mouseUpHandler,false);
  document.addEventListener("mousemove",mouseMoveHandler,false);
  car = new Audio();
  car.src = "carhit.mp3";
  ka=new Audio();
  ka.src="classiccoin.wav";
  for(var i = 0; i<6; i++)
  {
      var r = Math.random()*3+1;
      cars[i].s = r;
  }
  cars[0].y= 35;
  cars[1].y= 95;
  cars[2].y= 195;
  cars[3].y= 255;
  cars[4].y= 355;
  cars[5].y= 415;
  interval = setInterval(setTitle, 10);
  setTitle();
}
function setTitle()
{
   if(skinNumber==null)
   {
       skinNumber=1;
   }
  ctx.beginPath();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  drawRoads();
  makeCars0();
  makeCars1();
  makeCars2();
  makeCars3();
  makeCars4();
  makeCars5();
  makeWind();
  makeHeadlights();
  makeTaillights();
  makeMirrors();
  print();
  drawPlayer(xp,yp,skinNumber);
  drawPlayer2(xp,yp,skinNumber);
  drawPlayer3(xp,yp,skinNumber);
  drawPlayer4(xp,yp,skinNumber);
  for(var i =1; i<6; i=i+2)
  {
      cars[i].x+=cars[i].s;
      if(cars[i].x>canvas.width)
          cars[i].x=-80;
  }
  for(var i = 0; i<5; i=i+2)
  {
      cars[i].x-=cars[i].s;
      if(cars[i].x<-80)
          cars[i].x=canvas.width;
  } 
  ctx.font = "100px Impact";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Jump!",180,230);
  ctx.font = "20px Comic Sans MS";
  ctx.fillText("Adam Janicki", 235, 278)
  if(yellow2==true)
        drawEllipse(300,418+25,85,35);
  if(yellow==true)
        drawEllipse(300,380,85,35);
  makeStart();
  makeStoreButton();
  ctx.closePath();
  ctx.fillStyle = "#000000";
 ctx.font = "58px Impact";
 ctx.fillText("Start", 242, 403);
 ctx.fillText("Store", 235, 466);
 if(enter==true)
 {
    if(totalCoins==null)
    {
        totalCoins=0;
    }
    if(skin2==null)
    {
        skin2=0;
        chrome.storage.local.set({'skin2': skin2}, function(){
     });
    }
    if(skin3==null)
    {
        skin3=0;
        chrome.storage.local.set({'skin3': skin3}, function(){
     });
    }
    if(skin4==null)
    {
        skin4=0;
        chrome.storage.local.set({'skin4': skin4}, function(){
     });
    }
     ctx.clearRect(0,0,canvas.width,canvas.height);
     clearInterval(interval);
     int = setInterval(time, 100);
     interval = setInterval(play,20);
     play();
 }
 if(setStore==true)
 {
    if(skin2==null)
    {
        skin2=0;
        chrome.storage.local.set({'skin2': skin2}, function(){
     });
    }
    if(skin3==null)
    {
        skin3=0;
        chrome.storage.local.set({'skin3': skin3}, function(){
     });
    }
    if(skin4==null)
    {
        skin4=0;
        chrome.storage.local.set({'skin4': skin4}, function(){
     });
    }
     clearInterval(interval);
     interval=setInterval(makeStore,10);
 }
}
function drawBlack()
{
   ctx.fillStyle = "#000000";
   ctx.rect(190,30,220,100);
   ctx.rect(10,0,580,29)
   ctx.fill();
}
function drawSkin1()
{
   ctx.beginPath();
   if(skinNumber==1)
      ctx.fillStyle="rgb(0,250,250)";
  else if(skinNumber!=1)
      ctx.fillStyle="rgb(255,255,255)";
    ctx.ellipse(100,275,75,25,0,0,2*Math.PI,false);
  ctx.fill();
  ctx.closePath();
}
function drawSkin2()
{
   ctx.beginPath();
   if(skinNumber==2)
      ctx.fillStyle="rgb(0,250,250)";
  else if(skinNumber!=2)
      ctx.fillStyle="rgb(255,255,255)";
   ctx.ellipse(300,275,75,25,0,0,2*Math.PI,false);
  ctx.fill();
  ctx.closePath();
}
function drawSkin3()
{
   ctx.beginPath();
   if(skinNumber==3)
      ctx.fillStyle="rgb(0,250,250)";
  else if(skinNumber!=3)
      ctx.fillStyle="rgb(255,255,255)";
      ctx.ellipse(100,425,75,25,0,0,2*Math.PI,false);
  ctx.fill();
  ctx.closePath();
}
function drawSkin4()
{
   ctx.beginPath();
   if(skinNumber==4)
      ctx.fillStyle="rgb(0,250,250)";
  else if(skinNumber!=4)
      ctx.fillStyle="rgb(255,255,255)";
   ctx.ellipse(300,425,75,25,0,0,2*Math.PI,false);
  ctx.fill();
  ctx.closePath();
}
function drawSkin5()
{
   ctx.beginPath();
      ctx.fillStyle="#ffffff";
    if(coinInc==2)
      ctx.fillStyle="#FFD700";
   ctx.ellipse(500,275,75,25,0,0,2*Math.PI,false);
  ctx.fill();
  ctx.closePath();
}
function drawSkin6()
{
   ctx.beginPath();
      ctx.fillStyle="#ffffff";
      if(slow==true)
        ctx.fillStyle="#FFD700";
   ctx.ellipse(500,425,75,25,0,0,2*Math.PI,false);
  ctx.fill();
  ctx.closePath();
}
function makeBack()
{
   ctx.beginPath();
      ctx.fillStyle = "#ffffff";
    ctx.ellipse(545,35,40,20,0,0,2*Math.PI,false);
   //ctx.rect(505,15, 80,40);
   ctx.fill();
}
function makeStore()
{
   ctx.beginPath();
   ctx.clearRect(0,0,canvas.width,canvas.height);
   drawBackground();
   drawRoads();
   if(yellow4==true)
        drawEllipse(100,275,85,35);
    if(yellow5==true)
        drawEllipse(300,275,85,35);
    if(yellow6==true)
        drawEllipse(100,425,85,35);
    if(yellow7==true)
        drawEllipse(300,425,85,35);
    if(yellow8==true)
        drawEllipse(545,35,48,28);
    if(yellow9==true)
        drawEllipse(500,275,85,35);
    if(yellow10==true)
        drawEllipse(500,425,85,35);
   drawSkin1();
   drawSkin2();
   drawSkin3();
   drawSkin4();
   drawSkin5();
   drawSkin6();
   makeBack();
   drawPlayer(85,200,1);
   drawPlayer2(85,200,1);
   drawPlayer3(85,200,1);
   drawPlayer4(85,200,1);
   drawPlayer(285,200,2);
   drawPlayer2(285,200,2);
   drawPlayer3(285,200,2);
   drawPlayer4(285,200,2);
   drawPlayer(85,350,6);
   drawPlayer2(85,350,6);
   drawPlayer3(85,350,6);
   drawPlayer4(85,350,6);
   drawPlayer(285,350,5);
   drawPlayer2(285,350,5);
   drawPlayer3(285,350,5);
   drawPlayer4(285,350,5);
   ctx.font = "100px Impact"
   ctx.fillStyle="#ffffff";
   ctx.fillText("Store",190,110);
   ctx.font = "30px Impact";
   if(totalCoins!=null)
       ctx.fillText("Coins: "+totalCoins,15,27);
   else if(totalCoins==null)
   {
       totalCoins=0;
       chrome.storage.local.set({'coins': totalCoins}, function(){
        });
       ctx.fillText("Coins: "+totalCoins,100,27);
   }
   ctx.font = "40px Impact";
   ctx.fillText("Skins",150,150);
   ctx.fillText("Power-Ups",410,150);
   ctx.fillText("Coins x2",430,230);
   ctx.fillText("Slow Cars",420,390);
   for(var i =1; i<6; i=i+2)
   {
       cars[i].x+=cars[i].s;
       if(cars[i].x>canvas.width)
           cars[i].x=-80;
   }
   for(var i = 0; i<5; i=i+2)
   {
       cars[i].x-=cars[i].s;
       if(cars[i].x<-80)
           cars[i].x=canvas.width;
   } 
   if(back==true)
   {
       x=0;
       y=0;
       setStore=false;
       back=false;
       clearInterval(interval);
       interval=setInterval(setTitle,10);
   }
   ctx.font = "30px Impact";
   ctx.fillStyle="#000000";
   ctx.fillText("Back",512,48);
   ctx.font = "30px Arial";
   ctx.fillText("?",291,376);
   ctx.fillText("?",91,376);
   ctx.font = "48px Impact";
   ctx.fillText("Select",35,292);
   ctx.fillText(" 35C",454,295);
   ctx.fillText(" 80C",454,445);
   if(skin2!=1)
   {
       ctx.fillText(" 200C",240,294);
       skin2=0;
       chrome.storage.local.set({'skin2': skin2}, function(){
    });
   }
   if(skin3!=1)
   {
       ctx.fillText(" 500C",40,444);
       skin3=0;
       chrome.storage.local.set({'skin3': skin3}, function(){
    });
   }
   if(skin4!=1)
   {
       ctx.fillText(" 400C",240,444);
       skin4=0;
       chrome.storage.local.set({'skin4': skin4}, function(){
    });
   }
    if(skin2==1)
       ctx.fillText("Select",235,292);
   if(skin3==1)
       ctx.fillText("Select",35,442);
   if(skin4==1)
       ctx.fillText("Select",235,442);
}
function makeStart()
{
   ctx.beginPath();
      ctx.fillStyle="rgb(255,255,255)";
    ctx.ellipse(300,418+25,80,30,0,0,2*Math.PI);
   //ctx.rect(225,418,150,50);
  ctx.fill();
  ctx.closePath();
}
function makeStoreButton()
{
   ctx.beginPath();
      ctx.fillStyle="rgb(255,255,255)";
    ctx.ellipse(300,380,80,30,0,0,2*Math.PI,false);
   //ctx.rect(225,355,150,50);
  ctx.fill();
  ctx.closePath();
}
function makeCars0()
{
  ctx.beginPath();
  ctx.rect(cars[0].x,cars[0].y,80,50);
  ctx.fillStyle = "rgb("+cars[0].r+","+cars[0].g+","+cars[0].b+")";
  ctx.fill();
}
function makeMirrors()
{
   ctx.beginPath();
   ctx.fillStyle = "#ffffff";
   for(var i = 0; i<5; i=i+2)
   {
       ctx.rect(cars[i].x+30, cars[i].y-3,4,6);
       ctx.rect(cars[i].x+30, cars[i].y+47,4,6);
   }
   for(var i = 1; i<6; i=i+2)
   {
       ctx.rect(cars[i].x+46, cars[i].y-3,4,6);
       ctx.rect(cars[i].x+46, cars[i].y+47,4,6);
   }
   ctx.fill();
}
function makeWind()
{
   ctx.beginPath();
   for(var i = 1; i<6;i=i+2)
   {
   if(cars[i].convert==3)
       ctx.rect(cars[i].x+40,cars[i].y+5,20,40)
   else
       ctx.rect(cars[i].x+20, cars[i].y+5,40,40)
   }
   for(var i = 0; i<5;i=i+2)
   {
   if(cars[i].convert==3)
       ctx.rect(cars[i].x+20,cars[i].y+5,20,40)
   else
       ctx.rect(cars[i].x+20, cars[i].y+5,40,40)
   }
   ctx.fillStyle = "#000000";
  ctx.fill();
}
function makeHeadlights()
{
   ctx.beginPath();
   ctx.fillStyle = "#ffff00";
   for(var i = 0; i<5; i=i+2)
   {
       ctx.rect(cars[i].x, cars[i].y,4,6);
       ctx.rect(cars[i].x, cars[i].y+44,4,6);
   }
   for(var i = 1; i<6; i=i+2)
   {
       ctx.rect(cars[i].x+76, cars[i].y,4,6);
       ctx.rect(cars[i].x+76, cars[i].y+44,4,6);
   }
   ctx.fill();
}
function makeTaillights()
{
   ctx.beginPath();
   ctx.fillStyle = "#ff0000";
   for(var i = 1; i<6; i=i+2)
   {
       ctx.rect(cars[i].x, cars[i].y,4,6);
       ctx.rect(cars[i].x, cars[i].y+44,4,6);
   }
   for(var i = 0; i<5; i=i+2)
   {
       ctx.rect(cars[i].x+76, cars[i].y,4,6);
       ctx.rect(cars[i].x+76, cars[i].y+44,4,6);
   }
   ctx.fill();
}
function makeCars1()
{
  ctx.beginPath();
  ctx.rect(cars[1].x,cars[1].y,80,50);
  ctx.fillStyle = "rgb("+cars[1].r+","+cars[1].g+","+cars[1].b+")";
  ctx.fill();
}
function makeCars2()
{
  ctx.beginPath();
  ctx.rect(cars[2].x,cars[2].y,80,50);
  ctx.fillStyle = "rgb("+cars[2].r+","+cars[2].g+","+cars[2].b+")";
  ctx.fill();
}
function makeCars3()
{
  ctx.beginPath();
  ctx.rect(cars[3].x,cars[3].y,80,50);
  ctx.fillStyle = "rgb("+cars[3].r+","+cars[3].g+","+cars[3].b+")";
  ctx.fill();
}
function makeCars4()
{
  ctx.beginPath();
  ctx.rect(cars[4].x,cars[4].y,80,50);
  ctx.fillStyle = "rgb("+cars[4].r+","+cars[4].g+","+cars[4].b+")";
  ctx.fill();
}
function makeCars5()
{
  ctx.beginPath();
  ctx.rect(cars[5].x,cars[5].y,80,50);
  ctx.fillStyle = "rgb("+cars[5].r+","+cars[5].g+","+cars[5].b+")";
  ctx.fill();
}
function play()
{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  drawRoads();
  makeCars0();
  makeCars1();
  makeCars2();
  makeCars3();
  makeCars4();
  makeCars5();
  makeWind();
  makeTaillights();
  makeHeadlights();
  makeMirrors();
  print();
  drawPlayer(xp,yp,skinNumber);
  drawPlayer2(xp,yp,skinNumber);
  drawPlayer3(xp,yp,skinNumber);
  drawPlayer4(xp,yp,skinNumber);
  collisionDetection();
  if(left==true && xp-speed>=0)
  {   xp-=speed;
      ts=0;
      left=false;
  }
  if(right==true && xp+speed+30<=canvas.width)
   {
      xp+=speed;
      ts=0;
      right=false;
   }
  if(up==true && yp>=0 && win==false)
   { 
      if(spot==0)
          yp-=42;
      if(spot==1)
          yp-=60;
      if(spot==2)
          yp-=52;
      if(spot==3)
          yp-=48;
      if(spot==4)
          yp-=60;
      if(spot==5)
          yp-=52;
      if(spot==6)
          yp-=52;
      if(spot==7)
          yp-=56;
      if(spot==8)
          yp-=50;
    
      ts=0;
      up=false;
      spot++;
      score++;
   }
   if(down==true && yp+30<=canvas.height)
   { 
      if(spot==1)
          yp+=42;
      if(spot==2)
          yp+=60;
      if(spot==3)
          yp+=52;
      if(spot==4)
          yp+=48;
      if(spot==5)
          yp+=60;
      if(spot==6)
          yp+=52;
      if(spot==7)
          yp+=52;
      if(spot==8)
          yp+=56;
       ts=0;
      down=false;
      spot--;
      score--;
   }

  for(var i =1; i<6; i=i+2)
  {
      cars[i].x+=cars[i].s;
      if(cars[i].x>canvas.width)
          cars[i].x=-80;
  }
  for(var i = 0; i<5; i=i+2)
  {
      cars[i].x-=cars[i].s;
      if(cars[i].x<-80)
          cars[i].x=canvas.width;
  } 
  if(yp+30<=30)
      resetLevel();
}
function time()
{
  ts++;
}
function collisionDetection()
{
  for(var i = 0; i<6; i++)
  {
      var x = cars[i].x;
      var y =cars[i].y;
      if(xp+30>=x && xp<=x+80 && yp+30>=y && yp<y+50)
      {
       if(highscore==null)
       {
        chrome.storage.local.set({'high': score}, function(){
        });
       }
       else if(score>highscore)
       {
        chrome.storage.local.set({'high': score}, function(){
        });
       } 
           var tempCoins=parseInt(totalCoins,10);
           tempCoins+=coins*coinInc;
           chrome.storage.local.set({'coins': tempCoins}, function(){
        });
          win=true;
          car.play();
          clearInterval(interval);
          yp=470;
          interval=setInterval(setWin,20);
         setWin();
      }
  }
}
function resetLevel()
{
    if(score<100)
        coins++;
    else if(score>100)
        coins+=2;
  yp=470;
  xp=285;
  spot=0;
  for(var i = 0; i<6; i++)
  {
      if(slow==false)
      {
        var r =2*(Math.random());
        cars[i].s+=r;
      }
      else if(slow==true)
      {
        var r =(Math.random());
        cars[i].s+=r;
      }
  }
}
function setWin()
{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  drawBackground();
  drawRoads();
  makeCars0();
  makeCars1();
  makeCars2();
  makeCars3();
  makeCars4();
  makeCars5();
  makeWind();
  makeHeadlights();
  makeTaillights();
  makeMirrors();
  print();
  for(var i =1; i<6; i=i+2)
  {
      cars[i].x+=cars[i].s;
      if(cars[i].x>canvas.width)
          cars[i].x=-80;
  }
  for(var i = 0; i<5; i=i+2)
  {
      cars[i].x-=cars[i].s;
      if(cars[i].x<-80)
          cars[i].x=canvas.width;
  }
ctx.font = "100px Impact";
ctx.fillStyle = "rgb(255,126,48)";
ctx.fillText("Game Over",90,130);
ctx.font = "50px Impact";
ctx.fillText("Score: "+score,230,236);
ctx.fillText("Coins: "+(coins*coinInc),234,300);
if(score>highscore)
   ctx.fillText("New Highscore!",160,400)
ctx.font = "20px Courier New";
if(yellow3==true)
     ctx.fillStyle = "#dbff4d";
 else if(yellow3==false)
     ctx.fillStyle = "#ffffff";
ctx.rect(255,460, 100,25);
ctx.fill();
ctx.fillStyle = "#000000";
ctx.fillText("Restart",260,480);
ctx.closePath();
}
function print()
{
  ctx.beginPath();
  ctx.fillStyle = "#000000";
  ctx.font = "20px Impact";
  ctx.fillText(""+score, 10, 25);
  if(enter==true)
    ctx.fillText("Coins: "+(coins*coinInc), 450, 25);
  if(highscore!=null)
      ctx.fillText("HI: "+highscore,542,25);
  else{
      highscore=0;
      ctx.fillText("HI: "+highscore,542,25);
  }
}
function drawBackground()
{
  ctx.beginPath();
  ctx.rect(0,0,canvas.width, 30);
  ctx.rect(0,canvas.height-30,canvas.width, 30);
  ctx.rect(0,160-10,canvas.width, 40);
  ctx.rect(0,320-10,canvas.width, 40);
  ctx.fillStyle = "rgb(20,230,60)";
  ctx.fill();
  ctx.closePath();
}
function drawRoads()
{
  var a = 5;
  ctx.beginPath();
  for(var i = 0; i<40; i++)
  {
      ctx.rect(a+(i*15),100-10,10,6);
      ctx.rect(a+(i*15),260-10,10,6);
      ctx.rect(a+(i*15),420-10,10,6);
  }
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fill();
  ctx.closePath();
}
function drawPlayer(xpos,ypos,num)
{
  ctx.beginPath();
  if(num<3)
       ctx.fillStyle = "#1a237e";
   else if(num==4 || num==3)
       ctx.fillStyle="rgb("+r3+","+g3+","+b3+")";
   else if(num==5)
       ctx.fillStyle="#ffffff";
    else if(num==6)
        ctx.fillStyle="#0000ff";
  ctx.rect(xpos, ypos, 8, 8);
  ctx.rect(xpos+22, ypos, 8, 8);
  ctx.rect(xpos+22, ypos+22, 8, 8);
  ctx.rect(xpos, ypos+22, 8, 8);
  ctx.fill();
  ctx.closePath();
}
function drawPlayer2(xpos,ypos,num)
{
   ctx.beginPath();
   if(num==1)
       ctx.fillStyle = "rgb(255,126,48)";
   else if(num==2)
       ctx.fillStyle = "#880E4F";
   else if(num==3)
        ctx.fillStyle="rgb("+r2+","+g2+","+b2+")";
   else if(num==4)
       ctx.fillStyle="rgb("+r2+","+g2+","+b2+")";
   else if(num==5)
       ctx.fillStyle="#ffffff";
    else if(num==6)
       ctx.fillStyle="#ff0000";
  ctx.rect(xpos+4, ypos+4, 22, 22);
  ctx.fill();
  ctx.closePath();
}
function drawPlayer3(xpos,ypos,num)
{
   ctx.beginPath();
   ctx.fillStyle = "#000000";
   if(num==5)
       ctx.fillStyle="#ffffff";
    else if(num==6)
       ctx.fillStyle="#ff0000";
   ctx.rect(xpos+5, ypos+5, 3, 3);
   ctx.rect(xpos+22, ypos+5, 3, 3);
  ctx.fill();
  ctx.closePath();
}
function drawPlayer4(xpos,ypos,num)
{
   ctx.beginPath();
   if(num==1)
       ctx.fillStyle = "#4CAF50";
   else if(num==2)
       ctx.fillStyle = "#5E35B1";
   else if(num==4||num==3)
       ctx.fillStyle = "rgb("+r1+","+g1+","+b1+")";
   else if(num==5)
       ctx.fillStyle="#ffffff";
    else if(num==6)
       ctx.fillStyle="#00ff00";
   ctx.rect(xpos+8, ypos+2, 14, 2);
   ctx.rect(xpos+8, ypos+26, 14, 2);
   ctx.rect(xpos+2, ypos+8, 2, 14);
   ctx.rect(xpos+26, ypos+8, 2, 14);
  ctx.fill();
  ctx.closePath();
}
function drawEllipse(xpos,ypos,xsize,ysize)
{
    ctx.beginPath();
    ctx.fillStyle="#9400D3";
    ctx.ellipse(xpos,ypos,xsize,ysize,0,0,2*Math.PI,false);
    ctx.fill();
}
function mouseMoveHandler(e)
{
  x1 = e.clientX-canvas.offsetLeft;
  y1 = e.clientY-canvas.offsetTop;
  if(x1>=225 && x1<=375 && y1>=355 && y1<=405)
  {
      yellow=true;
  }
  if((x1<=225 || x1>=375) || (y1<=355 || y1>=405) && yellow == true)
 {
     yellow=false;
 }
 if(x1>=255 && x1<=355 && y1>=460 && y1<485 && win==true)
{
    yellow3 = true;
}
if((x1<=255 || x1>=355 || y1<=460 || y1>485) && win==true)
{
    yellow3 = false;
}
if(x1>=225 && x1<=375 && y1>=418 && y1<=468)
  {
      yellow2=true;
  }
  if((x1<=225 || x1>=375) || (y1<=418 || y1>=468) && yellow2 == true)
 {
     yellow2=false;
 }
 if(x1>=25 && x1<=175 && y1>=250 && y1<=300)
   yellow4=true;
if(x1<=25 || x1>=175 || y1<=250 || y1>=300)
   yellow4=false;
if(x1>=225 && x1<=375 && y1>=250 && y1<=300)
   yellow5=true;
if(x1<=225 || x1>=375 || y1<=250 || y1>=300)
   yellow5=false;
if(x1>=25 && x1<=175 && y1>=400 && y1<=450)
   yellow6=true;
if(x1<=25 || x1>=175 || y1<=400 || y1>=450)
   yellow6=false;
if(x1>=225 && x1<=375 && y1>=400 && y1<=450)
   yellow7=true;
if(x1<=225 || x1>=375 || y1<=400 || y1>=450)
   yellow7=false;
if(x1>=425 && x1<=575 && y1>=250 && y1<=300)
   yellow9=true;
if(x1<=425 || x1>=575 || y1<=250 || y1>=300)
   yellow9=false;
if(x1>=425 && x1<=575 && y1>=400 && y1<450)
   yellow10=true;
if(x1<=425 || x1>=575 || y1<=400 || y1>=450)
   yellow10=false;
 if(x1>=505 && x1<=585 && y1>=15 && y1<=55)
       yellow8=true;
if(x1<=505 || x1>=585 || y1<=15 || y1>=55)
       yellow8=false;
}
function mouseUpHandler(e)
{
  x = e.clientX-canvas.offsetLeft;
  y=e.clientY-canvas.offsetTop;
  if(x>=225 && x<=375 && y>=355 && y<=405)
     enter=true;
   if(x>=225 && x<=375 && y>=418 && y<=468 && enter==false)
   {
    setStore=true;
    x=0;
    y=0;
   }
   if(x>=505 && x<=585 && y>=15 && y<=55)
     back=true;
    if(x>=425 && x<=575 && y>=250 && y<=300 && setStore==true)
    {
        if(totalCoins>=35 && coinInc==1)
        {
            ka.play();
            totalCoins-=35;
            coinInc=2;
        }
    }
    if(x>=425 && x<=575 && y>=400 && y<=450 && setStore==true)
    {
        if(totalCoins>=80 && slow==false)
        {
            ka.play();
            totalCoins-=80;
            slow=true;
        }
    }
     if(x>=25 && x<=175 && y>=250 && y<=300 && setStore==true)
     {
              skinNumber=1;
              chrome.storage.local.set({'skinnum': skinNumber}, function(){
            });
     }
   if(x>=225 && x<=375 && y>=250 && y<=300 && setStore==true)
   {
       if(totalCoins>=200 && skin2!=1)
      {
          ka.play();
           totalCoins-=200;
           chrome.storage.local.set({'coins': totalCoins}, function(){
        });
           skin2=1;
           chrome.storage.local.set({'skin2': skin2}, function(){
        });
       }
       if(skin2==1)
        {
            skinNumber=2;
            chrome.storage.local.set({'skinnum': skinNumber}, function(){
            });
        }
   }
   if(x>=25 && x<=175 && y>=400 && y<=450 && setStore==true)
   {
       if(totalCoins>=500 && skin3!=1)
      {
        ka.play();
           totalCoins-=500;
           chrome.storage.local.set({'coins': totalCoins}, function(){
        });
           skin3=1;
           chrome.storage.local.set({'skin3': skin3}, function(){
        });
       }
       if(skin3==1)
        {
            skinNumber=3;
            chrome.storage.local.set({'skinnum': skinNumber}, function(){
            });
        }
   }
   if(x>=225 && x<=375 && y>=400 && y<=450 && setStore==true)
   {
       if(totalCoins>=400 && skin4!=1)
      {
        ka.play();
           totalCoins-=400;
           chrome.storage.local.set({'coins': totalCoins}, function(){
        });
           skin4=1;
           chrome.storage.local.set({'skin4': skin4}, function(){
        });
       }
       if(skin4==1)
        {
            skinNumber=4;
            chrome.storage.local.set({'skinnum': skinNumber}, function(){
            });
        }
   }
  if(x>=255 && x<=355 && y>=460 && y<485 && win==true)
     {
         document.location.reload();
     }
}
function keyUpHandler(e)
{
    var z = e.keyCode;
    if(z==37 || z==38 ||z==39 ||z==40 || z==32)
    {
        if(ts>=1 && skinNumber==3)
        {
             r1=Math.floor(Math.random()*255);
         r2=Math.floor(Math.random()*255);
         r3=Math.floor(Math.random()*255);
         g1=Math.floor(Math.random()*155);
             g2=Math.floor(Math.random()*155);
         g3=Math.floor(Math.random()*155);
         b1=Math.floor(Math.random()*255);
         b2=Math.floor(Math.random()*255);
         b3=Math.floor(Math.random()*255);   
        }
    }
  if(e.keyCode==82)
  window.location.reload();
  
  if(e.keyCode==13)
      enter=true;
  if(e.keyCode==37&&ts>=1)
      left=true;
   else if(e.keyCode==32&&ts>=1)
       up=true;
  else if(e.keyCode==38&&ts>=1)
      up=true;
  else if(e.keyCode==39&&ts>=1)
      right=true;
  else if(e.keyCode==40&&ts>=1&&spot>0)
      down=true;
}