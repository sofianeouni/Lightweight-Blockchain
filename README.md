# Lightweight-Blockchain (version1)
Copyright : This Work is done by :  Ouni Sofiane, Rabeb Ben Othmen Rabeb, Wassim Abbessi, Wafa Badreddine,  Gilles Dequen
CRISTAL Laboratory, RAMSIS Team, ENSI, Manouba University
And
Laboratoire Modelisation, Information, Systemes (MIS), Universite de Picardie Jules Verne

Corresponding Email : sofiane_ouni@yahoo.fr, sofiane.ouni@insat.ucar.tn
********************************************************************************************************

The application is made in nodeJS, you need to install before : npm

To run the blockchain you need to execute the nodes miner_RC.js  and the client to create the blocks 

The Running steps are : 
1. form the file : MinersInfo.js define all miners :  id, Ip address , port number . For exemple :
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

2. Run the all Miners in differents CMD (termininals). In our case form miner id=0 to miner id=9  :
   node miner_RC.js 0
   node miner_RC.js 1
   ...
   node miner_RC.js 9

3. Run the client application to create blocks. You can run several client. Each client has an id. In our case we will run client 0:
node client 0

In the code of client.js , we have the line that generate several blocks with period (in this case it is 1 millisecond) and TEnd for the end time of generation (in this cas it is about 100*1= 100 milliseconds). You can change this ligne to have diferent exécutions conditions for evaluation :
Mws.sendManyMessageAllMiners_period(ws,m,ids, period=1,TEnd=period*100,BRTime)

   
