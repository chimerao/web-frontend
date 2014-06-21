/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/profiles/widget', ['backbone'],
  function (Backbone) {

  var WidgetView = Backbone.View.extend({
    el: '#profile-container',

    initialize: function (options) {
      options = options || {};

      this.container = $('#profile-container');
      this.div = $('<div class="widget" />');

      this.profile = options.profile;

      this.x = options.x || 0;
      this.y = options.y || 0;
      this.width = options.width || '46%';
      this.height = options.height || '500px';
    }
  });

  return WidgetView;
});
