"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
class Blockchain {
    constructor() {
        this.chain = [];
        this.maxBlockTransactions = 2801; // Set maximum number of transactions per block
        // private isValidProofOfWork(block: Block): boolean {
        //   const target = BigInt(`0x${"0".repeat(this.difficulty)}${"f".repeat(64 - this.difficulty)}`);
        //   const blockHash = BigInt(`0x${block.hash}`);
        //   return blockHash <= target;
        // }
        // public isValidChain(): boolean {
        //   for (let i = 1; i < this.chain.length; i++) {
        //     const currentBlock = this.chain[i];
        //     const previousBlock = this.chain[i - 1];
        //     if (currentBlock.previousHash !== previousBlock.hash) {
        //       console.log("Invalid blockchain: Previous hash mismatch.");
        //       return false;
        //     }
        //     if (!this.isValidProofOfWork(currentBlock)) {
        //       console.log("Invalid blockchain: Invalid proof of work.");
        //       return false;
        //     }
        //   }
        //   return true;
        // }
    }
    getHead() {
        return this.chain[this.chain.length - 1];
    }
    getHeight() {
        return this.chain.length;
    }
    addBlock(block) {
        if (this.isValidNewBlock(block)) {
            this.chain.push(block);
        }
        else {
            console.log("Invalid block. Rejected.");
        }
    }
    isValidNewBlock(newBlock) {
        if (newBlock.transactions.length > this.maxBlockTransactions + 1) {
            console.log("Too many transactions in the block.");
            return false;
        }
        return true;
    }
}
exports.Blockchain = Blockchain;
