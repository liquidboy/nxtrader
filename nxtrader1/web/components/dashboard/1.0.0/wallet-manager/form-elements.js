define(["require", "exports", "@preact/signals", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojchart", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojpopup", "ojs/ojdrawerpopup"], function (require, exports, signals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.brb = exports.bcloHidden = exports.bclrHidden = exports.buHidden = exports.bcrHidden = void 0;
    console.log("form-elements > init");
    exports.bcrHidden = (0, signals_1.signal)(false);
    exports.buHidden = (0, signals_1.signal)(true);
    exports.bclrHidden = (0, signals_1.signal)(false);
    exports.bcloHidden = (0, signals_1.signal)(true);
    exports.brb = (0, signals_1.signal)(true);
});
