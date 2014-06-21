/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/journals/edit',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/global',
    'models/journal',
    'collections/filters',
    'medium',
    'views/profile_pic_select',
    'chimera/api',
    'views/journals/show'
  ],
  function (
    Backbone,
    Template,
    Page,
    Chi,
    Journal,
    FilterCollection,
    MediumEditor,
    ProfilePicSelect,
    API,
    JournalView
  ) {

    function sendImage (file) {
      var journalImagesUrl = '/profiles/' + Chi.currentProfile.id + '/journal_images';

      API.sendFile(journalImagesUrl, file, {
        success: function (image) {
          console.log('success!');
          console.log(image);
          var img = $('<img/>');
          img.attr('src', image.image.pixels_600.url);
          $('#journal-body').append(img);
        }
      });
    }

    var EditJournalView = Backbone.View.extend({
      el: '#content',
      template: new Template('journals/edit').base(),
      events: {
        'input #journal-title'    : 'editTitle',
        'keypress #journal-title' : 'supressEnter',
        'click #filter-control'   : 'toggleFilters',
        'click #page-save'        : 'save',
        'click #page-publish'     : 'publish',
        'click .profile-pic-image': 'profilePicSelect'
      },

      initialize: function () {
        this.isSaved = false;
        this.model = new Journal();
        this.filters = new FilterCollection();
        this.filters.url = Chi.currentProfile.get('filters_url');
        this.listenTo(this.filters, 'reset', this.renderFilters);
      },

      render: function () {
        Page.changeTo(this.template({
          profile: Chi.currentProfile.toJSON(),
          journal: this.model.toJSON(),
          currentProfile: Chi.currentProfile.toJSON()
        }), {
          class: 'profile_journals new'
        });

        this.filters.fetch({reset: true});

        // Body
        new MediumEditor('.editable', {
          buttons: ['bold', 'italic', 'underline', 'strikethrough', 'anchor'],
          buttonLabels: {
            'anchor' : 'link'
          },
          placeholder: 'Start typing your journal'
        });

        this.title = $('#journal-title');
        this.body = $('#journal-body');
        this.filterList = $('#filter-list');
        this.tags = $('#tag-list');
        this.profile_pic = $('#profile-pic-selectable');

        this.dropzone = $('div.journal-page')[0];
        this.dropzone.addEventListener('dragover', this.dragOverEvent);
        this.dropzone.addEventListener('drop', this.dropEvent);

        document.addEventListener('keyup', this.notSaved);
      },

      renderFilters: function () {
        this.filters.each(function (filter) {
          var label = $('<label/>'),
            input = $('<input />'),
            elemId = 'filter_ids_' + filter.id;

          label.attr('for', elemId);
          input.attr({
            id: elemId,
            name: 'journal[filter_ids][]',
            type: 'checkbox',
            value: filter.id
          });
          label.append(input);
          label.append(' ' + filter.get('name'));

          this.filterList.append(label);
        }, this);
      },

      editTitle: function () {
        var content = this.title.html();
        content = content.replace(/<[^>]*>/, '');

        if (content === '') {
          this.title.addClass('placeholder');
          this.title.empty();
        } else {
          this.title.removeClass('placeholder');
        }
      },

      supressEnter: function (e) {
        return e.charCode !== 13;
      },

      toggleFilters: function (e) {
        var target = $(e.target),
          clickedFilterButton = target.parents('li#filter-control').length === 1,
          clickedFilterList = target.parents('div#filter-list').length === 1;
        if (clickedFilterButton && !clickedFilterList) {
          this.filterList.toggle();
          if ($('#filter-arrow').html() === '▲') {
            $('#filter-arrow').html('&#9660');
          } else {
            $('#filter-arrow').html('&#9650');
          }
        }
      },

      save: function (e) {
        e.preventDefault();
        this.saveJournal();
      },

      publish: function (e) {
        e.preventDefault();
        this.model.set('published_at', new Date());
        this.saveJournal(function () {
          Page.showView(new JournalView({
            model: this.model
          }));
          Chi.Router.navigate('/journals/' + this.model.id);
        }.bind(this));
      },

      notSaved: function () {
        $('#page-save').html('Save');
      },

      saveJournal: function (callback) {
        var filterIds = _.map($('#filter-list input'), function (filterInput) {
          if (filterInput.checked) {
            return filterInput.value;
          }
        });
        filterIds = _.compact(filterIds);

        var formData = {
          title: this.title.html(),
          body: this.body.html(),
          tags: this.parseTags(this.tags.val()),
          filter_ids: filterIds,
          profile_pic_id: this.profile_pic.data('id')
        };

        this.model.set(formData);

        // Cleanup, because we shouldn't send blank values to the back end.
        if (this.model.get('filter_ids').length === 0) {
          this.model.unset('filter_ids');
        }
        if (this.model.get('tags').length === 0) {
          this.model.unset('tags');
        }

        if (this.model.isNew()) {
          this.model.url = '/profiles/' + Chi.currentProfile.id + '/journals';
        } else {
          this.model.url = '/profiles/' + Chi.currentProfile.id + '/journals/' + this.model.id;
        }

        this.model.save(null, {
          success: function () {
            if (callback) {
              callback();
            }
            $('#page-save').html('Saved');
          }
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
      },

      profilePicSelect: function () {
        this.profilePicSelect = new ProfilePicSelect();
      },

      dragOverEvent: function (e) {
        e.preventDefault();
      },

      dropEvent: function (e) {
        e.preventDefault();
        var dataTransfer = e.dataTransfer;

        if (dataTransfer) {
          sendImage(dataTransfer.files[0]);
        }
      },

      onClose: function () {
        this.dropzone.removeEventListener('dragover', this.dragOverEvent);
        this.dropzone.removeEventListener('drop', this.dropEvent);
        document.removeEventListener('keyup', this.notSaved);
      }
    });

    return EditJournalView;
  });
