/*
@ author:    Mr.zhang;
@ describe : 拼图主页面
@ date:      2019-5-20
 */

// removeAllChildren()      //通过父节点移除所有的子节点，括号传的是布尔值
// 2.把绘制图片的逻辑封装成为函数，阶数

var count = 0;
var PuzzleLayer = cc.Layer.extend({
    cellList:[],
    dataList:[],

    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.DIR = [-cc.vv.LINE,cc.vv.LINE,-1,+1]
        this.blackIndex = cc.vv.TOTAL-1;
        this.cloneDataList = [];
        this.path = [];
        //添加一个有色层
        var  colorBg = new cc.LayerGradient(cc.color(123,23,55),cc.color(45,255,89),cc.p(0,1))
        this.addChild(colorBg)
        var gameBg = new cc.Sprite(res.bg);
        gameBg.attr({
            x:size.width/2,
            y:size.height/2
        })
        this.addChild(gameBg)
        //添加拼图区域

        var spr = new cc.Sprite(res.level1)
        cc.vv.wid = spr.width / cc.vv.LINE;
        cc.vv.hei = spr.width / cc.vv.ROW;

        var area = cc.size(spr.width + (cc.vv.LINE-1)*cc.vv.GAP,
            spr.height + (cc.vv.LINE-1)*cc.vv.GAP
        )
        // 计算基准点坐标
        this.basePoint = cc.p(
            ( size.width - area.width + cc.vv.wid )/2,
            ( size.height + area.height - cc.vv.hei)/2
        )
        // p拼图的裁剪
        for(var i = 0; i < cc.vv.TOTAL; i++ ){
            this.dataList[i] = i
        }
        this.home = this.dataList.join("")
        // cc.log(this.dataList)
        // console.log(this.home);
        for(var i = 0; i <this.dataList.length; i++ ){
            var row1 =  parseInt( this.dataList[i]/cc.vv.LINE );
            var line1 = parseInt(this.dataList[i] % cc.vv.LINE );
            var row2=   parseInt( i/cc.vv.LINE );
            var line2 = parseInt(i % cc.vv.LINE );
            var rect = cc.rect(
                0+cc.vv.wid*line1,
                0+cc.vv.hei*row1,
                cc.vv.wid,
                cc.vv.hei);
                var cell = new Cell(res.level1,rect)
                var pos = cc.p(
                    this.basePoint.x + line2*(cc.vv.wid +cc.vv.GAP),
                    this.basePoint.y - row2*(cc.vv.hei +cc.vv.GAP)
                )
                if( i == cc.vv.TOTAL-1){
                    cell.color = cc.color.BLACK;
                }
                cell.setPosition(pos)
                this.addChild(cell);
                this.cellList.push(cell)

        }
        cc.log( this.cellList)
        // console.log(this.dataList);



         // 测试按钮
         this.testButton = new ccui.Button();
         this.testButton.setTouchEnabled(true);
         this.testButton.setPressedActionEnabled(true);
         this.testButton.loadTextures(res.break);
         this.testButton.x = size.width/2;
         this.testButton.y = size.height/2-300;
         this.testButton.addTouchEventListener(this.touchEvent, this);
         this.addChild(this.testButton);

         //选关按钮
        this.scheduleLabel = new cc.LabelTTF("第一关",'',35);
        this.scheduleLabel.x = size.width/2;
        this.scheduleLabel.y = size.height-30;
        this.addChild(this.scheduleLabel);
        var menu1 = new cc.MenuItemImage(
            res.add_1,
            res.add_2,
            function () {

            },
            this)
        menu1.attr({
            x:100,
            y:size.height-100,
            scale:2
        })
        var menu2 = new cc.MenuItemImage(
            res.minus1,
            res.minus2,
            function () {

            },
            this)
        menu2.attr({
            x:size.width-100,
            y:size.height-100,
            scale:2
        })
        var menu  = new cc.Menu(menu1,menu2);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);
        return true;
    },

    // 打乱方法
    disturb:function () {
        var step = 80;
        var blackIndex2 =15 ;
        for(var i = 0; i < 16; i++ ){
            this.cloneDataList[i] = i;
        }
        //cc.vv.LINE *2 *2*10;
        while(step) {
            var keys = Object.keys(cc.vv.DIR)
            var dir = cc.vv.DIR[keys[parseInt(Math.random() * keys.length)]]
            var target = blackIndex2 + dir;
            if (this.checkIndex(blackIndex2, dir)) {
                this.path.push(dir)
                var temp = this.cloneDataList[blackIndex2];
                this.cloneDataList[blackIndex2] = this.cloneDataList[target];
                this.cloneDataList[target] = temp;
                blackIndex2 = target;
                step -= 1;

            }
        }///666666666
        cc.log(this.path);
        //由于上面是模拟移动。目的是为了获取路径
        this.autoMove();
    },

    Restore:function () {
        var s = new STATE(this.dataList,this.cloneDataList,{},this.blackIndex,null,0);
        var s1 = new STATE(this.cloneDataList,this.dataList,{},this.blackIndex,null,0);
        // cc.log(s)
        this.path = Controller(s,s1)
        this.autoMove()

    },
    autoMove:function () {
        var dir = this.path.shift();
        var target = this.blackIndex + dir;
        this.exchange(target)
    },
    exchange:function (target) {

        var temp = this.cellList[this.blackIndex]
        this.cellList[this.blackIndex] = this.cellList[target]
        this.cellList[target]  = temp;

        var pos1 =this.cellList[this.blackIndex].getPosition();
        var pos2 =this.cellList[target].getPosition();

        var callback = cc.callFunc(function () {
            this.blackIndex = target;
            if(this.path.length > 0){
                this.autoMove()
            }
        }.bind(this))

        this.cellList[this.blackIndex].runAction(
            cc.moveTo(0.1,pos2)
        )
        this.cellList[target].runAction(
            cc.sequence(
                cc.delayTime(0.1),
                cc.moveTo(0.1,pos1),
                //或者不用延迟，把0.1设置为多一点点的时间
                callback
            )
        )

    },
    //检查是否复原
    checkRestore:function () {
        return this.dataList.join("") === this.home;
    },
    //返回初始位置
    goHome:function () {
        while(parseInt(this.blackIndex/cc.vv.LINE) < (cc.vv.LINE-1)){
            this.exchange(this.DIR[4])
        }
        while (parseInt( this.blackIndex % cc.vv.LINE) < (cc.vv.LINE-1)){
            this.exchange(this.DIR[2])                    
        }
    },
    //检查有没有越界
    checkIndex:function (blackIndex,dir) {
        var row  =parseInt(blackIndex/cc.vv.LINE);
        var line = parseInt(blackIndex % cc.vv.LINE)
        if(Math.abs(dir)=== 1){
            return line + dir >= 0 && line + dir < cc.vv.LINE
        }else {
            return row + dir/cc.vv.LINE >= 0 && row + dir/cc.vv.LINE < cc.vv.ROW
        }
    },
    //交换
    touchEvent:function (sender,type) {
        // switch (type) {
        //     case ccui.Widget.TOUCH_BEGAN:
        //         cc.log("1");
        //         break;
        //
        //     case ccui.Widget.TOUCH_MOVED:
        //         cc.log("2");
        //         break;
        //
        //     case ccui.Widget.TOUCH_ENDED:
        //         cc.log("3");
        //         break;
        //
        //     case ccui.Widget.TOUCH_CANCELED:
        //         cc.log("4")
        //         break;
        //
        //     default:
        //         break;
        // }
        if(type == ccui.Widget.TOUCH_ENDED){
           if( count == 0){
               this.testButton.loadTextures(res.recover);
               this.disturb()
               count ++
           }else {
               this.testButton.loadTextures(res.break);
               this.Restore()
               count = 0
           }

           //  var i =  parseInt( count/cc.vv.LINE );
           //  var j =  parseInt( count%cc.vv.LINE );
           //  var cell = new cc.Sprite(res.level_1,cc.rect(cc.vv.wid*j,cc.vv.hei*i,cc.vv.wid,cc.vv.hei));
           // var pos = cc.p(
           //     this.basePoint.x + j*(cc.vv.wid +cc.vv.GAP),
           //     this.basePoint.y - i*(cc.vv.hei +cc.vv.GAP)
           // )

        }
    }
});

var PuzzleScene =cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PuzzleLayer();
        this.addChild(layer);
        // var s = new STATE([0,1,2,3,4,5,6,7,8],[0,1,2,3,4,5,6,8,7],{},8,null,0);
        // cc.log(s)
    }
})