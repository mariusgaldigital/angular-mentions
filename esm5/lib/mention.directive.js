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
var KEY_BACKSPACE = 8;
/** @type {?} */
var KEY_TAB = 9;
/** @type {?} */
var KEY_ENTER = 13;
/** @type {?} */
var KEY_SHIFT = 16;
/** @type {?} */
var KEY_ESCAPE = 27;
/** @type {?} */
var KEY_SPACE = 32;
/** @type {?} */
var KEY_LEFT = 37;
/** @type {?} */
var KEY_UP = 38;
/** @type {?} */
var KEY_RIGHT = 39;
/** @type {?} */
var KEY_DOWN = 40;
/** @type {?} */
var KEY_BUFFERED = 229;
/**
 * Angular Mentions.
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Copyright (c) 2017 Dan MacFarlane
 */
var MentionDirective = /** @class */ (function () {
    function MentionDirective(_element, _componentResolver, _viewContainerRef) {
        var _this = this;
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
            function (item) { return _this.activeConfig.triggerChar + item[_this.activeConfig.labelKey]; })
        };
        // event emitted whenever the search term changes
        this.searchTerm = new EventEmitter();
        this.triggerChars = {};
    }
    Object.defineProperty(MentionDirective.prototype, "mention", {
        set: /**
         * @param {?} items
         * @return {?}
         */
        function (items) {
            this.mentionItems = items;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    MentionDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['mention'] || changes['mentionConfig']) {
            this.updateConfig();
        }
    };
    /**
     * @return {?}
     */
    MentionDirective.prototype.updateConfig = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var config = this.mentionConfig;
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
            function (config) { return _this.addConfig(config); }));
        }
    };
    // add configuration for a trigger char
    // add configuration for a trigger char
    /**
     * @private
     * @param {?} config
     * @return {?}
     */
    MentionDirective.prototype.addConfig = 
    // add configuration for a trigger char
    /**
     * @private
     * @param {?} config
     * @return {?}
     */
    function (config) {
        // defaults
        /** @type {?} */
        var defaults = Object.assign({}, this.DEFAULT_CONFIG);
        config = Object.assign(defaults, config);
        // items
        /** @type {?} */
        var items = config.items;
        if (items && items.length > 0) {
            // convert strings to objects
            if (typeof items[0] == 'string') {
                items = items.map((/**
                 * @param {?} label
                 * @return {?}
                 */
                function (label) {
                    /** @type {?} */
                    var object = {};
                    object[config.labelKey] = label;
                    return object;
                }));
            }
            // remove items without an labelKey (as it's required to filter the list)
            items = items.filter((/**
             * @param {?} e
             * @return {?}
             */
            function (e) { return e[config.labelKey]; }));
            if (!config.disableSort) {
                items.sort((/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                function (a, b) { return a[config.labelKey].localeCompare(b[config.labelKey]); }));
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
    };
    /**
     * @param {?} iframe
     * @return {?}
     */
    MentionDirective.prototype.setIframe = /**
     * @param {?} iframe
     * @return {?}
     */
    function (iframe) {
        this.iframe = iframe;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MentionDirective.prototype.stopEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        //if (event instanceof KeyboardEvent) { // does not work for iframe
        if (!event.wasClick) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MentionDirective.prototype.blurHandler = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.stopEvent(event);
        this.stopSearch();
    };
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    MentionDirective.prototype.inputHandler = /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    function (event, nativeElement) {
        if (nativeElement === void 0) { nativeElement = this._element.nativeElement; }
        if (this.lastKeyCode === KEY_BUFFERED && event.data) {
            /** @type {?} */
            var keyCode = event.data.charCodeAt(0);
            this.keyDownHandler({ keyCode: keyCode, inputEvent: true }, nativeElement);
        }
    };
    // @param nativeElement is the alternative text element in an iframe scenario
    // @param nativeElement is the alternative text element in an iframe scenario
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    MentionDirective.prototype.keyPressHandler = 
    // @param nativeElement is the alternative text element in an iframe scenario
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    function (event, nativeElement) {
        if (nativeElement === void 0) { nativeElement = this._element.nativeElement; }
        this.lastKeyCode = event.keyCode;
        if (event.isComposing || event.keyCode === KEY_BUFFERED) {
            return;
        }
        /** @type {?} */
        var pos = getCaretPosition(nativeElement, this.iframe);
        /** @type {?} */
        var charPressed = this.extractCharPressed(event, pos);
        /** @type {?} */
        var config = this.triggerChars[charPressed];
        if (config) {
            this.activeConfig = config;
            this.startPos = event.inputEvent ? pos - 1 : pos;
            this.startNode = (this.iframe ? this.iframe.contentWindow.getSelection() : window.getSelection()).anchorNode;
            this.searching = true;
            this.searchString = null;
            this.showSearchList(nativeElement);
            this.updateSearchList();
        }
    };
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    MentionDirective.prototype.keyDownHandler = /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    function (event, nativeElement) {
        if (nativeElement === void 0) { nativeElement = this._element.nativeElement; }
        /** @type {?} */
        var val = getValue(nativeElement);
        /** @type {?} */
        var pos = getCaretPosition(nativeElement, this.iframe);
        /** @type {?} */
        var charPressed = this.extractCharPressed(event, pos);
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
                        var text = this.activeConfig.mentionSelect(this.searchList.activeItem);
                        // value is inserted without a trailing space for consistency
                        // between element types (div and iframe do not preserve the space)
                        insertValue(nativeElement, this.startPos, pos, text, this.iframe);
                        // fire input event so angular bindings are updated
                        if ("createEvent" in document) {
                            /** @type {?} */
                            var evt = document.createEvent("HTMLEvents");
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
                    var mention = val.substring(this.startPos + 1, pos);
                    if (event.keyCode !== KEY_BACKSPACE && !event.inputEvent) {
                        mention += charPressed;
                    }
                    this.searchString = mention;
                    this.searchTerm.emit(this.searchString);
                    this.updateSearchList();
                }
            }
        }
    };
    /**
     * @return {?}
     */
    MentionDirective.prototype.stopSearch = /**
     * @return {?}
     */
    function () {
        if (this.searchList) {
            this.searchList.hidden = true;
        }
        this.activeConfig = null;
        this.searching = false;
    };
    /**
     * @return {?}
     */
    MentionDirective.prototype.updateSearchList = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var matches = [];
        if (this.activeConfig && this.activeConfig.items) {
            /** @type {?} */
            var objects = this.activeConfig.items;
            // disabling the search relies on the async operation to do the filtering
            if (!this.activeConfig.disableSearch && this.searchString) {
                /** @type {?} */
                var searchStringLowerCase_1 = this.searchString.toLowerCase();
                objects = objects.filter((/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) { return e[_this.activeConfig.labelKey].toLowerCase().startsWith(searchStringLowerCase_1); }));
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
    };
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    MentionDirective.prototype.showSearchList = /**
     * @param {?} nativeElement
     * @return {?}
     */
    function (nativeElement) {
        var _this = this;
        if (this.searchList == null) {
            /** @type {?} */
            var componentFactory = this._componentResolver.resolveComponentFactory(MentionListComponent);
            /** @type {?} */
            var componentRef = this._viewContainerRef.createComponent(componentFactory);
            this.searchList = componentRef.instance;
            this.searchList.itemTemplate = this.mentionListTemplate;
            componentRef.instance['itemClick'].subscribe((/**
             * @return {?}
             */
            function () {
                nativeElement.focus();
                /** @type {?} */
                var fakeKeydown = { keyCode: KEY_ENTER, wasClick: true };
                _this.keyDownHandler(fakeKeydown, nativeElement);
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
        function () { return _this.searchList.reset(); }));
    };
    /**
     * @private
     * @param {?} event
     * @param {?} pos
     * @return {?}
     */
    MentionDirective.prototype.extractCharPressed = /**
     * @private
     * @param {?} event
     * @param {?} pos
     * @return {?}
     */
    function (event, pos) {
        /** @type {?} */
        var charPressed = event.key;
        if (!charPressed) {
            /** @type {?} */
            var charCode = event.which || event.keyCode;
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
    };
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
    MentionDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ComponentFactoryResolver },
        { type: ViewContainerRef }
    ]; };
    MentionDirective.propDecorators = {
        mention: [{ type: Input, args: ['mention',] }],
        mentionConfig: [{ type: Input }],
        mentionListTemplate: [{ type: Input }],
        searchTerm: [{ type: Output }]
    };
    return MentionDirective;
}());
export { MentionDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLW1lbnRpb25zLyIsInNvdXJjZXMiOlsibGliL21lbnRpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLHdCQUF3QixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9HLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDdEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUc1RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7SUFFMUQsYUFBYSxHQUFHLENBQUM7O0lBQ2pCLE9BQU8sR0FBRyxDQUFDOztJQUNYLFNBQVMsR0FBRyxFQUFFOztJQUNkLFNBQVMsR0FBRyxFQUFFOztJQUNkLFVBQVUsR0FBRyxFQUFFOztJQUNmLFNBQVMsR0FBRyxFQUFFOztJQUNkLFFBQVEsR0FBRyxFQUFFOztJQUNiLE1BQU0sR0FBRyxFQUFFOztJQUNYLFNBQVMsR0FBRyxFQUFFOztJQUNkLFFBQVEsR0FBRyxFQUFFOztJQUNiLFlBQVksR0FBRyxHQUFHOzs7Ozs7O0FBUXhCO0lBZ0RFLDBCQUNVLFFBQW9CLEVBQ3BCLGtCQUE0QyxFQUM1QyxpQkFBbUM7UUFIN0MsaUJBSUk7UUFITSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7UUFDNUMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjs7UUFoQ3BDLGtCQUFhLEdBQWtCLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxDQUFDO1FBSTNDLG1CQUFjLEdBQWtCO1lBQ3RDLEtBQUssRUFBRSxFQUFFO1lBQ1Qs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QyxxQ0FBMkI7Ozs7O0lBQzNCLGtDQUFvQjs7Ozs7SUFDcEIsdUNBQTRCOzs7OztJQUcxQixvQ0FBNEI7Ozs7O0lBQzVCLDhDQUFvRDs7Ozs7SUFDcEQsNkNBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uQ2hhbmdlcywgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IGdldENhcmV0UG9zaXRpb24sIGdldFZhbHVlLCBpbnNlcnRWYWx1ZSwgc2V0Q2FyZXRQb3NpdGlvbiB9IGZyb20gJy4vbWVudGlvbi11dGlscyc7XG5cbmltcG9ydCB7IE1lbnRpb25Db25maWcgfSBmcm9tIFwiLi9tZW50aW9uLWNvbmZpZ1wiO1xuaW1wb3J0IHsgTWVudGlvbkxpc3RDb21wb25lbnQgfSBmcm9tICcuL21lbnRpb24tbGlzdC5jb21wb25lbnQnO1xuXG5jb25zdCBLRVlfQkFDS1NQQUNFID0gODtcbmNvbnN0IEtFWV9UQUIgPSA5O1xuY29uc3QgS0VZX0VOVEVSID0gMTM7XG5jb25zdCBLRVlfU0hJRlQgPSAxNjtcbmNvbnN0IEtFWV9FU0NBUEUgPSAyNztcbmNvbnN0IEtFWV9TUEFDRSA9IDMyO1xuY29uc3QgS0VZX0xFRlQgPSAzNztcbmNvbnN0IEtFWV9VUCA9IDM4O1xuY29uc3QgS0VZX1JJR0hUID0gMzk7XG5jb25zdCBLRVlfRE9XTiA9IDQwO1xuY29uc3QgS0VZX0JVRkZFUkVEID0gMjI5O1xuXG4vKipcbiAqIEFuZ3VsYXIgTWVudGlvbnMuXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZG1hY2ZhcmxhbmUvYW5ndWxhci1tZW50aW9uc1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBEYW4gTWFjRmFybGFuZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWVudGlvbl0sIFttZW50aW9uQ29uZmlnXScsXG4gIGhvc3Q6IHtcbiAgICAnKGtleWRvd24pJzogJ2tleURvd25IYW5kbGVyKCRldmVudCknLFxuICAgICcoa2V5cHJlc3MpJzogJ2tleVByZXNzSGFuZGxlcigkZXZlbnQpJyxcbiAgICAnKGJsdXIpJzogJ2JsdXJIYW5kbGVyKCRldmVudCknLFxuICAgICdhdXRvY29tcGxldGUnOiAnb2ZmJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1lbnRpb25EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gIC8vIHN0b3JlcyB0aGUgaXRlbXMgcGFzc2VkIHRvIHRoZSBtZW50aW9ucyBkaXJlY3RpdmUgYW5kIHVzZWQgdG8gcG9wdWxhdGUgdGhlIHJvb3QgaXRlbXMgaW4gbWVudGlvbkNvbmZpZ1xuICBwcml2YXRlIG1lbnRpb25JdGVtczphbnlbXTtcblxuICBASW5wdXQoJ21lbnRpb24nKSBzZXQgbWVudGlvbihpdGVtczphbnlbXSkge1xuICAgIHRoaXMubWVudGlvbkl0ZW1zID0gaXRlbXM7XG4gIH1cblxuICAvLyB0aGUgcHJvdmlkZWQgY29uZmlndXJhdGlvbiBvYmplY3RcbiAgQElucHV0KCkgbWVudGlvbkNvbmZpZzogTWVudGlvbkNvbmZpZyA9IHtpdGVtczpbXX07XG5cbiAgcHJpdmF0ZSBhY3RpdmVDb25maWc6IE1lbnRpb25Db25maWc7XG5cbiAgcHJpdmF0ZSBERUZBVUxUX0NPTkZJRzogTWVudGlvbkNvbmZpZyA9IHtcbiAgICBpdGVtczogW10sXG4gICAgdHJpZ2dlckNoYXI6ICdAJyxcbiAgICBsYWJlbEtleTogJ2xhYmVsJyxcbiAgICBtYXhJdGVtczogLTEsXG4gICAgYWxsb3dTcGFjZTogZmFsc2UsXG4gICAgbWVudGlvblNlbGVjdDogKGl0ZW06IGFueSkgPT4gdGhpcy5hY3RpdmVDb25maWcudHJpZ2dlckNoYXIgKyBpdGVtW3RoaXMuYWN0aXZlQ29uZmlnLmxhYmVsS2V5XVxuICB9XG5cbiAgLy8gdGVtcGxhdGUgdG8gdXNlIGZvciByZW5kZXJpbmcgbGlzdCBpdGVtc1xuICBASW5wdXQoKSBtZW50aW9uTGlzdFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8vIGV2ZW50IGVtaXR0ZWQgd2hlbmV2ZXIgdGhlIHNlYXJjaCB0ZXJtIGNoYW5nZXNcbiAgQE91dHB1dCgpIHNlYXJjaFRlcm0gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyQ2hhcnM6e1trZXk6c3RyaW5nXTpNZW50aW9uQ29uZmlnfSA9IHt9O1xuXG4gIHByaXZhdGUgc2VhcmNoU3RyaW5nOiBzdHJpbmc7XG4gIHByaXZhdGUgc3RhcnRQb3M6IG51bWJlcjtcbiAgcHJpdmF0ZSBzdGFydE5vZGU7XG4gIHByaXZhdGUgc2VhcmNoTGlzdDogTWVudGlvbkxpc3RDb21wb25lbnQ7XG4gIHByaXZhdGUgc2VhcmNoaW5nOiBib29sZWFuO1xuICBwcml2YXRlIGlmcmFtZTogYW55OyAvLyBvcHRpb25hbFxuICBwcml2YXRlIGxhc3RLZXlDb2RlOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9jb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWZcbiAgKSB7fVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1snbWVudGlvbiddIHx8IGNoYW5nZXNbJ21lbnRpb25Db25maWcnXSkge1xuICAgICAgdGhpcy51cGRhdGVDb25maWcoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlQ29uZmlnKCkge1xuICAgIGxldCBjb25maWcgPSB0aGlzLm1lbnRpb25Db25maWc7XG4gICAgdGhpcy50cmlnZ2VyQ2hhcnMgPSB7fTtcbiAgICAvLyB1c2UgaXRlbXMgZnJvbSBkaXJlY3RpdmUgaWYgdGhleSBoYXZlIGJlZW4gc2V0XG4gICAgaWYgKHRoaXMubWVudGlvbkl0ZW1zKSB7XG4gICAgICBjb25maWcuaXRlbXMgPSB0aGlzLm1lbnRpb25JdGVtcztcbiAgICB9XG4gICAgdGhpcy5hZGRDb25maWcoY29uZmlnKTtcbiAgICAvLyBuZXN0ZWQgY29uZmlnc1xuICAgIGlmIChjb25maWcubWVudGlvbnMpIHtcbiAgICAgIGNvbmZpZy5tZW50aW9ucy5mb3JFYWNoKGNvbmZpZz0+dGhpcy5hZGRDb25maWcoY29uZmlnKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYWRkIGNvbmZpZ3VyYXRpb24gZm9yIGEgdHJpZ2dlciBjaGFyXG4gIHByaXZhdGUgYWRkQ29uZmlnKGNvbmZpZzpNZW50aW9uQ29uZmlnKSB7XG4gICAgLy8gZGVmYXVsdHNcbiAgICBsZXQgZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLkRFRkFVTFRfQ09ORklHKTtcbiAgICBjb25maWcgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBjb25maWcpO1xuICAgIC8vIGl0ZW1zXG4gICAgbGV0IGl0ZW1zID0gY29uZmlnLml0ZW1zO1xuICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGg+MCkge1xuICAgICAgLy8gY29udmVydCBzdHJpbmdzIHRvIG9iamVjdHNcbiAgICAgIGlmICh0eXBlb2YgaXRlbXNbMF0gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgaXRlbXMgPSBpdGVtcy5tYXAoKGxhYmVsKT0+e1xuICAgICAgICAgIGxldCBvYmplY3QgPSB7fTtcbiAgICAgICAgICBvYmplY3RbY29uZmlnLmxhYmVsS2V5XSA9IGxhYmVsO1xuICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gcmVtb3ZlIGl0ZW1zIHdpdGhvdXQgYW4gbGFiZWxLZXkgKGFzIGl0J3MgcmVxdWlyZWQgdG8gZmlsdGVyIHRoZSBsaXN0KVxuICAgICAgaXRlbXMgPSBpdGVtcy5maWx0ZXIoZSA9PiBlW2NvbmZpZy5sYWJlbEtleV0pO1xuICAgICAgaWYgKCFjb25maWcuZGlzYWJsZVNvcnQpIHtcbiAgICAgICAgaXRlbXMuc29ydCgoYSxiKT0+YVtjb25maWcubGFiZWxLZXldLmxvY2FsZUNvbXBhcmUoYltjb25maWcubGFiZWxLZXldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbmZpZy5pdGVtcyA9IGl0ZW1zO1xuXG4gICAgLy8gYWRkIHRoZSBjb25maWdcbiAgICB0aGlzLnRyaWdnZXJDaGFyc1tjb25maWcudHJpZ2dlckNoYXJdID0gY29uZmlnO1xuXG4gICAgLy8gZm9yIGFzeW5jIHVwZGF0ZSB3aGlsZSBtZW51L3NlYXJjaCBpcyBhY3RpdmVcbiAgICBpZiAodGhpcy5hY3RpdmVDb25maWcgJiYgdGhpcy5hY3RpdmVDb25maWcudHJpZ2dlckNoYXI9PWNvbmZpZy50cmlnZ2VyQ2hhcikge1xuICAgICAgdGhpcy5hY3RpdmVDb25maWcgPSBjb25maWc7XG4gICAgICB0aGlzLnVwZGF0ZVNlYXJjaExpc3QoKTtcbiAgICB9XG4gIH1cblxuICBzZXRJZnJhbWUoaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCkge1xuICAgIHRoaXMuaWZyYW1lID0gaWZyYW1lO1xuICB9XG5cbiAgc3RvcEV2ZW50KGV2ZW50OiBhbnkpIHtcbiAgICAvL2lmIChldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHsgLy8gZG9lcyBub3Qgd29yayBmb3IgaWZyYW1lXG4gICAgaWYgKCFldmVudC53YXNDbGljaykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgYmx1ckhhbmRsZXIoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcbiAgICB0aGlzLnN0b3BTZWFyY2goKTtcbiAgfVxuXG4gIGlucHV0SGFuZGxlcihldmVudDogYW55LCBuYXRpdmVFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMubGFzdEtleUNvZGUgPT09IEtFWV9CVUZGRVJFRCAmJiBldmVudC5kYXRhKSB7XG4gICAgICBsZXQga2V5Q29kZSA9IGV2ZW50LmRhdGEuY2hhckNvZGVBdCgwKTtcbiAgICAgIHRoaXMua2V5RG93bkhhbmRsZXIoeyBrZXlDb2RlLCBpbnB1dEV2ZW50OiB0cnVlIH0sIG5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEBwYXJhbSBuYXRpdmVFbGVtZW50IGlzIHRoZSBhbHRlcm5hdGl2ZSB0ZXh0IGVsZW1lbnQgaW4gYW4gaWZyYW1lIHNjZW5hcmlvXG4gIHB1YmxpYyBrZXlQcmVzc0hhbmRsZXIoZXZlbnQ6IGFueSwgbmF0aXZlRWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkge1xuICAgIHRoaXMubGFzdEtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgaWYgKGV2ZW50LmlzQ29tcG9zaW5nIHx8IGV2ZW50LmtleUNvZGUgPT09IEtFWV9CVUZGRVJFRCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwb3MgPSBnZXRDYXJldFBvc2l0aW9uKG5hdGl2ZUVsZW1lbnQsIHRoaXMuaWZyYW1lKTtcbiAgICBsZXQgY2hhclByZXNzZWQgPSB0aGlzLmV4dHJhY3RDaGFyUHJlc3NlZChldmVudCwgcG9zKTtcblxuICAgIGxldCBjb25maWcgPSB0aGlzLnRyaWdnZXJDaGFyc1tjaGFyUHJlc3NlZF07XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgdGhpcy5hY3RpdmVDb25maWcgPSBjb25maWc7XG4gICAgICB0aGlzLnN0YXJ0UG9zID0gZXZlbnQuaW5wdXRFdmVudCA/IHBvcyAtIDEgOiBwb3M7XG4gICAgICB0aGlzLnN0YXJ0Tm9kZSA9ICh0aGlzLmlmcmFtZSA/IHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKCkgOiB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkpLmFuY2hvck5vZGU7XG4gICAgICB0aGlzLnNlYXJjaGluZyA9IHRydWU7XG4gICAgICB0aGlzLnNlYXJjaFN0cmluZyA9IG51bGw7XG4gICAgICB0aGlzLnNob3dTZWFyY2hMaXN0KG5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy51cGRhdGVTZWFyY2hMaXN0KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGtleURvd25IYW5kbGVyKGV2ZW50OiBhbnksIG5hdGl2ZUVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICBsZXQgdmFsOiBzdHJpbmcgPSBnZXRWYWx1ZShuYXRpdmVFbGVtZW50KTtcbiAgICBsZXQgcG9zID0gZ2V0Q2FyZXRQb3NpdGlvbihuYXRpdmVFbGVtZW50LCB0aGlzLmlmcmFtZSk7XG4gICAgbGV0IGNoYXJQcmVzc2VkID0gdGhpcy5leHRyYWN0Q2hhclByZXNzZWQoZXZlbnQsIHBvcyk7XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSBLRVlfRU5URVIgJiYgZXZlbnQud2FzQ2xpY2sgJiYgcG9zIDwgdGhpcy5zdGFydFBvcykge1xuICAgICAgLy8gcHV0IGNhcmV0IGJhY2sgaW4gcG9zaXRpb24gcHJpb3IgdG8gY29udGVudGVkaXRhYmxlIG1lbnUgY2xpY2tcbiAgICAgIHBvcyA9IHRoaXMuc3RhcnROb2RlLmxlbmd0aDtcbiAgICAgIHNldENhcmV0UG9zaXRpb24odGhpcy5zdGFydE5vZGUsIHBvcywgdGhpcy5pZnJhbWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zdGFydFBvcyA+PSAwICYmIHRoaXMuc2VhcmNoaW5nKSB7XG4gICAgICBpZiAocG9zIDw9IHRoaXMuc3RhcnRQb3MpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hMaXN0LmhpZGRlbiA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBpZ25vcmUgc2hpZnQgd2hlbiBwcmVzc2VkIGFsb25lLCBidXQgbm90IHdoZW4gdXNlZCB3aXRoIGFub3RoZXIga2V5XG4gICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlICE9PSBLRVlfU0hJRlQgJiZcbiAgICAgICAgICAhZXZlbnQubWV0YUtleSAmJlxuICAgICAgICAgICFldmVudC5hbHRLZXkgJiZcbiAgICAgICAgICAhZXZlbnQuY3RybEtleSAmJlxuICAgICAgICAgIHBvcyA+IHRoaXMuc3RhcnRQb3NcbiAgICAgICkge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlQ29uZmlnLmFsbG93U3BhY2UgJiYgZXZlbnQua2V5Q29kZSA9PT0gS0VZX1NQQUNFKSB7XG4gICAgICAgICAgdGhpcy5zdGFydFBvcyA9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWV9CQUNLU1BBQ0UgJiYgcG9zID4gMCkge1xuICAgICAgICAgIHBvcy0tO1xuICAgICAgICAgIGlmIChwb3MgPT0gdGhpcy5zdGFydFBvcykge1xuICAgICAgICAgICAgdGhpcy5zdG9wU2VhcmNoKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLnNlYXJjaExpc3QuaGlkZGVuKSB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWV9UQUIgfHwgZXZlbnQua2V5Q29kZSA9PT0gS0VZX0VOVEVSKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5hY3RpdmVDb25maWcubWVudGlvblNlbGVjdCh0aGlzLnNlYXJjaExpc3QuYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAvLyB2YWx1ZSBpcyBpbnNlcnRlZCB3aXRob3V0IGEgdHJhaWxpbmcgc3BhY2UgZm9yIGNvbnNpc3RlbmN5XG4gICAgICAgICAgICAvLyBiZXR3ZWVuIGVsZW1lbnQgdHlwZXMgKGRpdiBhbmQgaWZyYW1lIGRvIG5vdCBwcmVzZXJ2ZSB0aGUgc3BhY2UpXG4gICAgICAgICAgICBpbnNlcnRWYWx1ZShuYXRpdmVFbGVtZW50LCB0aGlzLnN0YXJ0UG9zLCBwb3MsIHRleHQsIHRoaXMuaWZyYW1lKTtcbiAgICAgICAgICAgIC8vIGZpcmUgaW5wdXQgZXZlbnQgc28gYW5ndWxhciBiaW5kaW5ncyBhcmUgdXBkYXRlZFxuICAgICAgICAgICAgaWYgKFwiY3JlYXRlRXZlbnRcIiBpbiBkb2N1bWVudCkge1xuICAgICAgICAgICAgICBsZXQgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJIVE1MRXZlbnRzXCIpO1xuICAgICAgICAgICAgICBpZiAodGhpcy5pZnJhbWUpIHtcbiAgICAgICAgICAgICAgICAvLyBhICdjaGFuZ2UnIGV2ZW50IGlzIHJlcXVpcmVkIHRvIHRyaWdnZXIgdGlueW1jZSB1cGRhdGVzXG4gICAgICAgICAgICAgICAgZXZ0LmluaXRFdmVudChcImNoYW5nZVwiLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZXZ0LmluaXRFdmVudChcImlucHV0XCIsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyB0aGlzIHNlZW1zIGJhY2t3YXJkcywgYnV0IGZpcmUgdGhlIGV2ZW50IGZyb20gdGhpcyBlbGVtZW50cyBuYXRpdmVFbGVtZW50IChub3QgdGhlXG4gICAgICAgICAgICAgIC8vIG9uZSBwcm92aWRlZCB0aGF0IG1heSBiZSBpbiBhbiBpZnJhbWUsIGFzIGl0IHdvbid0IGJlIHByb3BvZ2F0ZSlcbiAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhcnRQb3MgPSAtMTtcbiAgICAgICAgICAgIHRoaXMuc3RvcFNlYXJjaCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfRVNDQVBFKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgICAgICB0aGlzLnN0b3BTZWFyY2goKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX0RPV04pIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoTGlzdC5hY3RpdmF0ZU5leHRJdGVtKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWV9VUCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hMaXN0LmFjdGl2YXRlUHJldmlvdXNJdGVtKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWV9MRUZUIHx8IGV2ZW50LmtleUNvZGUgPT09IEtFWV9SSUdIVCkge1xuICAgICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zZWFyY2hpbmcpIHtcbiAgICAgICAgICBsZXQgbWVudGlvbiA9IHZhbC5zdWJzdHJpbmcodGhpcy5zdGFydFBvcyArIDEsIHBvcyk7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgIT09IEtFWV9CQUNLU1BBQ0UgJiYgIWV2ZW50LmlucHV0RXZlbnQpIHtcbiAgICAgICAgICAgIG1lbnRpb24gKz0gY2hhclByZXNzZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2VhcmNoU3RyaW5nID0gbWVudGlvbjtcbiAgICAgICAgICB0aGlzLnNlYXJjaFRlcm0uZW1pdCh0aGlzLnNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgdGhpcy51cGRhdGVTZWFyY2hMaXN0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdG9wU2VhcmNoKCkge1xuICAgIGlmICh0aGlzLnNlYXJjaExpc3QpIHtcbiAgICAgIHRoaXMuc2VhcmNoTGlzdC5oaWRkZW4gPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZUNvbmZpZyA9IG51bGw7XG4gICAgdGhpcy5zZWFyY2hpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHVwZGF0ZVNlYXJjaExpc3QoKSB7XG4gICAgbGV0IG1hdGNoZXM6IGFueVtdID0gW107XG4gICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnICYmIHRoaXMuYWN0aXZlQ29uZmlnLml0ZW1zKSB7XG4gICAgICBsZXQgb2JqZWN0cyA9IHRoaXMuYWN0aXZlQ29uZmlnLml0ZW1zO1xuICAgICAgLy8gZGlzYWJsaW5nIHRoZSBzZWFyY2ggcmVsaWVzIG9uIHRoZSBhc3luYyBvcGVyYXRpb24gdG8gZG8gdGhlIGZpbHRlcmluZ1xuICAgICAgaWYgKCF0aGlzLmFjdGl2ZUNvbmZpZy5kaXNhYmxlU2VhcmNoICYmIHRoaXMuc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgIGxldCBzZWFyY2hTdHJpbmdMb3dlckNhc2UgPSB0aGlzLnNlYXJjaFN0cmluZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBvYmplY3RzID0gb2JqZWN0cy5maWx0ZXIoZSA9PiBlW3RoaXMuYWN0aXZlQ29uZmlnLmxhYmVsS2V5XS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nTG93ZXJDYXNlKSk7XG4gICAgICB9XG4gICAgICBtYXRjaGVzID0gb2JqZWN0cztcbiAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZy5tYXhJdGVtcyA+IDApIHtcbiAgICAgICAgbWF0Y2hlcyA9IG1hdGNoZXMuc2xpY2UoMCwgdGhpcy5hY3RpdmVDb25maWcubWF4SXRlbXMpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB1cGRhdGUgdGhlIHNlYXJjaCBsaXN0XG4gICAgaWYgKHRoaXMuc2VhcmNoTGlzdCkge1xuICAgICAgdGhpcy5zZWFyY2hMaXN0Lml0ZW1zID0gbWF0Y2hlcztcbiAgICAgIHRoaXMuc2VhcmNoTGlzdC5oaWRkZW4gPSBtYXRjaGVzLmxlbmd0aCA9PSAwO1xuICAgIH1cbiAgfVxuXG4gIHNob3dTZWFyY2hMaXN0KG5hdGl2ZUVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5zZWFyY2hMaXN0ID09IG51bGwpIHtcbiAgICAgIGxldCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5fY29tcG9uZW50UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoTWVudGlvbkxpc3RDb21wb25lbnQpO1xuICAgICAgbGV0IGNvbXBvbmVudFJlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnkpO1xuICAgICAgdGhpcy5zZWFyY2hMaXN0ID0gY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgdGhpcy5zZWFyY2hMaXN0Lml0ZW1UZW1wbGF0ZSA9IHRoaXMubWVudGlvbkxpc3RUZW1wbGF0ZTtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZVsnaXRlbUNsaWNrJ10uc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgbmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICBsZXQgZmFrZUtleWRvd24gPSB7IGtleUNvZGU6IEtFWV9FTlRFUiwgd2FzQ2xpY2s6IHRydWUgfTtcbiAgICAgICAgdGhpcy5rZXlEb3duSGFuZGxlcihmYWtlS2V5ZG93biwgbmF0aXZlRWxlbWVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5zZWFyY2hMaXN0LmxhYmVsS2V5ID0gdGhpcy5hY3RpdmVDb25maWcubGFiZWxLZXk7XG4gICAgdGhpcy5zZWFyY2hMaXN0LmRyb3BVcCA9IHRoaXMuYWN0aXZlQ29uZmlnLmRyb3BVcDtcbiAgICB0aGlzLnNlYXJjaExpc3Quc3R5bGVPZmYgPSB0aGlzLm1lbnRpb25Db25maWcuZGlzYWJsZVN0eWxlO1xuICAgIHRoaXMuc2VhcmNoTGlzdC5hY3RpdmVJbmRleCA9IDA7XG4gICAgdGhpcy5zZWFyY2hMaXN0LnBvc2l0aW9uKG5hdGl2ZUVsZW1lbnQsIHRoaXMuaWZyYW1lKTtcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlYXJjaExpc3QucmVzZXQoKSk7XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RDaGFyUHJlc3NlZChldmVudDogYW55LCBwb3M6IGFueSk6IHN0cmluZyB7XG4gICAgbGV0IGNoYXJQcmVzc2VkID0gZXZlbnQua2V5O1xuXG4gICAgaWYgKCFjaGFyUHJlc3NlZCkge1xuICAgICAgbGV0IGNoYXJDb2RlID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcbiAgICAgIGlmICghZXZlbnQuc2hpZnRLZXkgJiYgKGNoYXJDb2RlID49IDY1ICYmIGNoYXJDb2RlIDw9IDkwKSkge1xuICAgICAgICBjaGFyUHJlc3NlZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhckNvZGUgKyAzMik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChldmVudC5zaGlmdEtleSAmJiBjaGFyQ29kZSA9PT0gMikge1xuICAgICAgICBjaGFyUHJlc3NlZCA9IHRoaXMuREVGQVVMVF9DT05GSUcudHJpZ2dlckNoYXI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gVE9ETyAoZG1hY2ZhcmxhbmUpIGZpeCB0aGlzIGZvciBub24tYWxwaGEga2V5c1xuICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIyMjAxOTYvaG93LXRvLWRlY29kZS1jaGFyYWN0ZXItcHJlc3NlZC1mcm9tLWpxdWVyeXMta2V5ZG93bnMtZXZlbnQtaGFuZGxlcj9scT0xXG4gICAgICAgIGNoYXJQcmVzc2VkID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWV9FTlRFUiAmJiBldmVudC53YXNDbGljayAmJiBwb3MgPCB0aGlzLnN0YXJ0UG9zKSB7XG4gICAgICAvLyBwdXQgY2FyZXQgYmFjayBpbiBwb3NpdGlvbiBwcmlvciB0byBjb250ZW50ZWRpdGFibGUgbWVudSBjbGlja1xuICAgICAgcG9zID0gdGhpcy5zdGFydE5vZGUubGVuZ3RoO1xuICAgICAgc2V0Q2FyZXRQb3NpdGlvbih0aGlzLnN0YXJ0Tm9kZSwgcG9zLCB0aGlzLmlmcmFtZSk7XG4gICAgfVxuICAgIC8vIE5vdGU6IEZJWCBmb3IgRWRnZSAoV2luZG93cyAtIGxhdGVzdCA0NC4xODM2Mi4zODcuMCkgLSBkb2VzIG1hdGNoIEAgYXMgcSthbHQrY3RybFxuICAgIGlmIChjaGFyUHJlc3NlZCA9PT0gJ3EnICYmIGV2ZW50LmFsdEtleSAmJiBldmVudC5jdHJsS2V5KSB7XG4gICAgICBjaGFyUHJlc3NlZCA9IFwiQFwiO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFyUHJlc3NlZDtcbiAgfVxufVxuIl19