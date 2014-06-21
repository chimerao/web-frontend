/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('views/filters/show', ['backbone', 'chimera/template'],
  function (Backbone, Template) {

  var FilterView = Backbone.View.extend({
    el: '#content',
    template: new Template('filters/show').base(),
    events: {

    },

    render: function () {
      
    }
  });

  return FilterView;
});