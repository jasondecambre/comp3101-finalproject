//potentially make a table to hold everything
// so a table with one row and say 20 columns 
// once a process is added to the run by the processor it will take up the
//time fo the quantum or the time of the processor

//might just make it so that all the processes must be added before it can be run
//set button for quantum?
//CLASS FOR PROCESSES
class RProcess{
	//might possibly need an arrival time indicator
	constructor(name,executiontime,color,trow){
		this.name=name;
		this.extime=executiontime;
		this.timeleft=executiontime;
		this.color=color;
		this.textcol="white";
		this.trow=trow;
	}
	getName(){
		return this.name;
	}
	getExecutionTime(){
		return this.extime;
	}
	executeProcess(quantum){
		//returns the time used for process
		if((this.timeleft-quantum)<0){
			var x=this.timeleft;
			this.timeleft=0;
		
		}
		else{
			this.timeleft=this.timeleft-quantum;
			
		}		
	}
	getSpan(quantum){
	
		if((this.timeleft-quantum)<0){
			return this.timeleft;
		}
		else{
			return quantum;
		}
	}
	isComplete(){
		return (this.timeleft==0);
	}
	getColour(){
		return this.color;
	}
	getTextCol(){
		return this.textcol;
	}
	getTimeLeft(){
		return this.timeleft;
	}
	getTR(){
		return this.trow;
	}
}

/*GLOBAL VARIABLES*/
const readyqueuejs=[];
const colours=["#381BCC","#571BCC","#751BCC","#931BCC","#B21BCC","#CC1BC8","#CC1BA9","#CD1A8B","#CC1B6C","#CC1B4E"];
//const textcol=["white","white","white","white","black","black","black","black","black","white"];
var quantum;
var stop=false;
var rqueuehtml;
var processtable;
var time;
var numprocesses;
var clockinterval;
var trows=1;
document.addEventListener("DOMContentLoaded",function(){
	initpage();
	var ctime=document.getElementById('rclock');
	numprocesses=0;
	time=0;

});
function initpage(){
	//getting list
	rqueuehtml=document.getElementById("rlist");
	//initializing buttons
	var startbutton=document.getElementById("rstart");
	//var stopbutton=document.getElementById("rstop");
	var resetbutton=document.getElementById("rreset");
	var addbutton=document.getElementById("addrprocess");
	var setqbutton=document.getElementById("setq");

	//adding event listeners to buttons
	startbutton.addEventListener("click",function(event){
		if(quantum!=undefined){
		startAnimation();
		}
		else{
			alert("Quantim is not set");
		}
	});
	/*stopbutton.addEventListener("click",function(event){
		stopAnimation();
	});*/
	resetbutton.addEventListener("click",function(event){
		event.preventDefault();
		resetAnimation();
	});
	addbutton.addEventListener("click",function(event){
		event.preventDefault();
		if(document.getElementById("rburst").value!=''){
		createProcess();
		}
	else{
		//alert
	}
	});
	setqbutton.addEventListener("click",function(event){
		event.preventDefault();
		//error checking for if quantum field is empty
		quantum=document.getElementById("rtimeslot").value;
		if(quantum!=""){
		document.getElementById("setq").disabled=true;
	}
	});
}
function resetAnimation(){
	clearInterval(clockinterval);
	trows=1;
	stop=true;
	numprocesses=0;
	time=0;
	//clear text boxes
	
	var ctime=document.getElementById('rclock');
	ctime.innerHTML="Time: 0";
	quantum=null;
	document.getElementById("setq").disabled=false;
	var btime=document.getElementById("rburst");
	btime.innerHTML='';
	//also clear input like the input boxes
	document.getElementById("rtimeslot").innerHTML='';
	//empty rqueuehtml and js
	readyqueuejs.length=0;
	rqueuehtml.innerHTML='';
	//clear tables
	document.getElementById("rrobintable").innerHTML="";

	var ptable=document.getElementById("rptable");
	var rowcount=ptable.rows.length;
	for(let i=rowcount-1;i>0;i--){
		ptable.deleteRow(i);
	}
	var addbutton=document.getElementById("addrprocess");
	addbutton.disabled=false;
}

function stopAnimation(){
	clearInterval(clockinterval);
	stop=true;
	var addbutton=document.getElementById("addrprocess");
	addbutton.disabled=true;
	//time=0;
}

function updateClock(){
	var ctime=document.getElementById('rclock');
	time=time+1;
	ctime.innerHTML="Time: "+time;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function addProcessToPTable(pobject){
	var ptable=document.getElementById("rptable");
	var row=ptable.insertRow(pobject.getTR());
	var arr=[pobject.getName(),time,pobject.getExecutionTime(),pobject.getTimeLeft()];
	for(let i=0;i<4;i++){
		var cell=row.insertCell(i);
		cell.innerHTML=arr[i];
	}
}

async function startAnimation(){
	stop=false;
	var table=document.getElementById("rrobintable");
	var ptable=document.getElementById("rptable");
	var row = table.insertRow(0);
	//disable createprocess button
	//document.getElementById("addrprocess").disabled=true;

	//update clock time
	clockinterval=setInterval(updateClock,1000);
	//console.log(readyqueuejs);
	var cnt=0;
	//keep going while there are still processes in the queue
	while(readyqueuejs.length>0 || stop==true){
	//for(let current of readyqueuejs){	
			var removed=readyqueuejs.shift();			
			rqueuehtml.childNodes[cnt].style.textDecoration="line-through";	
			cnt++;
			await sleep(300);	
			var cell=row.insertCell(-1);
		
			cell.style.backgroundColor=removed.getColour(); //changed from current
			cell.style.color=removed.getTextCol(); //change both to adding a style?
			if (quantum>6){
				var w=removed.getSpan(quantum)*20;
			}
			else{
			var w=removed.getSpan(quantum)*50;
			}
			cell.width=w+"px";
			//cell.width="100px";
			cell.innerHTML=removed.getName()+" ("+removed.getSpan(quantum)+")";
			await sleep(removed.getSpan(quantum)*1000);
			removed.executeProcess(quantum);
			
			if(!(removed.isComplete())){
				await sleep(200);
				readyqueuejs.push(removed);
				var entry = document.createElement('li');
				entry.appendChild(document.createTextNode(removed.getName()));
				rqueuehtml.appendChild(entry);
			}//end if
			ptable.rows[removed.getTR()].cells[3].innerHTML=removed.getTimeLeft();
			//console.log(readyqueuejs);
		
	}//endfor
	stopAnimation();
}

function createProcess(){
	//get from form
	var btime=document.getElementById("rburst");
	//create process object
	var color=colours[numprocesses%10];
	//var tcol=textcol[numprocesses%10];
	numprocesses=numprocesses+1;
	pname="P"+numprocesses;
	//console.log(btime.value);
	p=new RProcess(pname,btime.value,color,trows);
	addProcessToPTable(p);
	trows++;  //keep track of the number of rows in the processes table
	//add to queue
	readyqueuejs.push(p);
	//console.log(readyqueuejs);


	//changing list in html
	var entry = document.createElement('li');
	entry.appendChild(document.createTextNode(pname));
	rqueuehtml.appendChild(entry);

}