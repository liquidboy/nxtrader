define(["require", "exports", "@preact/signals"], function (require, exports, signals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.brbHidden = exports.bcloHidden = exports.bclrHidden = exports.buHidden = exports.bcrHidden = exports.bawHidden = void 0;
    console.log("form-elements > init");
    exports.bawHidden = (0, signals_1.signal)(false);
    exports.bcrHidden = (0, signals_1.signal)(false);
    exports.buHidden = (0, signals_1.signal)(true);
    exports.bclrHidden = (0, signals_1.signal)(false);
    exports.bcloHidden = (0, signals_1.signal)(true);
    exports.brbHidden = (0, signals_1.signal)(true);
});
