/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/profiles/widgets/latest_journal',
  ['views/profiles/widget', 'chimera/api', 'marked'],
  function (WidgetView, API, marked) {

  var LatestJournal = WidgetView.extend({
    template: '<a href="{link}"><img src="{source}" /></a>',
    title: 'Latest Journal',

    render: function () {
      var header = $('<h2/>'),
        journalTitle = $('<h3/>'),
        journalLink = $('<a/>'),
        journalBody = $('<div/>'),
        moreLink = $('<a/>');

      this.x = '50%';

      API.get(this.profile.get('journals_url'), {
        success: function (journals) {
          var journal = journals[0];

          journalLink.html(journal.title);
          journalLink.attr('href', journal.url);
          moreLink.attr('href', journal.url);
          journalBody.html(marked(journal.body.slice(0,400)));
        }
      });

      header.html(this.title);
      this.div.append(header);

      journalTitle.append(journalLink);
      this.div.append(journalTitle);

      this.div.append(journalBody);

      moreLink.html('More');
      this.div.append(moreLink);

      this.div.css({
        left: this.x,
        top: this.y,
        width: this.width,
        height: this.height
      });

      this.container.append(this.div);
    }
  });

  return LatestJournal;
});
