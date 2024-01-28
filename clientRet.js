const WebSocket = require('ws');
const M= require('./MinersInfo');
const Mws= require('./WebSocketMiners');
const BH =  require('./BlockHash');


let ws=[];  //sockets
const Block = '{"MessageType": "block" ,  "clientId":0, "Payload":"..block..",  "N":0,"RetN":0, "Cluster":[], "Hash":"--"}';
let m=JSON.parse(Block) ;

m.Hash=BH.HashBlock(m.Payload);

let RTime=[];

function CreateSoketsMiners (){
    M.Miners.forEach(Miner=> {ws.push(new WebSocket('ws://'+Miner.ipAdress+':'+Miner.port));});
}



/////// main 

var id=process.argv.slice(2); // agument for client id
//var nbre = process.argv.slice(4); // agument for number de transactions to send 


//CreateSoketsMiners ();
ws=Mws.CreateSoketsAllMiners();
Mws.ConnectSoketsMiners(ws);


if (id=="" ) id="0";
console.log("client "+id);
m.clientId=Number(id);

let Te1 = process.hrtime();
let MessageNbre=0;
console.log("Time in millisecond is: ", Te1[0] * 1000 + Te1[1] / 1000000);

for (k=0;k<10;k++)
      {m.N=k;
       ms= JSON.stringify(m);
       console.log("message send :"+ms);
       ws.forEach( (w, i) => {    Mws.sendMessage (w.s,ms);
                                 console.log("For Node :"+i);});
      }

// {"MessageType": "preprepare" , "clientId":0, "Payload":"..block..","N":0, "RetN":0, "Cluster":[], "Hash":"--"}';
ws.forEach(w => {w.s.on('message', function incoming(message) {
  //console.log("message receive:  "+message.toString());

  MessageNbre=MessageNbre+1;
  let Te2 = process.hrtime();
  
  //console.log("Time in millisecond is: ", (Te2[0]-Te1[0]) * 1000 + (Te2[1]-Te1[1]) / 1000000);
  
  let m=JSON.parse(message);
 //if (m.N % 100==0) 
 console.log("message receive (every 100): N°="+m.N+" message Number= "+MessageNbre);

  //console.log("message receive : N°="+m.N);
  

  
}); });




