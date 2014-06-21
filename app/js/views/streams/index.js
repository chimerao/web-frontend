/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/streams/index',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/global',
    'collections/stream_items',
    'views/streams/show',
    'collections/streams',
    'views/submissions/index'
  ],
  function (
    Backbone,
    Template,
    Page,
    Chi,
    StreamItems,
    StreamView,
    Streams,
    SubmissionsView
  ) {

    var StreamsView = Backbone.View.extend({
      el: '#content',
      template: new Template('streams/index').base(),
      events: {
        'click #new-stream'     : 'newStream',
        'click #tabs > ul > li' : 'clickStream',
        'click .delete'         : 'deleteStream'
      },

      initialize: function (options) {
        options = options || {};

        this.streamId = options.streamId;

        if (Chi.currentProfile.active()) {
          this.streams = new Streams();
          this.streams.url = Chi.currentProfile.get('streams_url');
          this.listenTo(this.streams, 'reset', this.renderTabs);
          this.streams.fetch({reset: true});

          this.collection = new StreamItems();
          this.stream = undefined;

          if (options.streamId) {
            this.collection.url = '/profiles/' + Chi.currentProfile.id + '/streams/' + options.streamId;
          } else {
            this.collection.url = '/profiles/' + Chi.currentProfile.id + '/stream';
          }

          this.page = 1;
          this.listenTo(this.collection, 'reset', this.renderStream);
          this.collection.fetch({
            reset: true,
            data: {
              per_page: 10,
              page: this.page
            }
          });
        } else {
          // if no one is logged in, this is the front page that will show
          Page.reset();
          new SubmissionsView();
        }
        $(window).on('scroll', this.checkScroll.bind(this));
      },

      render: function () {
        if (Chi.currentProfile.active()) {
          Page.changeTo(this.template({}));
        }
      },

      renderTabs: function () {
        var tabs = $('#tabs > ul'),
          dashTab = $('<li id="stream-0"><a href="#">Dash</a></li>'),
          newStream = $('<li id="new-stream"><a href="#" class="glyph">+</a></li>');

        tabs.empty();
        tabs.append(dashTab);

        this.streams.filter(function (stream) {
          return stream.get('is_permanent') === false;
        }).forEach(function (stream) {
          var li = $('<li />'),
            a = $('<a />');

          a.attr('href', stream.get('url'));
          a.html(stream.get('name'));

          li.attr('id', 'stream-' + stream.id);
          li.data('id', stream.id);
          li.append(a);
          tabs.append(li);
        });

        if (this.streamId) {
          $('#stream-' + this.streamId).addClass('active');
        } else {
          dashTab.addClass('active');
        }

        tabs.append(newStream);
      },

      renderStream: function () {
        this.streamView = new StreamView({
          collection: this.collection,
          model: this.stream
        });
        this.streamView.render();
      },

      checkScroll: function () {
        var endOfPage = $(document).height() <= ($(window).scrollTop() + $(window).height());

        if (endOfPage) {
          this.page += 1;
          this.collection.fetch({
            remove: false,
            data: {
              per_page: 10,
              page: this.page
            }
          });
        }
      },

      newStream: function (e) {
        e.preventDefault();
        Chi.Router.navigate('/streams/new', {trigger: true});
      },

      switchToStream: function (id) {
        var streamUrl;

        this.stream = this.streams.find(function (stream) {
          return stream.id === id;
        });

        this.stopListening(this.collection);
        this.collection = new StreamItems();

        $('.active').removeClass('active');

        if (id === undefined) {
          streamUrl = '/profiles/' + Chi.currentProfile.id + '/stream';
          Chi.Router.navigate('');
          $('#stream-0').addClass('active');
        } else {
          streamUrl = this.stream.get('url');
          Chi.Router.navigate('/streams/' + this.stream.id);
          $('#stream-' + this.stream.id).addClass('active');
        }

        this.collection.url = streamUrl;
        this.listenTo(this.collection, 'reset', this.renderStream);
        this.collection.fetch({reset: true});
      },

      clickStream: function (e) {
        e.preventDefault();
        this.switchToStream($(e.currentTarget).data('id'));
      },

      deleteStream: function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this stream?')) {
          this.stream.destroy();
          this.renderTabs();
          this.switchToStream();
        }
      },

      onClose: function () {
        $(window).off('scroll');
      }
    });

    return StreamsView;
  });
