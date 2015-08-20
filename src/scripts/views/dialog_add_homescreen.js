/******************************************************************************
 * Asks the user to start an appcache download process.
 *****************************************************************************/
define(['jquery', 'helpers/browser'], function ($, browser) {
    var Dialog = function (callback) {
        if(browser.isMobile() && !browser.isHomeMode()) {
            var nextButtonID = 'next-dialog-button',
                message = '';

            if(browser.isIOS()){
                message =
                    '<div class="add-homescreen">' +
                        '<center><h2>Download instructions</h2></center>' +
                        '<ol>' +
                        '<li class="instruction">' +
                            '<img id="safari-add-homescreen" src="images/add_homescreen_1.png">' +
                            '<p>Click <b>Sharing button</b></p>' +
                        '</li>' +
                        '<li class="instruction">' +
                            '<img id="safari-add-homescreen" src="images/add_homescreen_2.png">' +
                            '<p>Tap <b>Add to home screen</b></p>' +
                        '</li>' +
                        '<li class="instruction">' +
                            '<img id="safari-add-homescreen" src="images/Icon-48.png">' +
                            '<p><b>Open app</b> from home screen.</p>' +
                        '</li>' +
                        '</ol>' +
                    '</div>';

            } else {
                message =
                    '<div class="add-homescreen">' +
                        '<center><h2>Download instructions</h2></center>' +
                        '<ol>' +
                        '<li class="instruction">' +
                            '<img id="safari-add-homescreen" src="images/add_homescreen_1_android.png">' +
                            '<p>Find <strong>Browser Options</strong></p>' +
                        '</li>' +
                        '<li class="instruction">' +
                            '<img id="safari-add-homescreen" src="images/Icon-48.png">' +
                            '<p>Tap <strong>Add to Home Screen</strong> option</p>' +
                        '</li>' +
                        '</ol>' +

                        '<button id="' + nextButtonID + '" style="width:43%; float:right"' +
                        'class="ui-btn ui-btn-inline ui-icon-carat-r ui-btn-icon-right ' +
                        'ui-mini">Next</button>' +
                '</div>';
            }

            app.message(message, 0, true);

            $('#' + nextButtonID).on('click', callback);
        } else {
            callback();
        }

    };

    return Dialog;
});