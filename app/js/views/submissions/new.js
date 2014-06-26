/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/submissions/new',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/global',
    'chimera/api',
    'models/submission',
    'collections/submissions',
    'views/thumbnail',
    'views/submissions/edit'
  ],
  function (Backbone, Template, Page, Chi, API, Submission, SubmissionsCollection, Thumbnail, EditSubmissionView) {

    function sendSubmission (file) {
      var thumbnail = $('<div/>'),
        image = $('<img/>'),
        link = $('<a href="#" class="thumbnail"/>'),
        progress = $('<img src="/images/progress_bar.gif" class="progress" />'),
        thumbnailsDiv = $('#thumbnails'),
        submissions_url = '/profiles/' + Chi.currentProfile.id + '/submissions';

      link.append(image);
      thumbnail.append(link);
      thumbnail.append(progress);

      API.sendFile(submissions_url, file, {
        loadstart: function () {
          thumbnailsDiv.prepend(thumbnail);
          $('#submission_file').val(null);
        },
        progress: function (e) {
          var loaded = e.loaded,
            total = e.total;
          progress.css({
            width: Math.min(parseInt(loaded /total * 100, 10), 100) + '%'
          });
        },
        loadend: function () {
          progress.css({width: '100%'});
        },
        success: function (submission) {
          submission.url = '/submissions/' + submission.id + '/edit';
          var newThumbnail = new UnpublishedThumbnail({
            model: new Submission(submission)
          });
          thumbnail.remove();
          thumbnailsDiv.prepend(newThumbnail.render().el);
        }
      });
    }

    var COLORS = ['lime', 'yellow', 'cyan', 'pink', 'orange', 'magenta'];
    var Groups = [];

    var UnpublishedThumbnail = Thumbnail.extend({
      template: _.template('<div><a class="thumbnail" href="#"><img data-id="<%= id %>" src="<%= image.thumb_240.url %>" /></a><div data-id="<%= id %>" class="delete">X</div></div>'),
      events: {
        'click img': 'editSubmission',
        'click .delete' : 'deleteSubmission'
      },

      initialize: function () {
        this.listenTo(this.model, 'destroy', this.remove);
      },

      render: function () {
        var data = _.extend(this.model.toJSON());
        this.$el.html(this.template(data));

        this.$el.attr('id', 'unpublished-' + this.model.id);
        this.$el.attr('draggable', true);
        this.$el.data('id', this.model.id);

        var group = this.model.get('submission_group');
        if (group !== undefined) {
          this.$el.data('groupId', group.id);
          if (Groups.indexOf(group.id) === -1) {
            Groups.push(group.id);
          }
          this.$el.css({ background: COLORS[Groups.indexOf(group.id)] });
        }

        this.el.addEventListener('dragstart', this.dragEvent.bind(this));
        this.el.addEventListener('drop', this.dropEvent.bind(this));

        return this;
      },

      deleteSubmission: function () {
        if (confirm('Are you sure you want to delete the submission?')) {
          this.model.destroy();
        }
      },

      editSubmission: function (e) {
        e.preventDefault();
        var submissionGroup = this.model.get('submission_group'),
          model = submissionGroup === undefined ? this.model : new Submission(submissionGroup),
          view = new EditSubmissionView({
            model: model
          });

        Chi.Router.navigate('/submissions/' + model.id + '/edit');
        Page.showView(view);
      },

      dragEvent: function (e) {
        e.dataTransfer.setData('id', this.model.id);
        if (this.model.get('submission_group') !== undefined) {
          e.dataTransfer.setData('groupId', this.model.get('submission_group').id);
        }
      },

      dropEvent: function (e) {
        var draggedId = parseInt(e.dataTransfer.getData('id'), 10),
          dropId = parseInt($(e.currentTarget).data('id'), 10),
          groupId = $(e.currentTarget).data('groupId'),
          index = groupId === undefined ? Groups.length : Groups.indexOf(groupId),
          css = {background: COLORS[index]};

        if (e.dataTransfer.files.length === 0 && dropId !== draggedId) {
          this.$el.css(css);
          $('#unpublished-' + draggedId).css(css);

          API.post('/profiles/' + Chi.currentProfile.id + '/submissions/group', {
            data: {
              // Order is impoant here, because the first ID is given priority for grouping.
              submission_ids: [dropId, draggedId]
            },
            success: function (submission) {
              var id = submission.id;

              if (Groups.indexOf(id) === -1) {
                Groups.push(id);
              }

              this.$el.data('groupId', id);
              $('#unpublished-' + draggedId).data('groupId', id);

              if (this.parentView) {
                this.parentView.collection.fetch({reset: true});
              } else {
                Groups = [];
                Page.showView(new NewSubmissionsView());
              }
            }.bind(this)
          });
        }
      }
    });

    var NewSubmissionsView = Backbone.View.extend({
      el: '#content',
      template: new Template('submissions/new').base(),

      dragOverEvent: function (e) {
        e.preventDefault();
      },
      dropEvent: function (e) {
        e.preventDefault();
        var dataTransfer = e.dataTransfer;
        if (dataTransfer) {
          var file;

          if (dataTransfer.files.length > 0) {
            for (var i=0; i < dataTransfer.files.length; i++) {
              file = dataTransfer.files[i];
              sendSubmission(file);
            }
          } else {
            // If dataTransfer contains an id, it's a thumbnail that's been dropped
            var id = dataTransfer.getData('id');
            if (id !== undefined) {
              if ($(e.target).parents('#thumbnails').length === 0) { // It's been dragged out of thumbnails
                if (dataTransfer.getData('groupId') !== '') {
                  API.post('/profiles/' + Chi.currentProfile.id + '/submissions/group', {
                    data: {
                      submission_ids: [id]
                    },
                    success: function () {
                      Groups = [];
                      Page.showView(new NewSubmissionsView());
                    }
                  });
                  $('#unpublished-' + id).css({background: 'none'});
                }
              }
            }
          }
        }
      },

      initialize: function () {
        this.collection = new SubmissionsCollection();
        this.collection.url = '/profiles/' + Chi.currentProfile.id + '/submissions/unpublished';
        this.listenTo(this.collection, 'reset', this.renderThumbnails);
        this.collection.fetch({reset: true});
      },

      render: function () {
        var self = this;

        Page.changeTo(this.template({
          profile: Chi.currentProfile.toJSON()
        }), {
          class: 'profile_submissions unpublished'
        });

        this.dropzone = window;
        this.dropzone.addEventListener('dragover', this.dragOverEvent);
        this.dropzone.addEventListener('drop', this.dropEvent);

        this.fileInput = $('#submission_file');
        this.fileInput.on('change', function () {
          var files = [];
          // Simple cloning so I can erase the file input ASAP.
          for (var i=0; i < self.fileInput[0].files.length; i++) {
            files.push(self.fileInput[0].files[i]);
          }
          files.forEach(function (file) {
            sendSubmission(file);
          });
        });
      },

      renderThumbnails: function () {
        $('#thumbnails').empty();
        this.collection.each(function (submission) {
          submission.url = '/profiles/' + Chi.currentProfile.id + '/submissions/' + submission.id;

          var submissions = [submission];

          if (submission.get('type') === 'SubmissionGroup') {
            submissions = [];
            _.each(submission.get('submissions'), function (sub) {
              var groupSub = new Submission(sub);
              groupSub.set('submission_group', submission.toJSON());
              submissions.push(groupSub);
            });
          }

          _.each(submissions, function (sub) {
            var thumbnail = new UnpublishedThumbnail({
              model: sub
            });
            thumbnail.parentView = this;
            $('#thumbnails').append(thumbnail.render().el);
          }, this);
        }, this);
      },

      // Pretty wise to unbind these events.
      onClose: function () {
        this.dropzone.removeEventListener('dragover', this.dragOverEvent);
        this.dropzone.removeEventListener('drop', this.dropEvent);
        this.fileInput.off('change');
      }
    });

    return NewSubmissionsView;
  });
