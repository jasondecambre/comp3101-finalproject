class SJNProcess{
    //might possibly need an arrival time indicator
    constructor(processname,bursttime,color,tablerow){
        console.log("constructor");
    this.processname = processname;
    this.bursttime = bursttime * 1000;
    this.arrivaltime = time;
    this.color = color;
    this.textcol = "white";
    this.executeTime = bursttime;
    this.tablerow = tablerow;
    this.completiontime = 0;
    this.waittime = 0;

    }

    getProcessName(){
        return this.processname;
    }
    getWaitTime(){
        return this.waittime;
    }
    getCompletionTime(){
        return this.completiontime;
    }

    getArrivalTime(){
        if(this.arrivaltime != null)
            return 0;
        else return this.arrivaltime;
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



    
    
}

const sjnreadyqueuejs=[];
const colours=["#A5F908","#DC33e7","#C484B9","#6d3072","#B21BCC","#00fad6","#1d1440","#c79763","#0e3a03","#233e69"];
var sjnqueuehtml;
var processtable;
var time;
var numprocesses;
var sjnclockinterval;
var stop=false;
var tablerows = 1;


document.addEventListener("DOMContentLoaded",function(){
    initpage();
    var sjntime=document.getElementById('sjnclock');
    numprocesses=0;
    time=0;   
});

function initpage(){
    sjnqueuehtml = document.getElementById('sjnlist');
    var sjnstartbutton=document.getElementById("sjnstart");
    var sjnresetbutton=document.getElementById("sjnreset");
    var sjncreatebutton=document.getElementById("sjncreateprocess");

    sjnstartbutton.addEventListener("click",function(event){
        if(sjnreadyqueuejs.length != 0){
            sjnreadyqueuejs.sort((a, b) => (a.bursttime > b.bursttime) ? 1 : -1); // sorts for SJN
            startAnimation();
        }

        else{
            alert("Queue is empty");
        }
    });

    sjnresetbutton.addEventListener("click",function(e){
        e.preventDefault();
        resetAnimation();
    });

    sjncreatebutton.addEventListener("click",function(e){
        e.preventDefault();
        stop = false;
        createProcess();
    });
}

function resetAnimation(){
    clearInterval(sjnclockinterval);
    stop=true;
    numprocesses=0;
    time=0;
    tablerows = 1;
    var sjntime=document.getElementById('sjnclock');
    sjntime.innerHTML="Clock: " + 0;
    var bursttime=document.getElementById("sjnbursttime");
    bursttime.innerHTML='';
    sjnreadyqueuejs.length=0;
    sjnqueuehtml.innerHTML='';
    document.getElementById("sjntable").innerHTML=" ";

    var qtable = document.getElementById("firstptable")
    var numrows = qtable.rows.length;

    for(let i=numrows-1;i>0;i--){
        qtable.deleteRow(i);
    }

    var sjncreatebutton=document.getElementById("sjncreateprocess");
    sjncreatebutton.disabled = false;
    
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addProcesstosjnTable(process){
    var qtable = document.getElementById("firstptable");
    var prow = qtable.insertRow();
    process.completiontime = time+process.getBurstTime()/1000;
    process.waittime = process.completiontime - process.getBurstTime()/1000 - process.arrivaltime;
    console.log("COMP BURST ARRIVE");
    console.log(process.completiontime);
    console.log(process.bursttime);
    console.log(process.arrivaltime);
    console.log(process.waittime);
    var arr = [process.getProcessName(), process.arrivaltime, process.getBurstTime()/1000, process.completiontime,process.waittime];

    for(let i=0;i<5;i++){
		var cellp = prow.insertCell(i);
		cellp.innerHTML=arr[i];
	}
    

}

function stopAnimation(){
    clearInterval(clockinterval);
    stop=true;
    var sjncreatebutton=document.getElementById("sjncreateprocess");
    sjncreatebutton.disabled = false;
}

function updateClock(){
    var sjntime = document.getElementById('sjnclock');
    time = time + 1;
    sjntime.innerHTML = "Clock: " + time;
}

async function startAnimation(){
    stop=false;
    var sjntable=document.getElementById("sjntable");
    var sjnrow = sjntable.insertRow(0);

    clockinterval=setInterval(updateClock,1000);
    //console.log(sjnreadyqueuejs);
    var count = 0;

    while(sjnreadyqueuejs.length>0) {
        //sjnqueuehtml.childNodes[count].style.textDecoration="line-through";
        var removed=sjnreadyqueuejs.shift();
        console.log("TIME IS___________ ");
        console.log(time);
        removed.completiontime = Math.round((time + removed.getBurstTime())/1000);
        console.log("COMPLETION TIME IS___________ ");
        console.log(removed.completiontime);
        addProcesstosjnTable(removed);
        count++;
        //sjnqueuehtml.removeChild(sjnqueuehtml.childNodes[0]);
        var cellt=sjnrow.insertCell(-1);
        cellt.style.backgroundColor=removed.getColour(); //changed from current
        cellt.style.color=removed.getTextCol();

        
        cellt.innerHTML=removed.getProcessName() +" ("+removed.getBurstTime() / 1000 +"s)" ;
        cellt.width=200+"px";
        console.log(removed.getProcessName());
        var removedbursttime = removed.getBurstTime();
        
        console.log(removedbursttime);
        //updateClock();
        await sleep(removedbursttime);
       
        //sjnqueuehtml.childNodes[count].style.textDecoration="line-through";
        
       
    }

    stopAnimation();
}


function createProcess(){
    var bursttime = document.getElementById("sjnbursttime");
    var color = colours[numprocesses%10];
    numprocesses = numprocesses+1;
    pname="Process"+ " " + numprocesses;
    //console.log(btime.value);
   
    p=new SJNProcess(pname,bursttime.value,color,tablerows,time);
    //add to queue
    sjnreadyqueuejs.push(p);  
    tablerows++;
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(pname));
    sjnqueuehtml.appendChild(entry);
    console.log(sjnreadyqueuejs);    
}



    


