/******************************************************************************
 * App object.
 *****************************************************************************/
define([
        'jquery',
        'jquery.mobile',
        'backbone',
        'fastclick',
        'klass',
        'morel',
        'routers/router',
        'models/app',
        'models/user',
        'models/species',
        'helpers/update',
        'helpers/brcart',
        'helpers/browser',
        'helpers/message',
        'helpers/log',
        'data'
    ],
    function ($, jqm, Backbone, FastClick, klass, morel, Router, AppModel, UserModel,
              SpeciesCollection, update, brcArt, browser, message) {
        var App = {
            init: function () {
                app.browser = browser;
                app.message = message;

                //init Google Analytics
                //http://veithen.github.io/2015/02/14/requirejs-google-analytics.html
                if (app.CONF.GA.STATUS){
                    window.GoogleAnalyticsObject = "__ga__";
                    window.__ga__ = {
                        q: [["create", app.CONF.GA.ID, "auto"]],
                        l: Date.now()
                    };
                    require(['ga'], function(ga) {
                        ga('set', 'appName', app.NAME);
                        ga('set', 'appVersion', app.VERSION);
                        ga('set', 'dimension1', morel.VERSION);
                    });
                }

                _log(brcArt, log.INFO);

                //overwrite morel user append function to match backbone
                morel.Auth.prototype.getUser = function () {
                    return app.models.user.attributes;
                };

                //init data
                app.recordManager = new morel.Manager(app.CONF.morel);

                app.models = {};
                app.models.user = new UserModel();
                app.models.app = new AppModel();
                app.models.sample = null; //to be set up on record opening
                app.models.sampleMulti = null; //to be set up on multi-record page init
                app.collections = {};
                app.collections.species = new SpeciesCollection(app.data.species);

                //update app
                update();

                app.router = new Router();
                Backbone.history.start();

                FastClick.attach(document.body);

                //turn off the loading splash screen
                $('div.loading').css('display', 'none');
                $('body').removeClass('loading');

                //add more variables to Google Analytics
                if (app.CONF.GA.STATUS) {
                    require(['ga'], function(ga) {
                        var userFilters = app.models.user.get('filters');
                        var favourites = userFilters.favouritesGroup && userFilters.favouritesGroup.length,
                            type = userFilters.typeGroup && userFilters.typeGroup.length,
                            location = userFilters.probabilityGroup && userFilters.probabilityGroup.length,
                            color = userFilters.colorGroup && userFilters.colorGroup.length;

                        ga('set', {
                            'dimension2': (app.models.user.hasSignIn() ? 'signed': ''),
                            'dimension3': app.models.user.get('autosync') ? 'sync': '',
                            'dimension4': app.models.user.get('sort'),

                            'metric1': favourites,
                            'metric2': type,
                            'metric3': location,
                            'metric4': color
                        });
                    });
                }
            }
        };
        return App;
    });