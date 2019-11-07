/**
 * @fileoverview added by tsickle
 * Generated from: lib/mention-utils.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// DOM element manipulation functions...
//
/**
 * @param {?} el
 * @param {?} value
 * @return {?}
 */
function setValue(el, value) {
    //console.log("setValue", el.nodeName, "["+value+"]");
    if (isInputOrTextAreaElement(el)) {
        el.value = value;
    }
    else {
        el.textContent = value;
    }
}
/**
 * @param {?} el
 * @return {?}
 */
export function getValue(el) {
    return isInputOrTextAreaElement(el) ? el.value : el.textContent;
}
/**
 * @param {?} el
 * @param {?} start
 * @param {?} end
 * @param {?} text
 * @param {?} iframe
 * @param {?=} noRecursion
 * @return {?}
 */
export function insertValue(el, start, end, text, iframe, noRecursion) {
    if (noRecursion === void 0) { noRecursion = false; }
    //console.log("insertValue", el.nodeName, start, end, "["+text+"]", el);
    if (isTextElement(el)) {
        /** @type {?} */
        var val = getValue(el);
        setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
        setCaretPosition(el, start + text.length, iframe);
    }
    else if (!noRecursion) {
        /** @type {?} */
        var selObj = getWindowSelection(iframe);
        if (selObj && selObj.rangeCount > 0) {
            /** @type {?} */
            var selRange = selObj.getRangeAt(0);
            /** @type {?} */
            var position = selRange.startOffset;
            /** @type {?} */
            var anchorNode = selObj.anchorNode;
            // if (text.endsWith(' ')) {
            //   text = text.substring(0, text.length-1) + '\xA0';
            // }
            insertValue((/** @type {?} */ (anchorNode)), position - (end - start), position, text, iframe, true);
        }
    }
}
/**
 * @param {?} el
 * @return {?}
 */
export function isInputOrTextAreaElement(el) {
    return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA');
}
;
/**
 * @param {?} el
 * @return {?}
 */
export function isTextElement(el) {
    return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA' || el.nodeName == '#text');
}
;
/**
 * @param {?} el
 * @param {?} pos
 * @param {?=} iframe
 * @return {?}
 */
export function setCaretPosition(el, pos, iframe) {
    if (iframe === void 0) { iframe = null; }
    //console.log("setCaretPosition", pos, el, iframe==null);
    if (isInputOrTextAreaElement(el) && el.selectionStart) {
        el.focus();
        el.setSelectionRange(pos, pos);
    }
    else {
        /** @type {?} */
        var range = getDocument(iframe).createRange();
        range.setStart(el, pos);
        range.collapse(true);
        /** @type {?} */
        var sel = getWindowSelection(iframe);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
/**
 * @param {?} el
 * @param {?=} iframe
 * @return {?}
 */
export function getCaretPosition(el, iframe) {
    if (iframe === void 0) { iframe = null; }
    //console.log("getCaretPosition", el);
    if (isInputOrTextAreaElement(el)) {
        /** @type {?} */
        var val = el.value;
        return val.slice(0, el.selectionStart).length;
    }
    else {
        /** @type {?} */
        var selObj = getWindowSelection(iframe);
        if (selObj.rangeCount > 0) {
            /** @type {?} */
            var selRange = selObj.getRangeAt(0);
            /** @type {?} */
            var preCaretRange = selRange.cloneRange();
            preCaretRange.selectNodeContents(el);
            preCaretRange.setEnd(selRange.endContainer, selRange.endOffset);
            /** @type {?} */
            var position = preCaretRange.toString().length;
            return position;
        }
    }
}
// Based on ment.io functions...
//
/**
 * @param {?} iframe
 * @return {?}
 */
function getDocument(iframe) {
    if (!iframe) {
        return document;
    }
    else {
        return iframe.contentWindow.document;
    }
}
/**
 * @param {?} iframe
 * @return {?}
 */
function getWindowSelection(iframe) {
    if (!iframe) {
        return window.getSelection();
    }
    else {
        return iframe.contentWindow.getSelection();
    }
}
/**
 * @param {?} ctx
 * @return {?}
 */
export function getContentEditableCaretCoords(ctx) {
    /** @type {?} */
    var markerTextChar = '\ufeff';
    /** @type {?} */
    var markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
    /** @type {?} */
    var doc = getDocument(ctx ? ctx.iframe : null);
    /** @type {?} */
    var sel = getWindowSelection(ctx ? ctx.iframe : null);
    /** @type {?} */
    var prevRange = sel.getRangeAt(0);
    // create new range and set postion using prevRange
    /** @type {?} */
    var range = doc.createRange();
    range.setStart(sel.anchorNode, prevRange.startOffset);
    range.setEnd(sel.anchorNode, prevRange.startOffset);
    range.collapse(false);
    // Create the marker element containing a single invisible character
    // using DOM methods and insert it at the position in the range
    /** @type {?} */
    var markerEl = doc.createElement('span');
    markerEl.id = markerId;
    markerEl.appendChild(doc.createTextNode(markerTextChar));
    range.insertNode(markerEl);
    sel.removeAllRanges();
    sel.addRange(prevRange);
    /** @type {?} */
    var coordinates = {
        left: 0,
        top: markerEl.offsetHeight
    };
    localToRelativeCoordinates(ctx, markerEl, coordinates);
    markerEl.parentNode.removeChild(markerEl);
    return coordinates;
}
/**
 * @param {?} ctx
 * @param {?} element
 * @param {?} coordinates
 * @return {?}
 */
function localToRelativeCoordinates(ctx, element, coordinates) {
    /** @type {?} */
    var obj = (/** @type {?} */ (element));
    /** @type {?} */
    var iframe = ctx ? ctx.iframe : null;
    while (obj) {
        if (ctx.parent != null && ctx.parent == obj) {
            break;
        }
        coordinates.left += obj.offsetLeft + obj.clientLeft;
        coordinates.top += obj.offsetTop + obj.clientTop;
        obj = (/** @type {?} */ (obj.offsetParent));
        if (!obj && iframe) {
            obj = iframe;
            iframe = null;
        }
    }
    obj = (/** @type {?} */ (element));
    iframe = ctx ? ctx.iframe : null;
    while (obj !== getDocument(null).body && obj != null) {
        if (ctx.parent != null && ctx.parent == obj) {
            break;
        }
        if (obj.scrollTop && obj.scrollTop > 0) {
            coordinates.top -= obj.scrollTop;
        }
        if (obj.scrollLeft && obj.scrollLeft > 0) {
            coordinates.left -= obj.scrollLeft;
        }
        obj = (/** @type {?} */ (obj.parentNode));
        if (!obj && iframe) {
            obj = iframe;
            iframe = null;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi11dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbWVudGlvbnMvIiwic291cmNlcyI6WyJsaWIvbWVudGlvbi11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFHQSxTQUFTLFFBQVEsQ0FBQyxFQUFvQixFQUFFLEtBQVU7SUFDaEQsc0RBQXNEO0lBQ3RELElBQUksd0JBQXdCLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDaEMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDbEI7U0FDSTtRQUNILEVBQUUsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsUUFBUSxDQUFDLEVBQW9CO0lBQzNDLE9BQU8sd0JBQXdCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDbEUsQ0FBQzs7Ozs7Ozs7OztBQUVELE1BQU0sVUFBVSxXQUFXLENBQ3pCLEVBQW9CLEVBQ3BCLEtBQWEsRUFDYixHQUFXLEVBQ1gsSUFBWSxFQUNaLE1BQXlCLEVBQ3pCLFdBQTRCO0lBQTVCLDRCQUFBLEVBQUEsbUJBQTRCO0lBRTVCLHdFQUF3RTtJQUN4RSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTs7WUFDakIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDdEIsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUUsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ25E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InNvdXJjZXNDb250ZW50IjpbIi8vIERPTSBlbGVtZW50IG1hbmlwdWxhdGlvbiBmdW5jdGlvbnMuLi5cbi8vXG5cbmZ1bmN0aW9uIHNldFZhbHVlKGVsOiBIVE1MSW5wdXRFbGVtZW50LCB2YWx1ZTogYW55KSB7XG4gIC8vY29uc29sZS5sb2coXCJzZXRWYWx1ZVwiLCBlbC5ub2RlTmFtZSwgXCJbXCIrdmFsdWUrXCJdXCIpO1xuICBpZiAoaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsKSkge1xuICAgIGVsLnZhbHVlID0gdmFsdWU7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWwudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWUoZWw6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgcmV0dXJuIGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbCkgPyBlbC52YWx1ZSA6IGVsLnRleHRDb250ZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0VmFsdWUoXG4gIGVsOiBIVE1MSW5wdXRFbGVtZW50LFxuICBzdGFydDogbnVtYmVyLFxuICBlbmQ6IG51bWJlcixcbiAgdGV4dDogc3RyaW5nLFxuICBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50LFxuICBub1JlY3Vyc2lvbjogYm9vbGVhbiA9IGZhbHNlXG4pIHtcbiAgLy9jb25zb2xlLmxvZyhcImluc2VydFZhbHVlXCIsIGVsLm5vZGVOYW1lLCBzdGFydCwgZW5kLCBcIltcIit0ZXh0K1wiXVwiLCBlbCk7XG4gIGlmIChpc1RleHRFbGVtZW50KGVsKSkge1xuICAgIGxldCB2YWwgPSBnZXRWYWx1ZShlbCk7XG4gICAgc2V0VmFsdWUoZWwsIHZhbC5zdWJzdHJpbmcoMCwgc3RhcnQpICsgdGV4dCArIHZhbC5zdWJzdHJpbmcoZW5kLCB2YWwubGVuZ3RoKSk7XG4gICAgc2V0Q2FyZXRQb3NpdGlvbihlbCwgc3RhcnQgKyB0ZXh0Lmxlbmd0aCwgaWZyYW1lKTtcbiAgfVxuICBlbHNlIGlmICghbm9SZWN1cnNpb24pIHtcbiAgICBsZXQgc2VsT2JqOiBTZWxlY3Rpb24gPSBnZXRXaW5kb3dTZWxlY3Rpb24oaWZyYW1lKTtcbiAgICBpZiAoc2VsT2JqICYmIHNlbE9iai5yYW5nZUNvdW50ID4gMCkge1xuICAgICAgdmFyIHNlbFJhbmdlID0gc2VsT2JqLmdldFJhbmdlQXQoMCk7XG4gICAgICB2YXIgcG9zaXRpb24gPSBzZWxSYW5nZS5zdGFydE9mZnNldDtcbiAgICAgIHZhciBhbmNob3JOb2RlID0gc2VsT2JqLmFuY2hvck5vZGU7XG4gICAgICAvLyBpZiAodGV4dC5lbmRzV2l0aCgnICcpKSB7XG4gICAgICAvLyAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aC0xKSArICdcXHhBMCc7XG4gICAgICAvLyB9XG4gICAgICBpbnNlcnRWYWx1ZSg8SFRNTElucHV0RWxlbWVudD5hbmNob3JOb2RlLCBwb3NpdGlvbiAtIChlbmQgLSBzdGFydCksIHBvc2l0aW9uLCB0ZXh0LCBpZnJhbWUsIHRydWUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZWwgIT0gbnVsbCAmJiAoZWwubm9kZU5hbWUgPT0gJ0lOUFVUJyB8fCBlbC5ub2RlTmFtZSA9PSAnVEVYVEFSRUEnKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RleHRFbGVtZW50KGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZWwgIT0gbnVsbCAmJiAoZWwubm9kZU5hbWUgPT0gJ0lOUFVUJyB8fCBlbC5ub2RlTmFtZSA9PSAnVEVYVEFSRUEnIHx8IGVsLm5vZGVOYW1lID09ICcjdGV4dCcpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENhcmV0UG9zaXRpb24oZWw6IEhUTUxJbnB1dEVsZW1lbnQsIHBvczogbnVtYmVyLCBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50ID0gbnVsbCkge1xuICAvL2NvbnNvbGUubG9nKFwic2V0Q2FyZXRQb3NpdGlvblwiLCBwb3MsIGVsLCBpZnJhbWU9PW51bGwpO1xuICBpZiAoaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsKSAmJiBlbC5zZWxlY3Rpb25TdGFydCkge1xuICAgIGVsLmZvY3VzKCk7XG4gICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UocG9zLCBwb3MpO1xuICB9XG4gIGVsc2Uge1xuICAgIGxldCByYW5nZSA9IGdldERvY3VtZW50KGlmcmFtZSkuY3JlYXRlUmFuZ2UoKTtcbiAgICByYW5nZS5zZXRTdGFydChlbCwgcG9zKTtcbiAgICByYW5nZS5jb2xsYXBzZSh0cnVlKTtcbiAgICBsZXQgc2VsID0gZ2V0V2luZG93U2VsZWN0aW9uKGlmcmFtZSk7XG4gICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhcmV0UG9zaXRpb24oZWw6IEhUTUxJbnB1dEVsZW1lbnQsIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgPSBudWxsKSB7XG4gIC8vY29uc29sZS5sb2coXCJnZXRDYXJldFBvc2l0aW9uXCIsIGVsKTtcbiAgaWYgKGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbCkpIHtcbiAgICB2YXIgdmFsID0gZWwudmFsdWU7XG4gICAgcmV0dXJuIHZhbC5zbGljZSgwLCBlbC5zZWxlY3Rpb25TdGFydCkubGVuZ3RoO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBzZWxPYmogPSBnZXRXaW5kb3dTZWxlY3Rpb24oaWZyYW1lKTsgLy93aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKHNlbE9iai5yYW5nZUNvdW50ID4gMCkge1xuICAgICAgdmFyIHNlbFJhbmdlID0gc2VsT2JqLmdldFJhbmdlQXQoMCk7XG4gICAgICB2YXIgcHJlQ2FyZXRSYW5nZSA9IHNlbFJhbmdlLmNsb25lUmFuZ2UoKTtcbiAgICAgIHByZUNhcmV0UmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsKTtcbiAgICAgIHByZUNhcmV0UmFuZ2Uuc2V0RW5kKHNlbFJhbmdlLmVuZENvbnRhaW5lciwgc2VsUmFuZ2UuZW5kT2Zmc2V0KTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IHByZUNhcmV0UmFuZ2UudG9TdHJpbmcoKS5sZW5ndGg7XG4gICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfVxuICB9XG59XG5cbi8vIEJhc2VkIG9uIG1lbnQuaW8gZnVuY3Rpb25zLi4uXG4vL1xuXG5mdW5jdGlvbiBnZXREb2N1bWVudChpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50KSB7XG4gIGlmICghaWZyYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRXaW5kb3dTZWxlY3Rpb24oaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCk6IFNlbGVjdGlvbiB7XG4gIGlmICghaWZyYW1lKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRlbnRFZGl0YWJsZUNhcmV0Q29vcmRzKGN0eDogeyBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50LCBwYXJlbnQ/OiBFbGVtZW50IH0pIHtcbiAgbGV0IG1hcmtlclRleHRDaGFyID0gJ1xcdWZlZmYnO1xuICBsZXQgbWFya2VySWQgPSAnc2VsXycgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArICdfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zdWJzdHIoMik7XG4gIGxldCBkb2MgPSBnZXREb2N1bWVudChjdHggPyBjdHguaWZyYW1lIDogbnVsbCk7XG4gIGxldCBzZWwgPSBnZXRXaW5kb3dTZWxlY3Rpb24oY3R4ID8gY3R4LmlmcmFtZSA6IG51bGwpO1xuICBsZXQgcHJldlJhbmdlID0gc2VsLmdldFJhbmdlQXQoMCk7XG5cbiAgLy8gY3JlYXRlIG5ldyByYW5nZSBhbmQgc2V0IHBvc3Rpb24gdXNpbmcgcHJldlJhbmdlXG4gIGxldCByYW5nZSA9IGRvYy5jcmVhdGVSYW5nZSgpO1xuICByYW5nZS5zZXRTdGFydChzZWwuYW5jaG9yTm9kZSwgcHJldlJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgcmFuZ2Uuc2V0RW5kKHNlbC5hbmNob3JOb2RlLCBwcmV2UmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICByYW5nZS5jb2xsYXBzZShmYWxzZSk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBtYXJrZXIgZWxlbWVudCBjb250YWluaW5nIGEgc2luZ2xlIGludmlzaWJsZSBjaGFyYWN0ZXJcbiAgLy8gdXNpbmcgRE9NIG1ldGhvZHMgYW5kIGluc2VydCBpdCBhdCB0aGUgcG9zaXRpb24gaW4gdGhlIHJhbmdlXG4gIGxldCBtYXJrZXJFbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIG1hcmtlckVsLmlkID0gbWFya2VySWQ7XG4gIG1hcmtlckVsLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShtYXJrZXJUZXh0Q2hhcikpO1xuICByYW5nZS5pbnNlcnROb2RlKG1hcmtlckVsKTtcbiAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICBzZWwuYWRkUmFuZ2UocHJldlJhbmdlKTtcblxuICBsZXQgY29vcmRpbmF0ZXMgPSB7XG4gICAgbGVmdDogMCxcbiAgICB0b3A6IG1hcmtlckVsLm9mZnNldEhlaWdodFxuICB9O1xuXG4gIGxvY2FsVG9SZWxhdGl2ZUNvb3JkaW5hdGVzKGN0eCwgbWFya2VyRWwsIGNvb3JkaW5hdGVzKTtcblxuICBtYXJrZXJFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1hcmtlckVsKTtcbiAgcmV0dXJuIGNvb3JkaW5hdGVzO1xufVxuXG5mdW5jdGlvbiBsb2NhbFRvUmVsYXRpdmVDb29yZGluYXRlcyhcbiAgY3R4OiB7IGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQsIHBhcmVudD86IEVsZW1lbnQgfSxcbiAgZWxlbWVudDogRWxlbWVudCxcbiAgY29vcmRpbmF0ZXM6IHsgdG9wOiBudW1iZXI7IGxlZnQ6IG51bWJlciB9XG4pIHtcbiAgbGV0IG9iaiA9IDxIVE1MRWxlbWVudD5lbGVtZW50O1xuICBsZXQgaWZyYW1lID0gY3R4ID8gY3R4LmlmcmFtZSA6IG51bGw7XG4gIHdoaWxlIChvYmopIHtcbiAgICBpZiAoY3R4LnBhcmVudCAhPSBudWxsICYmIGN0eC5wYXJlbnQgPT0gb2JqKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY29vcmRpbmF0ZXMubGVmdCArPSBvYmoub2Zmc2V0TGVmdCArIG9iai5jbGllbnRMZWZ0O1xuICAgIGNvb3JkaW5hdGVzLnRvcCArPSBvYmoub2Zmc2V0VG9wICsgb2JqLmNsaWVudFRvcDtcbiAgICBvYmogPSA8SFRNTEVsZW1lbnQ+b2JqLm9mZnNldFBhcmVudDtcbiAgICBpZiAoIW9iaiAmJiBpZnJhbWUpIHtcbiAgICAgIG9iaiA9IGlmcmFtZTtcbiAgICAgIGlmcmFtZSA9IG51bGw7XG4gICAgfVxuICB9XG4gIG9iaiA9IDxIVE1MRWxlbWVudD5lbGVtZW50O1xuICBpZnJhbWUgPSBjdHggPyBjdHguaWZyYW1lIDogbnVsbDtcbiAgd2hpbGUgKG9iaiAhPT0gZ2V0RG9jdW1lbnQobnVsbCkuYm9keSAmJiBvYmogIT0gbnVsbCkge1xuICAgIGlmIChjdHgucGFyZW50ICE9IG51bGwgJiYgY3R4LnBhcmVudCA9PSBvYmopIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAob2JqLnNjcm9sbFRvcCAmJiBvYmouc2Nyb2xsVG9wID4gMCkge1xuICAgICAgY29vcmRpbmF0ZXMudG9wIC09IG9iai5zY3JvbGxUb3A7XG4gICAgfVxuICAgIGlmIChvYmouc2Nyb2xsTGVmdCAmJiBvYmouc2Nyb2xsTGVmdCA+IDApIHtcbiAgICAgIGNvb3JkaW5hdGVzLmxlZnQgLT0gb2JqLnNjcm9sbExlZnQ7XG4gICAgfVxuICAgIG9iaiA9IDxIVE1MRWxlbWVudD5vYmoucGFyZW50Tm9kZTtcbiAgICBpZiAoIW9iaiAmJiBpZnJhbWUpIHtcbiAgICAgIG9iaiA9IGlmcmFtZTtcbiAgICAgIGlmcmFtZSA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iXX0=