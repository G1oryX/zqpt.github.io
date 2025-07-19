var P_KB=0;//空白
var P_TZ=1;//亭子
var P_YGS=2;//月桂树
var P_GN=3;//耕牛
var P_FW=4;//房屋
var P_DT=5;//稻田
var P_CD=6;//草地
var P_FS=7;//枫树
var P_QB=8;//墙壁

function calc(maps) {
    var total=0;
    var score=0;
    var MAP_START=[0,10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,0];
    var MAP_LENGTH=[0,1,3,5,7,9,11,13,13,13,13,11,9,7,5,3,1,0];
    function getMapScore(map) {
        var i,j,k,x,y,l=[0,0,0,0],base=[],buff=[],cbuff=[],arr=[];
        for (i=0;i<18;i++) {base[i]=[];buff[i]=[];cbuff[i]=[];
            for (j=0;j<18;j++) {base[i][j]=0;buff[i][j]=100;cbuff[i][j]=100;}
        }

        //初始化基础得分和加成得分
        for (i=1;i<17;i++) {
            for (j=MAP_START[i];j<17;j++) {k=map[i][j];
                if (k==P_FS || k==P_GN || k==P_DT || k==P_CD || k==P_FW) {base[i][j]=50;}
            }
        }
        for (i=2;i<16;i++) {
            for (j=MAP_START[i];j<16;j++) {
                l=[map[i][j],map[i+1][j],map[i][j+1],map[i+1][j+1]];
                if (l[0]== P_TZ && l[1]==P_TZ && l[2]==P_TZ && l[3]==P_TZ) {
                    base[i][j]=200;
                    buff[i][j]=10000+i*100+j;
                    buff[i+1][j+1]=10000+i*100+j;
                    buff[i+1][j]=10000+i*100+j;
                    buff[i][j+1]=10000+i*100+j;
                }
                if (l[0]== P_YGS && l[1]==P_YGS && l[2]==P_YGS && l[3]==P_YGS) {
                    base[i][j]=150;
                    buff[i][j]=10000+i*100+j;
                    buff[i+1][j+1]=10000+i*100+j;
                    buff[i][j+1]=10000+i*100+j;
                    buff[i+1][j]=10000+i*100+j;
                }
            }
        }
        
        //计算自身加成得分
        for (i=1;i<17;i++) {
            for (j=MAP_START[i];j<17;j++) {
                k=map[i][j];
                if (k==P_GN || k==P_DT || k==P_FW) {
                    arr=[map[i-1][j]==P_GN || map[i-1][j]==P_DT,map[i+1][j]==P_GN || map[i+1][j]==P_DT,
                        map[i][j-1]==P_GN || map[i][j-1]==P_DT,map[i][j+1]==P_GN || map[i][j+1]==P_DT
                    ];
                    y=0;for(x=0;x<arr.length;x++) {
                        if (arr[x]) {y++;}
                        if (y>=2) {
                            if (k==P_GN || k==P_DT) {buff[i][j]+=200;} else {buff[i][j]+=400;}
                            break;
                        }
                    }
                }
            }
        }
        for (i=2;i<16;i++) {
            for (j=MAP_START[i];j<16;j++) {
                l=[map[i][j],map[i+1][j],map[i][j+1],map[i+1][j+1]];
                if (l[0]== P_TZ && l[1]==P_TZ && l[2]==P_TZ && l[3]==P_TZ) {
                    arr=[map[i-1][j]==P_GN || map[i-1][j]==P_DT,map[i+2][j]==P_GN || map[i+2][j]==P_DT,
                        map[i][j-1]==P_GN || map[i][j-1]==P_DT,map[i][j+2]==P_GN || map[i][j+2]==P_DT,
                        map[i-1][j+1]==P_GN || map[i-1][j+1]==P_DT,map[i+2][j+1]==P_GN || map[i+2][j+1]==P_DT,
                        map[i+1][j-1]==P_GN || map[i+1][j-1]==P_DT,map[i+1][j+2]==P_GN || map[i+1][j+2]==P_DT
                    ];
                    y=0;for(x=0;x<arr.length;x++) {
                        if (arr[x]) {y++;}
                        if (y>=2) {cbuff[i][j]+=100;break;}
                    }
                    arr=[map[i-1][j]==P_FW,map[i+2][j]==P_FW,map[i][j-1]==P_FW,map[i][j+2]==P_FW,
                        map[i-1][j+1]==P_FW,map[i+2][j+1]==P_FW,map[i+1][j-1]==P_FW,map[i+1][j+2]==P_FW
                    ];
                    y=0;for(x=0;x<arr.length;x++) {
                        if (arr[x]) {y++;}
                        if (y>=2) {cbuff[i][j]+=100;break;}
                    }
                    arr=[map[i-1][j]==P_FS, map[i+2][j]==P_FS,map[i][j-1]==P_FS,map[i][j+2]==P_FS,
                        map[i-1][j+1]==P_FS,map[i+2][j+1]==P_FS,map[i+1][j-1]==P_FS,map[i+1][j+2]==P_FS
                    ];
                    y=0;for(x=0;x<arr.length;x++) {
                        if (arr[x]) {y++;}
                        if (y>=2) {cbuff[i][j]+=100;break;}
                    }
                }
            }
        }

        //计算环绕加成得分
        for (i=1;i<17;i++) {
            for (j=MAP_START[i];j<17;j++) {k=map[i][j];
                if (k==P_GN) {//耕牛
                    if (map[i-1][j-1]==P_GN || map[i-1][j-1]==P_DT) {buff[i-1][j-1]+=30;}
                    if (map[i+1][j+1]==P_GN || map[i+1][j+1]==P_DT) {buff[i+1][j+1]+=30;}
                    if (map[i][j+1]==P_GN || map[i][j+1]==P_DT) {buff[i][j+1]+=30;}
                    if (map[i][j-1]==P_GN || map[i][j-1]==P_DT) {buff[i][j-1]+=30;}
                    if (map[i+1][j]==P_GN || map[i+1][j]==P_DT) {buff[i+1][j]+=30;}
                    if (map[i-1][j]==P_GN || map[i-1][j]==P_DT) {buff[i-1][j]+=30;}
                    if (map[i-1][j+1]==P_GN || map[i-1][j+1]==P_DT) {buff[i-1][j+1]+=30;}
                    if (map[i+1][j-1]==P_GN || map[i+1][j-1]==P_DT) {buff[i+1][j-1]+=30;}
                }
                if (k==P_CD) {//草地
                    var x,y,z,u,v;l=[0];
                    for (x=i-1;x<=i+1;x++) {
                        for (y=j-1;y<=j+1;y++) {z=buff[x][y];
                            if (z<10000) {buff[x][y]+=20;} else {
                                if (!l.includes(z)) {
                                    l.push(z);
                                    u=(z-10000) % 100;
                                    v=(z-10000-u) / 100;
                                    cbuff[v][u]+=20;
                                }
                            }

                        }
                    }
                    buff[i][j]-=20;
                }
                if (k==P_FS) {//枫树
                    if (map[i-1][j-1]==P_GN || map[i-1][j-1]==P_DT || map[i-1][j-1]==P_FW) {buff[i-1][j-1]+=50;}
                    if (map[i+1][j+1]==P_GN || map[i+1][j+1]==P_DT || map[i+1][j+1]==P_FW) {buff[i+1][j+1]+=50;}
                    if (map[i][j+1]==P_GN || map[i][j+1]==P_DT || map[i][j+1]==P_FW) {buff[i][j+1]+=50;}
                    if (map[i][j-1]==P_GN || map[i][j-1]==P_DT || map[i][j-1]==P_FW) {buff[i][j-1]+=50;}
                    if (map[i+1][j]==P_GN || map[i+1][j]==P_DT || map[i+1][j]==P_FW) {buff[i+1][j]+=50;}
                    if (map[i-1][j]==P_GN || map[i-1][j]==P_DT || map[i-1][j]==P_FW) {buff[i-1][j]+=50;}
                    if (map[i-1][j+1]==P_GN || map[i-1][j+1]==P_DT || map[i-1][j+1]==P_FW) {buff[i-1][j+1]+=50;}
                    if (map[i+1][j-1]==P_GN || map[i+1][j-1]==P_DT || map[i+1][j-1]==P_FW) {buff[i+1][j-1]+=50;}
                }
            }
        }

        for (i=2;i<16;i++) {//月桂树
            for (j=MAP_START[i];j<16;j++) {
                l=[map[i][j],map[i+1][j],map[i][j+1],map[i+1][j+1]];
                if (l[0]== P_YGS && l[1]==P_YGS && l[2]==P_YGS && l[3]==P_YGS) {
                    var x,y,z,u,v;l=[buff[i][j]];
                    for (y=j-2;y<=j+3;y++) {
                        for (x=i-2;x<=i+3;x++) {
                            z=buff[x][y];
                            if (z<10000) {buff[x][y]+=50;} else {
                            if (!l.includes(z)) {
                                    l.push(z);
                                    u=(z-10000) % 100;
                                    v=(z-10000-u) / 100;
                                    cbuff[v][u]+=50;
                                } 
                            }
                        }
                    }
                }
            }
        }
        
        //计算总分
        var score=0;
        for (i=0;i<18;i++) {
            for (j=0;j<18;j++) {
                if (buff[i][j]<10000) {
                    score+=base[i][j]*buff[i][j];
                } else {
                    score+=base[i][j]*cbuff[i][j];
                }
            }
        }
        return score/100;
    }
    return {
        getTotal:function() {
            if (total==0) {
                var map=[];
                var z,i,j,k,l,cube,base=0,complex=0;
                for (z=0;z<10;z++) {map=maps[z];
                    for (i=0;i<18;i++) {
                        k=MAP_START[i];
                        l=MAP_LENGTH[i];
                        for (j=0;j<l;j++) {
                            cube=map[i][j+k];
                            if (cube==P_TZ || cube==P_YGS) {complex++;} else {if (cube!=P_KB) {base++;}}
                        }
                    }
                }
                total=base+complex/4;
            }
            return total;
        },
        getScore:function() {
            if (score==0) {
                for (i=0;i<10;i++) {score+=getMapScore(maps[i]);}
            }
            return score;
        },
        getMap:function(index) {return maps[index];}
    };
}

function calculate(totals) {//计算最佳拼图
    //初始化
    var i,maps=[];
    //生成地图
    for (i=0;i<10;i++) {maps[i]=initMap();}

    /*
        计算算法
    */

    //计算完毕
    PROGRAM.setCalc(calc(maps));
}

function initMap() {//初始化一张地图
    var map=[];
    var i,j,k,l;
    for (i=0;i<18;i++) {
        map[i]=[];
        if (i==0 || i==17) {k=0;l=0;} else {
            k=i<10 ? 11-i : i-9;
            l=i<8 ? 2*i-1 : i>10 ? 33-2*i : 13;
        }
        for (j=0;j<k;j++) {map[i][j]=P_QB;}
        for (j=0;j<l;j++) {map[i][j+k]=P_GN;}
        for (j=k+l;j<18;j++) {map[i][j]=P_QB;}
    }
    return map;
}