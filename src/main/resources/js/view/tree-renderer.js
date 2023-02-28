jQuery(document).ready(function(){
console.log("hello");
    jQuery('.relationship-container').each(function(){
        var container = jQuery(this).find(".tree-container-view");
        const treeBodyEncoded = jQuery(this).find(".relationship-tree-view").val();
        const treeBody = JSON.parse(decodeURIComponent(treeBodyEncoded));
        jQuery(container).jstree({
            "core": {
                "data": treeBody
            },
            "plugins" : [
                "massload",
                "search",
                "sort",
                "state",
                "changed"
            ]
        });
    });
});