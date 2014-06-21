/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, _, $ */

define('views/streams/show',
  [
    'backbone',
    'chimera/template',
    'chimera/view_helpers',
    'chimera/global'
  ],
  function (Backbone, Template, Helpers, Chi) {

    var StreamView = Backbone.View.extend({
      el: '#stream',
      template: new Template('streams/show').base(),
      templates: {
        submission: _.template('<a href="<%= submission.url %>"><img src="<%= submission.image.thumb_512.url %>" /></a>'),
        journal: _.template('<h3><a href="<%= journal.url %>"><%= journal.title %></a></h3>'),
        comment: new Template('streams/items/comment').base(),
        favorite: new Template('streams/items/favorite').base(),
        share: new Template('streams/items/share').base(),
        watch: _.template('<p>started following you</p>')
      },

      events: {
        'click .profile-link' : 'clickProfile'
      },

      initialize: function () {
        this.$info = $('#info');
        this.listenTo(this.collection, 'add', this.renderItem);
      },

      render: function () {
        var title = $('<h4/>');

        this.$info.empty();
        this.$info.append(title);
        if (this.model !== undefined) {
          title.html(this.model.get('name'));
          this.$info.append($('<a href="#" class="delete">delete</div>'));
        } else {
          title.html('Watched Profiles');
        }

        this.$el.empty();
        this.collection.each(function (streamItem) {
          this.renderItem(streamItem);
        }, this);
      },

      renderItem: function (streamItem) {
        var display,
          itemJSON = streamItem.toJSON(),
          action = itemJSON.action,
          target = itemJSON.target;

        switch (action) {
        case 'Journal':
          display = this.templates.journal({
            journal: target
          });
          break;
        case 'Comment':
          display = this.templates.comment({
            target: target
          });
          break;
        case 'Favorite':
          display = this.templates.favorite({
            target: target
          });
          break;
        case 'Share':
          display = this.templates.share({
            target: target
          });
          break;
        case 'Watch':
          display = this.templates.watch({});
          break;
        default:
          display = this.templates.submission({
            submission: target
          });
        }

        this.$el.append(this.template({
          item: itemJSON,
          profile: streamItem.profile.toJSON(),
          timeAgo: Helpers.timeAgo,
          display: display
        }));
      },

      clickProfile: function (e) {
        e.preventDefault();
        Chi.Router.navigate($(e.currentTarget).attr('href'), {trigger: true});
      }
    });

    return StreamView;
  });
