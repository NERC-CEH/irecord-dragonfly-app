(function () {
  require.config({
    baseUrl: "scripts/",
    paths: {
      'jquery': 'libs/jquery',
      'jquery.mobile': 'libs/jquery.mobile-1.4.5',
      'IndexedDBShim': 'libs/IndexedDBShim',
      'latlon': 'libs/osgridref',
      'latlon-ellipsoidal': 'libs/latlon-ellipsoidal',
      'vector3d': 'libs/vector3d',
      'dms': 'libs/dms',
      'klass': 'libs/klass.min',
      'photoswipe': 'libs/code.photoswipe.jquery-3.0.5.min',
      'fastclick': 'libs/fastclick',
      'd3': 'libs/d3',
      'morel': 'libs/morel',
      'underscore': 'libs/lodash',
      'backbone': 'libs/backbone',
      'backbone.localStorage': 'libs/backbone.localStorage'
    },
    shim: {
      'latlon': {deps: ['latlon-ellipsoidal', 'vector3d', 'dms']},
      'jquery.mobile': {deps: ['jquery.mobile-config']},
      'backbone': {deps: ['jquery', 'underscore'], "exports": "Backbone"},
      'morel': {deps: ['IndexedDBShim']},
      'photoswipe': {deps: ['jquery', 'klass'], exports : 'Code.PhotoSwipe'}
    },
    waitSeconds: 20
  });

  //Load the mighty app :)
  require(['jquery', 'jquery.mobile-config', 'app'], function ($, jqm, App) {
    App.init();
  });

})();