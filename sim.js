//nbody simulation

var mouseStart, creating, bodies, mass;

var speedMult = 1/60;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(0, 100, 0);
    bodies = [];
    mass = 1;
}


function draw() {
    background(0);
    fill(255);
    
    text("Mass: " + mass, 10, 10);

    if(creating){
	line(mouseX, mouseY, mouseStart.x, mouseStart.y);
    }

    for(i=0;i<bodies.length;i++){
	bodies[i].update(bodies);
	bodies[i].draw();
    }
}

function body(position, velocity, mass) {
    this.pos = position;
    this.vel = velocity;
    this.mass = mass;
    this.update = function(bodies){

	for(var i=0;i<bodies.length;i++){
	    if(bodies[i]!=this){
		seperation = new vec2(this.pos.x - bodies[i].pos.x, this.pos.y - bodies[i].pos.y);
		strength = -(this.mass*bodies[i].mass)/Math.pow(seperation.mag(), 2);
		force = seperation.normalized().mul(strength);
		this.vel.add(force);
	    }
	}
	
	this.pos.add(this.vel);
    }

    this.draw = function(){
	ellipse(this.pos.x, this.pos.y, this.mass*5, this.mass*5);
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
