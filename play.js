window.onload = init;

end_restart = document.getElementById("restart");
end_home = document.getElementById("go_home");
me_card = document.getElementById("me_card"); //내 카드 위치
me_su = document.getElementById("me_su");
pcp_su = document.getElementById("pcp_su"); //pcp 카드 잔여 수
stop_start_btn = document.getElementById("stop_start"); //bgm 플레이어 버튼
win = document.getElementById("win"); //이겼을 때 뜰 작은 창
next = document.getElementById("next"); //작은 창에 올라갈 버튼(다음 레벨)
home = document.getElementById("home"); //작은 창에 올라갈 버튼(home으로)
canvas = document.getElementById("canvas");
mv_s1 = document.getElementById("s1"); //엔딩 때 뜰 과일들 목록
mv_s2 = document.getElementById("s2");
mv_b1 = document.getElementById("b1");
mv_b2 = document.getElementById("b2");
mv_p1 = document.getElementById("p1");
mv_p2 = document.getElementById("p2");
mv_l1 = document.getElementById("l1");
mv_l2 = document.getElementById("l2");
end_bg = document.getElementById("end_bg"); //엔딩 화면
me_ring = document.getElementById("me_ring"); //me가 종 울렸을 때
pcp_ring = document.getElementById("pcp_ring"); //pcp가 종 울렸을 때
not_five = document.getElementById("not_five"); //과일 개수의 합이 5개가 아닐 때

stop_start_btn.onclick = stop_start; //bgm 플레이어 버튼 눌렀을 때 실행

var time=1500; //pcp가 종치는 시간
var level=1; //현재 레벨
var bell=0; //과일 개수 합의 결과(0,1)가 저장(1이면 true)
var func; //setTimeout 함수 담고 있음
var pcp=[]; //랜덤수 존재
var me=[]; //랜덤수 존재
var me_num=0, pcp_num=0; //각각 me와 pcp 카드 배열 내의 인덱스를 돔
var game_bgm; //게임 bgm
var ring_bgm; //종소리
var congratulation; //엔딩 bgm
var table_card=0; //현재 판이 몇 번 돌았는지(카드를 몇 번 냈는지)
var straw, banana, plum, lime; //pcp+me의 과일 개수 체크
var pcp_straw=0, pcp_banana=0, pcp_plum=0, pcp_lime=0; //pcp 카드의 과일 개수 체크
var me_straw=0, me_banana=0, me_plum=0, me_lime=0; //me 카드의 과일 개수 체크
var mvs=0, mvb=0, mvp=0, mvl=0; //엔딩 때 과일 움직이기 위한 변수
ring_bgm = new Audio('bgm/ring.mp3'); //종소리 파일
game_bgm = new Audio('bgm/game.mp3'); //게임 bgm 파일

function init() {
    pcp=[0]; //레벨이 증가될 때마다 init을 실행하기 때문에 게임을 위해 필요한 변수들을 초기화함
    me=[0];
    me_num=0;
    pcp_num=0;
    table_card=0;

    if(level==2) { //level 검사해서 맞는 배경이미지 적용
        canvas.style.background="url(img/level2_bg.gif)";
    }
    else if(level==3) {
        canvas.style.background="url(img/level3_bg.gif)"
    }

    show_startCard(); //시작할 때 카드 상태로 감

    stop_start_btn.src = "img/stop_btn.png";
    game_bgm.currentTime = 0; //처음부터 재생
    game_bgm.play();
    game_bgm.volume=0.5;
    game_bgm.addEventListener("ended", function(){ currentTime = 0; game_bgm.play();}, false); //끝나면 처음부터
    
    setCard();
}

function show_startCard() {
    me_card.src = "img/card/me_start.gif";
    pcp_card.src = "img/card/pcp_start.gif";
    me_su.src = "img/print/20.png";
    pcp_su.src = "img/print/20.png";
}

function setCard() { //처음 카드 번호 분배
    for(var i=0; i<20; i++) {
        me[i] = Math.floor(Math.random() * 20) + 1;
        pcp[i] = Math.floor(Math.random() * 20) + 1;
    }
}

function me_plusCard() { //me가 종 울렸을 때 me 카드 개수 증가
    for(var i=0; i<table_card; i++) {
        me[me.length] = Math.floor(Math.random() * 20) + 1; //배열의 길이를 늘림
        
    }
}
function me_minusCard() { //pcp가 종 울렸거나 me가 잘못 울렸을 때 me 카드 개수 감소
    for(var k=0; k<table_card; k++) {
        me.shift(); //배열의 맨 앞 요소 삭제
        me_num--; //현재 인덱스에서 하나 감소시킴
    }
}

function pcp_plusCard() {//pcp가 종 울렸을 때 pcp 카드 개수 증가
    for(var i=0; i<table_card; i++) {
        pcp[pcp.length] = Math.floor(Math.random() * 20) + 1;
    }
}
function pcp_minusCard() { //me가 종 울렸을 때 pcp 카드 개수 감소
    for(var i=0; i<table_card; i++) {
        pcp.shift();
        pcp_num--;
    }
}

function getCard() { //카드 나눠주기(setCard의 랜덤 수 사용)
    su_reset();
    if(me_num<me.length) { //me 잔여 카드 있을 때
        table_card++; //카드 하나 낼 때마다 증가
        me_card.src = "img/card/" + me[me_num] + ".gif"; //me에는 랜덤으로 배정받은 번호가 있음
        switch(me[me_num]) { //과일 종류마다 case 걸어서 각 과일 개수 합 구하는 변수에 넣음
            case 1: case 2: case 3: case 4: case 5:
                me_straw = me[me_num];
                break;
            case 6: case 7: case 8: case 9: case 10:
                me_banana = me[me_num];
                break;
            case 11: case 12: case 13: case 14: case 15:
                me_plum = me[me_num];
                break;
             case 16: case 17: case 18: case 19: case 20:
                me_lime = me[me_num];
                break;
        }
        if(pcp_num<pcp.length) { //pcp 잔여 카드 있을 때
            setTimeout(function() { 
                pcp_card.src = "img/card/" + pcp[pcp_num] + ".gif";
                switch(pcp[pcp_num]) {
                    case 1: case 2: case 3: case 4: case 5:
                        pcp_straw = pcp[pcp_num];
                        break;
                    case 6: case 7: case 8: case 9: case 10:
                        pcp_banana = pcp[pcp_num];
                        break;
                    case 11: case 12: case 13: case 14: case 15:
                        pcp_plum = pcp[pcp_num];
                        break;
                    case 16: case 17: case 18: case 19: case 20:
                        pcp_lime = pcp[pcp_num];
                        break;
                }
                clearTimeout(func);
                pcp_check(); //pcp가 카드 낼 때마다 개수 검사
            }, 200); //pcp가 me보다 0.2초 늦게 냄
        }
        else { //pcp 잔여 카드 없을 때
            pcp_card.src = "img/card/pcp_start.gif";
            win_next(); //me가 이김
        }
    }
    else { //me 잔여 카드 없을 때
        me_card.src = "img/card/pcp_start.gif";
        lose_next(); //pcp가 이김
    }
}

me_card.addEventListener("click",function() {
    if(me_num++<me.length) { //me_num은 배열 안을 돌기 때문에 length보다 작아야 함
        if(me_num>40) me_su.src = "img/print/40.png"; //혹시 40 넘어가면 me 잔여 카드 부분을 40으로 고정시킴
        me_su.src = "img/print/" + (me.length-me_num) + ".png"; //잔여 카드 개수 출력
    }
    else {
        me_su.src = "img/print/0.png";
    }
    if((me.length-me_num)<0) lose_next(); //me 잔여 카드 없을 때

    setTimeout(function() { //카드 내는 시간과 동일한 시간에 잔여 카드 수 출력
        if(pcp_num++<pcp.length) { //pcp_num은 배열 안을 돌기 때문에 length보다 작아야 함
            pcp_su.src = "img/print/" + (pcp.length-pcp_num) + ".png";
        }
        else {
            pcp_su.src = "img/print/0.png";
        }
        if((pcp.length-pcp_num)<0) win_next();
    }, 200);
    
})

function stick_sound() { //스틱모양 버튼 위에 mouseover될 때마다 소리남
    var audio = new Audio("bgm/stick.mp3");
    audio.play();
}

function audio_ring() { //종소리
    ring_bgm.currentTime=0;
    ring_bgm.play();
}

function stop_start() { //bgm stop/start 제어
    if(!game_bgm.paused) { //멈춰 있을 때
        stop_start_btn.src = "img/start_btn.png";
        game_bgm.pause();
    }
    else {
        stop_start_btn.src = "img/stop_btn.png";
        game_bgm.play();
    }
}

function me_check() { //me가 종 눌렀을 때 //과일 개수 맞는지 확인
    clearTimeout(func);
    su_check();
            
    if(bell == 1) me_yes(); //맞을 때
    else me_no(); //틀릴 때
}

function pcp_check() { //pcp가 종 눌렀을 때
    su_check();

    if(bell == 1) {
        func = setTimeout(function() {
            pcp_yes();
        },time);
    }
}

function su_check() { //과일 개수의 합이 5개이거나 한 과일의 수가 5이면 bell=1(true)로 지정
    straw = me_straw + pcp_straw;
    banana = me_banana + pcp_banana;
    plum = me_plum + pcp_plum;
    lime = me_lime + pcp_lime;

    if(straw==5 | banana==10 | banana==15 | plum==15 | plum==25 | lime==20 | lime==35) {
        bell=1;
    }
}

function me_yes() { //me가 종 울리고 과일 개수가 맞을 때
    bell=0; //bell을 다시 0(false)으로 바꿈
    me_ring.style.visibility = "visible"; //me가 울렸다는 이미지 출력
    setTimeout(function() {
        me_ring.style.visibility = "hidden"; //1.5초 후에 사라짐
    },1500);

    me_plusCard(); //냈던 카드 개수만큼 me 배열 증가
    pcp_minusCard(); //pcp 배열 감소

    table_card=0;
    me_su.src = "img/print/" + me.length + ".png";
    pcp_num=0; //변수 초기화(인덱스 다시 처음부터 돌아야 하기 때문)
}
function me_no() { //me가 종 울렸지만 과일 개수가 틀릴 때
    not_five.style.visibility = "visible"; //5개가 아니라는 이미지 출력
    setTimeout(function() {
        not_five.style.visibility = "hidden";
    },1500);

    me_minusCard(); //me가 틀렸기 때문에 배열 감소
    pcp_plusCard(); //pcp 배열 증가

    table_card=0;
    pcp_su.src = "img/print/" + pcp.length + ".png";
    me_num=0;
}

function pcp_yes() { //pcp가 종 울렸을 때(pcp는 틀리는 경우 없음)
    audio_ring();
    pcp_ring.style.visibility = "visible";
    setTimeout(function() {
        pcp_ring.style.visibility = "hidden";
    },1500);

    bell=0;

    me_minusCard();
    pcp_plusCard();

    table_card=0;
    me_su.src = "img/print/" + me.length + ".png";
    pcp_su.src = "img/print/" + pcp.length + ".png";
    me_num=0;
}

function su_reset() { //과일 개수 들어가는 변수 초기화
    me_straw=0;
    me_banana=0;
    me_plum=0;
    me_lime=0;
    
    pcp_straw=0;
    pcp_banana=0;
    pcp_plum=0;
    pcp_lime=0;
}

function goingHome() { //재시작(홈으로)
    location.href="Halli_Galli.html";
}

function win_next() { //이겼을 때 띄우는 작은 창
    if(level<3) {
        win.style.visibility = "visible";
        next.style.display = "block";
        home.style.display = "block";
    }
    else {
        end();
    }
}
function lose_next() { //졌을 때 띄우는 작은 창
    lose.style.visibility = "visible";
    home.style.top = "330px";
    home.style.display = "block";
}

function level_plus() { //다음 레벨로 갈 때
    level++;
    time -= 500;
    lose.style.visibility = "hidden";
    win.style.visibility = "hidden";
    next.style.display = "none";
    home.style.display = "none";

    init();
}

function end() { //레벨 3까지 끝났을 때(엔딩화면 띄움)
    congratulation = new Audio("bgm/Congratulation.mp3");
    congratulation.currentTime = 0;
    congratulation.play();

    end_bg.style.visibility = "visible";
    mv_s1.style.visibility = "visible";
    mv_s2.style.visibility = "visible";
    mv_b1.style.visibility = "visible";
    mv_b2.style.visibility = "visible";
    mv_p1.style.visibility = "visible";
    mv_p2.style.visibility = "visible";
    mv_l1.style.visibility = "visible";
    mv_l2.style.visibility = "visible";
    end_restart.style.display = "block";
    end_home.style.display = "block";

    setInterval(function() {
        mvs+=35;
        mv_s1.style.top = 10+mvs;
        mv_s2.style.top = 60+mvs;
        if(mvs>=490) {
            mv_s1.style.top=10;
            mv_s2.style.top=10;
            mvs=0;
        }
    }, 500);
    setInterval(function() {
        mvb+=15;
        mv_b1.style.top = 10+mvb;
        mv_b2.style.top = 40+mvb;
        if(mvb>=500) {
            mv_b1.style.top=10;
            mv_b2.style.top=10;
            mvb=0;
        }
    }, 500);
    setInterval(function() {
        mvp+=40;
        mv_p1.style.top = 10+mvp;
        mv_p2.style.top = 10+mvb;
        if(mvp>=540) {
            mv_p1.style.top=10;
            mv_p2.style.top=10;
            mvp=0;
        }
    }, 500);
    setInterval(function() {
        mvl+=25;
        mv_l1.style.top = 80+mvl;
        mv_l2.style.top = 10+mvl;
        if(mvl>=500) {
            mv_l1.style.top=10;
            mv_l2.style.top=10;
            mvl=0;
        }
    }, 500);
}

function restart() { //엔딩 창에서 restart 눌렀을 때(다시 게임 화면 띄움)
    level=1;
    congratulation.pause();

    end_bg.style.visibility = "hidden";
    mv_s1.style.visibility = "hidden";
    mv_s2.style.visibility = "hidden";
    mv_b1.style.visibility = "hidden";
    mv_b2.style.visibility = "hidden";
    mv_p1.style.visibility = "hidden";
    mv_p2.style.visibility = "hidden";
    mv_l1.style.visibility = "hidden";
    mv_l2.style.visibility = "hidden";
    end_restart.style.display = "none";
    end_home.style.display = "none";

    canvas.style.background="url(img/level1_bg.gif)"

    init();
}