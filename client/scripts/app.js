

// figure out how to protect site from XSS attacks

var app = {
  // server is the url where we are sharing and retrieving messages from each other
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  
  // option 1
  messages: [],
  usernames: [],

  // need to filter messages by roomname
  roomnames: [],

  // option 2
  // messages: {results: []}, (same as server-side results)

  
  
  renderMessage: function() {
    // takes in a written message and prepends all of our messages into the DOM (in our chat box)
    console.log('render message: ' + JSON.stringify(this));
    $('.chats').prepend(`<div class="addedMessage"> ${JSON.stringify(app.messages)} </div>`);
    // $('.chats').prepend(`<div class="addedMessage"> ${this.username} ${this.text} </div>`);
  },

  fetch: function() {
    // console.log('this', this);
    
    //wrap get in function that does not execute instantly
    //returns get
    
    
    console.log('this.renderMessage', this.renderMessage());
    // gets data from the server and calls render message with that data
    // console.log('fetch: ' + JSON.stringify(this));
    $('#refreshMessages').on('click', function() {
      console.log('this', this);
      $.get(app.server, app.renderMessage()); 
    });
  },
  
  submit: function() {
    var message = {};
    $('#inputMessageSubmit').on('click', function (event) {
      
      message.text = $('#inputMessageValue').val();
      message.username = window.location.search.split('username=')[1];
      
      console.log('this', this);
      console.log('message ', message);
      
      message.roomname = 'lobby';
      console.log('room', message.roomname);
      
      console.log('message text ', message.text);
      console.log('username ', message.username);
      
      event.preventDefault();
      app.send(message);
    });
  },
  
  send: function(message) {
    // this should send in a user inputted message to the server
    
    // this action will only happen when the submit button is called and it has a valid message
    // select inputted message using jquery (put that in a data key)
    
    // post call with ajax sends msg info to server
    // var message = {username: 'willPutnam', text: 'hello', roomname: '4chan'};
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      // need to get our messages in the correct format (stringified objects)
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },


  clearMessages: function() {
  //deletes all prepended messages from the DOM (pre refresh)
    $('#deleteMessages').on('click', function() {
      console.log('messages deleted');
      $('.chats').empty();
    });
  },

  // renderRoom: function(roomname) {
  //   // filtering all messages (ajax requests) by roomname
  //   // var coolTweets = messages.filter(function(msg) {
  //   //   return msg.roomname = roomname;
  //   // });
  //   // return coolTweets.forEach(function(user) {
  //   //   $('.messageContainer').prepend('<div>' + user.username + user.text + '</div>');
  //   // });
  
  // },

  // befriend: function() {
  //   $('username').on('click', function() {});
  //   // add friend clicked on to user's list of friends
  
  // },
  
  init: function() {
    app.fetch();
    app.submit();
    app.send();
    // app.renderMessage();
    app.clearMessages();
    // app.renderRoom();
    // app.befriend();
    console.log('page has initialized');
  // invokes all methods upon loading
  }

};

$(document).ready(function() { 
  console.log('doc is ready');
  
  app.init();
});

