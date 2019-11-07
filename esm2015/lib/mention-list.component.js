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
export class MentionListComponent {
    /**
     * @param {?} element
     */
    constructor(element) {
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
    ngOnInit() {
        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }
    }
    // lots of confusion here between relative coordinates and containers
    /**
     * @param {?} nativeParentElement
     * @param {?=} iframe
     * @return {?}
     */
    position(nativeParentElement, iframe = null) {
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
            let context = { iframe: iframe, parent: iframe.offsetParent };
            this.coords = getContentEditableCaretCoords(context);
        }
        else {
            /** @type {?} */
            let doc = document.documentElement;
            /** @type {?} */
            let scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            /** @type {?} */
            let scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            // bounding rectangles are relative to view, offsets are relative to container?
            /** @type {?} */
            let caretRelativeToView = getContentEditableCaretCoords({ iframe: iframe });
            /** @type {?} */
            let parentRelativeToContainer = nativeParentElement.getBoundingClientRect();
            this.coords.top = caretRelativeToView.top - parentRelativeToContainer.top + nativeParentElement.offsetTop - scrollTop;
            this.coords.left = caretRelativeToView.left - parentRelativeToContainer.left + nativeParentElement.offsetLeft - scrollLeft;
        }
        // set the default/inital position
        this.positionElement();
    }
    /**
     * @return {?}
     */
    get activeItem() {
        return this.items[this.activeIndex];
    }
    /**
     * @return {?}
     */
    activateNextItem() {
        // adjust scrollable-menu offset if the next item is out of view
        /** @type {?} */
        let listEl = this.list.nativeElement;
        /** @type {?} */
        let activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            /** @type {?} */
            let nextLiEl = (/** @type {?} */ (activeEl.nextSibling));
            if (nextLiEl && nextLiEl.nodeName == "LI") {
                /** @type {?} */
                let nextLiRect = nextLiEl.getBoundingClientRect();
                if (nextLiRect.bottom > listEl.getBoundingClientRect().bottom) {
                    listEl.scrollTop = nextLiEl.offsetTop + nextLiRect.height - listEl.clientHeight;
                }
            }
        }
        // select the next item
        this.activeIndex = Math.max(Math.min(this.activeIndex + 1, this.items.length - 1), 0);
    }
    /**
     * @return {?}
     */
    activatePreviousItem() {
        // adjust the scrollable-menu offset if the previous item is out of view
        /** @type {?} */
        let listEl = this.list.nativeElement;
        /** @type {?} */
        let activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            /** @type {?} */
            let prevLiEl = (/** @type {?} */ (activeEl.previousSibling));
            if (prevLiEl && prevLiEl.nodeName == "LI") {
                /** @type {?} */
                let prevLiRect = prevLiEl.getBoundingClientRect();
                if (prevLiRect.top < listEl.getBoundingClientRect().top) {
                    listEl.scrollTop = prevLiEl.offsetTop;
                }
            }
        }
        // select the previous item
        this.activeIndex = Math.max(Math.min(this.activeIndex - 1, this.items.length - 1), 0);
    }
    // reset for a new mention search
    /**
     * @return {?}
     */
    reset() {
        this.list.nativeElement.scrollTop = 0;
        this.checkBounds();
    }
    // final positioning is done after the list is shown (and the height and width are known)
    // ensure it's in the page bounds
    /**
     * @private
     * @return {?}
     */
    checkBounds() {
        /** @type {?} */
        let left = this.coords.left;
        /** @type {?} */
        let top = this.coords.top;
        /** @type {?} */
        let dropUp = this.dropUp;
        /** @type {?} */
        const bounds = this.list.nativeElement.getBoundingClientRect();
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
    }
    /**
     * @private
     * @param {?=} left
     * @param {?=} top
     * @param {?=} dropUp
     * @return {?}
     */
    positionElement(left = this.coords.left, top = this.coords.top, dropUp = this.dropUp) {
        /** @type {?} */
        const el = this.element.nativeElement;
        top += dropUp ? 0 : this.offset; // top of list is next line
        el.className = dropUp ? 'dropup' : null;
        el.style.position = "absolute";
        el.style.left = left + 'px';
        el.style.top = top + 'px';
    }
    /**
     * @private
     * @param {?} nativeParentElement
     * @return {?}
     */
    getBlockCursorDimensions(nativeParentElement) {
        /** @type {?} */
        const parentStyles = window.getComputedStyle(nativeParentElement);
        return {
            height: parseFloat(parentStyles.lineHeight),
            width: parseFloat(parentStyles.fontSize)
        };
    }
}
MentionListComponent.decorators = [
    { type: Component, args: [{
                selector: 'mention-list',
                template: `
    <ng-template #defaultItemTemplate let-item="item">
      {{item[labelKey]}}
    </ng-template>
    <ul #list [hidden]="hidden" class="dropdown-menu scrollable-menu" [class.mention-menu]="!styleOff">
      <li *ngFor="let item of items; let i = index" 
        [class.active]="activeIndex==i" [class.mention-active]="!styleOff && activeIndex==i">
        <a class="dropdown-item" [class.mention-item]="!styleOff"
          (mousedown)="activeIndex=i;itemClick.emit();$event.preventDefault()">
          <ng-template [ngTemplateOutlet]="itemTemplate" [ngTemplateOutletContext]="{'item':item}"></ng-template>
        </a>
      </li>
    </ul>
    `,
                styles: [".mention-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:11em;padding:.5em 0;margin:.125em 0 0;font-size:1em;color:#212529;text-align:left;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:.25em}.mention-item{display:block;padding:.2em 1.5em;line-height:1.5em;clear:both;font-weight:400;color:#212529;text-align:inherit;white-space:nowrap;background-color:transparent;border:0}.mention-active>a{color:#fff;text-decoration:none;background-color:#337ab7;outline:0}.scrollable-menu{display:block;height:auto;max-height:292px;overflow:auto}[hidden]{display:none}"]
            }] }
];
/** @nocollapse */
MentionListComponent.ctorParameters = () => [
    { type: ElementRef }
];
MentionListComponent.propDecorators = {
    labelKey: [{ type: Input }],
    itemTemplate: [{ type: Input }],
    itemClick: [{ type: Output }],
    list: [{ type: ViewChild, args: ['list',] }],
    defaultItemTemplate: [{ type: ViewChild, args: ['defaultItemTemplate',] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbWVudGlvbnMvIiwic291cmNlcyI6WyJsaWIvbWVudGlvbi1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQzNFLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzFGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7O0FBMEJyRCxNQUFNLE9BQU8sb0JBQW9COzs7O0lBYS9CLFlBQW9CLE9BQW1CO1FBQW5CLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFaOUIsYUFBUSxHQUFXLE9BQU8sQ0FBQztRQUUxQixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUd6QyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDbEIsV0FBTSxHQUE4QixFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBQyxDQUFDO1FBQ3BELFdBQU0sR0FBVyxDQUFDLENBQUM7SUFDZSxDQUFDOzs7O0lBRTNDLFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztTQUM5QztJQUNILENBQUM7Ozs7Ozs7SUFHRCxRQUFRLENBQUMsbUJBQXFDLEVBQUUsU0FBNEIsSUFBSTtRQUM5RSxJQUFJ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QztRQUMvQixFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQzs7Ozs7O0lBRU8sd0JBQXdCLENBQUMsbUJBQXFDOztjQUM5RCxZQUFZLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDO1FBQ2pFLE9BQU87WUFDTCxNQUFNLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7WUFDM0MsS0FBSyxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1NBQ3pDLENBQUM7SUFDSixDQUFDOzs7WUFuSkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUV4QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7S0FhUDs7YUFDSjs7OztZQTdCWSxVQUFVOzs7dUJBK0JwQixLQUFLOzJCQUNMLEtBQUs7d0JBQ0wsTUFBTTttQkFDTixTQUFTLFNBQUMsTUFBTTtrQ0FDaEIsU0FBUyxTQUFDLHFCQUFxQjs7OztJQUpoQyx3Q0FBb0M7O0lBQ3BDLDRDQUF3Qzs7SUFDeEMseUNBQXlDOztJQUN6QyxvQ0FBb0M7O0lBQ3BDLG1EQUF3RTs7SUFDeEUscUNBQVc7O0lBQ1gsMkNBQXdCOztJQUN4QixzQ0FBd0I7O0lBQ3hCLHNDQUF3Qjs7SUFDeEIsd0NBQTBCOzs7OztJQUMxQixzQ0FBNEQ7Ozs7O0lBQzVELHNDQUEyQjs7Ozs7SUFDZix1Q0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIElucHV0LCBUZW1wbGF0ZVJlZiwgT25Jbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQsIGdldENvbnRlbnRFZGl0YWJsZUNhcmV0Q29vcmRzIH0gZnJvbSAnLi9tZW50aW9uLXV0aWxzJztcbmltcG9ydCB7IGdldENhcmV0Q29vcmRpbmF0ZXMgfSBmcm9tICcuL2NhcmV0LWNvb3Jkcyc7XG5cbi8qKlxuICogQW5ndWxhciBNZW50aW9ucy5cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kbWFjZmFybGFuZS9hbmd1bGFyLW1lbnRpb25zXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE2IERhbiBNYWNGYXJsYW5lXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21lbnRpb24tbGlzdCcsXG4gIHN0eWxlVXJsczogWycuL21lbnRpb24tbGlzdC5jb21wb25lbnQuY3NzJ10sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0SXRlbVRlbXBsYXRlIGxldC1pdGVtPVwiaXRlbVwiPlxuICAgICAge3tpdGVtW2xhYmVsS2V5XX19XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8dWwgI2xpc3QgW2hpZGRlbl09XCJoaWRkZW5cIiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgc2Nyb2xsYWJsZS1tZW51XCIgW2NsYXNzLm1lbnRpb24tbWVudV09XCIhc3R5bGVPZmZcIj5cbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBpdGVtczsgbGV0IGkgPSBpbmRleFwiIFxuICAgICAgICBbY2xhc3MuYWN0aXZlXT1cImFjdGl2ZUluZGV4PT1pXCIgW2NsYXNzLm1lbnRpb24tYWN0aXZlXT1cIiFzdHlsZU9mZiAmJiBhY3RpdmVJbmRleD09aVwiPlxuICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBbY2xhc3MubWVudGlvbi1pdGVtXT1cIiFzdHlsZU9mZlwiXG4gICAgICAgICAgKG1vdXNlZG93bik9XCJhY3RpdmVJbmRleD1pO2l0ZW1DbGljay5lbWl0KCk7JGV2ZW50LnByZXZlbnREZWZhdWx0KClcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiaXRlbVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsnaXRlbSc6aXRlbX1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBNZW50aW9uTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGxhYmVsS2V5OiBzdHJpbmcgPSAnbGFiZWwnO1xuICBASW5wdXQoKSBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBPdXRwdXQoKSBpdGVtQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBWaWV3Q2hpbGQoJ2xpc3QnKSBsaXN0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdkZWZhdWx0SXRlbVRlbXBsYXRlJykgZGVmYXVsdEl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgaXRlbXMgPSBbXTtcbiAgYWN0aXZlSW5kZXg6IG51bWJlciA9IDA7XG4gIGhpZGRlbjogYm9vbGVhbiA9IGZhbHNlO1xuICBkcm9wVXA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgc3R5bGVPZmY6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBjb29yZHM6IHt0b3A6bnVtYmVyLCBsZWZ0Om51bWJlcn0gPSB7dG9wOjAsIGxlZnQ6MH07XG4gIHByaXZhdGUgb2Zmc2V0OiBudW1iZXIgPSAwO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLml0ZW1UZW1wbGF0ZSkge1xuICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSB0aGlzLmRlZmF1bHRJdGVtVGVtcGxhdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gbG90cyBvZiBjb25mdXNpb24gaGVyZSBiZXR3ZWVuIHJlbGF0aXZlIGNvb3JkaW5hdGVzIGFuZCBjb250YWluZXJzXG4gIHBvc2l0aW9uKG5hdGl2ZVBhcmVudEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQsIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgPSBudWxsKSB7XG4gICAgaWYgKGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChuYXRpdmVQYXJlbnRFbGVtZW50KSkge1xuICAgICAgLy8gcGFyZW50IGVsZW1lbnRzIG5lZWQgdG8gaGF2ZSBwb3N0aXRpb246cmVsYXRpdmUgZm9yIHRoaXMgdG8gd29yayBjb3JyZWN0bHk/XG4gICAgICB0aGlzLmNvb3JkcyA9IGdldENhcmV0Q29vcmRpbmF0ZXMobmF0aXZlUGFyZW50RWxlbWVudCwgbmF0aXZlUGFyZW50RWxlbWVudC5zZWxlY3Rpb25TdGFydCwgbnVsbCk7XG4gICAgICB0aGlzLmNvb3Jkcy50b3AgPSBuYXRpdmVQYXJlbnRFbGVtZW50Lm9mZnNldFRvcCArIHRoaXMuY29vcmRzLnRvcCAtIG5hdGl2ZVBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgdGhpcy5jb29yZHMubGVmdCA9IG5hdGl2ZVBhcmVudEVsZW1lbnQub2Zmc2V0TGVmdCArIHRoaXMuY29vcmRzLmxlZnQgLSBuYXRpdmVQYXJlbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgICAvLyBnZXRDcmV0Q29vcmRpbmF0ZXMoKSBmb3IgdGV4dC9pbnB1dCBlbGVtZW50cyBuZWVkcyBhbiBhZGRpdGlvbmFsIG9mZnNldCB0byBwb3NpdGlvbiB0aGUgbGlzdCBjb3JyZWN0bHlcbiAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5nZXRCbG9ja0N1cnNvckRpbWVuc2lvbnMobmF0aXZlUGFyZW50RWxlbWVudCkuaGVpZ2h0O1xuICAgIH1cbiAgICBlbHNlIGlmIChpZnJhbWUpIHtcbiAgICAgIGxldCBjb250ZXh0OiB7IGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQsIHBhcmVudDogRWxlbWVudCB9ID0geyBpZnJhbWU6IGlmcmFtZSwgcGFyZW50OiBpZnJhbWUub2Zmc2V0UGFyZW50IH07XG4gICAgICB0aGlzLmNvb3JkcyA9IGdldENvbnRlbnRFZGl0YWJsZUNhcmV0Q29vcmRzKGNvbnRleHQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICBsZXQgc2Nyb2xsTGVmdCA9ICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jLnNjcm9sbExlZnQpIC0gKGRvYy5jbGllbnRMZWZ0IHx8IDApO1xuICAgICAgbGV0IHNjcm9sbFRvcCA9ICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKTtcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3RhbmdsZXMgYXJlIHJlbGF0aXZlIHRvIHZpZXcsIG9mZnNldHMgYXJlIHJlbGF0aXZlIHRvIGNvbnRhaW5lcj9cbiAgICAgIGxldCBjYXJldFJlbGF0aXZlVG9WaWV3ID0gZ2V0Q29udGVudEVkaXRhYmxlQ2FyZXRDb29yZHMoeyBpZnJhbWU6IGlmcmFtZSB9KTtcbiAgICAgIGxldCBwYXJlbnRSZWxhdGl2ZVRvQ29udGFpbmVyOiBDbGllbnRSZWN0ID0gbmF0aXZlUGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMuY29vcmRzLnRvcCA9IGNhcmV0UmVsYXRpdmVUb1ZpZXcudG9wIC0gcGFyZW50UmVsYXRpdmVUb0NvbnRhaW5lci50b3AgKyBuYXRpdmVQYXJlbnRFbGVtZW50Lm9mZnNldFRvcCAtIHNjcm9sbFRvcDtcbiAgICAgIHRoaXMuY29vcmRzLmxlZnQgPSBjYXJldFJlbGF0aXZlVG9WaWV3LmxlZnQgLSBwYXJlbnRSZWxhdGl2ZVRvQ29udGFpbmVyLmxlZnQgKyBuYXRpdmVQYXJlbnRFbGVtZW50Lm9mZnNldExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgIH1cbiAgICAvLyBzZXQgdGhlIGRlZmF1bHQvaW5pdGFsIHBvc2l0aW9uXG4gICAgdGhpcy5wb3NpdGlvbkVsZW1lbnQoKTtcbiAgfVxuXG4gIGdldCBhY3RpdmVJdGVtKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuYWN0aXZlSW5kZXhdO1xuICB9XG5cbiAgYWN0aXZhdGVOZXh0SXRlbSgpIHtcbiAgICAvLyBhZGp1c3Qgc2Nyb2xsYWJsZS1tZW51IG9mZnNldCBpZiB0aGUgbmV4dCBpdGVtIGlzIG91dCBvZiB2aWV3XG4gICAgbGV0IGxpc3RFbDogSFRNTEVsZW1lbnQgPSB0aGlzLmxpc3QubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgYWN0aXZlRWwgPSBsaXN0RWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWN0aXZlJykuaXRlbSgwKTtcbiAgICBpZiAoYWN0aXZlRWwpIHtcbiAgICAgIGxldCBuZXh0TGlFbDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGFjdGl2ZUVsLm5leHRTaWJsaW5nO1xuICAgICAgaWYgKG5leHRMaUVsICYmIG5leHRMaUVsLm5vZGVOYW1lID09IFwiTElcIikge1xuICAgICAgICBsZXQgbmV4dExpUmVjdDogQ2xpZW50UmVjdCA9IG5leHRMaUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAobmV4dExpUmVjdC5ib3R0b20gPiBsaXN0RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tKSB7XG4gICAgICAgICAgbGlzdEVsLnNjcm9sbFRvcCA9IG5leHRMaUVsLm9mZnNldFRvcCArIG5leHRMaVJlY3QuaGVpZ2h0IC0gbGlzdEVsLmNsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBzZWxlY3QgdGhlIG5leHQgaXRlbVxuICAgIHRoaXMuYWN0aXZlSW5kZXggPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLmFjdGl2ZUluZGV4ICsgMSwgdGhpcy5pdGVtcy5sZW5ndGggLSAxKSwgMCk7XG4gIH1cblxuICBhY3RpdmF0ZVByZXZpb3VzSXRlbSgpIHtcbiAgICAvLyBhZGp1c3QgdGhlIHNjcm9sbGFibGUtbWVudSBvZmZzZXQgaWYgdGhlIHByZXZpb3VzIGl0ZW0gaXMgb3V0IG9mIHZpZXdcbiAgICBsZXQgbGlzdEVsOiBIVE1MRWxlbWVudCA9IHRoaXMubGlzdC5uYXRpdmVFbGVtZW50O1xuICAgIGxldCBhY3RpdmVFbCA9IGxpc3RFbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhY3RpdmUnKS5pdGVtKDApO1xuICAgIGlmIChhY3RpdmVFbCkge1xuICAgICAgbGV0IHByZXZMaUVsOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gYWN0aXZlRWwucHJldmlvdXNTaWJsaW5nO1xuICAgICAgaWYgKHByZXZMaUVsICYmIHByZXZMaUVsLm5vZGVOYW1lID09IFwiTElcIikge1xuICAgICAgICBsZXQgcHJldkxpUmVjdDogQ2xpZW50UmVjdCA9IHByZXZMaUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAocHJldkxpUmVjdC50b3AgPCBsaXN0RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSB7XG4gICAgICAgICAgbGlzdEVsLnNjcm9sbFRvcCA9IHByZXZMaUVsLm9mZnNldFRvcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBzZWxlY3QgdGhlIHByZXZpb3VzIGl0ZW1cbiAgICB0aGlzLmFjdGl2ZUluZGV4ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5hY3RpdmVJbmRleCAtIDEsIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSksIDApO1xuICB9XG5cbiAgLy8gcmVzZXQgZm9yIGEgbmV3IG1lbnRpb24gc2VhcmNoXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGlzdC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5jaGVja0JvdW5kcygpO1xuICB9XG5cbiAgLy8gZmluYWwgcG9zaXRpb25pbmcgaXMgZG9uZSBhZnRlciB0aGUgbGlzdCBpcyBzaG93biAoYW5kIHRoZSBoZWlnaHQgYW5kIHdpZHRoIGFyZSBrbm93bilcbiAgLy8gZW5zdXJlIGl0J3MgaW4gdGhlIHBhZ2UgYm91bmRzXG4gIHByaXZhdGUgY2hlY2tCb3VuZHMoKSB7XG4gICAgbGV0IGxlZnQgPSB0aGlzLmNvb3Jkcy5sZWZ0LCB0b3AgPSB0aGlzLmNvb3Jkcy50b3AsIGRyb3BVcCA9IHRoaXMuZHJvcFVwO1xuICAgIGNvbnN0IGJvdW5kczogQ2xpZW50UmVjdCA9IHRoaXMubGlzdC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIC8vIGlmIG9mZiByaWdodCBvZiBwYWdlLCBhbGlnbiByaWdodFxuICAgIGlmIChib3VuZHMubGVmdCtib3VuZHMud2lkdGg+d2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgIGxlZnQgPSAod2luZG93LmlubmVyV2lkdGggLSBib3VuZHMud2lkdGggLSAxMCk7XG4gICAgfVxuICAgIC8vIGlmIG1vcmUgdGhhbiBoYWxmIG9mZiB0aGUgYm90dG9tIG9mIHRoZSBwYWdlLCBmb3JjZSBkcm9wVXBcbiAgICAvLyBpZiAoKGJvdW5kcy50b3ArYm91bmRzLmhlaWdodC8yKT53aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAvLyAgIGRyb3BVcCA9IHRydWU7XG4gICAgLy8gfVxuICAgIC8vIGlmIHRvcCBpcyBvZmYgcGFnZSwgZGlzYWJsZSBkcm9wVXBcbiAgICBpZiAoYm91bmRzLnRvcDwwKSB7XG4gICAgICBkcm9wVXAgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gc2V0IHRoZSByZXZpc2VkL2ZpbmFsIHBvc2l0aW9uXG4gICAgdGhpcy5wb3NpdGlvbkVsZW1lbnQobGVmdCwgdG9wLCBkcm9wVXApO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3NpdGlvbkVsZW1lbnQobGVmdDpudW1iZXI9dGhpcy5jb29yZHMubGVmdCwgdG9wOm51bWJlcj10aGlzLmNvb3Jkcy50b3AsIGRyb3BVcDpib29sZWFuPXRoaXMuZHJvcFVwKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgdG9wICs9IGRyb3BVcCA/IDAgOiB0aGlzLm9mZnNldDsgLy8gdG9wIG9mIGxpc3QgaXMgbmV4dCBsaW5lXG4gICAgZWwuY2xhc3NOYW1lID0gZHJvcFVwID8gJ2Ryb3B1cCcgOiBudWxsO1xuICAgIGVsLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIGVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICBlbC5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCbG9ja0N1cnNvckRpbWVuc2lvbnMobmF0aXZlUGFyZW50RWxlbWVudDogSFRNTElucHV0RWxlbWVudCkge1xuICAgIGNvbnN0IHBhcmVudFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdGl2ZVBhcmVudEVsZW1lbnQpO1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IHBhcnNlRmxvYXQocGFyZW50U3R5bGVzLmxpbmVIZWlnaHQpLFxuICAgICAgd2lkdGg6IHBhcnNlRmxvYXQocGFyZW50U3R5bGVzLmZvbnRTaXplKVxuICAgIH07XG4gIH1cbn1cbiJdfQ==