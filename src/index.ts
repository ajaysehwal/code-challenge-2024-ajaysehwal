import fs from "fs";
import chalk from "chalk";
import { Transaction } from "./transaction";
import { BlockTransaction } from "./interface";
import { Blockchain } from "./blockchain";
import { Block } from "./block";
import { MemoryPool } from "./memorypool";
import { Validator } from "./validate";
import { coinbaseTX } from "./coinbase";
import { doubleSHA256, reverseBytes } from "./utils";

export const BLOCK_SUBSIDY = 1250000000;

class MineBlock {
  private started: number = Date.now();
  private ended: number = Date.now();
  private hashes: number = 0;
  private readonly MAX_NONCE: number = 4294967295;

  constructor(private chain: Blockchain, private block: Block) {}

  get duration(): number {
    return this.ended - this.started;
  }
  async start(): Promise<void> {
    const header = this.block.headerBuffer();
    this.block.hash = doubleSHA256(header).toString("hex");
    console.log(chalk.blue("Nonce"), " ", chalk.bgBlueBright("Block Header"));
    while (
      BigInt("0x" + reverseBytes(this.block.hash)) >
        this.block.difficulty &&
      this.block.nonce < this.MAX_NONCE
    ) {
      this.block.nonce++;
      header.writeUInt32LE(this.block.nonce, 80 - 4);
      this.block.hash = doubleSHA256(header).toString("hex");
      this.hashes++;
      console.log(chalk.blue(this.block.nonce), chalk.bgGreen(this.block.hash));
    }
    console.log(
      chalk.green(`Block mined ${this.block.hash} in ${this.hashes} iterations`)
    );
    this.chain.addBlock(this.block)
  }
}

class Miner {
  private validTransactions: BlockTransaction[] = [];

  constructor(private memoryPool: MemoryPool) {}
  async start(chain: Blockchain): Promise<void> {
    const coinbase = coinbaseTX();
    const validTransactions = this.getHighPriorityTransactions();
    const block = new Block(
      "0".repeat(64),
      validTransactions,
      BigInt(0x1f00ffff)
    );
    const { serializeCoinbase } = block.addCoinbaseTransaction(coinbase);
    const mineBlock = new MineBlock(chain, block);
    await mineBlock.start();
    this.writeOutputFile(block, serializeCoinbase);
  }

  private getHighPriorityTransactions(): BlockTransaction[] {
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

  private getValidTransactions(): BlockTransaction[] {
    const transactionsToValidate: Transaction[] =
      this.memoryPool.getTransactions();
    const validator = new Validator();
    this.validTransactions = validator.validateBatch(transactionsToValidate);
    return this.validTransactions;
  }
 private writeOutputFile(block: Block, serializeCoinbase: string): void {
    const txids = block.transactions.map((tx) => tx.txid);
    const reversedTxids = txids.map(
      (txid) => txid.match(/.{2}/g)?.reverse()?.join("") || ""
    );
    const output = `${block
      .headerBuffer()
      .toString("hex")}\n${serializeCoinbase}\n${reversedTxids.join("\n")}`;
    fs.writeFileSync("output.txt", output);
  }
}

const blockchain = new Blockchain();
const memoryPool = new MemoryPool("./mempool");
const miner = new Miner(memoryPool);
miner.start(blockchain);
console.log(blockchain);
