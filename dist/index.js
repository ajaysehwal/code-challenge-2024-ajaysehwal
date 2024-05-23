"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOCK_SUBSIDY = void 0;
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const blockchain_1 = require("./blockchain");
const block_1 = require("./block");
const memorypool_1 = require("./memorypool");
const validate_1 = require("./validate");
const coinbase_1 = require("./coinbase");
const utils_1 = require("./utils");
exports.BLOCK_SUBSIDY = 1250000000;
class MineBlock {
    constructor(chain, block) {
        this.chain = chain;
        this.block = block;
        this.started = Date.now();
        this.ended = Date.now();
        this.hashes = 0;
        this.MAX_NONCE = 4294967295;
    }
    get duration() {
        return this.ended - this.started;
    }
    reverseBytes(hexString) {
        var _a, _b;
        if (hexString.length % 2 !== 0) {
            throw new Error("Hexadecimal string length must be even.");
        }
        return ((_b = (_a = hexString.match(/.{2}/g)) === null || _a === void 0 ? void 0 : _a.reverse()) === null || _b === void 0 ? void 0 : _b.join("")) || "";
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const header = this.block.headerBuffer();
            this.block.hash = (0, utils_1.doubleSHA256)(header).toString("hex");
            console.log(chalk_1.default.blue("Nonce"), " ", chalk_1.default.bgBlueBright("Block Header"));
            while (BigInt("0x" + this.reverseBytes(this.block.hash)) >
                this.block.difficulty &&
                this.block.nonce < this.MAX_NONCE) {
                this.block.nonce++;
                header.writeUInt32LE(this.block.nonce, 80 - 4);
                this.block.hash = (0, utils_1.doubleSHA256)(header).toString("hex");
                this.hashes++;
                console.log(chalk_1.default.blue(this.block.nonce), chalk_1.default.bgGreen(this.block.hash));
            }
            console.log(chalk_1.default.green(`Block mined ${this.block.hash} in ${this.hashes} iterations`));
            this.chain.addBlock(this.block);
        });
    }
}
class Miner {
    constructor(memoryPool) {
        this.memoryPool = memoryPool;
        this.validTransactions = [];
    }
    start(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const coinbase = (0, coinbase_1.coinbaseTX)();
            const validTransactions = this.getHighPriorityTransactions();
            const block = new block_1.Block("0".repeat(64), validTransactions, BigInt(0x1f00ffff));
            const { serializeCoinbase } = block.addCoinbaseTransaction(coinbase);
            const mineBlock = new MineBlock(chain, block);
            yield mineBlock.start();
            this.writeOutputFile(block, serializeCoinbase);
        });
    }
    getHighPriorityTransactions() {
        const transactions = this.getValidTransactions();
        const transactionsWithFees = transactions.map((tx) => ({
            tx,
            fee: Number(tx.fee),
        }));
        const sortedTransactions = transactionsWithFees
            .sort((a, b) => b.fee - a.fee)
            .slice(0, 2800)
            .map((txWithFee) => txWithFee.tx);
        return sortedTransactions;
    }
    getValidTransactions() {
        const transactionsToValidate = this.memoryPool.getTransactions();
        const validator = new validate_1.Validator();
        this.validTransactions = validator.validateBatch(transactionsToValidate);
        return this.validTransactions;
    }
    writeOutputFile(block, serializeCoinbase) {
        const txids = block.transactions.map((tx) => tx.txid);
        const reversedTxids = txids.map((txid) => { var _a, _b; return ((_b = (_a = txid.match(/.{2}/g)) === null || _a === void 0 ? void 0 : _a.reverse()) === null || _b === void 0 ? void 0 : _b.join("")) || ""; });
        const output = `${block
            .headerBuffer()
            .toString("hex")}\n${serializeCoinbase}\n${reversedTxids.join("\n")}`;
        fs_1.default.writeFileSync("output.txt", output);
    }
}
const blockchain = new blockchain_1.Blockchain();
console.log(blockchain);
const memoryPool = new memorypool_1.MemoryPool("./mempool");
const miner = new Miner(memoryPool);
miner.start(blockchain);
console.log(blockchain);
