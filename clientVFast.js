const WebSocket = require('ws');
const M= require('./MinersInfo');
const Mws= require('./WebSocketMiners');
const BH =  require('./BlockHash');

/////// main 
let ws=[];  //sockets
const Block = '{"MessageType": "block" ,  "clientId":0, "Payload":"..block..",  "N":0,"RetN":0,  "TimeStamp":0 ,"Cluster":[], "Hash":"--"}';
let m=JSON.parse(Block) ;

m.Hash=BH.HashBlock(m.Payload);

let RTime=[];

var id=process.argv.slice(2); // agument for client id
//var nbre = process.argv.slice(4); // agument for number de transactions to send 

//const mainClient = async () => {  ////////////////////////////////////
//   let lIsOpen= await Mws.VerifyAllMiners ();
   //CreateSoketsMiners ();
   
  ws=Mws.CreateSoketsAllMiners(); // without testing if miner has open communication ports 
  Mws.ConnectSoketsMiners(ws);


  if (id=="" ) id="0";
  console.log("client "+id);
  m.clientId=Number(id);

  let Te1 = process.hrtime();
  let MessageNbre=0;

  let MNbre={}
  let MConsensus ={}
  let BRTime={};
  // send messages Block (m) from id = ... , and lenght = ..
  ids=0;  // id block of start , then it will incremented 

  let l=20; // number of transactions ...+++++++++++++++++++++++++++++++++++


  { Mws.sendManyMessageAllMiners_period(ws,m,ids, period=10,TEnd=30,BRTime); //(ws,m,ids,d priod,TEnd end simulation, BRTime)
   l=TEnd/period; }

  //Mws.sendManyMessageAllMiners (ws,m,ids,l,BRTime); // burst traffic 

  // init Nbre message , consensus false, not yet done 
  for (i=ids; i<ids+l;i++) { MNbre[i]=0; MConsensus[i]=-1; }


  // {"MessageType": "preprepare" , "clientId":0, "Payload":"..block..","N":0, "RetN":0,"TimeStamp":0 , "Cluster":[], "Hash":"--"}';
  ws.forEach(w => {w.s.on('message', function incoming(message) {
    //console.log("message receive:  "+message.toString());

    //MessageNbre=MessageNbre+1;
   let Te2 = process.hrtime();
    //console.log("Time in millisecond is: ", (Te2[0]-Te1[0]) * 1000 + (Te2[1]-Te1[1]) / 1000000);
  
    let m=JSON.parse(message);
    MNbre[m.N]+= 1;
    //if (m.N % 100==0) console.log("message receive (every 100): N°="+m.N+" message Number= "+MNbre[m.N]);
    //console.log("message received: N°="+m.N+" message Number= "+MNbre[m.N]);

    if (MNbre[m.N] > (M.Miners.length/2) && MConsensus[m.N]!=1)  
        {  MessageNbre++;
            BRTime[m.N] =  process.hrtime()[0]*1000+process.hrtime()[1]/1000000-  m.TimeStamp;
           console.log("\n$$$ Total validated B Nbre="+MessageNbre+" --Consensus is reached for block N°= "+m.N);
           console.log("$$$ for block N°="+m.N+ "  Response Time = "+ BRTime[m.N] +"ms \n");

           MConsensus[m.N]=1; }
     //console.log("message receive : N°="+m.N);
    }); });


 


 

