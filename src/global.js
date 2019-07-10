//   一些变量
//单利模式
cc.vv = cc.vv|| {

}

//拼图的阶数
cc.vv.LINE = 4;
cc.vv.ROW = 4;
cc.vv.TOTAL = cc.vv.LINE*cc.vv.ROW;
//关卡
cc.vv.LEVEL = 1;
// 拼图之间的间隙
cc.vv.GAP = 5;
// 4个方向
cc.vv.DIR = {
    up:-cc.vv.LINE,
    DOWN:cc.vv.LINE,
    LEFT:-1,
    RIGHT:1
}

//碎图的宽高
cc.vv.hei = undefined;
cc.vv.wid =undefined;