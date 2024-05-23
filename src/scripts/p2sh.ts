import { Transaction } from "../transaction";
import { createHash } from "crypto";
import { doubleSHA256, getVarIntBuffer, sha256ripemd160 } from "../utils";
import secp256k1 from "secp256k1";

function decodeHex(hex: string): Buffer {
  return Buffer.from(hex, "hex");
}
function extractScriptHash(scriptPubKey: string): Buffer {
  const scriptPubKeyBuffer = decodeHex(scriptPubKey);
  const scriptHash = scriptPubKeyBuffer.slice(2, 22);
  return scriptHash;
}
const transactionJSON1 = `{
  "version": 2,
  "locktime": 0,
  "vin": [
    {
      "txid": "f602ce27f84faa44e71ea1dfbdae3239305e7597af49f8e4187bda4c70d0816b",
      "vout": 1,
      "prevout": {
        "scriptpubkey": "a914c1a53f42ae60684fa42cc7c97210709070189f4487",
        "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 c1a53f42ae60684fa42cc7c97210709070189f44 OP_EQUAL",
        "scriptpubkey_type": "p2sh",
        "scriptpubkey_address": "3KLvJ8w8hBi3qpTKUg5GgUbEFGwzkfTUTG",
        "value": 5851298
      },
      "scriptsig": "160014e5950b318964ead2f432a3e474c06b43f650ef28",
      "scriptsig_asm": "OP_PUSHBYTES_22 0014e5950b318964ead2f432a3e474c06b43f650ef28",
      "witness": [
        "3045022100c606ed3e4e2bb49abbd6626b1a639215fcd5143a18211b18b0c267220ed8dae702207ebf3dcc1b92986e5b0455a048b3432d6d84651d7d7144732cf6295020e18fbc01",
        "0232a88479c560984ff209b52cf3014369d56e7776b4175ff74994b3428dbaeea3"
      ],
      "is_coinbase": false,
      "sequence": 4294967293,
      "inner_redeemscript_asm": "OP_0 OP_PUSHBYTES_20 e5950b318964ead2f432a3e474c06b43f650ef28"
    },
    {
      "txid": "da4bc1e36b0b553f62d6a976a3fa0b243219d38a958a4604f21e9aaa42c59f89",
      "vout": 0,
      "prevout": {
        "scriptpubkey": "a914c1a53f42ae60684fa42cc7c97210709070189f4487",
        "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 c1a53f42ae60684fa42cc7c97210709070189f44 OP_EQUAL",
        "scriptpubkey_type": "p2sh",
        "scriptpubkey_address": "3KLvJ8w8hBi3qpTKUg5GgUbEFGwzkfTUTG",
        "value": 2000000
      },
      "scriptsig": "160014e5950b318964ead2f432a3e474c06b43f650ef28",
      "scriptsig_asm": "OP_PUSHBYTES_22 0014e5950b318964ead2f432a3e474c06b43f650ef28",
      "witness": [
        "3044022034829f2bb73a0ac345e3f87e7ecdd861e9e7a18c1d12fb496ee5991e678bc3600220222fee5f399b7a150d0bee90b511d70781c62f277b5874cdc332a1628da4850501",
        "0232a88479c560984ff209b52cf3014369d56e7776b4175ff74994b3428dbaeea3"
      ],
      "is_coinbase": false,
      "sequence": 4294967293,
      "inner_redeemscript_asm": "OP_0 OP_PUSHBYTES_20 e5950b318964ead2f432a3e474c06b43f650ef28"
    },
    {
      "txid": "d9163714f61638c574d76cbf8f7141a3c3c23572512ddad3e63183276760f33d",
      "vout": 0,
      "prevout": {
        "scriptpubkey": "a914c1a53f42ae60684fa42cc7c97210709070189f4487",
        "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 c1a53f42ae60684fa42cc7c97210709070189f44 OP_EQUAL",
        "scriptpubkey_type": "p2sh",
        "scriptpubkey_address": "3KLvJ8w8hBi3qpTKUg5GgUbEFGwzkfTUTG",
        "value": 2000000
      },
      "scriptsig": "160014e5950b318964ead2f432a3e474c06b43f650ef28",
      "scriptsig_asm": "OP_PUSHBYTES_22 0014e5950b318964ead2f432a3e474c06b43f650ef28",
      "witness": [
        "3045022100aa4c8538944f9edb6f0c4a028268723c4cebab6c9d518be00ab7372337b7c2e40220447f4d04481c44270ff8215dec6914504f87a8ddbb9a1cee0b004fe36ff868a501",
        "0232a88479c560984ff209b52cf3014369d56e7776b4175ff74994b3428dbaeea3"
      ],
      "is_coinbase": false,
      "sequence": 4294967293,
      "inner_redeemscript_asm": "OP_0 OP_PUSHBYTES_20 e5950b318964ead2f432a3e474c06b43f650ef28"
    },
    {
      "txid": "64164d236363fd0a11f0e1a7269f0e6bc92a4fba75fb319f62d7451e814a54d3",
      "vout": 1,
      "prevout": {
        "scriptpubkey": "a914c1a53f42ae60684fa42cc7c97210709070189f4487",
        "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 c1a53f42ae60684fa42cc7c97210709070189f44 OP_EQUAL",
        "scriptpubkey_type": "p2sh",
        "scriptpubkey_address": "3KLvJ8w8hBi3qpTKUg5GgUbEFGwzkfTUTG",
        "value": 1036452
      },
      "scriptsig": "160014e5950b318964ead2f432a3e474c06b43f650ef28",
      "scriptsig_asm": "OP_PUSHBYTES_22 0014e5950b318964ead2f432a3e474c06b43f650ef28",
      "witness": [
        "3044022043a15dcfd65e8a321dea9c9ce4ac9646c4ff8eb5aa972b4f5023d289475286fd02207af9e12e7a2ec0fc9cd2baf9198cf3393857380f33ccc3728fc82976b0d5144001",
        "0232a88479c560984ff209b52cf3014369d56e7776b4175ff74994b3428dbaeea3"
      ],
      "is_coinbase": false,
      "sequence": 4294967293,
      "inner_redeemscript_asm": "OP_0 OP_PUSHBYTES_20 e5950b318964ead2f432a3e474c06b43f650ef28"
    }
  ],
  "vout": [
    {
      "scriptpubkey": "512029aa42b0b2902ab8e7af9d9bb81ff1f1369874bd569afb9c67583c2c53a6381d",
      "scriptpubkey_asm": "OP_PUSHNUM_1 OP_PUSHBYTES_32 29aa42b0b2902ab8e7af9d9bb81ff1f1369874bd569afb9c67583c2c53a6381d",
      "scriptpubkey_type": "v1_p2tr",
      "scriptpubkey_address": "bc1p9x4y9v9jjq4t3ea0nkdms8l37ymfsa9a26d0h8r8tq7zc5ax8qwske03mv",
      "value": 10000000
    },
    {
      "scriptpubkey": "a914c1a53f42ae60684fa42cc7c97210709070189f4487",
      "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 c1a53f42ae60684fa42cc7c97210709070189f44 OP_EQUAL",
      "scriptpubkey_type": "p2sh",
      "scriptpubkey_address": "3KLvJ8w8hBi3qpTKUg5GgUbEFGwzkfTUTG",
      "value": 879200
    }
  ]
}`;
const transactionJSON2 = `{
  "version": 1,
  "locktime": 0,
  "vin": [
    {
      "txid": "94fe235982213373da7d6ee7efd2aa7aeeea3c71dad9c0c45bd54e31b1557957",
      "vout": 1,
      "prevout": {
        "scriptpubkey": "a9140fb0c20eacff2965b1f2594c250c165dd4450ec487",
        "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 0fb0c20eacff2965b1f2594c250c165dd4450ec4 OP_EQUAL",
        "scriptpubkey_type": "p2sh",
        "scriptpubkey_address": "337yonUcnqG51muV6haP5XBqGBbF1mvLN1",
        "value": 4934335
      },
      "scriptsig": "220020115c4da1a0e6e7414964e3e6813b25fcfa9bff98e9652c33f6d11512e4676d7c",
      "scriptsig_asm": "OP_PUSHBYTES_34 0020115c4da1a0e6e7414964e3e6813b25fcfa9bff98e9652c33f6d11512e4676d7c",
      "witness": [
        "",
        "304402201583b15fd77f1a363fdf2b4cbd56725fb15ed2acba980bdc2b681e6abda4349c022050e9e13e96a2871e184ca59cf3e8a10c843ab04ce43d132e956c8a0b2a3586db01",
        "3044022041dfe5a435e2a597b648b7a556a7d9b0f225139de3e4da64b09bc248aaf5ea6002204e9f1af0654996d4718ee8ef916722aa3a2a6fcbc86c7f81853322b95fd6769901",
        "522103110b6a279de37085c775c3899fa8bf3c7a734d346b86be7a6dce55a41623b4ec2103ab719ec244b513ee8a77598ef7a5177e7091390a52078874ed74b5e79d2203b12103b4e0d0ba8bb4a77b53175b02a8c311b57a7dca6afd5f20596d96c46f11ed827d53ae"
      ],
      "is_coinbase": false,
      "sequence": 4294967295,
      "inner_redeemscript_asm": "OP_0 OP_PUSHBYTES_32 115c4da1a0e6e7414964e3e6813b25fcfa9bff98e9652c33f6d11512e4676d7c",
      "inner_witnessscript_asm": "OP_PUSHNUM_2 OP_PUSHBYTES_33 03110b6a279de37085c775c3899fa8bf3c7a734d346b86be7a6dce55a41623b4ec OP_PUSHBYTES_33 03ab719ec244b513ee8a77598ef7a5177e7091390a52078874ed74b5e79d2203b1 OP_PUSHBYTES_33 03b4e0d0ba8bb4a77b53175b02a8c311b57a7dca6afd5f20596d96c46f11ed827d OP_PUSHNUM_3 OP_CHECKMULTISIG"
    }
  ],
  "vout": [
    {
      "scriptpubkey": "76a9143b5bd0828a6c373291143b2c04392085f7173f1188ac",
      "scriptpubkey_asm": "OP_DUP OP_HASH160 OP_PUSHBYTES_20 3b5bd0828a6c373291143b2c04392085f7173f11 OP_EQUALVERIFY OP_CHECKSIG",
      "scriptpubkey_type": "p2pkh",
      "scriptpubkey_address": "16QrrheFkcc9ByERpPMiauNLbxbUGTKSXQ",
      "value": 4002264
    },
    {
      "scriptpubkey": "a9140fb0c20eacff2965b1f2594c250c165dd4450ec487",
      "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 0fb0c20eacff2965b1f2594c250c165dd4450ec4 OP_EQUAL",
      "scriptpubkey_type": "p2sh",
      "scriptpubkey_address": "337yonUcnqG51muV6haP5XBqGBbF1mvLN1",
      "value": 925700
    }
  ]
}`;
const transaction = new Transaction(JSON.parse(transactionJSON1));

export class P2SH {
  constructor(public transaction: Transaction) {}
  execute(scriptpubkey: string, redeemScript: string, index: number): boolean {
    if (!this.verifyScriptExecution(scriptpubkey, redeemScript, index)) {
      return false;
    }
    return true;
  }
  private StandardScriptExection(
    scriptpubkey_asm: string,
    redeemScript: string
  ) {
    const stack: Uint8Array[] = [];
    const scriptSigOps = scriptpubkey_asm.split(" ");
    for (let i = 0; i < scriptSigOps.length; i++) {
      const op = scriptSigOps[i];
      if (op.startsWith("OP_")) {
        switch (op) {
          case "OP_HASH160":
            const script = Buffer.from(redeemScript, "hex");
            const scripthash = this.hash160(script).toString("hex");
            stack.push(this.parseHexString(scripthash));
            break;
          case "OP_PUSHBYTES_20":
            stack.push(this.parseHexString(scriptSigOps[++i]));
            break;
          case "OP_EQUAL":
            const a = stack.pop();
            const b = stack.pop();
            if (!this.isEqual(a!, b!)) {
              return false;
            }
            break;
          default:
            throw new Error(`Unsupported opcode: ${op}`);
        }
      } else {
        stack.push(this.parseHexString(op));
      }
    }
    return stack.length === 0;
  }
  private RedeemScriptExecution() {}
  public verifyScriptExecution(
    scriptpubkey_asm: string,
    redeemScript: string,
    // scriptSig: string,
    index: number
  ): boolean {
    const input = this.transaction.vin[index];
    const sig = input.witness[0];
    const key=input.witness[1]
    const stack: Uint8Array[] = [];
    stack.push(this.parseHexString(sig));
    stack.push(this.parseHexString(key)); 
    if (!this.StandardScriptExection(scriptpubkey_asm, redeemScript)) {
      console.log("StandardScriptExection");
      return false;
    }
    const publicKey = stack.pop()!;
    const signature = stack.pop()!;
    const hashTypeNumber = signature[signature.byteLength - 1];

    const sigDEC = secp256k1.signatureImport(
      signature.slice(0, signature.byteLength - 1)
    );
    const message = this.getMessageHash(
      this.transaction,
      index,
      key,
      hashTypeNumber
    );
    if (!this.verifySignature(publicKey, sigDEC, message)) {
      console.log("Signature Not Valid")
      return false;
    }

    return true;
  }
  private verifySignature(
    publicKey: Uint8Array,
    signature: Uint8Array,
    message: Uint8Array
  ): boolean {
    return secp256k1.ecdsaVerify(signature, message, publicKey);
  }
  private isEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  private parseHexString(hexStr: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hexStr, "hex"));
  }
  hash160(data: Buffer) {
    return createHash("ripemd160")
      .update(createHash("sha256").update(data).digest())
      .digest();
  }
  getMessageHash(
    transaction: Transaction,
    inputIndex: number,
    publickeyhash:string,
    hashType: number = 0x01
  ) {
    const txclone = transaction.clone();
    const hashTypeBuffer = Buffer.alloc(4);
    hashTypeBuffer.writeUInt32LE(hashType);
    const txidVoutBuffers = txclone.inputs.map((input) =>
      Buffer.from(input.txid + input.vout, "hex")
    );
    const txidVouts = Buffer.concat(txidVoutBuffers);
    const sequenceBuffers = txclone.inputs.map((input) =>
      Buffer.from(input.sequence, "hex")
    );
    const inputsSequence = Buffer.concat(sequenceBuffers);
    const outputBuffers = txclone.outputs.map((output) =>
      Buffer.from(
        output.value + output.scriptpubkeysize + output.scriptpubkey,
        "hex"
      )
    );
    const outputs = Buffer.concat(outputBuffers);
    const outputshash = doubleSHA256(outputs);
    const sequenceshash = doubleSHA256(inputsSequence);
    const inputshash = doubleSHA256(txidVouts);
    const inputAmount = Buffer.alloc(8);
    inputAmount.writeBigUInt64LE(BigInt(transaction.vin[inputIndex].prevout.value));
    const inputSequence = Buffer.from(
      txclone.inputs[inputIndex].sequence,
      "hex"
    );
    const scriptcode = Buffer.from(`1976a914${publickeyhash}88ac`, "hex");
    const message = Buffer.concat([
      Buffer.from(txclone.verison, "hex"),
      inputshash,
      sequenceshash,
      Buffer.from(txclone.inputs[inputIndex].txid, "hex"),
      Buffer.from(txclone.inputs[inputIndex].vout, "hex"),
      scriptcode,
      inputAmount,
      inputSequence,
      outputshash,
      Buffer.from(txclone.locktime, "hex"),
      hashTypeBuffer,
    ]);
    return doubleSHA256(message);
  }
  private serialize(tx: any): string {
    let result = tx.verison;
    result += tx.inputscount;
    tx.inputs.forEach((input: any) => {
      result +=
        input.txid +
        input.vout +
        input.scriptsigsize +
        input.scriptsig +
        input.sequence;
    });
    result += tx.outputscount;
    tx.outputs.forEach((output: any) => {
      result += output.value + output.scriptpubkeysize + output.scriptpubkey;
    });
    result += tx.locktime;
    return result;
  }
}

const p2sh = new P2SH(transaction);

const input = transaction.vin[0];
const prevout = input.prevout;
const redeemScript = input.scriptsig_asm.split(" ")[1];
console.log(p2sh.execute(prevout.scriptpubkey_asm, redeemScript, 0));

//  const redeemScript =Buffer.from(`5121${publickey}51ae`,'hex') ;
//   //  console.log(redeemScript.toString('hex'))
//   //  const scriptpubkey = extractScriptHash(prevout.scriptpubkey).toString('hex');
//    const scriptHash=this.hash160(Buffer.from('0020115c4da1a0e6e7414964e3e6813b25fcfa9bff98e9652c33f6d11512e4676d7c','hex')).toString('hex');
//    console.log("redeemScript",scriptHash)
//    console.log("scriptpubkey",scriptpubkey)

//   return scriptHash===scriptpubkey
// }
