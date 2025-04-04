import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/bitrue-tools-strings");
import "css!dashboard/bitrue-tools/bitrue-tools-styles.css";
import axios from 'axios';
import { sc, rpc, tx, wallet as wallet2, u, CONST } from '@cityofzion/neon-core';

const RPC_NODE_URL = "https://rpc2.n3.nspcc.ru:10331";
const ROUTER_SCRIPT_HASH = "0xf970f4ccecd765b63732b821775dc38c25d74f23";
const RPC_CLIENT = new rpc.RPCClient(RPC_NODE_URL);

type Props = Readonly<{
  message?: string;
}>;

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function BitrueToolsImpl(
  { message = "." }: Props
) {

  console.log("xxx rpc", RPC_CLIENT);
  return <p>{message}</p>
}

export const BitrueTools: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof BitrueToolsImpl>>
> = registerCustomElement(
    "dashboard-bitrue-tools",
  BitrueToolsImpl
);



export async function createFlamingoSwap(
  fromToken: string,
  toToken: string,
  quantity: number,
  minOutQuantity: number,
  accountAddress: string,
  accountScriptHash: string,
) {
  const maxDelay = 60000;
  const operation = 'swapTokenInForTokenOut';
  const allowedContracts = [
    ROUTER_SCRIPT_HASH,
    fromToken,
  ];
  const paramsJson = {
    type: 'Array',
    value: [
      {
        type: 'Hash160',
        value: fromToken,
      },
      {
        type: 'Hash160',
        value: toToken,
      },
    ],
  };
  const params = [
    sc.ContractParam.hash160(accountAddress),
    sc.ContractParam.integer(quantity),
    sc.ContractParam.integer(minOutQuantity),
    sc.ContractParam.fromJson(paramsJson),
    sc.ContractParam.integer(new Date().getTime() + maxDelay),
  ];

  return createTransactionCustomContracts(
    ROUTER_SCRIPT_HASH,
    operation,
    params,
    accountScriptHash,
    accountAddress,
    allowedContracts,
  );
}


async function createTransactionCustomContracts(
  contractHash: string,
  operation: string,
  params: sc.ContractParam[],
  accountScriptHash: string,
  accountAddress: string,
  allowedContracts: string[],
) {
  const script = sc.createScript({
    scriptHash: contractHash,
    operation,
    args: params,
  });

  const currentHeight = await RPC_CLIENT.getBlockCount();
  const transaction = new tx.Transaction({
    signers: [
      {
        account: accountScriptHash,
        scopes: tx.WitnessScope.CustomContracts,
        allowedContracts,
      },
    ],
    validUntilBlock: currentHeight + 10,
    script,
  });
  console.debug(`Transaction created: contractHash=${contractHash}, operation=${operation}, `
    + `params=${JSON.stringify(params)}, account=${accountAddress}`);
  return transaction;
}