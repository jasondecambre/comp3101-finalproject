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
    var finishedArr =  document.getElementsByClassName("fbox");

    // globals
    var length; // process length to completion (1 for short, 2 for medium, 3 for long)
    var priority; // process priority (high, medium or low)
    var fcfsQueue = [];
    var sjnQueue = [];
    var priorityQueue = [];
    var rrQueue = [];
    var count = 0; // makes sure process queue doesn't exceed 5

    // allows user to add a process to every queue and see how each algorithm behaves
    submit.addEventListener("click", function(event){
        event.preventDefault();

        //accepts input
        length = document.getElementById("length").value;
        priority =  document.getElementById("pr").value;      

        if(count < 5){ // keeps queue at or under 5
            count++;
            enqueue(length,priority); // adds process to queue for each algorithm
        }        
    });


    // adds process to queue for each algorithm
    function enqueue(length,priority){
        if(fcfsQueue.length <= 5){ //checks if queue has space
            
            // creates a div to represent process
            var process0 = document.createElement("div");
            var p0 = document.createElement("p");
            p0.innerHTML = count; // shows order in which process arrived
            process0.appendChild(p0);
            process0.classList.add(map.get(length)); // the taller the rectangle, the longer/more intense the process
            process0.classList.add(map.get(priority)); // high: red, medium: yellow, low: green
            

            // repeats as above
            var process1 = document.createElement("div");
            var p1 = document.createElement("p");
            p1.innerHTML = count;
            process1.appendChild(p1);
            process1.classList.add(map.get(length));
            process1.classList.add(map.get(priority)); 

            // repeats as above
            var process2 = document.createElement("div");
            var p2 = document.createElement("p");
            p2.innerHTML = count;
            process2.appendChild(p2);
            process2.classList.add(map.get(length));
            process2.classList.add(map.get(priority)); 

            // repeats as above
            var process3 = document.createElement("div");
            var p3 = document.createElement("p");
            p3.innerHTML = count;
            process3.appendChild(p3);
            process3.classList.add(map.get(length));
            process3.classList.add(map.get(priority)); 
           
            //adds new process to each queue
            fcfsQueue.push(process0);
            sjnQueue.push(process1);
            priorityQueue.push(process2);
            rrQueue.push(process3);

            // displays new processes on the screen
            processesArr[0].appendChild(process0);               
            processesArr[1].appendChild(process1);
            processesArr[2].appendChild(process2);
            processesArr[3].appendChild(process3);
        }
    }


    //removes a process from the front of a given queue
    function dequeue(queue){
        if(queue.length > 0) // checks if the queue is empty
            var el = queue.shift(); 

        //determining which queue on screen to change
        if(queue === fcfsQueue)
            i = 0;
        else if(queue === sjnQueue)
            i = 1;
        else if(queue === priorityQueue)
            i = 2;
        else
            i = 3;
        
        finishedArr[i].appendChild(el); //reflects changes on screen
    }


    //allows shifting within queues
    function move(queue, from, to){
        var target = queue.splice(from,1); // removes target element from queue
        queue.splice(to,0,target[0]); // inserts target element in new place
        
        // determines which onscreen queue to reflect changes in
        var i;
        if(queue === fcfsQueue)
            i = 0;
        else if(queue === sjnQueue)
            i = 1;
        else if(queue === priorityQueue)
            i = 2;
        else
            i = 3;
        
        // reflecting changes onscreen
        for(j=0;j<processesArr.childElementCount;j++){
            processesArr[i].removeChild();
            console.log("remove child")
        }
        for(j=0;j<queue.length;j++){
            processesArr[i].appendChild(queue[j]);
    }
}


    // utilities to dequeue from each queue

    document.getElementById("dfcfs").addEventListener("click", function(event){
        event.preventDefault();

        //This demonstrates shifts in the queue
        // console.log("hello");
        // move(fcfsQueue,1,0);

        //this demonstrates dequeuing
        dequeue(fcfsQueue);
    });

    
    document.getElementById("dsjn").addEventListener("click", function(event){
        event.preventDefault();       
        dequeue(sjnQueue);    
    });

    document.getElementById("dps").addEventListener("click", function(event){
        event.preventDefault();       
        dequeue(priorityQueue);    
    });

    document.getElementById("drr").addEventListener("click", function(event){
        event.preventDefault();       
        dequeue(rrQueue);    
    });


}
