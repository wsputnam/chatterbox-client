

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
  addFriend: function() {
    $('.addedMessage').on('click', function() {
      alert('chats div clicked');
      $(this).addClass('bold');
    });
  },

  
  renderMessage: function(user, text, createdAt) {
    // takes in a written message and prepends all of our messages into the DOM (in our chat box)
   
    $('.chats').prepend(`<div class="addedMessage"> <span class ="user ${user}">${user}</span> <span>${text} Posted on: ${createdAt} </span> </div>`);
  },

  fetch: function() {    
    //wrap get in function that does not execute instantly
    //returns get
    
    
    console.log('this.renderMessage', this.renderMessage());
    // gets data from the server and calls render message with that data
    // console.log('fetch: ' + JSON.stringify(this));
    $('#refreshMessages').on('click', function() {
      $.ajax({
        url: app.server,
        type: 'GET',
        dataType: 'JSON',
        contentType: 'application/json',
        data: 'order=-createdAt', //REQUEST FROM NEWEST
        success: function(data) {
          for (var i = data.results.length - 1; i > 0; i--) {
            roomname = data.results[i].roomname;
            app.renderMessage(_.escape(data.results[i].username), _.escape(data.results[i].text), _.escape(data.results[i].createdAt));
          }
        },
        error: function(data) {
          console.log('error: ' + data);
        }
      });
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
  
  init: function() {
    app.fetch();
    app.submit();
    app.send();
    // app.renderMessage();
    app.clearMessages();
    app.addFriend();
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

