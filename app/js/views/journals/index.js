/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/journals/index',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/view_helpers',
    'collections/journals',
    'models/profile_pic',
    'marked'
  ],
  function (Backbone, Template, Page, Helpers, JournalsCollection, ProfilePic, marked) {

    var JournalsView = Backbone.View.extend({
      tagName: 'div',
      id: 'journals',
      journalTemplate: new Template('journals/journal').base(),

      initialize: function (options) {
        options = options || {};

        this.collection = new JournalsCollection({
          profile: options.profile
        });
        this.listenTo(this.collection, 'reset', this.render);
        this.collection.fetch({reset: true});
      },

      render: function () {
        var clearDiv = $('<div class="clear" />');

        Page.changeTo(this.$el, {
          class: 'journals show'
        });

        this.collection.each(function (journal) {
          this.renderJournal(journal);
        }, this);
        this.$el.append(clearDiv);

        return this;
      },

      renderJournal: function (journal) {
        journal.set('profile_pic', new ProfilePic(journal.get('profile_pic')).toJSON());
        var html = this.journalTemplate({
          journal: journal.toJSON(),
          timeAgo: Helpers.timeAgo,
          marked: marked
        });
        this.$el.append(html);
      }
    });

    return JournalsView;
  });