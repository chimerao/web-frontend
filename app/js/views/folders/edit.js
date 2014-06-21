/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/folders/edit',
  [
    'backbone',
    'chimera/template',
    'chimera/global',
    'models/folder',
    'collections/folders'
  ],
  function (Backbone, Template, Chi, Folder, Folders) {

    var EditFoldersView = Backbone.View.extend({
      el: '#setting-content',
      template: new Template('folders/edit').base(),
      events: {
        'click table#settings-folders td.edit'   : 'editFolder',
        'click table#settings-folders td.delete' : 'deleteFolder',
        'click #new-folder'   : 'newFolder',
        'submit #folder-form' : 'submit'
      },

      initialize: function () {
        this.model = new Folder();
        this.collection = new Folders();
        this.collection.url = Chi.currentProfile.get('submission_folders_url');
        this.listenTo(this.collection, 'add', this.renderFolders);
        this.listenTo(this.collection, 'remove', this.renderFolders);
        this.listenTo(this.collection, 'reset', this.renderFolders);
      },

      render: function () {
        this.$el.html(this.template({}));
        this.collection.fetch({reset: true});
      },

      renderFolders: function () {
        var list = $('#settings-folders');

        list.empty();

        this.collection.each(function (folder) {
          var tr = $('<tr/>'),
            tdName = $('<td class="name" />'),
            tdEdit = $('<td class="edit">edit</td>'),
            tdDelete = $('<td class="delete">delete</td>');

          tr.data('id', folder.id);
          tdName.html(folder.get('name'));
          tr.append(tdName);
          tr.append(tdEdit);
          tr.append(tdDelete);
          list.append(tr);
        });
      },

      renderForm: function () {
        $('#form-container').html(new Template('folders/form').base()({
          folder: this.model.toJSON()
        }));

        this.inputs = {
          name: $('#folder_name')
        };
      },

      newFolder: function () {
        this.model = new Folder();
        this.renderForm();
      },

      getFolder: function (e) {
        var id = parseInt($(e.currentTarget).parent('tr').data('id'), 10);

        this.model = this.collection.find(function (folder) {
          return folder.id === id;
        });
      },

      editFolder: function (e) {
        this.getFolder(e);
        this.renderForm();
      },

      deleteFolder: function (e) {
        this.getFolder(e);
        if (confirm('Are you sure you want to delete this folder?')) {
          $(e.currentTarget).parent('tr').remove();
          this.model.destroy();
        }
      },

      submit: function (e) {
        e.preventDefault();
        var newFolder = false;

        if (this.model.isNew()) {
          newFolder = true;
        }

        this.model.set({
          name: this.inputs.name.val()
        });

        this.model.save(null, {
          success: function (folder) {
            if (newFolder) {
              folder.url = folder.get('url');
              this.collection.add(folder);
            }
            $('#form-container').empty();
          }.bind(this)
        });
      }
    });

    return EditFoldersView;
  });
