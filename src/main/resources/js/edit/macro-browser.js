(function ($) {
var MACRO_NAME = 'Relationship';
var CONTENT_ID = 'dialog-content';
/**
 * Creates the dialog and initialize the navigation
 * @param macro
 */
function opener(macro) {
    var isNewPage = AJS.Confluence.Editor.isNewPage();
    /*
     Confluence provides a content id for new pages.
     Before use this value as the page id, please verify that
     the page already exists
     */
    var pageId = AJS.Confluence.getContentId();
    if (isNewPage) {
        /*
         ok, this is new, but we can be editing an existing macro...
         */
        if (macro.params && macro.params['relationship-id']) {
            //recoverSettings(macro);
            openDialog(macro.params['relationship-id']);
        }
        else {
            /*
             this is new... there are no permissions to manage
             */
            openDialog();
        }
    }
    else {
        /*
         In this case, we are editing a non-legacy macro
         */
        if (macro.params && macro.params['relationship-id']) {
            openDialog(macro.params['relationship-id']);
        }
        else {
            openDialog();
        }
    }
}
function openDialog(macroId) {
    if (macroId === void 0) { macroId = null; }
    var relationshipMacroDialog = jQuery('body')
        .RelationshipDialog({
            "dialogId": "macroDialog"
        }).init();

    relationshipMacroDialog.show();
    const dialog = AJS.$('#macroDialog');
    const parent = dialog.parent();
    const grand = parent.parent();

    dialog.css('width', '100%');
    //grand.css('height', 'calc(100% - 120px)');
    dialog.css('height', '100%');
    dialog.css('top', '0px');

    $('#macroDialog .aui-dialog2-footer').css('position', 'fixed');
    $('#macroDialog .aui-dialog2-footer').css('bottom', '0');

    $('.aui-blanket').css('background-color', 'white');

    dialog.css('overflow-x', 'hidden');
    var insertButton = AJS.$('#relationshipMacroSave');
    var treeBody = null;
    if (insertButton) {
        insertButton.on('click', function () {
            treeBody = $("#tree-container").jstree(true).get_json();
            if (!treeBody) {
                return;
            }

            contentEntityId = dialog.attr('content-entity-id'),
            contentType = AJS.params.contentType;

            //If user is on PageEdit Mode.
            if (typeof contentEntityId === "undefined" || contentEntityId == "undefined") {
                contentEntityId = AJS.params.contentId;
            }

            if (typeof contentType == "undefined" || contentType == "undefined" || contentType == "comment") {
                if (window.location.href.indexOf("viewpagetemplate.action") > 1 || window.location.href.indexOf("createpagetemplate.action") > 1) {
                    contentType = "template";
                    contentEntityId = $self.ExcellentableCustom({URL: window.location.href, param: "entityId"}).getUrlParameter();
                } else {
                    contentType = "page";
                }
            }

            //If the excellentable being inserted into the page which is not saved yet then the contentType would be draft.
            if((contentType == "page" || contentType == "blogpost") && AJS.params.newPage == true){
                contentType = "draft";
            }
            var HTTP_PATH = AJS.contextPath() + "/rest/relationship/1.0";
            new Promise(function (resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: HTTP_PATH + "/content/tree",
                    data: JSON.stringify({
                        body: JSON.stringify(treeBody),
                        spaceKey: AJS.params.spaceKey,
                        contentType: contentType,
                        contentEntityId: contentEntityId
                    }),
                    success: resolve,
                    error: reject,
                    contentType: "application/json; charset=utf-8",
                });
            }).then(function (response) {
                tinymce.confluence.macrobrowser.macroBrowserComplete({
                    name: MACRO_NAME, bodyHtml: undefined, params: {
                        'relationship-id': response.id
                    }
                });
                AJS.$('#macroDialog').hide();
                $('.aui-blanket').hide();
            });
        });
    }

    $("#tree-container").jstree({
        "core": {
            "check_callback": true
        },
        "node_customize": {
            default: function(el, node) {
                $(el).find('a').append('<span class="aui-icon aui-icon-small aui-iconfont-page">Icon</span>');
            }
        },
        "plugins" : [
        	"contextmenu",
        	"dnd",
        	"massload",
        	"search",
        	"sort",
        	"state",
        	"changed",
        	"node_customize"
        ]
    });
}
/**
 * Listener for the editor loaded (kinda document.ready from JQuery for Confluence editor)
 */
function onEditorLoaded() {
    AJS.MacroBrowser.setMacroJsOverride(MACRO_NAME, {
        opener: opener
    });
}
AJS.bind('init.rte', onEditorLoaded);

})(jQuery)