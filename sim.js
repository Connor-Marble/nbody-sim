//nbody simulation

var mouseStart, creating, bodies;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(0, 100, 0);
    bodies = [];
}


function draw() {
    background(0);

    if(creating){
	line(mouseX, mouseY, mouseStart.x, mouseStart.y);
    }

    for(i=0;i<bodies.length;i++){
	bodies[i].update();
	bodies[i].draw();
    }
}

function body(position, velocity) {
    this.pos = position;
    this.vel = velocity;

    this.update = function(){
	this.pos.add(this.vel);
    }

    this.draw = function(){
	ellipse(this.pos.x, this.pos.y, 5, 5);
    }
}

function mousePressed(){
    creating = true;
    mouseStart = new vec2(mouseX, mouseY);
}

function mouseReleased(){
    creating = false;
    velocity = new vec2(mouseX, mouseY);
    velocity.sub(mouseStart);
    bodies.push(new body(mouseStart, velocity));
}

function vec2(x, y){
    this.x = x;
    this.y = y;

    this.add = function(other){
	this.x += other.x;
	this.y += other.y;
    }

    this.sub = function(other){
	this.x -= other.x;
	this.y -= other.y;
    }
}
