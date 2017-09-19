function Snake() {
  this.life = 500;
  this.rad = 25;
  this.x = width/2;
  this.y = height/2;
  this.mx = width/2;
  this.my = height/2;
  this.xspeed = 0;
  this.yspeed = 0;
  this.xacc = 0;
  this.yacc = 0;
  this.dir = function(x, y){
    this.xacc = x;
    this.yacc = y;
  }
  this.sm = function (a) {
    if (a){
      this.xspeed = 0;
    } else {
      this.yspeed = 0;
    }
  }
  this.updateShow = function(username){
    this.xspeed += this.xacc;
    this.yspeed += this.yacc;
    this.mx += this.xspeed;
    this.my += this.yspeed;
    var dx = this.mx - this.x;
    var dy = this.my - this.y;
    this.x += (dx*0.08);
    this.y += (dy*0.08);
    this.xacc = 0;
    this.yacc = 0;
    if (this.mx < this.rad ){
      this.mx = this.rad;
    }
    if (this.mx > width-this.rad){
      this.mx = width-this.rad;
    }
    if (this.my < this.rad){
      this.my = this.rad;
    }
    if (this.my > height-this.rad){
      this.my = height-this.rad;
    }
    var r = map(this.life, 500,0,0,this.rad*2);
    fill(20,255,20);
    ellipse(this.x,this.y, this.rad*2, this.rad*2);
    fill(200,20,20,78);
    ellipse(this.x,this.y, r, r);
    if (username){
      textSize(16);
      fill(15);
      text(username, this.x-16,this.y);
    }
  }
}
function Shot (x, y, tx, ty, e,id,user){
  this.user = user;
  this.e = e;
  this.en = color(250,10,60);
  this.mi = color(0,255,99);
  this.pos = createVector(x, y);
  this.m = createVector(tx,ty);
  this.dir = this.m.sub(this.pos);
  this.dir.normalize();
  this.dir.mult(22);
  this.id = id;
  this.showUpdate = function () {
    this.pos.add(this.dir);
    noStroke();
    if(this.e){
      fill(this.en);
    }
    else {
      fill(this.mi);
    }
    ellipse(this.pos.x, this.pos.y, 6, 6 );
  }
}
