
const crypto = require('crypto');



function HashBlock(BlockData)
{
 const secret = '24200000000'; 
 d=BlockData;
// Calling createHash method
 const hash = crypto.createHash('sha1', secret)  
                   // updating data
                   .update(BlockData)
                   // Encoding to be used
                   .digest('hex');
                                   
 
 return hash;
}



module.exports = {HashBlock };