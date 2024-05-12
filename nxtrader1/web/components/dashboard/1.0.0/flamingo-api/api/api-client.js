var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "axios"], function (require, exports, axios_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ApiClient {
        constructor() {
            this.api = axios_1.default.create({ baseURL: "https://neo-api.b-cdn.net" });
        }
        getWalletWalletHistory(address, page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/wallet/history", { neo_address: address, page });
            });
        }
        getWalletWalletLatest(address) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/wallet/latest", { neo_address: address });
            });
        }
        getWalletClaimsHistory(address, page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/claims/history", { neo_address: address, page });
            });
        }
        getWalletClaimsLatest(address) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/claims/latest", { neo_address: address });
            });
        }
        getWalletTradeHistory(address, page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/trade/history", { neo_address: address, page });
            });
        }
        getWalletTradeLatest(address) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/trade/latest", { neo_address: address });
            });
        }
        getWalletLpHistory(address, page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/lp/history", { neo_address: address, page });
            });
        }
        getWalletLpLatest(address) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/lp/latest", { neo_address: address });
            });
        }
        getWalletStakingHistory(address, page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/staking/history", { neo_address: address, page });
            });
        }
        getWalletStakingLatest(address) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/staking/latest", { neo_address: address });
            });
        }
        getWalletLendHistory(address, page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/lend/history", { neo_address: address, page });
            });
        }
        getWalletLendLatest(address) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/lend/latest", { neo_address: address });
            });
        }
        getWalletTransferHistory(address, page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/transfer/history", { neo_address: address, page });
            });
        }
        getWalletTransferLatest(address) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/wallet/transfer/latest", { neo_address: address });
            });
        }
        getFlamingoLivedataPricesLatest() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/prices/latest", {});
            });
        }
        getFlamingoLivedataPricesFromblock(blocknumber) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/live-data/prices/from-block/${blocknumber}`, {});
            });
        }
        getFlamingoLivedataPricesFromdatetime({ year, month, day, hour, minute }) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/live-data/prices/from-datetime/${year}/${month}/${day}/${hour}/${minute}`, {});
            });
        }
        getFlamingoLivedataPricesFromtimestamp(timestamp) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/live-data/prices/from-timestamp/${timestamp}`, {});
            });
        }
        getFlamingoLivedataFiatexchangerate(pair) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/live-data/fiat-exchange-rate/${pair}`, {});
            });
        }
        getFlamingoLivedataClaimsHistory(page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/claims/history", { page });
            });
        }
        getFlamingoLivedataClaimsLatest() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/claims/latest", {});
            });
        }
        getFlamingoLivedataTradeHistory(page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/trade/history", { page });
            });
        }
        getFlamingoLivedataTradeLatest() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/trade/latest", {});
            });
        }
        getFlamingoLivedataLpHistory(page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/lp/history", { page });
            });
        }
        getFlamingoLivedataLpLatest() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/lp/latest", {});
            });
        }
        getFlamingoLivedataStakingHistory(page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/staking/history", { page });
            });
        }
        getFlamingoLivedataStakingLatest() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/staking/latest", {});
            });
        }
        getFlamingoLivedataLendHistory(page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/lend/history", { page });
            });
        }
        getFlamingoLivedataLendLatest() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/lend/latest", {});
            });
        }
        getFlamingoLivedataTransferHistory(page) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/transfer/history", { page });
            });
        }
        getFlamingoLivedataTransferLatest() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/live-data/transfer/latest", {});
            });
        }
        getFlamingoAnalyticsMonthhistory(collection, { year, month }) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/analytics/month-history/${collection}`, { year, month });
            });
        }
        getFlamingoAnalyticsMonthlatest(collection) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/analytics/month-latest/${collection}`, {});
            });
        }
        getFlamingoAnalyticsDailyhistory(collection, { year, month, day }) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/analytics/daily-history/${collection}`, { year, month, day });
            });
        }
        getFlamingoAnalyticsDailylatest(collection) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/analytics/daily-latest/${collection}`, {});
            });
        }
        getFlamingoAnalyticsRolling30days(collection) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData(`/flamingo/analytics/rolling-30-days/${collection}`, {});
            });
        }
        getFlamingoAnalyticsFlamingoTotalsupply() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/analytics/flamingo/total-supply", {});
            });
        }
        getFlamingoAnalyticsFlamingoUsdvaluelocked() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/flamingo/analytics/flamingo/usd-value-locked", {});
            });
        }
        getNeoBlock(index, flamingoData) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/neo/block", { index, flamingo_data: flamingoData });
            });
        }
        getNeoBlockLatest(flamingoData) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/neo/block/latest", { flamingo_data: flamingoData });
            });
        }
        getNeoBlocksHistory(page, flamingoData) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/neo/blocks/history", { page, flamingo_data: flamingoData });
            });
        }
        getNeoBlocksLatest(flamingoData) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/neo/blocks/latest", { flamingo_data: flamingoData });
            });
        }
        getNeoTransaction(txHash) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.fetchData("/neo/transaction", { tx_hash: txHash });
            });
        }
        fetchData(endpoint, params = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield this.api.get(endpoint, { params });
                    return response.data;
                }
                catch (error) {
                    console.error("Error fetching data from URL:", endpoint, error);
                    throw error;
                }
            });
        }
    }
    exports.default = ApiClient;
});
