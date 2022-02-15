var meta = document.createElement('meta');
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1";
document.getElementsByTagName('head')[0].appendChild(meta);
//<meta name="" content="">
/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory;
	} else {
		// Browser globals
		factory(jQuery);
	}
} (function ($) {

	var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
		toBind = ('onwheel' in document || document.documentMode >= 9) ?
			['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
		slice = Array.prototype.slice,
		nullLowestDeltaTimeout, lowestDelta;

	if ($.event.fixHooks) {
		for (var i = toFix.length; i;) {
			$.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
		}
	}

	var special = $.event.special.mousewheel = {
		version: '3.1.12',

		setup: function () {
			if (this.addEventListener) {
				for (var i = toBind.length; i;) {
					this.addEventListener(toBind[--i], handler, false);
				}
			} else {
				this.onmousewheel = handler;
			}
			// Store the line height and page height for this particular element
			$.data(this, 'mousewheel-line-height', special.getLineHeight(this));
			$.data(this, 'mousewheel-page-height', special.getPageHeight(this));
		},

		teardown: function () {
			if (this.removeEventListener) {
				for (var i = toBind.length; i;) {
					this.removeEventListener(toBind[--i], handler, false);
				}
			} else {
				this.onmousewheel = null;
			}
			// Clean up the data we added to the element
			$.removeData(this, 'mousewheel-line-height');
			$.removeData(this, 'mousewheel-page-height');
		},

		getLineHeight: function (elem) {
			var $elem = $(elem),
				$parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
			if (!$parent.length) {
				$parent = $('body');
			}
			return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
		},

		getPageHeight: function (elem) {
			return $(elem).height();
		},

		settings: {
			adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
			normalizeOffset: true  // calls getBoundingClientRect for each event
		}
	};

	$.fn.extend({
		mousewheel: function (fn) {
			return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
		},

		unmousewheel: function (fn) {
			return this.unbind('mousewheel', fn);
		}
	});


	function handler(event) {
		var orgEvent = event || window.event,
			args = slice.call(arguments, 1),
			delta = 0,
			deltaX = 0,
			deltaY = 0,
			absDelta = 0,
			offsetX = 0,
			offsetY = 0;
		event = $.event.fix(orgEvent);
		event.type = 'mousewheel';

		// Old school scrollwheel delta
		if ('detail' in orgEvent) { deltaY = orgEvent.detail * -1; }
		if ('wheelDelta' in orgEvent) { deltaY = orgEvent.wheelDelta; }
		if ('wheelDeltaY' in orgEvent) { deltaY = orgEvent.wheelDeltaY; }
		if ('wheelDeltaX' in orgEvent) { deltaX = orgEvent.wheelDeltaX * -1; }

		// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
		if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
			deltaX = deltaY * -1;
			deltaY = 0;
		}

		// Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
		delta = deltaY === 0 ? deltaX : deltaY;

		// New school wheel delta (wheel event)
		if ('deltaY' in orgEvent) {
			deltaY = orgEvent.deltaY * -1;
			delta = deltaY;
		}
		if ('deltaX' in orgEvent) {
			deltaX = orgEvent.deltaX;
			if (deltaY === 0) { delta = deltaX * -1; }
		}

		// No change actually happened, no reason to go any further
		if (deltaY === 0 && deltaX === 0) { return; }

		// Need to convert lines and pages to pixels if we aren't already in pixels
		// There are three delta modes:
		//   * deltaMode 0 is by pixels, nothing to do
		//   * deltaMode 1 is by lines
		//   * deltaMode 2 is by pages
		if (orgEvent.deltaMode === 1) {
			var lineHeight = $.data(this, 'mousewheel-line-height');
			delta *= lineHeight;
			deltaY *= lineHeight;
			deltaX *= lineHeight;
		} else if (orgEvent.deltaMode === 2) {
			var pageHeight = $.data(this, 'mousewheel-page-height');
			delta *= pageHeight;
			deltaY *= pageHeight;
			deltaX *= pageHeight;
		}

		// Store lowest absolute delta to normalize the delta values
		absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

		if (!lowestDelta || absDelta < lowestDelta) {
			lowestDelta = absDelta;

			// Adjust older deltas if necessary
			if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
				lowestDelta /= 40;
			}
		}

		// Adjust older deltas if necessary
		if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
			// Divide all the things by 40!
			delta /= 40;
			deltaX /= 40;
			deltaY /= 40;
		}

		// Get a whole, normalized value for the deltas
		delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
		deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
		deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

		// Normalise offsetX and offsetY properties
		if (special.settings.normalizeOffset && this.getBoundingClientRect) {
			var boundingRect = this.getBoundingClientRect();
			offsetX = event.clientX - boundingRect.left;
			offsetY = event.clientY - boundingRect.top;
		}

		// Add information to the event object
		event.deltaX = deltaX;
		event.deltaY = deltaY;
		event.deltaFactor = lowestDelta;
		event.offsetX = offsetX;
		event.offsetY = offsetY;
		// Go ahead and set deltaMode to 0 since we converted to pixels
		// Although this is a little odd since we overwrite the deltaX/Y
		// properties with normalized deltas.
		event.deltaMode = 0;

		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);

		// Clearout lowestDelta after sometime to better
		// handle multiple device types that give different
		// a different lowestDelta
		// Ex: trackpad = 3 and mouse wheel = 120
		if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
		nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

		return ($.event.dispatch || $.event.handle).apply(this, args);
	}

	function nullLowestDelta() {
		lowestDelta = null;
	}

	function shouldAdjustOldDeltas(orgEvent, absDelta) {
		// If this is an older event and the delta is divisable by 120,
		// then we are assuming that the browser is treating this as an
		// older mouse wheel event and that we should divide the deltas
		// by 40 to try and get a more usable deltaFactor.
		// Side note, this actually impacts the reported scroll distance
		// in older browsers and can cause scrolling to be slower than native.
		// Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
		return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
	}

}));
/**
 * @author trixta
 * @version 1.2
 */
(function ($) {

	var mwheelI = {
		pos: [-260, -260]
	},
		minDif = 3,
		doc = document,
		root = doc.documentElement,
		body = doc.body,
		longDelay, shortDelay
		;

	function unsetPos() {
		if (this === mwheelI.elem) {
			mwheelI.pos = [-260, -260];
			mwheelI.elem = false;
			minDif = 3;
		}
	}

	$.event.special.mwheelIntent = {
		setup: function () {
			var jElm = $(this).bind('mousewheel', $.event.special.mwheelIntent.handler);
			if (this !== doc && this !== root && this !== body) {
				jElm.bind('mouseleave', unsetPos);
			}
			jElm = null;
			return true;
		},
		teardown: function () {
			$(this)
				.unbind('mousewheel', $.event.special.mwheelIntent.handler)
				.unbind('mouseleave', unsetPos)
				;
			return true;
		},
		handler: function (e, d) {
			var pos = [e.clientX, e.clientY];
			if (this === mwheelI.elem || Math.abs(mwheelI.pos[0] - pos[0]) > minDif || Math.abs(mwheelI.pos[1] - pos[1]) > minDif) {
				mwheelI.elem = this;
				mwheelI.pos = pos;
				minDif = 250;

				clearTimeout(shortDelay);
				shortDelay = setTimeout(function () {
					minDif = 10;
				}, 200);
				clearTimeout(longDelay);
				longDelay = setTimeout(function () {
					minDif = 3;
				}, 1500);
				e = $.extend({}, e, { type: 'mwheelIntent' });
				return ($.event.dispatch || $.event.handle).apply(this, arguments);
			}
		}
	};
	$.fn.extend({
		mwheelIntent: function (fn) {
			return fn ? this.bind("mwheelIntent", fn) : this.trigger("mwheelIntent");
		},

		unmwheelIntent: function (fn) {
			return this.unbind("mwheelIntent", fn);
		}
	});

	$(function () {
		body = doc.body;
		//assume that document is always scrollable, doesn't hurt if not
		$(doc).bind('mwheelIntent.mwheelIntentDefault', $.noop);
	});
})(jQuery);
/*!
 * jScrollPane - v2.0.23 - 2016-01-28
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2014 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */
!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery) } (function (a) { a.fn.jScrollPane = function (b) { function c(b, c) { function d(c) { var f, h, j, k, l, o, p = !1, q = !1; if (N = c, void 0 === O) l = b.scrollTop(), o = b.scrollLeft(), b.css({ overflow: "hidden", padding: 0 }), P = b.innerWidth() + rb, Q = b.innerHeight(), b.width(P), O = a('<div class="jspPane" />').css("padding", qb).append(b.children()), R = a('<div class="jspContainer" />').css({ width: P + "px", height: Q + "px" }).append(O).appendTo(b); else { if (b.css("width", ""), p = N.stickToBottom && A(), q = N.stickToRight && B(), k = b.innerWidth() + rb != P || b.outerHeight() != Q, k && (P = b.innerWidth() + rb, Q = b.innerHeight(), R.css({ width: P + "px", height: Q + "px" })), !k && sb == S && O.outerHeight() == T) return void b.width(P); sb = S, O.css("width", ""), b.width(P), R.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end() } O.css("overflow", "auto"), S = c.contentWidth ? c.contentWidth : O[0].scrollWidth, T = O[0].scrollHeight, O.css("overflow", ""), U = S / P, V = T / Q, W = V > 1, X = U > 1, X || W ? (b.addClass("jspScrollable"), f = N.maintainPosition && ($ || bb), f && (h = y(), j = z()), e(), g(), i(), f && (w(q ? S - P : h, !1), v(p ? T - Q : j, !1)), F(), C(), L(), N.enableKeyboardNavigation && H(), N.clickOnTrack && m(), J(), N.hijackInternalLinks && K()) : (b.removeClass("jspScrollable"), O.css({ top: 0, left: 0, width: R.width() - rb }), D(), G(), I(), n()), N.autoReinitialise && !pb ? pb = setInterval(function () { d(N) }, N.autoReinitialiseDelay) : !N.autoReinitialise && pb && clearInterval(pb), l && b.scrollTop(0) && v(l, !1), o && b.scrollLeft(0) && w(o, !1), b.trigger("jsp-initialised", [X || W]) } function e() { W && (R.append(a('<div class="jspVerticalBar" />').append(a('<div class="jspCap jspCapTop" />'), a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragTop" />'), a('<div class="jspDragBottom" />'))), a('<div class="jspCap jspCapBottom" />'))), cb = R.find(">.jspVerticalBar"), db = cb.find(">.jspTrack"), Y = db.find(">.jspDrag"), N.showArrows && (hb = a('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", k(0, -1)).bind("click.jsp", E), ib = a('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", k(0, 1)).bind("click.jsp", E), N.arrowScrollOnHover && (hb.bind("mouseover.jsp", k(0, -1, hb)), ib.bind("mouseover.jsp", k(0, 1, ib))), j(db, N.verticalArrowPositions, hb, ib)), fb = Q, R.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function () { fb -= a(this).outerHeight() }), Y.hover(function () { Y.addClass("jspHover") }, function () { Y.removeClass("jspHover") }).bind("mousedown.jsp", function (b) { a("html").bind("dragstart.jsp selectstart.jsp", E), Y.addClass("jspActive"); var c = b.pageY - Y.position().top; return a("html").bind("mousemove.jsp", function (a) { p(a.pageY - c, !1) }).bind("mouseup.jsp mouseleave.jsp", o), !1 }), f()) } function f() { db.height(fb + "px"), $ = 0, eb = N.verticalGutter + db.outerWidth(), O.width(P - eb - rb); try { 0 === cb.position().left && O.css("margin-left", eb + "px") } catch (a) { } } function g() { X && (R.append(a('<div class="jspHorizontalBar" />').append(a('<div class="jspCap jspCapLeft" />'), a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragLeft" />'), a('<div class="jspDragRight" />'))), a('<div class="jspCap jspCapRight" />'))), jb = R.find(">.jspHorizontalBar"), kb = jb.find(">.jspTrack"), _ = kb.find(">.jspDrag"), N.showArrows && (nb = a('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", k(-1, 0)).bind("click.jsp", E), ob = a('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", k(1, 0)).bind("click.jsp", E), N.arrowScrollOnHover && (nb.bind("mouseover.jsp", k(-1, 0, nb)), ob.bind("mouseover.jsp", k(1, 0, ob))), j(kb, N.horizontalArrowPositions, nb, ob)), _.hover(function () { _.addClass("jspHover") }, function () { _.removeClass("jspHover") }).bind("mousedown.jsp", function (b) { a("html").bind("dragstart.jsp selectstart.jsp", E), _.addClass("jspActive"); var c = b.pageX - _.position().left; return a("html").bind("mousemove.jsp", function (a) { r(a.pageX - c, !1) }).bind("mouseup.jsp mouseleave.jsp", o), !1 }), lb = R.innerWidth(), h()) } function h() { R.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function () { lb -= a(this).outerWidth() }), kb.width(lb + "px"), bb = 0 } function i() { if (X && W) { var b = kb.outerHeight(), c = db.outerWidth(); fb -= b, a(jb).find(">.jspCap:visible,>.jspArrow").each(function () { lb += a(this).outerWidth() }), lb -= c, Q -= c, P -= b, kb.parent().append(a('<div class="jspCorner" />').css("width", b + "px")), f(), h() } X && O.width(R.outerWidth() - rb + "px"), T = O.outerHeight(), V = T / Q, X && (mb = Math.ceil(1 / U * lb), mb > N.horizontalDragMaxWidth ? mb = N.horizontalDragMaxWidth : mb < N.horizontalDragMinWidth && (mb = N.horizontalDragMinWidth), _.width(mb + "px"), ab = lb - mb, s(bb)), W && (gb = Math.ceil(1 / V * fb), gb > N.verticalDragMaxHeight ? gb = N.verticalDragMaxHeight : gb < N.verticalDragMinHeight && (gb = N.verticalDragMinHeight), Y.height(gb + "px"), Z = fb - gb, q($)) } function j(a, b, c, d) { var e, f = "before", g = "after"; "os" == b && (b = /Mac/.test(navigator.platform) ? "after" : "split"), b == f ? g = b : b == g && (f = b, e = c, c = d, d = e), a[f](c)[g](d) } function k(a, b, c) { return function () { return l(a, b, this, c), this.blur(), !1 } } function l(b, c, d, e) { d = a(d).addClass("jspActive"); var f, g, h = !0, i = function () { 0 !== b && tb.scrollByX(b * N.arrowButtonSpeed), 0 !== c && tb.scrollByY(c * N.arrowButtonSpeed), g = setTimeout(i, h ? N.initialDelay : N.arrowRepeatFreq), h = !1 }; i(), f = e ? "mouseout.jsp" : "mouseup.jsp", e = e || a("html"), e.bind(f, function () { d.removeClass("jspActive"), g && clearTimeout(g), g = null, e.unbind(f) }) } function m() { n(), W && db.bind("mousedown.jsp", function (b) { if (void 0 === b.originalTarget || b.originalTarget == b.currentTarget) { var c, d = a(this), e = d.offset(), f = b.pageY - e.top - $, g = !0, h = function () { var a = d.offset(), e = b.pageY - a.top - gb / 2, j = Q * N.scrollPagePercent, k = Z * j / (T - Q); if (0 > f) $ - k > e ? tb.scrollByY(-j) : p(e); else { if (!(f > 0)) return void i(); e > $ + k ? tb.scrollByY(j) : p(e) } c = setTimeout(h, g ? N.initialDelay : N.trackClickRepeatFreq), g = !1 }, i = function () { c && clearTimeout(c), c = null, a(document).unbind("mouseup.jsp", i) }; return h(), a(document).bind("mouseup.jsp", i), !1 } }), X && kb.bind("mousedown.jsp", function (b) { if (void 0 === b.originalTarget || b.originalTarget == b.currentTarget) { var c, d = a(this), e = d.offset(), f = b.pageX - e.left - bb, g = !0, h = function () { var a = d.offset(), e = b.pageX - a.left - mb / 2, j = P * N.scrollPagePercent, k = ab * j / (S - P); if (0 > f) bb - k > e ? tb.scrollByX(-j) : r(e); else { if (!(f > 0)) return void i(); e > bb + k ? tb.scrollByX(j) : r(e) } c = setTimeout(h, g ? N.initialDelay : N.trackClickRepeatFreq), g = !1 }, i = function () { c && clearTimeout(c), c = null, a(document).unbind("mouseup.jsp", i) }; return h(), a(document).bind("mouseup.jsp", i), !1 } }) } function n() { kb && kb.unbind("mousedown.jsp"), db && db.unbind("mousedown.jsp") } function o() { a("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"), Y && Y.removeClass("jspActive"), _ && _.removeClass("jspActive") } function p(c, d) { if (W) { 0 > c ? c = 0 : c > Z && (c = Z); var e = new a.Event("jsp-will-scroll-y"); if (b.trigger(e, [c]), !e.isDefaultPrevented()) { var f = c || 0, g = 0 === f, h = f == Z, i = c / Z, j = -i * (T - Q); void 0 === d && (d = N.animateScroll), d ? tb.animate(Y, "top", c, q, function () { b.trigger("jsp-user-scroll-y", [-j, g, h]) }) : (Y.css("top", c), q(c), b.trigger("jsp-user-scroll-y", [-j, g, h])) } } } function q(a) { void 0 === a && (a = Y.position().top), R.scrollTop(0), $ = a || 0; var c = 0 === $, d = $ == Z, e = a / Z, f = -e * (T - Q); (ub != c || wb != d) && (ub = c, wb = d, b.trigger("jsp-arrow-change", [ub, wb, vb, xb])), t(c, d), O.css("top", f), b.trigger("jsp-scroll-y", [-f, c, d]).trigger("scroll") } function r(c, d) { if (X) { 0 > c ? c = 0 : c > ab && (c = ab); var e = new a.Event("jsp-will-scroll-x"); if (b.trigger(e, [c]), !e.isDefaultPrevented()) { var f = c || 0, g = 0 === f, h = f == ab, i = c / ab, j = -i * (S - P); void 0 === d && (d = N.animateScroll), d ? tb.animate(_, "left", c, s, function () { b.trigger("jsp-user-scroll-x", [-j, g, h]) }) : (_.css("left", c), s(c), b.trigger("jsp-user-scroll-x", [-j, g, h])) } } } function s(a) { void 0 === a && (a = _.position().left), R.scrollTop(0), bb = a || 0; var c = 0 === bb, d = bb == ab, e = a / ab, f = -e * (S - P); (vb != c || xb != d) && (vb = c, xb = d, b.trigger("jsp-arrow-change", [ub, wb, vb, xb])), u(c, d), O.css("left", f), b.trigger("jsp-scroll-x", [-f, c, d]).trigger("scroll") } function t(a, b) { N.showArrows && (hb[a ? "addClass" : "removeClass"]("jspDisabled"), ib[b ? "addClass" : "removeClass"]("jspDisabled")) } function u(a, b) { N.showArrows && (nb[a ? "addClass" : "removeClass"]("jspDisabled"), ob[b ? "addClass" : "removeClass"]("jspDisabled")) } function v(a, b) { var c = a / (T - Q); p(c * Z, b) } function w(a, b) { var c = a / (S - P); r(c * ab, b) } function x(b, c, d) { var e, f, g, h, i, j, k, l, m, n = 0, o = 0; try { e = a(b) } catch (p) { return } for (f = e.outerHeight(), g = e.outerWidth(), R.scrollTop(0), R.scrollLeft(0); !e.is(".jspPane");)if (n += e.position().top, o += e.position().left, e = e.offsetParent(), /^body|html$/i.test(e[0].nodeName)) return; h = z(), j = h + Q, h > n || c ? l = n - N.horizontalGutter : n + f > j && (l = n - Q + f + N.horizontalGutter), isNaN(l) || v(l, d), i = y(), k = i + P, i > o || c ? m = o - N.horizontalGutter : o + g > k && (m = o - P + g + N.horizontalGutter), isNaN(m) || w(m, d) } function y() { return -O.position().left } function z() { return -O.position().top } function A() { var a = T - Q; return a > 20 && a - z() < 10 } function B() { var a = S - P; return a > 20 && a - y() < 10 } function C() { R.unbind(zb).bind(zb, function (a, b, c, d) { bb || (bb = 0), $ || ($ = 0); var e = bb, f = $, g = a.deltaFactor || N.mouseWheelSpeed; return tb.scrollBy(c * g, -d * g, !1), e == bb && f == $ }) } function D() { R.unbind(zb) } function E() { return !1 } function F() { O.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function (a) { x(a.target, !1) }) } function G() { O.find(":input,a").unbind("focus.jsp") } function H() { function c() { var a = bb, b = $; switch (d) { case 40: tb.scrollByY(N.keyboardSpeed, !1); break; case 38: tb.scrollByY(-N.keyboardSpeed, !1); break; case 34: case 32: tb.scrollByY(Q * N.scrollPagePercent, !1); break; case 33: tb.scrollByY(-Q * N.scrollPagePercent, !1); break; case 39: tb.scrollByX(N.keyboardSpeed, !1); break; case 37: tb.scrollByX(-N.keyboardSpeed, !1) }return e = a != bb || b != $ } var d, e, f = []; X && f.push(jb[0]), W && f.push(cb[0]), O.bind("focus.jsp", function () { b.focus() }), b.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function (b) { if (b.target === this || f.length && a(b.target).closest(f).length) { var g = bb, h = $; switch (b.keyCode) { case 40: case 38: case 34: case 32: case 33: case 39: case 37: d = b.keyCode, c(); break; case 35: v(T - Q), d = null; break; case 36: v(0), d = null }return e = b.keyCode == d && g != bb || h != $, !e } }).bind("keypress.jsp", function (b) { return b.keyCode == d && c(), b.target === this || f.length && a(b.target).closest(f).length ? !e : void 0 }), N.hideFocus ? (b.css("outline", "none"), "hideFocus" in R[0] && b.attr("hideFocus", !0)) : (b.css("outline", ""), "hideFocus" in R[0] && b.attr("hideFocus", !1)) } function I() { b.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp"), O.unbind(".jsp") } function J() { if (location.hash && location.hash.length > 1) { var b, c, d = escape(location.hash.substr(1)); try { b = a("#" + d + ', a[name="' + d + '"]') } catch (e) { return } b.length && O.find(d) && (0 === R.scrollTop() ? c = setInterval(function () { R.scrollTop() > 0 && (x(b, !0), a(document).scrollTop(R.position().top), clearInterval(c)) }, 50) : (x(b, !0), a(document).scrollTop(R.position().top))) } } function K() { a(document.body).data("jspHijack") || (a(document.body).data("jspHijack", !0), a(document.body).delegate('a[href*="#"]', "click", function (b) { var c, d, e, f, g, h, i = this.href.substr(0, this.href.indexOf("#")), j = location.href; if (-1 !== location.href.indexOf("#") && (j = location.href.substr(0, location.href.indexOf("#"))), i === j) { c = escape(this.href.substr(this.href.indexOf("#") + 1)); try { d = a("#" + c + ', a[name="' + c + '"]') } catch (k) { return } d.length && (e = d.closest(".jspScrollable"), f = e.data("jsp"), f.scrollToElement(d, !0), e[0].scrollIntoView && (g = a(window).scrollTop(), h = d.offset().top, (g > h || h > g + a(window).height()) && e[0].scrollIntoView()), b.preventDefault()) } })) } function L() { var a, b, c, d, e, f = !1; R.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function (g) { var h = g.originalEvent.touches[0]; a = y(), b = z(), c = h.pageX, d = h.pageY, e = !1, f = !0 }).bind("touchmove.jsp", function (g) { if (f) { var h = g.originalEvent.touches[0], i = bb, j = $; return tb.scrollTo(a + c - h.pageX, b + d - h.pageY), e = e || Math.abs(c - h.pageX) > 5 || Math.abs(d - h.pageY) > 5, i == bb && j == $ } }).bind("touchend.jsp", function () { f = !1 }).bind("click.jsp-touchclick", function () { return e ? (e = !1, !1) : void 0 }) } function M() { var a = z(), c = y(); b.removeClass("jspScrollable").unbind(".jsp"), O.unbind(".jsp"), b.replaceWith(yb.append(O.children())), yb.scrollTop(a), yb.scrollLeft(c), pb && clearInterval(pb) } var N, O, P, Q, R, S, T, U, V, W, X, Y, Z, $, _, ab, bb, cb, db, eb, fb, gb, hb, ib, jb, kb, lb, mb, nb, ob, pb, qb, rb, sb, tb = this, ub = !0, vb = !0, wb = !1, xb = !1, yb = b.clone(!1, !1).empty(), zb = a.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp"; "border-box" === b.css("box-sizing") ? (qb = 0, rb = 0) : (qb = b.css("paddingTop") + " " + b.css("paddingRight") + " " + b.css("paddingBottom") + " " + b.css("paddingLeft"), rb = (parseInt(b.css("paddingLeft"), 10) || 0) + (parseInt(b.css("paddingRight"), 10) || 0)), a.extend(tb, { reinitialise: function (b) { b = a.extend({}, N, b), d(b) }, scrollToElement: function (a, b, c) { x(a, b, c) }, scrollTo: function (a, b, c) { w(a, c), v(b, c) }, scrollToX: function (a, b) { w(a, b) }, scrollToY: function (a, b) { v(a, b) }, scrollToPercentX: function (a, b) { w(a * (S - P), b) }, scrollToPercentY: function (a, b) { v(a * (T - Q), b) }, scrollBy: function (a, b, c) { tb.scrollByX(a, c), tb.scrollByY(b, c) }, scrollByX: function (a, b) { var c = y() + Math[0 > a ? "floor" : "ceil"](a), d = c / (S - P); r(d * ab, b) }, scrollByY: function (a, b) { var c = z() + Math[0 > a ? "floor" : "ceil"](a), d = c / (T - Q); p(d * Z, b) }, positionDragX: function (a, b) { r(a, b) }, positionDragY: function (a, b) { p(a, b) }, animate: function (a, b, c, d, e) { var f = {}; f[b] = c, a.animate(f, { duration: N.animateDuration, easing: N.animateEase, queue: !1, step: d, complete: e }) }, getContentPositionX: function () { return y() }, getContentPositionY: function () { return z() }, getContentWidth: function () { return S }, getContentHeight: function () { return T }, getPercentScrolledX: function () { return y() / (S - P) }, getPercentScrolledY: function () { return z() / (T - Q) }, getIsScrollableH: function () { return X }, getIsScrollableV: function () { return W }, getContentPane: function () { return O }, scrollToBottom: function (a) { p(Z, a) }, hijackInternalLinks: a.noop, destroy: function () { M() } }), d(c) } return b = a.extend({}, a.fn.jScrollPane.defaults, b), a.each(["arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function () { b[this] = b[this] || b.speed }), this.each(function () { var d = a(this), e = d.data("jsp"); e ? e.reinitialise(b) : (a("script", d).filter('[type="text/javascript"],:not([type])').remove(), e = new c(d, b), d.data("jsp", e)) }) }, a.fn.jScrollPane.defaults = { showArrows: !1, maintainPosition: !0, stickToBottom: !1, stickToRight: !1, clickOnTrack: !0, autoReinitialise: !1, autoReinitialiseDelay: 500, verticalDragMinHeight: 0, verticalDragMaxHeight: 99999, horizontalDragMinWidth: 0, horizontalDragMaxWidth: 99999, contentWidth: void 0, animateScroll: !1, animateDuration: 300, animateEase: "linear", hijackInternalLinks: !1, verticalGutter: 4, horizontalGutter: 4, mouseWheelSpeed: 3, arrowButtonSpeed: 0, arrowRepeatFreq: 50, arrowScrollOnHover: !1, trackClickSpeed: 0, trackClickRepeatFreq: 70, verticalArrowPositions: "split", horizontalArrowPositions: "split", enableKeyboardNavigation: !0, hideFocus: !1, keyboardSpeed: 0, initialDelay: 300, speed: 30, scrollPagePercent: .8 } });
/*!
* jQuery blockUI plugin
* Version 2.70.0-2014.11.23
* Requires jQuery v1.7 or later
*
* Examples at: http://malsup.com/jquery/block/
* Copyright (c) 2007-2013 M. Alsup
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Thanks to Amir-Hossein Sobhi for some excellent contributions!
*/
; (function () {
	/*jshint eqeqeq:false curly:false latedef:false */
	"use strict";

	function setup($) {
		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function () { };

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// confusing userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6 = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		var setExpr = $.isFunction(document.createElement('div').style.setExpression);

		// global $ methods for blocking/unblocking the entire page
		$.blockUI = function (opts) { install(window, opts); };
		$.unblockUI = function (opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function (title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append('<h1>' + title + '</h1>');
			if (message) $m.append('<h2>' + message + '</h2>');
			if (timeout === undefined) timeout = 3000;

			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
			var callBlock = function (opts) {
				opts = opts || {};

				$.blockUI({
					message: $m,
					fadeIn: typeof opts.fadeIn !== 'undefined' ? opts.fadeIn : 700,
					fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
					timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
					centerY: false,
					showOverlay: false,
					onUnblock: onClose,
					css: $.blockUI.defaults.growlCSS
				});
			};

			callBlock();
			var nonmousedOpacity = $m.css('opacity');
			$m.mouseover(function () {
				callBlock({
					fadeIn: 0,
					timeout: 30000
				});

				var displayBlock = $('.blockMsg');
				displayBlock.stop(); // cancel fadeout if it has started
				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
			}).mouseout(function () {
				$('.blockMsg').fadeOut(1000);
			});
			// End konapun additions
		};

		// plugin method for blocking element content
		$.fn.block = function (opts) {
			if (this[0] === window) {
				$.blockUI(opts);
				return this;
			}
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function () {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function () {
				if ($.css(this, 'position') == 'static') {
					this.style.position = 'relative';
					$(this).data('blockUI.static', true);
				}
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function (opts) {
			if (this[0] === window) {
				$.unblockUI(opts);
				return this;
			}
			return this.each(function () {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message: '<h1>Please wait...</h1>',

			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
				padding: 0,
				margin: 0,
				width: '30%',
				top: '40%',
				left: '35%',
				textAlign: 'center',
				color: '#000',
				border: '3px solid #aaa',
				backgroundColor: '#fff',
				cursor: 'wait'
			},

			// minimal style set used when themes are used
			themedCSS: {
				width: '30%',
				top: '40%',
				left: '35%'
			},

			// styles for the overlay
			overlayCSS: {
				backgroundColor: '#000',
				opacity: 0.6,
				cursor: 'wait'
			},

			// style to replace wait cursor before unblocking to correct issue
			// of lingering wait cursor
			cursorReset: 'default',

			// styles applied when using $.growlUI
			growlCSS: {
				width: '350px',
				top: '10px',
				left: '',
				right: '10px',
				border: 'none',
				padding: '5px',
				opacity: 0.6,
				cursor: 'default',
				color: '#fff',
				backgroundColor: '#000',
				'-webkit-border-radius': '10px',
				'-moz-border-radius': '10px',
				'border-radius': '10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 1000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn: 200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut: 400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

			// elements that can receive focus
			focusableElements: ':input:enabled:visible',

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// callback method invoked when the overlay area is clicked.
			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
			onOverlayClick: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
				return;

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			if (opts.onOverlayClick)
				opts.overlayCSS.cursor = 'pointer';

			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
			msg = msg === undefined ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock)
				remove(window, { fadeOut: 0 });

			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data('blockUI.history', data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent)
					data.parent.removeChild(node);
			}

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe)
				lyr1 = $('<iframe class="blockUI" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>');
			else
				lyr1 = $('<div class="blockUI" style="display:none"></div>');

			if (opts.theme)
				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + (z++) + ';display:none"></div>');
			else
				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:fixed">';
				if (opts.title) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:absolute">';
				if (opts.title) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:' + (z + 10) + ';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:' + (z + 10) + ';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass('ui-widget-content');
				}
				else
					lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
				lyr2.css(opts.overlayCSS);
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe)
				lyr1.css('opacity', 0.0);

			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1, lyr2, lyr3], $par = full ? $('body') : $(el);
			$.each(layers, function () {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: '.ui-dialog-titlebar',
					cancel: 'li'
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel)
					$('html,body').css('height', '100%');

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el, 'borderTopWidth'), l = sz(el, 'borderLeftWidth');
					var fixT = t ? '(0 - ' + t + ')' : 0;
					var fixL = l ? '(0 - ' + l + ')' : 0;
				}

				// simulate fixed position
				$.each(layers, function (i, o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						if (full)
							s.setExpression('height', 'Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:' + opts.quirksmodeOffsetHack + ') + "px"');
						else
							s.setExpression('height', 'this.parentNode.offsetHeight + "px"');
						if (full)
							s.setExpression('width', 'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
						else
							s.setExpression('width', 'this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression('left', fixL);
						if (fixT) s.setExpression('top', fixT);
					}
					else if (opts.centerY) {
						if (full) s.setExpression('top', '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + ' + top + ') + "px"';
						s.setExpression('top', expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme)
					lyr3.find('.ui-widget-content').append(msg);
				else
					lyr3.append(msg);
				if (msg.jquery || msg.nodeType)
					$(msg).show();
			}

			if ((msie || opts.forceIframe) && opts.showOverlay)
				lyr1.show(); // opacity is zero
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay)
					lyr2._fadeIn(opts.fadeIn, cb1);
				if (msg)
					lyr3._fadeIn(opts.fadeIn, cb2);
			}
			else {
				if (opts.showOverlay)
					lyr2.show();
				if (msg)
					lyr3.show();
				if (opts.onBlock)
					opts.onBlock.bind(lyr3)();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(opts.focusableElements, pageBlock);
				if (opts.focusInput)
					setTimeout(focus, 20);
			}
			else
				center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function () {
					if (full)
						$.unblockUI(opts);
					else
						$(el).unblock(opts);
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var count;
			var full = (el == window);
			var $el = $(el);
			var data = $el.data('blockUI.history');
			var to = $el.data('blockUI.timeout');
			if (to) {
				clearTimeout(to);
				$el.removeData('blockUI.timeout');
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) // crazy selector to handle odd field errors in ie6/7
				els = $('body').children().filter('.blockUI').add('body > .blockUI');
			else
				els = $el.find('>.blockUI');

			// fix cursor issue
			if (opts.cursorReset) {
				if (els.length > 1)
					els[1].style.cursor = opts.cursorReset;
				if (els.length > 2)
					els[2].style.cursor = opts.cursorReset;
			}

			if (full)
				pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				count = els.length;
				els.stop().fadeOut(opts.fadeOut, function () {
					if (--count === 0)
						reset(els, data, opts, el);
				});
			}
			else
				reset(els, data, opts, el);
		}

		// move blocking element back into the DOM where it started
		function reset(els, data, opts, el) {
			var $el = $(el);
			if ($el.data('blockUI.isBlocked'))
				return;

			els.each(function (i, o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode)
					this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				data.el.style.cursor = 'default'; // #59
				if (data.parent)
					data.parent.appendChild(data.el);
				$el.removeData('blockUI.history');
			}

			if ($el.data('blockUI.static')) {
				$el.css('position', 'static'); // #22
			}

			if (typeof opts.onUnblock == 'function')
				opts.onUnblock(el, opts);

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
			body.width(w - 1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window, $el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
				return;

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!full || !opts.bindEvents || (b && !opts.showOverlay))
				return;

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
			if (b)
				$(document).bind(events, opts, handler);
			else
				$(document).unbind(events, handler);

			// former impl...
			//		var $e = $('a,:input');
			//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length - 1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function () { focus(back); }, 10);
						return false;
					}
				}
			}
			var opts = e.data;
			var target = $(e.target);
			if (target.hasClass('blockOverlay') && opts.onOverlayClick)
				opts.onOverlayClick(e);

			// allow events within the message content
			if (target.parents('div.' + opts.blockMsgClass).length > 0)
				return true;

			// allow events for content that is not being blocked
			return target.parents().children().filter('div.blockUI').length === 0;
		}

		function focus(back) {
			if (!pageBlockEls)
				return;
			var e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
			if (e)
				e.focus();
		}

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth) / 2) - sz(p, 'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight) / 2) - sz(p, 'borderTopWidth');
			if (x) s.left = l > 0 ? (l + 'px') : '0';
			if (y) s.top = t > 0 ? (t + 'px') : '0'; 1
		}

		function sz(el, p) {
			return parseInt($.css(el, p), 10) || 0;
		}

	}
	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}
})();
$(function(){
	// get_msg_unread();

	// comments unread message
	//setInterval(function(){
		//get_msg_unread();
	//},10000);

	if($(".content-box-top").length){
		var top_box_top_pos = $(".content-box-top").offset().top;
		var top_box_height = $(".content-box-top").height();
	}
	$.fn.sideBarFunction = function () {
		$(".toggleSideBar.hamburger").toggleClass("is-active");
		$("aside").toggleClass('nav-open');
		//$("div.content-box-top").toggleClass("menu-open");
	};
	//$(".content-box-top").hide();
	//Call
	//mouseenter
	$(".toggleSideBar").on('click', function () {
		$(this).sideBarFunction();
	});
	$("#sidebar").on('mouseenter', function (e) {
		sidebar_keep_open = true;
	});
	$("#sidebar").on('mouseleave', function (e) {
		ex_time_out = setTimeout(function () {
			if (sidebar_keep_open) {
				return;
			}
			$(".toggleSideBar.hamburger").removeClass("is-active");
			$("aside").removeClass('nav-open');
			//$("div.content-box-top").removeClass("menu-open");
		}, 1000);
		sidebar_keep_open = false;
	});
	//$(".nav-open").
});
var lockScreen = function () {
	$.blockUI({ message: null });
};
function get_msg_unread() {
	$.get('db/get-unread-count.php', {}, function (data) {
		data = parseInt(data) || 0;
		data = data==0?"":data;
		$(".message-notificaiton span.msg_count").text(data);
	});
}
window.onbeforeunload = function () {
	$("#xfade").show();
}
var sidebar_keep_open = false;
$(window).load(function(){
	var fileSelf = $(".this_file_name").val();
	$("#main-nav li a.nav-top-item.no-submenu[href='" + fileSelf + "']").addClass('current');
	$("#main-nav li a.nav-top-item").next("ul").find('li').find("a[href='" + fileSelf + "']").addClass("current").parent().parent().prev("a.nav-top-item").addClass("current");
	$("#main-nav li a.current").parent().find("ul").show();
});
