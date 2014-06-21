/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/stream_items',
  ['backbone', 'models/stream_item'],
  function (Backbone, StreamItem) {

  var StreamItems = Backbone.Collection.extend({
    model: StreamItem
  });

  return StreamItems;
});
