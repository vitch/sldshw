/*!
 * sldshw - v0.1
 *
 * Flickr slideshows for jQuery/ Javascript. No vowels!
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT and GPL licenses.
 */

(function($,window,undefined)
	{

		function SldShw(elem, s)
		{
			// TODO
		}

		$.fn.sldshw = function(settings)
		{
			return this.each(
				function()
				{
					var elem = $(this),
						jspApi = elem.data('sldshw');
					if (jspApi) {
						jspApi.reinitialise(settings);
					} else {
						jspApi = new SldShw(elem, settings);
						elem.data('sldshw', jspApi);
					}
				}
			);
		}

		$.fn.sldshw.defaults = {
		};
	}
);