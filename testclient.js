const WebSocket = require('ws');


console.log("111111");
/*
try {
var ws = new WebSocket('ws://localhost:8080');
} catch (error) { console.log("port !!!!!!");}
*/
/*
const http = require('http');
const req = http.get('http://localhost:8090');

req.on('error', console.error);
req.abort();*/
// 'ws://localhost:8090'



async function TestServerOpen(Strws) {
    
  let promise = new Promise((resolve, reject) => {      
    var ws = new WebSocket(Strws);
  
    ws.on('error', (error) => {
        setTimeout(() => { ws.close(); }, 0)
        resolve(false) });

    ws.on('open', (connection) => {
        setTimeout(() => { ws.close(); }, 0)
        resolve(true)});
    });

  let result = await promise;

  return result;
}

async function f() {
  Strws= 'ws://localhost:8182';
  let a= await TestServerOpen(Strws)
  //console.log("22222: cond="+a);
  return a.toString();
}

TestServerOpen('ws://localhost:8181').then((value) => {
    console.log(value);
    // Expected output: 123
  });
//console.log ("res="+f());

/*

async function TestServerOpen(Strws) {
    
  let promise = new Promise((resolve, reject) => {      
    var ws = new WebSocket(Strws);
  
    ws.on('error', (error) => {
        console.log("$$$$$$$$$$$");
        setTimeout(() => { ws.close(); }, 0)
        resolve(false) });

    ws.on('open', (connection) => {
    console.log("++++++++++++++++");
        setTimeout(() => { ws.close(); }, 0)
        resolve(true)});

    });

  let result = await promise;

  return result;
 }

async function ifOpenServer(Strws) {

  let a= await TestServerOpen(Strws)
  return a ;
}

let a = ifOpenServer('ws://localhost:8182');
console.log(" if server is open "+a);
*/

/*
const waitForOpenConnection = (socket) => {
    return new Promise((resolve, reject) => {
        const maxNumberOfAttempts = 10
        const intervalTime = 200 //ms

        let currentAttempt = 0
        const interval = setInterval(() => {
            if (currentAttempt > maxNumberOfAttempts - 1) {
                clearInterval(interval)
                reject(new Error('Maximum number of attempts exceeded'))
            } else if (socket.readyState === socket.OPEN) {
                clearInterval(interval)
                resolve()
            }
            currentAttempt++
        }, intervalTime)
    })
}

const sendMessage = async (socket, msg) => {
    if (socket.readyState !== socket.OPEN) {
        try {
            //await waitForOpenConnection(socket)
            socket.send(msg)
            setTimeout(() => {
                console.log("Delayed for 1 second.");
              }, "1000");

        } catch (err) { console.error(err) }
    } else {
        socket.send(msg)
    }
}

console.log("+++++++++3");
ws.on('open', function open() {
    console.log('connected');
    ws.send('something');
  });
  
  ws.on('message', function incoming(data) {
    console.log(`received: ${data}`);
  });
  
  ws.on('close', function close() {
    console.log('disconnected');
  });
  
  */