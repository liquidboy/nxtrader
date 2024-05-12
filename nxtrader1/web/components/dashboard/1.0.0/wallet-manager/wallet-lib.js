var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "@cityofzion/neon-core", "@cityofzion/neon-core-neo3", "ojs/ojlogger", "axios", "./bignumber", "dashboard/flamingo-api/api/api-client", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojchart", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojpopup", "ojs/ojdefer"], function (require, exports, neon_core_1, neon_core_neo3_1, Logger, axios_1, bignumber_1, api_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addressFormat = exports.STORAGE_VALUE_MESSAGE = exports.DEFAULT_RPC_URLS = exports.DEFAULT_N3_RPC_NETWORK = exports.DEFAULT_N2_RPC_NETWORK = exports.STORAGE_VALUE_TYPE = exports.STORAGE_NAME = exports.NetworkType = exports.saveSelectedTagsToStorage = exports.getSelectedTagsFromStorage = exports.addToRatiosInStorage = exports.loadRatiosFromStorage = exports.deleteWalletFromStorage = exports.updateWalletToStorage = exports.addWalletToStorage = exports.addWalletToStoragePK = exports.loadWalletsFromStorage = exports.loadWalletsFromStoragePK = exports.getN3AllTxs = exports.getN3AssetTxs = exports.handleN3TxResponse = exports.getN3AddressBalances = exports.GAS3_CONTRACT = exports.NEO3_CONTRACT = exports.CWallet = exports.KEY = void 0;
    const _apiClient = new api_client_1.default();
    const RPC_NODE_URL = "https://rpc2.n3.nspcc.ru:10331";
    const FLAMINGO_PRICE_URL = "https://cdn.flamingo.finance/token-info/prices";
    const RPC_CLIENT = new neon_core_1.rpc.RPCClient(RPC_NODE_URL);
    exports.KEY = "xxx";
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
    const DEFAULT_NEO3_ASSETS = {
        NEO: {
            asset_id: exports.NEO3_CONTRACT,
            symbol: 'NEO',
            decimals: 0,
            balance: '0',
        },
        GAS: {
            asset_id: exports.GAS3_CONTRACT,
            symbol: 'GAS',
            decimals: 8,
            balance: '0',
        },
    };
    const handleN3BalancesResponse = (data) => {
        const result = [
            Object.assign({}, DEFAULT_NEO3_ASSETS.NEO),
            Object.assign({}, DEFAULT_NEO3_ASSETS.GAS),
        ];
        ((data === null || data === void 0 ? void 0 : data.balance) || []).forEach((balance) => {
            if (balance.assethash === exports.NEO3_CONTRACT) {
                result[0].balance = balance.amount;
            }
            else if (balance.assethash === exports.GAS3_CONTRACT) {
                result[1].balance = (0, bignumber_1.default)(balance.amount, 10).shiftedBy(-balance.decimals).toFixed();
            }
            else {
                const assetItem = {
                    balance: (0, bignumber_1.default)(balance.amount, 10).shiftedBy(-balance.decimals).toFixed(),
                    asset_id: balance.assethash,
                    symbol: balance.symbol,
                    decimals: balance.decimals,
                };
                result.push(assetItem);
            }
        });
        return Promise.resolve(result);
    };
    const getN3AddressBalances = (address) => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            jsonrpc: '2.0',
            method: 'getnep17balances',
            params: [address],
            id: 1,
        };
        const n3Res = yield axios_1.default.post(exports.DEFAULT_N3_RPC_NETWORK[0].rpcUrl, data);
        return handleN3BalancesResponse(n3Res.data.result);
    });
    exports.getN3AddressBalances = getN3AddressBalances;
    function base642hex(str) {
        const raw = atob(str);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result.toUpperCase();
    }
    const n3AssetSymbol = new Map();
    const n3AssetDecimal = new Map();
    const n3AssetName = new Map();
    function getAssetSymbols(contracts) {
        const requestDatas = [];
        const requestIndexs = [];
        const symbolsRes = [];
        contracts.forEach((assetId, index) => {
            if (n3AssetSymbol.has(assetId)) {
                symbolsRes[index] = n3AssetSymbol.get(assetId);
            }
            else {
                const data = {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'invokefunction',
                    params: [assetId, 'symbol'],
                };
                requestIndexs.push(index);
                requestDatas.push(data);
            }
        });
        if (requestDatas.length === 0) {
            return Promise.resolve(symbolsRes);
        }
        return axios_1.default
            .post(exports.DEFAULT_N3_RPC_NETWORK[0].rpcUrl, requestDatas)
            .then((res) => {
            res.data.forEach((item, index) => {
                let symbol = '';
                if (item.result.stack) {
                    symbol = item.result.stack[0].value;
                    if (item.result.stack[0].type === 'ByteArray') {
                        symbol = hexstring2str(item.result.stack[0].value);
                    }
                    if (item.result.stack[0].type === 'ByteString') {
                        symbol = hexstring2str(base642hex(item.result.stack[0].value));
                    }
                }
                const sourceIndex = requestIndexs[index];
                n3AssetSymbol.set(contracts[sourceIndex], symbol);
                symbolsRes[sourceIndex] = symbol;
            });
            return symbolsRes;
        });
    }
    function getAssetDecimals(contracts) {
        const requestDatas = [];
        const requestIndexs = [];
        const decoimalsRes = [];
        contracts.forEach((assetId, index) => {
            if (n3AssetDecimal.has(assetId)) {
                decoimalsRes[index] = n3AssetDecimal.get(assetId);
            }
            else {
                const data = {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'invokefunction',
                    params: [assetId, 'decimals'],
                };
                requestIndexs.push(index);
                requestDatas.push(data);
            }
        });
        if (requestDatas.length === 0) {
            return Promise.resolve(decoimalsRes);
        }
        return axios_1.default
            .post(exports.DEFAULT_N3_RPC_NETWORK[0].rpcUrl, requestDatas)
            .then((res) => {
            res.data.forEach((item, index) => {
                let decimal = 0;
                if (item.result.stack) {
                    decimal = item.result.stack[0].value;
                    if (item.result.stack[0].type === 'Integer') {
                        decimal = Number(item.result.stack[0].value || 0);
                    }
                    if (item.result.stack[0].type === 'ByteArray') {
                        const hexstr = neon_core_1.u.reverseHex(item.result.stack[0].value);
                        decimal = (0, bignumber_1.default)(hexstr || 0, 16).toNumber();
                    }
                }
                const sourceIndex = requestIndexs[index];
                n3AssetDecimal.set(contracts[sourceIndex], decimal);
                decoimalsRes[sourceIndex] = decimal;
            });
            return decoimalsRes;
        });
    }
    const handleN3TxResponse = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = [];
        ((data === null || data === void 0 ? void 0 : data.sent) || []).forEach((tx) => {
            const txItem = {
                block_time: Math.floor(tx.timestamp / 1000),
                asset_id: tx.assethash,
                from: [data.address],
                to: [tx.transferaddress],
                value: `-${tx.amount}`,
                txid: tx.txhash,
                type: 'sent',
                id: tx.blockindex,
            };
            result.push(txItem);
        });
        ((data === null || data === void 0 ? void 0 : data.received) || []).forEach((tx) => {
            const txItem = {
                block_time: Math.floor(tx.timestamp / 1000),
                asset_id: tx.assethash,
                from: [tx.transferaddress],
                to: [data.address],
                value: tx.amount,
                txid: tx.txhash,
                type: 'received',
                id: tx.blockindex,
            };
            result.push(txItem);
        });
        result.sort((a, b) => {
            if (a.txid.localeCompare(b.txid) === 0) {
                return a.asset_id.localeCompare(b.asset_id);
            }
            else {
                return a.txid.localeCompare(b.txid);
            }
        });
        for (let i = 1; i < result.length;) {
            if (result[i].txid === result[i - 1].txid &&
                result[i].asset_id === result[i - 1].asset_id) {
                result[i].value = (0, bignumber_1.default)(result[i].value, 10).plus((0, bignumber_1.default)(result[i - 1].value, 10));
                result[i].type =
                    result[i].value.comparedTo(0) > 0 ? 'received' : 'sent';
                result[i].value = result[i].value.toFixed();
                result.splice(i - 1, 1);
            }
            else {
                i++;
            }
        }
        const contracts = new Set();
        result.forEach((item) => contracts.add(item.asset_id));
        yield getAssetSymbols(Array.from(contracts));
        yield getAssetDecimals(Array.from(contracts));
        result.forEach((item, index) => {
            result[index].symbol = n3AssetSymbol.get(item.asset_id);
            const decimals = n3AssetDecimal.get(item.asset_id);
            if (decimals) {
                result[index].value = (0, bignumber_1.default)(result[index].value, 10)
                    .shiftedBy(-decimals)
                    .toFixed();
            }
        });
        return result;
    });
    exports.handleN3TxResponse = handleN3TxResponse;
    const getN3AssetTxs = (address, asset) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, exports.getN3AllTxs)(address);
        return res.filter((item) => item.asset_id === asset);
    });
    exports.getN3AssetTxs = getN3AssetTxs;
    const getN3AllTxs = (address) => __awaiter(void 0, void 0, void 0, function* () {
        const time = Math.floor(new Date().getTime()) - 30 * 24 * 3600 * 1000;
        const data = {
            jsonrpc: '2.0',
            method: 'getnep17transfers',
            params: [address, time],
            id: 1,
        };
        let n3Res = yield axios_1.default
            .post(exports.DEFAULT_N3_RPC_NETWORK[0].rpcUrl, data);
        n3Res = yield (0, exports.handleN3TxResponse)(n3Res.data.result);
        n3Res = n3Res.sort((a, b) => b.block_time - a.block_time);
        return n3Res;
    });
    exports.getN3AllTxs = getN3AllTxs;
    const loadWalletsFromStoragePK = () => {
        console.log("wallet-lib > loadWalletsFromStorage");
        return getLocalStorage(STORAGE_NAME['walletArr-Neo3']);
    };
    exports.loadWalletsFromStoragePK = loadWalletsFromStoragePK;
    const loadWalletsFromStorage = () => {
        console.log("wallet-lib > loadWalletsFromStorage");
        return getLocalStorage(STORAGE_NAME['walletPubArr-Neo3']);
    };
    exports.loadWalletsFromStorage = loadWalletsFromStorage;
    const addWalletToStoragePK = (name, pk, key, color) => {
        const account = new neon_core_neo3_1.wallet.Account(pk);
        const newChainType = neon_core_neo3_1.wallet.isAddress(account.address, 53) ? 'Neo3' : 'Neo2';
        Logger.info("configureWallet > chainType =", newChainType);
        const cw = new CWallet({ name: name !== null && name !== void 0 ? name : 'nxTraderUser', walletColor: color.toString() });
        cw.walletColor = color;
        cw.addAccount(account);
        const wif = cw.accounts[0].WIF;
        cw.encrypt(0, key);
        const ws = (0, exports.loadWalletsFromStoragePK)();
        ws.push(cw);
        updateLocalStorage(STORAGE_NAME.chainType, newChainType);
        updateLocalStorage(STORAGE_NAME['walletArr-Neo3'], ws);
        const { address } = account;
    };
    exports.addWalletToStoragePK = addWalletToStoragePK;
    const addWalletToStorage = (name, pk, key, goal, color, tags) => {
        const newChainType = 'Neo3';
        Logger.info("configureWallet > chainType =", newChainType);
        const cw = new CWallet({ name: name !== null && name !== void 0 ? name : 'nxTraderUser', walletColor: color.toString() });
        cw.walletColor = color;
        cw.publicKey = pk;
        cw.goal = goal;
        cw.tags = tags;
        const ws = (0, exports.loadWalletsFromStorage)();
        ws.push(cw);
        updateLocalStorage(STORAGE_NAME.chainType, newChainType);
        updateLocalStorage(STORAGE_NAME['walletPubArr-Neo3'], ws);
    };
    exports.addWalletToStorage = addWalletToStorage;
    const updateWalletToStorage = (name, pk, goal, color, tags) => {
        const ws = (0, exports.loadWalletsFromStorage)();
        const w = ws.find(x => x.name === name);
        if (w) {
            const cw = w;
            if (color)
                cw.walletColor = color;
            cw.goal = goal;
            console.log("try save ", tags);
            cw.tags = tags;
            cw.publicKey = pk;
        }
        updateLocalStorage(STORAGE_NAME['walletPubArr-Neo3'], ws);
    };
    exports.updateWalletToStorage = updateWalletToStorage;
    const deleteWalletFromStorage = (name) => {
        const ws = (0, exports.loadWalletsFromStorage)();
        const w = ws.find(x => x.name === name);
        const indexOfWallet = ws.findIndex(x => x.name === name);
        console.log("wallet-lib > deleteWalletFromStorage", w, indexOfWallet, ws);
        ws.splice(indexOfWallet, 1);
        updateLocalStorage(STORAGE_NAME['walletPubArr-Neo3'], ws);
    };
    exports.deleteWalletFromStorage = deleteWalletFromStorage;
    const loadRatiosFromStorage = () => {
        return getLocalStorage(STORAGE_NAME.ratios);
    };
    exports.loadRatiosFromStorage = loadRatiosFromStorage;
    const addToRatiosInStorage = (name, val) => {
        const ws = (0, exports.loadRatiosFromStorage)();
        const w = ws.set(name, val);
        updateLocalStorage(STORAGE_NAME.ratios, ws);
    };
    exports.addToRatiosInStorage = addToRatiosInStorage;
    const getSelectedTagsFromStorage = () => {
        console.log("wallet-lib > getSelectedTagsFromStorage");
        return getLocalStorage(STORAGE_NAME.selectedTags);
    };
    exports.getSelectedTagsFromStorage = getSelectedTagsFromStorage;
    const saveSelectedTagsToStorage = (tags) => {
        updateLocalStorage(STORAGE_NAME.selectedTags, tags);
    };
    exports.saveSelectedTagsToStorage = saveSelectedTagsToStorage;
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
        STORAGE_NAME["walletPubArr-Neo3"] = "walletPubArr-Neo3";
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
        STORAGE_NAME["selectedTags"] = "selectedTags";
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
            rpcUrl: 'http://seed2.neo.org:10332',
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
        'walletPubArr-Neo3': {
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
        selectedTags: {
            type: STORAGE_VALUE_TYPE.array,
            isLocal: true,
        }
    };
    function getFlamingoPriceFeed() {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.get(FLAMINGO_PRICE_URL).then((ret) => ret.data);
        });
    }
    function genericReadCall(scriptHash, operation, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield RPC_CLIENT.invokeFunction(scriptHash, operation, args);
            const retVal = result.stack[0].value;
            return retVal;
        });
    }
    function getBalance(contractHash, account) {
        return __awaiter(this, void 0, void 0, function* () {
            return genericReadCall(contractHash, 'balanceOf', [neon_core_1.sc.ContractParam.hash160(account.address)]).then((ret) => parseInt(ret, 10));
        });
    }
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
            case STORAGE_VALUE_TYPE.array:
                storageValue = JSON.stringify(value);
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
    const addressFormat = (address) => {
        try {
            return `${address.substring(0, 6)}...${address.substring(address.length - 6, address.length)}`;
        }
        catch (_a) { }
        ;
        return address;
    };
    exports.addressFormat = addressFormat;
});
