class tetris {
    constructor(){
        this.num = 0;
        this.boxs = [];
        this.lengthx =10;
        this.lengthy =20;
        this.hidey = 4;
        this.nowShape = 0;
        this.nextShape=0;
        this.holdShape=0;
        this.linekey=0
        this.x = 0;
        this.y = 0;
        this.direction = {left:4,right:6,up:8,down:2};
        this.shape = [[0], 
                    [[0, 0], [1, 0], [0, 1], [1, 1]], 
                    [[1, 0], [2, 0], [0, 1], [1, 1]],[[0, 0], [0, 1], [1, 1], [1, 2]], 
                    [[0, 0], [1, 0], [1, 1], [2, 1]],[[1, 0], [0, 1], [1, 1], [0, 2]], 
                    [[0, 0], [1, 0], [2, 0], [1, 1]],[[1, 0], [0, 1], [1, 1], [1, 2]],[[1, 0], [0, 1], [1, 1], [2, 1]],[[0, 0], [0, 1], [1, 1], [0, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 2]],[[0, 0], [1, 0], [2, 0], [0, 1]],[[0, 0], [1, 0], [1, 1], [1, 2]],[[0, 1], [1, 1], [2, 1], [2, 0]], 
                    [[1, 0], [1, 1], [0, 2], [1, 2]],[[0, 0], [0, 1], [1, 1], [2, 1]],[[0, 0], [1, 0], [0, 1], [0, 2]],[[0, 0], [1, 0], [2, 0], [2, 1]], 
                    [[0, 0], [0, 1], [0, 2], [0, 3]],[[0, 0], [1, 0], [2, 0], [3, 0]]];
                    
        this.parentGameBoad = document.getElementById("gameboad");
        for (let i = 0;i<this.lengthx;i++){
            this.boxs.push([]);
            for(let d =0;d<this.lengthy+this.hidey;d++){
                this.boxs[i].push(0);
                if(d<this.hidey)continue;
            }
        }
        let leng = this.lengthx*this.lengthy;
        let cnt = 0;
        for(let d = 0;d<leng;d++){
            let img_flag = document.createElement('img');
            img_flag.src=this.getImage(0);
            img_flag.id ='test'+ String(d);
            this.parentGameBoad.appendChild(img_flag);
            cnt+=1;
            if(cnt==10){
                this.parentGameBoad.appendChild(document.createElement('br'));
                cnt = 0;
            }
        }
        this.parentLeft_menu = document.getElementById("left_menu");
        this.parentRight_menu = document.getElementById("right_menu");
        cnt = 0;
        for(let d = 0;d<16;d++){
            let img_flag = document.createElement('img');
            img_flag.src=this.getImage(0);
            img_flag.id ='hold'+ String(d);
            let img_flage = document.createElement('img');
            img_flage.src=this.getImage(0);
            img_flage.id ='next'+ String(d);
            this.parentLeft_menu.appendChild(img_flag);
            this.parentRight_menu.appendChild(img_flage);
            cnt+=1;
            if(cnt==4){
                this.parentLeft_menu.appendChild(document.createElement('br'));
                this.parentRight_menu.appendChild(document.createElement('br'));
                cnt = 0;
            }
        }
    }
    



    gamestart(){
        let menu = document.getElementById('up_menu');
        let gazo = document.createElement('p');
        gazo.textContent = "new game";
        menu.appendChild(gazo);
        this.nextShape =  this.randomPiece();
        this.pushPiece();
        this.keyAdd();
        this.movekey =true;
        this.stop = true;
        this.hold = true;
        this.cnt = 0;
        this.showBoad();
        this.mainLoop();
    }

    mainLoop(){
        this.cnt += 1;
        if(this.stop){
            for(let e=0;e<this.linekey;e++){
                this.upLine();
            }
            this.deleteShape(this.x,this.y,this.nowShape);
            let check = this.checkShape(this.x,this.y+1,this.nowShape);
            this.setShape(this.x,this.y,this.nowShape);
            if(check<=-1){
                this.linekey = this.checkLine();
                if(this.linekey==0){
                    if(this.y<this.hidey){
                        this.showBoad();
                        window.setTimeout(this.gameOver().bind(this),500);
                        return;
                    }
                    this.pushPiece();
                }
            }else{
                if(this.movekey)this.movePiece(this.direction.down);
            }
        }

        this.showBoad();
        document.getElementById('text').textContent = String(this.cnt)+"or"+String(this.x)+String(this.y);
        this.Timeout_id=window.setTimeout(this.mainLoop.bind(this),500);
    }

    gameOver(){
        document.getElementById('text').textContent = "死にましたー";
        window.clearTimeout(this.Timeout_id);
        this.stop=false;
        for (let i = 0;i<this.lengthy;i++){
            for(let d =0;d<this.lengthx;d++){
                if(this.boxs[d][i+this.hidey]>0 && this.boxs[d][i+this.hidey]<20){
                let image = this.getImage(20);
                let aa = (i*this.lengthx)+d;
                document.getElementById('test'+String(aa)).src = image;
                }
            }
        }
    }

    upLine(){
        let box;
        let dot;
            for(let d = this.lengthy+this.hidey-1;d>0;d--){
                dot = 0;
                for(let i = 0;i<this.lengthx;i++){
                    box = this.boxs[i][d];
                    if(box==30){
                        dot+=1;
                    }
                }
                if(dot == this.lengthx){
                    for(let i = 0;i<this.lengthx;i++){
                        this.boxs[i][d]=this.boxs[i][d-1];
                        this.boxs[i][d-1] = 30;
                    }
                }
            }
    }
    checkLine(){
        let box;
        let line=0;
        let dot;
        for(let d = 0;d<this.lengthy+this.hidey;d++){
            dot = 0;
            for(let i = 0;i<this.lengthx;i++){
                box = this.boxs[i][d];
                if(box>0&&box<20){
                    dot+=1;
                }
            }
            if(dot == this.lengthx){
                line+=1;
                for(let i = 0;i<this.lengthx;i++){
                    this.boxs[i][d]=30;
                }
            }
        }
        if(line>0)this.nowShape=0;
        return line;
    }

    randomPiece(){
        var items = [1,2,4,6,10,14,18];
        let random;
        while(true){
            random = Math.floor(Math.random()*items.length);
        if(items[random] != this.nextShape)break;
        }
        return items[random];
    }

    keyAdd(){
        let right = document.getElementById('right');
        right.addEventListener('mousedown',e =>{if(this.stop)this.movePiece(this.direction.right);})
        let left=document.getElementById('left');
        left.addEventListener('mousedown',e =>{if(this.stop)this.movePiece(this.direction.left)})
        let up=document.getElementById('change');
        up.addEventListener('mousedown',e =>{if(this.stop)this.rotatePiece()})
        let down=document.getElementById('down');
        down.addEventListener('mousedown',e =>{if(this.stop)this.fallPiece();})
        let stop=document.getElementById('stop');
        stop.addEventListener('mousedown',e =>{this.stop= !this.stop;})
        let hold=document.getElementById('hold');
        hold.addEventListener('mousedown',e =>{if(this.stop){if(this.hold)this.holdPiece();}})
    }

    pushPiece(){
        this.x =4;
        this.y=0;
        this.nowShape = this.nextShape;
        this.nextShape = this.randomPiece();
        this.setShape(this.x,this.y,this.nowShape);
        this.deleteGhost();
        this.setGhost();
        this.hold=true;
    }

    holdPiece(){
        this.hold=false;
        this.deleteShape(this.x,this.y,this.nowShape);
        let now = this.nowShape;
        if(this.holdShape==0){
            this.pushPiece();
        }else{
            this.x =4;
            this.y=0;
            this.nowShape=this.holdShape;
            this.setShape(this.x,this.y,this.nowShape);
            this.deleteGhost();
            this.setGhost();
        }
        this.holdShape=now;
    }

    rotatePiece(){
        if(this.nowShape ==0)return;
        this.movekey=false;
        let num=this.nowShape+1;
        if(this.nowShape<=1){
            if(num>1)num = 1;
        }else if(this.nowShape<=3){
            if(num>3)num = 2;
        }else if(this.nowShape<=5){
            if(num>5)num = 4;
        }else if(this.nowShape<=9){
            if(num>9)num = 6;
        }else if(this.nowShape<=13){
            if(num>13)num = 10;
        }else if(this.nowShape<=17){
            if(num>17)num = 14;
        }else if(this.nowShape<=19){
            if(num>19)num = 18;
        }
        
        this.deleteShape(this.x,this.y,this.nowShape);
        this.deleteGhost();
        
        let check = this.checkShape(this.x,this.y,num);
        if(check==-1){
            let shapex;
            let shapey;
            let setx = 0;
            let sety = 0;
            let swx=0;
            let swy=0;
            for(let i = 0;i<4;i++){
                shapex = this.shape[num][i][0];
                shapey = this.shape[num][i][1];
                if((this.x+shapex) >=this.lengthx){
                    if(shapex>setx){
                        setx=shapex;
                        swx +=1;
                    }
                }
                
                if((this.y+shapey)>=this.lengthy+this.hidey){
                    if(shapey>sety){
                        sety=shapey;
                        swy +=1;
                    }
                }
            }
            check = this.checkShape(this.x-swx,this.y-swy,num);
            console.log("チェック"+String(check));
            if(check<=-1){
                num = this.nowShape;
            }else if(check ==0){
                this.x = this.x -swx;
                this.y = this.y -swy;
            }
        }else if(check==-2){
            num = this.nowShape;
        }
        this.setShape(this.x,this.y,num);
        this.nowShape=num;
        this.setGhost();
        this.showBoad();
        this.movekey=true;
    }

    fallPiece(){
        this.deleteShape(this.x,this.y,this.nowShape);
        let check;
        for(let i=1;i<this.lengthy+this.hidey;i++){
            check = this.checkShape(this.x,this.y+i,this.nowShape);
            if(check<=-1){
                this.setShape(this.x,this.y+i-1,this.nowShape);
                this.y = this.y+i-1;
                return;
            }
        }
    }

    movePiece(direction){
        this.deleteShape(this.x,this.y,this.nowShape);
        this.deleteGhost();
        let check = 0;
        let movex = this.x;
        let movey = this.y;
        if(direction==this.direction.down){
            movey +=1;
        }else if(direction==this.direction.left){
            movex-=1;
        }else if(direction==this.direction.right){
            movex+=1;
        }
        check = this.checkShape(movex,movey,this.nowShape);
        
        if(check <= -1){
            this.setShape(this.x,this.y,this.nowShape);
            return;
        }
        
        this.setShape(movex,movey,this.nowShape);
        this.y =movey;
        this.x=movex;
        this.setGhost();
        this.showBoad();
    }

    checkShape(setx,sety,num){
        if(num ==0)return -1;
        if(setx<0||sety<0)return -1;
        let shapex;
        let shapey;
        let nowbox;
        let ret = 0;
        for(let i = 0;i<4;i++){
            shapex = this.shape[num][i][0];
            shapey = this.shape[num][i][1];
            if((setx+shapex) >=this.lengthx || (sety+shapey)>=this.lengthy+this.hidey){
                if(ret!=-2)ret = -1;
                continue;
            }
            nowbox = this.boxs[setx+shapex][sety+shapey];
            if(nowbox >0 && nowbox<20){
                ret = -2;

            }
        }
        return ret;
    }

    setShape(setx,sety,num){
        if(num ==0)return;
        let shapex=0;
        let shapey=0;
            for(let i = 0;i<4;i++){
                shapex = this.shape[num][i][0];
                shapey = this.shape[num][i][1];
                this.boxs[setx+shapex][sety+shapey] = num;
            }
    }

    setGhost(){
        if(this.nowShape ==0)return;
        this.deleteShape(this.x,this.y,this.nowShape);
        let check;
        for(let i=1;i<this.lengthy+this.hidey;i++){
            check = this.checkShape(this.x,this.y+i,this.nowShape);
            if(check<=-1){
                let mox = this.x;
                let moy =this.y+i-1;
                let shapex=0;
                let shapey=0;
                for(let i = 0;i<4;i++){
                    shapex = this.shape[this.nowShape][i][0];
                    shapey = this.shape[this.nowShape][i][1];
                    this.boxs[mox+shapex][moy+shapey] = 20;
                }
                break;
            }
        }
        this.setShape(this.x,this.y,this.nowShape);
    }

    deleteGhost(){
        for(let i = 0;i<this.lengthx;i++){
            for(let d = 0;d<this.lengthy+this.hidey;d++){
                if(this.boxs[i][d]==20)this.boxs[i][d]=0;
            }
        }
    }

    deleteShape(setx,sety,num){
        if(num ==0)return;
        let shapex=0;
        let shapey=0;
            for(let i = 0;i<4;i++){
                shapex = this.shape[num][i][0];
                shapey = this.shape[num][i][1];
                this.boxs[setx+shapex][sety+shapey] = 0;
            }
    }

    showNext(){
        for(let d = 0;d<16;d++){
            document.getElementById("next"+String(d)).src=this.getImage(0);
        }
        let shapex;
        let shapey;
        let num=this.nextShape;
        let aa;
        for(let i = 0;i<4;i++){
            shapex = this.shape[num][i][0];
            shapey = this.shape[num][i][1];
            aa = shapex+(shapey*4);
            document.getElementById("next"+String(aa)).src=this.getImage(num);
        }
    }
    showHold(){
        if(this.holdShape==0)return;
        for(let d = 0;d<16;d++){
            document.getElementById("hold"+String(d)).src=this.getImage(0);
        }
        let shapex;
        let shapey;
        let num=this.holdShape;
        let aa;
        let img;
        for(let i = 0;i<4;i++){
            shapex = this.shape[num][i][0];
            shapey = this.shape[num][i][1];
            aa = shapex+(shapey*4);
            img = 20;
            if(this.hold)img = num;
            document.getElementById("hold"+String(aa)).src=this.getImage(img);
        }
    }
    showBoad(){
        for (let i = 0;i<this.lengthy;i++){
            for(let d =0;d<this.lengthx;d++){
                let image = this.getImage(this.boxs[d][i+this.hidey]);
                let aa = (i*this.lengthx)+d;
                document.getElementById('test'+String(aa)).src = image;
            }
        }
        this.showNext();
        this.showHold();
    }

    getImage(num){
        let image="";
        if(num==0){
            image="gray.gif"; 
        }else if(num==1){
            image = "green.gif";
        }else if(num >= 2 && num <=3){
            image = "pink.gif"
        }else if(num >= 4 && num <=5){
            image = "blue.gif"
        }else if(num >= 6 && num <=9){
            image = "purple.gif"
        }else if(num >= 10 && num <=13){
            image = "yellow.gif"
        }else if(num >= 14 && num <=17){
            image = "red.gif"
        }else if(num >= 18 && num <=19){
            image = "cyan.gif"
        }else if(num ==20){
            image = "lavender.gif"
        }else if(num ==30){
            image = "gray.gif"
        }
        return image;
    }

}










