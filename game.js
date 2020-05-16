var context;
var height = 500;
var width = 500;
var x=100;
var y=200;
var dx=1;
var dy=1;
var radius = 15;
var balls= [ ];
var totalBalls = 0;
var num = 0;
var canvasArea = height*width;
var ballArea = 0;
var percent = 0;
var genSpeed = 5000;
var score = 0;
var pp = 1;
var game = -1;
var endCount = 10;
function init(){
	const canvas = document.getElementById("canvas");
	ctx= canvas.getContext('2d');
	document.getElementById("areapercent").innerHTML = "Percentage of area covered by balls: 0%";
	document.getElementById("score").innerHTML = "Score: " + score;
	init.generateBalls = setInterval(generate_balls,2000);
	init.upthespeed = setInterval(increase_generation, 20000);
	init.ballTouch = setInterval(ball_touch,1);
	init.draw = setInterval(draw,20);
	init.death = setInterval(too_many, 20);
	document.addEventListener('keydown', keyDown, false);
	document.getElementById("pp").innerHTML = "press X to pause";
	document.getElementById("restart").innerHTML = "press R to restart";
}
function generate_balls(){
	//50 for radius 15 and 15 for 50
	//alert("hello");
	var yes = 0;
	var goAhead = 0;
	upper_radius = 50;
	lower_radius = 15;
	var Score = 0;
	
	do{
		radius = random(lower_radius,upper_radius);
		Score = Math.floor(-radius+65);
		x = random(radius,width-radius);
		y = random(radius,height-radius);
		for( i = 0; i < totalBalls ; i++){
			if(Math.sqrt(((x-balls[i][0])*(x-balls[i][0]))+((y-balls[i][1])*(y-balls[i][1]))) <= 2*radius){
				yes = 1;
				break;
			}
		}
		if(yes != 1){
			goAhead = 1;
		}
		else{
			yes = 0;
		}
	}
	while(goAhead == 0);
	balls.push([x ,y, dx, dy, radius, Score]);
	//alert(balls[totalBalls]);
	total_area();
	totalBalls++;	
}
function increase_generation(){
	clearInterval(init.generateBalls);
	if(genSpeed > 1000){
		genSpeed-=500;
	}
	else if (genSpeed < 1000 && genSpeed > 500) {
		genSpeed-=100;
	}
	else{
		genSpeed-=50;
	}
	init.generateBalls = setInterval(generate_balls,genSpeed);
}
function total_area(){
	ballArea+=(3.14*balls[totalBalls][4]*balls[totalBalls][4]);
	percent = Math.floor((ballArea/canvasArea)*100);
	document.getElementById("areapercent").innerHTML = "Percentage of area covered by balls: " + percent + "%"
	
}
function draw(){
	ctx.clearRect(0,0, width,height);
	for(i = 0;i<totalBalls;i++){
		ctx.beginPath();
		ctx.fillStyle="#0000ff";
		ctx.arc(balls[i][0],balls[i][1],balls[i][4],0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		if( balls[i][0]<balls[i][4] || balls[i][0]>height-balls[i][4]) balls[i][2]=-balls[i][2]; 
		if( balls[i][1]<balls[i][4] || balls[i][1]>width-balls[i][4]) balls[i][3]=-balls[i][3]; 
		balls[i][0]+=balls[i][2]; 
		balls[i][1]+=balls[i][3];
	}
	ball_touch();
	
	// Boundary Logic
}
function ball_touch(){
	//alert("hello");
	for(i=0;i<totalBalls;i++){
		for(j=i+1;j<totalBalls;j++){
			if(/*j != i &&*/ Math.sqrt(((balls[i][0]-balls[j][0])*(balls[i][0]-balls[j][0]))+((balls[i][1]-balls[j][1])*(balls[i][1]-balls[j][1]))) <= balls[i][4]+balls[j][4] ){
					//alert("hello");
				
					balls[i][2] = -balls[i][2];
					balls[i][3] = -balls[i][3];
					
					balls[j][2] = -balls[j][2];
					balls[j][3] = -balls[j][3];
					
					balls[i][0]+=balls[i][2]; 
					balls[i][1]+=balls[i][3];
					balls[j][0]+=balls[j][2]; 
					balls[j][1]+=balls[j][3];
			}	
		}
	}
}
var rect = {
    x:150,
    y:225,
    width:200,
    height:50
};
function isInside(pos, rect){
	if(game == 0 || game == -1){
		if (pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y){
			return true;
		}
		else{
			return false;
		}
	}
	else{
		for(j=0;j<totalBalls;j++){
			if(Math.sqrt(((pos.x-balls[j][0])*(pos.x-balls[j][0]))+((pos.y-balls[j][1])*(pos.y-balls[j][1]))) <= balls[j][4] ){
				num = j;
				return true;
			}
		}
	}
}
function MousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}
document.addEventListener('click', function(e) {
	const canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var mousePos = MousePos(canvas, e);
	if (game == -1){
		 if (isInside(mousePos,rect)) {
				init();
		}
	}
	if (game == 0){
        if (isInside(mousePos,rect)) {
			restart();
		}
    }
    if (isInside(mousePos,rect)) {
		ballArea -= (3.14*balls[num][4]*balls[num][4]);
		percent = Math.floor((ballArea/canvasArea)*100)
		document.getElementById("areapercent").innerHTML = "Percentage of area covered by balls: " + percent + "%"
		score+=balls[num][5];
		//alert(balls[num][5]);
		document.getElementById("score").innerHTML = "Score: " + score;
		for(i=num;i<totalBalls-1;i++){
			balls[i][0] = balls[i+1][0];
			balls[i][1] = balls[i+1][1];
			balls[i][2] = balls[i+1][2];
			balls[i][3] = balls[i+1][3];
			balls[i][4] = balls[i+1][4];
		}
		balls.pop();
		totalBalls--;
		//clearInterval(init.draw);
        //ctx.clearRect(0,0, 400,400);
    }
}, false);
function random(mn, mx) {  
            return Math.floor(Math.random() * (mx - mn)) + mn;  
}
function keyDown(e) {
  if (e.keyCode == 88){
	  if(pp == 0){
		//game = 1;
		init.generateBalls = setInterval(generate_balls,5000);
		init.upthespeed = setInterval(increase_generation, 20000);
		init.ballTouch = setInterval(ball_touch,1);
		init.draw = setInterval(draw,20);
		init.death = setInterval(too_many, 20);
		document.getElementById("pp").innerHTML = "press X to pause";
		pp = 1;
	}
	else{
		clearInterval(init.generateBalls);
		clearInterval(init.upthespeed);
		clearInterval(init.ballTouch);
		clearInterval(init.draw);
		clearInterval(init.death);
		clearInterval(too_many.n);	
		already = 0;
		//game = 0;
		pp = 0;
		document.getElementById("pp").innerHTML = "press X to play";
		  
	  }
  }
  if(e.keyCode == 82){
	  endgame();
  }
}
function endgame(){
	for( i=0 ; i<totalBalls ; i++){
		balls.pop();
	}
	clearInterval(init.generateBalls);
	clearInterval(init.upthespeed);
	clearInterval(init.ballTouch);
	clearInterval(init.draw);
	const canvas = document.getElementById("canvas");
	ctx= canvas.getContext('2d');
	ctx.clearRect(0,0,500,500);
	game = 0;
	restart_button();
}
function restart_button(){
	const canvas = document.getElementById("canvas");
	ctx= canvas.getContext('2d');
	ctx.clearRect(150,225,200,50);
	ctx.beginPath();
	ctx.rect(150,225,200,50);
	ctx.stroke();
	ctx.fillStyle = "black";
	ctx.textAlign = "centre";
	ctx.font = '40px serif';
	//ctx.fillText("Score: "+ highScore, 350,50);
	ctx.fillText("Restart",195,260,200);
}
function too_many(){
	if(percent >=50 && already == 0){
		already = 1;
		too_many.n = setInterval(function(){
			if(endCount == 0){
				clearInterval(too_many.n);
				endgame();
			}
			document.getElementById("timer").innerHTML = "Countdown till death: " + endCount;
			endCount--;
		},1000);
	}
	if(percent < 50){
		already = 0;
		endCount = 10;
		document.getElementById("timer").innerHTML = "";
		clearInterval(too_many.n);	
	}		
}
function restart(){
	x=100;
	y=200;
	dx=1;
	dy=1;
	totalBalls = 0;
	num = 0;
	ballArea = 0;
	percent = 0;
	genSpeed = 5000;
	score = 0;
	pp = 1;
	game = 1;
	endCount = 10;
	init();
	
}
function start(){
	const canvas = document.getElementById("canvas");
	ctx= canvas.getContext('2d');
	ctx.clearRect(150,225,200,50);
	ctx.beginPath();
	ctx.rect(150,225,200,50);
	ctx.stroke();
	ctx.fillStyle = "black";
	ctx.textAlign = "centre";
	ctx.font = '30px serif';
	//ctx.fillText("Score: "+ highScore, 350,50);
	ctx.fillText("Start Game",180,260,200);
}
window.onload = start;

	
	