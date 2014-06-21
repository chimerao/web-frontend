/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/profile_pic_select',
  ['backbone', 'collections/profile_pics', 'chimera/global'],
  function (Backbone, ProfilePicsCollection, Chi) {

  function checkOutsideBox (e) {
    var target = $(e.target),
      clickedBox = target[0].id === 'profile-pic-select',
      clickedInBox = target.parents('div#profile-pic-select').length > 0 || clickedBox;

    if (!clickedInBox) {
      $('#profile-pic-select').remove();
      $('body').off('mouseup', checkOutsideBox);
    }
  }

  var ProfilePicSelect = Backbone.View.extend({
    tagName: 'div',
    id: 'profile-pic-select',

    events: {
      'click li' : 'selectPic'
    },

    initialize: function () {
      this.collection = new ProfilePicsCollection();
      this.collection.url = Chi.currentProfile.get('profile_pics_url');
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch({reset: true});
    },

    render: function () {
      var ul = $('<ul/>');

      if (false) { // profile pics are 0

      } else {
        this.collection.each(function (pic) {
          var img = $('<img/>'),
            li = $('<li/>');

          img.attr({src: pic.get('pixels_64').url});
          li.data('id', pic.id);
          li.append(img);
          ul.append(li);
        }, this);
      }
      this.$el.append(ul);
      $('#profile-pic-selectable').append(this.el);
      $('body').on('mouseup', checkOutsideBox);
    },

    selectPic: function (e) {
      var id = $(e.currentTarget).data('id'),
        pic = this.collection.find(function (pic) {
          return id === pic.id;
        });

      // This should probably be done with events.
      $('#profile-pic-selectable').data('id', id);
      $('#profile-pic-selectable > .profile-pic-image > img').attr('src', pic.get('pixels_96').url);

      $('body').off('mouseup', checkOutsideBox);
      this.remove();
    }
  });

  return ProfilePicSelect;
});
