
c.addEventListener("click",clicked);
function clicked() {
    if (g.loadscreen) {
        let a=c.width/2;
        let b=c.height/2;
        if (mouseX>a-g.l/2 && mouseX<a+g.l/2 && mouseY>b-g.b/2 && mouseY<b+g.b/2) {
            g=makelevel();
            p=g.m.plats[g.m.plats.length-1];
        }
    }
}
function makelevel() {
    let g = new game();
    let platsno = 10;
    let plats =[];
    let things = [];
    let gen = [0,600,1500,200];
    plats.push(gen);
    for (let i=0;i<platsno;i++) {
        let xy= [Math.round(100+Math.random()*100),Math.round(800*Math.random()-400)];
        if (xy[1]<-200) {
            let c=-xy[1]-200;
            let th = [gen[0]+500,gen[1]-c-100,c];
            things.push(th);
        }
        gen = [xy[0]+gen[0]+gen[2],xy[1]+gen[1],Math.round(Math.random()*500+600),Math.round(Math.random()*20+190)];
        plats.push(gen);
    }
    platsno++;
    let eplats = [];
    let ethings = [];
    for (let i in plats) {
        eplats[i]=0;
    }
    for (let i in things) {
        ethings[i]=0;
    }
    for (let i in things) {
        let x=new thing(things[i][0],things[i][1],things[i][2],[g.p,...ethings]);
        g.m.addthings(x);
    }
    let h=[g.p,...g.m.things];
    for (let i in things) {
        g.m.things[i].player=h;
    }

    for (let i in plats) {
        g.m.addplat(new platform(plats[i][0],plats[i][1],plats[i][2],plats[i][3],h));
    }
    return g;
}
//================
//================
let g=new loadscreen(400,100);
let p;
function loop() {
    g.render();
    if (!g.loadscreen && g.p.x>p.x+p.w/2) {
        score++;
        g=new loadscreen(400,100);
    }
}
setInterval(loop,1000/60);
