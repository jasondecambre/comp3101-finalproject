class FCFSProcess{
    //might possibly need an arrival time indicator
    constructor(processname,bursttime,color,arrivetime,tablerow){
       // p=new FCFSProcess(pname,bursttime.value,color,time,tablerows);
    this.processname = processname;
    this.bursttime = bursttime * 1000;
    this.arrivetime = arrivetime;
    this.color = color;
    this.textcol = "white";
    this.executeTime = bursttime
    this.tablerow = tablerow;
    //this.arrivaltime 

    }


    getProcessName(){
        return this.processname;
    }

    getBurstTime(){
        return this.bursttime ;
    }
    getColour(){
        return this.color;
    }

    getTextCol(){
        return this.textcol;
    }

    getTableRow(){
        return this.tablerow;
    }

    getArrivalTime(){
        return this.arrivetime;
    }

 
}

const fcfsreadyqueuejs=[];
const colours=["#A5F908","#DC33e7","#C484B9","#6d3072","#B21BCC","#00fad6","#1d1440","#c79763","#0e3a03","#233e69"];
var fcfsqueuehtml;
var processtable;
var time;
var numprocesses;
var fcfsclockinterval;
var stop=false;
var tablerows = 0;
var p;


document.addEventListener("DOMContentLoaded",function(){
    initpage();
    var fcfstime=document.getElementById('fcfsclock');
    numprocesses=0;
    time=0;   
});

function initpage(){
    fcfsqueuehtml = document.getElementById('fcfslist');
    var fcfsstartbutton=document.getElementById("fcfsstart");
    var fcfsresetbutton=document.getElementById("fcfsreset");
    var fcfscreatebutton=document.getElementById("fcfscreateprocess");

    fcfsstartbutton.addEventListener("click",function(event){
        if(fcfsreadyqueuejs.length != 0){
            startAnimation();
        }

        else{
            alert("Queue is empty");
        }
    });

    fcfsresetbutton.addEventListener("click",function(e){
        e.preventDefault();
        resetAnimation();
    });

    fcfscreatebutton.addEventListener("click",function(e){
        e.preventDefault();
        createProcess();
    });
}

function resetAnimation(){
    clearInterval(fcfsclockinterval);
    stop=true;
    numprocesses=0;
    time=0;
    tablerows = 0;
    var fcfstime=document.getElementById('fcfsclock');
    fcfstime.innerHTML="Clock: " + 0;
    var bursttime=document.getElementById("fcfsbursttime");
    bursttime.innerHTML='';
    fcfsreadyqueuejs.length=0;
    fcfsqueuehtml.innerHTML='';
    document.getElementById("fcfstable").innerHTML=" ";

    var qtable = document.getElementById("firstptable")
    var numrows = qtable.rows.length;

    for(let i=numrows-1;i>0;i--){
        qtable.deleteRow(i);
    }

    var fcfscreatebutton=document.getElementById("fcfscreateprocess");
    fcfscreatebutton.disabled = false;
    
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addProcesstoFCFSTable(process){
    var cnt = 0;
    var qtable = document.getElementById("firstptable");
    var rowcount = qtable.rows.length;
    var prow = qtable.insertRow(rowcount);
    //var completiontime = time + (process.getBurstTime() / 1000);
    var waittime = time - process.getArrivalTime() - (process.getBurstTime() / 1000);
    var arr = [process.getProcessName(),process.getBurstTime() / 1000,process.getArrivalTime(),time,waittime];
    
   

    for(let i=0;i<5;i++){
		var cellp = prow.insertCell(i);
		cellp.innerHTML=arr[i];
	}
    

}

function stopAnimation(){
    clearInterval(clockinterval);
    stop=true;
    var fcfscreatebutton=document.getElementById("fcfscreateprocess");
    fcfscreatebutton.disabled = false;
}

function updateClock(){
    var fcfstime = document.getElementById('fcfsclock');
    time = time + 1;
    fcfstime.innerHTML = "Clock: " + time;
}

async function startAnimation(){
    stop=false;
    var fcfstable=document.getElementById("fcfstable");
    var fcfsrow = fcfstable.insertRow(0);

    clockinterval=setInterval(updateClock,1000);
    //console.log(fcfsreadyqueuejs);
    var count = 0;

    while(fcfsreadyqueuejs.length>0 || stop==true) {
        //fcfsqueuehtml.childNodes[count].style.textDecoration="line-through";
        var removed=fcfsreadyqueuejs.shift();
        count++;
        //fcfsqueuehtml.removeChild(fcfsqueuehtml.childNodes[0]);
        var cellt=fcfsrow.insertCell(-1);
        cellt.style.backgroundColor=removed.getColour(); //changed from current
        cellt.style.color=removed.getTextCol();

        
        cellt.innerHTML=removed.getProcessName() +" ("+removed.getBurstTime() / 1000 +"s)" ;
        cellt.width=200+"px";
        console.log(removed.getProcessName());
        var removedbursttime = removed.getBurstTime();
        console.log(removedbursttime);
        //updateClock();
        await sleep(removedbursttime);
        addProcesstoFCFSTable(removed);
        
        //fcfsqueuehtml.childNodes[count].style.textDecoration="line-through";
        
       
    }

    stopAnimation();
    
}


function createProcess(){
    var bursttime = document.getElementById("fcfsbursttime");
    var color = colours[numprocesses%10];
    numprocesses = numprocesses+1;
    pname="Process"+ " " + numprocesses;
    //console.log(btime.value);
    p=new FCFSProcess(pname,bursttime.value,color,time,tablerows);
    //addProcesstoFCFSTable(p);
    tablerows++;
    //add to queue
    fcfsreadyqueuejs.push(p);
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(pname));
    fcfsqueuehtml.appendChild(entry);
    //addProcesstoFCFSTable(p);
    //console.log(fcfsreadyqueuejs);
    //console.log(fcfsqueuehtml);
    
}


    


