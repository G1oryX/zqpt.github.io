var PROGRAM=Program();
function Program() {
    var index=0;//地图索引
    var status=0;//程序状态
    var Calc=null;//计算状态
    return {
        setCalc:function(calc) {Calc=calc;},
        previousMap:function() {
            if (Calc != null) {
                if (index>0) {index--;}
                this.setStatus(3);
            }
        },
        nextMap:function() {
            if (Calc != null) {
                if (index<9) {index++;}
                this.setStatus(3);
            }
        },
        setStatus:function(newValue) {
            status=newValue;
            document.getElementById("help").style.display=newValue==4 ? 'block' : 'none';
            document.getElementById("tip").style.display=newValue % 2==0 ? 'block' : 'none';
            document.getElementById("zqpt").style.display=newValue % 2==0 ? 'none' : 'block';
            document.getElementById("map").style.display=newValue==3 ? 'block' : 'none';
            document.getElementById("mycanvas").style.display=newValue==3 ? 'block' : 'none';
            var inputs=document.getElementById("zqpt").getElementsByTagName("input");
            (document.getElementsByTagName("b"))[0].innerText=newValue==2 ? "正在计算，请稍等..." : "";
            DRAW.canvasSet(newValue);
            for (var i = 0; i < inputs.length; i++) {inputs[i].readOnly=newValue>1;}
            if (newValue==3) {
                if (Calc!=null) {
                    document.getElementById("info").innerText='总数：'+Calc.getTotal()+'，总分：'+Calc.getScore()+'，第'+String(index+1)+'张图。';
                    DRAW.draw(Calc.getMap(index));
                    window.scrollTo(0,document.body.scrollHeight);
                }
            } else {
                window.scrollTo(0,0);
            }
        },
        getStatus:function() {return status;}
    }
}

window.onload=function() {
    //初始化绘图
    DRAW.init();

    //初始化表格数据
    DATA.clearDatas(true);

    //初始化监听文件，并上传
    var fileInput=document.getElementById("fileInput");
    try {
        fileInput.addEventListener('change', function() {onLoadDatas(fileInput);});
    } catch (error) {
        fileInput.onchange=function() {onLoadDatas(fileInput);}
    }

    //初始化状态
    PROGRAM.setStatus(1);
}

function handleChanged(dom) {//监测表格数据变化
    if (PROGRAM.getStatus()==1) {//只能输入一个数字，非数字设为0
        if (!(/^[0-9]$/.test(dom.value))) {
            dom.value=0;
        }
    }
}

function onHelp() {
    if (PROGRAM.getStatus()==1) {
        PROGRAM.setStatus(4);
    }
}

function onClearDatas() {
    if (PROGRAM.getStatus()==1) {
        DATA.clearDatas(false);
    }
}

function onSaveDatas() {
    if (PROGRAM.getStatus()==1) {
        if (confirm("是否下载文件table.json?")) {
            DATA.saveDatas();
        }
    }
}

function onLoadDatas(dom) {
    var file,fileName,fileExtension;
    if (PROGRAM.getStatus()==1) {
        try {
            file = dom.files[0];
            fileName=file.name;
        } catch (error) {//老浏览器
            file = dom.value;
            var parts = file.split(/[\/\\]/);
            fileName=parts[parts.length - 1];
        }
        if (file) {//获取文件
            fileExtension = fileName.split('.').pop();
            if (fileExtension=="json") {
                DATA.loadDatas(file);
            } else {
                alert("不是标准的json文件");
            }
        }
    }
}

function onPreviousMap() {
    if (PROGRAM.getStatus()==3) {
        PROGRAM.previousMap();
    }
}

function onNextMap() {
    if (PROGRAM.getStatus()==3) {
        PROGRAM.nextMap();
    }
}

function onReturn() {
    if (PROGRAM.getStatus()==3) {
        var datas=DATA.getDatas();
        DATA.setTableDatas(datas,datas);
        DATA.setDatas([]);
        PROGRAM.setCalc(null);
    }
    PROGRAM.setStatus(1);
}

function onCalcScore() {//计算得分
    var CHECK_MAX_RATIO=1.8;
    var CHECK_MIN_VALUE=2;
    var CHECK_MAX_COUNT=15;
    if (PROGRAM.getStatus()==1) {//刷新页面
        PROGRAM.setStatus(2);
        var datas=DATA.getTableDatas();
        var i,j,k,all,full,max,min;
        var totals=[0,0,0,0,0,0,0,0];

        //保存原表格数据
        var newDatas=DATA.initDatas();
        for (i=0;i<47;i++) {
            newDatas[i]=datas[i];
        }
        for (i=47;i<94;i++) {all=0;
            full=false;
            for (j=0;j<5;j++) {
                k=datas[i][j];
                if (k>0) {
                    if (all+k<=CHECK_MAX_COUNT) {
                        all+=k;
                        newDatas[i][j]=k;
                        totals[j]+=k;
                    } else {
                        newDatas[i][j]=CHECK_MAX_COUNT-all;
                        totals[j]+=CHECK_MAX_COUNT-all;
                        full=true;
                        break;
                    }
                }
            }
            if (!full) {
                k=all+datas[i][5]+datas[i][6]-CHECK_MAX_COUNT;
                if (k>0) {//datas[i][5]和datas[i][6]选CHECK_MAX_COUNT-all个
                    newDatas[i][5]=Math.max(0,CHECK_MAX_COUNT-all-datas[i][6]);
                    newDatas[i][6]=Math.max(0,CHECK_MAX_COUNT-all-datas[i][5]);
                    totals[7]+=(CHECK_MAX_COUNT-all-newDatas[i][5]-newDatas[i][6]);
                } else {
                    newDatas[i][5]=datas[i][5];
                    newDatas[i][6]=datas[i][6];
                }
                totals[5]+=newDatas[i][5];
                totals[6]+=newDatas[i][6];
            }
        }

        //总数检查
        console.log(totals);
        max=Math.max(totals[2],totals[3],totals[4],totals[5],totals[6]);
        min=Math.min(totals[2],totals[3],totals[4],totals[5],totals[6]);
        if (min<=CHECK_MIN_VALUE) {
            alert("稻田、房屋、耕牛、草地、枫树。每种总数不能少于"+String(CHECK_MIN_VALUE));
            PROGRAM.setStatus(1);
            return;
        }
        if (max/min > CHECK_MAX_RATIO) {
            alert("稻田、房屋、耕牛、草地、枫树的总数比值不能超过"+String(CHECK_MAX_RATIO));
            PROGRAM.setStatus(1);
            return;
        }
        if (totals[1]*12>totals[5]) {
            alert("草地必须比月桂树总数的12倍还要多！");
            PROGRAM.setStatus(1);
            return;
        }
        if (totals[0]*3>min) {
            alert("基础图块必须比亭子总数的3倍还要多！");
            PROGRAM.setStatus(1);
            return;
        }

        //更新表格数据
        DATA.setDatas(datas);
        DATA.setTableDatas(datas,newDatas);

        //开始计算
        calculate(totals);
        PROGRAM.setStatus(3);
        alert("计算完毕！");
        return;
    }
}

function onPreview() {//预览
    if (PROGRAM.getStatus()==4 && DRAW.isPreview()) {
        DRAW.draw(initMap());
    }
}

function onApply() {//应用
    var MIN=[600,450,0,0,1,0];
    var MAX=[1600,1200,800,600,50,5];
    var newCanvas=[0,0,0,0,0,0];
    if (PROGRAM.getStatus()==4 && DRAW.isPreview()) {
        var table=document.getElementById("canvasset");
        var value,number,input=table.getElementsByTagName("input");
        var i,isOk=true;
        for (i=0;i<input.length;i++) {
            value=input[i].value;
            if (/^\d+$/.test(value)) {
                number=parseInt(value);
                if (number<MIN[i] || number>MAX[i]) {
                    alert("第"+String(i+1)+"个参数取值范围："+String(MIN[i])+"~"+String(MAX[i]));
                    isOk=false;
                } else {
                    newCanvas[i]=number;
                }
            } else {
                isOk=false;
            }
        }
        if (isOk) {
            DRAW.applySet(newCanvas);
            alert("设置成功！");
            DRAW.draw(initMap());
        }
    }
}