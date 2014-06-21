/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/settings_menu', ['backbone', 'chimera/global'],
  function (Backbone, Chi) {

  function checkOutsideBox (e) {
    var target = $(e.target),
      clickedInMenu = target.parents('div#settings').length > 0;
    if (!clickedInMenu) {
      $('div.menu').remove();
      $('body').off('mouseup', checkOutsideBox);
    }
  }

  var SettingsMenu = Backbone.View.extend({
    tagName: 'div',
    className: 'menu',
    events: {
      'click li' : 'clickLine'
    },

    data: [
      ['Settings', '/settings/profile'],
      ['Logout', '/logout']
    ],

    render: function () {
      var ul = $('<ul/>'),
        menuHeight = this.data.length * 1.5 + 0.8;

      this.data.forEach(function (item) {
        var a = $('<a/>'),
          li = $('<li/>');
        a.html(item[0]);
        a.attr('href', item[1]);
        li.data('href', item[1]);
        li.append(a);
        ul.append(li);
      });
      this.$el.css({height: menuHeight + 'em'});
      this.$el.append(ul);

      $('body').on('mouseup', checkOutsideBox);

      return this;
    },

    clickLine: function (e) {
      e.preventDefault();
      this.remove();
      Chi.Router.navigate($(e.currentTarget).data('href'), {trigger: true});
    }
  });

  return SettingsMenu;
});
