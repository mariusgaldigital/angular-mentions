/**
 * @fileoverview added by tsickle
 * Generated from: lib/mention-config.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// configuration structure, backwards compatible with earlier versions
/**
 * @record
 */
export function MentionConfig() { }
if (false) {
    /** @type {?|undefined} */
    MentionConfig.prototype.mentions;
    /** @type {?|undefined} */
    MentionConfig.prototype.disableStyle;
}
/**
 * @record
 */
export function Mentions() { }
if (false) {
    /** @type {?|undefined} */
    Mentions.prototype.items;
    /** @type {?|undefined} */
    Mentions.prototype.triggerChar;
    /** @type {?|undefined} */
    Mentions.prototype.labelKey;
    /** @type {?|undefined} */
    Mentions.prototype.maxItems;
    /** @type {?|undefined} */
    Mentions.prototype.disableSort;
    /** @type {?|undefined} */
    Mentions.prototype.disableSearch;
    /** @type {?|undefined} */
    Mentions.prototype.dropUp;
    /** @type {?|undefined} */
    Mentions.prototype.allowSpace;
    /** @type {?|undefined} */
    Mentions.prototype.mentionSelect;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi1jb25maWcuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLW1lbnRpb25zLyIsInNvdXJjZXMiOlsibGliL21lbnRpb24tY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLG1DQU1DOzs7SUFKQyxpQ0FBcUI7O0lBR3JCLHFDQUFzQjs7Ozs7QUFHeEIsOEJBNEJDOzs7SUExQkMseUJBQWE7O0lBR2IsK0JBQW9COztJQUdwQiw0QkFBaUI7O0lBR2pCLDRCQUFpQjs7SUFHakIsK0JBQXFCOztJQUlyQixpQ0FBdUI7O0lBR3ZCLDBCQUFnQjs7SUFHaEIsOEJBQXFCOztJQUdyQixpQ0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25maWd1cmF0aW9uIHN0cnVjdHVyZSwgYmFja3dhcmRzIGNvbXBhdGlibGUgd2l0aCBlYXJsaWVyIHZlcnNpb25zXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWVudGlvbkNvbmZpZyBleHRlbmRzIE1lbnRpb25zIHtcbiAgLy8gbmVzdGVkIGNvbmZpZ1xuICBtZW50aW9ucz86TWVudGlvbnNbXTtcbiAgXG4gIC8vIG9wdGlvbiB0byBkaXNhYmxlIGVuY2Fwc3VsYXRlZCBzdHlsZXMgc28gZ2xvYmFsIHN0eWxlcyBjYW4gYmUgdXNlZCBpbnN0ZWFkXG4gIGRpc2FibGVTdHlsZT86Ym9vbGVhbjsgIFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1lbnRpb25zIHtcbiAgLy8gYW4gYXJyYXkgb2Ygc3RyaW5ncyBvciBvYmplY3RzIHRvIHN1Z2dlc3RcbiAgaXRlbXM/OmFueVtdO1xuXG4gIC8vIHRoZSBjaGFyYWN0ZXIgdGhhdCB3aWxsIHRyaWdnZXIgdGhlIG1lbnUgYmVoYXZpb3JcbiAgdHJpZ2dlckNoYXI/OnN0cmluZztcblxuICAvLyBvcHRpb24gdG8gc3BlY2lmeSB0aGUgZmllbGQgaW4gdGhlIG9iamVjdHMgdG8gYmUgdXNlZCBhcyB0aGUgaXRlbSBsYWJlbFxuICBsYWJlbEtleT86c3RyaW5nO1xuXG4gIC8vIG9wdGlvbiB0byBsaW1pdCB0aGUgbnVtYmVyIG9mIGl0ZW1zIHNob3duIGluIHRoZSBwb3AtdXAgbWVudVxuICBtYXhJdGVtcz86bnVtYmVyO1xuXG4gIC8vIG9wdGlvbiB0byBkaXNhYmxlIHNvcnRpbmdcbiAgZGlzYWJsZVNvcnQ/OmJvb2xlYW47XG5cbiAgLy8gb3B0aW9uIHRvIGRpYWJsZSBpbnRlcm5hbCBmaWx0ZXJpbmcuIGNhbiBiZSB1c2VkIHRvIHNob3cgdGhlIGZ1bGwgbGlzdCByZXR1cm5lZFxuICAvLyBmcm9tIGFuIGFzeW5jIG9wZXJhdGlvbiAob3IgYWxsb3dzIGEgY3VzdG9tIGZpbHRlciBmdW5jdGlvbiB0byBiZSB1c2VkIC0gaW4gZnV0dXJlKVxuICBkaXNhYmxlU2VhcmNoPzpib29sZWFuO1xuXG4gIC8vIGRpc3BsYXkgbWVudSBhYm92ZSB0ZXh0IGluc3RlYWQgb2YgYmVsb3dcbiAgZHJvcFVwPzpib29sZWFuO1xuXG4gIC8vIHdoZXRoZXIgdG8gYWxsb3cgc3BhY2Ugd2hpbGUgbWVudGlvbmluZyBvciBub3RcbiAgYWxsb3dTcGFjZT86IGJvb2xlYW47XG5cbiAgLy8gb3B0aW9uYWwgZnVuY3Rpb24gdG8gZm9ybWF0IHRoZSBzZWxlY3RlZCBpdGVtIGJlZm9yZSBpbnNlcnRpbmcgdGhlIHRleHRcbiAgbWVudGlvblNlbGVjdD86KGl0ZW06IGFueSkgPT4gKHN0cmluZyk7XG59Il19