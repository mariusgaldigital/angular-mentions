/**
 * @fileoverview added by tsickle
 * Generated from: lib/mention.directive.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ComponentFactoryResolver, Directive, ElementRef, TemplateRef, ViewContainerRef } from "@angular/core";
import { EventEmitter, Input, Output } from "@angular/core";
import { getCaretPosition, getValue, insertValue, setCaretPosition } from './mention-utils';
import { MentionListComponent } from './mention-list.component';
/** @type {?} */
const KEY_BACKSPACE = 8;
/** @type {?} */
const KEY_TAB = 9;
/** @type {?} */
const KEY_ENTER = 13;
/** @type {?} */
const KEY_SHIFT = 16;
/** @type {?} */
const KEY_ESCAPE = 27;
/** @type {?} */
const KEY_SPACE = 32;
/** @type {?} */
const KEY_LEFT = 37;
/** @type {?} */
const KEY_UP = 38;
/** @type {?} */
const KEY_RIGHT = 39;
/** @type {?} */
const KEY_DOWN = 40;
/** @type {?} */
const KEY_BUFFERED = 229;
/**
 * Angular Mentions.
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Copyright (c) 2017 Dan MacFarlane
 */
export class MentionDirective {
    /**
     * @param {?} _element
     * @param {?} _componentResolver
     * @param {?} _viewContainerRef
     */
    constructor(_element, _componentResolver, _viewContainerRef) {
        this._element = _element;
        this._componentResolver = _componentResolver;
        this._viewContainerRef = _viewContainerRef;
        // the provided configuration object
        this.mentionConfig = { items: [] };
        this.DEFAULT_CONFIG = {
            items: [],
            triggerChar: '@',
            labelKey: 'label',
            maxItems: -1,
            allowSpace: false,
            mentionSelect: (/**
             * @param {?} item
             * @return {?}
             */
            (item) => this.activeConfig.triggerChar + item[this.activeConfig.labelKey])
        };
        // event emitted whenever the search term changes
        this.searchTerm = new EventEmitter();
        this.triggerChars = {};
    }
    /**
     * @param {?} items
     * @return {?}
     */
    set mention(items) {
        this.mentionItems = items;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['mention'] || changes['mentionConfig']) {
            this.updateConfig();
        }
    }
    /**
     * @return {?}
     */
    updateConfig() {
        /** @type {?} */
        let config = this.mentionConfig;
        this.triggerChars = {};
        // use items from directive if they have been set
        if (this.mentionItems) {
            config.items = this.mentionItems;
        }
        this.addConfig(config);
        // nested configs
        if (config.mentions) {
            config.mentions.forEach((/**
             * @param {?} config
             * @return {?}
             */
            config => this.addConfig(config)));
        }
    }
    // add configuration for a trigger char
    /**
     * @private
     * @param {?} config
     * @return {?}
     */
    addConfig(config) {
        // defaults
        /** @type {?} */
        let defaults = Object.assign({}, this.DEFAULT_CONFIG);
        config = Object.assign(defaults, config);
        // items
        /** @type {?} */
        let items = config.items;
        if (items && items.length > 0) {
            // convert strings to objects
            if (typeof items[0] == 'string') {
                items = items.map((/**
                 * @param {?} label
                 * @return {?}
                 */
                (label) => {
                    /** @type {?} */
                    let object = {};
                    object[config.labelKey] = label;
                    return object;
                }));
            }
            // remove items without an labelKey (as it's required to filter the list)
            items = items.filter((/**
             * @param {?} e
             * @return {?}
             */
            e => e[config.labelKey]));
            if (!config.disableSort) {
                items.sort((/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                (a, b) => a[config.labelKey].localeCompare(b[config.labelKey])));
            }
        }
        config.items = items;
        // add the config
        this.triggerChars[config.triggerChar] = config;
        // for async update while menu/search is active
        if (this.activeConfig && this.activeConfig.triggerChar == config.triggerChar) {
            this.activeConfig = config;
            this.updateSearchList();
        }
    }
    /**
     * @param {?} iframe
     * @return {?}
     */
    setIframe(iframe) {
        this.iframe = iframe;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    stopEvent(event) {
        //if (event instanceof KeyboardEvent) { // does not work for iframe
        if (!event.wasClick) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    blurHandler(event) {
        this.stopEvent(event);
        this.stopSearch();
    }
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    inputHandler(event, nativeElement = this._element.nativeElement) {
        if (this.lastKeyCode === KEY_BUFFERED && event.data) {
            /** @type {?} */
            let keyCode = event.data.charCodeAt(0);
            this.keyDownHandler({ keyCode, inputEvent: true }, nativeElement);
        }
    }
    // @param nativeElement is the alternative text element in an iframe scenario
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    keyPressHandler(event, nativeElement = this._element.nativeElement) {
        this.lastKeyCode = event.keyCode;
        if (event.isComposing || event.keyCode === KEY_BUFFERED) {
            return;
        }
        /** @type {?} */
        let pos = getCaretPosition(nativeElement, this.iframe);
        /** @type {?} */
        let charPressed = this.extractCharPressed(event, pos);
        /** @type {?} */
        let config = this.triggerChars[charPressed];
        if (config) {
            this.activeConfig = config;
            this.startPos = event.inputEvent ? pos - 1 : pos;
            this.startNode = (this.iframe ? this.iframe.contentWindow.getSelection() : window.getSelection()).anchorNode;
            this.searching = true;
            this.searchString = null;
            this.showSearchList(nativeElement);
            this.updateSearchList();
        }
    }
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    keyDownHandler(event, nativeElement = this._element.nativeElement) {
        /** @type {?} */
        let val = getValue(nativeElement);
        /** @type {?} */
        let pos = getCaretPosition(nativeElement, this.iframe);
        /** @type {?} */
        let charPressed = this.extractCharPressed(event, pos);
        if (event.keyCode == KEY_ENTER && event.wasClick && pos < this.startPos) {
            // put caret back in position prior to contenteditable menu click
            pos = this.startNode.length;
            setCaretPosition(this.startNode, pos, this.iframe);
        }
        if (this.startPos >= 0 && this.searching) {
            if (pos <= this.startPos) {
                this.searchList.hidden = true;
            }
            // ignore shift when pressed alone, but not when used with another key
            else if (event.keyCode !== KEY_SHIFT &&
                !event.metaKey &&
                !event.altKey &&
                !event.ctrlKey &&
                pos > this.startPos) {
                if (!this.activeConfig.allowSpace && event.keyCode === KEY_SPACE) {
                    this.startPos = -1;
                }
                else if (event.keyCode === KEY_BACKSPACE && pos > 0) {
                    pos--;
                    if (pos == this.startPos) {
                        this.stopSearch();
                    }
                }
                else if (!this.searchList.hidden) {
                    if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
                        this.stopEvent(event);
                        /** @type {?} */
                        const text = this.activeConfig.mentionSelect(this.searchList.activeItem);
                        // value is inserted without a trailing space for consistency
                        // between element types (div and iframe do not preserve the space)
                        insertValue(nativeElement, this.startPos, pos, text, this.iframe);
                        // fire input event so angular bindings are updated
                        if ("createEvent" in document) {
                            /** @type {?} */
                            let evt = document.createEvent("HTMLEvents");
                            if (this.iframe) {
                                // a 'change' event is required to trigger tinymce updates
                                evt.initEvent("change", true, false);
                            }
                            else {
                                evt.initEvent("input", true, false);
                            }
                            // this seems backwards, but fire the event from this elements nativeElement (not the
                            // one provided that may be in an iframe, as it won't be propogate)
                            this._element.nativeElement.dispatchEvent(evt);
                        }
                        this.startPos = -1;
                        this.stopSearch();
                        return false;
                    }
                    else if (event.keyCode === KEY_ESCAPE) {
                        this.stopEvent(event);
                        this.stopSearch();
                        return false;
                    }
                    else if (event.keyCode === KEY_DOWN) {
                        this.stopEvent(event);
                        this.searchList.activateNextItem();
                        return false;
                    }
                    else if (event.keyCode === KEY_UP) {
                        this.stopEvent(event);
                        this.searchList.activatePreviousItem();
                        return false;
                    }
                }
                if (event.keyCode === KEY_LEFT || event.keyCode === KEY_RIGHT) {
                    this.stopEvent(event);
                    return false;
                }
                else if (this.searching) {
                    /** @type {?} */
                    let mention = val.substring(this.startPos + 1, pos);
                    if (event.keyCode !== KEY_BACKSPACE && !event.inputEvent) {
                        mention += charPressed;
                    }
                    this.searchString = mention;
                    this.searchTerm.emit(this.searchString);
                    this.updateSearchList();
                }
            }
        }
    }
    /**
     * @return {?}
     */
    stopSearch() {
        if (this.searchList) {
            this.searchList.hidden = true;
        }
        this.activeConfig = null;
        this.searching = false;
    }
    /**
     * @return {?}
     */
    updateSearchList() {
        /** @type {?} */
        let matches = [];
        if (this.activeConfig && this.activeConfig.items) {
            /** @type {?} */
            let objects = this.activeConfig.items;
            // disabling the search relies on the async operation to do the filtering
            if (!this.activeConfig.disableSearch && this.searchString) {
                /** @type {?} */
                let searchStringLowerCase = this.searchString.toLowerCase();
                objects = objects.filter((/**
                 * @param {?} e
                 * @return {?}
                 */
                e => e[this.activeConfig.labelKey].toLowerCase().startsWith(searchStringLowerCase)));
            }
            matches = objects;
            if (this.activeConfig.maxItems > 0) {
                matches = matches.slice(0, this.activeConfig.maxItems);
            }
        }
        // update the search list
        if (this.searchList) {
            this.searchList.items = matches;
            this.searchList.hidden = matches.length == 0;
        }
    }
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    showSearchList(nativeElement) {
        if (this.searchList == null) {
            /** @type {?} */
            let componentFactory = this._componentResolver.resolveComponentFactory(MentionListComponent);
            /** @type {?} */
            let componentRef = this._viewContainerRef.createComponent(componentFactory);
            this.searchList = componentRef.instance;
            this.searchList.itemTemplate = this.mentionListTemplate;
            componentRef.instance['itemClick'].subscribe((/**
             * @return {?}
             */
            () => {
                nativeElement.focus();
                /** @type {?} */
                let fakeKeydown = { keyCode: KEY_ENTER, wasClick: true };
                this.keyDownHandler(fakeKeydown, nativeElement);
            }));
        }
        this.searchList.labelKey = this.activeConfig.labelKey;
        this.searchList.dropUp = this.activeConfig.dropUp;
        this.searchList.styleOff = this.mentionConfig.disableStyle;
        this.searchList.activeIndex = 0;
        this.searchList.position(nativeElement, this.iframe);
        window.setTimeout((/**
         * @return {?}
         */
        () => this.searchList.reset()));
    }
    /**
     * @private
     * @param {?} event
     * @param {?} pos
     * @return {?}
     */
    extractCharPressed(event, pos) {
        /** @type {?} */
        let charPressed = event.key;
        if (!charPressed) {
            /** @type {?} */
            let charCode = event.which || event.keyCode;
            if (!event.shiftKey && (charCode >= 65 && charCode <= 90)) {
                charPressed = String.fromCharCode(charCode + 32);
            }
            else if (event.shiftKey && charCode === 2) {
                charPressed = this.DEFAULT_CONFIG.triggerChar;
            }
            else {
                // TODO (dmacfarlane) fix this for non-alpha keys
                // http://stackoverflow.com/questions/2220196/how-to-decode-character-pressed-from-jquerys-keydowns-event-handler?lq=1
                charPressed = String.fromCharCode(event.which || event.keyCode);
            }
        }
        if (event.keyCode === KEY_ENTER && event.wasClick && pos < this.startPos) {
            // put caret back in position prior to contenteditable menu click
            pos = this.startNode.length;
            setCaretPosition(this.startNode, pos, this.iframe);
        }
        // Note: FIX for Edge (Windows - latest 44.18362.387.0) - does match @ as q+alt+ctrl
        if (charPressed === 'q' && event.altKey && event.ctrlKey) {
            charPressed = "@";
        }
        return charPressed;
    }
}
MentionDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mention], [mentionConfig]',
                host: {
                    '(keydown)': 'keyDownHandler($event)',
                    '(keypress)': 'keyPressHandler($event)',
                    '(blur)': 'blurHandler($event)',
                    'autocomplete': 'off'
                }
            },] }
];
/** @nocollapse */
MentionDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef }
];
MentionDirective.propDecorators = {
    mention: [{ type: Input, args: ['mention',] }],
    mentionConfig: [{ type: Input }],
    mentionListTemplate: [{ type: Input }],
    searchTerm: [{ type: Output }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.mentionItems;
    /** @type {?} */
    MentionDirective.prototype.mentionConfig;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.activeConfig;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.DEFAULT_CONFIG;
    /** @type {?} */
    MentionDirective.prototype.mentionListTemplate;
    /** @type {?} */
    MentionDirective.prototype.searchTerm;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.triggerChars;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.searchString;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.startPos;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.startNode;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.searchList;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.searching;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.iframe;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.lastKeyCode;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype._componentResolver;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype._viewContainerRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLW1lbnRpb25zLyIsInNvdXJjZXMiOlsibGliL21lbnRpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLHdCQUF3QixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9HLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDdEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUc1RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7TUFFMUQsYUFBYSxHQUFHLENBQUM7O01BQ2pCLE9BQU8sR0FBRyxDQUFDOztNQUNYLFNBQVMsR0FBRyxFQUFFOztNQUNkLFNBQVMsR0FBRyxFQUFFOztNQUNkLFVBQVUsR0FBRyxFQUFFOztNQUNmLFNBQVMsR0FBRyxFQUFFOztNQUNkLFFBQVEsR0FBRyxFQUFFOztNQUNiLE1BQU0sR0FBRyxFQUFFOztNQUNYLFNBQVMsR0FBRyxFQUFFOztNQUNkLFFBQVEsR0FBRyxFQUFFOztNQUNiLFlBQVksR0FBRyxHQUFHOzs7Ozs7O0FBaUJ4QixNQUFNLE9BQU8sZ0JBQWdCOzs7Ozs7SUF1QzNCLFlBQ1UsUUFBb0IsRUFDcEIsa0JBQTRDLEVBQzVDLGlCQUFtQztRQUZuQyxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7UUFDNUMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjs7UUFoQ3BDLGtCQUFhLEdBQWtCLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxDQUFDO1FBSTNDLG1CQUFjLEdBQWtCO1lBQ3RDLEtBQUssRUFB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QUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDeEQsV0FBVyxHQUFHLEdBQUcsQ0FBQztTQUNuQjtRQUVELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7OztZQWxVRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsSUFBSSxFQUFFO29CQUNKLFdBQVcsRUFBRSx3QkFBd0I7b0JBQ3JDLFlBQVksRUFBRSx5QkFBeUI7b0JBQ3ZDLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLGNBQWMsRUFBRSxLQUFLO2lCQUN0QjthQUNGOzs7O1lBakM2QyxVQUFVO1lBQS9DLHdCQUF3QjtZQUFzQyxnQkFBZ0I7OztzQkF1Q3BGLEtBQUssU0FBQyxTQUFTOzRCQUtmLEtBQUs7a0NBY0wsS0FBSzt5QkFHTCxNQUFNOzs7Ozs7O0lBeEJQLHdDQUEyQjs7SUFPM0IseUNBQW1EOzs7OztJQUVuRCx3Q0FBb0M7Ozs7O0lBRXBDLDBDQU9DOztJQUdELCtDQUErQzs7SUFHL0Msc0NBQTBDOzs7OztJQUUxQyx3Q0FBdUQ7Ozs7O0lBRXZELHdDQUE2Qjs7Ozs7SUFDN0Isb0NBQXlCOzs7OztJQUN6QixxQ0FBa0I7Ozs7O0lBQ2xCLHNDQUF5Qzs7Ozs7SUFDekMscUNBQTJCOzs7OztJQUMzQixrQ0FBb0I7Ozs7O0lBQ3BCLHVDQUE0Qjs7Ozs7SUFHMUIsb0NBQTRCOzs7OztJQUM1Qiw4Q0FBb0Q7Ozs7O0lBQ3BELDZDQUEyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBnZXRDYXJldFBvc2l0aW9uLCBnZXRWYWx1ZSwgaW5zZXJ0VmFsdWUsIHNldENhcmV0UG9zaXRpb24gfSBmcm9tICcuL21lbnRpb24tdXRpbHMnO1xuXG5pbXBvcnQgeyBNZW50aW9uQ29uZmlnIH0gZnJvbSBcIi4vbWVudGlvbi1jb25maWdcIjtcbmltcG9ydCB7IE1lbnRpb25MaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9tZW50aW9uLWxpc3QuY29tcG9uZW50JztcblxuY29uc3QgS0VZX0JBQ0tTUEFDRSA9IDg7XG5jb25zdCBLRVlfVEFCID0gOTtcbmNvbnN0IEtFWV9FTlRFUiA9IDEzO1xuY29uc3QgS0VZX1NISUZUID0gMTY7XG5jb25zdCBLRVlfRVNDQVBFID0gMjc7XG5jb25zdCBLRVlfU1BBQ0UgPSAzMjtcbmNvbnN0IEtFWV9MRUZUID0gMzc7XG5jb25zdCBLRVlfVVAgPSAzODtcbmNvbnN0IEtFWV9SSUdIVCA9IDM5O1xuY29uc3QgS0VZX0RPV04gPSA0MDtcbmNvbnN0IEtFWV9CVUZGRVJFRCA9IDIyOTtcblxuLyoqXG4gKiBBbmd1bGFyIE1lbnRpb25zLlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RtYWNmYXJsYW5lL2FuZ3VsYXItbWVudGlvbnNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgRGFuIE1hY0ZhcmxhbmVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21lbnRpb25dLCBbbWVudGlvbkNvbmZpZ10nLFxuICBob3N0OiB7XG4gICAgJyhrZXlkb3duKSc6ICdrZXlEb3duSGFuZGxlcigkZXZlbnQpJyxcbiAgICAnKGtleXByZXNzKSc6ICdrZXlQcmVzc0hhbmRsZXIoJGV2ZW50KScsXG4gICAgJyhibHVyKSc6ICdibHVySGFuZGxlcigkZXZlbnQpJyxcbiAgICAnYXV0b2NvbXBsZXRlJzogJ29mZidcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNZW50aW9uRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICAvLyBzdG9yZXMgdGhlIGl0ZW1zIHBhc3NlZCB0byB0aGUgbWVudGlvbnMgZGlyZWN0aXZlIGFuZCB1c2VkIHRvIHBvcHVsYXRlIHRoZSByb290IGl0ZW1zIGluIG1lbnRpb25Db25maWdcbiAgcHJpdmF0ZSBtZW50aW9uSXRlbXM6YW55W107XG5cbiAgQElucHV0KCdtZW50aW9uJykgc2V0IG1lbnRpb24oaXRlbXM6YW55W10pIHtcbiAgICB0aGlzLm1lbnRpb25JdGVtcyA9IGl0ZW1zO1xuICB9XG5cbiAgLy8gdGhlIHByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gIEBJbnB1dCgpIG1lbnRpb25Db25maWc6IE1lbnRpb25Db25maWcgPSB7aXRlbXM6W119O1xuXG4gIHByaXZhdGUgYWN0aXZlQ29uZmlnOiBNZW50aW9uQ29uZmlnO1xuXG4gIHByaXZhdGUgREVGQVVMVF9DT05GSUc6IE1lbnRpb25Db25maWcgPSB7XG4gICAgaXRlbXM6IFtdLFxuICAgIHRyaWdnZXJDaGFyOiAnQCcsXG4gICAgbGFiZWxLZXk6ICdsYWJlbCcsXG4gICAgbWF4SXRlbXM6IC0xLFxuICAgIGFsbG93U3BhY2U6IGZhbHNlLFxuICAgIG1lbnRpb25TZWxlY3Q6IChpdGVtOiBhbnkpID0+IHRoaXMuYWN0aXZlQ29uZmlnLnRyaWdnZXJDaGFyICsgaXRlbVt0aGlzLmFjdGl2ZUNvbmZpZy5sYWJlbEtleV1cbiAgfVxuXG4gIC8vIHRlbXBsYXRlIHRvIHVzZSBmb3IgcmVuZGVyaW5nIGxpc3QgaXRlbXNcbiAgQElucHV0KCkgbWVudGlvbkxpc3RUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvLyBldmVudCBlbWl0dGVkIHdoZW5ldmVyIHRoZSBzZWFyY2ggdGVybSBjaGFuZ2VzXG4gIEBPdXRwdXQoKSBzZWFyY2hUZXJtID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgdHJpZ2dlckNoYXJzOntba2V5OnN0cmluZ106TWVudGlvbkNvbmZpZ30gPSB7fTtcblxuICBwcml2YXRlIHNlYXJjaFN0cmluZzogc3RyaW5nO1xuICBwcml2YXRlIHN0YXJ0UG9zOiBudW1iZXI7XG4gIHByaXZhdGUgc3RhcnROb2RlO1xuICBwcml2YXRlIHNlYXJjaExpc3Q6IE1lbnRpb25MaXN0Q29tcG9uZW50O1xuICBwcml2YXRlIHNlYXJjaGluZzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBpZnJhbWU6IGFueTsgLy8gb3B0aW9uYWxcbiAgcHJpdmF0ZSBsYXN0S2V5Q29kZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmXG4gICkge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ21lbnRpb24nXSB8fCBjaGFuZ2VzWydtZW50aW9uQ29uZmlnJ10pIHtcbiAgICAgIHRoaXMudXBkYXRlQ29uZmlnKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZUNvbmZpZygpIHtcbiAgICBsZXQgY29uZmlnID0gdGhpcy5tZW50aW9uQ29uZmlnO1xuICAgIHRoaXMudHJpZ2dlckNoYXJzID0ge307XG4gICAgLy8gdXNlIGl0ZW1zIGZyb20gZGlyZWN0aXZlIGlmIHRoZXkgaGF2ZSBiZWVuIHNldFxuICAgIGlmICh0aGlzLm1lbnRpb25JdGVtcykge1xuICAgICAgY29uZmlnLml0ZW1zID0gdGhpcy5tZW50aW9uSXRlbXM7XG4gICAgfVxuICAgIHRoaXMuYWRkQ29uZmlnKGNvbmZpZyk7XG4gICAgLy8gbmVzdGVkIGNvbmZpZ3NcbiAgICBpZiAoY29uZmlnLm1lbnRpb25zKSB7XG4gICAgICBjb25maWcubWVudGlvbnMuZm9yRWFjaChjb25maWc9PnRoaXMuYWRkQ29uZmlnKGNvbmZpZykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFkZCBjb25maWd1cmF0aW9uIGZvciBhIHRyaWdnZXIgY2hhclxuICBwcml2YXRlIGFkZENvbmZpZyhjb25maWc6TWVudGlvbkNvbmZpZykge1xuICAgIC8vIGRlZmF1bHRzXG4gICAgbGV0IGRlZmF1bHRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5ERUZBVUxUX0NPTkZJRyk7XG4gICAgY29uZmlnID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgY29uZmlnKTtcbiAgICAvLyBpdGVtc1xuICAgIGxldCBpdGVtcyA9IGNvbmZpZy5pdGVtcztcbiAgICBpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoPjApIHtcbiAgICAgIC8vIGNvbnZlcnQgc3RyaW5ncyB0byBvYmplY3RzXG4gICAgICBpZiAodHlwZW9mIGl0ZW1zWzBdID09ICdzdHJpbmcnKSB7XG4gICAgICAgIGl0ZW1zID0gaXRlbXMubWFwKChsYWJlbCk9PntcbiAgICAgICAgICBsZXQgb2JqZWN0ID0ge307XG4gICAgICAgICAgb2JqZWN0W2NvbmZpZy5sYWJlbEtleV0gPSBsYWJlbDtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBpdGVtcyB3aXRob3V0IGFuIGxhYmVsS2V5IChhcyBpdCdzIHJlcXVpcmVkIHRvIGZpbHRlciB0aGUgbGlzdClcbiAgICAgIGl0ZW1zID0gaXRlbXMuZmlsdGVyKGUgPT4gZVtjb25maWcubGFiZWxLZXldKTtcbiAgICAgIGlmICghY29uZmlnLmRpc2FibGVTb3J0KSB7XG4gICAgICAgIGl0ZW1zLnNvcnQoKGEsYik9PmFbY29uZmlnLmxhYmVsS2V5XS5sb2NhbGVDb21wYXJlKGJbY29uZmlnLmxhYmVsS2V5XSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25maWcuaXRlbXMgPSBpdGVtcztcblxuICAgIC8vIGFkZCB0aGUgY29uZmlnXG4gICAgdGhpcy50cmlnZ2VyQ2hhcnNbY29uZmlnLnRyaWdnZXJDaGFyXSA9IGNvbmZpZztcblxuICAgIC8vIGZvciBhc3luYyB1cGRhdGUgd2hpbGUgbWVudS9zZWFyY2ggaXMgYWN0aXZlXG4gICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnICYmIHRoaXMuYWN0aXZlQ29uZmlnLnRyaWdnZXJDaGFyPT1jb25maWcudHJpZ2dlckNoYXIpIHtcbiAgICAgIHRoaXMuYWN0aXZlQ29uZmlnID0gY29uZmlnO1xuICAgICAgdGhpcy51cGRhdGVTZWFyY2hMaXN0KCk7XG4gICAgfVxuICB9XG5cbiAgc2V0SWZyYW1lKGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICB0aGlzLmlmcmFtZSA9IGlmcmFtZTtcbiAgfVxuXG4gIHN0b3BFdmVudChldmVudDogYW55KSB7XG4gICAgLy9pZiAoZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7IC8vIGRvZXMgbm90IHdvcmsgZm9yIGlmcmFtZVxuICAgIGlmICghZXZlbnQud2FzQ2xpY2spIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIGJsdXJIYW5kbGVyKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgdGhpcy5zdG9wU2VhcmNoKCk7XG4gIH1cblxuICBpbnB1dEhhbmRsZXIoZXZlbnQ6IGFueSwgbmF0aXZlRWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmxhc3RLZXlDb2RlID09PSBLRVlfQlVGRkVSRUQgJiYgZXZlbnQuZGF0YSkge1xuICAgICAgbGV0IGtleUNvZGUgPSBldmVudC5kYXRhLmNoYXJDb2RlQXQoMCk7XG4gICAgICB0aGlzLmtleURvd25IYW5kbGVyKHsga2V5Q29kZSwgaW5wdXRFdmVudDogdHJ1ZSB9LCBuYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBAcGFyYW0gbmF0aXZlRWxlbWVudCBpcyB0aGUgYWx0ZXJuYXRpdmUgdGV4dCBlbGVtZW50IGluIGFuIGlmcmFtZSBzY2VuYXJpb1xuICBwdWJsaWMga2V5UHJlc3NIYW5kbGVyKGV2ZW50OiBhbnksIG5hdGl2ZUVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICB0aGlzLmxhc3RLZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcblxuICAgIGlmIChldmVudC5pc0NvbXBvc2luZyB8fCBldmVudC5rZXlDb2RlID09PSBLRVlfQlVGRkVSRUQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcG9zID0gZ2V0Q2FyZXRQb3NpdGlvbihuYXRpdmVFbGVtZW50LCB0aGlzLmlmcmFtZSk7XG4gICAgbGV0IGNoYXJQcmVzc2VkID0gdGhpcy5leHRyYWN0Q2hhclByZXNzZWQoZXZlbnQsIHBvcyk7XG5cbiAgICBsZXQgY29uZmlnID0gdGhpcy50cmlnZ2VyQ2hhcnNbY2hhclByZXNzZWRdO1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuYWN0aXZlQ29uZmlnID0gY29uZmlnO1xuICAgICAgdGhpcy5zdGFydFBvcyA9IGV2ZW50LmlucHV0RXZlbnQgPyBwb3MgLSAxIDogcG9zO1xuICAgICAgdGhpcy5zdGFydE5vZGUgPSAodGhpcy5pZnJhbWUgPyB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93LmdldFNlbGVjdGlvbigpIDogd2luZG93LmdldFNlbGVjdGlvbigpKS5hbmNob3JOb2RlO1xuICAgICAgdGhpcy5zZWFyY2hpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5zZWFyY2hTdHJpbmcgPSBudWxsO1xuICAgICAgdGhpcy5zaG93U2VhcmNoTGlzdChuYXRpdmVFbGVtZW50KTtcbiAgICAgIHRoaXMudXBkYXRlU2VhcmNoTGlzdCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBrZXlEb3duSGFuZGxlcihldmVudDogYW55LCBuYXRpdmVFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KSB7XG4gICAgbGV0IHZhbDogc3RyaW5nID0gZ2V0VmFsdWUobmF0aXZlRWxlbWVudCk7XG4gICAgbGV0IHBvcyA9IGdldENhcmV0UG9zaXRpb24obmF0aXZlRWxlbWVudCwgdGhpcy5pZnJhbWUpO1xuICAgIGxldCBjaGFyUHJlc3NlZCA9IHRoaXMuZXh0cmFjdENoYXJQcmVzc2VkKGV2ZW50LCBwb3MpO1xuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gS0VZX0VOVEVSICYmIGV2ZW50Lndhc0NsaWNrICYmIHBvcyA8IHRoaXMuc3RhcnRQb3MpIHtcbiAgICAgIC8vIHB1dCBjYXJldCBiYWNrIGluIHBvc2l0aW9uIHByaW9yIHRvIGNvbnRlbnRlZGl0YWJsZSBtZW51IGNsaWNrXG4gICAgICBwb3MgPSB0aGlzLnN0YXJ0Tm9kZS5sZW5ndGg7XG4gICAgICBzZXRDYXJldFBvc2l0aW9uKHRoaXMuc3RhcnROb2RlLCBwb3MsIHRoaXMuaWZyYW1lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhcnRQb3MgPj0gMCAmJiB0aGlzLnNlYXJjaGluZykge1xuICAgICAgaWYgKHBvcyA8PSB0aGlzLnN0YXJ0UG9zKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoTGlzdC5oaWRkZW4gPSB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gaWdub3JlIHNoaWZ0IHdoZW4gcHJlc3NlZCBhbG9uZSwgYnV0IG5vdCB3aGVuIHVzZWQgd2l0aCBhbm90aGVyIGtleVxuICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSAhPT0gS0VZX1NISUZUICYmXG4gICAgICAgICAgIWV2ZW50Lm1ldGFLZXkgJiZcbiAgICAgICAgICAhZXZlbnQuYWx0S2V5ICYmXG4gICAgICAgICAgIWV2ZW50LmN0cmxLZXkgJiZcbiAgICAgICAgICBwb3MgPiB0aGlzLnN0YXJ0UG9zXG4gICAgICApIHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZUNvbmZpZy5hbGxvd1NwYWNlICYmIGV2ZW50LmtleUNvZGUgPT09IEtFWV9TUEFDRSkge1xuICAgICAgICAgIHRoaXMuc3RhcnRQb3MgPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfQkFDS1NQQUNFICYmIHBvcyA+IDApIHtcbiAgICAgICAgICBwb3MtLTtcbiAgICAgICAgICBpZiAocG9zID09IHRoaXMuc3RhcnRQb3MpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFNlYXJjaCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGhpcy5zZWFyY2hMaXN0LmhpZGRlbikge1xuICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfVEFCIHx8IGV2ZW50LmtleUNvZGUgPT09IEtFWV9FTlRFUikge1xuICAgICAgICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuYWN0aXZlQ29uZmlnLm1lbnRpb25TZWxlY3QodGhpcy5zZWFyY2hMaXN0LmFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgLy8gdmFsdWUgaXMgaW5zZXJ0ZWQgd2l0aG91dCBhIHRyYWlsaW5nIHNwYWNlIGZvciBjb25zaXN0ZW5jeVxuICAgICAgICAgICAgLy8gYmV0d2VlbiBlbGVtZW50IHR5cGVzIChkaXYgYW5kIGlmcmFtZSBkbyBub3QgcHJlc2VydmUgdGhlIHNwYWNlKVxuICAgICAgICAgICAgaW5zZXJ0VmFsdWUobmF0aXZlRWxlbWVudCwgdGhpcy5zdGFydFBvcywgcG9zLCB0ZXh0LCB0aGlzLmlmcmFtZSk7XG4gICAgICAgICAgICAvLyBmaXJlIGlucHV0IGV2ZW50IHNvIGFuZ3VsYXIgYmluZGluZ3MgYXJlIHVwZGF0ZWRcbiAgICAgICAgICAgIGlmIChcImNyZWF0ZUV2ZW50XCIgaW4gZG9jdW1lbnQpIHtcbiAgICAgICAgICAgICAgbGV0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKTtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaWZyYW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gYSAnY2hhbmdlJyBldmVudCBpcyByZXF1aXJlZCB0byB0cmlnZ2VyIHRpbnltY2UgdXBkYXRlc1xuICAgICAgICAgICAgICAgIGV2dC5pbml0RXZlbnQoXCJjaGFuZ2VcIiwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGV2dC5pbml0RXZlbnQoXCJpbnB1dFwiLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gdGhpcyBzZWVtcyBiYWNrd2FyZHMsIGJ1dCBmaXJlIHRoZSBldmVudCBmcm9tIHRoaXMgZWxlbWVudHMgbmF0aXZlRWxlbWVudCAobm90IHRoZVxuICAgICAgICAgICAgICAvLyBvbmUgcHJvdmlkZWQgdGhhdCBtYXkgYmUgaW4gYW4gaWZyYW1lLCBhcyBpdCB3b24ndCBiZSBwcm9wb2dhdGUpXG4gICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UG9zID0gLTE7XG4gICAgICAgICAgICB0aGlzLnN0b3BTZWFyY2goKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX0VTQ0FQRSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5zdG9wU2VhcmNoKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWV9ET1dOKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaExpc3QuYWN0aXZhdGVOZXh0SXRlbSgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfVVApIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoTGlzdC5hY3RpdmF0ZVByZXZpb3VzSXRlbSgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfTEVGVCB8fCBldmVudC5rZXlDb2RlID09PSBLRVlfUklHSFQpIHtcbiAgICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc2VhcmNoaW5nKSB7XG4gICAgICAgICAgbGV0IG1lbnRpb24gPSB2YWwuc3Vic3RyaW5nKHRoaXMuc3RhcnRQb3MgKyAxLCBwb3MpO1xuICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlICE9PSBLRVlfQkFDS1NQQUNFICYmICFldmVudC5pbnB1dEV2ZW50KSB7XG4gICAgICAgICAgICBtZW50aW9uICs9IGNoYXJQcmVzc2VkO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNlYXJjaFN0cmluZyA9IG1lbnRpb247XG4gICAgICAgICAgdGhpcy5zZWFyY2hUZXJtLmVtaXQodGhpcy5zZWFyY2hTdHJpbmcpO1xuICAgICAgICAgIHRoaXMudXBkYXRlU2VhcmNoTGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcFNlYXJjaCgpIHtcbiAgICBpZiAodGhpcy5zZWFyY2hMaXN0KSB7XG4gICAgICB0aGlzLnNlYXJjaExpc3QuaGlkZGVuID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVDb25maWcgPSBudWxsO1xuICAgIHRoaXMuc2VhcmNoaW5nID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVTZWFyY2hMaXN0KCkge1xuICAgIGxldCBtYXRjaGVzOiBhbnlbXSA9IFtdO1xuICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZyAmJiB0aGlzLmFjdGl2ZUNvbmZpZy5pdGVtcykge1xuICAgICAgbGV0IG9iamVjdHMgPSB0aGlzLmFjdGl2ZUNvbmZpZy5pdGVtcztcbiAgICAgIC8vIGRpc2FibGluZyB0aGUgc2VhcmNoIHJlbGllcyBvbiB0aGUgYXN5bmMgb3BlcmF0aW9uIHRvIGRvIHRoZSBmaWx0ZXJpbmdcbiAgICAgIGlmICghdGhpcy5hY3RpdmVDb25maWcuZGlzYWJsZVNlYXJjaCAmJiB0aGlzLnNlYXJjaFN0cmluZykge1xuICAgICAgICBsZXQgc2VhcmNoU3RyaW5nTG93ZXJDYXNlID0gdGhpcy5zZWFyY2hTdHJpbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgb2JqZWN0cyA9IG9iamVjdHMuZmlsdGVyKGUgPT4gZVt0aGlzLmFjdGl2ZUNvbmZpZy5sYWJlbEtleV0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZ0xvd2VyQ2FzZSkpO1xuICAgICAgfVxuICAgICAgbWF0Y2hlcyA9IG9iamVjdHM7XG4gICAgICBpZiAodGhpcy5hY3RpdmVDb25maWcubWF4SXRlbXMgPiAwKSB7XG4gICAgICAgIG1hdGNoZXMgPSBtYXRjaGVzLnNsaWNlKDAsIHRoaXMuYWN0aXZlQ29uZmlnLm1heEl0ZW1zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gdXBkYXRlIHRoZSBzZWFyY2ggbGlzdFxuICAgIGlmICh0aGlzLnNlYXJjaExpc3QpIHtcbiAgICAgIHRoaXMuc2VhcmNoTGlzdC5pdGVtcyA9IG1hdGNoZXM7XG4gICAgICB0aGlzLnNlYXJjaExpc3QuaGlkZGVuID0gbWF0Y2hlcy5sZW5ndGggPT0gMDtcbiAgICB9XG4gIH1cblxuICBzaG93U2VhcmNoTGlzdChuYXRpdmVFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuc2VhcmNoTGlzdCA9PSBudWxsKSB7XG4gICAgICBsZXQgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuX2NvbXBvbmVudFJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KE1lbnRpb25MaXN0Q29tcG9uZW50KTtcbiAgICAgIGxldCBjb21wb25lbnRSZWYgPSB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICAgIHRoaXMuc2VhcmNoTGlzdCA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICAgIHRoaXMuc2VhcmNoTGlzdC5pdGVtVGVtcGxhdGUgPSB0aGlzLm1lbnRpb25MaXN0VGVtcGxhdGU7XG4gICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2VbJ2l0ZW1DbGljayddLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIG5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgbGV0IGZha2VLZXlkb3duID0geyBrZXlDb2RlOiBLRVlfRU5URVIsIHdhc0NsaWNrOiB0cnVlIH07XG4gICAgICAgIHRoaXMua2V5RG93bkhhbmRsZXIoZmFrZUtleWRvd24sIG5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuc2VhcmNoTGlzdC5sYWJlbEtleSA9IHRoaXMuYWN0aXZlQ29uZmlnLmxhYmVsS2V5O1xuICAgIHRoaXMuc2VhcmNoTGlzdC5kcm9wVXAgPSB0aGlzLmFjdGl2ZUNvbmZpZy5kcm9wVXA7XG4gICAgdGhpcy5zZWFyY2hMaXN0LnN0eWxlT2ZmID0gdGhpcy5tZW50aW9uQ29uZmlnLmRpc2FibGVTdHlsZTtcbiAgICB0aGlzLnNlYXJjaExpc3QuYWN0aXZlSW5kZXggPSAwO1xuICAgIHRoaXMuc2VhcmNoTGlzdC5wb3NpdGlvbihuYXRpdmVFbGVtZW50LCB0aGlzLmlmcmFtZSk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZWFyY2hMaXN0LnJlc2V0KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0Q2hhclByZXNzZWQoZXZlbnQ6IGFueSwgcG9zOiBhbnkpOiBzdHJpbmcge1xuICAgIGxldCBjaGFyUHJlc3NlZCA9IGV2ZW50LmtleTtcblxuICAgIGlmICghY2hhclByZXNzZWQpIHtcbiAgICAgIGxldCBjaGFyQ29kZSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgICBpZiAoIWV2ZW50LnNoaWZ0S2V5ICYmIChjaGFyQ29kZSA+PSA2NSAmJiBjaGFyQ29kZSA8PSA5MCkpIHtcbiAgICAgICAgY2hhclByZXNzZWQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJDb2RlICsgMzIpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZXZlbnQuc2hpZnRLZXkgJiYgY2hhckNvZGUgPT09IDIpIHtcbiAgICAgICAgY2hhclByZXNzZWQgPSB0aGlzLkRFRkFVTFRfQ09ORklHLnRyaWdnZXJDaGFyO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIFRPRE8gKGRtYWNmYXJsYW5lKSBmaXggdGhpcyBmb3Igbm9uLWFscGhhIGtleXNcbiAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMjIwMTk2L2hvdy10by1kZWNvZGUtY2hhcmFjdGVyLXByZXNzZWQtZnJvbS1qcXVlcnlzLWtleWRvd25zLWV2ZW50LWhhbmRsZXI/bHE9MVxuICAgICAgICBjaGFyUHJlc3NlZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfRU5URVIgJiYgZXZlbnQud2FzQ2xpY2sgJiYgcG9zIDwgdGhpcy5zdGFydFBvcykge1xuICAgICAgLy8gcHV0IGNhcmV0IGJhY2sgaW4gcG9zaXRpb24gcHJpb3IgdG8gY29udGVudGVkaXRhYmxlIG1lbnUgY2xpY2tcbiAgICAgIHBvcyA9IHRoaXMuc3RhcnROb2RlLmxlbmd0aDtcbiAgICAgIHNldENhcmV0UG9zaXRpb24odGhpcy5zdGFydE5vZGUsIHBvcywgdGhpcy5pZnJhbWUpO1xuICAgIH1cbiAgICAvLyBOb3RlOiBGSVggZm9yIEVkZ2UgKFdpbmRvd3MgLSBsYXRlc3QgNDQuMTgzNjIuMzg3LjApIC0gZG9lcyBtYXRjaCBAIGFzIHErYWx0K2N0cmxcbiAgICBpZiAoY2hhclByZXNzZWQgPT09ICdxJyAmJiBldmVudC5hbHRLZXkgJiYgZXZlbnQuY3RybEtleSkge1xuICAgICAgY2hhclByZXNzZWQgPSBcIkBcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhclByZXNzZWQ7XG4gIH1cbn1cbiJdfQ==