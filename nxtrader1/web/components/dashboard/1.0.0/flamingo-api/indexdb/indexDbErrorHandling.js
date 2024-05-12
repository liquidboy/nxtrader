define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractErrorAsString = void 0;
    function extractErrorAsString(context, onerrorEvent) {
        try {
            return context + `. ${onerrorEvent.target.error}`;
        }
        catch (_a) {
            return context + ". Error converting indexdb error event to string";
        }
    }
    exports.extractErrorAsString = extractErrorAsString;
});
