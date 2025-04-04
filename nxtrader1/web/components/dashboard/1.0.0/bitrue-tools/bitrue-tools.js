var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "@cityofzion/neon-core", "css!dashboard/bitrue-tools/bitrue-tools-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1, neon_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createFlamingoSwap = exports.BitrueTools = void 0;
    const RPC_NODE_URL = "https://rpc2.n3.nspcc.ru:10331";
    const ROUTER_SCRIPT_HASH = "0xf970f4ccecd765b63732b821775dc38c25d74f23";
    const RPC_CLIENT = new neon_core_1.rpc.RPCClient(RPC_NODE_URL);
    function BitrueToolsImpl({ message = "." }) {
        console.log("xxx rpc", RPC_CLIENT);
        return (0, jsx_runtime_1.jsx)("p", { children: message });
    }
    exports.BitrueTools = (0, ojvcomponent_1.registerCustomElement)("dashboard-bitrue-tools", BitrueToolsImpl, "BitrueTools", { "properties": { "message": { "type": "string" } } }, { "message": "." });
    function createFlamingoSwap(fromToken, toToken, quantity, minOutQuantity, accountAddress, accountScriptHash) {
        return __awaiter(this, void 0, void 0, function* () {
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
                neon_core_1.sc.ContractParam.hash160(accountAddress),
                neon_core_1.sc.ContractParam.integer(quantity),
                neon_core_1.sc.ContractParam.integer(minOutQuantity),
                neon_core_1.sc.ContractParam.fromJson(paramsJson),
                neon_core_1.sc.ContractParam.integer(new Date().getTime() + maxDelay),
            ];
            return createTransactionCustomContracts(ROUTER_SCRIPT_HASH, operation, params, accountScriptHash, accountAddress, allowedContracts);
        });
    }
    exports.createFlamingoSwap = createFlamingoSwap;
    function createTransactionCustomContracts(contractHash, operation, params, accountScriptHash, accountAddress, allowedContracts) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = neon_core_1.sc.createScript({
                scriptHash: contractHash,
                operation,
                args: params,
            });
            const currentHeight = yield RPC_CLIENT.getBlockCount();
            const transaction = new neon_core_1.tx.Transaction({
                signers: [
                    {
                        account: accountScriptHash,
                        scopes: neon_core_1.tx.WitnessScope.CustomContracts,
                        allowedContracts,
                    },
                ],
                validUntilBlock: currentHeight + 10,
                script,
            });
            console.debug(`Transaction created: contractHash=${contractHash}, operation=${operation}, `
                + `params=${JSON.stringify(params)}, account=${accountAddress}`);
            return transaction;
        });
    }
});
