const fstat = require('node:fs'); // statistics file 

  

  async function AddStatFile(id,N, Resp) {
    fstat.writeFile('./Data/state_Response_Time_'+id+'.txt', N+ " ; "+Resp+"\n", { flag: 'a+' }, err => {});
  }

  //AddBlockFile(2,Block);

 module.exports = { AddStatFile };