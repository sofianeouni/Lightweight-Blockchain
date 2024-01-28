
// "192.168.1.67"
const Miners = [
    { id: 0 ,  ipAdress: "127.0.0.1",  port: 8181}
   , {id: 1 , ipAdress: "127.0.0.1",   port: 8182}
   , {id: 2 , ipAdress: "127.0.0.1",   port: 8183}
   , {id: 3 , ipAdress: "127.0.0.1",   port: 8184}
   , {id: 4 , ipAdress: "127.0.0.1",   port: 8185}
  , {id: 5 , ipAdress: "127.0.0.1",   port: 8186}
   , {id: 6 , ipAdress: "127.0.0.1",   port: 8187}
   , {id: 7 , ipAdress: "127.0.0.1",   port: 8188}
   ,{id: 8 , ipAdress: "127.0.0.1",   port: 8189}
   , {id: 9 , ipAdress: "127.0.0.1",   port: 8190}
    ];

    const ClusterSize = 10;
    const TimeOut=8000

    const MTypes = {
        block: 'block',
        preperare: 'prepare',
        prepere: 'prepare',
        commit:'commit',
        replyOther : 'replyOther',
        replyClient : 'replyClient'
    }
    
    
    function dispayMessage(message){
       // const Block = '{"MessageType": "block" ,  "clientId":0, "Payload":"..block..",  "N":0, "Cluster":[], "Hash":"--"}';
       let m=JSON.parse(Block) ;
       //.......
       console.log (message);

    }



    function IndexInMessagesList (NbreMessages, m, mtype  ){
        //NbreMessages[res4]={clientId:m.clientId,NBlock:m.N ,MessageType:"preprepare", Nbre: nb1 } 
        l= Object.keys(NbreMessages).length   
        //if (l >= 10) IdisplayNb (NbreMessages);
        for(i=0;i<l ; i++)
         { 
           if (NbreMessages[i].clientId === m.clientId && NbreMessages[i].NBlock === m.N
                   && NbreMessages[i].MessageType===mtype && NbreMessages[i].TimeStamp===m.TimeStamp) return (i);
         }
         return -1;

        //  clientId, NBlock, MessageType }) =>  clientId== m.clientId &&  NBlock==m.N && MessageType== "preprepare"
    }

    function IdisplayNb (NbreMessages){
        l1= Object.keys(NbreMessages).length   
        for(i1=0;i1<l1 ; i1++)
         {  
            console.log("[i]=["+i1+"]  Id="+NbreMessages[i1].clientId+" N="+NbreMessages[i1].NBlock+" Type="+NbreMessages[i1].MessageType+" Nbre="+  NbreMessages[i1].Nbre )
         }
    }
    
// test
/*
var NbreMessages=[]
NbreMessages.push({clientId:0,NBlock:0 ,MessageType:"preprepare", Nbre: 0 } );
NbreMessages.push({clientId:0,NBlock:1 ,MessageType:"preprepare", Nbre: 1 } );
NbreMessages.push({clientId:0,NBlock:2 ,MessageType:"preprepare", Nbre: 2 } );
console.log("l="+Object.keys(NbreMessages).length  )
m={clientId:0, N:1 }
mtype="preprepare"
indi=IndexInMessagesList (NbreMessages, m, mtype  )
console.log("indi="+indi);
*/



module.exports = {Miners, MTypes,ClusterSize, dispayMessage, IndexInMessagesList };
