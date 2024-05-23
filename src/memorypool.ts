import { Transaction } from "./transaction";
import fs from "fs";
export class MemoryPool {
  private transactions: Transaction[] = [];
  private mempoolFolder: string;

  constructor(mempoolFolder: string) {
    this.mempoolFolder = mempoolFolder;
    this.loadTransactions();
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  private loadTransactions(): void {
    const files = fs.readdirSync(this.mempoolFolder);
    const totalFiles = files.length;

    let filesLoaded = 0;
    
    try {
      fs.readdirSync(this.mempoolFolder).forEach((file: string) => {
        const data = fs.readFileSync(`${this.mempoolFolder}/${file}`, "utf-8");
        const transactionData: Transaction = JSON.parse(data);
        const transaction = new Transaction(transactionData);
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

    } catch (err) {
      throw err;
    }
  }
}
