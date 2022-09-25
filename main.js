const high=2;
const candle=10;
const dist=14;
const bull='#22DD44';
const bear='#FF2222';
const background='#F0F0F0';
const buySize=5;
const chartMid=1600;
var c1=document.getElementById('chart');
var cam=document.getElementById('cam');
var chart = c1.getContext("2d");
var camView=cam.getContext("2d");
var equity=document.getElementById('cash');
var dcounter=document.getElementById('dayCounter');
var buyButton=document.getElementById('buy');
var sellButton=document.getElementById('sell');
const highdif=candle/2-high/2;
const N=data.length
function abs(a){
    if(a<0) return -a;
    return a;
}
function min(a,b){
    if(a<b) return a;
    return b;
}
var series=0,pos=0,cash=10000,p=100,posV=0,bankrupt=false,s,y,y2,c,i,x,camY,tmp;
function transform(y){
    return chartMid+(100-y)*20/s;
    //return (101-y)*200;
}
function showPos(){
    if(pos==0){
        buyButton.innerHTML='buy';
        sellButton.innerHTML='sell';
    }else if(pos>0) buyButton.innerHTML='buy('+pos+')';
    else sellButton.innerHTML='sell('+(-pos)+')';
}
function inCash(){
    cash+=pos*posV*p;
    pos=0;
    showPos()
}
function resetBalance(){
    inCash();
    cash=10000;
    bankrupt=false;
    equity.innerHTML='10000 USD';
}
function daySetup(){
    chart.fillStyle = background;
    chart.fillRect(0,0,c1.width,c1.height);
    s=0;
    for(j=0;j<data[series].length;j++){
        s+=abs(data[series][j][0]-data[series][j][1]);
    }
    s/=data[series].length;
    posV=100/s;
    i=0,x=0,camY=200-chartMid;
    camView.drawImage(c1,min(980-x,0),camY);
    dcounter.innerHTML='day '+(series+1);
}
function renderChart(){
    x=i*dist;
    p = data[series][i][1];
    chart.fillStyle = bear;
    if (data[series][i][0] > data[series][i][1]) {
        chart.fillStyle = bear;
        y = transform(data[series][i][0]);
        y2 = transform(data[series][i][1]);
        c = y2;
    } else {
        chart.fillStyle = bull;
        y = transform(data[series][i][1]);
        y2 = transform(data[series][i][0]);
        c = y;
    }
    chart.fillRect(x, y, candle, y2 - y);
    y = transform(data[series][i][2]);
    y2 = transform(data[series][i][3]);
    chart.fillRect(x + highdif, y, high, y2 - y);
    i++;
    if (y + camY < 5) {
        camY = 5 - y;
        if (c + camY + 5 > cam.height) camY = cam.height - 5 - c;
    } else if (y2 + camY + 5 > cam.height) {
        camY = cam.height - 5 - y2;
        if (c + camY < 5) camY = 5 - c;
    }
    camView.drawImage(c1, min(980 - x, 0), camY);
    tmp = Math.floor(pos * posV * p + cash);
    if (tmp <= 0){
        inCash();
        cash=0, tmp=0, bankrupt=true;
    }
    equity.innerHTML = tmp + ' USD';
}
function nextDay(){
    if (series + 2 > N) return;
    inCash();
    series++;
    daySetup();
}
function buy(){
    if (bankrupt) return;
    pos++;
    cash-=posV*p;
    showPos()
}
function sell(){
    if (bankrupt) return;
    pos--;
    cash+=posV*p;
    showPos()
}
window.addEventListener('keydown', function(event) {
    if(event.key == ' ') renderChart();
    else if(event.key == 'n') nextDay();
    else if(event.key == 'r') resetBalance();
    else if(event.key == 'ArrowUp') buy();
    else if(event.key == 'ArrowDown') sell();
    else if(event.key == 'ArrowRight') inCash();
});
resetBalance();
daySetup();