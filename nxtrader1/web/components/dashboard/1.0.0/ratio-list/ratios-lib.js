define(["require", "exports", "@cityofzion/neon-core-neo3", "ojs/ojlogger", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojchart", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojpopup", "ojs/ojdefer"], function (require, exports, neon_core_neo3_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STORAGE_VALUE_MESSAGE = exports.DEFAULT_RPC_URLS = exports.DEFAULT_N3_RPC_NETWORK = exports.DEFAULT_N2_RPC_NETWORK = exports.STORAGE_VALUE_TYPE = exports.STORAGE_NAME = exports.NetworkType = exports.addToRatiosInStorage = exports.loadRatiosFromStorage = exports.updateWalletToStorage = exports.addWalletToStorage = exports.loadWalletsFromStorage = exports.GAS3_CONTRACT = exports.NEO3_CONTRACT = exports.CWallet = void 0;
    class CWallet extends neon_core_neo3_1.wallet.Wallet {
        constructor(obj) {
            super(obj);
        }
        export() {
            return super.export();
        }
        ;
    }
    exports.CWallet = CWallet;
    exports.NEO3_CONTRACT = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
    exports.GAS3_CONTRACT = '0xd2a4cff31913016155e38e474a2c06d08be276cf';
    const loadWalletsFromStorage = () => {
        return getLocalStorage(STORAGE_NAME['walletArr-Neo3']);
    };
    exports.loadWalletsFromStorage = loadWalletsFromStorage;
    const addWalletToStorage = (name, pk, key, color) => {
        const account = new neon_core_neo3_1.wallet.Account(pk);
        const newChainType = neon_core_neo3_1.wallet.isAddress(account.address, 53) ? 'Neo3' : 'Neo2';
        Logger.info("configureWallet > chainType =", newChainType);
        const cw = new CWallet({ name: name !== null && name !== void 0 ? name : 'nxTraderUser', walletColor: color.toString() });
        cw.walletColor = color;
        cw.addAccount(account);
        const wif = cw.accounts[0].WIF;
        cw.encrypt(0, key);
        const ws = (0, exports.loadWalletsFromStorage)();
        ws.push(cw);
        updateLocalStorage(STORAGE_NAME.chainType, newChainType);
        updateLocalStorage(STORAGE_NAME['walletArr-Neo3'], ws);
        const { address } = account;
    };
    exports.addWalletToStorage = addWalletToStorage;
    const updateWalletToStorage = (name, color) => {
        const ws = (0, exports.loadWalletsFromStorage)();
        const w = ws.find(x => x.name === name);
        if (w) {
            const cw = w;
            cw.walletColor = color;
        }
        updateLocalStorage(STORAGE_NAME['walletArr-Neo3'], ws);
    };
    exports.updateWalletToStorage = updateWalletToStorage;
    const loadRatiosFromStorage = () => {
        var found = getLocalStorage(STORAGE_NAME.ratios);
        return found !== null && found !== void 0 ? found : new Map();
    };
    exports.loadRatiosFromStorage = loadRatiosFromStorage;
    const addToRatiosInStorage = (name, val) => {
        const ws = (0, exports.loadRatiosFromStorage)();
        ws.set(name, val);
        keepMapSizeAtMaxSize(ws, 500);
        updateLocalStorage(STORAGE_NAME.ratios, ws);
    };
    exports.addToRatiosInStorage = addToRatiosInStorage;
    function keepMapSizeAtMaxSize(map, maxSize) {
        if (map.size > maxSize) {
            var keys = Array.from(map.keys()).slice(0, 1);
            keys.forEach(k => map.delete(k));
        }
    }
    var NetworkType;
    (function (NetworkType) {
        NetworkType["MainNet"] = "MainNet";
        NetworkType["TestNet"] = "TestNet";
        NetworkType["N3MainNet"] = "N3MainNet";
        NetworkType["N3TestNet"] = "N3TestNet";
        NetworkType["N3PrivateNet"] = "N3PrivateNet";
    })(NetworkType = exports.NetworkType || (exports.NetworkType = {}));
    var STORAGE_NAME;
    (function (STORAGE_NAME) {
        STORAGE_NAME["n2Networks"] = "n2Networks";
        STORAGE_NAME["n3Networks"] = "n3Networks";
        STORAGE_NAME["n2SelectedNetworkIndex"] = "n2SelectedNetworkIndex";
        STORAGE_NAME["n3SelectedNetworkIndex"] = "n3SelectedNetworkIndex";
        STORAGE_NAME["coinsRate"] = "coinsRate";
        STORAGE_NAME["fiatRate"] = "fiatRate";
        STORAGE_NAME["neo3CoinsRate"] = "neo3CoinsRate";
        STORAGE_NAME["rateCurrency"] = "rateCurrency";
        STORAGE_NAME["wallet"] = "wallet";
        STORAGE_NAME["walletArr"] = "walletArr";
        STORAGE_NAME["walletArr-Neo3"] = "walletArr-Neo3";
        STORAGE_NAME["WIFArr"] = "WIFArr";
        STORAGE_NAME["WIFArr-Neo3"] = "WIFArr-Neo3";
        STORAGE_NAME["chainType"] = "chainType";
        STORAGE_NAME["neo3AddressFlag"] = "neo3AddressFlag";
        STORAGE_NAME["lang"] = "lang";
        STORAGE_NAME["transaction"] = "transaction";
        STORAGE_NAME["connectedWebsites"] = "connectedWebsites";
        STORAGE_NAME["authAddress"] = "authAddress";
        STORAGE_NAME["InvokeArgsArray"] = "InvokeArgsArray";
        STORAGE_NAME["walletsStatus"] = "walletsStatus";
        STORAGE_NAME["haveBackupTip"] = "haveBackupTip";
        STORAGE_NAME["hasLoginAddress"] = "hasLoginAddress";
        STORAGE_NAME["shouldFindNode"] = "shouldFindNode";
        STORAGE_NAME["rpcUrls"] = "rpcUrls";
        STORAGE_NAME["neo3RemoveT4Flag"] = "neo3RemoveT4Flag";
        STORAGE_NAME["onePassword"] = "onePassword";
        STORAGE_NAME["theme"] = "theme";
        STORAGE_NAME["onePassCheckAddresses"] = "onePassCheckAddresses";
        STORAGE_NAME["ratios"] = "ratios";
    })(STORAGE_NAME = exports.STORAGE_NAME || (exports.STORAGE_NAME = {}));
    var STORAGE_VALUE_TYPE;
    (function (STORAGE_VALUE_TYPE) {
        STORAGE_VALUE_TYPE["number"] = "number";
        STORAGE_VALUE_TYPE["string"] = "string";
        STORAGE_VALUE_TYPE["object"] = "object";
        STORAGE_VALUE_TYPE["map"] = "map";
        STORAGE_VALUE_TYPE["boolean"] = "boolean";
        STORAGE_VALUE_TYPE["array"] = "array";
    })(STORAGE_VALUE_TYPE = exports.STORAGE_VALUE_TYPE || (exports.STORAGE_VALUE_TYPE = {}));
    exports.DEFAULT_N2_RPC_NETWORK = [
        {
            rpcUrl: 'http://seed1.ngd.network:10332',
            name: 'N2 MAINNET',
            explorer: 'https://neo2.neotube.io/',
            network: NetworkType.MainNet,
            chainId: 1,
            id: 1,
        },
        {
            rpcUrl: 'http://seed5.ngd.network:20332',
            name: 'N2 TESTNET',
            explorer: '',
            network: NetworkType.TestNet,
            chainId: 2,
            id: 2,
        },
    ];
    exports.DEFAULT_N3_RPC_NETWORK = [
        {
            rpcUrl: 'http://seed1.neo.org:10332',
            name: 'N3 MAINNET',
            magicNumber: 860833102,
            explorer: 'https://neotube.io/',
            network: NetworkType.N3MainNet,
            chainId: 3,
            id: 3,
        },
        {
            rpcUrl: 'http://seed3t5.neo.org:20332',
            name: 'N3 TESTNET',
            magicNumber: 894710606,
            explorer: 'https://testnet.neotube.io/',
            network: NetworkType.N3TestNet,
            chainId: 6,
            id: 6,
        },
    ];
    exports.DEFAULT_RPC_URLS = {
        lastModified: null,
        nodes: {
            1: [
                'http://seed6.ngd.network:10332',
                'http://seed8.ngd.network:10332',
            ],
            2: [
                'http://seed3.ngd.network:20332',
                'http://seed4.ngd.network:20332',
                'http://seed5.ngd.network:20332',
                'http://seed8.ngd.network:20332',
            ],
            3: [
                'http://seed1.neo.org:10332',
                'http://seed2.neo.org:10332',
                'http://seed3.neo.org:10332',
                'http://seed4.neo.org:10332',
                'http://seed5.neo.org:10332',
                'https://n3seed1.ngd.network:10332',
                'https://n3seed2.ngd.network:10332',
                'https://neo3-mainnet.neoline.vip',
            ],
            6: [
                'http://seed1t5.neo.org:20332',
                'http://seed2t5.neo.org:20332',
                'http://seed3t5.neo.org:20332',
                'http://seed4t5.neo.org:20332',
                'http://seed5t5.neo.org:20332',
            ],
        },
    };
    exports.STORAGE_VALUE_MESSAGE = {
        n2Networks: {
            type: STORAGE_VALUE_TYPE.array,
            isLocal: true,
            default: exports.DEFAULT_N2_RPC_NETWORK,
        },
        n3Networks: {
            type: STORAGE_VALUE_TYPE.array,
            isLocal: true,
            default: exports.DEFAULT_N3_RPC_NETWORK,
        },
        n2SelectedNetworkIndex: {
            type: STORAGE_VALUE_TYPE.number,
            isLocal: true,
            default: 0,
        },
        n3SelectedNetworkIndex: {
            type: STORAGE_VALUE_TYPE.number,
            isLocal: true,
            default: 0,
        },
        coinsRate: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: false,
        },
        fiatRate: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: false,
        },
        neo3CoinsRate: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: false,
        },
        rateCurrency: {
            type: STORAGE_VALUE_TYPE.string,
            isLocal: false,
            default: 'USD',
        },
        wallet: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: true,
        },
        walletArr: {
            type: STORAGE_VALUE_TYPE.array,
            isLocal: true,
        },
        'walletArr-Neo3': {
            type: STORAGE_VALUE_TYPE.array,
            isLocal: true,
        },
        WIFArr: {
            type: STORAGE_VALUE_TYPE.array,
            isLocal: true,
        },
        'WIFArr-Neo3': {
            type: STORAGE_VALUE_TYPE.array,
            isLocal: true,
        },
        chainType: {
            type: STORAGE_VALUE_TYPE.string,
            isLocal: true,
        },
        neo3AddressFlag: {
            type: STORAGE_VALUE_TYPE.boolean,
            isLocal: true,
        },
        lang: {
            type: STORAGE_VALUE_TYPE.string,
            isLocal: false,
            default: 'en',
        },
        transaction: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: false,
        },
        connectedWebsites: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: false,
        },
        authAddress: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: false,
        },
        InvokeArgsArray: {
            type: STORAGE_VALUE_TYPE.array,
            isLocal: true,
        },
        walletsStatus: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: true,
        },
        haveBackupTip: {
            type: STORAGE_VALUE_TYPE.boolean,
            isLocal: true,
        },
        hasLoginAddress: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: true,
        },
        shouldFindNode: {
            type: STORAGE_VALUE_TYPE.boolean,
            isLocal: true,
        },
        rpcUrls: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: true,
            default: exports.DEFAULT_RPC_URLS,
        },
        neo3RemoveT4Flag: {
            type: STORAGE_VALUE_TYPE.boolean,
            isLocal: true,
        },
        onePassword: {
            type: STORAGE_VALUE_TYPE.boolean,
            isLocal: true,
        },
        theme: {
            type: STORAGE_VALUE_TYPE.string,
            isLocal: false,
            default: 'light-theme',
        },
        onePassCheckAddresses: {
            type: STORAGE_VALUE_TYPE.object,
            isLocal: true,
        },
        ratios: {
            type: STORAGE_VALUE_TYPE.map,
            isLocal: true,
        },
    };
    function getLocalStorage(storageName) {
        let value = localStorage[storageName];
        let targetValue = value;
        switch (exports.STORAGE_VALUE_MESSAGE[storageName].type) {
            case STORAGE_VALUE_TYPE.object:
                targetValue = value && value !== 'undefined' ? JSON.parse(value) : {};
                break;
            case STORAGE_VALUE_TYPE.array:
                targetValue = value && value !== 'undefined' ? JSON.parse(value) : [];
                break;
            case STORAGE_VALUE_TYPE.map:
                targetValue =
                    value && value !== 'undefined'
                        ? new Map(JSON.parse(value))
                        : new Map();
                break;
            case STORAGE_VALUE_TYPE.number:
                targetValue = value && value !== 'undefined' ? Number(value) : 0;
                break;
            case STORAGE_VALUE_TYPE.boolean:
                targetValue = value === 'true' ? true : false;
                break;
        }
        return targetValue;
    }
    function updateLocalStorage(storageName, value) {
        let storageValue = value;
        switch (exports.STORAGE_VALUE_MESSAGE[storageName].type) {
            case STORAGE_VALUE_TYPE.object:
            case STORAGE_VALUE_TYPE.array:
                storageValue = JSON.stringify(value);
                break;
            case STORAGE_VALUE_TYPE.number:
            case STORAGE_VALUE_TYPE.boolean:
                storageValue = String(value);
                break;
            case STORAGE_VALUE_TYPE.map:
                storageValue = JSON.stringify([...value.entries()]);
                break;
        }
        localStorage.setItem(storageName, storageValue);
    }
    const hexRegex = /^([0-9A-Fa-f]{2})*$/;
    function isHex(str) {
        try {
            return hexRegex.test(str);
        }
        catch (err) {
            return false;
        }
    }
    function ensureHex(str) {
        if (!isHex(str)) {
            throw new Error(`Expected a hexstring but got ${str}`);
        }
    }
    function hexstring2ab(str) {
        ensureHex(str);
        if (!str.length) {
            return new Uint8Array(0);
        }
        const iters = str.length / 2;
        const result = new Uint8Array(iters);
        for (let i = 0; i < iters; i++) {
            result[i] = parseInt(str.substring(0, 2), 16);
            str = str.substring(2);
        }
        return result;
    }
    function hexstring2str(hexstring) {
        return ab2str(hexstring2ab(hexstring));
    }
    function ab2str(buf) {
        return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
    }
});
