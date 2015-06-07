var DEBUG_MODE =false;

/*
 * UI显示类
 */
var FontSize={
    Big: 60,
    Normal: 28,
    Small:24
}
var Gui = {
    getDiv: function(_class, _id) {
        return "<div class='" + _class + "' id='" + _id + "'></div>";
    },
    did: 0,
    drawLineV: function(_yAxis, _did) {
        var n = 0;
        if (!_did) _did = ++Gui.did, n = 1;
        var idCont = "Line" + _did;
        var divCont = Gui.getDiv("LineV", idCont);
        if (n == 1) $("#mainF").append(divCont);
        $("#" + idCont).css("top", _yAxis + "%");
    },
    drawLineH: function(_yAxis, _did) {
        var n = 0;
        if (!_did) _did = ++Gui.did, n = 1;
        var idCont = "Line" + _did;
        var divCont = Gui.getDiv("LineH", idCont);
        if (n == 1) $("#mainF").append(divCont);
        $("#" + idCont).css("left", _yAxis + "%");
    },
    showWords: function(_txt, _x, _y, _fontSize, _did) {
        var n = 0;
        if (!_did) _did = ++Gui.did, n = 1;
        var idCont = "Word" + _did;
        var divCont = Gui.getDiv("Word", idCont);
        if (n == 1) $("#mainF").append(divCont);
        $("#" + idCont).css("top", _x + "%");
        $("#" + idCont).css("left", _y + "%");
        $("#" + idCont).html(_txt);
        if (_fontSize)$("#" + idCont).css("font-size", _fontSize + "px");
    },
    showMsg: function(_txt, _delay) {
        $("#msg").html(_txt);
        if (_delay)setTimeout("$('#msg').html('');", _delay);
    },
    bgHeight: 720,
    bgWidth:4320,
    radioY: 1,
    radioX:1,
    update:function() {
        Gui.radioY = $(window).height() / Gui.bgHeight;
        Gui.radioX = $(window).width() / Gui.bgWidth/Gui.radioY;
    },

    setBg: function (_bSrc,_fSrc) {
        $("#mainB").css("background-image", "url(" + _bSrc + ")");

        if (_fSrc)
            $("#mainF").css("background-image", "url(" + _fSrc + ")");

    },
    deltaX:0,
    scrollBg: function (_deltaPers) {
        var oldLeft = $("#mainB").css("background-position-x");
        Gui.deltaX = parseFloat(oldLeft) + _deltaPers;
        //Update Animation//
        if (_deltaPers > 0) Spirit.statue["Player"] = "right-pic";
        else if (_deltaPers < 0) Spirit.statue["Player"] = "left-pic";
        else Spirit.statue["Player"] = "normal-pic";
        //Update Position//
        if(Gui.deltaX>=0&&Gui.deltaX<=100)
            $("#mainB,#mainF").css("background-position-x",Gui.deltaX + "%");
    }

};
/*
 * 输入输出控制类
 */
var FaceData = {};
var Input = {
    left: 0.0,
    right: 0.0,
    jump: 0.0,
    startjump:0,
    smile:0.0,
    init :function () {
        $("body").keydown(function (_event) {
            switch (_event.which) {
                case 65://A//
                    Input.left = 1.0;
                    break;
                case 68://D//
                    Input.right = 1.0;
                    break;
                case 32://space//
                    Input.startjump = 0;
                    if(Input.jump === 0) {
                        Input.startjump = 1;
                    }
                    Input.jump = 1.0;
                    break;
                case 70://F//
                    Input.smile = 1.0;
                    break;
                default:
                    break;

            }
        });
        $("body").keyup(function (_event) {
            switch (_event.which) {
                case 65://A//
                    Input.left = 0;
                    break;
                case 68://D//
                    Input.right = 0;
                    break;
                case 32://space//
                    Input.jump = 0;
                    Input.startjump = 0;
                    break;
                case 70://F//
                    Input.smile = 0;
                    break;
                default:
                    break;

            }
        });
    },
    faceLastX: 0,
    faceLastY: 0,
    faceS: 100,
    faceDeltaX: 0,
    faceDeltaY:0,
    update: function () {
        var x=0, y=0, s=0;
        if (window.FaceData.face && window.FaceData.face.length > 0) {
            //console.log(window.FaceData);
                x = window.FaceData.face[0].position.center.x,
                y = window.FaceData.face[0].position.center.y,
                s = window.FaceData.face[0].attribute.smiling.value;
           // console.log(x);
            if (Input.faceLastX === 0 && Input.faceLastY === 0) {

                Input.faceDeltaX = x-50;
                Input.faceDeltaY = y-50;
                Input.faceLastX = x;
                Input.faceLastY = y;
                Input.faceS = s;
            } else {
                Input.faceDeltaX = x - 50;
                Input.faceDeltaY = y - 50;
                Input.faceLastX = x;
                Input.faceLastY = y;
                Input.faceS = s;
            }

        }
       Gui.showMsg(x+":"+y+":"+s+"{}"+Input.faceDeltaX + ":" + Input.faceDeltaY + ":" + Input.faceS);
        if (Input.faceDeltaX > 10) Input.right = 1,Input.left=0;
        else if (Input.faceDeltaX < -10) Input.left = 1,Input.right = 0;
        else Input.left=Input.right = 0;
        if (Input.faceS > 50) {
            Input.smile = 1;
        } else {
            Input.smile = 0;
        }

        var v = 5;
        Gui.scrollBg(-Input.left * Time.deltaTime*v + Input.right*Time.deltaTime*v);
    }

}


/*
 * 时间控制类
 */
var Time= {
    deltaTime: 0,
    fixedFps:15,
    fps: 0,
    now: new Date().getTime(),
    showFps:false,
    update:function() {
        var p = new Date().getTime();
        Time.deltaTime = (p - Time.now) / 1000;
        Time.fps = Math.round(1 / Time.deltaTime * 100) / 100;
        if(Time.showFps)
            Gui.showWords(Time.fps + "fps", 30, 50, FontSize.Normal, 1);
        Time.now = p;
    }
}
/*
 * 精灵类
 */
var GameMath= {
    isPointInArea :function(_x, _y, _lx, _rx, _ly, _ry) {
        return _lx <= _x && _x <= _rx && _ly <= _y && _y <= _ry;
    },
    isAreaInteract: function (_lx, _rx, _ly, _ry, _lx2, _rx2, _ly2, _ry2) {
        return GameMath.isPointInArea(_lx, _ly, _lx2, _rx2, _ly2, _ry2) ||
               GameMath.isPointInArea(_lx, _ry, _lx2, _rx2, _ly2, _ry2) ||
               GameMath.isPointInArea(_rx, _ly, _lx2, _rx2, _ly2, _ry2) ||
               GameMath.isPointInArea(_rx, _ry, _lx2, _rx2, _ly2, _ry2) ||
               GameMath.isPointInArea(_lx2, _ly2, _lx, _rx, _ly, _ry) ||
               GameMath.isPointInArea(_lx2, _ry2, _lx, _rx, _ly, _ry) ||
               GameMath.isPointInArea(_rx2, _ly2, _lx, _rx, _ly, _ry) ||
               GameMath.isPointInArea(_rx2, _ry2, _lx, _rx, _ly, _ry);
    }
}
var Spirit = {
    init: function(_src) {
        $.getJSON(_src, function(_data) {
            Spirit.data = _data;

            $.each(_data, function(_i, _item) {
                Spirit.statue[_item.name] = "normal-pic";
                var iid = "spirit-" + _item.name;
                $("#mainB").append("<img class='spirit' id='" + iid + "'/>");
            });
            Spirit.update();
        });
    },
    update: function() {
        //预处理碰撞体，并且转换为相对于窗口百分比//
        var colNum = 0;
        $.each(Spirit.data, function (_i, _item) {
            if (_item.isCollider==="true") {
                var iid = "spirit-" + _item.name;
                var theW = $("#"+iid).width() / $(window).width()*100 ,
                    theH = $("#"+iid).height() / $(window).height()*100 ;
                var x=parseFloat(_item.x), y=parseFloat(_item.y);

                if (_item.type !== "sync")
                    x =(x-Gui.deltaX)/ Gui.radioX;
                ++colNum;
                var t=Spirit.collider[colNum] = {};
                t.hw = theW;
                t.hh = theH;
                t.xl = x;
                t.xr = x + theW;
                t.yl = y;
                t.yr = y + theH;
                t.it = _item;
                t.isTriggered = false;

                _item.colId = colNum;


            }
        });

        //处理//
        $.each(Spirit.data, function(_i, _item) {
            //处理动画//
            var src = _item[Spirit.statue[_item.name]];
            var iid = "spirit-" + _item.name;
            $("#" + iid).attr("src", src);
            var x = parseFloat(_item.x);
            //处理同步X坐标位置//
            if (_item.type !== "sync")
                x = (x - Gui.deltaX) / Gui.radioX;
            //处理重力和碰撞//
            var a=0.0, v=0.0 , y = parseFloat(_item.y), t;
            if (_item.isCollider==="true") {

                a = 0.0, v = _item.v?_item.v:0;
                if (_item.useGravity === "true") {
                    a += 9.8;
                }
                if (_item.name === "Player") {
                    v -= Input.startjump * 1;
                }
                v += a * Time.deltaTime;
                y = parseFloat(_item.y) + v * Time.deltaTime;
                t = Spirit.collider[_item.colId];
                var colFlag = false;
                if (_item.name === "Player")
                for (var i = 1; i <= colNum; ++i) {
                    if (i === _item.colId) continue;
                    var t2 = Spirit.collider[i];

                    //console.log(t2);
                    //console.log("[info]" + _item.name + ":" + t2.it.name);
                    //console.log("xl="+x + ",xr=" + (x + t.hw) + ";in xl'=" + t2.xl + ",xr'=" + t2.xr);
                    //console.log("yl="+y + ",yr=" + (y + t.hh) + ";in yl'=" + t2.yl + ",yr'=" + t2.yr);
                    if (DEBUG_MODE) {
                        Gui.drawLineH(x,1);
                        Gui.drawLineH(x + t.hw, 2);
                        Gui.drawLineV(y, 3);
                        Gui.drawLineV(y + t.hh, 4);


                        Gui.drawLineH(t2.x1, 5);
                        Gui.drawLineH(t2.xr, 6);
                        Gui.drawLineV(t2.yl, 7);
                        Gui.drawLineV(t2.yr, 8);

                    } 
                    if (GameMath.isAreaInteract(x, x + t.hw, y, y + t.hh, t2.xl, t2.xr, t2.yl, t2.yr)) {
                        //console.log("Trigger!" + _item.name + ":" + t2.it.name);
                        
                        if (t2.it.onTriggerEnter) {
                            if (t2.isTriggered===false) {

                                //console.log("Trigger!"+_item.name+":"+t2.it.name);
                                eval(t2.it.onTriggerEnter);
                                t2.isTriggered = true;
                            }
                        } else {
                            //console.log("Col!"+_item.name+":"+t2.it.name);
                            colFlag = true;
                        }
                    } else {
                        t2.isTriggered = false;
                    }
                }
                if (y < 0)y = v=a=0;
                if (colFlag) {
                    y = _item.y;
                    _item.v = 0;
                    _item.a = 0;
                } else {
                    _item.y = y;
                    _item.v = v;
                    _item.a = a;
                }
                if (_item.name==="Player"&&Math.abs(_item.v) > 0.5) {
                    Spirit.statue["Player"] = "jump-pic";
                }

            }
            //处理坐标//
            $("#" + iid).css("left", x + "%");
            $("#" + iid).css("top", y + "%");

        });
    },
    data: {},
    statue: {},
    collider: []
}

/*
 * 流程控制过程
 */
function baseUpdate() {
    Time.update();
    Gui.update();
    Input.update();
    Spirit.update();
    Update();
    setTimeout(baseUpdate, 1000 / Time.fixedFps);
}

$(document).ready(function () {
    if (DEBUG_MODE) {
        Gui.drawLineH(0);
        Gui.drawLineH(0);
        Gui.drawLineV(0);
        Gui.drawLineV(0);
        Gui.drawLineH(0);
        Gui.drawLineH(0);
        Gui.drawLineV(0);
        Gui.drawLineV(0);
    }
    Gui.setBg("map/mapTest.png");
    Input.init();
    Spirit.init("SpiritList1.json");
    baseUpdate();
    Gui.showMsg("请打开摄像头，移动头以移动", 3);
    Start();
});
