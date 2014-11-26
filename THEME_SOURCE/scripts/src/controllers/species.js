(function($){
    app.controller = app.controller || {};
    app.controller.species = {
        pagecreate: function(){

        },

        pagecontainershow: function(event, ui){
            _log('species: pagecontainershow.');

            var species = app.controller.list.getCurrentSpecies();

            var heading = $('#species_heading');
            heading.text(species.common_name);

            this.renderSpecies(species);
        },

        renderSpecies: function(species){
            var template = $('#species-template').html();
            var placeholder = $('#species-placeholder');

            var compiled_template = Handlebars.compile(template);

            //check for the favourite
            var favourites = app.controller.list.getFavourites();
            if (favourites[species.id] != null){
                $("#species-profile-fav-button").addClass("on");
            } else {
                $("#species-profile-fav-button").removeClass("on");
            }

            placeholder.html(compiled_template(species));
            placeholder.trigger('create');

            app.controller.species.gallery.init();
        },

        /**
         * Toggles the current species as favourite by saving it into the
         * storage and changing the buttons appearance.
         */
        toggleSpeciesFavourite: function(){
            var favButton = $("#species-profile-fav-button");
            favButton.toggleClass("on");

            var species = app.controller.list.getCurrentSpecies();
            app.controller.list.changeFavourite(species.id, favButton.hasClass('on'));
        },

        /**
         *
         */
        gallery: {

            gallery : {},
            init : function(gallery_id){
                var images = $('#species_gallery a');

                if (images.length > 0){
                    this.gallery =  images.photoSwipe({
                        jQueryMobile: true,
                        loop: false,
                        enableMouseWheel: false,
                        enableKeyboard: false
                    });
                }

            },

            show : function(){
                if ($('.gallery')){
                    this.gallery.show(0);
                } else {
                    app.navigation.message('I have no pictures to show :(');
                }

            }
        }
    };
}(jQuery));
