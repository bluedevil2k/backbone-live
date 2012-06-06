/**
 *  CabForward - Austin's Leading Ruby on Rails Shop
 *
 *  LiveCollection uses Pusher to always maintain up-to-date collections
 *  LiveModel uses Pusher to always maintain an up-to-date model
 *
 *  v0.1
 *  Future versions will hopefully become "live" agnostic, so you can use websockets, firebase, or long polling
 *
 *  mike@cabforward.com
 *  Copyright (c) 2012 Michael Abernethy
 *  MIT Licensed (LICENSE)
 *
 */
(function(){

  'use strict';

  	Backbone.LiveCollection = Backbone.Collection.extend({

  		initialize : function(model, options) {

  			// required parameters
			this.pusher = options.pusher;
			this.channel = options.channel;
			this.eventType = options.eventType;

			// optional parameters
			this.channelType = "";
			if (options.channelType === "private" || options.channelType === "presence" )
				this.channelType = options.channelType + "-";

			this.log = options.log || false;
			if (this.log) {
				Pusher.log = function(message) {
					if (window.console && window.console.log) window.console.log(message);
				};
			}
  		},

		live : function() {
			var _this = this;
			
			this.pusherChannel = this.pusher.subscribe(this.channelType + this.channel);

			this.pusherChannel.bind("add_" + this.eventType, function(model) {
				_this.add(model);
			});

			this.pusherChannel.bind("remove_" + this.eventType, function(model) {
				_this.remove(model);
			});

			this.pusherChannel.bind("update_" + this.eventType, function(model) {
				_this.get(model.id).set(model);
			});

			return this.pusherChannel;
		},

		die : function() {
			if (this.pusherChannel) {
				this.pusherChannel.unbind("add_" + this.eventType);
				this.pusherChannel.unbind("remove_" + this.eventType);
				this.pusherChannel.unbind("update_" + this.eventType);
				this.pusher.unsubscribe(this.channelType + this.channel);
			}
			return this.pusherChannel;
		}

	});

	Backbone.LiveModel = Backbone.Model.extend({

		initialize : function(attributes, options) {

  			// required parameters
			this.pusher = options.pusher;
			this.channel = options.channel;
			this.eventType = options.eventType;

			// optional parameters
			this.channelType = "";
			if (options.channelType === "private" || options.channelType === "presence" )
				this.channelType = options.channelType + "-";
			
			this.log = options.log || false;
			if (this.log) {
				Pusher.log = function(message) {
					if (window.console && window.console.log) window.console.log(message);
				};
			}
		},

		live : function() {
			var _this = this;

			this.pusherChannel = this.pusher.subscribe(this.channelType + this.channel);

			this.pusher.subscribe(this.channel).bind("update_" + this.eventType, function(model) {
				if (_this.get("id") === model.id)
				{
					_this.set(model);
				}
			});

			return this.pusherChannel;
		},

		die : function() {
			if (this.pusherChannel) {
				this.pusherChannel.unbind("update_" + this.eventType);
				this.pusher.unsubscribe(this.channelType + this.channel);
			}

			return this.pusherChannel;
		}

	});



})();