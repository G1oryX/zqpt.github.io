var DRAW=Draw();
function Draw() {
    //CANVAS显示画面异常时用户可自行调整数值。
    //CANVAS长度和高度，旋转中心X坐标和Y坐标，格子大小和间隙。
    var CANVAS=[800,600,300,300,25,2];
    var DRAW_COLORS=["rgb(0,0,0)","rgb(255, 0, 0)","rgb(255,255,0)","rgb(0,255,0)","rgb(127,127,127)",
        "rgb(255,255,0)","rgb(128,128,0)","rgb(255,0,0)","rgb(255,255,255)"];//图块颜色
    var dpr = window.devicePixelRatio || 1;
    return {
        init:function() {
            var CELL_NAME=["空白","亭子","月桂树","耕牛","房屋","稻田","草地","枫树","墙壁"];//格子名称
            var i,j,e,table,tr,text,result;
            var canvas = document.getElementById("mycanvas");
            table=document.getElementById("zqpt");
            tr='<tr><td>序号</td><td>成员名称</td>';
            var TABLE_HEADER_ORDER=DATA.getHeader();
            for (i = 0; i < TABLE_HEADER_ORDER.length; i++) {
                tr += '<td>' + CELL_NAME[TABLE_HEADER_ORDER[i]] + '</td>';
            }
            text = tr +'</tr>';
            for(i=0;i<47;i++) {j=i+1;
                tr='<tr><td>'+j.toString()+'</td><td><input type="text" maxlength="8" size="16" tabindex="-1"></td>';
                for (j=0;j<7;j++) {tr+='<td><input type="text" maxlength="1" size="1" onchange="handleChanged(this);"></td>';}
                text=text+tr+"</tr>";
            }
            result=insertTableHTML(table,text);
            if (result!=null) {
                document.getElementById("tip").insertAdjacentElement("afterend",result);
            }
            tr='<tr><td>图例</td>';
            table=document.getElementById("map");
            for (i = 0; i < CELL_NAME.length-1; i++) {
                e = CELL_NAME[i];
                tr+='<td><span>'+e+'</span></td>';
            }
            text=tr+'</tr>';
            result=insertTableHTML(table,text);
            if (result!=null) {
                canvas.insertAdjacentElement("beforebegin",result);
            }
            var spans=document.getElementById("map").getElementsByTagName("span");
            for (i=0;i<spans.length;i++) {
                spans[i].style.backgroundColor=DRAW_COLORS[i];
                if (i==1 || i==2) {spans[i].style.border="2px solid black";}
            }
            spans[0].style.color="white";
            var canvas = document.getElementById("mycanvas");
            try {
                this.initCanvas(canvas);
            } catch (error) {
                CANVAS=null;
                var text='',tr;
                for (i = 0; i < 19; i++) {
                    tr='<tr>';
                    for (j = 0; j < 13; j++) {
                        tr+='<td></td>';
                    }
                    text=text+tr+'</tr>';
                }
                document.getElementsByTagName("hr")[0].insertAdjacentElement("beforebegin",insertTableHTML(canvas,text));
            }
            if (CANVAS==null) {
                table=document.getElementById("canvasset");
                try {
                    table.remove();
                } catch (error) {
                    table.removeNode(true);
                }
            }
        },
        draw:function (map) {
            var i,j,k,l;
            var canvas = document.getElementById('mycanvas');
            if (CANVAS!=null) {
                //使用Canvas
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,canvas.clientWidth,canvas.height);
                var cellSize=CANVAS[4];
                var gap=CANVAS[5];
                for (i = 0; i < 16; i++) {
                    for (j = 0; j < 16; j++) {
                        k=map[i+1][j+1];
                        ctx.fillStyle = DRAW_COLORS[k]; // 格子颜色
                        ctx.fillRect(j * (cellSize + gap), i * (cellSize + gap), cellSize, cellSize);
                        if (k==1 || k==2) {//亭子和月桂树加边框
                            ctx.strokeRect(j * (cellSize + gap), i * (cellSize + gap), cellSize, cellSize);
                        }
                    }
                }
            } else {
                //使用table
                var CELL_NAME=["空","亭","月","牛","屋","田","草","树"];//格子简称
                var trs=canvas.getElementsByTagName("tr");
                var tds=[];
                var x,y,z;
                for(i=0;i<trs.length;i++) {
                    tds[i]=trs[i].getElementsByTagName("td");
                }
                for (i=0;i<18;i++) {
                    if (i==0 || i==17) {k=0;l=0;} else {
                        k=i<10 ? 11-i : i-9;
                        l=i<8 ? 2*i-1 : i>10 ? 33-2*i : 13;
                    }
                    x=i>=10 ? 18 : i*2-2;
                    y=i>10 ? (i-10)*2: 0;
                    for (j=0;j<l;j++) {
                        z=map[i][j+k];
                        tds[x][y].innerText=CELL_NAME[z];
                        tds[x][y].style.backgroundColor=DRAW_COLORS[z];
                        x--;y++;
                    }
                }
            }
        },
        initCanvas:function(canvas) {
            canvas.width = CANVAS[0] * dpr;
            canvas.height = CANVAS[1] * dpr;
            canvas.style.width = CANVAS[0] + 'px';
            canvas.style.height = CANVAS[1] + 'px';
            var ctx = canvas.getContext('2d');//不支持canvas此句将报错
            ctx.scale(dpr, dpr);
            ctx.translate(CANVAS[2], CANVAS[3]);
            ctx.rotate(-Math.PI / 4);
            ctx.translate(-CANVAS[2], -CANVAS[3]);
        },
        canvasSet:function(status) {
            if (CANVAS!=null) {
                var table=document.getElementById("canvasset");
                if (status==4) {
                    document.getElementById("mycanvas").style.display='block';
                    table.style.display='block';
                    var i,input=table.getElementsByTagName("input");
                    for (i=0;i<input.length;i++) {
                        input[i].value=String(CANVAS[i]);
                    }
                } else {
                    table.style.display='none';
                }
            }
        },
        isPreview:function() {return CANVAS!=null;},
        applySet:function(newCanvas) {
            if (CANVAS!=null) {
                CANVAS=newCanvas;
                this.initCanvas(document.getElementById("mycanvas"));
            }
        }
    }
}

function insertTableHTML(table,text) {
    try {
        if (table.nodeName === "TABLE" || table.tagName === "TABLE") {
            table.innerHTML+=text;
        } else {
            throw new Error("");
        }
        return null;
    } catch (error) {
        //部分老浏览器tbody的innerHTML为只读属性，不能直接修改
        var div=document.createElement("div");
        div.innerHTML='<table id="'+table.id+'">'+table.innerHTML+text+'</table>';
        try {
            table.remove();
        } catch (error) {
            //兼容老浏览器
            table.removeNode(true);
        }
        return div;
    }
}