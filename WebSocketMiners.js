const WebSocket = require('ws');
const M= require('./MinersInfo');
const Ms= require('./IntervalMicroseconds');


function CreateSoketsOtherMiners (Myid){ 
    var ws =[];
    M.Miners.forEach((Miner,i)=> { 
         if (i != Myid)  ws.push({id: i, s:new WebSocket('ws://'+Miner.ipAdress+':'+Miner.port)});            
            });  
    return ws  ;
}

// lIsOpen
function CreateSoketsAllMinersV2 (lIsOpen){ 
    var ws =[];
    M.Miners.forEach((Miner,i)=> { 
        let ur = 'ws://'+Miner.ipAdress+':'+Miner.port
       //TestServerOpen(ur).then((ifisConnected) => { // enhanced ...
       
            //if (ifisConnected) 
              if (lIsOpen[i].isOpen)
                 ws.push({id: i, s:  new WebSocket(ur) });   
            });   
       //});   

    return ws ; 
}



function CreateSoketsAllMiners (){ 
    var ws =[];
    M.Miners.forEach((Miner,i)=> { 
        let ur = 'ws://'+Miner.ipAdress+':'+Miner.port
       //TestServerOpen(ur).then((ifisConnected) => { // enhanced ...
       
            //if (ifisConnected) 
               ws.push({id: i, s:  new WebSocket(ur) });   
            });   
       //});   

    return ws ; 
}

 async function VerifyAllMiners (){ 
    var ws =[];
    for (i=0; i< M.Miners.length;i++ )
    //M.Miners.forEach((Miner,i)=> 
       {  Miner=M.Miners[i];
           let ur = 'ws://'+Miner.ipAdress+':'+Miner.port
            let a= await TestServerOpen(ur)
       
            if (a) ws.push({id: i, isOpen:true  });  
            else  ws.push({id: i, isOpen:false  });  
            }//);   
       //});   

    return ws ; 
}

function ConnectSoketsMiners (ws){
    ws.forEach( w => {
       // try{
             w.s.on('open', function open() {
                //w.send('Hello, Miner connect to server Miner ! : '); 
                console.log("connect to miner url: "+w.s.url);
                });
           // } catch (err){ console.log("Error in connection");}
    });
} 


const waitForOpenConnection = (socket) => {
    return new Promise((resolve, reject) => {
        const maxNumberOfAttempts = 10//
        const intervalTime = 5 //ms /////////////////////////////////////////////

        let currentAttempt = 0
        const interval = setInterval(() => {
            if (currentAttempt > maxNumberOfAttempts - 1) {
                clearInterval(interval)
              // reject(new Error('Maximum number of attempts exceeded'))
            } else if (socket.readyState === socket.OPEN) {
                clearInterval(interval)
                resolve()
            }
            currentAttempt++
        }, intervalTime)
    })
}

const sendMessage = async (socket, msg) => {
    if (socket.readyState !== socket.OPEN) {
        try {
            await waitForOpenConnection(socket)
           // if (socket.readyState === socket.OPEN) 
                      socket.send(msg);
        } catch (err) { console.error(err) 
                        //console.log("+++ Error of send!!!")
                       }
    } else {
        socket.send(msg)
    }
}

function sendMessageAll (ws, m){  
    ws.forEach( (w) => { 
       sendMessage (w.s,m);        
        });

}

function sendMessageClient (ClientSock, message){  // 
    let m=JSON.parse(message);
   // {"id":m.id,"sock":wws}
    ClientSock.forEach((cl)=> {   
        if ( cl.id == m.clientId) {cl.sock.send(message);
           // console.log("cl.id="+ cl.id+"  m.client="+m.clientId);
        }                                 
        });
}

function sendMessageAllMiners (ws,m){  ////*
    ws.forEach( (w, i) => {    sendMessage (w.s,JSON.stringify(m)); ////////////// ms
        console.log("For Miner Node :"+i);});
}


// send messages Block (m) from ids , length l
function sendManyMessageAllMiners (ws,m,ids,l,BRTime) /// async !!!
{
    for (k=ids;k<l+ids;k++)
      {m.N=k;
       m.TimeStamp= process.hrtime()[0]*1000+process.hrtime()[1]/1000000; // milliseconds
       let ms= JSON.stringify(m);
       console.log("message send :"+ms);//////
        BRTime[m.N]= m;
        sendMessageAllMiners (ws,m);
      
       //BRTime[k]= m.TimeStamp;
       //ws.forEach( (w, i) => {    Mws.sendMessage (w.s,ms);
       //                          console.log("For Node :"+i);});
      }
}


const waitForTime = (dt) => {
    return new Promise((resolve/*, reject*/) => {  
        const intervalTime = dt //ms
        const interval = setInterval(() => {
                clearInterval(interval)
                resolve()
            }, intervalTime) })
}

const waitForTimeMicrosecond = (dt) => {
    return new Promise((resolve/*, reject*/) => {  
        const intervalTime = dt //microsecond 
        const interval = Ms.setIntervalMs(() => {
                Ms.clearIntervalMs(interval)
                resolve()
            }, 'micro', intervalTime) })
}


// send messages Block (m) from ids , length l
const sendManyMessageAllMiners_period = async  (ws,m,ids,d,TEnd,BRTime) => {
  
    let ti=0; let k=ids;
    console.log("Start : generation");
    
    while (ti<TEnd)
      {
        m.N=k;
       
       console.log("time:"+ti);
     
       m.TimeStamp= process.hrtime()[0]*1000+process.hrtime()[1]/1000000; // milliseconds
       m.StartTime=  m.TimeStamp;
       let ms= JSON.stringify(m);
       console.log("message send :"+ms +" ind= "+k);
       BRTime.push(JSON.parse(ms)); // for retransmission, timinig computing of message block ...
       sendMessageAllMiners (ws,m);
      
       await waitForTime(d);
      
       ti=ti+d;
       k++;
      }
      k=k-ids;
      //displayBRTime(BRTime);//*********************************** */
      console.log("End transmission : Nbre Messages="+k);   
      
}


// send messages Block (m) from ids , length l
const sendManyMessageAllMiners_period_Microsecond = async  (ws,m,ids,d,TEnd,BRTime) => {
  
    let ti=0; let k=ids;
    console.log("Start : generation");
    
    while (ti<TEnd)
      {
        m.N=k;
       
       console.log("time:"+ti);
     
       m.TimeStamp= process.hrtime()[0]*1000+process.hrtime()[1]/1000000; // milliseconds
       m.StartTime=  m.TimeStamp;
       let ms= JSON.stringify(m);
       console.log("message send :"+ms +" ind= "+k);
       BRTime.push(JSON.parse(ms)); // for retransmission, timinig computing of message block ...
       sendMessageAllMiners (ws,m);
      
       await waitForTimeMicrosecond(d);
      
       ti=ti+d;
       k++;
      }
      k=k-ids;
      //displayBRTime(BRTime);//*********************************** */
      console.log("End transmission : Nbre Messages="+k);   
      
}


//////////////////////////////////

const WaitOpenConnection = async (socket) => {
    while (socket.readyState !== socket.OPEN) {
        try {
            await waitForOpenConnection(socket)
        } catch (err) { 
            console.error(err) 
        }
    } 
    //else {
        //socket.send(msg)
    //}
}

function WaitOpenCon(s){
    WaitOpenConnection (s)
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function TestServerOpen(Strws) {
    
    let promise = new Promise((resolve, reject) => {      
      var ws = new WebSocket(Strws);
    
      ws.on('error', (error) => { setTimeout(() => { ws.close(); }, 0)
          resolve(false) });
  
      ws.on('open', (connection) => { setTimeout(() => { ws.close(); }, 0)
          resolve(true)});
      });
  
    let result = await promise;
  
    return result;
  }

///////////// for test 
function displayBRTime(BRTime) {
  for (var i=0; i< BRTime.length;i++)
    console.log("==> i= "+i+" id= "+BRTime[i].N+" retN: "+BRTime[i].RetN);
}

module.exports = {CreateSoketsOtherMiners, CreateSoketsAllMiners, ConnectSoketsMiners,sendMessage, 
          sendMessageAll,sendMessageClient, WaitOpenCon , sendMessageAllMiners, sendManyMessageAllMiners, 
           sendManyMessageAllMiners_period , sleep, VerifyAllMiners, CreateSoketsAllMinersV2, 
             sendManyMessageAllMiners_period_Microsecond};

