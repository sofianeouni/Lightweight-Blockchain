// miner 0 as server should be run as  :   node miner.js 0
// miner 1 as server should be run as  :   node miner.js 1

const WebSocket = require('ws');
const M= require('./MinersInfo');
const Mws= require('./WebSocketMiners');
const BH =  require('./BlockHash');

//const BlockPre = '{"MessageType": "preprepare" , "clientId":0, "Payload":"..block..","N":0}';

const id=process.argv.slice(2); // agument 

let ws=[];  // socket to other miners 
let ClientSock=[]; // id , socket connection 
let NbreMessages=[]; //example  [{"clientId":1,"NBlock":0 ,"MessageType":prepare,"Nbre":2   }  ]

const wsss = new WebSocket.Server({ port: M.Miners[id].port }); // wss web server socket 
//const wss = new WebSocket.Server({ port: 8080 });

console.log('Nbre of Miners:'+M.Miners.length ); 
console.log("Node id="+id+"  port :"+M.Miners[id].port);
console.log('Server start:');



wsss.on('connection', function connection(wss) {
  if (ws.length==0)
     { ws=Mws.CreateSoketsOtherMiners(id);  // create socket link to the other Miners
       Mws.ConnectSoketsMiners(ws); }
  
  wss.on('message', function incoming(message) {
    let m=JSON.parse(message)
    
    //2*M.Miners.length/3
    //console.log('received: type=%s N=%d', m.MessageType, m.N);

    switch(m.MessageType) {

      case "block" : 
                  if (m.Hash !== BH.HashBlock(m.Payload)) {
                      console.log("in case block : refused Block by hasing : type=%s N=%d", m.clientId, m.MessageType, m.N);
                      break;
                      }
                  console.log('in case block : received from %s : type=%s N=%d', m.clientId, m.MessageType, m.N);
                  if (m.N==-2) { while (NbreMessages.length) NbreMessages.pop(); break;} // renew nbre transactions
                  
                 
                  m.MessageType="preprepare";

                  res = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "preprepare");
                  if ( res !== -1) console.log("Transaction already validated !!!");

                  res = ClientSock.findIndex(({id}) =>  id=== m.clientId);
                  if (res === NaN || res === -1)  ClientSock.push({id:m.clientId,sock:wss});
                  else {ClientSock[res]={id:m.clientId,sock:wss}; //// need some optimisations    
                          }
                  //wss.send( JSON.stringify({"MessageType": "block" ,  "clientId":0, "Payload":"..test..",  "N":-20}));
                 Mws.sendMessageAll (ws, JSON.stringify(m));
                 break;
      case "preprepare" :  
                  //console.log('received: type=%s N=%d', m.MessageType, m.N);
                  nb1=1
                  res = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "preprepare");
                  if (res === NaN || res === -1) NbreMessages.push({clientId:m.clientId, NBlock :m.N , MessageType :"preprepare", Nbre:1   }  );
                  else { nb1=  NbreMessages[res].Nbre+1;
                         NbreMessages[res]={clientId:m.clientId,NBlock:m.N ,MessageType:"preprepare", Nbre: nb1 } ; }
                  
                 if (nb1>= (2*M.Miners.length/3) ) {
                  if (NbreMessages[res].Nbre==-1) break;
                   else NbreMessages[res].Nbre=-1;
                 m.MessageType="prepare";
                 Mws.sendMessageAll (ws, JSON.stringify(m));
                 }
                 break;
      case "prepare" :
                  //console.log('received: type=%s N=%d', m.MessageType, m.N);
                  nb2=1
                  res = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "prepare");
                  if (res === NaN || res === -1) NbreMessages.push({clientId:m.clientId, NBlock :m.N , MessageType :"prepare", Nbre:1   }  );
                  else { nb2=  NbreMessages[res].Nbre+1;
                         NbreMessages[res]={clientId:m.clientId,NBlock:m.N ,MessageType:"prepare", Nbre: nb2 } ; }
                       // console.log("Nbre :", NbreMessages[res].Nbre);
                      
                 if (nb2>= (2*M.Miners.length/3) ) { 
                  if (NbreMessages[res].Nbre==-1) break;
                   else NbreMessages[res].Nbre=-1;
                  m.MessageType="commit";
                  Mws.sendMessageAll (ws, JSON.stringify(m));
                 }
                  break;
      case "commit" :
                 //console.log(' received: type=%s N=%d', m.MessageType, m.N);
                  nb3=1
                  res = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "commit");
                  if (res === NaN || res === -1) NbreMessages.push({clientId:m.clientId, NBlock :m.N , MessageType :"commit", Nbre:1   }  );
                  else { nb3=  NbreMessages[res].Nbre+1;
                         NbreMessages[res]={clientId:m.clientId,NBlock:m.N ,MessageType:"commit", Nbre: nb3 } ; }
                       // conole.log("Nbre :", NbreMessages[res].Nbre);
                      
                 if (nb3>= (2*M.Miners.length/3) ) { 
                  if (NbreMessages[res].Nbre==-1) break;
                   else NbreMessages[res].Nbre=-1;
                  console.log(' received: N=%d', m.N);
                  console.log("is Commited commited ");
                  m.MessageType="replayClient";
                  Mws.sendMessageClient (ClientSock, message);
                  

                  //if (NbreMessages.length>100) delete NbreMessages[NbreMessages.lenght-1]; // puege old info about old transactions
                   }
                  break;
    }
    //ws.send('Hello, server!'+ message);
  });

  //ws.send('Hello, welcome to the WebSocket server!');
});