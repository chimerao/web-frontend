/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/profiles/widgets/latest_submission',
  ['views/profiles/widget', 'chimera/api'],
  function (WidgetView, API) {

  var LatestSubmission = WidgetView.extend({
    template: '<a href="{link}"><img src="{source}" /></a>',
    title: 'Latest Submission',

    render: function () {
      var header = $('<h2/>'),
        img = $('<img/>'),
        a = $('<a/>');

      API.get(this.profile.get('submissions_url'), {
        success: function (submissions) {
          var submission = submissions[0];

          img.attr('src', submission.image.thumb_400.url);
          a.attr('href', submission.url);
        }
      });

      header.html(this.title);
      this.div.append(header);

      a.append(img);
      this.div.append(a);

      this.div.css({
        left: this.x,
        top: this.y,
        width: this.width,
        height: this.height
      });

      this.container.append(this.div);
    }
  });

  return LatestSubmission;
});
