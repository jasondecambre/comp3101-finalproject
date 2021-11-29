
window.onload = function(){
    const map = new Map(); // helps to relate process parameters to their CSS classes
    map.set("high","high");
    map.set("medium","mp");
    map.set("low","low");
    map.set("1","short");
    map.set("2","ms");
    map.set("3","long");   
    var submit = document.getElementById("submit"); //submit button

    // these connect to the end-user displays for the process queues   
    var processesArr = document.getElementsByClassName("wbox");
	//var executingArr = document.getElementsByClassName("ebox");
    var finishedArr =  document.getElementsByClassName("fbox");

    // globals
    var length; // process length to completion (1 for short, 2 for medium, 3 for long)
    var priority; // process priority (high, medium or low)
    var priorityQueue = [];
	var ordering = [];
	var finished = [];
	var dict = {high:3,medium:2,low:1};
	var dict2 = {'3':3,'2':2,'1':1};
    var count = 0; // makes sure process queue doesn't exceed 5
	var x = 0;
	var play = false; 
	var time = 0;
	var movement = 0;
	var clockinterval;
	var min = 0;
	var max = 10;
	let execute =95;
	let shuffle = 54;
	

    // allows user to add a process to every queue and see how each algorithm behaves
    submit.addEventListener("click", function(event){
        event.preventDefault();

        //accepts input
        length = document.getElementById("length").value;
        priority =  document.getElementById("pr").value;      

        if(count < 10){ // keeps queue at or under 5
            count++;
            enqueue(length,priority); // adds process to queue for each algorithm
        }        
    });


    // adds process to queue for each algorithm
    function enqueue(length,priority){
        if(priorityQueue.length <= 10){ //checks if queue has space

            // creates a div to represent process
            var process0 = document.createElement("div");
            var p0 = document.createElement("p");
            p0.innerHTML = count; // shows order in which process arrived
            process0.appendChild(p0);
            process0.classList.add(map.get(length)); // the taller the rectangle, the longer/more intense the process
            process0.classList.add(map.get(priority)); // high: red, medium: yellow, low: green
			process0.classList.add("p"+count);

            priorityQueue.push(process0);

            // displays new processes on the screen
            processesArr[0].appendChild(process0);
			if (play==true){
				if (ordering.length==0){
					stopAnimation();
				}
				setTimeout(() => {  startAnimation(); }, 2000);
				
			}
			if (ordering.length == 0){
				//ordering.push([dict[priority],count,length])
				movement = execute+(shuffle*min);
				anime({
						targets:'.p'+count,
						translateX: '-='+movement,
						//delay:1000,
						duration: 1000,
						easing: 'linear',
						loop: false,
					});
			}
			else {
				anime({
						targets:'.p'+count,
						translateX: '-='+shuffle,
						//delay:1000,
						duration: 1000,
						easing: 'linear',
						loop: false,
					});
				x = ordering.length-1;
				y = 0;
				while (x>=0 && ordering[x][0]<dict[priority]){
					if ( x < 1){
						movement = execute;
						console.log(x);
					}
					else{
						movement = shuffle;
					}
					anime({
						targets:'.p'+ordering[x][1],
						keyframes: [
							{translateX: '-=-'+movement},
						],
						//delay:1000,
						duration: 1000,
						easing: 'linear',
						loop: false,
					});
					y+=1;
					x-=1;
				}
				if (x<0 && ordering[0][0] < dict[priority]){
					movement = (shuffle*y-1)+execute+(shuffle*min);
				}else {
					movement = (shuffle*y)+shuffle+(shuffle*min);
				}
				anime({
					targets:'.p'+count,
					translateX:'-='+movement,
					//delay:1000,
					duration: 1000,
					easing: 'linear',
					loop: false,
				});
				
			}
			ordering.push([dict[priority],count,dict2[length],time,0,dict2[length]])
			ordering.sort(function(a, b) {return b[0] - a[0];});
			//ordering.reverse();
        }
		console.log(priorityQueue);
		console.log(ordering);
    }
	
	function executing(){
		max-=1;
		min+=1;
		anime({
			targets:'.p'+ordering[0][1],
			translateX: '-='+((shuffle*max)+execute),
			//delay:1000,
			duration: 1000,
			easing: 'linear',
			loop: false,
		});
		
	}


    //removes a process from the front of a given queue
    function dequeue(queue){
        if(queue.length > 0) // checks if the queue is empty
            var el = queue.shift(); 

        //determining which queue on screen to change
		i=0;

        finishedArr[i].appendChild(el); //reflects changes on screen
    }

	function nextp(){
		if (ordering.length!=0){
			anime({
				targets:'.p'+ordering[0][1],
				translateX: '-='+execute,
				//delay:1000,
				duration: 1000,
				easing: 'linear',
				loop: false,
			});
		}
		x = ordering.length-1
		while (x > 0){
			anime({
				targets:'.p'+ordering[x][1],
				translateX: '-='+shuffle,
				//delay:1000,
				duration: 1000,
				easing: 'linear',
				loop: false,
			});
			x-=1;
		}
	}

	function updateClock(){
		var fcfstime = document.getElementById('timer');
		if (ordering.length != 0){
			time = time + 1;
			ordering[0][2]-=1;
			fcfstime.innerHTML = "Timer: " + time;
			if (ordering[0][2]==0){
				stopAnimation();
				executing();
				ordering[0][4]+=time;
				finished.push(ordering.shift());
				//finished.push(ordering[0]);
				nextp();
				setTimeout(() => {  startAnimation(); }, 2000);
				addRow();
			}
		}
		else{
			stopAnimation();	
		}
	}
	var startbutton=document.getElementById("play");
	startbutton.addEventListener("click",function(event){
        if(ordering.length != 0){
            startAnimation();
        }

        else{
            alert("Queue is empty");
        }
    });
	var stopbutton=document.getElementById("pause");
	stopbutton.addEventListener("click",function(event){
        stopAnimation();
	});
	function startAnimation(){
		document.getElementById("timer").style.color="red";
		play=true;
		clockinterval=setInterval(updateClock,1000);
		
	}
	
	function stopAnimation(){
		document.getElementById("timer").style.color="black"
		clearInterval(clockinterval);
		play=false;
	}
	
	function addRow(){
		var table = document.getElementById("outline");
		var rowCount = table.rows.length;
		var row = table.insertRow(rowCount);
		var i = finished.length-1;
		var wait = finished[i][4]-finished[i][3]-finished[i][5];
		var arr = ["P"+finished[i][1],finished[i][5],finished[i][3],finished[i][4],wait,finished[i][0]];
		for(let i=0;i<6;i++){
			var cellp = row.insertCell(i);
			cellp.innerHTML=arr[i];
		}
	}
	

}

