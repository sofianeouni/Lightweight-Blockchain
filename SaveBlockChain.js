
const Block = '{"MessageType": "block" ,  "clientId":0, "Payload":"..block..",  "N":0, "Cluster":[], "Hash":"--"}';

const fs = require('node:fs'); 

async function AddBlockFile(Miner,B) {
    fs.writeFile('./Data/BlockchainFile_'+Miner+'.txt', B+"\n", { flag: 'a+' }, err => {});
  }
  

  
  //AddBlockFile(2,Block);

 module.exports = { AddBlockFile };


