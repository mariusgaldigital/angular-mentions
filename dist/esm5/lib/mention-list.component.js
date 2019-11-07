/**
 * @fileoverview added by tsickle
 * Generated from: lib/mention-list.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Output, EventEmitter, ViewChild, Input, TemplateRef } from '@angular/core';
import { isInputOrTextAreaElement, getContentEditableCaretCoords } from './mention-utils';
import { getCaretCoordinates } from './caret-coords';
/**
 * Angular Mentions.
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Copyright (c) 2016 Dan MacFarlane
 */
var MentionListComponent = /** @class */ (function () {
    function MentionListComponent(element) {
        this.element = element;
        this.labelKey = 'label';
        this.itemClick = new EventEmitter();
        this.items = [];
        this.activeIndex = 0;
        this.hidden = false;
        this.dropUp = false;
        this.styleOff = false;
        this.coords = { top: 0, left: 0 };
        this.offset = 0;
    }
    /**
     * @return {?}
     */
    MentionListComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }
    };
    // lots of confusion here between relative coordinates and containers
    // lots of confusion here between relative coordinates and containers
    /**
     * @param {?} nativeParentElement
     * @param {?=} iframe
     * @return {?}
     */
    MentionListComponent.prototype.position = 
    // lots of confusion here between relative coordinates and containers
    /**
     * @param {?} nativeParentElement
     * @param {?=} iframe
     * @return {?}
     */
    function (nativeParentElement, iframe) {
        if (iframe === void 0) { iframe = null; }
        if (isInputOrTextAreaElement(nativeParentElement)) {
            // parent elements need to have postition:relative for this to work correctly?
            this.coords = getCaretCoordinates(nativeParentElement, nativeParentElement.selectionStart, null);
            this.coords.top = nativeParentElement.offsetTop + this.coords.top - nativeParentElement.scrollTop;
            this.coords.left = nativeParentElement.offsetLeft + this.coords.left - nativeParentElement.scrollLeft;
            // getCretCoordinates() for text/input elements needs an additional offset to position the list correctly
            this.offset = this.getBlockCursorDimensions(nativeParentElement).height;
        }
        else if (iframe) {
            /** @type {?} */
            var context = { iframe: iframe, parent: iframe.offsetParent };
            this.coords = getContentEditableCaretCoords(context);
        }
        else {
            /** @type {?} */
            var doc = document.documentElement;
            /** @type {?} */
            var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            /** @type {?} */
            var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            // bounding rectangles are relative to view, offsets are relative to container?
            /** @type {?} */
            var caretRelativeToView = getContentEditableCaretCoords({ iframe: iframe });
            /** @type {?} */
            var parentRelativeToContainer = nativeParentElement.getBoundingClientRect();
            this.coords.top = caretRelativeToView.top - parentRelativeToContainer.top + nativeParentElement.offsetTop - scrollTop;
            this.coords.left = caretRelativeToView.left - parentRelativeToContainer.left + nativeParentElement.offsetLeft - scrollLeft;
        }
        // set the default/inital position
        this.positionElement();
    };
    Object.defineProperty(MentionListComponent.prototype, "activeItem", {
        get: /**
         * @return {?}
         */
        function () {
            return this.items[this.activeIndex];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MentionListComponent.prototype.activateNextItem = /**
     * @return {?}
     */
    function () {
        // adjust scrollable-menu offset if the next item is out of view
        /** @type {?} */
        var listEl = this.list.nativeElement;
        /** @type {?} */
        var activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            /** @type {?} */
            var nextLiEl = (/** @type {?} */ (activeEl.nextSibling));
            if (nextLiEl && nextLiEl.nodeName == "LI") {
                /** @type {?} */
                var nextLiRect = nextLiEl.getBoundingClientRect();
                if (nextLiRect.bottom > listEl.getBoundingClientRect().bottom) {
                    listEl.scrollTop = nextLiEl.offsetTop + nextLiRect.height - listEl.clientHeight;
                }
            }
        }
        // select the next item
        this.activeIndex = Math.max(Math.min(this.activeIndex + 1, this.items.length - 1), 0);
    };
    /**
     * @return {?}
     */
    MentionListComponent.prototype.activatePreviousItem = /**
     * @return {?}
     */
    function () {
        // adjust the scrollable-menu offset if the previous item is out of view
        /** @type {?} */
        var listEl = this.list.nativeElement;
        /** @type {?} */
        var activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            /** @type {?} */
            var prevLiEl = (/** @type {?} */ (activeEl.previousSibling));
            if (prevLiEl && prevLiEl.nodeName == "LI") {
                /** @type {?} */
                var prevLiRect = prevLiEl.getBoundingClientRect();
                if (prevLiRect.top < listEl.getBoundingClientRect().top) {
                    listEl.scrollTop = prevLiEl.offsetTop;
                }
            }
        }
        // select the previous item
        this.activeIndex = Math.max(Math.min(this.activeIndex - 1, this.items.length - 1), 0);
    };
    // reset for a new mention search
    // reset for a new mention search
    /**
     * @return {?}
     */
    MentionListComponent.prototype.reset = 
    // reset for a new mention search
    /**
     * @return {?}
     */
    function () {
        this.list.nativeElement.scrollTop = 0;
        this.checkBounds();
    };
    // final positioning is done after the list is shown (and the height and width are known)
    // ensure it's in the page bounds
    // final positioning is done after the list is shown (and the height and width are known)
    // ensure it's in the page bounds
    /**
     * @private
     * @return {?}
     */
    MentionListComponent.prototype.checkBounds = 
    // final positioning is done after the list is shown (and the height and width are known)
    // ensure it's in the page bounds
    /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var left = this.coords.left;
        /** @type {?} */
        var top = this.coords.top;
        /** @type {?} */
        var dropUp = this.dropUp;
        /** @type {?} */
        var bounds = this.list.nativeElement.getBoundingClientRect();
        // if off right of page, align right
        if (bounds.left + bounds.width > window.innerWidth) {
            left = (window.innerWidth - bounds.width - 10);
        }
        // if more than half off the bottom of the page, force dropUp
        // if ((bounds.top+bounds.height/2)>window.innerHeight) {
        //   dropUp = true;
        // }
        // if top is off page, disable dropUp
        if (bounds.top < 0) {
            dropUp = false;
        }
        // set the revised/final position
        this.positionElement(left, top, dropUp);
    };
    /**
     * @private
     * @param {?=} left
     * @param {?=} top
     * @param {?=} dropUp
     * @return {?}
     */
    MentionListComponent.prototype.positionElement = /**
     * @private
     * @param {?=} left
     * @param {?=} top
     * @param {?=} dropUp
     * @return {?}
     */
    function (left, top, dropUp) {
        if (left === void 0) { left = this.coords.left; }
        if (top === void 0) { top = this.coords.top; }
        if (dropUp === void 0) { dropUp = this.dropUp; }
        /** @type {?} */
        var el = this.element.nativeElement;
        top += dropUp ? 0 : this.offset; // top of list is next line
        el.className = dropUp ? 'dropup' : null;
        el.style.position = "absolute";
        el.style.left = left + 'px';
        el.style.top = top + 'px';
    };
    /**
     * @private
     * @param {?} nativeParentElement
     * @return {?}
     */
    MentionListComponent.prototype.getBlockCursorDimensions = /**
     * @private
     * @param {?} nativeParentElement
     * @return {?}
     */
    function (nativeParentElement) {
        /** @type {?} */
        var parentStyles = window.getComputedStyle(nativeParentElement);
        return {
            height: parseFloat(parentStyles.lineHeight),
            width: parseFloat(parentStyles.fontSize)
        };
    };
    MentionListComponent.decorators = [
        { type: Component, args: [{
                    selector: 'mention-list',
                    template: "\n    <ng-template #defaultItemTemplate let-item=\"item\">\n      {{item[labelKey]}}\n    </ng-template>\n    <ul #list [hidden]=\"hidden\" class=\"dropdown-menu scrollable-menu\" [class.mention-menu]=\"!styleOff\">\n      <li *ngFor=\"let item of items; let i = index\" \n        [class.active]=\"activeIndex==i\" [class.mention-active]=\"!styleOff && activeIndex==i\">\n        <a class=\"dropdown-item\" [class.mention-item]=\"!styleOff\"\n          (mousedown)=\"activeIndex=i;itemClick.emit();$event.preventDefault()\">\n          <ng-template [ngTemplateOutlet]=\"itemTemplate\" [ngTemplateOutletContext]=\"{'item':item}\"></ng-template>\n        </a>\n      </li>\n    </ul>\n    ",
                    styles: [".mention-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:11em;padding:.5em 0;margin:.125em 0 0;font-size:1em;color:#212529;text-align:left;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:.25em}.mention-item{display:block;padding:.2em 1.5em;line-height:1.5em;clear:both;font-weight:400;color:#212529;text-align:inherit;white-space:nowrap;background-color:transparent;border:0}.mention-active>a{color:#fff;text-decoration:none;background-color:#337ab7;outline:0}.scrollable-menu{display:block;height:auto;max-height:292px;overflow:auto}[hidden]{display:none}"]
                }] }
    ];
    /** @nocollapse */
    MentionListComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    MentionListComponent.propDecorators = {
        labelKey: [{ type: Input }],
        itemTemplate: [{ type: Input }],
        itemClick: [{ type: Output }],
        list: [{ type: ViewChild, args: ['list',] }],
        defaultItemTemplate: [{ type: ViewChild, args: ['defaultItemTemplate',] }]
    };
    return MentionListComponent;
}());
export { MentionListComponent };
if (false) {
    /** @type {?} */
    MentionListComponent.prototype.labelKey;
    /** @type {?} */
    MentionListComponent.prototype.itemTemplate;
    /** @type {?} */
    MentionListComponent.prototype.itemClick;
    /** @type {?} */
    MentionListComponent.prototype.list;
    /** @type {?} */
    MentionListComponent.prototype.defaultItemTemplate;
    /** @type {?} */
    MentionListComponent.prototype.items;
    /** @type {?} */
    MentionListComponent.prototype.activeIndex;
    /** @type {?} */
    MentionListComponent.prototype.hidden;
    /** @type {?} */
    MentionListComponent.prototype.dropUp;
    /** @type {?} */
    MentionListComponent.prototype.styleOff;
    /**
     * @type {?}
     * @private
     */
    MentionListComponent.prototype.coords;
    /**
     * @type {?}
     * @private
     */
    MentionListComponent.prototype.offset;
    /**
     * @type {?}
     * @private
     */
    MentionListComponent.prototype.element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbWVudGlvbnMvIiwic291cmNlcyI6WyJsaWIvbWVudGlvbi1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQzNFLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzFGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7O0FBUXJEO0lBK0JFLDhCQUFvQixPQUFtQjtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBWjlCLGFBQVEsR0FBVyxPQUFPLENBQUM7UUFFMUIsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHekMsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFDeEIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQ2xCLFdBQU0sR0FBOEIsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBQyxDQUFDLEVBQUMsQ0FBQztRQUNwRCxXQUFNLEdBQVcsQ0FBQyxDQUFDO0lBQ2UsQ0FBQzs7OztJQUUzQyx1Q0FBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFRCxxRUFBcUU7Ozs7Ozs7SUFDckUsdUNBQVE7Ozs7Ozs7SUFBUixVQUFTLG1CQUFxQyxFQUFFLE1BQWdDO1FB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MUIsc0NBQTREOzs7OztJQUM1RCxzQ0FBMkI7Ozs7O0lBQ2YsdUNBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBJbnB1dCwgVGVtcGxhdGVSZWYsIE9uSW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50LCBnZXRDb250ZW50RWRpdGFibGVDYXJldENvb3JkcyB9IGZyb20gJy4vbWVudGlvbi11dGlscyc7XG5pbXBvcnQgeyBnZXRDYXJldENvb3JkaW5hdGVzIH0gZnJvbSAnLi9jYXJldC1jb29yZHMnO1xuXG4vKipcbiAqIEFuZ3VsYXIgTWVudGlvbnMuXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZG1hY2ZhcmxhbmUvYW5ndWxhci1tZW50aW9uc1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBEYW4gTWFjRmFybGFuZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtZW50aW9uLWxpc3QnLFxuICBzdHlsZVVybHM6IFsnLi9tZW50aW9uLWxpc3QuY29tcG9uZW50LmNzcyddLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdEl0ZW1UZW1wbGF0ZSBsZXQtaXRlbT1cIml0ZW1cIj5cbiAgICAgIHt7aXRlbVtsYWJlbEtleV19fVxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPHVsICNsaXN0IFtoaWRkZW5dPVwiaGlkZGVuXCIgY2xhc3M9XCJkcm9wZG93bi1tZW51IHNjcm9sbGFibGUtbWVudVwiIFtjbGFzcy5tZW50aW9uLW1lbnVdPVwiIXN0eWxlT2ZmXCI+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IGl0ZW0gb2YgaXRlbXM7IGxldCBpID0gaW5kZXhcIiBcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJhY3RpdmVJbmRleD09aVwiIFtjbGFzcy5tZW50aW9uLWFjdGl2ZV09XCIhc3R5bGVPZmYgJiYgYWN0aXZlSW5kZXg9PWlcIj5cbiAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgW2NsYXNzLm1lbnRpb24taXRlbV09XCIhc3R5bGVPZmZcIlxuICAgICAgICAgIChtb3VzZWRvd24pPVwiYWN0aXZlSW5kZXg9aTtpdGVtQ2xpY2suZW1pdCgpOyRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW1UZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7J2l0ZW0nOml0ZW19XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgTWVudGlvbkxpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBsYWJlbEtleTogc3RyaW5nID0gJ2xhYmVsJztcbiAgQElucHV0KCkgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAT3V0cHV0KCkgaXRlbUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAVmlld0NoaWxkKCdsaXN0JykgbGlzdDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnZGVmYXVsdEl0ZW1UZW1wbGF0ZScpIGRlZmF1bHRJdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIGl0ZW1zID0gW107XG4gIGFjdGl2ZUluZGV4OiBudW1iZXIgPSAwO1xuICBoaWRkZW46IGJvb2xlYW4gPSBmYWxzZTtcbiAgZHJvcFVwOiBib29sZWFuID0gZmFsc2U7XG4gIHN0eWxlT2ZmOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgY29vcmRzOiB7dG9wOm51bWJlciwgbGVmdDpudW1iZXJ9ID0ge3RvcDowLCBsZWZ0OjB9O1xuICBwcml2YXRlIG9mZnNldDogbnVtYmVyID0gMDtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pdGVtVGVtcGxhdGUpIHtcbiAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gdGhpcy5kZWZhdWx0SXRlbVRlbXBsYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGxvdHMgb2YgY29uZnVzaW9uIGhlcmUgYmV0d2VlbiByZWxhdGl2ZSBjb29yZGluYXRlcyBhbmQgY29udGFpbmVyc1xuICBwb3NpdGlvbihuYXRpdmVQYXJlbnRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50LCBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50ID0gbnVsbCkge1xuICAgIGlmIChpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQobmF0aXZlUGFyZW50RWxlbWVudCkpIHtcbiAgICAgIC8vIHBhcmVudCBlbGVtZW50cyBuZWVkIHRvIGhhdmUgcG9zdGl0aW9uOnJlbGF0aXZlIGZvciB0aGlzIHRvIHdvcmsgY29ycmVjdGx5P1xuICAgICAgdGhpcy5jb29yZHMgPSBnZXRDYXJldENvb3JkaW5hdGVzKG5hdGl2ZVBhcmVudEVsZW1lbnQsIG5hdGl2ZVBhcmVudEVsZW1lbnQuc2VsZWN0aW9uU3RhcnQsIG51bGwpO1xuICAgICAgdGhpcy5jb29yZHMudG9wID0gbmF0aXZlUGFyZW50RWxlbWVudC5vZmZzZXRUb3AgKyB0aGlzLmNvb3Jkcy50b3AgLSBuYXRpdmVQYXJlbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgIHRoaXMuY29vcmRzLmxlZnQgPSBuYXRpdmVQYXJlbnRFbGVtZW50Lm9mZnNldExlZnQgKyB0aGlzLmNvb3Jkcy5sZWZ0IC0gbmF0aXZlUGFyZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgLy8gZ2V0Q3JldENvb3JkaW5hdGVzKCkgZm9yIHRleHQvaW5wdXQgZWxlbWVudHMgbmVlZHMgYW4gYWRkaXRpb25hbCBvZmZzZXQgdG8gcG9zaXRpb24gdGhlIGxpc3QgY29ycmVjdGx5XG4gICAgICB0aGlzLm9mZnNldCA9IHRoaXMuZ2V0QmxvY2tDdXJzb3JEaW1lbnNpb25zKG5hdGl2ZVBhcmVudEVsZW1lbnQpLmhlaWdodDtcbiAgICB9XG4gICAgZWxzZSBpZiAoaWZyYW1lKSB7XG4gICAgICBsZXQgY29udGV4dDogeyBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50LCBwYXJlbnQ6IEVsZW1lbnQgfSA9IHsgaWZyYW1lOiBpZnJhbWUsIHBhcmVudDogaWZyYW1lLm9mZnNldFBhcmVudCB9O1xuICAgICAgdGhpcy5jb29yZHMgPSBnZXRDb250ZW50RWRpdGFibGVDYXJldENvb3Jkcyhjb250ZXh0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgbGV0IHNjcm9sbExlZnQgPSAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvYy5zY3JvbGxMZWZ0KSAtIChkb2MuY2xpZW50TGVmdCB8fCAwKTtcbiAgICAgIGxldCBzY3JvbGxUb3AgPSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvYy5zY3JvbGxUb3ApIC0gKGRvYy5jbGllbnRUb3AgfHwgMCk7XG4gICAgICAvLyBib3VuZGluZyByZWN0YW5nbGVzIGFyZSByZWxhdGl2ZSB0byB2aWV3LCBvZmZzZXRzIGFyZSByZWxhdGl2ZSB0byBjb250YWluZXI/XG4gICAgICBsZXQgY2FyZXRSZWxhdGl2ZVRvVmlldyA9IGdldENvbnRlbnRFZGl0YWJsZUNhcmV0Q29vcmRzKHsgaWZyYW1lOiBpZnJhbWUgfSk7XG4gICAgICBsZXQgcGFyZW50UmVsYXRpdmVUb0NvbnRhaW5lcjogQ2xpZW50UmVjdCA9IG5hdGl2ZVBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB0aGlzLmNvb3Jkcy50b3AgPSBjYXJldFJlbGF0aXZlVG9WaWV3LnRvcCAtIHBhcmVudFJlbGF0aXZlVG9Db250YWluZXIudG9wICsgbmF0aXZlUGFyZW50RWxlbWVudC5vZmZzZXRUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB0aGlzLmNvb3Jkcy5sZWZ0ID0gY2FyZXRSZWxhdGl2ZVRvVmlldy5sZWZ0IC0gcGFyZW50UmVsYXRpdmVUb0NvbnRhaW5lci5sZWZ0ICsgbmF0aXZlUGFyZW50RWxlbWVudC5vZmZzZXRMZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICB9XG4gICAgLy8gc2V0IHRoZSBkZWZhdWx0L2luaXRhbCBwb3NpdGlvblxuICAgIHRoaXMucG9zaXRpb25FbGVtZW50KCk7XG4gIH1cblxuICBnZXQgYWN0aXZlSXRlbSgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtc1t0aGlzLmFjdGl2ZUluZGV4XTtcbiAgfVxuXG4gIGFjdGl2YXRlTmV4dEl0ZW0oKSB7XG4gICAgLy8gYWRqdXN0IHNjcm9sbGFibGUtbWVudSBvZmZzZXQgaWYgdGhlIG5leHQgaXRlbSBpcyBvdXQgb2Ygdmlld1xuICAgIGxldCBsaXN0RWw6IEhUTUxFbGVtZW50ID0gdGhpcy5saXN0Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgbGV0IGFjdGl2ZUVsID0gbGlzdEVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjdGl2ZScpLml0ZW0oMCk7XG4gICAgaWYgKGFjdGl2ZUVsKSB7XG4gICAgICBsZXQgbmV4dExpRWw6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBhY3RpdmVFbC5uZXh0U2libGluZztcbiAgICAgIGlmIChuZXh0TGlFbCAmJiBuZXh0TGlFbC5ub2RlTmFtZSA9PSBcIkxJXCIpIHtcbiAgICAgICAgbGV0IG5leHRMaVJlY3Q6IENsaWVudFJlY3QgPSBuZXh0TGlFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKG5leHRMaVJlY3QuYm90dG9tID4gbGlzdEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSkge1xuICAgICAgICAgIGxpc3RFbC5zY3JvbGxUb3AgPSBuZXh0TGlFbC5vZmZzZXRUb3AgKyBuZXh0TGlSZWN0LmhlaWdodCAtIGxpc3RFbC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc2VsZWN0IHRoZSBuZXh0IGl0ZW1cbiAgICB0aGlzLmFjdGl2ZUluZGV4ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5hY3RpdmVJbmRleCArIDEsIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSksIDApO1xuICB9XG5cbiAgYWN0aXZhdGVQcmV2aW91c0l0ZW0oKSB7XG4gICAgLy8gYWRqdXN0IHRoZSBzY3JvbGxhYmxlLW1lbnUgb2Zmc2V0IGlmIHRoZSBwcmV2aW91cyBpdGVtIGlzIG91dCBvZiB2aWV3XG4gICAgbGV0IGxpc3RFbDogSFRNTEVsZW1lbnQgPSB0aGlzLmxpc3QubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgYWN0aXZlRWwgPSBsaXN0RWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWN0aXZlJykuaXRlbSgwKTtcbiAgICBpZiAoYWN0aXZlRWwpIHtcbiAgICAgIGxldCBwcmV2TGlFbDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGFjdGl2ZUVsLnByZXZpb3VzU2libGluZztcbiAgICAgIGlmIChwcmV2TGlFbCAmJiBwcmV2TGlFbC5ub2RlTmFtZSA9PSBcIkxJXCIpIHtcbiAgICAgICAgbGV0IHByZXZMaVJlY3Q6IENsaWVudFJlY3QgPSBwcmV2TGlFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKHByZXZMaVJlY3QudG9wIDwgbGlzdEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCkge1xuICAgICAgICAgIGxpc3RFbC5zY3JvbGxUb3AgPSBwcmV2TGlFbC5vZmZzZXRUb3A7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc2VsZWN0IHRoZSBwcmV2aW91cyBpdGVtXG4gICAgdGhpcy5hY3RpdmVJbmRleCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuYWN0aXZlSW5kZXggLSAxLCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpLCAwKTtcbiAgfVxuXG4gIC8vIHJlc2V0IGZvciBhIG5ldyBtZW50aW9uIHNlYXJjaFxuICByZXNldCgpIHtcbiAgICB0aGlzLmxpc3QubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgfVxuXG4gIC8vIGZpbmFsIHBvc2l0aW9uaW5nIGlzIGRvbmUgYWZ0ZXIgdGhlIGxpc3QgaXMgc2hvd24gKGFuZCB0aGUgaGVpZ2h0IGFuZCB3aWR0aCBhcmUga25vd24pXG4gIC8vIGVuc3VyZSBpdCdzIGluIHRoZSBwYWdlIGJvdW5kc1xuICBwcml2YXRlIGNoZWNrQm91bmRzKCkge1xuICAgIGxldCBsZWZ0ID0gdGhpcy5jb29yZHMubGVmdCwgdG9wID0gdGhpcy5jb29yZHMudG9wLCBkcm9wVXAgPSB0aGlzLmRyb3BVcDtcbiAgICBjb25zdCBib3VuZHM6IENsaWVudFJlY3QgPSB0aGlzLmxpc3QubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAvLyBpZiBvZmYgcmlnaHQgb2YgcGFnZSwgYWxpZ24gcmlnaHRcbiAgICBpZiAoYm91bmRzLmxlZnQrYm91bmRzLndpZHRoPndpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgICBsZWZ0ID0gKHdpbmRvdy5pbm5lcldpZHRoIC0gYm91bmRzLndpZHRoIC0gMTApO1xuICAgIH1cbiAgICAvLyBpZiBtb3JlIHRoYW4gaGFsZiBvZmYgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZSwgZm9yY2UgZHJvcFVwXG4gICAgLy8gaWYgKChib3VuZHMudG9wK2JvdW5kcy5oZWlnaHQvMik+d2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgLy8gICBkcm9wVXAgPSB0cnVlO1xuICAgIC8vIH1cbiAgICAvLyBpZiB0b3AgaXMgb2ZmIHBhZ2UsIGRpc2FibGUgZHJvcFVwXG4gICAgaWYgKGJvdW5kcy50b3A8MCkge1xuICAgICAgZHJvcFVwID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIHNldCB0aGUgcmV2aXNlZC9maW5hbCBwb3NpdGlvblxuICAgIHRoaXMucG9zaXRpb25FbGVtZW50KGxlZnQsIHRvcCwgZHJvcFVwKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9zaXRpb25FbGVtZW50KGxlZnQ6bnVtYmVyPXRoaXMuY29vcmRzLmxlZnQsIHRvcDpudW1iZXI9dGhpcy5jb29yZHMudG9wLCBkcm9wVXA6Ym9vbGVhbj10aGlzLmRyb3BVcCkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHRvcCArPSBkcm9wVXAgPyAwIDogdGhpcy5vZmZzZXQ7IC8vIHRvcCBvZiBsaXN0IGlzIG5leHQgbGluZVxuICAgIGVsLmNsYXNzTmFtZSA9IGRyb3BVcCA/ICdkcm9wdXAnIDogbnVsbDtcbiAgICBlbC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBlbC5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgZWwuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmxvY2tDdXJzb3JEaW1lbnNpb25zKG5hdGl2ZVBhcmVudEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICBjb25zdCBwYXJlbnRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXRpdmVQYXJlbnRFbGVtZW50KTtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBwYXJzZUZsb2F0KHBhcmVudFN0eWxlcy5saW5lSGVpZ2h0KSxcbiAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHBhcmVudFN0eWxlcy5mb250U2l6ZSlcbiAgICB9O1xuICB9XG59XG4iXX0=