import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import { useEffect } from "preact/hooks";
//import componentStrings = require("ojL10n!./resources/nls/wallet-manager-strings");
import "css!dashboard/wallet-manager/wallet-manager-styles.css";
import { sc, rpc, tx, wallet as wallet2, u, CONST } from '@cityofzion/neon-core';
import { wallet as wallet3 } from '@cityofzion/neon-core-neo3';
import * as Logger  from 'ojs/ojlogger';
import axios from 'axios';
import { Signal, computed, signal, useSignal } from "@preact/signals";
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
import { ojChart } from "ojs/ojchart";
import { ojColorSpectrum} from "ojs/ojcolorspectrum";
import { ojValidationGroup } from 'ojs/ojvalidationgroup';
import { InputTextElement } from "ojs/ojinputtext";
import { ojListView } from "ojs/ojlistview";
//import ArrayListDataProvider = require("ojs/ojarraydataprovider");
import { IntlNumberConverter } from "ojs/ojconverter-number";
import { KeySetImpl } from "@oracle/oraclejet/ojkeyset";
import { ojButton } from "ojs/ojbutton";
import { BLACK } from "ojs/ojcolor";
//import Color = require("ojs/ojcolor");
import { WalletJSON } from "@cityofzion/neon-core/lib/wallet";
//import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { ojPopup } from "ojs/ojpopup";

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
interface DefaultAsset {
  NEO: Asset;
  GAS: Asset;
}
interface CWalletJSON extends WalletJSON {
  walletColor?: string;
}
export class CWallet extends wallet3.Wallet {
  walletColor?: string;
  constructor(obj?: Partial<CWalletJSON>){
    super(obj);
  }
  export(): CWalletJSON{
    return super.export();
  };
}
export const NEO3_CONTRACT = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
export const GAS3_CONTRACT = '0xd2a4cff31913016155e38e474a2c06d08be276cf';


export const loadWalletsFromStorage = (): Array<CWallet>  => {
  return getLocalStorage(STORAGE_NAME['walletArr-Neo3']);
}

export const addWalletToStorage = (name: string, pk: string, key: string, color: string) => {
  const account = new wallet3.Account(pk);
  const newChainType = wallet3.isAddress(account.address, 53) ? 'Neo3' : 'Neo2';
  Logger.info("configureWallet > chainType =", newChainType);
  const cw = new CWallet({name: name ?? 'nxTraderUser', walletColor: color.toString()});
  cw.walletColor = color;
  cw.addAccount(account);
  const wif = cw.accounts[0].WIF;
  cw.encrypt(0, key);

  const ws = loadWalletsFromStorage();
  ws.push(cw);

  updateLocalStorage(STORAGE_NAME.chainType, newChainType);
  //updteLocalStorage(STORAGE_NAME.WIFArr, []);
  //updteLocalStorage(STORAGE_NAME['WIFArr-Neo3'], []);
  //updteLocalStorage(STORAGE_NAME.walletArr, []);
  updateLocalStorage(STORAGE_NAME['walletArr-Neo3'], ws);

  //updateLocalWallet(PUBLIC_KEY);

  const { address } = account;
  //return <p>{message}  - {prices.length} {address}</p>
}

export const updateWalletToStorage = (name: string, color: string) => {
  const ws = loadWalletsFromStorage();
  const w = ws.find(x=>x.name === name);
  if(w) {
    const cw = w as CWallet;
    cw.walletColor = color;
  }
  updateLocalStorage(STORAGE_NAME['walletArr-Neo3'], ws);
}

export const loadRatiosFromStorage = (): Map<string, any> => {
  var found = getLocalStorage(STORAGE_NAME.ratios);
  return found ?? new Map();
}

export const addToRatiosInStorage = (name: string, val: any) => {
  const ws = loadRatiosFromStorage();
  ws.set(name, val);
  keepMapSizeAtMaxSize(ws, 500);
  updateLocalStorage(STORAGE_NAME.ratios, ws);
}

function keepMapSizeAtMaxSize(map: Map<string, any>, maxSize: number) {
  if(map.size > maxSize) {
    var keys = Array.from(map.keys()).slice(0, 1);
    keys.forEach(k => map.delete(k));
  }
}

















// ============

export enum NetworkType {
    MainNet = 'MainNet',
    TestNet = 'TestNet',
    N3MainNet = 'N3MainNet',
    N3TestNet = 'N3TestNet',
    N3PrivateNet = 'N3PrivateNet',
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
  
  export enum STORAGE_NAME {
    n2Networks = 'n2Networks',
    n3Networks = 'n3Networks',
    n2SelectedNetworkIndex = 'n2SelectedNetworkIndex',
    n3SelectedNetworkIndex = 'n3SelectedNetworkIndex',
    coinsRate = 'coinsRate',
    fiatRate = 'fiatRate',
    neo3CoinsRate = 'neo3CoinsRate',
    rateCurrency = 'rateCurrency',
    wallet = 'wallet',
    walletArr = 'walletArr',
    'walletArr-Neo3' = 'walletArr-Neo3',
    WIFArr = 'WIFArr',
    'WIFArr-Neo3' = 'WIFArr-Neo3',
    chainType = 'chainType',
    neo3AddressFlag = 'neo3AddressFlag',
    lang = 'lang',
    transaction = 'transaction',
    connectedWebsites = 'connectedWebsites',
    authAddress = 'authAddress',
    InvokeArgsArray = 'InvokeArgsArray',
    walletsStatus = 'walletsStatus',
    haveBackupTip = 'haveBackupTip',
    hasLoginAddress = 'hasLoginAddress',
    shouldFindNode = 'shouldFindNode',
    rpcUrls = 'rpcUrls',
    neo3RemoveT4Flag = 'neo3RemoveT4Flag',
    onePassword = 'onePassword',
    theme ='theme',
    onePassCheckAddresses = 'onePassCheckAddresses',
    ratios = 'ratios',
  }
  
  export enum STORAGE_VALUE_TYPE {
    number = 'number',
    string = 'string',
    object = 'object',
    map = 'map',
    boolean = 'boolean',
    array = 'array',
  }
  
  
  export const DEFAULT_N2_RPC_NETWORK: RpcNetwork[] = [
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
  
  
  
  export const DEFAULT_N3_RPC_NETWORK: RpcNetwork[] = [
    {
      rpcUrl: 'https://n3seed1.ngd.network:10332',
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
  
  
  export const DEFAULT_RPC_URLS = {
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
  
  export const STORAGE_VALUE_MESSAGE = {
    n2Networks: {
      type: STORAGE_VALUE_TYPE.array,
      isLocal: true,
      default: DEFAULT_N2_RPC_NETWORK,
    },
    n3Networks: {
      type: STORAGE_VALUE_TYPE.array,
      isLocal: true,
      default: DEFAULT_N3_RPC_NETWORK,
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
      default: DEFAULT_RPC_URLS,
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
  
  
  
  
  
  
  function getLocalStorage(storageName: STORAGE_NAME) {
    let value = localStorage[storageName];
    let targetValue: any = value;
    switch (STORAGE_VALUE_MESSAGE[storageName].type) {
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
  
  function updateLocalStorage(storageName: STORAGE_NAME, value: any) {
    let storageValue = value;
    switch (STORAGE_VALUE_MESSAGE[storageName].type) {
      case STORAGE_VALUE_TYPE.object:
      case STORAGE_VALUE_TYPE.array:
          storageValue = JSON.stringify(value);
          break;
      case STORAGE_VALUE_TYPE.number:
      case STORAGE_VALUE_TYPE.boolean:
          storageValue = String(value);
          break;
      case STORAGE_VALUE_TYPE.map:
        storageValue = JSON.stringify([...value.entries()])
        break;
    }
    localStorage.setItem(storageName, storageValue);
  }
  
  
  
  
  
  
  
  const hexRegex = /^([0-9A-Fa-f]{2})*$/;
  function isHex(str: any) {
    try {
      return hexRegex.test(str);
    } catch (err) {
      return false;
    }
  } 
  function ensureHex(str: any) {
    if (!isHex(str)) {
      throw new Error(`Expected a hexstring but got ${str}`);
    }
  }
  function hexstring2ab(str: any) {
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
  function hexstring2str(hexstring: any) {
    return ab2str(hexstring2ab(hexstring));
  }
  function ab2str(buf: any) {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
  }