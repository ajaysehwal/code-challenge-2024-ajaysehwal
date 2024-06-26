"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256ripemd160 = exports.varIntSize = exports.serializeVarInt = exports.getVarIntBuffer = exports.uint8ArrayToHexString = exports.bufferToBigInt = exports.bigIntTo32Buffer = exports.hashBuffer = exports.doubleSHA256 = exports.SHA256 = exports.bytesToHex = exports.bufferToHex = exports.bufferEqual = void 0;
const crypto_1 = require("crypto");
function bufferEqual(a, b) {
    if (a.byteLength !== b.byteLength)
        return false;
    let i = a.byteLength;
    while (i--)
        if (a[i] !== b[i])
            return false;
    return true;
}
exports.bufferEqual = bufferEqual;
function bufferToHex(buffer) {
    return Buffer.from(buffer).toString("hex");
}
exports.bufferToHex = bufferToHex;
function bytesToHex(bytes) {
    return Buffer.from(bytes).toString("hex");
}
exports.bytesToHex = bytesToHex;
function SHA256(buffer) {
    return (0, crypto_1.createHash)("sha256").update(buffer).digest();
}
exports.SHA256 = SHA256;
function doubleSHA256(buffer) {
    return SHA256(SHA256(buffer));
}
exports.doubleSHA256 = doubleSHA256;
function hashBuffer(buffer) {
    return BigInt("0x" + doubleSHA256(buffer).toString("hex"));
}
exports.hashBuffer = hashBuffer;
function bigIntTo32Buffer(n) {
    const sub = Buffer.from(n.toString(16), "hex");
    const buffer = Buffer.alloc(32);
    if (sub.byteLength)
        sub.copy(buffer, 32 - sub.byteLength);
    return buffer;
}
exports.bigIntTo32Buffer = bigIntTo32Buffer;
function bufferToBigInt(buffer) {
    return BigInt("0x" + Buffer.from(buffer).toString("hex"));
}
exports.bufferToBigInt = bufferToBigInt;
function uint8ArrayToHexString(uint8Array) {
    return Array.prototype.map
        .call(uint8Array, function (byte) {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
        .join("");
}
exports.uint8ArrayToHexString = uint8ArrayToHexString;
function getVarIntBuffer(value) {
    if (value < 0xfd) {
        return Buffer.from([value]);
    }
    else if (value <= 0xffff) {
        return Buffer.from([0xfd, value & 0xff, (value >> 8) & 0xff]);
    }
    else if (value <= 0xffffffff) {
        return Buffer.from([
            0xfe,
            value & 0xff,
            (value >> 8) & 0xff,
            (value >> 16) & 0xff,
            (value >> 24) & 0xff,
        ]);
    }
    else {
        return Buffer.from([
            0xff,
            value & 0xff,
            (value >> 8) & 0xff,
            (value >> 16) & 0xff,
            (value >> 24) & 0xff,
            (value >> 32) & 0xff,
            (value >> 40) & 0xff,
            (value >> 48) & 0xff,
            (value >> 56) & 0xff,
        ]);
    }
}
exports.getVarIntBuffer = getVarIntBuffer;
function serializeVarInt(num) {
    if (num < 0xfd) {
        return Buffer.from([num]);
    }
    else if (num <= 0xffff) {
        const buf = Buffer.allocUnsafe(3);
        buf.writeUInt8(0xfd, 0);
        buf.writeUInt16LE(num, 1);
        return buf;
    }
    else if (num <= 0xffffffff) {
        const buf = Buffer.allocUnsafe(5);
        buf.writeUInt8(0xfe, 0);
        buf.writeUInt32LE(num, 1);
        return buf;
    }
    else {
        const buf = Buffer.allocUnsafe(9);
        buf.writeUInt8(0xff, 0);
        buf.writeBigInt64LE(BigInt(num), 1);
        return buf;
    }
}
exports.serializeVarInt = serializeVarInt;
function varIntSize(value) {
    if (value < 0xfd) {
        return 1;
    }
    else if (value <= 0xffff) {
        return 3;
    }
    else if (value <= 0xffffffff) {
        return 5;
    }
    else {
        return 9;
    }
}
exports.varIntSize = varIntSize;
function sha256ripemd160(data) {
    const sha256Hash = (0, crypto_1.createHash)("sha256").update(data).digest();
    const ripemd160Hash = (0, crypto_1.createHash)("ripemd160").update(sha256Hash).digest();
    return Uint8Array.from(ripemd160Hash);
}
exports.sha256ripemd160 = sha256ripemd160;
