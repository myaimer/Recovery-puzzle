var checkIndex = function (blackIndex,dir) {
    var row  =parseInt(blackIndex/cc.vv.LINE);
    var line = parseInt(blackIndex % cc.vv.LINE)
    if(Math.abs(dir)=== 1){
        return line + dir >= 0 && line + dir < cc.vv.LINE
    }else {
        return row + dir/cc.vv.LINE >= 0 && row + dir/cc.vv.LINE < cc.vv.ROW
    }
}
//克隆一个数组
var cloneArr = function (arr) {
    return JSON.parse(JSON.stringify(arr));
}
var autoMove= function(arr){
    while (arr.length){
        var  dir = arr.shift();
        var target = this.blackIndex + dir;
        var temp = this.start.uniqueID[target];
        this.start
    }
}
var checkIsRecover= function (obj1,obj2) {
    return obj1.uniqueID.join('') === obj2.uniqueID.join('');
}

var STATE = cc.Class.extend({
    ctor: function (target, uniqueID, register, blackIndex, par, lastStep,target2) {

        //上一次走的路径
        this.lastStep = lastStep;
        //目标状态
        this.target = target;
        //当前状态的唯一识别码
        this.uniqueID = uniqueID;
        //当前状态的父状态
        this.par = par;
        //父状态演变成当前状态的走位方式
        this.lastStep = lastStep;
        //纪录此前所有出现过的状态,表,其实就是个键值对
        this.register = register;
        //当前状态下黑块下标
        this.blackIndex = blackIndex;
        this.target2 = target2;
    },

//判断自己与目标状态是否相等


//获取当前状态所有的子状态
    getChildren: function () {
        var children = [];
        var key = Object.keys(cc.vv.DIR)

        //todo  查找子状态的逻辑
        for (var i = 0; i < key.length; i++) {
            var dir = cc.vv.DIR[key[i]];
            //判断当前方向是否可移动
            if (checkIndex(this.blackIndex, dir)) {
                var index = this.blackIndex + dir;
                var clone = cloneArr(this.uniqueID);
                var temp = clone[index];
                clone[index] = clone[this.blackIndex];
                clone[this.blackIndex] = temp
                if (!this.register.hasOwnProperty(clone)) {
                    performance['搜索的节点数'] += 1;
                    this.register[clone] = '';
                    this.state = new STATE(this.target, clone, this.register, index , this, dir);
                    this.state2 = new STATE(clone,this.target ,this.register, index , this, dir);

                    children.push(this.state);
                }
            }
        }
        return children;
    },
})
//核心搜索算法，参数必须一个状态对象的数据
var Controller = function(start,start2){
    var t_start = (new Date()).getTime();
    var path = [];                             //定义一个路径
    var path1 = []
    var path2 = []
    var destination = null;
    var destination2 = null;  //定义一个终点

    var curLevel = [start];
    var curLevel2 = [start2];
    search(curLevel,curLevel2);
    function search(nodeList,nodeList2) {
        var temp = [];
        //我们的搜索从第二层开始
        if(nodeList.length >= nodeList2.length ){
            for(var i = 0;i<nodeList.length;i++){
                var children = nodeList[i].getChildren()
                children.forEach(function (value) {
                    temp.push(value);
                })
            }
            curLevel = temp;
        }else {
            for(var i = 0;i<nodeList2.length;i++){
                var children2 = nodeList2[i].getChildren()
                children2.forEach(function (value) {
                    temp.push(value);
                })
            }
            curLevel2 = temp;
        }
        //检查当前节点中有没有我们的目标状态
        for(var i  = 0 ;i <curLevel.length; i++){
            for (var j = 0;j < curLevel2.length;j++){
                if(checkIsRecover(curLevel[i],curLevel2[j])){
                    destination = curLevel[i];
                    destination2 = curLevel2[j];
                    break;
                }
            }
        }
        //查看终点是否找得到
        if(destination && destination2){
            cc.log("成功");
            drawPath();
        }else{
            search(curLevel,curLevel2);
        }
    }
    function drawPath() {
        var p = destination;
        var p2 = destination2;
        while (p.par){
            path1.unshift(p.lastStep);
            p = p.par;
        }
        while (p2.par){
            path2.push((-1)*p.lastStep);
            p2 = p2.par;
        }
        path =path1.concat(path2)
        cc.log(path)
    }
    return path;
}














