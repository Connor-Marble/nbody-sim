//nbody simulation

var mouseStart, creating, bodies, mass, playing, framecount;

var speedMult = 1/60;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(0, 100, 0);
    bodies = [];
    mass = 1;
    playing = false;
    framecount = 0;

    makeFixedBody();

}

//create fixed body;
function makeFixedBody(){

    position = new vec2(windowWidth/2, windowHeight/2);
    fixedBody = new body(position, new vec2(0,0), 400);

    fixedBody.update = function(){};

    fixedBody.draw = function(){
	ellipse(this.pos.x, this.pos.y, 20, 20);
    };

    bodies.push(fixedBody);
}

function draw() {
    framecount++;
    background(0);
    fill(255);
    drawInfo();

    stroke(0, 100, 0);
    
    if(creating){
	line(mouseX, mouseY, mouseStart.x, mouseStart.y);
    }

    for(i=0;i<bodies.length;i++){
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
}

function body(position, velocity, mass) {
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
	if(framecount%10 ==0){
	    this.prev.push(new vec2(this.pos.x, this.pos.y))
	}
	this.pos.add(this.vel);
    }

    this.draw = function(){
	for(j=1;j<this.prev.length;j++){
	    line(this.prev[j-1].x, this.prev[j-1].y, this.prev[j].x, this.prev[j].y);
	}
	if(this.prev.length>0){
	    line(this.prev[this.prev.length-1].x, this.prev[this.prev.length-1].y, this.pos.x, this.pos.y);
	}
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
    bodies.push(new body(mouseStart, velocity, mass));
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
}

function keyPressed(){
    if(keyCode==32){
	playing = !playing;
    }
}
