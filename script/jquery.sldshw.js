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

			function initialise(settings) {
				var params = {
						api_key: s.apiKey,
						format: 'json',
						//nojsoncallback: 1,
						extras: settings.imageSize
					};
				// TODO: Clean up previous one?
				switch (settings.action) {
					case 'showFavourites':
						params.method = 'flickr.favorites.getPublicList';
						params.user_id = settings.userId;
						break;
					default:
						throw new Error('Invalid action set');
				}
				$.ajax(
					{
						url: settings.flickrApiEndpoint,
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						data: params
					}
				).success(
					function(data, status, xhr)
					{
						$.each(
							data.photos.photo,
							function(i, photo)
							{
								console.log(photo[settings.imageSize]);
							}
						);
					}
				);
			}

			initialise(s);

			return {
				reinitialise: function(settings)
				{
					initialise(settings);
				}
			}
		}

		$.fn.sldshw = function(settings)
		{
			settings = $.extend({}, $.fn.sldshw.defaults, settings);

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
			flickrApiEndpoint: 'http://api.flickr.com/services/rest/',
			imageSize: 'url_m'
		};
	}
)(jQuery,this);