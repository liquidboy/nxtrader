import "css!dashboard/wallet-manager/wallet-manager-styles.css";
import { wallet as wallet3 } from '@cityofzion/neon-core-neo3';
import "ojs/ojchart";
import "ojs/ojactioncard";
import "ojs/ojcolorspectrum";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojvalidationgroup";
import "ojs/ojpopup";
import "ojs/ojdefer";
import { WalletJSON } from "@cityofzion/neon-core/lib/wallet";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-defer': any;
        }
    }
}
export interface Asset {
    asset_id: string;
    balance?: string;
    name?: string;
    symbol?: string;
    watching?: boolean;
    avatar?: string;
    rateBalance?: string;
    decimals?: number;
    image_url?: string;
}
export interface AssetTransactionsMessage {
    transactions: Array<Transaction>;
    asset_name: string;
}
export interface Transaction {
    block_time: number;
    id?: number;
    size?: number;
    txid: string;
    value: any;
    net_fee?: any;
    asset_id: string;
    symbol?: string;
    from?: string[];
    to?: string[];
    type: 'sent' | 'received';
}
export interface CAsset extends Asset {
    walletAddress: string;
    walletName: string;
    walletColor?: string;
}
interface CWalletJSON extends WalletJSON {
    walletColor?: string;
}
export declare class CWallet extends wallet3.Wallet {
    walletColor?: string;
    constructor(obj?: Partial<CWalletJSON>);
    export(): CWalletJSON;
}
export declare const NEO3_CONTRACT = "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5";
export declare const GAS3_CONTRACT = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
export declare const loadWalletsFromStorage: () => Array<CWallet>;
export declare const addWalletToStorage: (name: string, pk: string, key: string, color: string) => void;
export declare const updateWalletToStorage: (name: string, color: string) => void;
export declare const loadRatiosFromStorage: () => Map<string, any>;
export declare const addToRatiosInStorage: (name: string, val: any) => void;
export declare enum NetworkType {
    MainNet = "MainNet",
    TestNet = "TestNet",
    N3MainNet = "N3MainNet",
    N3TestNet = "N3TestNet",
    N3PrivateNet = "N3PrivateNet"
}
export interface RpcNetwork {
    name: string;
    rpcUrl: string;
    network: NetworkType;
    explorer?: string;
    magicNumber?: number;
    chainId: number;
    id: number;
}
export declare enum STORAGE_NAME {
    n2Networks = "n2Networks",
    n3Networks = "n3Networks",
    n2SelectedNetworkIndex = "n2SelectedNetworkIndex",
    n3SelectedNetworkIndex = "n3SelectedNetworkIndex",
    coinsRate = "coinsRate",
    fiatRate = "fiatRate",
    neo3CoinsRate = "neo3CoinsRate",
    rateCurrency = "rateCurrency",
    wallet = "wallet",
    walletArr = "walletArr",
    'walletArr-Neo3' = "walletArr-Neo3",
    WIFArr = "WIFArr",
    'WIFArr-Neo3' = "WIFArr-Neo3",
    chainType = "chainType",
    neo3AddressFlag = "neo3AddressFlag",
    lang = "lang",
    transaction = "transaction",
    connectedWebsites = "connectedWebsites",
    authAddress = "authAddress",
    InvokeArgsArray = "InvokeArgsArray",
    walletsStatus = "walletsStatus",
    haveBackupTip = "haveBackupTip",
    hasLoginAddress = "hasLoginAddress",
    shouldFindNode = "shouldFindNode",
    rpcUrls = "rpcUrls",
    neo3RemoveT4Flag = "neo3RemoveT4Flag",
    onePassword = "onePassword",
    theme = "theme",
    onePassCheckAddresses = "onePassCheckAddresses",
    ratios = "ratios"
}
export declare enum STORAGE_VALUE_TYPE {
    number = "number",
    string = "string",
    object = "object",
    map = "map",
    boolean = "boolean",
    array = "array"
}
export declare const DEFAULT_N2_RPC_NETWORK: RpcNetwork[];
export declare const DEFAULT_N3_RPC_NETWORK: RpcNetwork[];
export declare const DEFAULT_RPC_URLS: {
    lastModified: any;
    nodes: {
        1: string[];
        2: string[];
        3: string[];
        6: string[];
    };
};
export declare const STORAGE_VALUE_MESSAGE: {
    n2Networks: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
        default: RpcNetwork[];
    };
    n3Networks: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
        default: RpcNetwork[];
    };
    n2SelectedNetworkIndex: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
        default: number;
    };
    n3SelectedNetworkIndex: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
        default: number;
    };
    coinsRate: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    fiatRate: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    neo3CoinsRate: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    rateCurrency: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
        default: string;
    };
    wallet: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    walletArr: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    'walletArr-Neo3': {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    WIFArr: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    'WIFArr-Neo3': {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    chainType: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    neo3AddressFlag: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    lang: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
        default: string;
    };
    transaction: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    connectedWebsites: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    authAddress: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    InvokeArgsArray: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    walletsStatus: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    haveBackupTip: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    hasLoginAddress: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    shouldFindNode: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    rpcUrls: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
        default: {
            lastModified: any;
            nodes: {
                1: string[];
                2: string[];
                3: string[];
                6: string[];
            };
        };
    };
    neo3RemoveT4Flag: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    onePassword: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    theme: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
        default: string;
    };
    onePassCheckAddresses: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
    ratios: {
        type: STORAGE_VALUE_TYPE;
        isLocal: boolean;
    };
};
export {};
