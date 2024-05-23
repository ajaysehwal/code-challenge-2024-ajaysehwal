import { Block } from "./block";

export class Blockchain {
  private chain: Block[] = [];
  private readonly maxBlockTransactions: number = 2801; // Set maximum number of transactions per block

  public getHead(): Block {
    return this.chain[this.chain.length - 1];
  }

  public getHeight(): number {
    return this.chain.length;
  }

  public addBlock(block: Block): void {
    if (this.isValidNewBlock(block)) {
      this.chain.push(block);
    } else {
      console.log("Invalid block. Rejected.");
    }
  }

  private isValidNewBlock(newBlock: Block): boolean {
    if (newBlock.transactions.length > this.maxBlockTransactions+1) {
      console.log("Too many transactions in the block.");
      return false;
    }
   return true;
  }

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
