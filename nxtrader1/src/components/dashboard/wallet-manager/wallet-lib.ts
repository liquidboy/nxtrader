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
import BigNumber from "./bignumber"
import { BLACK } from "ojs/ojcolor";
//import Color = require("ojs/ojcolor");
import { WalletJSON } from "@cityofzion/neon-core/lib/wallet";
import { AssetCard } from "./asset-card";
//import ArrayDataProvider = require("ojs/ojarraydataprovider");
//import { AssetTransactions } from "./asset-transactions";
import { ojPopup } from "ojs/ojpopup";
import { selectedTags } from "./wallet-manager";
import ApiClient from "dashboard/flamingo-api/api/api-client";
import { StoredTransactionRecord } from "dashboard/flamingo-api/indexdb/transactionsDbService";

const _apiClient = new ApiClient()
const RPC_NODE_URL: string = "https://rpc2.n3.nspcc.ru:10331"; //properties.rpcNodeUrl;\
const FLAMINGO_PRICE_URL: string = "https://cdn.flamingo.finance/token-info/prices";
const RPC_CLIENT = new rpc.RPCClient(RPC_NODE_URL);
export const KEY: string = "xxx";

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
  watchlist: Array<StoredTransactionRecord>;
  transactions: Array<Transaction>;
  asset_name: string;
  assetId: string; 
  walletAddress: string;
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
  publicKey?: string;
  goal?: number;
  tags?: Array<string>;
}
export class CWallet extends wallet3.Wallet {
  walletColor?: string;
  publicKey?: string;
  goal?: number;
  tags?: Array<string>;
  constructor(obj?: Partial<CWalletJSON>){
    super(obj);
  }
  export(): CWalletJSON{
    return super.export();
  };
}
export const NEO3_CONTRACT = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
export const GAS3_CONTRACT = '0xd2a4cff31913016155e38e474a2c06d08be276cf';
const DEFAULT_NEO3_ASSETS: DefaultAsset = {
  NEO: {
    asset_id: NEO3_CONTRACT,
    symbol: 'NEO',
    decimals: 0,
    balance: '0',
  },
  GAS: {
    asset_id: GAS3_CONTRACT,
    symbol: 'GAS',
    decimals: 8,
    balance: '0',
  },
};
const handleN3BalancesResponse = (data: any): Promise<Asset[]> => {
  
  const result: Asset[] = [
    { ...DEFAULT_NEO3_ASSETS.NEO },
    { ...DEFAULT_NEO3_ASSETS.GAS },
  ];
  (data?.balance || []).forEach((balance: any) => {
    if (balance.assethash === NEO3_CONTRACT) {
      result[0].balance = balance.amount;
    } else if (balance.assethash === GAS3_CONTRACT) {
      result[1].balance = BigNumber(balance.amount, 10).shiftedBy(-balance.decimals).toFixed();
    } else {
      const assetItem: Asset = {
        balance: BigNumber(balance.amount, 10).shiftedBy(-balance.decimals).toFixed(),
        asset_id: balance.assethash,
        symbol: balance.symbol,
        decimals: balance.decimals,
      };
      result.push(assetItem);
    }
  });
  return Promise.resolve(result);
  
  //return Promise.resolve([]);
}

export const getN3AddressBalances = async (address: string): Promise<Asset[]> => {
  const data = {
    jsonrpc: '2.0',
    method: 'getnep17balances',
    params: [address],
    id: 1,
  };
  const n3Res = await axios.post(DEFAULT_N3_RPC_NETWORK[0].rpcUrl, data);
  return handleN3BalancesResponse(n3Res.data.result);
}

//function base642hexOld(input: any) {
//  //return enc.Base64.parse(input).toString(enc.Hex);
//  return "";
//}
function base642hex(str: any) {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : '0' + hex);
  }
  return result.toUpperCase();
}

const n3AssetSymbol: Map<string, string> = new Map();
const n3AssetDecimal: Map<string, number> = new Map();
const n3AssetName: Map<string, string> = new Map();
function getAssetSymbols(
  contracts: string[]
): Promise<string[]> {
  const requestDatas: Array<any> = [];
  const requestIndexs: Array<any> = [];
  const symbolsRes: Array<any> = [];
  contracts.forEach((assetId, index) => {
    if (n3AssetSymbol.has(assetId)) {
      symbolsRes[index] = n3AssetSymbol.get(assetId);
    } else {
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
  return axios
    .post(DEFAULT_N3_RPC_NETWORK[0].rpcUrl, requestDatas)
    .then((res) => {
      res.data.forEach((item: any, index: any) => {
        let symbol: string = '';
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

function getAssetDecimals(
  contracts: string[]
): Promise<number[]> {
  const requestDatas: Array<any> = [];
  const requestIndexs: Array<any> = [];
  const decoimalsRes: Array<any> = [];
  contracts.forEach((assetId, index) => {
    if (n3AssetDecimal.has(assetId)) {
      decoimalsRes[index] = n3AssetDecimal.get(assetId);
    } else {
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
  return axios
    .post(DEFAULT_N3_RPC_NETWORK[0].rpcUrl, requestDatas)
    .then((res) => {
      res.data.forEach((item: any, index: any) => {
        let decimal = 0;
        if (item.result.stack) {
          decimal = item.result.stack[0].value;
          if (item.result.stack[0].type === 'Integer') {
            decimal = Number(item.result.stack[0].value || 0);
          }
          if (item.result.stack[0].type === 'ByteArray') {
            const hexstr = u.reverseHex(item.result.stack[0].value);
            decimal = BigNumber(hexstr || 0, 16).toNumber();
          }
        }
        const sourceIndex = requestIndexs[index];
        n3AssetDecimal.set(contracts[sourceIndex], decimal);
        decoimalsRes[sourceIndex] = decimal;
      });
      return decoimalsRes;
    });
}

export const handleN3TxResponse = async (data: any): Promise<Transaction[]> => {
  const result: Transaction[] = [];
  (data?.sent || []).forEach(
    (tx: any) => {
      const txItem: Transaction = {
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
    }
  );
  (data?.received || []).forEach(
    (tx: any) => {
      const txItem: Transaction = {
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
    }
  );
  // return of(result).toPromise();
  result.sort((a, b) => {
    if (a.txid.localeCompare(b.txid) === 0) {
      return a.asset_id.localeCompare(b.asset_id);
    } else {
      return a.txid.localeCompare(b.txid);
    }
  });
  for (let i = 1; i < result.length; ) {
    if (
      result[i].txid === result[i - 1].txid &&
      result[i].asset_id === result[i - 1].asset_id
    ) {
      result[i].value = BigNumber(result[i].value, 10).plus(
        BigNumber(result[i - 1].value, 10)
      );
      result[i].type =
        result[i].value.comparedTo(0) > 0 ? 'received' : 'sent';
      result[i].value = result[i].value.toFixed();
      result.splice(i - 1, 1);
    } else {
      i++;
    }
  }
  const contracts: Set<string> = new Set();
  result.forEach((item) => contracts.add(item.asset_id));
  await getAssetSymbols(Array.from(contracts));
  await getAssetDecimals(Array.from(contracts));
  result.forEach((item, index) => {
    result[index].symbol = n3AssetSymbol.get(item.asset_id);
    const decimals = n3AssetDecimal.get(item.asset_id);
    if(decimals) {
      result[index].value = BigNumber(result[index].value, 10)
      .shiftedBy(-decimals)
      .toFixed();
    }
  });
  return result;
}

export const getN3AssetTxs = async (
  address: string,
  asset: string
): Promise<Transaction[]> => {
  //const res2 = await _apiClient.getWalletLendHistory(address, 1);
  const res = await getN3AllTxs(address);
  return res.filter((item: any) => item.asset_id === asset);
}

export const getN3AllTxs = async (address: string): Promise<Transaction[]> => {
  const time = Math.floor(new Date().getTime()) - 30 * 24 * 3600 * 1000;
  const data = {
    jsonrpc: '2.0',
    method: 'getnep17transfers',
    params: [address, time],
    id: 1,
  };
  let n3Res: any = await axios
    .post(DEFAULT_N3_RPC_NETWORK[0].rpcUrl, data); 
  n3Res = await handleN3TxResponse(n3Res.data.result);
  n3Res = n3Res.sort((a: any, b: any) => b.block_time - a.block_time);
  return n3Res;
}

export const loadWalletsFromStoragePK = (): Array<CWallet>  => {
  console.log("wallet-lib > loadWalletsFromStorage");
  return getLocalStorage(STORAGE_NAME['walletArr-Neo3']);
}

export const loadWalletsFromStorage = (): Array<CWallet>  => {
  console.log("wallet-lib > loadWalletsFromStorage");
  return getLocalStorage(STORAGE_NAME['walletPubArr-Neo3']);
}

export const addWalletToStoragePK = (name: string, pk: string, key: string, color: string) => {
  const account = new wallet3.Account(pk);
  const newChainType = wallet3.isAddress(account.address, 53) ? 'Neo3' : 'Neo2';
  Logger.info("configureWallet > chainType =", newChainType);
  const cw = new CWallet({name: name ?? 'nxTraderUser', walletColor: color.toString()});
  cw.walletColor = color;
  cw.addAccount(account);
  const wif = cw.accounts[0].WIF;
  cw.encrypt(0, key);

  const ws = loadWalletsFromStoragePK();
  ws.push(cw);

  updateLocalStorage(STORAGE_NAME.chainType, newChainType);
  //updteLocalStorage(STORAGE_NAME.WIFArr, []);
  //updteLocalStorage(STORAGE_NAME['WIFArr-Neo3'], []);
  //updteLocalStorage(STORAGE_NAME.walletArr, []);
  updateLocalStorage(STORAGE_NAME['walletArr-Neo3'], ws);
  //updateLocalStorage(STORAGE_NAME['walletPubArr-Neo3'], ws);

  //updateLocalWallet(PUBLIC_KEY);

  const { address } = account;
  //return <p>{message}  - {prices.length} {address}</p>
}

export const addWalletToStorage = (name: string, pk: string, key: string, goal: number, color?: string, tags?: Array<string>) => {
  const newChainType = 'Neo3';
  Logger.info("configureWallet > chainType =", newChainType);
  const cw = new CWallet({name: name ?? 'nxTraderUser', walletColor: color.toString()});
  cw.walletColor = color;
  cw.publicKey = pk;
  cw.goal = goal;
  cw.tags = tags;

  const ws = loadWalletsFromStorage();
  ws.push(cw);

  updateLocalStorage(STORAGE_NAME.chainType, newChainType);
  updateLocalStorage(STORAGE_NAME['walletPubArr-Neo3'], ws);
}

export const updateWalletToStorage = (name: string, pk: string, goal: number, color?: string, tags?: Array<string>) => {
  const ws = loadWalletsFromStorage();
  const w = ws.find(x=>x.name === name);
  if(w) {
    const cw = w as CWallet;
    if(color) cw.walletColor = color;
    cw.goal = goal;
    console.log("try save ", tags);
    cw.tags = tags;
    cw.publicKey = pk;
  }
  //updateLocalStorage(STORAGE_NAME['walletArr-Neo3'], ws);
  updateLocalStorage(STORAGE_NAME['walletPubArr-Neo3'], ws);
}

export const deleteWalletFromStorage = (name: string) => {
  const ws = loadWalletsFromStorage();
  const w = ws.find(x=>x.name === name);
  const indexOfWallet = ws.findIndex(x=>x.name === name);
  console.log("wallet-lib > deleteWalletFromStorage", w, indexOfWallet, ws);
  ws.splice(indexOfWallet, 1);
  updateLocalStorage(STORAGE_NAME['walletPubArr-Neo3'], ws);
}

export const loadRatiosFromStorage = (): Map<string, any> => {
  return getLocalStorage(STORAGE_NAME.ratios);
}

export const addToRatiosInStorage = (name: string, val: any) => {
  const ws = loadRatiosFromStorage();
  const w = ws.set(name, val);
  updateLocalStorage(STORAGE_NAME.ratios, ws);
}





export const getSelectedTagsFromStorage = (): Array<string>  => {
  console.log("wallet-lib > getSelectedTagsFromStorage");
  return getLocalStorage(STORAGE_NAME.selectedTags);
}

export const saveSelectedTagsToStorage = (tags: Array<string>) => {
  updateLocalStorage(STORAGE_NAME.selectedTags, tags);
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
    'walletPubArr-Neo3' = 'walletPubArr-Neo3',
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
    selectedTags = 'selectedTags',
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
      rpcUrl: 'https://seed2.neo.org:10332',
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
    selectedTags: {
      type: STORAGE_VALUE_TYPE.array,
      isLocal: true,
    }
  };
  
  
  
  
  
  
  async function getFlamingoPriceFeed() {
    return axios.get(FLAMINGO_PRICE_URL).then((ret) => ret.data);
  }
  
  async function genericReadCall(scriptHash: string, operation: string, args: any[]) {
    const result = await RPC_CLIENT.invokeFunction(scriptHash, operation, args);
    const retVal = result.stack[0].value;
    return retVal;
  }
  
  async function getBalance(contractHash: string, account: wallet2.Account) {
    return genericReadCall(contractHash, 'balanceOf', [sc.ContractParam.hash160(account.address)]).then((ret) => parseInt(ret as unknown as string, 10));
  }
  
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
      case STORAGE_VALUE_TYPE.array:
        storageValue = JSON.stringify(value);
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


  export const addressFormat = (address: string) => {
    try{
      return `${address.substring(0,6)}...${address.substring(address.length-6,address.length)}`;
    } catch {};
    return address;
  }