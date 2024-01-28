// miner 0 as server should be run as  :   node miner.js 0
// miner 1 as server should be run as  :   node miner.js 1

const WebSocket = require('ws');
const M= require('./MinersInfo');
const Mws= require('./WebSocketMiners');
const MwsRC= require('./WebSocketMinersRC');
const BH =  require('./BlockHash');
const SB =  require('./SaveBlockChain');

//const Block = '{"MessageType": "preprepare" ,  "clientId":0, "Payload":"..block..",  "N":0, TimeStamp:0 ,"RetN":0, "Cluster":[], "Hash":"--"}';

const id=process.argv.slice(2); // agument 

let ws=[];  // socket to other miners 
let ClientSock=[]; // id , socket connection 
let NbreMessages=[]; //example  [{"clientId":1,"NBlock":0 ,"MessageType":prepare,"Nbre":2   }  ]
//let Cl=[]; // cluster with nminers id 

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
   
    //console.log('received: type=%s N=%d', m.MessageType, m.N);

    switch(m.MessageType) {

      case "block" :  
                  console.log('in block , received: '+JSON.stringify( m));
                  console.log('in case block : received: client Id=%d type=%s N=%d NRet=%d',m.clientId, m.MessageType, m.N, m.RetN);
                   
                  if (m.Hash !== BH.HashBlock(m.Payload)) { // block verification 
                    console.log("in case block : refused Block by hasing : id=%d type=%s N=%d", m.clientId, m.MessageType, m.N);
                       break;
                    }
                  
                  res1 = NbreMessages.findIndex(({ clientId, NBlock, MessageType, TimeStamp }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "block" && TimeStamp===m.TimeStamp);
                  if ( res1 !== -1) 
                     { console.log("block is already validated :res=%d  id=%d  type=%s N=%d", res1, m.clientId, m.MessageType, m.N);
                     m.MessageType="replyClient";
                     Mws.sendMessageClient (ClientSock, message);   
                     break;}
                  //if (m.N==-2) { while (NbreMessages.length) NbreMessages.pop(); break;} // renew nbre transactions

                  res2 = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "block");
                  if ( res2 !== -1) console.log("Transaction already validated !!!");
                  
                  
                  m.MessageType="preprepare";

                 res3 = ClientSock.findIndex(({ id}) =>  id=== m.clientId);
                  if (res3 === NaN || res3 === -1)  ClientSock.push({"id":m.clientId,"sock":wss});
                  else ClientSock[res3]={"id":m.clientId,"sock":wss}; //// modify the sock of old client connected
                  
                 C= MwsRC.randomClusterForming2(m.clientId,m.N,m.RetN, m.TimeStamp, M.Miners.length, M.ClusterSize);
                 //Cl.push ({"id":m.clientId,"N":m.N, "C": C});
              
                 if (MwsRC.InCluster(id,C)) {
                       m.Cluster= C;
                       MwsRC.sendMessageAllCluster (ws, C, JSON.stringify(m));
                 }
                 break;
      case "preprepare" :  
                  console.log('received: client Id=%d type=%s N=%d', m.clientId,m.MessageType, m.N);
                  nb1=1

                 /* res4 = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId== m.clientId &&  NBlock==m.N && MessageType== "preprepare");
                  if (res4 === NaN || res4 === -1) NbreMessages.push({clientId:m.clientId, NBlock :m.N , MessageType :"preprepare", Nbre:1   }  );
                  else { nb1=  NbreMessages[res4].Nbre+1;
                         NbreMessages[res4]={clientId:m.clientId,NBlock:m.N ,MessageType:"preprepare", Nbre: nb1 } ; }
                  */

                  res4=M.IndexInMessagesList (NbreMessages, m, "preprepare" );
                  if ( res4 === -1){res4=NbreMessages.length;
                      NbreMessages.push({clientId:m.clientId, NBlock :m.N ,TimeStamp:m.TimeStamp,  MessageType :"preprepare", Nbre:1   }  );
                  }else { nb1=  NbreMessages[res4].Nbre+1;
                         NbreMessages[res4]={clientId:m.clientId,NBlock:m.N ,TimeStamp:m.TimeStamp, MessageType:"preprepare", Nbre: nb1 } ; }

                 

                  if (nb1+1>= (2*M.ClusterSize/3) ) {
                   if (NbreMessages[res4].Nbre==-1) break;
                    else NbreMessages[res4].Nbre=-1;
                    m.MessageType="prepare";
               
                    MwsRC.sendMessageAllCluster (ws,m.Cluster, JSON.stringify(m));
                 }
                 break;
      case "prepare" :
                  console.log('received: type=%s N=%d', m.MessageType, m.N);
                  nb2=1
                  //res5 = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "prepare");
                  res5=M.IndexInMessagesList (NbreMessages, m, "prepare" );
                  if ( res5 === -1) {res5=NbreMessages.length;
                        NbreMessages.push({clientId:m.clientId, NBlock :m.N ,TimeStamp:m.TimeStamp, MessageType :"prepare", Nbre:1   }  );
                  }else { nb2=  NbreMessages[res5].Nbre+1;
                         NbreMessages[res5]={clientId:m.clientId,NBlock:m.N ,TimeStamp:m.TimeStamp,MessageType:"prepare", Nbre: nb2 } ; }
                       // console.log("Nbre :", NbreMessages[res].Nbre);
                      
                 if (nb2+1>=(2*M.ClusterSize/3) ) { 
                  if (NbreMessages[res5].Nbre==-1) break;
                   else NbreMessages[res5].Nbre=-1;
                  m.MessageType="commit";

                  MwsRC.sendMessageAllCluster (ws,m.Cluster, JSON.stringify(m));
                 
                 }
                  break;
      case "commit" :
                  console.log(' received: type=%s N=%d', m.MessageType, m.N);
                  nb3=1
                  
                  res6=M.IndexInMessagesList (NbreMessages, m, "commit" );
                  //res6 = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "commit");
                  if ( res6 === -1) {res6=NbreMessages.length;
                         NbreMessages.push({clientId:m.clientId, NBlock :m.N ,TimeStamp:m.TimeStamp, MessageType :"commit", Nbre:1   }  );}
                  else { nb3=  NbreMessages[res6].Nbre+1;
                         NbreMessages[res6]={clientId:m.clientId,NBlock:m.N ,TimeStamp:m.TimeStamp,MessageType:"commit", Nbre: nb3 } ; }
                       // conole.log("Nbre :", NbreMessages[res].Nbre);
                      
                 if (nb3+1>= (2*M.ClusterSize/3) ) { 
                  if (NbreMessages[res6].Nbre==-1) break;
                   else NbreMessages[res6].Nbre=-1;
                  console.log(' received: N=%d', m.N, "  is Commited commited ");
                  m.MessageType="replyClient";
                  Mws.sendMessageClient (ClientSock, JSON.stringify(m));

                  SB.AddBlockFile(id,JSON.stringify(m)); /// save block..................

                  m.MessageType="replyOther";
               
                  MwsRC.sendMessageAllOutsideCluster (ws,m.Cluster, JSON.stringify(m));
                  
                   }
                  break;
      case "replyOther" :
                  console.log(' received: type=%s N=%d', m.MessageType, m.N);

                  nb4=1
                  res7=M.IndexInMessagesList (NbreMessages, m, "replyOther" );
                  //res7 = NbreMessages.findIndex(({ clientId, NBlock, MessageType }) =>  clientId=== m.clientId &&  NBlock===m.N && MessageType=== "replyOther");
                  if (res7 === -1) {res7=0;
                    NbreMessages.push({clientId:m.clientId, NBlock :m.N ,TimeStamp:m.TimeStamp, MessageType :"replyOther", Nbre:1   }  );
                  }else { nb4=  NbreMessages[res7].Nbre+1;
                         NbreMessages[res7]={clientId:m.clientId,NBlock:m.N ,TimeStamp:m.TimeStamp,MessageType:"replyOther", Nbre: nb4 } ; }
                       // conole.log("Nbre :", NbreMessages[res].Nbre);
                      
                 if (nb4>= (2*M.ClusterSize/3) ) { 
                  if (NbreMessages[res7].Nbre==-1) break;
                   else NbreMessages[res7].Nbre=-1;
                  console.log(' received: N=%d', m.N, " is Commited commited by Others *");
                  m.MessageType="replyClient";
                  Mws.sendMessageClient (ClientSock, JSON.stringify(m));
                  SB.AddBlockFile(id,JSON.stringify(m)); /// save block..................
                  
                 }

                  //if (NbreMessages.length>100) delete NbreMessages[NbreMessages.lenght-1]; 
                  break;
    }
    
  });

  
});
