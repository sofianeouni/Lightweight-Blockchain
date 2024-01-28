const WebSocket = require('ws');
const M= require('./MinersInfo');
const Mws= require('./WebSocketMiners');
const crypto = require('crypto');


function getRandomCluster (Cl, maxId) {
    let Cl_id=[]; 
    let id1 =0;
    
    for (i=0;i<Cl;i++) {   
        do {
         id1= Math.floor(Math.random() * (maxId+1));
         found = Cl_id.find((e) => e== id1);
        } while (found !== NaN && found !== undefined );
        Cl_id.push (id1);
    }
    
  return Cl_id ;
}

function InCluster (e,cl) {
    for (i=0;i<cl.length;i++)
        if (cl[i] == e) return true;
    return false ;
}



function sendMessageAllCluster (ws,cl, m){  
    //displayCluster (cl);
    
    ws.forEach( (w, i) => { 
        
        if (InCluster(w.id,cl) )  { 
                       Mws.sendMessage (w.s,m);    
                      // console.log("id to send:"+w.id);
                   }    
        });

}

function sendMessageAllOutsideCluster (ws,cl, m){  
    //displayCluster (cl);
    
    ws.forEach( (w, i) => {         
        if (!InCluster(w.id,cl) )  { 
                       Mws.sendMessage (w.s,m);    
                      // console.log("id to send:"+w.id);
                   }    
        });

}



function randomNumberHash (idClient,TNbre,i, NberNodes, RetN )
{
 const secret = '24200000000'; 
 d=String(idClient)+String(TNbre)+String(i)+String(RetN);
// Calling createHash method
 const hash = crypto.createHash('sha1', secret)  
                   // updating data
                   .update(d)
                   // Encoding to be used
                   .digest('hex');
                                   
 let ha=parseInt(hash.substring(1, 5), 16);
 ha=ha % NberNodes;
 return ha;
}


function randomClusterForming (idClient,TNbre, RetN, NberNodes, ClusterSize)
{  // it takes 8ms of time !
    let Cl_id=[];
    //console.log("ClusterSize="+ClusterSize);
    for (i=0;i<ClusterSize;i++)
    {
        j=0;
        do {
            id1=randomNumberHash (idClient,TNbre,j+i, NberNodes, RetN );
            found = Cl_id.find((e) => e== id1);
            j=j+1;
           } while (found !== NaN && found !== undefined );
        //console.log("id1="+id1);
        Cl_id.push (id1);
        
    }
    displayCluster (Cl_id);
    return Cl_id;
}


function randomNumberHash2 (idClient,TNbre,i, NberNodes, RetN, TimeStamp)
{
 const secret = '24200000000'; 
 d=String(idClient)+String(TNbre)+String(i)+String(RetN)+String(TimeStamp);
// Calling createHash method
 const hash = crypto.createHash('sha1', secret)  
                   // updating data
                   .update(d)
                   // Encoding to be used
                   .digest('hex');
                                   
 let ha=parseInt(hash.substring(1, 5), 16);
 ha=ha % NberNodes;
 return ha;
}


function randomClusterForming2 (idClient,TNbre, RetN, TimeStamp, NberNodes, ClusterSize)
{  // it takes 8ms of time !
    let Cl_id=[];
    //console.log("ClusterSize="+ClusterSize);
    for (i=0;i<ClusterSize;i++)
    {
        j=0;
        do {
            id1=randomNumberHash2 (idClient,TNbre,j+i, NberNodes, RetN, TimeStamp );
            found = Cl_id.find((e) => e== id1);
            j=j+1;
           } while (found !== NaN && found !== undefined );
        //console.log("id1="+id1);
        Cl_id.push (id1);
        
    }
    displayCluster (Cl_id);
    return Cl_id;
}



function displayCluster (cl)
{
console.log("lenght="+cl.length);
for (i=0;i<cl.length;i++){
    console.log(cl[i]);
}
}


module.exports = { randomClusterForming, randomClusterForming2, sendMessageAllCluster, InCluster , sendMessageAllOutsideCluster, displayCluster};

/*
///test
Te = process.hrtime();
//console.log("time:"+Te);
console.log("Time in millisecond is: ", Te[0] * 1000 + Te[1] / 1000000);
let cl = randomClusterForming ("2","1", 6, 4);
Te = process.hrtime();
console.log("Time in millisecond is: ", Te[0] * 1000 + Te[1] / 1000000);
//console.log("time:"+Te);

console.log("lenght="+cl.length);
for (i=0;i<cl.length;i++){
    console.log(cl[i]);
}
*/

/// tests 
/*
let cl=getRandomCluster (4, 6);
console.log("lenght="+cl.length);
for (i=0;i<cl.length;i++){
    console.log(cl[i]);
}*/
