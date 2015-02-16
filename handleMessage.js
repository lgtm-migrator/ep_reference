/***
*
* Responsible for negotiating messages between two clients
*
****/

var authorManager = require("../../src/node/db/AuthorManager"),
padMessageHandler = require("../../src/node/handler/PadMessageHandler"),
            async = require('../../src/node_modules/async');

/* 
* Handle incoming messages from clients
*/
exports.handleMessage = function(hook_name, context, callback){
  // Firstly ignore any request that aren't about chat
  var isreferenceMessage = false;
  if(context){
    if(context.message && context.message){
      if(context.message.type === 'COLLABROOM'){
        if(context.message.data){ 
          if(context.message.data.type){
            if(context.message.data.type === 'reference'){
              isreferenceMessage = true;
            } 
          }
        }
      }
    }
  }
  if(!isreferenceMessage){
    callback(false);
    return false;
  }

  var message = context.message.data;
  /***
    What's available in a message?
     * action -- The action IE chatPosition
     * padId -- The padId of the pad both authors are on
     * targetAuthorId -- The Id of the author this user wants to talk to
     * message -- the actual message
     * myAuthorId -- The Id of the author who is trying to talk to the targetAuthorId
  ***/
  if(message.action === 'sendreferenceMessage'){
    
    wordnet.lookup(message.message, function(err, definitions) {   

      if(err) return;
      var msg = {
        type: "COLLABROOM",
        data: { 
          type: "CUSTOM",
          payload: {
            action: "recievereferenceMessage",
            authorId: message.myAuthorId,
            padId: message.padId,
            message: definitions
          }
        }
      };
      context.client.json.send(msg);
    });
  }

  if(isreferenceMessage === true){
    callback([null]);
  }else{
    callback(true);
  }
}
