// LiveModel Mixin for use with Pusher

'use-strict'

module.exports = function() {

  return {
    live : function(options) {
      var _this = this

      this.opts = options

      // default to polling if there's no arguments
      options = options || {}
      options.liveType = options.liveType || "poll"

      // if they've supplied a Pusher object or an existing pusherChannel,
      // set it up to use Pusher
      if (options.pusher || options.pusherChannel) {
        this.liveType = "pusher"
        this.pusher = options.pusher
        this.channelName = options.channelName
        this.eventType = options.eventType

        // optional parameters
        this.channelType = ""
        if (options.channelType === "private" || options.channelType === "presence" )
          this.channelType = options.channelType + "-"

        this.log = options.log || false
        if (this.log) {
          Pusher.log = function(message) {
            if (window.console && window.console.log) window.console.log(message)
          }
        }
      } else {
        // fail back to polling
        this.liveType = "poll"
        this.tries = options.tries || 5
        this.interval = options.interval || 5000
      }


      if (this.liveType === "pusher") {

        if (!options.pusherChannel) {
          this.pusherChannel = this.pusher.subscribe(this.channelType + this.channelName)
          options.pusherChannel = this.pusherChannel // save it in the options
        } else {
          this.pusherChannel = options.pusherChannel
        }

        this.pusherChannel.bind("update_" + this.eventType, function(model) {
          if (_this.get("id") === model.id) {
            _this.set(model)
          }
        })

        return this.pusherChannel

      } else if (this.liveType === "poll") {
        var polledCount = 0

        // Cancel any potential previous stream.
        this.die()

        var update = function() {

          this.isLive = true
          // Make a shallow copy of the options object.
            // `Backbone.collection.fetch` wraps the success function
            // in an outer function (line `527`), replacing options.success.
            // That means if we don't copy the object every poll, we'll end
            // up modifying the reference object and creating callback inception.
            //
            // Furthermore, since the sync success wrapper
            // that wraps and replaces options.success has a different arguments
            // order, you'll end up getting the wrong arguments.
            var opts = _.clone(options)

            if (!this.tries || polledCount < this.tries) {
              polledCount = polledCount + 1

              this.fetch(opts)
              this.pollTimeout = setTimeout(update, this.interval)
            }

        }.bind(this)

        update()
      }
    },

    die : function() {
      this.isLive = false

      if (this.liveType === "pusher") {
        if (this.pusherChannel) {
          this.pusherChannel.unbind("update_" + this.eventType)
          this.pusher.unsubscribe(this.channelType + this.channel)
        }

        return this.pusherChannel

      } else if (this.liveType === "poll") {
        clearTimeout(this.pollTimeout)
        delete this.pollTimeout
      }
    },

    killAll : function() {
      var c = this.die()
      if (this.liveType === "pusher") {
        this.pusher.unsubscribe(this.channelType + this.channel)
      }
      return c
    },

    isLive : function() {
      return this.isLive
    }
  }
}