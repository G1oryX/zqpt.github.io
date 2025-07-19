var DATA=Datas();
function Datas() {
    var TABLE_HEADER_ORDER=[1,2,5,3,4,7,6];//表头显示顺序，调整为游戏内顺序
    var datas=[];
    if (!window.JSON) {
        window.JSON = { 
            parse: function (sJSON) { return eval('(' + sJSON + ')'); },
            stringify: function(array) {
                var i,j,e,s;
                s='[';
                for (i = 0; i < 47; i++) {
                    e = array[i].toString();
                    s+='"'+e+'",';
                }
                for (i=47;i<94;i++) {s=s+'[';
                    for (j = 0; j < 7; j++) {
                        e=array[i][j];
                        s=s+ e.toString();
                        if (j==6) {break;}
                        s+=',';
                    }
                    if (i==93) {break;}
                    s+='],';
                }
                return s+']]';
            }
        };
    }
    function readJsonFile(content) {
        try {
            var fileDatas = JSON.parse(content);
            if (fileDatas.length != 94) { throw new Error("json格式不符"); }
            var datas = DATA.initDatas();
            var value,i,j;
            for (i = 0; i < 47; i++) {
                datas[i] = String(fileDatas[i]).substring(0, 8);
            }
            for (i = 47; i < 94; i++) {
                if (fileDatas[i].length != 7) { throw new Error("json格式不符"); }
                for (j = 0; j < 7; j++) {
                    value = String(fileDatas[i][j]).substring(0, 1);
                    datas[i][j] = /^[0-9]$/.test(value) ? parseInt(value) : 0;
                }
            }
            DATA.setTableDatas(datas, datas);
        } catch (e) {
            alert("读取json文件失败"+e.message);
        }
    }
    return {
        getDatas:function() {return datas;},
        setDatas:function(newDatas) {datas=newDatas;},
        initDatas:function (oldDatas) {
            var datas=[];
            for (var i = 0; i < 47; i++) {
                datas[i]=!oldDatas ? "成员名称"+String(i+1) : oldDatas[i];
                datas[i+47]=[0,0,0,0,0,0,0];
            }
            return datas;
        },
        getTableDatas:function() {
            var table=document.getElementById("zqpt");
            var i,j,k,cells,text,value,datas=this.initDatas();
            var rows = table.getElementsByTagName("tr");
            for(i=2;i<rows.length;i++) {
                cells = rows[i].getElementsByTagName("td");
                text=cells[1].getElementsByTagName("input");
                value=text[0].value.substring(0,8);
                datas[i-2]=value;
                for (j=2; j < cells.length; j++) {
                    text=cells[j].getElementsByTagName("input");
                    value=text[0].value.substring(0,1);
                    k=TABLE_HEADER_ORDER[j-2]-1;
                    datas[i+45][j-2] = /^[0-9]$/.test(value) ? parseInt(value) : 0;
                }
            }
            return datas;
        },
        setTableDatas:function(oldDatas,newDatas) {
            var i,j,k,cells,text;
            var table=document.getElementById("zqpt");
            var rows = table.getElementsByTagName("tr");
            for(i=2;i<rows.length;i++) {
                cells = rows[i].getElementsByTagName("td");
                text=cells[1].getElementsByTagName("input");
                text[0].value=newDatas[i-2];
                for(j=2;j<cells.length;j++) {
                    text=cells[j].getElementsByTagName("input");
                    k=TABLE_HEADER_ORDER[j-2]-1;
                    if (oldDatas[i+45][k]==newDatas[i+45][k]){
                        text[0].style.backgroundColor="white";
                    } else {
                        text[0].style.backgroundColor="red";
                    }
                    text[0].value=newDatas[i+45][k];
                }
            }
        },
        clearDatas:function(isInit) {
            var datas=isInit ? this.initDatas() : this.initDatas(this.getTableDatas());
            this.setTableDatas(datas,datas);
        },
        getHeader:function() {return TABLE_HEADER_ORDER;},
        loadDatas:function(file) {
            try {
                reader = new FileReader();
                reader.onload = function(e) {
                    var content = e.target.result;
                    readJsonFile(content);
                }
                reader.readAsText(file);
            } catch (error) {
                if (window.ActiveXObject) {
                    try {
                        var fso = new ActiveXObject("Scripting.FileSystemObject");
                        var objFile = fso.GetFile(file);
                        var readFile = objFile.OpenAsTextStream(1, -2);
                        var content = readFile.ReadAll();
                        readJsonFile(content);
                    } catch (e) {
                        alert("Error: " + e.message);
                    } finally {
                        if (readFile) {readFile.Close();}
                    }
                } else {
                    alert("无法读取文件，请使用新版本的浏览器！");
                }
            }
        },
        saveDatas:function() {
            var datas=this.getTableDatas();
            if (window.ActiveXObject) {
                try {
                    var blob = new ActiveXObject("ADODB.Stream");
                    blob.Type = 2;
                    blob.Open();
                    blob.WriteText(JSON.stringify(datas));
                    blob.SaveToFile("table.json", 2);
                    alert("表格数据已成功保存到table.json");
                } catch (error) {
                    alert("写入table.json失败");
                } finally {
                    if (blob) {blob.Close();}
                }
            } else {
                var textToDownload=JSON.stringify(datas);
                var textToBLOB = new Blob([textToDownload], { type: 'text/plain' });
                if (navigator.msSaveBlob) {
                    window.navigator.msSaveOrOpenBlob(textToBLOB, "table.json");
                } else {
                    var src = URL.createObjectURL(textToBLOB);
                    var a = document.createElement('a');
                    a.href = src;
                    a.download = "table.json"; // 设置下载文件的名称
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a); // 清理DOM
                    URL.revokeObjectURL(src); // 释放URL对象
                }
            }
        }
    }
}