const WebSocket = require('ws');
const M= require('./MinersInfo');
const Mws= require('./WebSocketMiners');
const BH =  require('./BlockHash');
const St =  require('./StatSave.js');

/////// main 
let ws=[];  //sockets
const Block = '{"MessageType": "block" ,  "clientId":0, "Payload":"..block..",  "N":0, "RetN":0,  "TimeStamp":0 ,"Cluster":[], "Hash":"--", "StartTime":0}';
let m=JSON.parse(Block) ;

m.Hash=BH.HashBlock(m.Payload);



var id=process.argv.slice(2); // agument for client id
//var nbre = process.argv.slice(4); // agument for number de transactions to send 
if (id=="" ) id="0";
console.log("client "+id);
m.clientId=Number(id);

let Te1 = process.hrtime();
let MessageNbre=0;

let MNbre={}
let MConsensus ={}
var BRTime=[];

async function Resend_on_View_Change (TimeOut=500) {
     
    const id = setInterval(() => {
        // runs every 2 seconds
        for (var i=0; i< BRTime.length;i++) {
            //console.log("==> i= "+i+" id= "+BRTime[i].N+" retN: "+BRTime[i].RetN);
             if (BRTime[i].RetN!==-1) 
             {  let t=process.hrtime()[0]*1000+process.hrtime()[1]/1000000;
                let dt=t-  BRTime[i].TimeStamp;
                if (dt>TimeOut)  { BRTime[i].TimeStamp=t; 
                                   BRTime[i].RetN++;  
                                  console.log("--- resend---: message  :"+ JSON.stringify(BRTime[i]) +" ind= "+i);
                                  Mws.sendMessageAllMiners (ws, BRTime[i]);
                                  }
             }     
        } 

      }, TimeOut);
      //clearInterval(id); to stop 


}



const mainClient = async () => {  ////////////////////////////////////
   let lIsOpen= await Mws.VerifyAllMiners ();
   //CreateSoketsMiners ();
   ws=Mws.CreateSoketsAllMinersV2(lIsOpen);
   Mws.ConnectSoketsMiners(ws);

  // send messages Block (m) from id = ... , and lenght = ..
  ids=0;  // id block of start , then it will incremented 

  let l=1000; // number of transactions ...+++++++++++++++++++++++++++++++++++

  Mws.sendManyMessageAllMiners_period(ws,m,ids, period=1,TEnd=period*100,BRTime); //(ws,m,ids,d priod,TEnd end simulation, BRTime)
  //Mws.sendManyMessageAllMiners_period_Microsecond(ws,m,ids, period=500,TEnd=period*1000,BRTime);
 //Mws.sendManyMessageAllMiners (ws,m,ids,l,BRTime); // burst traffic 

   
   Resend_on_View_Change(M.TimeOut);

  // {"MessageType": "preprepare" , "clientId":0, "Payload":"..block..","N":0, "RetN":0,"TimeStamp":0 , "Cluster":[], "Hash":"--"}';
  
  
  ws.forEach(w => {w.s.on('message', function incoming(message) {
    //console.log("message receive:  "+message.toString());

    //MessageNbre=MessageNbre+1;
   let Te2 = process.hrtime();
    //console.log("Time in millisecond is: ", (Te2[0]-Te1[0]) * 1000 + (Te2[1]-Te1[1]) / 1000000);
  
    let m=JSON.parse(message);
    
    if (!(m.N in MNbre)) { MNbre[m.N]=0; MConsensus[i]=-1; } 

    MNbre[m.N]+= 1;
    //if (m.N % 100==0) console.log("message receive (every 100): N°="+m.N+" message Number= "+MNbre[m.N]);
   //console.log("message received: N°="+m.N+" message Number= "+MNbre[m.N]);

    if (MNbre[m.N] > (M.Miners.length/2) && MConsensus[m.N]!=1)  
        {  MessageNbre++;
            m.RetN=-1; // to say that message is sent 
            BRTime[m.N].RetN=-1;

           let t=  process.hrtime()[0]*1000+process.hrtime()[1]/1000000-  m.StartTime;
           console.log("\n$$$ Total validated B Nbre="+MessageNbre+" --Consensus is reached for block N°= "+m.N);
           console.log("$$$ for block N°="+m.N+ "  Response Time = "+ t +"ms \n");
           St.AddStatFile(id,m.N,t );
           MConsensus[m.N]=1; }
     //console.log("message receive : N°="+m.N);
    }); });


 }


 ////////////////// start main 
mainClient();

