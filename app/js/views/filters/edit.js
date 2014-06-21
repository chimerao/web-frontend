/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/filters/edit',
  [
    'backbone',
    'chimera/global',
    'chimera/template',
    'collections/filters',
    'models/filter',
    'chimera/api',
    'models/profile',
    'collections/profiles'
  ],
  function (Backbone, Chi, Template, Filters, Filter, API, Profile, ProfilesCollection) {

    var EditFiltersView = Backbone.View.extend({
      el: '#setting-content',
      template: new Template('filters/edit').base(),
      events: {
        'click table#settings-filters td.edit'   : 'editFilter',
        'click table#settings-filters td.name'   : 'filterMembers',
        'click table#settings-filters td.delete' : 'deleteFilter',
        'click #new-filter'   : 'newFilter',
        'submit #filter-form' : 'submit',
        'submit #add-member'  : 'addMember',
        'click #member-list .delete'  : 'deleteMember'
      },

      initialize: function () {
        this.model = new Filter();
        this.collection = new Filters();
        this.collection.url = Chi.currentProfile.get('filters_url');
        this.listenTo(this.collection, 'add', this.renderFilters);
        this.listenTo(this.collection, 'remove', this.renderFilters);
        this.listenTo(this.collection, 'reset', this.renderFilters);
      },

      render: function () {
        this.$el.html(this.template({}));
        this.collection.fetch({reset: true});
      },

      renderFilters: function () {
        var list = $('#settings-filters');

        list.empty();

        this.collection.each(function (filter) {
          var tr = $('<tr/>'),
            tdName = $('<td class="name" />'),
            tdEdit = $('<td class="edit">edit</td>'),
            tdDelete = $('<td class="delete">delete</td>');

          tr.data('id', filter.id);
          tdName.html(filter.get('name'));
          tr.append(tdName);
          tr.append(tdEdit);
          tr.append(tdDelete);
          list.append(tr);
        });
      },

      renderForm: function () {
        $('#form-container').html(new Template('filters/form').base()({
          filter: this.model.toJSON()
        }));

        this.inputs = {
          name: $('#filter_name'),
          description: $('#filter_description'),
          opt_in: document.getElementById('filter_opt_in')
        };
      },

      renderMembers: function () {
        var label = $('<label for="filter_member" />'),
          form = $('<form id="add-member" />'),
          input = $('<input id="filter_member" name="filter[member]" type="text" />'),
          header = $('<h3/>'),
          name = $('<h2/>'),
          memberList = $('<ul id="member-list" />'),
          container = $('#form-container');

        container.empty();

        name.html(this.model.get('name'));
        container.append(name);

        label.html('Add a Member');
        form.append(label);
        form.append(input);
        container.append(form);

        header.html('Members');
        container.append(header);
        container.append(memberList);

        this.members = new ProfilesCollection();
        this.members.url = this.model.get('members_url');
        this.listenTo(this.members, 'reset', this.renderMemberList);
        this.members.fetch({reset: true});
      },

      renderMemberList: function () {
        this.members.each(function (profile) {
          var li = $('<li/>'),
            deleteSpan = $('<span class="delete" />');

          li.html(profile.get('name'));
          li.data('id', profile.id);
          deleteSpan.html(' x');
          li.append(deleteSpan);
          $('#member-list').append(li);
        });
      },

      addMember: function (e) {
        e.preventDefault();
        var name = $('#filter_member').val();

        API.post(this.model.get('members_url'), {
          data: { site_identifier: name },
          success: function (profileJSON) {
            var profile = new Profile(profileJSON),
              li = $('<li/>');

            li.html(profile.get('name'));
            $('#member-list').append(li);
          }
        });
      },

      deleteMember: function (e) {
        var li = $(e.currentTarget).parent('li'),
          id = li.data('id');

        API.delete(this.model.get('members_url') + '/' + id, {
          success: function () {
            li.remove();
          }
        });
      },

      newFilter: function () {
        this.model = new Filter();
        this.renderForm();
      },

      getFilterFromId: function (id) {
        this.model = this.collection.find(function (filter) {
          return filter.id === id;
        });
      },

      getFilter: function (e) {
        var id = parseInt($(e.currentTarget).parent('tr').data('id'), 10);

        this.getFilterFromId(id);
      },

      filterMembers: function (e) {
        this.getFilter(e);
        this.renderMembers();
      },

      editFilter: function (e) {
        this.getFilter(e);
        this.renderForm();
      },

      deleteFilter: function (e) {
        this.getFilter(e);
        if (confirm('Are you sure you want to delete this filter?')) {
          $(e.currentTarget).parent('tr').remove();
          this.model.destroy();
        }
      },

      submit: function (e) {
        e.preventDefault();
        var newFilter = false;

        if (this.model.isNew()) {
          newFilter = true;
        }

        this.model.set({
          name: this.inputs.name.val(),
          description: this.inputs.description.val(),
          opt_in: this.inputs.opt_in.checked
        });

        this.model.save(null, {
          success: function (filter) {
            if (newFilter) {
              filter.url = filter.get('url');
              this.collection.add(filter);
            }
            this.getFilterFromId(filter.id);
            this.renderMembers();
          }.bind(this)
        });
      }
    });

    return EditFiltersView;
  });
