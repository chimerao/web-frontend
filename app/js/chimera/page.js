/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('chimera/page', ['jquery'], function ($) {

  var content = $('#content');
  var currentView = null;

  var clearView = function () {
    if (currentView !== null) {
      currentView.undelegateEvents();
      if (currentView.onClose) {
        currentView.onClose();
      }
    }
  };

  return {
    changeTo: function (elem, options) {
      options = options || {};
      content.removeAttr('class');
      if (options.class !== undefined) {
        content.addClass(options.class);
      }
      content.html(elem);
      $(window).scrollTop(0);
      $(window).scrollLeft(0);
    },

    showView: function (view) {
      clearView();
      currentView = view;
      currentView.render();
    },

    reset: function () {
      clearView();
      content.empty();
      currentView = null;
    }
  };
});
