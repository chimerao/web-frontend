/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/modal', ['backbone'],
  function (Backbone) {

  var ModalView = Backbone.View.extend({
    tagName: 'div',
    id: 'cast',

    initialize: function (options) {
      this.width = options.width || 400;
      this.height = options.height || 200;
      this.className = options.className;
      this.x = (window.innerWidth - this.width) / 2;
      this.y = 200;
      this.templateObjects = options.templateObjects;

      // Want to delegate events separately. Otherwise it'll
      // cause some oddities given when events are delegated
      // in the backbone view chain.
      var events = options.events || {};
      events['click'] = 'checkOutsideModal';
      this.delegateEvents(events);
    },

    render: function () {
      var modal = $('<div id="modal" />'),
        dialog = $('<div class="dialog" />'),
        div = $('<div />');

      modal.css({
        top: this.y + 'px',
        left: this.x + 'px'
      });
      div.css({
        width: this.width + 'px',
        height: this.height + 'px'
      });
      div.html(this.template(this.templateObjects));
      dialog.append(div);
      modal.append(dialog);

      if (this.className) {
        modal.addClass(this.className);
      }

      this.$el.append(modal);

      $('body').append(this.$el);
    },

    checkOutsideModal: function (e) {
      if ($(e.target).parents('div#modal').length === 0) {
        this.remove();
      }
    }
  });

  return ModalView;
});
