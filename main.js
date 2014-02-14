/**
 *  LiveCollection looks to always stay up-to-date with the server's version of the collection using
 *  either Pusher or polling (with more options to come).
 *  LiveModel does the same with a single model
 *
 *
 *  Mix these into your current models and collections to gain access to their methods.
 *
 *  Copyright SportNgin, Kevin Marx
 *
 *  Based on backbone-live from Michael Abernethy
 *  https://github.com/bluedevil2k/backbone-live
 *
 *  MIT Licensed (LICENSE)
 *
 */

'use-strict'

module.exports = {
  LiveCollection: require('./src/liveCollection'),
  LiveModel: require('./src/liveModel')
}
