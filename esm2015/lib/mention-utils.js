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
export function insertValue(el, start, end, text, iframe, noRecursion = false) {
    //console.log("insertValue", el.nodeName, start, end, "["+text+"]", el);
    if (isTextElement(el)) {
        /** @type {?} */
        let val = getValue(el);
        setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
        setCaretPosition(el, start + text.length, iframe);
    }
    else if (!noRecursion) {
        /** @type {?} */
        let selObj = getWindowSelection(iframe);
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
export function setCaretPosition(el, pos, iframe = null) {
    //console.log("setCaretPosition", pos, el, iframe==null);
    if (isInputOrTextAreaElement(el) && el.selectionStart) {
        el.focus();
        el.setSelectionRange(pos, pos);
    }
    else {
        /** @type {?} */
        let range = getDocument(iframe).createRange();
        range.setStart(el, pos);
        range.collapse(true);
        /** @type {?} */
        let sel = getWindowSelection(iframe);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
/**
 * @param {?} el
 * @param {?=} iframe
 * @return {?}
 */
export function getCaretPosition(el, iframe = null) {
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
    let markerTextChar = '\ufeff';
    /** @type {?} */
    let markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
    /** @type {?} */
    let doc = getDocument(ctx ? ctx.iframe : null);
    /** @type {?} */
    let sel = getWindowSelection(ctx ? ctx.iframe : null);
    /** @type {?} */
    let prevRange = sel.getRangeAt(0);
    // create new range and set postion using prevRange
    /** @type {?} */
    let range = doc.createRange();
    range.setStart(sel.anchorNode, prevRange.startOffset);
    range.setEnd(sel.anchorNode, prevRange.startOffset);
    range.collapse(false);
    // Create the marker element containing a single invisible character
    // using DOM methods and insert it at the position in the range
    /** @type {?} */
    let markerEl = doc.createElement('span');
    markerEl.id = markerId;
    markerEl.appendChild(doc.createTextNode(markerTextChar));
    range.insertNode(markerEl);
    sel.removeAllRanges();
    sel.addRange(prevRange);
    /** @type {?} */
    let coordinates = {
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
    let obj = (/** @type {?} */ (element));
    /** @type {?} */
    let iframe = ctx ? ctx.iframe : null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi11dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbWVudGlvbnMvIiwic291cmNlcyI6WyJsaWIvbWVudGlvbi11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFHQSxTQUFTLFFBQVEsQ0FBQyxFQUFvQixFQUFFLEtBQVU7SUFDaEQsc0RBQXNEO0lBQ3RELElBQUksd0JBQXdCLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDaEMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDbEI7U0FDSTtRQUNILEVBQUUsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsUUFBUSxDQUFDLEVBQW9CO0lBQzNDLE9BQU8sd0JBQXdCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDbEUsQ0FBQzs7Ozs7Ozs7OztBQUVELE1BQU0sVUFBVSxXQUFXLENBQ3pCLEVBQW9CLEVBQ3BCLEtBQWEsRUFDYixHQUFXLEVBQ1gsSUFBWSxFQUNaLE1BQXlCLEVBQ3pCLGNBQXVCLEtBQUs7SUFFNUIsd0VBQXdFO0lBQ3hFLElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFOztZQUNqQixHQUFHLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUN0QixRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5RSxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDbkQ7U0FDSSxJQUFJLENBQUMsV0FB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cy4uLlxuLy9cblxuZnVuY3Rpb24gc2V0VmFsdWUoZWw6IEhUTUxJbnB1dEVsZW1lbnQsIHZhbHVlOiBhbnkpIHtcbiAgLy9jb25zb2xlLmxvZyhcInNldFZhbHVlXCIsIGVsLm5vZGVOYW1lLCBcIltcIit2YWx1ZStcIl1cIik7XG4gIGlmIChpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQoZWwpKSB7XG4gICAgZWwudmFsdWUgPSB2YWx1ZTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZShlbDogSFRNTElucHV0RWxlbWVudCkge1xuICByZXR1cm4gaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsKSA/IGVsLnZhbHVlIDogZWwudGV4dENvbnRlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRWYWx1ZShcbiAgZWw6IEhUTUxJbnB1dEVsZW1lbnQsXG4gIHN0YXJ0OiBudW1iZXIsXG4gIGVuZDogbnVtYmVyLFxuICB0ZXh0OiBzdHJpbmcsXG4gIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQsXG4gIG5vUmVjdXJzaW9uOiBib29sZWFuID0gZmFsc2Vcbikge1xuICAvL2NvbnNvbGUubG9nKFwiaW5zZXJ0VmFsdWVcIiwgZWwubm9kZU5hbWUsIHN0YXJ0LCBlbmQsIFwiW1wiK3RleHQrXCJdXCIsIGVsKTtcbiAgaWYgKGlzVGV4dEVsZW1lbnQoZWwpKSB7XG4gICAgbGV0IHZhbCA9IGdldFZhbHVlKGVsKTtcbiAgICBzZXRWYWx1ZShlbCwgdmFsLnN1YnN0cmluZygwLCBzdGFydCkgKyB0ZXh0ICsgdmFsLnN1YnN0cmluZyhlbmQsIHZhbC5sZW5ndGgpKTtcbiAgICBzZXRDYXJldFBvc2l0aW9uKGVsLCBzdGFydCArIHRleHQubGVuZ3RoLCBpZnJhbWUpO1xuICB9XG4gIGVsc2UgaWYgKCFub1JlY3Vyc2lvbikge1xuICAgIGxldCBzZWxPYmo6IFNlbGVjdGlvbiA9IGdldFdpbmRvd1NlbGVjdGlvbihpZnJhbWUpO1xuICAgIGlmIChzZWxPYmogJiYgc2VsT2JqLnJhbmdlQ291bnQgPiAwKSB7XG4gICAgICB2YXIgc2VsUmFuZ2UgPSBzZWxPYmouZ2V0UmFuZ2VBdCgwKTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IHNlbFJhbmdlLnN0YXJ0T2Zmc2V0O1xuICAgICAgdmFyIGFuY2hvck5vZGUgPSBzZWxPYmouYW5jaG9yTm9kZTtcbiAgICAgIC8vIGlmICh0ZXh0LmVuZHNXaXRoKCcgJykpIHtcbiAgICAgIC8vICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHRleHQubGVuZ3RoLTEpICsgJ1xceEEwJztcbiAgICAgIC8vIH1cbiAgICAgIGluc2VydFZhbHVlKDxIVE1MSW5wdXRFbGVtZW50PmFuY2hvck5vZGUsIHBvc2l0aW9uIC0gKGVuZCAtIHN0YXJ0KSwgcG9zaXRpb24sIHRleHQsIGlmcmFtZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQoZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIHJldHVybiBlbCAhPSBudWxsICYmIChlbC5ub2RlTmFtZSA9PSAnSU5QVVQnIHx8IGVsLm5vZGVOYW1lID09ICdURVhUQVJFQScpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGV4dEVsZW1lbnQoZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIHJldHVybiBlbCAhPSBudWxsICYmIChlbC5ub2RlTmFtZSA9PSAnSU5QVVQnIHx8IGVsLm5vZGVOYW1lID09ICdURVhUQVJFQScgfHwgZWwubm9kZU5hbWUgPT0gJyN0ZXh0Jyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q2FyZXRQb3NpdGlvbihlbDogSFRNTElucHV0RWxlbWVudCwgcG9zOiBudW1iZXIsIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgPSBudWxsKSB7XG4gIC8vY29uc29sZS5sb2coXCJzZXRDYXJldFBvc2l0aW9uXCIsIHBvcywgZWwsIGlmcmFtZT09bnVsbCk7XG4gIGlmIChpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQoZWwpICYmIGVsLnNlbGVjdGlvblN0YXJ0KSB7XG4gICAgZWwuZm9jdXMoKTtcbiAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbGV0IHJhbmdlID0gZ2V0RG9jdW1lbnQoaWZyYW1lKS5jcmVhdGVSYW5nZSgpO1xuICAgIHJhbmdlLnNldFN0YXJ0KGVsLCBwb3MpO1xuICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xuICAgIGxldCBzZWwgPSBnZXRXaW5kb3dTZWxlY3Rpb24oaWZyYW1lKTtcbiAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FyZXRQb3NpdGlvbihlbDogSFRNTElucHV0RWxlbWVudCwgaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCA9IG51bGwpIHtcbiAgLy9jb25zb2xlLmxvZyhcImdldENhcmV0UG9zaXRpb25cIiwgZWwpO1xuICBpZiAoaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsKSkge1xuICAgIHZhciB2YWwgPSBlbC52YWx1ZTtcbiAgICByZXR1cm4gdmFsLnNsaWNlKDAsIGVsLnNlbGVjdGlvblN0YXJ0KS5sZW5ndGg7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHNlbE9iaiA9IGdldFdpbmRvd1NlbGVjdGlvbihpZnJhbWUpOyAvL3dpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICBpZiAoc2VsT2JqLnJhbmdlQ291bnQgPiAwKSB7XG4gICAgICB2YXIgc2VsUmFuZ2UgPSBzZWxPYmouZ2V0UmFuZ2VBdCgwKTtcbiAgICAgIHZhciBwcmVDYXJldFJhbmdlID0gc2VsUmFuZ2UuY2xvbmVSYW5nZSgpO1xuICAgICAgcHJlQ2FyZXRSYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpO1xuICAgICAgcHJlQ2FyZXRSYW5nZS5zZXRFbmQoc2VsUmFuZ2UuZW5kQ29udGFpbmVyLCBzZWxSYW5nZS5lbmRPZmZzZXQpO1xuICAgICAgdmFyIHBvc2l0aW9uID0gcHJlQ2FyZXRSYW5nZS50b1N0cmluZygpLmxlbmd0aDtcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9XG4gIH1cbn1cblxuLy8gQmFzZWQgb24gbWVudC5pbyBmdW5jdGlvbnMuLi5cbi8vXG5cbmZ1bmN0aW9uIGdldERvY3VtZW50KGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgaWYgKCFpZnJhbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFdpbmRvd1NlbGVjdGlvbihpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50KTogU2VsZWN0aW9uIHtcbiAgaWYgKCFpZnJhbWUpIHtcbiAgICByZXR1cm4gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpZnJhbWUuY29udGVudFdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGVudEVkaXRhYmxlQ2FyZXRDb29yZHMoY3R4OiB7IGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQsIHBhcmVudD86IEVsZW1lbnQgfSkge1xuICBsZXQgbWFya2VyVGV4dENoYXIgPSAnXFx1ZmVmZic7XG4gIGxldCBtYXJrZXJJZCA9ICdzZWxfJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygpLnN1YnN0cigyKTtcbiAgbGV0IGRvYyA9IGdldERvY3VtZW50KGN0eCA/IGN0eC5pZnJhbWUgOiBudWxsKTtcbiAgbGV0IHNlbCA9IGdldFdpbmRvd1NlbGVjdGlvbihjdHggPyBjdHguaWZyYW1lIDogbnVsbCk7XG4gIGxldCBwcmV2UmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKTtcblxuICAvLyBjcmVhdGUgbmV3IHJhbmdlIGFuZCBzZXQgcG9zdGlvbiB1c2luZyBwcmV2UmFuZ2VcbiAgbGV0IHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gIHJhbmdlLnNldFN0YXJ0KHNlbC5hbmNob3JOb2RlLCBwcmV2UmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICByYW5nZS5zZXRFbmQoc2VsLmFuY2hvck5vZGUsIHByZXZSYW5nZS5zdGFydE9mZnNldCk7XG4gIHJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcblxuICAvLyBDcmVhdGUgdGhlIG1hcmtlciBlbGVtZW50IGNvbnRhaW5pbmcgYSBzaW5nbGUgaW52aXNpYmxlIGNoYXJhY3RlclxuICAvLyB1c2luZyBET00gbWV0aG9kcyBhbmQgaW5zZXJ0IGl0IGF0IHRoZSBwb3NpdGlvbiBpbiB0aGUgcmFuZ2VcbiAgbGV0IG1hcmtlckVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgbWFya2VyRWwuaWQgPSBtYXJrZXJJZDtcbiAgbWFya2VyRWwuYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKG1hcmtlclRleHRDaGFyKSk7XG4gIHJhbmdlLmluc2VydE5vZGUobWFya2VyRWwpO1xuICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gIHNlbC5hZGRSYW5nZShwcmV2UmFuZ2UpO1xuXG4gIGxldCBjb29yZGluYXRlcyA9IHtcbiAgICBsZWZ0OiAwLFxuICAgIHRvcDogbWFya2VyRWwub2Zmc2V0SGVpZ2h0XG4gIH07XG5cbiAgbG9jYWxUb1JlbGF0aXZlQ29vcmRpbmF0ZXMoY3R4LCBtYXJrZXJFbCwgY29vcmRpbmF0ZXMpO1xuXG4gIG1hcmtlckVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobWFya2VyRWwpO1xuICByZXR1cm4gY29vcmRpbmF0ZXM7XG59XG5cbmZ1bmN0aW9uIGxvY2FsVG9SZWxhdGl2ZUNvb3JkaW5hdGVzKFxuICBjdHg6IHsgaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCwgcGFyZW50PzogRWxlbWVudCB9LFxuICBlbGVtZW50OiBFbGVtZW50LFxuICBjb29yZGluYXRlczogeyB0b3A6IG51bWJlcjsgbGVmdDogbnVtYmVyIH1cbikge1xuICBsZXQgb2JqID0gPEhUTUxFbGVtZW50PmVsZW1lbnQ7XG4gIGxldCBpZnJhbWUgPSBjdHggPyBjdHguaWZyYW1lIDogbnVsbDtcbiAgd2hpbGUgKG9iaikge1xuICAgIGlmIChjdHgucGFyZW50ICE9IG51bGwgJiYgY3R4LnBhcmVudCA9PSBvYmopIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb29yZGluYXRlcy5sZWZ0ICs9IG9iai5vZmZzZXRMZWZ0ICsgb2JqLmNsaWVudExlZnQ7XG4gICAgY29vcmRpbmF0ZXMudG9wICs9IG9iai5vZmZzZXRUb3AgKyBvYmouY2xpZW50VG9wO1xuICAgIG9iaiA9IDxIVE1MRWxlbWVudD5vYmoub2Zmc2V0UGFyZW50O1xuICAgIGlmICghb2JqICYmIGlmcmFtZSkge1xuICAgICAgb2JqID0gaWZyYW1lO1xuICAgICAgaWZyYW1lID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgb2JqID0gPEhUTUxFbGVtZW50PmVsZW1lbnQ7XG4gIGlmcmFtZSA9IGN0eCA/IGN0eC5pZnJhbWUgOiBudWxsO1xuICB3aGlsZSAob2JqICE9PSBnZXREb2N1bWVudChudWxsKS5ib2R5ICYmIG9iaiAhPSBudWxsKSB7XG4gICAgaWYgKGN0eC5wYXJlbnQgIT0gbnVsbCAmJiBjdHgucGFyZW50ID09IG9iaikge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChvYmouc2Nyb2xsVG9wICYmIG9iai5zY3JvbGxUb3AgPiAwKSB7XG4gICAgICBjb29yZGluYXRlcy50b3AgLT0gb2JqLnNjcm9sbFRvcDtcbiAgICB9XG4gICAgaWYgKG9iai5zY3JvbGxMZWZ0ICYmIG9iai5zY3JvbGxMZWZ0ID4gMCkge1xuICAgICAgY29vcmRpbmF0ZXMubGVmdCAtPSBvYmouc2Nyb2xsTGVmdDtcbiAgICB9XG4gICAgb2JqID0gPEhUTUxFbGVtZW50Pm9iai5wYXJlbnROb2RlO1xuICAgIGlmICghb2JqICYmIGlmcmFtZSkge1xuICAgICAgb2JqID0gaWZyYW1lO1xuICAgICAgaWZyYW1lID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==