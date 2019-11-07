/**
 * @fileoverview added by tsickle
 * Generated from: lib/caret-coords.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/* From: https://github.com/component/textarea-caret-position */
/* jshint browser: true */
// (function () {
// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
/** @type {?} */
var properties = [
    'direction',
    'boxSizing',
    'width',
    'height',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize'
];
/** @type {?} */
var isBrowser = (typeof window !== 'undefined');
/** @type {?} */
var isFirefox = (isBrowser && window['mozInnerScreenX'] != null);
/**
 * @param {?} element
 * @param {?} position
 * @param {?} options
 * @return {?}
 */
export function getCaretCoordinates(element, position, options) {
    if (!isBrowser) {
        throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
    }
    /** @type {?} */
    var debug = options && options.debug || false;
    if (debug) {
        /** @type {?} */
        var el = document.querySelector('#input-textarea-caret-position-mirror-div');
        if (el)
            el.parentNode.removeChild(el);
    }
    // The mirror div will replicate the textarea's style
    /** @type {?} */
    var div = document.createElement('div');
    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild(div);
    /** @type {?} */
    var style = div.style;
    /** @type {?} */
    var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
    // currentStyle for IE < 9
    /** @type {?} */
    var isInput = element.nodeName === 'INPUT';
    // Default textarea styles
    style.whiteSpace = 'pre-wrap';
    if (!isInput)
        style.wordWrap = 'break-word'; // only for textarea-s
    // Position off-screen
    style.position = 'absolute'; // required to return coordinates properly
    if (!debug)
        style.visibility = 'hidden'; // not 'display: none' because we want rendering
    // Transfer the element's properties to the div
    properties.forEach((/**
     * @param {?} prop
     * @return {?}
     */
    function (prop) {
        if (isInput && prop === 'lineHeight') {
            // Special case for <input>s because text is rendered centered and line height may be != height
            if (computed.boxSizing === "border-box") {
                /** @type {?} */
                var height = parseInt(computed.height);
                /** @type {?} */
                var outerHeight = parseInt(computed.paddingTop) +
                    parseInt(computed.paddingBottom) +
                    parseInt(computed.borderTopWidth) +
                    parseInt(computed.borderBottomWidth);
                /** @type {?} */
                var targetHeight = outerHeight + parseInt(computed.lineHeight);
                if (height > targetHeight) {
                    style.lineHeight = height - outerHeight + "px";
                }
                else if (height === targetHeight) {
                    style.lineHeight = computed.lineHeight;
                }
                else {
                    style.lineHeight = '0';
                }
            }
            else {
                style.lineHeight = computed.height;
            }
        }
        else {
            style[prop] = computed[prop];
        }
    }));
    if (isFirefox) {
        // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
        if (element.scrollHeight > parseInt(computed.height))
            style.overflowY = 'scroll';
    }
    else {
        style.overflow = 'hidden'; // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
    }
    div.textContent = element.value.substring(0, position);
    // The second special handling for input type="text" vs textarea:
    // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
    if (isInput)
        div.textContent = div.textContent.replace(/\s/g, '\u00a0');
    /** @type {?} */
    var span = document.createElement('span');
    // Wrapping must be replicated *exactly*, including when a long word gets
    // onto the next line, with whitespace at the end of the line before (#7).
    // The  *only* reliable way to do that is to copy the *entire* rest of the
    // textarea's content into the <span> created at the caret position.
    // For inputs, just '.' would be enough, but no need to bother.
    span.textContent = element.value.substring(position) || '.'; // || because a completely empty faux span doesn't render at all
    div.appendChild(span);
    /** @type {?} */
    var coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
        height: parseInt(computed['lineHeight'])
    };
    if (debug) {
        span.style.backgroundColor = '#aaa';
    }
    else {
        document.body.removeChild(div);
    }
    return coordinates;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZXQtY29vcmRzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1tZW50aW9ucy8iLCJzb3VyY2VzIjpbImxpYi9jYXJldC1jb29yZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVNNLFVBQVUsR0FBRztJQUNmLFdBQVc7SUFDWCxXQUFXO0lBQ1gsT0FBTztJQUNQLFFBQVE7SUFDUixXQUFXO0lBQ1gsV0FBVztJQUVYLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsbUJBQW1CO0lBQ25CLGlCQUFpQjtJQUNqQixhQUFhO0lBRWIsWUFBWTtJQUNaLGNBQWM7SUFDZCxlQUFlO0lBQ2YsYUFBYTtJQUViLHdEQUF3RDtJQUN4RCxXQUFXO0lBQ1gsYUFBYTtJQUNiLFlBQVk7SUFDWixhQUFhO0lBQ2IsVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixZQUFZO0lBQ1osWUFBWTtJQUVaLFdBQVc7SUFDWCxlQUFlO0lBQ2YsWUFBWTtJQUNaLGdCQUFnQjtJQUVoQixlQUFlO0lBQ2YsYUFBYTtJQUViLFNBQVM7SUFDVCxZQUFZO0NBRWI7O0lBRUcsU0FBUyxHQUFHLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDOztJQUMzQyxTQUFTLEdBQUcsQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksSUFBSSxDQUFDOzs7Ozs7O0FBRWhFLE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU87SUFDNUQsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQztLQUNuRzs7UUFFRyxLQUFLLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksS0FBSztJQUM3QyxJQUFJLEtBQUssRUFBRTs7WUFDTCxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQywyQ0FBMkMsQ0FBQztRQUM1RSxJQUFJLEVBQUU7WUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN2Qzs7O1FBR0csR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ3ZDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsMENBQTBDLENBQUM7SUFDcEQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBRTNCLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSzs7UUFDakIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWTs7O1FBQzVGLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU87SUFFMUMsMEJBQTBCO0lBQzFCLEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzlCLElBQUksQ0FBQyxPQUFPO1FBQ1YsS0FBSyxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsQ0FBRSxzQkFBc0I7SUFFeEQsc0JBQXNCO0lBQ3RCLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUUsMENBQTBDO0lBQ3hFLElBQUksQ0FBQyxLQUFLO1FBQ1IsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBRSxnREFBZ0Q7SUFFaEYsK0NBQStDO0lBQy9DLFVBQVUsQ0FBQyxPQUFPOzs7O0lBQUMsVUFBVSxJQUFJO1FBQy9CLElBQUksT0FBTyxJQUFJLElBQUksS0FBSyxZQUFZLEVBQUU7WUFDcEMsK0ZBQStGO1lBQy9GLElBQUksUUFBUSxDQUFDLFNBQVMsS0FBSyxZQUFZLEVBQUU7O29CQUNuQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7O29CQUNsQyxXQUFXLEdBQ2IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7b0JBQzdCLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO29CQUNoQyxRQUFRLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztvQkFDakMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQzs7b0JBQ2xDLFlBQVksR0FBRyxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQzlELElBQUksTUFBTSxHQUFHLFlBQVksRUFBRTtvQkFDekIsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQztpQkFDaEQ7cUJBQU0sSUFBSSxNQUFNLEtBQUssWUFBWSxFQUFFO29CQUNsQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7aUJBQ3hDO3FCQUFNO29CQUNMLEtBQUssQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO2lCQUN4QjthQUNGO2lCQUFNO2dCQUNMLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQzthQUNwQztTQUNGO2FBQU07WUFDTCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQyxFQUFDLENBQUM7SUFFSCxJQUFJLFNBQVMsRUFBRTtRQUNiLDhHQUE4RztRQUM5RyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDbEQsS0FBSyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7S0FDOUI7U0FBTTtRQUNMLEtBQUssQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUUsc0VBQXNFO0tBQ25HO0lBRUQsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkQsaUVBQWlFO0lBQ2pFLG9HQUFvRztJQUNwRyxJQUFJLE9BQU87UUFDVCxHQUFHLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs7UUFFekQsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQ3pDLHlFQUF5RTtJQUN6RSwwRUFBMEU7SUFDMUUsMEVBQTBFO0lBQzFFLG9FQUFvRTtJQUNwRSwrREFBK0Q7SUFDL0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxnRUFBZ0U7SUFDOUgsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7UUFFbEIsV0FBVyxHQUFHO1FBQ2hCLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMxRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDN0QsTUFBTSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDekM7SUFFRCxJQUFJLEtBQUssRUFBRTtRQUNULElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztLQUNyQztTQUFNO1FBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEM7SUFFRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogRnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2NvbXBvbmVudC90ZXh0YXJlYS1jYXJldC1wb3NpdGlvbiAqL1xuLyoganNoaW50IGJyb3dzZXI6IHRydWUgKi9cblxuLy8gKGZ1bmN0aW9uICgpIHtcblxuICAvLyBXZSdsbCBjb3B5IHRoZSBwcm9wZXJ0aWVzIGJlbG93IGludG8gdGhlIG1pcnJvciBkaXYuXG4gIC8vIE5vdGUgdGhhdCBzb21lIGJyb3dzZXJzLCBzdWNoIGFzIEZpcmVmb3gsIGRvIG5vdCBjb25jYXRlbmF0ZSBwcm9wZXJ0aWVzXG4gIC8vIGludG8gdGhlaXIgc2hvcnRoYW5kIChlLmcuIHBhZGRpbmctdG9wLCBwYWRkaW5nLWJvdHRvbSBldGMuIC0+IHBhZGRpbmcpLFxuICAvLyBzbyB3ZSBoYXZlIHRvIGxpc3QgZXZlcnkgc2luZ2xlIHByb3BlcnR5IGV4cGxpY2l0bHkuXG4gIHZhciBwcm9wZXJ0aWVzID0gW1xuICAgICdkaXJlY3Rpb24nLCAgLy8gUlRMIHN1cHBvcnRcbiAgICAnYm94U2l6aW5nJyxcbiAgICAnd2lkdGgnLCAgLy8gb24gQ2hyb21lIGFuZCBJRSwgZXhjbHVkZSB0aGUgc2Nyb2xsYmFyLCBzbyB0aGUgbWlycm9yIGRpdiB3cmFwcyBleGFjdGx5IGFzIHRoZSB0ZXh0YXJlYSBkb2VzXG4gICAgJ2hlaWdodCcsXG4gICAgJ292ZXJmbG93WCcsXG4gICAgJ292ZXJmbG93WScsICAvLyBjb3B5IHRoZSBzY3JvbGxiYXIgZm9yIElFXG5cbiAgICAnYm9yZGVyVG9wV2lkdGgnLFxuICAgICdib3JkZXJSaWdodFdpZHRoJyxcbiAgICAnYm9yZGVyQm90dG9tV2lkdGgnLFxuICAgICdib3JkZXJMZWZ0V2lkdGgnLFxuICAgICdib3JkZXJTdHlsZScsXG5cbiAgICAncGFkZGluZ1RvcCcsXG4gICAgJ3BhZGRpbmdSaWdodCcsXG4gICAgJ3BhZGRpbmdCb3R0b20nLFxuICAgICdwYWRkaW5nTGVmdCcsXG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvZm9udFxuICAgICdmb250U3R5bGUnLFxuICAgICdmb250VmFyaWFudCcsXG4gICAgJ2ZvbnRXZWlnaHQnLFxuICAgICdmb250U3RyZXRjaCcsXG4gICAgJ2ZvbnRTaXplJyxcbiAgICAnZm9udFNpemVBZGp1c3QnLFxuICAgICdsaW5lSGVpZ2h0JyxcbiAgICAnZm9udEZhbWlseScsXG5cbiAgICAndGV4dEFsaWduJyxcbiAgICAndGV4dFRyYW5zZm9ybScsXG4gICAgJ3RleHRJbmRlbnQnLFxuICAgICd0ZXh0RGVjb3JhdGlvbicsICAvLyBtaWdodCBub3QgbWFrZSBhIGRpZmZlcmVuY2UsIGJ1dCBiZXR0ZXIgYmUgc2FmZVxuXG4gICAgJ2xldHRlclNwYWNpbmcnLFxuICAgICd3b3JkU3BhY2luZycsXG5cbiAgICAndGFiU2l6ZScsXG4gICAgJ01velRhYlNpemUnXG5cbiAgXTtcblxuICB2YXIgaXNCcm93c2VyID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKTtcbiAgdmFyIGlzRmlyZWZveCA9IChpc0Jyb3dzZXIgJiYgd2luZG93Wydtb3pJbm5lclNjcmVlblgnXSAhPSBudWxsKTtcblxuICBleHBvcnQgZnVuY3Rpb24gZ2V0Q2FyZXRDb29yZGluYXRlcyhlbGVtZW50LCBwb3NpdGlvbiwgb3B0aW9ucykge1xuICAgIGlmICghaXNCcm93c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RleHRhcmVhLWNhcmV0LXBvc2l0aW9uI2dldENhcmV0Q29vcmRpbmF0ZXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIGEgYnJvd3NlcicpO1xuICAgIH1cblxuICAgIHZhciBkZWJ1ZyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5kZWJ1ZyB8fCBmYWxzZTtcbiAgICBpZiAoZGVidWcpIHtcbiAgICAgIHZhciBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2Jyk7XG4gICAgICBpZiAoZWwpIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH1cblxuICAgIC8vIFRoZSBtaXJyb3IgZGl2IHdpbGwgcmVwbGljYXRlIHRoZSB0ZXh0YXJlYSdzIHN0eWxlXG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5pZCA9ICdpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2JztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB2YXIgc3R5bGUgPSBkaXYuc3R5bGU7XG4gICAgdmFyIGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSA6IGVsZW1lbnQuY3VycmVudFN0eWxlOyAgLy8gY3VycmVudFN0eWxlIGZvciBJRSA8IDlcbiAgICB2YXIgaXNJbnB1dCA9IGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCc7XG5cbiAgICAvLyBEZWZhdWx0IHRleHRhcmVhIHN0eWxlc1xuICAgIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnO1xuICAgIGlmICghaXNJbnB1dClcbiAgICAgIHN0eWxlLndvcmRXcmFwID0gJ2JyZWFrLXdvcmQnOyAgLy8gb25seSBmb3IgdGV4dGFyZWEtc1xuXG4gICAgLy8gUG9zaXRpb24gb2ZmLXNjcmVlblxuICAgIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJzsgIC8vIHJlcXVpcmVkIHRvIHJldHVybiBjb29yZGluYXRlcyBwcm9wZXJseVxuICAgIGlmICghZGVidWcpXG4gICAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7ICAvLyBub3QgJ2Rpc3BsYXk6IG5vbmUnIGJlY2F1c2Ugd2Ugd2FudCByZW5kZXJpbmdcblxuICAgIC8vIFRyYW5zZmVyIHRoZSBlbGVtZW50J3MgcHJvcGVydGllcyB0byB0aGUgZGl2XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICBpZiAoaXNJbnB1dCAmJiBwcm9wID09PSAnbGluZUhlaWdodCcpIHtcbiAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciA8aW5wdXQ+cyBiZWNhdXNlIHRleHQgaXMgcmVuZGVyZWQgY2VudGVyZWQgYW5kIGxpbmUgaGVpZ2h0IG1heSBiZSAhPSBoZWlnaHRcbiAgICAgICAgaWYgKGNvbXB1dGVkLmJveFNpemluZyA9PT0gXCJib3JkZXItYm94XCIpIHtcbiAgICAgICAgICB2YXIgaGVpZ2h0ID0gcGFyc2VJbnQoY29tcHV0ZWQuaGVpZ2h0KTtcbiAgICAgICAgICB2YXIgb3V0ZXJIZWlnaHQgPVxuICAgICAgICAgICAgcGFyc2VJbnQoY29tcHV0ZWQucGFkZGluZ1RvcCkgK1xuICAgICAgICAgICAgcGFyc2VJbnQoY29tcHV0ZWQucGFkZGluZ0JvdHRvbSkgK1xuICAgICAgICAgICAgcGFyc2VJbnQoY29tcHV0ZWQuYm9yZGVyVG9wV2lkdGgpICtcbiAgICAgICAgICAgIHBhcnNlSW50KGNvbXB1dGVkLmJvcmRlckJvdHRvbVdpZHRoKTtcbiAgICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gb3V0ZXJIZWlnaHQgKyBwYXJzZUludChjb21wdXRlZC5saW5lSGVpZ2h0KTtcbiAgICAgICAgICBpZiAoaGVpZ2h0ID4gdGFyZ2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICBzdHlsZS5saW5lSGVpZ2h0ID0gaGVpZ2h0IC0gb3V0ZXJIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPT09IHRhcmdldEhlaWdodCkge1xuICAgICAgICAgICAgc3R5bGUubGluZUhlaWdodCA9IGNvbXB1dGVkLmxpbmVIZWlnaHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0eWxlLmxpbmVIZWlnaHQgPSAnMCc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0eWxlLmxpbmVIZWlnaHQgPSBjb21wdXRlZC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0eWxlW3Byb3BdID0gY29tcHV0ZWRbcHJvcF07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaXNGaXJlZm94KSB7XG4gICAgICAvLyBGaXJlZm94IGxpZXMgYWJvdXQgdGhlIG92ZXJmbG93IHByb3BlcnR5IGZvciB0ZXh0YXJlYXM6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTk4NDI3NVxuICAgICAgaWYgKGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gcGFyc2VJbnQoY29tcHV0ZWQuaGVpZ2h0KSlcbiAgICAgICAgc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7ICAvLyBmb3IgQ2hyb21lIHRvIG5vdCByZW5kZXIgYSBzY3JvbGxiYXI7IElFIGtlZXBzIG92ZXJmbG93WSA9ICdzY3JvbGwnXG4gICAgfVxuXG4gICAgZGl2LnRleHRDb250ZW50ID0gZWxlbWVudC52YWx1ZS5zdWJzdHJpbmcoMCwgcG9zaXRpb24pO1xuICAgIC8vIFRoZSBzZWNvbmQgc3BlY2lhbCBoYW5kbGluZyBmb3IgaW5wdXQgdHlwZT1cInRleHRcIiB2cyB0ZXh0YXJlYTpcbiAgICAvLyBzcGFjZXMgbmVlZCB0byBiZSByZXBsYWNlZCB3aXRoIG5vbi1icmVha2luZyBzcGFjZXMgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMzQwMjAzNS8xMjY5MDM3XG4gICAgaWYgKGlzSW5wdXQpXG4gICAgICBkaXYudGV4dENvbnRlbnQgPSBkaXYudGV4dENvbnRlbnQucmVwbGFjZSgvXFxzL2csICdcXHUwMGEwJyk7XG5cbiAgICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAvLyBXcmFwcGluZyBtdXN0IGJlIHJlcGxpY2F0ZWQgKmV4YWN0bHkqLCBpbmNsdWRpbmcgd2hlbiBhIGxvbmcgd29yZCBnZXRzXG4gICAgLy8gb250byB0aGUgbmV4dCBsaW5lLCB3aXRoIHdoaXRlc3BhY2UgYXQgdGhlIGVuZCBvZiB0aGUgbGluZSBiZWZvcmUgKCM3KS5cbiAgICAvLyBUaGUgICpvbmx5KiByZWxpYWJsZSB3YXkgdG8gZG8gdGhhdCBpcyB0byBjb3B5IHRoZSAqZW50aXJlKiByZXN0IG9mIHRoZVxuICAgIC8vIHRleHRhcmVhJ3MgY29udGVudCBpbnRvIHRoZSA8c3Bhbj4gY3JlYXRlZCBhdCB0aGUgY2FyZXQgcG9zaXRpb24uXG4gICAgLy8gRm9yIGlucHV0cywganVzdCAnLicgd291bGQgYmUgZW5vdWdoLCBidXQgbm8gbmVlZCB0byBib3RoZXIuXG4gICAgc3Bhbi50ZXh0Q29udGVudCA9IGVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKHBvc2l0aW9uKSB8fCAnLic7ICAvLyB8fCBiZWNhdXNlIGEgY29tcGxldGVseSBlbXB0eSBmYXV4IHNwYW4gZG9lc24ndCByZW5kZXIgYXQgYWxsXG4gICAgZGl2LmFwcGVuZENoaWxkKHNwYW4pO1xuXG4gICAgdmFyIGNvb3JkaW5hdGVzID0ge1xuICAgICAgdG9wOiBzcGFuLm9mZnNldFRvcCArIHBhcnNlSW50KGNvbXB1dGVkWydib3JkZXJUb3BXaWR0aCddKSxcbiAgICAgIGxlZnQ6IHNwYW4ub2Zmc2V0TGVmdCArIHBhcnNlSW50KGNvbXB1dGVkWydib3JkZXJMZWZ0V2lkdGgnXSksXG4gICAgICBoZWlnaHQ6IHBhcnNlSW50KGNvbXB1dGVkWydsaW5lSGVpZ2h0J10pXG4gICAgfTtcblxuICAgIGlmIChkZWJ1Zykge1xuICAgICAgc3Bhbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2FhYSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZGl2KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAvLyBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgLy8gICBtb2R1bGUuZXhwb3J0cyA9IGdldENhcmV0Q29vcmRpbmF0ZXM7XG4gIC8vIH0gZWxzZSBpZihpc0Jyb3dzZXIpIHtcbiAgLy8gICB3aW5kb3cuZ2V0Q2FyZXRDb29yZGluYXRlcyA9IGdldENhcmV0Q29vcmRpbmF0ZXM7XG4gIC8vIH1cblxuICAvLyB9KCkpOyJdfQ==