backbone-live
=============

*CabForward*
Austin's Leading Ruby on Rails Shop
www.cabforward.com

Backbone Live Models and Collections

These two Backbone extensions aim to make working with Pusher even easier.  It keeps your Models and Collections
always up-to-date by capturing Pusher events from the server.  It also adheres to the "convention over configuration" mentality,
and prescribes the event names you should use with your Pusher events to reduce the amount of code needed. 

Example
=======
```javascript

	// simply extend the LiveCollection object instead of the standard Backbone Collection
	MessageList = Backbone.LiveCollection.extend({
		model : Message,
		url : "/messages"
	});

	// or if you just have a Model, extend LiveModel
	Message = Backbone.LiveModel.extend({
		urlRoot : "/messages"
	});


	// create a Pusher object
	var pusher = Pusher("<api key>");

    // create the LiveCollection with the pusher object, your chosen channel, and an eventType that
    // will bind all possible events
    var messageList = new MessageList([],{pusher: pusher, channel: myChannel, eventType: "message"});

    // turn it on
    messageList.live();

    // or turn it off
    messageList.die();


    // You can then just follow normal Backbone code convention by binding 
    // to the Collection's or Model's events
    this.collection.bind("add", this.addNewMessage, this);


    // That's it!!  
    // Your LiveCollection will always be in sync with the server with only 1 line of extra code!


    // here's the code inside the LiveCollection, it uses convention over configuration to bind
    // to the 3 possible events for a collection, "add", "remove", and "update".
    // 
    // On the server, you should use this same naming configuration.
    // From the example above, it would be an event of "add_message" or "remove_message" 
    //
	this.pusherChannel.bind("add_" + this.eventType, function(model) {
		_this.add(model);
	});

	this.pusherChannel.bind("remove_" + this.eventType, function(model) {
		_this.remove(model);
	});

	this.pusherChannel.bind("update_" + this.eventType, function(model) {
		_this.get(model.id).set(model);
	});

```