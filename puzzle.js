/*
@ author:    Mr.zhang;
@ describe : 拼图主页面
@ date:      2019-5-20
 */
var count = 0;
var PuzzleLayer = cc.Layer.extend({
        cellList:[],
        dataList:[],
    ctor:function () {
        this._super();
        var size = cc.winSize;

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

        var spr = new cc.Sprite(res.level_1)
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
            this.dataList[i] = i;
        }
        //this.dataList = [5,6,7,8,0,1,2,3,4]
        for(var i = 0; i <this.dataList.length-1; i++ ){
            var row1 =  parseInt( this.dataList[i]/cc.vv.LINE );
            var line1 = parseInt(this.dataList[i] % cc.vv.LINE );
            var row2=   parseInt( i/cc.vv.LINE );
            var line2 = parseInt(i % cc.vv.LINE );
            var rect = cc.rect(
                cc.vv.wid*line1,
                cc.vv.hei*row1,
                cc.vv.wid,
                cc.vv.hei);
            var cell = new Cell(res['level_'+cc.vv.LEVEL],rect)
            var pos = cc.p(
                this.basePoint.x + line2*(cc.vv.wid +cc.vv.GAP),
                this.basePoint.y - row2*(cc.vv.hei +cc.vv.GAP)
            )
            cell.setPosition(pos)
            this.addChild(cell);
        }






            // var cell = new cc.Sprite(res.level_1,cc.rect(0,0,cc.vv.wid,cc.vv.hei));
       //  cell.setPosition(this.basePoint);
       //  this.addChild(cell);
       //  // 测试按钮
       //  var testButton = new ccui.Button();
       //  testButton.setTouchEnabled(true);
       //  testButton.setPressedActionEnabled(true);
       //  testButton.loadTextures(res.add1,res.add2, "");
       //  testButton.x = size.width/2;
       //  testButton.y = size.height/2-300;
       //  testButton.addTouchEventListener(this.touchEvent, this);
       //  this.addChild(testButton);



        return true;
    },
    // touchEvent:function (sender,type) {
    //     // switch (type) {
    //     //     case ccui.Widget.TOUCH_BEGAN:
    //     //         cc.log("1");
    //     //         break;
    //     //
    //     //     case ccui.Widget.TOUCH_MOVED:
    //     //         cc.log("2");
    //     //         break;
    //     //
    //     //     case ccui.Widget.TOUCH_ENDED:
    //     //         cc.log("3");
    //     //         break;
    //     //
    //     //     case ccui.Widget.TOUCH_CANCELED:
    //     //         cc.log("4")
    //     //         break;
    //     //
    //     //     default:
    //     //         break;
    //     // }
    //     if(type == ccui.Widget.TOUCH_ENDED){
    //
    //         var i =  parseInt( count/cc.vv.LINE );
    //         var j =  parseInt( count%cc.vv.LINE );
    //         var cell = new cc.Sprite(res.level_1,cc.rect(cc.vv.wid*j,cc.vv.hei*i,cc.vv.wid,cc.vv.hei));
    //        var pos = cc.p(
    //            this.basePoint.x + j*(cc.vv.wid +cc.vv.GAP),
    //            this.basePoint.y - i*(cc.vv.hei +cc.vv.GAP)
    //        )
    //
    //
    //         cell.setPosition(pos);
    //         this.addChild(cell);
    //         count += 1;
    //     }
    // }
});

var PuzzleScene =cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PuzzleLayer();
        this.addChild(layer);
    }
})