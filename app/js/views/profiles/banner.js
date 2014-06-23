/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/profiles/banner', ['backbone', 'chimera/global', 'chimera/api'],
  function (Backbone, Chi, API) {

    var EditProfileBannerView = Backbone.View.extend({
      el: '#setting-content',
      events: {
        'change #profile_banner_image' : 'sendFile'
      },

      render: function () {
        var header = $('<h1/>'),
          form = $('<form id="profile_banner" />'),
          img = $('<img id="banner_image" />');
        
        this.input = $('<input type="file" id="profile_banner_image" name="profile[banner_image]" />');

        this.$el.empty();

        header.html('Profile Banner');
        this.$el.append(header);

        img.attr('src', Chi.currentProfile.get('banner_image').preview_url);
        this.$el.append(img);

        form.append($('<fieldset/>'));
        form.append(this.input);
        this.$el.append(form);
      },

      sendFile: function () {
        var file = this.input[0].files[0],
          url = '/profiles/' + Chi.currentProfile.id + '/banner';

        API.sendFile(url, file, {
          success: function (banner_image) {
            Chi.currentProfile.set('banner_image', banner_image);
            $('#banner_image').attr('src', banner_image.preview_url);
          }
        });

        this.input.val(null);
      }
    });

    return EditProfileBannerView;
  });
