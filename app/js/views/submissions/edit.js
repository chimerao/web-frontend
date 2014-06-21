/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/submissions/edit',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/global',
    'medium',
    'marked',
    'collections/filters',
    'collections/folders'
  ],
  function (
    Backbone,
    Template,
    Page,
    Chi,
    MediumEditor,
    marked,
    FiltersCollection,
    FoldersCollection
  ) {

    var EditSubmissionView = Backbone.View.extend({
      el: '#content',
      template: new Template('submissions/edit').base(),
      events: {
        'click #publish'          : 'publish',
        'submit #edit-submission' : 'save'
      },

      initialize: function () {
        this.filters = new FiltersCollection();
        this.filters.url = Chi.currentProfile.get('filters_url');
        this.listenTo(this.filters, 'reset', this.renderFilters);

        this.folders = new FoldersCollection();
        this.folders.url = Chi.currentProfile.get('submission_folders_url');
        this.listenTo(this.folders, 'reset', this.renderFolders);
      },

      render: function () {
        var submissions = [];

        if (this.model.get('type') === 'SubmissionGroup') {
          _.each(this.model.get('submissions'), function (submission, index) {
            if (index > 0) {
              submissions.push(submission);
            }
          }, this);
        }

        Page.changeTo(this.template({
          submission: this.model.toJSON(),
          submissions: submissions,
          marked: marked
        }), {
          class: 'profile_submissions edit'
        });

        // Description
        new MediumEditor('.editable', {
          buttons: ['bold', 'italic', 'underline', 'strikethrough', 'anchor'],
          buttonLabels: {
            'anchor' : 'link'
          },
          placeholder: 'Start typing the description'
        });

        this.title = $('#submission_title');
        this.description = $('#description_editable');
        this.tags = $('#submission_tags');

        this.filterList = $('#filter-list');
        this.filters.fetch({reset: true});

        this.folderList = $('#folder-list');
        this.folders.fetch({reset: true});
      },

      renderFilters: function () {
        var header = $('<p/>');

        if (this.filters.length > 0) {
          header.html('Filters');
          this.filterList.append(header);
        }

        this.filters.each(function (filter) {
          var label = $('<label/>'),
            input = $('<input />'),
            elemId = 'filter_ids_' + filter.id;

          label.attr('for', elemId);
          input.attr({
            id: elemId,
            name: 'submission[filter_ids][]',
            type: 'checkbox',
            value: filter.id
          });
          label.append(input);
          label.append(' ' + filter.get('name'));

          if (this.model.get('filters') && this.model.get('filters').indexOf(parseInt(filter.id, 10)) > -1) {
            input.prop('checked', true);
          }

          this.filterList.append(label);
        }, this);
      },

      renderFolders: function () {
        var header = $('<p/>');
        
        this.folderSelect = $('<select name="submission[submission_folder_id]" />');

        if (this.folders.length > 0) {
          header.html('Folder');
          this.folderList.append(header);
          this.folderList.append(this.folderSelect);
          this.folderSelect.append($('<option/>'));
        }

        this.folders.each(function (folder) {
          var option = $('<option/>');

          option.val(folder.id);
          option.html(folder.get('name'));
          this.folderSelect.append(option);
        }, this);
      },

      save: function (e) {
        e.preventDefault();
        this.saveSubmission(function () {
          Chi.Router.navigate('/unpublished', {trigger: true});
        });
      },

      publish: function (e) {
        e.preventDefault();
        this.saveSubmission(function () {
          this.model.publish();
          Chi.Router.navigate('/submissions/' + this.model.id, {trigger: true});
        }.bind(this));
      },

      saveSubmission: function (callback) {
        var filterIds = _.map($('#filter-list input'), function (filterInput) {
          if (filterInput.checked) {
            return filterInput.value;
          }
        });
        filterIds = _.compact(filterIds);

        var formData = {
          title: this.title.val(),
          description: this.description.html(),
          tags: this.parseTags(this.tags.val()),
          filter_ids: filterIds
        };

        if (this.folderSelect) {
          formData.submission_folder_ids = [this.folderSelect.val()];
        }

        this.model.set(formData);
        this.model.url = '/profiles/' + Chi.currentProfile.id + '/submissions/' + this.model.id;
        this.model.save(null, {
          success: callback
        });
      },

      // Takes a string of tags and returns an array.
      parseTags: function (tagString) {
        if (tagString.trim() === '') {
          return [];
        }
        var tags = tagString.replace(/#/g, '');
        if (tags.match(',') !== null) {
          tags = tags.split(',');
        } else {
          tags = tags.split(' ');
        }
        return _.map(tags, function (tag) {
          return tag.trim();
        });
      }
    });

    return EditSubmissionView;
  });
