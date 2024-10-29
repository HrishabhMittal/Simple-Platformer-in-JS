const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
//=======================================================
//=======================================================
//=======================================================
let [mouseX,mouseY]=[0,0];
document.addEventListener("mousemove",e => {[mouseX,mouseY]=[e.clientX,e.clientY]});
//=======================================================
//=======================================================
//=======================================================
document.addEventListener("keydown",keydown);
document.addEventListener("keyup", keyup);
let keys = [];
function keydown(e) {
    let x=keys.indexOf(e.key);   
    if (x==-1) {
        keys.push(e.key);
        x=keys.indexOf(e.key); 
    }
}
function keyup(e) {
    while (keys.indexOf(e.key)!=-1) {
        keys.splice(keys.indexOf(e.key),1);
    }
}
//=======================================================
//=======================================================
//=======================================================
let fill = (c) => {ctx.fillStyle=c};
let stroke = color => {ctx.strokeStyle=color};
let rect = (rx,ry,width,height) => {ctx.fillRect(rx,ry,width,height)};
let strokeSize = i => {ctx.lineWidth=i};
function line(x1,y1,x2,y2) {
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}
let score = 0;
c.height = window.innerHeight-4;
c.width = window.innerWidth;
origin = [450,0];
strokeSize(5);
stroke("#000000");
class player {
    constructor(x=450,y=400) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.color = "#aaaaaa";
        this.jump = false;
        this.vel = 10;
        this.prev = [this.x,this.y];

        this.yvel = 0;
    }
    render() {
        fill(this.color);
        rect(this.x,this.y,this.size,this.size);
    }
    move() {
        this.prev = [this.x,this.y];
        if (keys.indexOf("ArrowLeft")!==-1 || keys.indexOf("a")!==-1) {
            this.x-=this.vel;
        }
        if (keys.indexOf("ArrowRight")!==-1 || keys.indexOf("d")!==-1) {
            this.x+=this.vel;
        }
        if ((keys.indexOf("ArrowUp")!==-1 || keys.indexOf(" ")!==-1  || keys.indexOf("w")!==-1) && this.jump) {
            this.yvel-=this.vel*3;
            this.jump=false;
        }
        if (!this.jump && this.yvel<20) {
            this.yvel+=2;
        }
        this.y+=this.yvel;
    }
}
class platform {
    constructor(x,y,w,h,p) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //left,right,up,down
        this.bools = [];
        this.prevbools = [];
        this.player = [...p];
        for (let i=0;i<p.length;i++) {
            this.bools.push([false,false,false,false]);
            this.prevbools.push([false,false,false,false]);
        }
    }
    update() {
        let totalbool = [];
        for (let i=0;i<this.player.length;i++) {
            this.prevbools[i] = [...this.bools[i]]; 
            if (this.player[i].x+this.player[i].size>this.x) {
                this.bools[i][0]=true;
            } else {
                this.bools[i][0]=false;
            }
            if (this.player[i].x<this.x+this.w) {
                this.bools[i][1]=true;
            } else {
                this.bools[i][1]=false;
            }
            if (this.player[i].y+this.player[i].size>this.y) {
                this.bools[i][2]=true;
            } else {
                this.bools[i][2]=false;
            }
            if (this.player[i].y<this.y+this.h) {
                this.bools[i][3]=true;
            } else {
                this.bools[i][3]=false;
            }
            let x=true;
            for (let j in this.bools[i]) {
                if (!this.bools[i][j]) {
                    x=false;
                    break;
                }
            }
            totalbool.push(x);
        };
        return totalbool;
    }
    render() {
        fill("#c4c4c4");
        rect(this.x,this.y,this.w,this.h);
        let x=this.update();
        for (let i=0;i<this.player.length;i++) {
            if (x[i]) {
                if (this.prevbools[i][0]==false) {
                    this.player[i].x=this.x-this.player[i].size;
                }
                if (this.prevbools[i][2]==false) {
                    this.player[i].jump=true;
                    this.player[i].yvel=0;
                    this.player[i].y=this.y-this.player[i].size;
                }
                if (this.prevbools[i][1]==false) {
                    this.player[i].x=this.x+this.w;
                }
                if (this.prevbools[i][3]==false) {
                    this.player[i].y=this.y+this.h;
                }
                this.update();
            } else if (this.player[i].jump && (this.bools[i][0]^this.bools[i][1]) && this.prevbools[i][0] && this.prevbools[i][1]) {
                this.player[i].jump=false;
            }
        }
    }
}
class thing {
    constructor(x,y,size,p) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.w = size;
        this.h = size;
        this.jump=false;
        this.yvel = 0;
        //left,right,up,down
        this.bools = [];
        this.prevbools = [];
        this.player = [...p];
        for (let i in this.player) {
            this.bools.push([false,false,false,false]);
            this.prevbools.push([false,false,false,false]);
        }
    }
    update() {
        let totalbools=[];
        for (let i in this.player) {
            if (this.player[i].x==this.x && this.player[i].y==this.y) {
                totalbools.push(false);
                continue;
            }
            this.prevbools[i] = [...this.bools[i]];
            if (this.player[i].x+this.player[i].size>this.x) {
                this.bools[i][0]=true;
            } else {
                this.bools[i][0]=false;
            }
            if (this.player[i].x<this.x+this.w) {
                this.bools[i][1]=true;
            } else {
                this.bools[i][1]=false;
            }
            if (this.player[i].y+this.player[i].size>this.y) {
                this.bools[i][2]=true;
            } else {
                this.bools[i][2]=false;
            }
            if (this.player[i].y<this.y+this.h) {
                this.bools[i][3]=true;
            } else {
                this.bools[i][3]=false;
            }
            let x=true;
            for (let j in this.bools[i]) {
                if (!this.bools[i][j]) {
                    x=false;
                    break;
                }
            }
            totalbools.push(x);
        }
        
        return totalbools;
    }
    render() {
        fill("#a4a4a4");
        rect(this.x,this.y,this.w,this.h);
        let x=this.update();
        for (let i in x) {
            if (x[i]) {
                if (this.prevbools[i][0]==false) {
                    let s=this.player[i].x+this.player[i].size-this.x;
                    this.player[i].x-=s/2;
                    this.x+=s/2
                }
                if (this.prevbools[i][2]==false) {
                    this.player[i].jump=true;
                    this.player[i].yvel=0;
                    this.player[i].y=this.y-this.player[i].size;
                }
                if (this.prevbools[i][1]==false) {
                    let s=-this.player[i].x+this.x+this.w;
                    this.player[i].x+=s/2;
                    this.x-=s/2;
                }
                if (this.prevbools[i][3]==false) {
                   let s=-this.player[i].y+this.y+this.h;
                   this.player[i].y+=s/2;
                   this.y-=s/2;
                }
                this.update();
            } else if (this.player[i].jump && (this.bools[i][0]^this.bools[i][1]) && this.prevbools[i][0] && this.prevbools[i][1]) {
                this.player[i].jump=false;
            }
        }
        this.move();
    }
    move() {
        if (!this.jump && this.yvel<20) {
            this.yvel+=2;
        } else {
            this.yvel = 0;
        }
        this.y+=this.yvel;
    }
}
class gamemap {
    constructor(plats=[],things=[]) {
        this.plats = plats;
        this.things = things;
    }
    addplat(plat) {
        this.plats.push(plat);
    }
    renderplats() {
        for (let i in this.plats) {
            this.plats[i].render();
        }
    }
    addthings(th) {
        this.things.push(th);
    }
    renderthings() {
        for (let i in this.things) {
            this.things[i].render();
        }
    }
}
class game {
    constructor() {
        this.p=new player();
        this.m=new gamemap();
        this.loadscreen = false;
        this.xframe = 400;
        this.yframe = 200;
    }
    render() {
        fill("#d5d5d5")
        rect(0,0,c.width,c.height);
        this.p.render();
        this.p.move();
        if (this.p.x>c.width-this.xframe) {
            for (let i in this.m.plats) {
                this.m.plats[i].x-=this.p.x+this.xframe-c.width;
            };
            for (let i in this.m.things) {
                this.m.things[i].x-=this.p.x+this.xframe-c.width;
            };
            origin[0]-=this.p.x+this.xframe-c.width;
            this.p.x = c.width-this.xframe;
        }
        if (this.p.x<this.xframe) {
            for (let i in this.m.plats) {
                this.m.plats[i].x+=this.xframe-this.p.x;
            };
            for (let i in this.m.things) {
                this.m.things[i].x+=this.xframe-this.p.x;
            };
            origin[0]+=this.xframe-this.p.x;
            this.p.x = this.xframe;
        }
        if (this.p.y>c.height-this.yframe) {
            for (let i in this.m.plats) {
                this.m.plats[i].y-=this.p.y+this.yframe-c.height;
            };
            for (let i in this.m.things) {
                this.m.things[i].y-=this.p.y+this.yframe-c.height;
            };
            origin[1]-=this.p.y+this.yframe-c.height;
            this.p.y = c.height-this.yframe;
        }
        if (this.p.y<this.yframe) {
            for (let i in this.m.plats) {
                this.m.plats[i].y+=this.yframe-this.p.y;
            };
            for (let i in this.m.things) {
                this.m.things[i].y+=this.yframe-this.p.y;
            };
            origin[1]+=this.yframe-this.p.y;
            this.p.y = this.yframe;
        }
        this.m.renderthings();
        this.m.renderplats();
        fill("#ababab");
        ctx.font = "60px Arial";
        ctx.fillText("Levels completed:"+String(score),0,70);
    }
}
class loadscreen {
    constructor(l,b) {
        this.loadscreen = true;
        this.l = l;
        this.b = b;
    }
    render() {
        fill("#d5d5d5");
        rect(0,0,c.width,c.height);
        fill("#aaaaaa");
        rect(c.width/2-this.l/2,c.height/2-this.b/2,this.l,this.b);
        fill("#d5d5d5");
        ctx.font = "60px Arial";
        ctx.fillText("New Level?",c.width/2-this.l/2+40,c.height/2+this.b/2-30);
    }
}
