/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/streams', ['backbone', 'models/stream'],
  function (Backbone, Stream) {

  var Streams = Backbone.Collection.extend({
    model: Stream
  });

  return Streams;
});
