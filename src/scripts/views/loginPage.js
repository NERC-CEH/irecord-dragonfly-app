define(['views/_page', 'templates'], function (Page) {
  'use strict';

  var LoginPage = Page.extend({
    id: 'login',

    template: app.templates.login,

    events: {
      'click #login-button': 'login'
    },

    initialize: function () {
      _log('views.LoginPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.LoginPage: render', app.LOG_DEBUG);

      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    /**
     * Starts an app sign in to the Drupal site process.
     * The sign in endpoint is specified by LOGIN_URL -
     * should be a Drupal sight using iForm Mobile Auth Module.
     *
     * It is important that the app authorises itself providing
     * appname and appsecret for the mentioned module.
     */
    login: function () {
      //todo: add validation

      _log('views.LoginPage: start.', morel.LOG_DEBUG);
      var form = jQuery('#login-form');
      var person = {
        //user logins
        'email': form.find('input[name=email]').val(),
        'password': form.find('input[name=password]').val(),

        //app logins
        'appname': morel.auth.CONF.APPNAME,
        'appsecret': morel.auth.CONF.APPSECRET
      };
      this.email = person.email; //save email for successful login

       switch (app.CONF.FEATURES.LOGIN) {
         case true:
           this.loginSend(form, person);
           break;
         case 'simulate':
           this.loginSimulate(form, person);
           break;
         case false:
         default:
           _log('views.LoginPage: unknown login feature state');
       }
    },

    /**
     * Sends the login AJAX request.
     * @param form
     * @param person
     */
    loginSend: function (form, person) {
      $.mobile.loading('show');
      $.ajax({
        url: app.CONF.LOGIN_URL,
        type: 'POST',
        data: person,
        callback_data: person,
        dataType: 'text',
        timeout: app.CONF.LOGIN_TIMEOUT,
        success: this.onLoginSuccess,
        error: this.onLoginError
      });
    },

    /**
     * Simulates the login
     * @param form
     * @param person
     */
    loginSimulate: function (form, person) {
      var loginSelection =
        "<h1>Simulate:</h1>" +
        "<button id='simulate-success-button'>Success</button>" +
        "<button id='simulate-failure-button'>Failure</button>" +
        "<button id='simulate-cancel-button'>Cancel</button>";
      app.message(loginSelection, 0);

      var that = this;
      $('#simulate-success-button').on('click', function () {
        var data = "userSecret\nuserName\nuserSurname";
        that.onLoginSuccess(data);
      });
      $('#simulate-failure-button').on('click', function () {
        that.onLoginError({});
      });
      $('#simulate-cancel-button').on('click', function () {
        $.mobile.loading('hide');
      });
      },

    /**
     * Successful login.
     * @param data
     */
    onLoginSuccess: function (data) {
      _log('views.LoginPage: success.', morel.LOG_DEBUG);
      $.mobile.loading('hide');

      var user = this.extractUserDetails(data);
      user.email = this.email;
      app.models.user.signIn(user);

      Backbone.history.navigate('user', {trigger:true});
    },

    /**
     * Since the server response is not JSON, it gets user details from the response.
     * @param data
     * @returns {*}
     */
    extractUserDetails: function (data) {
      var lines = (data && data.split(/\r\n|\r|\n/g));
      if (lines && lines.length >= 3 && lines[0].length > 0) {
        return {
          'secret': lines[0],
          'name': lines[1] + " " + lines[2]
        };
      } else {
        _log('views.LoginPage: problems with received secret.', morel.LOG_WARNING);
        return null;
      }
    },

    /**
     * On Error.
     * @param xhr
     * @param ajaxOptions
     * @param thrownError
     */
    onLoginError: function (xhr, ajaxOptions, thrownError) {
      _log("views.LoginPage: ERROR " + xhr.status + " " + thrownError + ".", morel.LOG_ERROR);
      app.message('<center><h2>Sorry.<br/> Some problem occurred.</h2></center><br/>' +
      (xhr.responseText || ''), 3000);
    },

    /**
     * Logs the user out of the system.
     */
    logout: function () {
      morel.auth.removeUser();
    },

    /**
     * Brings the state of the user being logged in.
     * @returns boolean true if the user is logged in, or false if not
     */
    getLoginState: function () {
      return morel.auth.isUser();
    }
  });

  return LoginPage;
});
