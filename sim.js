//nbody simulation

var mouseStart, creating, bodies, mass, playing, framecount;

var speedMult = 1/60;

EULER = 0;
VERLET = 1;
RK4 = 2;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(0, 100, 0);
    bodies = [];
    mass = 1;
    playing = false;
    framecount = 0;

    makeFixedBody();

    blendMode(BLEND);

}

//create fixed body;
function makeFixedBody(){

    position = new vec2(windowWidth/2, windowHeight/2);
    fixedBody = new body(position, new vec2(0,0), 400, EULER);

    fixedBody.update = function(){};

    fixedBody.draw = function(){
	ellipse(this.pos.x, this.pos.y, 20, 20);
    };

    bodies.push(fixedBody);
}

function draw() {
    framecount++;
    background(0, 0, 0, 255);
    
    stroke(0, 100, 0);
    fill(200);
    drawInfo();
    stroke(0, 100, 0);
    
    if(creating){
	line(mouseX, mouseY, mouseStart.x, mouseStart.y);
    }

    stroke(200, 0, 200);
    
    for(var i=0;i<bodies.length;i++){
	if(playing){
	    bodies[i].update(bodies);
	}
	bodies[i].draw();
    }
}

function drawInfo(){
    text("Mass: " + mass, 10, 10);
    text("Bodies: " + bodies.length, 10, 20);
    if(!playing){
	stroke(100, 0, 0);
    }

    else stroke(0, 100, 0);
    text("Simulation "+(playing?"running":"paused"), 10, 30)

    stroke(0, 100, 0);
    text("Press c to clear paths", 10, 40);
    text("press r to reset", 10, 50);
}

function body(position, velocity, mass, type) {
    this.type = type;
    this.prev = []
    this.pos = position;
    this.vel = velocity;
    this.mass = mass;
    this.update = function(bodies){

	for(var i=0;i<bodies.length;i++){
	    if(bodies[i]!=this){
		seperation = new vec2(this.pos.x - bodies[i].pos.x, this.pos.y - bodies[i].pos.y);
		strength = -(bodies[i].mass)/Math.pow(seperation.mag(), 2);
		force = seperation.normalized().mul(strength);
		this.vel.add(force);
	    }
	}
	if(this.prev.length>0){
	    if(this.pos.distTo(this.prev[this.prev.length-1])>15){
		this.prev.push(new vec2(this.pos.x, this.pos.y))
	    }
	}
	else this.prev.push(new vec2(this.pos.x, this.pos.y));
	
	this.pos.add(this.vel);
    }

    this.draw = function(){
	if(this.type == EULER)
	    stroke(255, 0, 0, 100);

	if(this.type == VERLET)
	    stroke(0, 0, 255, 100);

	if(this.type == RK4)
	    stroke(0, 255, 0, 100);
	    
	for(var j=1;j<this.prev.length;j++){
	    line(this.prev[j-1].x, this.prev[j-1].y, this.prev[j].x, this.prev[j].y);
	}
	if(this.prev.length>0){
	    line(this.prev[this.prev.length-1].x, this.prev[this.prev.length-1].y, this.pos.x, this.pos.y);
	}

	if(!playing){
	    ellipse(this.pos.x, this.pos.y, 5, 5);
	    line(this.pos.x,
		 this.pos.y,
		 this.pos.x+this.vel.x*10,
		 this.pos.y+this.vel.y*10);
	}
    }

    this.clearPath = function(){
	this.prev = [];
    }
}

function mousePressed(){
    creating = true;
    mouseStart = new vec2(mouseX, mouseY);
}

function mouseReleased(){
    creating = false;
    velocity = new vec2(mouseX, mouseY);
    velocity.sub(mouseStart).mul(speedMult);
    bodies.push(new body(mouseStart, velocity, mass, EULER));
}

function mouseWheel(event){
    if(mass -event.delta/50>0){
	mass-=event.delta/50;
    }
}

function vec2(x, y){
    
    this.x = x;
    this.y = y;

    this.add = function(other){
	this.x += other.x;
	this.y += other.y;
	return this;
    }

    this.sub = function(other){
	this.x -= other.x;
	this.y -= other.y;
	return this;
    }

    this.mul = function(scalar){
	this.x *= scalar;
	this.y *= scalar;
	return this;
    }

    this.mag = function(){
	return Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2));
    }

    this.normalized = function(){
	mag = this.mag();
	return new vec2(this.x/mag, this.y/mag);
    }

    this.distTo = function(other){
	var xDist = this.x - other.x;
	var yDist = this.y - other.y;

	var dist =  Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	return dist;
    }
}

function keyPressed(){
    if(keyCode==32){
	playing = !playing;
    }

    if(keyCode == 67){
	for(var i =0;i<bodies.length;i++){
	    bodies[i].clearPath();
	}
    }

    if(keyCode == 82){
	bodies = [bodies[0]];
    }
}
