socket.on('message', function incoming(m) {
  switch(m.MessageType) {
    case "block" :                             
        if (m.Hash !== HashBlock(m.Payload)) break;          
        m.MessageType="preprepare";
        nb1=nb2=nb3=0;
        C= random_Cluster_Forming(clientId,TransactionNumber, m.TimeStamp);
        if (InCluster(m.id,C)) sendMessageAllCluster (ws, C, m);
        break;
    case "preprepare" :  
        nb1++
        if (nb1> 2*ClusterSize/3 ) {
            m.MessageType="prepare";
            sendMessageAllCluster (ws,m.Cluster, m);}
        break;
      case "prepare" :
        nb2++
        if (nb2> 2*ClusterSize/3 ) { 
            m.MessageType="commit";
            sendMessageAllCluster (ws,Cluster, m); }
        break;
      case "commit" :
        nb3++
        if (nb3>=2*M.ClusterSize/3 ) { 
            m.MessageType="replyClient";
            Mws.sendMessageClient (ClientSock, m);
            AddBlockFile(id,JSON.stringify(m)); 
            m.MessageType="replyOther";
            sendMessageAllOutsideCluster (ws,m.Cluster, m);}
        break;
      case "replyOther" :
        nb4++             
        if (nb4>= (2*M.ClusterSize/3) ) { 
            m.MessageType="replyClient";
            sendMessageClient (ClientSock, m);
            AddBlockFile(id,m); }
        break;
    }
    
  });