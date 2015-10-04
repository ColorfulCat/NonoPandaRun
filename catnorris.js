

window.onload = function(){
    cc.game.onStart = function(){
        cc.view.adjustViewPort(true);
        if (cc.sys.isMobile)
            cc.view.setDesignResolutionSize(640,960,cc.ResolutionPolicy.SHOW_ALL);
        else cc.view.setDesignResolutionSize(640,960,cc.ResolutionPolicy.SHOW_ALL);
        cc._renderContext.webkitImageSmoothingEnabled = false;
        cc._renderContext.mozImageSmoothingEnabled = false;
        cc._renderContext.imageSmoothingEnabled = false; //future
        cc._renderContext.fillStyle="#afdc4b";
        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            cc.director.runScene(new HelloWorldScene());

        }, this);
    };
    cc.game.run("gameCanvas");
};

var ShareUI = cc.LayerColor.extend({
    ctor: function (context) {
        this._super(cc.color(0, 0, 0, 188), cc.winSize.width, cc.winSize.height);

        var arrow = new cc.Sprite("arrow.png");
        arrow.anchorX = 1;
        arrow.anchorY = 1;
        arrow.x = cc.winSize.width - 15;
        arrow.y = cc.winSize.height - 5;
        this.addChild(arrow);

        var label = new cc.LabelTTF("恭喜你躲过了 "+Grade+" 波大便的进攻！\n我也不知道你击败了多少人!\n ^Ω^! \n"
            + " \n请点击右上角的菜单按钮\n然后\"分享到朋友圈\"\n让你的朋友们也来玩《猫不屎》吧！\n"+
            " \n~╮(╯▽╰)╭~\n~我是大花猫~\n~我为自己代言~\n~喵哈哈哈哈哈~~~", "Arial", 28, cc.size(cc.winSize.width*0.8, cc.winSize.width), cc.TEXT_ALIGNMENT_CENTER);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height - 100;
        label.anchorY = 1;
        label.shadowColor = cc.color(255,255,255);
        label.shadowBlur = 50;
        this.addChild(label);
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchEnded:function(t, event){
                if(touchAble){
                    event.getCurrentTarget().removeFromParent();
                }
            }
        }, this);
    }
});


var MINDIS = 60;
var GAME_STATUS = 0;
var ALIVE = true;
var Grade = 0;
var touchAble = true;
var HelloWorldLayer = cc.LayerColor.extend({
    panda1:null,
    panda2:null,
    panda3:null,
    shit1:null,
    shit2:null,
    shit3:null,
    cloud:null,
    gradeLabel:null,
    
    ctor:function () {
        // ////////////////////////////
        // 1. super init first
        this._super(cc.color(51, 204, 255, 255));

        this.startGame();

        return true;
    },
    
    startGame:function(){
        cc.log("startGame ~ !");
        ALIVE = true;
        Grade = 0;
        touchAble = true;
        var size = cc.director.getWinSize();
        var touch1=true, touch2=true, touch3=true;

        share(0, 0, 0);//默认share

        //标题
        var helloLabel = cc.LabelTTF.create("~猫不屎~", "Arial", 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height * 15 / 16;
        helloLabel.setColor(cc.color(220,0,0));
        this.addChild(helloLabel, 11);
        
        //成绩
        gradeLabel = cc.LabelTTF.create("~Nono已经躲过 " + Grade + " 波大便的进攻！~", "Arial", 38);
        gradeLabel.x = size.width / 2;
        gradeLabel.y = size.height * 1 / 10;
        gradeLabel.setColor(cc.color(220,0,0));
        this.addChild(gradeLabel, 11);

        //made by
        var nameLabel = cc.LabelTTF.create("Made by 大花猫~", "Arial", 25);
        nameLabel.x = size.width / 2;
        nameLabel.y = size.height * 1 / 16;
        nameLabel.setColor(cc.color(200,0,0));
        this.addChild(nameLabel, 11);
        
        //地板1
        var ground1 = cc.Sprite.create(res.Ground_png);
        ground1.x = size.width / 2;
        ground1.y = size.height * 3 / 4 - 60;
        ground1.scaleX = size.width/ground1.width;
        ground1.scaleY = 0.8;
        this.addChild(ground1, 10);
        //地板2
        var ground2 = cc.Sprite.create(res.Ground_png);
        ground2.x = size.width / 2;
        ground2.y = size.height * 1 / 2 - 60;
        ground2.scaleX = size.width/ground2.width;
        ground2.scaleY = 0.8;
        this.addChild(ground2, 10);
        //地板3
        var ground3 = cc.Sprite.create(res.Ground_png);
        ground3.x = size.width / 2;
        ground3.y = size.height * 1 / 4 - 60;
        ground3.scaleX = size.width/ground3.width;
        ground3.scaleY = 0.8;
        this.addChild(ground3, 10);

        shit1 = cc.Sprite.create(res.Shit1_png); 
        shit1.x=size.width + 40;
        shit1.y = size.height * 3 / 4 - 8; 
        this.addChild(shit1, 10);

        shit2 = cc.Sprite.create(res.Shit1_png); 
        shit2.x=size.width + 40;
        shit2.y = size.height * 1 / 2 - 8; 
        this.addChild(shit2, 10);

        shit3 = cc.Sprite.create(res.Shit1_png); 
        shit3.x=size.width + 40;
        shit3.y = size.height * 1 / 4 - 8; 
        this.addChild(shit3, 10);

        cloud = cc.Sprite.create(res.Cloud_png); 
        cloud.x = size.width + 60;
        cloud.y = size.height * 1 / 3; 
        this.addChild(cloud, 100);

        //panda1
        var tex1 = cc.textureCache.addImage(res.PandaFire_png);
        var frame1,
        rect1 = cc.rect(0, 0, 80, 80),
        moving_frames1 = [];
        for (var i = 0; i < 3; i++) {
            rect1.x = 80 + i * 80;
            frame1 = cc.SpriteFrame.create(tex1, rect1);
            moving_frames1.push(frame1);
        }
        var moving_animation1 = cc.Animation.create(moving_frames1, 0.05);
        var normal_runAction1 = cc.RepeatForever.create(cc.Animate.create(moving_animation1));

        panda1 = cc.Sprite.create(moving_frames1[0]); 
        panda1.x = size.width / 8;
        panda1.y = size.height * 3 / 4;

        panda1.runAction(normal_runAction1);
        this.addChild(panda1, 10);
        
        //panda2
        var tex2 = cc.textureCache.addImage(res.PandaRun_png);
        var frame2,
        rect2 = cc.rect(0, 0, 80, 80),
        moving_frames2 = [];
        for (var i = 0; i < 19; i++) {
            rect2.x = 80 + i * 80;
            frame2 = cc.SpriteFrame.create(tex2, rect2);
            moving_frames2.push(frame2);
        }
        var moving_animation2 = cc.Animation.create(moving_frames2, 0.05);
        var normal_runAction2 = cc.RepeatForever.create(cc.Animate.create(moving_animation2));

        panda2 = cc.Sprite.create(moving_frames2[0]); 
        panda2.x = size.width / 8;
        panda2.y = size.height * 1 / 2;

        panda2.runAction(normal_runAction2);
        this.addChild(panda2, 10);

        //panda3
        var tex3 = cc.textureCache.addImage(res.PandaStu_png);
        var frame3,
        rect3 = cc.rect(0, 0, 80, 80),
        moving_frames3 = [];
        for (var i = 6; i > 0 ; i--) {
            rect3.x = 80 + i * 80;
            frame3 = cc.SpriteFrame.create(tex3, rect3);
            moving_frames3.push(frame3);
        }
        var moving_animation3 = cc.Animation.create(moving_frames3, 0.12);
        var normal_runAction3 = cc.RepeatForever.create(cc.Animate.create(moving_animation3));

        panda3 = cc.Sprite.create(moving_frames3[0]); 
        panda3.x = size.width / 8;
        panda3.y = size.height * 1 / 4;

        panda3.runAction(normal_runAction3);
        this.addChild(panda3, 10);

        var context = this;
        //touch click
        cc.eventManager.removeAllListeners();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                cc.log("TOUCH_ALL_AT_ONCE ~ !");
                var touch = touches[0];
                var pos = touch.getLocation();
                if(!touchAble) return;
                if(ALIVE && pos.y > size.height * 3 / 4 - 40 && touch1){
                    touch1 = false;
                    var jump1 = cc.JumpTo.create(1, cc.p(size.width / 8, size.height * 3 / 4), 130, 1);
                    var jumpCallBack1 = cc.CallFunc.create(function(){
                        touch1 = true;
                    },this);
                    panda1.runAction(cc.Sequence.create(jump1, jumpCallBack1));
                }else if(ALIVE && pos.y < size.height * 3 / 4 - 100 && pos.y > size.height / 2 - 40 && touch2){
                    touch2 = false;
                    var jump2 = cc.JumpTo.create(1, cc.p(size.width / 8, size.height / 2), 130, 1);
                    var jumpCallBack2 = cc.CallFunc.create(function(){
                        touch2 = true; 
                    },this);
                    panda2.runAction(cc.Sequence.create(jump2, jumpCallBack2));
                }else if(ALIVE && pos.y < size.height / 2 - 100 && pos.y > size.height * 1 / 4 - 40 && touch3){
                    touch3 = false;
                    var jump3 = cc.JumpTo.create(1, cc.p(size.width / 8, size.height * 1 / 4), 130, 1);
                    var jumpCallBack3 = cc.CallFunc.create(function(){
                        touch3 = true;
                    },this); 
                    panda3.runAction(cc.Sequence.create(jump3, jumpCallBack3));
                }else if(!ALIVE){ 
                    context.restartGame(context);
                }
            }
        }, this);

    this.scheduleUpdate();
    this.schedule(this.setShit, 3.1);
    this.schedule(this.setCloud, 5.3);

},
update:function(dt){
        //碰撞检测
        if(ALIVE && cc.pDistance(panda1.getPosition(),shit1.getPosition()) < MINDIS){
            this.stopGame();
            //panda1 dead
            var tex11 = cc.textureCache.addImage(res.Dead_png);
            var frame11,
            rect11 = cc.rect(0, 0, 80, 80),
            moving_frames11 = [];
            for (var i = 0; i < 5; i++) {
                rect11.x = 80 + i * 80;
                frame11 = cc.SpriteFrame.create(tex11, rect11);
                moving_frames11.push(frame11);
            }
            var moving_animation11 = cc.Animation.create(moving_frames11, 0.05);
            var normal_runAction11 = cc.RepeatForever.create(cc.Animate.create(moving_animation11));
            panda1.runAction(normal_runAction11);
        }else if(ALIVE && cc.pDistance(panda2.getPosition(),shit2.getPosition()) < MINDIS){
            this.stopGame();
            //panda2 dead
            var tex22 = cc.textureCache.addImage(res.Dead_png);
            var frame22,
            rect22 = cc.rect(0, 0, 80, 80),
            moving_frames22 = [];
            for (var i = 0; i < 5; i++) {
                rect22.x = 80 + i * 80;
                frame22 = cc.SpriteFrame.create(tex22, rect22);
                moving_frames22.push(frame22);
            }
            var moving_animation22 = cc.Animation.create(moving_frames22, 0.05);
            var normal_runAction22 = cc.RepeatForever.create(cc.Animate.create(moving_animation22));
            panda2.runAction(normal_runAction22);
            
        }else if(ALIVE && cc.pDistance(panda3.getPosition(),shit3.getPosition()) < MINDIS){
            this.stopGame();
            //panda3 dead
            var tex33 = cc.textureCache.addImage(res.Dead_png);
            var frame33,
            rect33 = cc.rect(0, 0, 80, 80),
            moving_frames33 = [];
            for (var i = 0; i < 5; i++) {
                rect33.x = 80 + i * 80;
                frame33 = cc.SpriteFrame.create(tex33, rect33);
                moving_frames33.push(frame33);
            }
            var moving_animation33 = cc.Animation.create(moving_frames33, 0.05);
            var normal_runAction33 = cc.RepeatForever.create(cc.Animate.create(moving_animation33));
            panda3.runAction(normal_runAction33);
        }
        
    },
    setShit:function(dt){
        var size = cc.director.getWinSize();
        var moveTo1 = cc.MoveTo.create(3, cc.p(0 - 40 - Math.random()*1200 - Grade * 30, size.height * 3 / 4 - 10));
        var clearE1 =  cc.CallFunc.create(function(){
            shit1.x = size.width + 40;
            shit1.y = size.height * 3 / 4 - 8;
        },this);
        shit1.runAction(cc.Sequence.create(moveTo1, clearE1));
        
        
        var moveTo2 = cc.MoveTo.create(3, cc.p(0 - 40 - Math.random()*800 - Grade * 20, size.height * 1 / 2 - 10));
        var clearE2 =  cc.CallFunc.create(function(){
            shit2.x = size.width + 40;
            shit2.y = size.height * 1 / 2 - 8;
        },this);
        shit2.runAction(cc.Sequence.create(moveTo2, clearE2));  

        var moveTo3 = cc.MoveTo.create(3, cc.p(0 - 40 - Math.random()*400 - Grade * 10, size.height * 1 / 4 - 10));
        var clearE3 =  cc.CallFunc.create(function(){
            shit3.x = size.width + 40;
            shit3.y = size.height * 1 / 4 - 8; 
            //成绩
            gradeLabel.removeFromParent();
            gradeLabel = cc.LabelTTF.create("~Nono已经躲过 " + ++Grade + " 波大便的进攻！~", "Arial", 38);
            gradeLabel.x = size.width / 2;
            gradeLabel.y = size.height * 1 / 10;
            gradeLabel.setColor(cc.color(220,0,0));
            this.addChild(gradeLabel, 11);
            
        },this);
        shit3.runAction(cc.Sequence.create(moveTo3, clearE3));
    },
    setCloud:function(dt){
        var size = cc.director.getWinSize();
        var moveTo = cc.MoveTo.create(5, cc.p(0 - 40 - Math.random()*1000, Math.random() * (size.height-60) +  60));
        var clearE =  cc.CallFunc.create(function(){
            cloud.x = size.width + 60;
            cloud.y = Math.random() * (size.height-60) +  60;
        },this);
        cloud.runAction(cc.Sequence.create(moveTo, clearE));
    },
    stopGame:function(){
        cc.log("stopGame ~ !");
        ALIVE = false;
        touchAble = false;
        this.unscheduleAllCallbacks();
        panda1.stopAllActions();
        panda2.stopAllActions();
        panda3.stopAllActions();
        shit1.stopAllActions();
        shit2.stopAllActions();
        shit3.stopAllActions();
        cloud.stopAllActions();
        this.endGame();
        //计分
        if(Grade > 0){
            var percent;
            if (Grade > 30) percent = 99;
            else if (Grade > 20) percent = Math.round(90 + Grade - 19);
            else if (Grade > 10) percent = Math.round(80 + Grade - 9);
            else if (Grade > 5) percent = Math.round(50 + Grade * 3);
            else percent = Math.round(Math.random()* Grade * 8 + Grade);
            share(1, Grade, percent);
        }else{
            share(2, 0, 0);
        }
        
        setTimeout(this.stopAction, 2000);
    },
    stopAction:function(){
        touchAble = true;
    },
    endGame:function(){
        cc.log("endGame ~ !");
        //show share UI 

        var share = new ShareUI();
        cc.director.getRunningScene().addChild(share,15);


     // this.restartGame(context);
 },
 restartGame:function(context){
    cc.log("restartGame ~ !");
    panda1.removeFromParent();
    panda2.removeFromParent();
    panda3.removeFromParent();
    shit1.removeFromParent();
    shit2.removeFromParent();
    shit3.removeFromParent();
    gradeLabel.removeFromParent();
    context.startGame();
}

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var res = {
    PandaCar_png : "res/panda_car.png",
    PandaRun_png : "res/panda_happyrunning.png",
    PandaFire_png : "res/panda_firerun.png",
    PandaStu_png : "res/panda_sturun.png",
    Ground_png : "res/ground.png",
    Shit1_png : "res/shit1.png",
    Shit2_png : "res/shit2.png",
    Dead_png : "res/panda_scared.png",
    Cloud_png : "res/cloud.png"

};

var g_resources = [
                   //image
                   res.PandaCar_png,
                   res.PandaRun_png,
                   res.PandaFire_png,
                   res.PandaStu_png,
                   res.Ground_png,
                   res.Shit1_png,
                   res.Shit2_png,
                   res.Dead_png,
                   res.Cloud_png
                   //plist

                   //fnt

                   //tmx

                   //bgm

                   //effect
                   ];