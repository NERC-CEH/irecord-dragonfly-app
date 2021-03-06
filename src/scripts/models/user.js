/******************************************************************************
 * User model. Persistent.
 *****************************************************************************/
define([
    'backbone',
    'helpers/location',
    'backbone.localStorage',
    'conf',
    'latlon'
], function (Backbone, locHelp) {
    'use strict';

    var User = Backbone.Model.extend({
        id: 'user',

        defaults: {
            name: '',
            surname: '',
            email: '',
            secret: '',
            locations: [],
            autosync: true,
            sort: 'common_name',
            sortMulti: 'common_name',
            filters: {},
            filtersMulti: {},
            favourites: []
        },

        /**
         * Initializes the user.
         */
        initialize: function () {
            this.fetch();
        },

        localStorage: new Store(app.NAME),

        /**
         * Resets the user login information.
         */
        signOut: function () {
            this.set('email', '');
            this.set('secret', '');
            this.set('name', '');
            this.set('surname', '');
            this.save();
            this.trigger('logout');
        },

        /**
         * Sets the app login state of the user account.
         * Saves the user account details into storage for permanent availability.
         *
         * @param user User object or empty object
         */
        signIn: function (user) {
            this.set('secret', user.secret || '');
            this.setContactDetails(user);
            this.save();
            this.trigger('login');
        },

        /**
         * Sets user contact information.
         */
        setContactDetails: function (user) {
            this.set('email', user.email || '');
            this.set('name', user.name || '');
            this.set('surname', user.surname || '');
            this.save();
        },

        /**
         * Returns user contact information.
         */
        hasSignIn: function () {
            return this.get('secret');
        },

        /**
         * Saves user location.
         *
         * @param location
         */
        setLocation: function (location) {
            var MAX_LENGTH = 10; //max number of locations to store
            var locations = this.get('locations'),
                exists = false;

            //check if exists
            locations.forEach(function (loc) {
                if (loc.latitude === location.latitude && loc.longitude === location.longitude) {
                    exists = true;
                }
            });

            if (!exists) {
                //add
                locations.splice(0, 0, location);
                if (locations.length > MAX_LENGTH) {
                    locations.length = MAX_LENGTH
                }
                this.set('locations', locations);
                this.trigger('change:locations');
                this.save();
            }
        },

        /**
         * Returns user location as Grid Reference.
         *
         * @param geoloc
         * @returns {*}
         */
        getLocationSref: function (location) {
            var LOCATION_GRANULARITY = 2; //Precision of returned grid reference (6 digits = metres).

            location = location || this.get('locations')[0];
            if (!location) {
                return null;
            }

            //get translated location
            var gref = locHelp.coord2grid(location, LOCATION_GRANULARITY);

            //remove the spaces
            return gref.replace(/ /g, '');
        },

        /**
         * Adds/removes favourite species ID from user information.
         *
         * @param speciesID
         */
        toggleFavouriteSpecies: function (speciesID) {
            var favourites = _.clone(this.get('favourites'));  //CLONING problem as discussed:
            //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change

            if (_.indexOf(favourites, speciesID) >= 0) {
                favourites = _.without(favourites, speciesID);
            } else {
                favourites.push(speciesID);
            }

            this.save('favourites', favourites);
        },

        /**
         * Checks if the speciesID belongs to user favourites.
         *
         * @param speciesID
         * @returns {boolean}
         */
        isFavourite: function (speciesID) {
            var favourites = this.get('favourites');
            return _.indexOf(favourites, speciesID) >= 0;
        },

        /**
         * Adds/removes species list filter from user information.
         *
         * @param filterID
         * @param groupID group the filter belongs to
         * @returns {boolean}
         */
        toggleListFilter: function (filterID, groupID, multi) {
            // var userFilters = _.clone(this.get('filters'));  //CLONING problem as discussed:
            //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change
            var filtersName = multi ? 'filtersMulti' : 'filters',
                userFilters = this.get(filtersName);

            var exists = false;
            if (userFilters[groupID]) {
                exists = userFilters[groupID].indexOf(filterID) >= 0;
                if (exists) {
                    userFilters[groupID] = _.without(userFilters[groupID], filterID);
                } else {
                    userFilters[groupID].push(filterID);
                }
            } else {
                userFilters[groupID] = [filterID];
            }

            this.set(filtersName, userFilters);
            this.save();
            this.trigger('change:' + filtersName);

            return !exists; //return the state of the filter added/removed
        },

        /**
         * Checks if the filterID belongs to user selected ones.
         *
         * @param filterID
         * @param filters
         * @returns {boolean}
         */
        groupHasListFilter: function (filterID, groupID, filters) {
            filters = filters || this.get('filters');
            return _.indexOf(filters[groupID], filterID) >= 0;
        },

        /**
         * @returns {boolean} Scientific or different type of sorting is selected
         */
        isSortScientific: function (multi) {
            var sort = this.get(multi ? 'sortMulti' : 'sort');
            return sort === 'scientific' || sort === 'scientific_r';
        },

        appendSampleUser: function (sample) {
            sample.set('name', this.get('name') || '_');
            sample.set('surname', this.get('surname'));
            sample.set('email', this.get('email'));

            return sample;
        }
    });

    return User;
});