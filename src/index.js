//
// LibreTexts Adoption Report Widget
// index.js (entry point)
//

/* Semantic UI Scripts */
import "./semantic-ui/components/modal.min.js";
import "./semantic-ui/components/transition.min.js";
import "./semantic-ui/components/dimmer.min.js";
import "./semantic-ui/components/visibility.min.js";
import "./semantic-ui/components/dropdown.min.js";
import "./semantic-ui/components/checkbox.min.js";

/* Semantic UI Styles */
import "./semantic-ui/components/icon.min.css";
import "./semantic-ui/components/button.min.css";
import "./semantic-ui/components/modal.min.css";
import "./semantic-ui/components/form.min.css";
import "./semantic-ui/components/input.min.css";
import "./semantic-ui/components/transition.min.css";
import "./semantic-ui/components/dimmer.min.css";
import "./semantic-ui/components/dropdown.min.css";
import "./semantic-ui/components/menu.min.css";
import "./semantic-ui/components/checkbox.min.css";
import "./semantic-ui/components/divider.min.css";
import "./semantic-ui/components/header.min.css";
import "./semantic-ui/components/label.min.css";

/* AJAX Library */
const axios = require('axios').default;

/* Helper Functions */
import { isEmptyString } from "./helpers.js";

/* HTML & CSS for bundle */
import "./index.css";
import html from "./index.html";

/* Form Options */
import {
    iAmOptions,
    libreNetOptions,
    instrTaughtOptions,
    studentUseOptions
} from "./options.js";

/**
 * This anonymous function is run on script load and
 * registers the window.libreAdoptionReport namespace
 * and relevant functions.
 */
(function() {

    /* Global Adoption Report Parameters */
    var resID = "";
    var resTitle = "";
    var resLib = "";

    /**
     * Verifies that jQuery is available on the page.
     */
    function ensureJquery(readyCallback) {
        if (window.jQuery === undefined || parseFloat(window.jQuery.fn.jquery) < 2.2) {
            console.error("libreAdoptionReport requires jQuery.");
        } else {
            readyCallback(window.jQuery);
        }
    }

    /**
     * Closes all Adoption Report modals, resets the form,
     * and removes the Adoption Report widget from the DOM.
     */
    function closeModal(jQuery) {
        resetFormErrors(jQuery);
        jQuery("#libreAdoptionReportModal").modal('hide');
        jQuery("#libreAR-success-modal").modal('hide');
        jQuery("#libreAR-error-modal").modal('hide');
        jQuery("#libreAdoptionReportModal").remove();
        jQuery("#libreAR-success-modal").remove();
        jQuery("#libreAR-error-modal").remove();
    }

    /**
     * Opens the main Adoption Report modal.
     */
    function openModal(jQuery) {
        jQuery("#libreAdoptionReportModal").modal({
            closable: false,
            blurring: true
        }).modal('setting', 'duration', 300).modal('show');
    }

    /**
     * Opens the Adoption Report Success modal.
     */
    function openSuccessModal(jQuery) {
        jQuery("#libreAR-success-modal").modal({
            closable: false,
            blurring: true
        }).modal('setting', 'duration', 300).modal('show');
    }

    /**
     * Opens the Adoption Report Error modal.
     */
    function openErrorModal(jQuery, err) {
        jQuery("#libreAR-error-modal").modal({
            closable: false,
            blurring: true
        }).modal('setting', 'duration', 300).modal('show');
        jQuery("#libreAR-error-msg").text(err);
    }

    /**
     * Closes the Adoption Report Error modal
     * and (re-)opens the main Adoption Report modal.
     */
    function closeErrorModal(jQuery) {
        jQuery("#libreAR-error-modal").modal('hide');
        jQuery("#libreAdoptionReportModal").modal('show');
    }

    /**
     * Shows/hides the relevant form section on
     * change to the "I am..." question.
     */
    function iAmChangeHandler(value) {
        if (value === 'instructor') {
            if (window.jQuery("#libreAR-student-section").is(":visible")) {
                window.jQuery("#libreAR-student-section").hide();
            }
            window.jQuery("#libreAR-instructor-section").show();
        } else if (value === 'student') {
            if (window.jQuery("#libreAR-instructor-section").is(":visible")) {
                window.jQuery("#libreAR-instructor-section").hide();
            }
            window.jQuery("#libreAR-student-section").show();
        }
    }

    /**
     * Shows/hides the relevant fields on change
     * to the "LibreNet consortium" question.
     */
    function libreNetInstChangeHandler() {
        var libreNet = window.jQuery('.ar-instr-librenet-check').find(':checked').val();
        if (libreNet === 'yes') {
            window.jQuery("#libreAR-instr-inst-dropdown-field").show();
            window.jQuery("#libreAR-instr-inst-field").hide();
        } else if (libreNet === 'no') {
            window.jQuery("#libreAR-instr-inst-dropdown-field").hide();
            window.jQuery("#libreAR-instr-inst-field").show();
        } else if (libreNet === 'dk') {
            window.jQuery("#libreAR-instr-inst-dropdown-field").show();
            window.jQuery("#libreAR-instr-inst-field").hide();
        }
    }

    /**
     * Logs an error to the console and
     * activates the Adoption Report Error modal
     * with the relevant message.
     */
    function handleErr(jQuery, err) {
        console.error(err);
        var message = "";
        if (err.response) {
            if (err.response.data.errMsg !== undefined) {
                message = err.response.data.errMsg;
            } else {
                message = "Error processing request.";
            }
            if (err.response.data.errors) {
                if (err.response.data.errors.length > 0) {
                    message = message.replace(/\./g, ': ');
                    err.response.data.errors.forEach((elem, idx) => {
                        if (elem.param) {
                            message += (String(elem.param).charAt(0).toUpperCase() + String(elem.param).slice(1));
                            if ((idx + 1) !== err.response.data.errors.length) {
                                message += ", ";
                            } else {
                                message += ".";
                            }
                        }
                    });
                }
            }
        } else if (err.name && err.message) {
            message = err.message;
        } else if (typeof(err) === 'string') {
            message = err;
        } else {
            message = err.toString();
        }
        openErrorModal(jQuery, message);
    }

    /**
     * Resets the form back to its original state
     * following the activation of error states.
     */
    function resetFormErrors(jQuery) {
        jQuery("#libreAR-email-field").removeClass('error');
        jQuery("#libreAR-name-field").removeClass('error');
        jQuery("#libreAR-iam-field").removeClass('error');
        jQuery("#libreAR-instr-libreNet-field").removeClass('error');
        jQuery("#libreAR-instr-inst-dropdown-field").removeClass('error');
        jQuery("#libreAR-instr-inst-field").removeClass('error');
        jQuery("#libreAR-instr-class-field").removeClass('error');
        jQuery("#libreAR-instr-taught-field").removeClass('error');
        jQuery("#libreAR-instr-students-field").removeClass('error');
    }

    /**
     * Validate the form data, return
     * 'false' if validation errors exists,
     * 'true' otherwise
     */
    function validateForm(jQuery) {
        var validForm = true;
        if (!resID || !resTitle || !resLib || isEmptyString(resID) || isEmptyString(resTitle) || isEmptyString(resLib)) {
            openErrorModal(jQuery, "Sorry, required internal values appear to be missing. Try reloading this page and submitting the form again.");
            validForm = false;
        }
        if (isEmptyString(jQuery("#libreAR-email-input").val())) {
            jQuery("#libreAR-email-field").addClass('error');
            validForm = false;
        }
        if (isEmptyString(jQuery("#libreAR-name-input").val())) {
            jQuery("#libreAR-name-field").addClass('error');
            validForm = false;
        }
        if (isEmptyString(jQuery("#libreAR-iam-dropdown").dropdown('get value'))) {
            jQuery("#libreAR-iam-field").addClass('error');
            validForm = false;
        }
        if (jQuery("#libreAR-iam-dropdown").dropdown('get value') === 'instructor') {
            if (jQuery(".ar-instr-librenet-check").find(':checked').val() === undefined) {
                jQuery("#libreAR-instr-libreNet-field").addClass('error');
                validForm = false;
            }
            if ((jQuery(".ar-instr-librenet-check").find(':checked').val() === 'yes') || (jQuery(".ar-instr-librenet-check").find(':checked').val() === 'dk') ) {
                if (isEmptyString(jQuery("#libreAR-instr-inst-dropdown").dropdown('get value'))) {
                    jQuery("#libreAR-instr-inst-dropdown-field").addClass('error');
                    validForm = false;
                }
            }
            if (jQuery(".ar-instr-librenet-check").find(':checked').val() === 'no') {
                if (isEmptyString(jQuery("#libreAR-not-libre-inst-input").val())) {
                    jQuery("#libreAR-instr-inst-field").addClass('error');
                    validForm = false;
                }
            }
            if (isEmptyString(jQuery("#libreAR-instr-class-input").val())) {
                jQuery("#libreAR-instr-class-field").addClass('error');
                validForm = false;
            }
            if (isEmptyString(jQuery("#libreAR-instr-taught-dropdown").dropdown('get value'))) {
                jQuery("#libreAR-instr-taught-field").addClass('error');
                validForm = false;
            }
            if (isEmptyString(jQuery("#libreAR-instr-num-students-input").val())) {
                jQuery("#libreAR-instr-students-field").addClass('error');
                validForm = false;
            } else if (isNaN(parseInt(jQuery("#libreAR-instr-num-students-input").val()))) {
                jQuery("#libreAR-instr-students-field").addClass('error');
                validForm = false;
            }
        }
        return validForm;
    }

    /**
     * Submits data via POST to the server, then
     * activates the Adoption Report Success or
     * Error modals.
     */
    function submitReport(jQuery) {
        jQuery("#libreAR-submit-btn").addClass('loading');
        resetFormErrors(jQuery);
        if (validateForm(jQuery)) {
            const formData = {
                email: jQuery("#libreAR-email-input").val(),
                name: jQuery("#libreAR-name-input").val(),
                role: jQuery("#libreAR-iam-dropdown").dropdown('get value'),
                comments: jQuery("#libreAR-addtl-comments-input").val(),
                resource: {
                    id: resID,
                    title: resTitle,
                    library: resLib
                }
            };
            if (jQuery("#libreAR-iam-dropdown").dropdown('get value') === 'instructor') {
                var institution = "";
                var studentAccess = [];
                if ((jQuery(".ar-instr-librenet-check").find(':checked').val() === 'yes') || (jQuery(".ar-instr-librenet-check").find(':checked').val() === 'dk') ) {
                    institution = jQuery("#libreAR-instr-inst-dropdown").dropdown('get value');
                }
                if (jQuery(".ar-instr-librenet-check").find(':checked').val() === 'no') {
                    institution = jQuery("#libreAR-not-libre-inst-input").val();
                }
                if (jQuery("#libreAR-instr-student-access-online").is(':checked')) {
                    studentAccess.push('online');
                }
                if (jQuery("#libreAR-instr-student-access-print").is(':checked')) {
                    studentAccess.push('print');
                }
                if (jQuery("#libreAR-instr-student-access-pdf").is(':checked')) {
                    studentAccess.push('pdf');
                }
                if (jQuery("#libreAR-instr-student-access-lms").is(':checked')) {
                    studentAccess.push('lms');
                }
                if (jQuery("#libreAR-instr-student-access-librebox").is(':checked')) {
                    studentAccess.push('librebox');
                }
                formData.instructor = {
                    isLibreNet: jQuery(".ar-instr-librenet-check").find(':checked').val(),
                    institution: institution,
                    class: jQuery("#libreAR-instr-class-input").val(),
                    term: jQuery("#libreAR-instr-taught-dropdown").dropdown('get value'),
                    students: jQuery("#libreAR-instr-num-students-input").val(),
                    replaceCost: jQuery("#libreAR-instr-replace-cost-input").val(),
                    printCost: jQuery("#libreAR-instr-print-cost-input").val(),
                    access: studentAccess
                };
            } else if (jQuery("#libreAR-iam-dropdown").dropdown('get value') === 'student') {
                var studentAccess = [];
                var quality = jQuery(".ar-student-quality-check").find(":checked").val();
                var navigation = jQuery(".ar-student-navigate-check").find(":checked").val();
                if (jQuery("#libreAR-student-access-online").is(':checked')) {
                    studentAccess.push('online');
                }
                if (jQuery("#libreAR-student-access-print").is(':checked')) {
                    studentAccess.push('print');
                }
                if (jQuery("#libreAR-student-access-pdf").is(':checked')) {
                    studentAccess.push('pdf');
                }
                if (jQuery("#libreAR-student-access-lms").is(':checked')) {
                    studentAccess.push('lms');
                }
                if (jQuery("#libreAR-student-access-librebox").is(':checked')) {
                    studentAccess.push('librebox');
                }
                formData.student = {
                    use: jQuery("#libreAR-student-use-dropdown").dropdown('get value'),
                    institution: jQuery("#libreAR-student-inst-input").val(),
                    class: jQuery("#libreAR-student-class-input").val(),
                    instructor: jQuery("#libreAR-student-instructor-input").val(),
                    access: studentAccess
                };
                if (!isEmptyString(jQuery("#libreAR-student-print-cost-input").val())) {
                    formData.student.printCost = jQuery("#libreAR-student-print-cost-input").val();
                }
                if (quality !== undefined) {
                    formData.student.quality = quality;
                }
                if (navigation !== undefined) {
                    formData.student.navigation = quality;
                }
            }
            axios.post("https://commons.libretexts.org/api/v1/adoptionreport", formData, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            }).then(function(res) {
                if (!res.data.err) {
                    openSuccessModal(jQuery);
                } else {
                    var msg;
                    if (res.data.errMsg) {
                        msg = res.data.errMsg;
                    } else {
                        msg = "Sorry, we're having trouble completing your request.";
                    }
                    handleErr(jQuery, msg);
                }
            }).catch(function(err) {
                handleErr(jQuery, err);
            });

        }
        jQuery("#libreAR-submit-btn").removeClass('loading');
    }

    /**
     * Attaches the Adoption Report Modal(s) to the DOM
     * and initializes interactive form components
     * from Semantic UI.
     */
    function libreAdoptionReport(jQuery) {
        if (jQuery("#libreAdoptionReportModal").length == 0) { // attach Modal to DOM
            jQuery("body").append(html);
            jQuery("#libreAR-res-title").text(resTitle);
            jQuery("#libreAR-instructor-section").hide();
            jQuery("#libreAR-student-section").hide();
            jQuery("#libreAR-instr-inst-dropdown-field").hide();
            jQuery("#libreAR-instr-inst-field").hide();
            jQuery("#libreAR-cancel-btn").click(function() {
                closeModal(jQuery);
            });
            jQuery("#libreAR-submit-btn").click(function() {
                submitReport(jQuery);
            });
            jQuery("#libreAR-success-done-btn").click(function() {
                closeModal(jQuery);
            });
            jQuery("#libreAR-err-done-btn").click(function() {
                closeErrorModal(jQuery);
            })
            jQuery("#libreAR-iam-dropdown").dropdown({
                action: 'activate',
                onChange: iAmChangeHandler,
                values: iAmOptions,
                placeholder: 'Choose...'
            });
            jQuery(".ar-instr-librenet-check").checkbox({
                onChange: libreNetInstChangeHandler
            });
            jQuery(".ar-instr-student-access-check").checkbox();
            jQuery(".ar-student-quality-check").checkbox();
            jQuery(".ar-student-navigate-check").checkbox();
            jQuery(".ar-student-access-check").checkbox();
            jQuery("#libreAR-instr-inst-dropdown").dropdown({
                values: libreNetOptions,
                placeholder: 'Choose...'
            });
            jQuery("#libreAR-instr-taught-dropdown").dropdown({
                values: instrTaughtOptions,
                placeholder: 'Choose...'
            });
            jQuery("#libreAR-student-use-dropdown").dropdown({
                values: studentUseOptions,
                placeholder: 'Choose...'
            });
            openModal(jQuery);
        } else { // Modal is already attached to DOM
            openModal(jQuery);
        }
    }

    /**
     * Initialize the Adoption Report Widget by setting
     * the resource @id, @title, and @library, then
     * calling ensureJquery() with the internal init
     * function as a success callback.
     */
    function init(id, title, lib) {
        resID = id;
        resTitle = title;
        resLib = lib;
        ensureJquery(libreAdoptionReport);
    }

    window.libreAdoptionReport = {
        init: init
    }
})();
