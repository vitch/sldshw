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
						api_key: settings.apiKey,
						format: 'json',
						//nojsoncallback: 1,
						extras: 'url_' + settings.imageSize,
						per_page: settings.numPhotos,
						page: settings.page
					},
					containerW = elem.width(),
					containerH = elem.height(),
					containerRatio = containerW / containerH,
					ul = $('<ul/>').width(containerW).height(containerH);

				elem.empty().append(
					$('<div class="sldshow"/>').append(ul)
				);

				switch (settings.action) {
					case 'favorites.getPublicList':
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
						ul.width(data.photos.photo.length * containerW)
						$.each(
							data.photos.photo,
							function(i, photo)
							{
								var w = photo['width_' + settings.imageSize],
									h = photo['height_' + settings.imageSize],
									photoRatio = w / h,
									destW, destH, destX, destY, scale;
								if (settings.cropToContainer) {
									if (photoRatio > containerRatio) {
										scale = containerH / h;
									} else {
										scale = containerW / w;
									}
								} else {
									if (photoRatio > containerRatio) {
										scale = containerW / w;
									} else {
										scale = containerH / h;
									}
								}
								w = Math.round(w * scale);
								h = Math.round(h * scale);
								destX = (containerW - w) /2;
								destY = (containerH - h) /2;
								ul.append(
									$('<li style="width:' + containerW + 'px; height:' + containerH + 'px;"/>').append(
										$('<img />')
											.attr('src', photo['url_' + settings.imageSize])
											.css(
												{
													width: w,
													height: h,
													top: destY,
													left: destX
												}
											)
									)
								);
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
			// The number of milliseconds to show each picture for
			displayTime: 6000,
			// The number of milliseconds to spend fading between each picture
			fadeTime: 1000,
			// Whether to crop the images to the size of the container (true) or to size them so that the fit within
			// the bounds of the container (false)
			cropToContainer: true,
			// The number of images to load
			numPhotos: 10,
			// The page of results to load
			page: 1,
			// Which size image to load (it will be sized to fit in the container anyway) - one of:
			// sq, t, s, m, z, l, o
			imageSize: 'm',
			// The endpoint on flickr.com to connect to - should never change...
			flickrApiEndpoint: 'http://api.flickr.com/services/rest/'
		};
	}
)(jQuery,this);