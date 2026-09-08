/* Semitree CMS — media picker for image (attachment ID) fields. */
(function ($) {
	"use strict";
	$(document).on("click", ".semitree-media-pick", function (e) {
		e.preventDefault();
		var $wrap = $(this).closest(".semitree-media");
		var frame = wp.media({ title: "Select image", multiple: false, library: { type: "image" } });
		frame.on("select", function () {
			var att = frame.state().get("selection").first().toJSON();
			$wrap.find(".semitree-media-id").val(att.id);
			var url = (att.sizes && att.sizes.medium) ? att.sizes.medium.url : att.url;
			$wrap.find(".semitree-media-preview").html('<img src="' + url + '" style="max-width:160px;height:auto" alt="" />');
		});
		frame.open();
	});
})(jQuery);
