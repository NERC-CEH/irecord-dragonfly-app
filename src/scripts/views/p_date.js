/******************************************************************************
 * Date page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
], function (DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'date',

        template: app.templates.p_date,

        events: {
            'click #date-save': 'save'
        },

        initialize: function () {
            _log('views.DatePage: initialize', log.DEBUG);

            this.render();

            this.$input = $('#record-date');

            this.appendEventListeners();
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        update: function (model) {
          this.model = model;
        },

        render: function () {
            this.$el.html(this.template());

            $('body').append($(this.el));
            return this;
        },

        /**
         * Saves the date to the record.
         */
        save: function () {
            var value = this.$input.val();
            if (value !== "") {
                this.model.set(this.id, morel.formatDate(value));
            }
            window.history.back();
        }
    });

    return Page;
});
