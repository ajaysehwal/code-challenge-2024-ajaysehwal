"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryPool = void 0;
const transaction_1 = require("./transaction");
const fs_1 = __importDefault(require("fs"));
class MemoryPool {
    constructor(mempoolFolder) {
        this.transactions = [];
        this.mempoolFolder = mempoolFolder;
        this.loadTransactions();
    }
    getTransactions() {
        return this.transactions;
    }
    loadTransactions() {
        const files = fs_1.default.readdirSync(this.mempoolFolder);
        const totalFiles = files.length;
        let filesLoaded = 0;
        try {
            fs_1.default.readdirSync(this.mempoolFolder).forEach((file) => {
                const data = fs_1.default.readFileSync(`${this.mempoolFolder}/${file}`, "utf-8");
                const transactionData = JSON.parse(data);
                const transaction = new transaction_1.Transaction(transactionData);
                this.transactions.push(transaction);
                filesLoaded++;
                const progress = (filesLoaded / totalFiles) * 100;
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write(`Fetching transactions from mempool: ${progress.toFixed(2)}%`);
            });
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            console.log("All transactions loaded.");
        }
        catch (err) {
            throw err;
        }
    }
}
exports.MemoryPool = MemoryPool;
