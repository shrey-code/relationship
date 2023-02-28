(function ($) {

    $.fn.RelationshipDialog = function (options) {
        $.fn.RelationshipDialog.defaults = {
            dialogId:"relationshipDialog",
            msg : "Hello there"
        }
        options = $.extend({}, $.fn.RelationshipDialog.defaults, options);
        this.init= function(){
            var dialogHtml = Confluence.Templates.Relationship.MacroDialog({
                dialogId: options.dialogId,
                msg: options.msg
            });
            jQuery('body').append(dialogHtml);
            this.bindEvent();
            return this;
        };
        this.show = function(){
            AJS.dialog2("#"+options.dialogId).show();
        };
        this.hide = function(){
            AJS.dialog2("#"+options.dialogId).hide();
        };
        this.bindEvent = function () {
            AJS.dialog2("#" + options.dialogId).on("show", function () {

            });
            AJS.dialog2("#" + options.dialogId).on("hide", function () {

            });
            jQuery('#'+options.dialogId).on("click","#relationshipMacroSave,#relationshipMacroClose",function(){
                AJS.$('#macroDialog').hide();
                $('.aui-blanket').hide();
            });
        };
        return this;
    };
})(jQuery);