'use strict';

const server$1 = require('../gpt-runner-web.eacbd9a0.cjs');
const require$$0$4 = require('http');
const require$$1 = require('fs');
const zlib = require('zlib');
const require$$0$3 = require('stream');
const require$$0$6 = require('path');
const require$$8 = require('querystring');
const require$$0$5 = require('url');
const require$$0$1 = require('crypto');
const require$$0$2 = require('events');
const require$$2 = require('timers');
const index = require('../gpt-runner-web.e79059fe.cjs');
require('https');
require('net');
require('tls');
require('node:http');
require('tty');
require('util');
require('buffer');
require('string_decoder');
require('os');
require('assert');
require('node:child_process');
require('node:fs');
require('node:os');
require('node:path');
require('node:url');
require('child_process');
require('constants');
require('module');
require('domain');
require('stream/web');
require('worker_threads');
require('perf_hooks');
require('util/types');
require('async_hooks');
require('console');
require('diagnostics_channel');
require('vm');
require('process');
require('v8');
require('node:https');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const require$$0__default$3 = /*#__PURE__*/_interopDefaultLegacy(require$$0$4);
const require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
const zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
const require$$0__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$0$3);
const require$$0__default$5 = /*#__PURE__*/_interopDefaultLegacy(require$$0$6);
const require$$8__default = /*#__PURE__*/_interopDefaultLegacy(require$$8);
const require$$0__default$4 = /*#__PURE__*/_interopDefaultLegacy(require$$0$5);
const require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
const require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
const require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);

var dist$1 = {exports: {}};

var engine_io = {};

var server = {};

var base64id$1 = {exports: {}};

/*!
 * base64id v0.1.0
 */

(function (module, exports) {
	/**
	 * Module dependencies
	 */

	var crypto = require$$0__default;

	/**
	 * Constructor
	 */

	var Base64Id = function() { };

	/**
	 * Get random bytes
	 *
	 * Uses a buffer if available, falls back to crypto.randomBytes
	 */

	Base64Id.prototype.getRandomBytes = function(bytes) {

	  var BUFFER_SIZE = 4096;
	  var self = this;  
	  
	  bytes = bytes || 12;

	  if (bytes > BUFFER_SIZE) {
	    return crypto.randomBytes(bytes);
	  }
	  
	  var bytesInBuffer = parseInt(BUFFER_SIZE/bytes);
	  var threshold = parseInt(bytesInBuffer*0.85);

	  if (!threshold) {
	    return crypto.randomBytes(bytes);
	  }

	  if (this.bytesBufferIndex == null) {
	     this.bytesBufferIndex = -1;
	  }

	  if (this.bytesBufferIndex == bytesInBuffer) {
	    this.bytesBuffer = null;
	    this.bytesBufferIndex = -1;
	  }

	  // No buffered bytes available or index above threshold
	  if (this.bytesBufferIndex == -1 || this.bytesBufferIndex > threshold) {
	     
	    if (!this.isGeneratingBytes) {
	      this.isGeneratingBytes = true;
	      crypto.randomBytes(BUFFER_SIZE, function(err, bytes) {
	        self.bytesBuffer = bytes;
	        self.bytesBufferIndex = 0;
	        self.isGeneratingBytes = false;
	      }); 
	    }
	    
	    // Fall back to sync call when no buffered bytes are available
	    if (this.bytesBufferIndex == -1) {
	      return crypto.randomBytes(bytes);
	    }
	  }
	  
	  var result = this.bytesBuffer.slice(bytes*this.bytesBufferIndex, bytes*(this.bytesBufferIndex+1)); 
	  this.bytesBufferIndex++; 
	  
	  return result;
	};

	/**
	 * Generates a base64 id
	 *
	 * (Original version from socket.io <http://socket.io>)
	 */

	Base64Id.prototype.generateId = function () {
	  var rand = Buffer.alloc(15); // multiple of 3 for base64
	  if (!rand.writeInt32BE) {
	    return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString()
	      + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
	  }
	  this.sequenceNumber = (this.sequenceNumber + 1) | 0;
	  rand.writeInt32BE(this.sequenceNumber, 11);
	  if (crypto.randomBytes) {
	    this.getRandomBytes(12).copy(rand);
	  } else {
	    // not secure for node 0.4
	    [0, 4, 8].forEach(function(i) {
	      rand.writeInt32BE(Math.random() * Math.pow(2, 32) | 0, i);
	    });
	  }
	  return rand.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
	};

	/**
	 * Export
	 */

	module.exports = new Base64Id();
} (base64id$1));

var transports = {};

var polling$2 = {};

var transport = {};

var cjs$1 = {};

var encodePacket = {};

var commons = {};

Object.defineProperty(commons, "__esModule", { value: true });
commons.ERROR_PACKET = commons.PACKET_TYPES_REVERSE = commons.PACKET_TYPES = void 0;
const PACKET_TYPES = Object.create(null); // no Map = no polyfill
commons.PACKET_TYPES = PACKET_TYPES;
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
commons.PACKET_TYPES_REVERSE = PACKET_TYPES_REVERSE;
Object.keys(PACKET_TYPES).forEach(key => {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = { type: "error", data: "parser error" };
commons.ERROR_PACKET = ERROR_PACKET;

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.encodePacketToBinary = exports.encodePacket = void 0;
	const commons_js_1 = commons;
	const encodePacket = ({ type, data }, supportsBinary, callback) => {
	    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
	        return callback(supportsBinary ? data : "b" + toBuffer(data, true).toString("base64"));
	    }
	    // plain string
	    return callback(commons_js_1.PACKET_TYPES[type] + (data || ""));
	};
	exports.encodePacket = encodePacket;
	const toBuffer = (data, forceBufferConversion) => {
	    if (Buffer.isBuffer(data) ||
	        (data instanceof Uint8Array && !forceBufferConversion)) {
	        return data;
	    }
	    else if (data instanceof ArrayBuffer) {
	        return Buffer.from(data);
	    }
	    else {
	        return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
	    }
	};
	let TEXT_ENCODER;
	function encodePacketToBinary(packet, callback) {
	    if (packet.data instanceof ArrayBuffer || ArrayBuffer.isView(packet.data)) {
	        return callback(toBuffer(packet.data, false));
	    }
	    (0, exports.encodePacket)(packet, true, encoded => {
	        if (!TEXT_ENCODER) {
	            // lazily created for compatibility with Node.js 10
	            TEXT_ENCODER = new TextEncoder();
	        }
	        callback(TEXT_ENCODER.encode(encoded));
	    });
	}
	exports.encodePacketToBinary = encodePacketToBinary;
} (encodePacket));

var decodePacket$1 = {};

Object.defineProperty(decodePacket$1, "__esModule", { value: true });
decodePacket$1.decodePacket = void 0;
const commons_js_1 = commons;
const decodePacket = (encodedPacket, binaryType) => {
    if (typeof encodedPacket !== "string") {
        return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
        };
    }
    const type = encodedPacket.charAt(0);
    if (type === "b") {
        const buffer = Buffer.from(encodedPacket.substring(1), "base64");
        return {
            type: "message",
            data: mapBinary(buffer, binaryType)
        };
    }
    if (!commons_js_1.PACKET_TYPES_REVERSE[type]) {
        return commons_js_1.ERROR_PACKET;
    }
    return encodedPacket.length > 1
        ? {
            type: commons_js_1.PACKET_TYPES_REVERSE[type],
            data: encodedPacket.substring(1)
        }
        : {
            type: commons_js_1.PACKET_TYPES_REVERSE[type]
        };
};
decodePacket$1.decodePacket = decodePacket;
const mapBinary = (data, binaryType) => {
    switch (binaryType) {
        case "arraybuffer":
            if (data instanceof ArrayBuffer) {
                // from WebSocket & binaryType "arraybuffer"
                return data;
            }
            else if (Buffer.isBuffer(data)) {
                // from HTTP long-polling
                return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
            }
            else {
                // from WebTransport (Uint8Array)
                return data.buffer;
            }
        case "nodebuffer":
        default:
            if (Buffer.isBuffer(data)) {
                // from HTTP long-polling or WebSocket & binaryType "nodebuffer" (default)
                return data;
            }
            else {
                // from WebTransport (Uint8Array)
                return Buffer.from(data);
            }
    }
};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decodePayload = exports.decodePacket = exports.encodePayload = exports.encodePacketToBinary = exports.encodePacket = exports.protocol = exports.decodePacketFromBinary = void 0;
	const encodePacket_js_1 = encodePacket;
	Object.defineProperty(exports, "encodePacket", { enumerable: true, get: function () { return encodePacket_js_1.encodePacket; } });
	Object.defineProperty(exports, "encodePacketToBinary", { enumerable: true, get: function () { return encodePacket_js_1.encodePacketToBinary; } });
	const decodePacket_js_1 = decodePacket$1;
	Object.defineProperty(exports, "decodePacket", { enumerable: true, get: function () { return decodePacket_js_1.decodePacket; } });
	const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
	const encodePayload = (packets, callback) => {
	    // some packets may be added to the array while encoding, so the initial length must be saved
	    const length = packets.length;
	    const encodedPackets = new Array(length);
	    let count = 0;
	    packets.forEach((packet, i) => {
	        // force base64 encoding for binary packets
	        (0, encodePacket_js_1.encodePacket)(packet, false, encodedPacket => {
	            encodedPackets[i] = encodedPacket;
	            if (++count === length) {
	                callback(encodedPackets.join(SEPARATOR));
	            }
	        });
	    });
	};
	exports.encodePayload = encodePayload;
	const decodePayload = (encodedPayload, binaryType) => {
	    const encodedPackets = encodedPayload.split(SEPARATOR);
	    const packets = [];
	    for (let i = 0; i < encodedPackets.length; i++) {
	        const decodedPacket = (0, decodePacket_js_1.decodePacket)(encodedPackets[i], binaryType);
	        packets.push(decodedPacket);
	        if (decodedPacket.type === "error") {
	            break;
	        }
	    }
	    return packets;
	};
	exports.decodePayload = decodePayload;
	let TEXT_DECODER;
	function decodePacketFromBinary(data, isBinary, binaryType) {
	    if (!TEXT_DECODER) {
	        // lazily created for compatibility with old browser platforms
	        TEXT_DECODER = new TextDecoder();
	    }
	    // 48 === "0".charCodeAt(0) (OPEN packet type)
	    // 54 === "6".charCodeAt(0) (NOOP packet type)
	    const isPlainBinary = isBinary || data[0] < 48 || data[0] > 54;
	    return (0, decodePacket_js_1.decodePacket)(isPlainBinary ? data : TEXT_DECODER.decode(data), binaryType);
	}
	exports.decodePacketFromBinary = decodePacketFromBinary;
	exports.protocol = 4;
} (cjs$1));

var parserV3 = {};

/*! https://mths.be/utf8js v2.1.2 by @mathias */

var stringFromCharCode = String.fromCharCode;
// Taken from https://mths.be/punycode
function ucs2decode(string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    var value;
    var extra;
    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            }
            else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        }
        else {
            output.push(value);
        }
    }
    return output;
}
// Taken from https://mths.be/punycode
function ucs2encode(array) {
    var length = array.length;
    var index = -1;
    var value;
    var output = '';
    while (++index < length) {
        value = array[index];
        if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
        }
        output += stringFromCharCode(value);
    }
    return output;
}
function checkScalarValue(codePoint, strict) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
        if (strict) {
            throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
                ' is not a scalar value');
        }
        return false;
    }
    return true;
}
/*--------------------------------------------------------------------------*/
function createByte(codePoint, shift) {
    return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}
function encodeCodePoint(codePoint, strict) {
    if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
        return stringFromCharCode(codePoint);
    }
    var symbol = '';
    if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
        symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    }
    else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
        if (!checkScalarValue(codePoint, strict)) {
            codePoint = 0xFFFD;
        }
        symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
        symbol += createByte(codePoint, 6);
    }
    else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
        symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
        symbol += createByte(codePoint, 12);
        symbol += createByte(codePoint, 6);
    }
    symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    return symbol;
}
function utf8encode(string, opts) {
    opts = opts || {};
    var strict = false !== opts.strict;
    var codePoints = ucs2decode(string);
    var length = codePoints.length;
    var index = -1;
    var codePoint;
    var byteString = '';
    while (++index < length) {
        codePoint = codePoints[index];
        byteString += encodeCodePoint(codePoint, strict);
    }
    return byteString;
}
/*--------------------------------------------------------------------------*/
function readContinuationByte() {
    if (byteIndex >= byteCount) {
        throw Error('Invalid byte index');
    }
    var continuationByte = byteArray[byteIndex] & 0xFF;
    byteIndex++;
    if ((continuationByte & 0xC0) == 0x80) {
        return continuationByte & 0x3F;
    }
    // If we end up here, it’s not a continuation byte
    throw Error('Invalid continuation byte');
}
function decodeSymbol(strict) {
    var byte1;
    var byte2;
    var byte3;
    var byte4;
    var codePoint;
    if (byteIndex > byteCount) {
        throw Error('Invalid byte index');
    }
    if (byteIndex == byteCount) {
        return false;
    }
    // Read first byte
    byte1 = byteArray[byteIndex] & 0xFF;
    byteIndex++;
    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) == 0) {
        return byte1;
    }
    // 2-byte sequence
    if ((byte1 & 0xE0) == 0xC0) {
        byte2 = readContinuationByte();
        codePoint = ((byte1 & 0x1F) << 6) | byte2;
        if (codePoint >= 0x80) {
            return codePoint;
        }
        else {
            throw Error('Invalid continuation byte');
        }
    }
    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xF0) == 0xE0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        if (codePoint >= 0x0800) {
            return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
        }
        else {
            throw Error('Invalid continuation byte');
        }
    }
    // 4-byte sequence
    if ((byte1 & 0xF8) == 0xF0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
            (byte3 << 0x06) | byte4;
        if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
            return codePoint;
        }
    }
    throw Error('Invalid UTF-8 detected');
}
var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString, opts) {
    opts = opts || {};
    var strict = false !== opts.strict;
    byteArray = ucs2decode(byteString);
    byteCount = byteArray.length;
    byteIndex = 0;
    var codePoints = [];
    var tmp;
    while ((tmp = decodeSymbol(strict)) !== false) {
        codePoints.push(tmp);
    }
    return ucs2encode(codePoints);
}
var utf8 = {
    version: '2.1.2',
    encode: utf8encode,
    decode: utf8decode
};

(function (exports) {
	// imported from https://github.com/socketio/engine.io-parser/tree/2.2.x
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decodePayloadAsBinary = exports.encodePayloadAsBinary = exports.decodePayload = exports.encodePayload = exports.decodeBase64Packet = exports.decodePacket = exports.encodeBase64Packet = exports.encodePacket = exports.packets = exports.protocol = void 0;
	/**
	 * Module dependencies.
	 */
	var utf8$1 = utf8;
	/**
	 * Current protocol version.
	 */
	exports.protocol = 3;
	const hasBinary = (packets) => {
	    for (const packet of packets) {
	        if (packet.data instanceof ArrayBuffer || ArrayBuffer.isView(packet.data)) {
	            return true;
	        }
	    }
	    return false;
	};
	/**
	 * Packet types.
	 */
	exports.packets = {
	    open: 0 // non-ws
	    ,
	    close: 1 // non-ws
	    ,
	    ping: 2,
	    pong: 3,
	    message: 4,
	    upgrade: 5,
	    noop: 6
	};
	var packetslist = Object.keys(exports.packets);
	/**
	 * Premade error packet.
	 */
	var err = { type: 'error', data: 'parser error' };
	const EMPTY_BUFFER = Buffer.concat([]);
	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */
	function encodePacket(packet, supportsBinary, utf8encode, callback) {
	    if (typeof supportsBinary === 'function') {
	        callback = supportsBinary;
	        supportsBinary = null;
	    }
	    if (typeof utf8encode === 'function') {
	        callback = utf8encode;
	        utf8encode = null;
	    }
	    if (Buffer.isBuffer(packet.data)) {
	        return encodeBuffer(packet, supportsBinary, callback);
	    }
	    else if (packet.data && (packet.data.buffer || packet.data) instanceof ArrayBuffer) {
	        return encodeBuffer({ type: packet.type, data: arrayBufferToBuffer(packet.data) }, supportsBinary, callback);
	    }
	    // Sending data as a utf-8 string
	    var encoded = exports.packets[packet.type];
	    // data fragment is optional
	    if (undefined !== packet.data) {
	        encoded += utf8encode ? utf8$1.encode(String(packet.data), { strict: false }) : String(packet.data);
	    }
	    return callback('' + encoded);
	}
	exports.encodePacket = encodePacket;
	/**
	 * Encode Buffer data
	 */
	function encodeBuffer(packet, supportsBinary, callback) {
	    if (!supportsBinary) {
	        return encodeBase64Packet(packet, callback);
	    }
	    var data = packet.data;
	    var typeBuffer = Buffer.allocUnsafe(1);
	    typeBuffer[0] = exports.packets[packet.type];
	    return callback(Buffer.concat([typeBuffer, data]));
	}
	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */
	function encodeBase64Packet(packet, callback) {
	    var data = Buffer.isBuffer(packet.data) ? packet.data : arrayBufferToBuffer(packet.data);
	    var message = 'b' + exports.packets[packet.type];
	    message += data.toString('base64');
	    return callback(message);
	}
	exports.encodeBase64Packet = encodeBase64Packet;
	/**
	 * Decodes a packet. Data also available as an ArrayBuffer if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */
	function decodePacket(data, binaryType, utf8decode) {
	    if (data === undefined) {
	        return err;
	    }
	    var type;
	    // String data
	    if (typeof data === 'string') {
	        type = data.charAt(0);
	        if (type === 'b') {
	            return decodeBase64Packet(data.slice(1), binaryType);
	        }
	        if (utf8decode) {
	            data = tryDecode(data);
	            if (data === false) {
	                return err;
	            }
	        }
	        if (Number(type) != type || !packetslist[type]) {
	            return err;
	        }
	        if (data.length > 1) {
	            return { type: packetslist[type], data: data.slice(1) };
	        }
	        else {
	            return { type: packetslist[type] };
	        }
	    }
	    // Binary data
	    if (binaryType === 'arraybuffer') {
	        // wrap Buffer/ArrayBuffer data into an Uint8Array
	        var intArray = new Uint8Array(data);
	        type = intArray[0];
	        return { type: packetslist[type], data: intArray.buffer.slice(1) };
	    }
	    if (data instanceof ArrayBuffer) {
	        data = arrayBufferToBuffer(data);
	    }
	    type = data[0];
	    return { type: packetslist[type], data: data.slice(1) };
	}
	exports.decodePacket = decodePacket;
	function tryDecode(data) {
	    try {
	        data = utf8$1.decode(data, { strict: false });
	    }
	    catch (e) {
	        return false;
	    }
	    return data;
	}
	/**
	 * Decodes a packet encoded in a base64 string.
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */
	function decodeBase64Packet(msg, binaryType) {
	    var type = packetslist[msg.charAt(0)];
	    var data = Buffer.from(msg.slice(1), 'base64');
	    if (binaryType === 'arraybuffer') {
	        var abv = new Uint8Array(data.length);
	        for (var i = 0; i < abv.length; i++) {
	            abv[i] = data[i];
	        }
	        // @ts-ignore
	        data = abv.buffer;
	    }
	    return { type: type, data: data };
	}
	exports.decodeBase64Packet = decodeBase64Packet;
	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */
	function encodePayload(packets, supportsBinary, callback) {
	    if (typeof supportsBinary === 'function') {
	        callback = supportsBinary;
	        supportsBinary = null;
	    }
	    if (supportsBinary && hasBinary(packets)) {
	        return encodePayloadAsBinary(packets, callback);
	    }
	    if (!packets.length) {
	        return callback('0:');
	    }
	    function encodeOne(packet, doneCallback) {
	        encodePacket(packet, supportsBinary, false, function (message) {
	            doneCallback(null, setLengthHeader(message));
	        });
	    }
	    map(packets, encodeOne, function (err, results) {
	        return callback(results.join(''));
	    });
	}
	exports.encodePayload = encodePayload;
	function setLengthHeader(message) {
	    return message.length + ':' + message;
	}
	/**
	 * Async array map using after
	 */
	function map(ary, each, done) {
	    const results = new Array(ary.length);
	    let count = 0;
	    for (let i = 0; i < ary.length; i++) {
	        each(ary[i], (error, msg) => {
	            results[i] = msg;
	            if (++count === ary.length) {
	                done(null, results);
	            }
	        });
	    }
	}
	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */
	function decodePayload(data, binaryType, callback) {
	    if (typeof data !== 'string') {
	        return decodePayloadAsBinary(data, binaryType, callback);
	    }
	    if (typeof binaryType === 'function') {
	        callback = binaryType;
	        binaryType = null;
	    }
	    if (data === '') {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	    }
	    var length = '', n, msg, packet;
	    for (var i = 0, l = data.length; i < l; i++) {
	        var chr = data.charAt(i);
	        if (chr !== ':') {
	            length += chr;
	            continue;
	        }
	        // @ts-ignore
	        if (length === '' || (length != (n = Number(length)))) {
	            // parser error - ignoring payload
	            return callback(err, 0, 1);
	        }
	        msg = data.slice(i + 1, i + 1 + n);
	        if (length != msg.length) {
	            // parser error - ignoring payload
	            return callback(err, 0, 1);
	        }
	        if (msg.length) {
	            packet = decodePacket(msg, binaryType, false);
	            if (err.type === packet.type && err.data === packet.data) {
	                // parser error in individual packet - ignoring payload
	                return callback(err, 0, 1);
	            }
	            var more = callback(packet, i + n, l);
	            if (false === more)
	                return;
	        }
	        // advance cursor
	        i += n;
	        length = '';
	    }
	    if (length !== '') {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	    }
	}
	exports.decodePayload = decodePayload;
	/**
	 *
	 * Converts a buffer to a utf8.js encoded string
	 *
	 * @api private
	 */
	function bufferToString(buffer) {
	    var str = '';
	    for (var i = 0, l = buffer.length; i < l; i++) {
	        str += String.fromCharCode(buffer[i]);
	    }
	    return str;
	}
	/**
	 *
	 * Converts a utf8.js encoded string to a buffer
	 *
	 * @api private
	 */
	function stringToBuffer(string) {
	    var buf = Buffer.allocUnsafe(string.length);
	    for (var i = 0, l = string.length; i < l; i++) {
	        buf.writeUInt8(string.charCodeAt(i), i);
	    }
	    return buf;
	}
	/**
	 *
	 * Converts an ArrayBuffer to a Buffer
	 *
	 * @api private
	 */
	function arrayBufferToBuffer(data) {
	    // data is either an ArrayBuffer or ArrayBufferView.
	    var length = data.byteLength || data.length;
	    var offset = data.byteOffset || 0;
	    return Buffer.from(data.buffer || data, offset, length);
	}
	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {Buffer} encoded payload
	 * @api private
	 */
	function encodePayloadAsBinary(packets, callback) {
	    if (!packets.length) {
	        return callback(EMPTY_BUFFER);
	    }
	    map(packets, encodeOneBinaryPacket, function (err, results) {
	        return callback(Buffer.concat(results));
	    });
	}
	exports.encodePayloadAsBinary = encodePayloadAsBinary;
	function encodeOneBinaryPacket(p, doneCallback) {
	    function onBinaryPacketEncode(packet) {
	        var encodingLength = '' + packet.length;
	        var sizeBuffer;
	        if (typeof packet === 'string') {
	            sizeBuffer = Buffer.allocUnsafe(encodingLength.length + 2);
	            sizeBuffer[0] = 0; // is a string (not true binary = 0)
	            for (var i = 0; i < encodingLength.length; i++) {
	                sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
	            }
	            sizeBuffer[sizeBuffer.length - 1] = 255;
	            return doneCallback(null, Buffer.concat([sizeBuffer, stringToBuffer(packet)]));
	        }
	        sizeBuffer = Buffer.allocUnsafe(encodingLength.length + 2);
	        sizeBuffer[0] = 1; // is binary (true binary = 1)
	        for (var i = 0; i < encodingLength.length; i++) {
	            sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
	        }
	        sizeBuffer[sizeBuffer.length - 1] = 255;
	        doneCallback(null, Buffer.concat([sizeBuffer, packet]));
	    }
	    encodePacket(p, true, true, onBinaryPacketEncode);
	}
	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary

	 * @param {Buffer} data, callback method
	 * @api public
	 */
	function decodePayloadAsBinary(data, binaryType, callback) {
	    if (typeof binaryType === 'function') {
	        callback = binaryType;
	        binaryType = null;
	    }
	    var bufferTail = data;
	    var buffers = [];
	    var i;
	    while (bufferTail.length > 0) {
	        var strLen = '';
	        var isString = bufferTail[0] === 0;
	        for (i = 1;; i++) {
	            if (bufferTail[i] === 255)
	                break;
	            // 310 = char length of Number.MAX_VALUE
	            if (strLen.length > 310) {
	                return callback(err, 0, 1);
	            }
	            strLen += '' + bufferTail[i];
	        }
	        bufferTail = bufferTail.slice(strLen.length + 1);
	        var msgLength = parseInt(strLen, 10);
	        var msg = bufferTail.slice(1, msgLength + 1);
	        if (isString)
	            msg = bufferToString(msg);
	        buffers.push(msg);
	        bufferTail = bufferTail.slice(msgLength + 1);
	    }
	    var total = buffers.length;
	    for (i = 0; i < total; i++) {
	        var buffer = buffers[i];
	        callback(decodePacket(buffer, binaryType, true), i, total);
	    }
	}
	exports.decodePayloadAsBinary = decodePayloadAsBinary;
} (parserV3));

Object.defineProperty(transport, "__esModule", { value: true });
transport.Transport = void 0;
const events_1$4 = require$$0__default$1;
const parser_v4 = cjs$1;
const parser_v3 = parserV3;
const debug_1$a = server$1.src.exports;
const debug$b = (0, debug_1$a.default)("engine:transport");
/**
 * Noop function.
 *
 * @api private
 */
function noop() { }
class Transport extends events_1$4.EventEmitter {
    /**
     * Transport constructor.
     *
     * @param {http.IncomingMessage} request
     * @api public
     */
    constructor(req) {
        super();
        this.readyState = "open";
        this.discarded = false;
        this.protocol = req._query.EIO === "4" ? 4 : 3; // 3rd revision by default
        this.parser = this.protocol === 4 ? parser_v4 : parser_v3;
    }
    get readyState() {
        return this._readyState;
    }
    set readyState(state) {
        debug$b("readyState updated from %s to %s (%s)", this._readyState, state, this.name);
        this._readyState = state;
    }
    /**
     * Flags the transport as discarded.
     *
     * @api private
     */
    discard() {
        this.discarded = true;
    }
    /**
     * Called with an incoming HTTP request.
     *
     * @param {http.IncomingMessage} request
     * @api protected
     */
    onRequest(req) {
        debug$b("setting request");
        this.req = req;
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    close(fn) {
        if ("closed" === this.readyState || "closing" === this.readyState)
            return;
        this.readyState = "closing";
        this.doClose(fn || noop);
    }
    /**
     * Called with a transport error.
     *
     * @param {String} message error
     * @param {Object} error description
     * @api protected
     */
    onError(msg, desc) {
        if (this.listeners("error").length) {
            const err = new Error(msg);
            // @ts-ignore
            err.type = "TransportError";
            // @ts-ignore
            err.description = desc;
            this.emit("error", err);
        }
        else {
            debug$b("ignored transport error %s (%s)", msg, desc);
        }
    }
    /**
     * Called with parsed out a packets from the data stream.
     *
     * @param {Object} packet
     * @api protected
     */
    onPacket(packet) {
        this.emit("packet", packet);
    }
    /**
     * Called with the encoded packet data.
     *
     * @param {String} data
     * @api protected
     */
    onData(data) {
        this.onPacket(this.parser.decodePacket(data));
    }
    /**
     * Called upon transport close.
     *
     * @api protected
     */
    onClose() {
        this.readyState = "closed";
        this.emit("close");
    }
}
transport.Transport = Transport;

Object.defineProperty(polling$2, "__esModule", { value: true });
polling$2.Polling = void 0;
const transport_1$4 = transport;
const zlib_1$1 = zlib__default;
const accepts$1 = server$1.accepts;
const debug_1$9 = server$1.src.exports;
const debug$a = (0, debug_1$9.default)("engine:polling");
const compressionMethods$1 = {
    gzip: zlib_1$1.createGzip,
    deflate: zlib_1$1.createDeflate,
};
class Polling$1 extends transport_1$4.Transport {
    /**
     * HTTP polling constructor.
     *
     * @api public.
     */
    constructor(req) {
        super(req);
        this.closeTimeout = 30 * 1000;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "polling";
    }
    get supportsFraming() {
        return false;
    }
    /**
     * Overrides onRequest.
     *
     * @param {http.IncomingMessage}
     * @api private
     */
    onRequest(req) {
        const res = req.res;
        if ("GET" === req.method) {
            this.onPollRequest(req, res);
        }
        else if ("POST" === req.method) {
            this.onDataRequest(req, res);
        }
        else {
            res.writeHead(500);
            res.end();
        }
    }
    /**
     * The client sends a request awaiting for us to send data.
     *
     * @api private
     */
    onPollRequest(req, res) {
        if (this.req) {
            debug$a("request overlap");
            // assert: this.res, '.req and .res should be (un)set together'
            this.onError("overlap from client");
            res.writeHead(400);
            res.end();
            return;
        }
        debug$a("setting request");
        this.req = req;
        this.res = res;
        const onClose = () => {
            this.onError("poll connection closed prematurely");
        };
        const cleanup = () => {
            req.removeListener("close", onClose);
            this.req = this.res = null;
        };
        req.cleanup = cleanup;
        req.on("close", onClose);
        this.writable = true;
        this.emit("drain");
        // if we're still writable but had a pending close, trigger an empty send
        if (this.writable && this.shouldClose) {
            debug$a("triggering empty send to append close packet");
            this.send([{ type: "noop" }]);
        }
    }
    /**
     * The client sends a request with data.
     *
     * @api private
     */
    onDataRequest(req, res) {
        if (this.dataReq) {
            // assert: this.dataRes, '.dataReq and .dataRes should be (un)set together'
            this.onError("data request overlap from client");
            res.writeHead(400);
            res.end();
            return;
        }
        const isBinary = "application/octet-stream" === req.headers["content-type"];
        if (isBinary && this.protocol === 4) {
            return this.onError("invalid content");
        }
        this.dataReq = req;
        this.dataRes = res;
        let chunks = isBinary ? Buffer.concat([]) : "";
        const cleanup = () => {
            req.removeListener("data", onData);
            req.removeListener("end", onEnd);
            req.removeListener("close", onClose);
            this.dataReq = this.dataRes = chunks = null;
        };
        const onClose = () => {
            cleanup();
            this.onError("data request connection closed prematurely");
        };
        const onData = (data) => {
            let contentLength;
            if (isBinary) {
                chunks = Buffer.concat([chunks, data]);
                contentLength = chunks.length;
            }
            else {
                chunks += data;
                contentLength = Buffer.byteLength(chunks);
            }
            if (contentLength > this.maxHttpBufferSize) {
                res.writeHead(413).end();
                cleanup();
            }
        };
        const onEnd = () => {
            this.onData(chunks);
            const headers = {
                // text/html is required instead of text/plain to avoid an
                // unwanted download dialog on certain user-agents (GH-43)
                "Content-Type": "text/html",
                "Content-Length": 2,
            };
            res.writeHead(200, this.headers(req, headers));
            res.end("ok");
            cleanup();
        };
        req.on("close", onClose);
        if (!isBinary)
            req.setEncoding("utf8");
        req.on("data", onData);
        req.on("end", onEnd);
    }
    /**
     * Processes the incoming data payload.
     *
     * @param {String} encoded payload
     * @api private
     */
    onData(data) {
        debug$a('received "%s"', data);
        const callback = (packet) => {
            if ("close" === packet.type) {
                debug$a("got xhr close packet");
                this.onClose();
                return false;
            }
            this.onPacket(packet);
        };
        if (this.protocol === 3) {
            this.parser.decodePayload(data, callback);
        }
        else {
            this.parser.decodePayload(data).forEach(callback);
        }
    }
    /**
     * Overrides onClose.
     *
     * @api private
     */
    onClose() {
        if (this.writable) {
            // close pending poll request
            this.send([{ type: "noop" }]);
        }
        super.onClose();
    }
    /**
     * Writes a packet payload.
     *
     * @param {Object} packet
     * @api private
     */
    send(packets) {
        this.writable = false;
        if (this.shouldClose) {
            debug$a("appending close packet to payload");
            packets.push({ type: "close" });
            this.shouldClose();
            this.shouldClose = null;
        }
        const doWrite = (data) => {
            const compress = packets.some((packet) => {
                return packet.options && packet.options.compress;
            });
            this.write(data, { compress });
        };
        if (this.protocol === 3) {
            this.parser.encodePayload(packets, this.supportsBinary, doWrite);
        }
        else {
            this.parser.encodePayload(packets, doWrite);
        }
    }
    /**
     * Writes data as response to poll request.
     *
     * @param {String} data
     * @param {Object} options
     * @api private
     */
    write(data, options) {
        debug$a('writing "%s"', data);
        this.doWrite(data, options, () => {
            this.req.cleanup();
        });
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // explicit UTF-8 is required for pages not served under utf
        const isString = typeof data === "string";
        const contentType = isString
            ? "text/plain; charset=UTF-8"
            : "application/octet-stream";
        const headers = {
            "Content-Type": contentType,
        };
        const respond = (data) => {
            headers["Content-Length"] =
                "string" === typeof data ? Buffer.byteLength(data) : data.length;
            this.res.writeHead(200, this.headers(this.req, headers));
            this.res.end(data);
            callback();
        };
        if (!this.httpCompression || !options.compress) {
            respond(data);
            return;
        }
        const len = isString ? Buffer.byteLength(data) : data.length;
        if (len < this.httpCompression.threshold) {
            respond(data);
            return;
        }
        const encoding = accepts$1(this.req).encodings(["gzip", "deflate"]);
        if (!encoding) {
            respond(data);
            return;
        }
        this.compress(data, encoding, (err, data) => {
            if (err) {
                this.res.writeHead(500);
                this.res.end();
                callback(err);
                return;
            }
            headers["Content-Encoding"] = encoding;
            respond(data);
        });
    }
    /**
     * Compresses data.
     *
     * @api private
     */
    compress(data, encoding, callback) {
        debug$a("compressing");
        const buffers = [];
        let nread = 0;
        compressionMethods$1[encoding](this.httpCompression)
            .on("error", callback)
            .on("data", function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        })
            .on("end", function () {
            callback(null, Buffer.concat(buffers, nread));
        })
            .end(data);
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug$a("closing");
        let closeTimeoutTimer;
        if (this.dataReq) {
            debug$a("aborting ongoing data request");
            this.dataReq.destroy();
        }
        const onClose = () => {
            clearTimeout(closeTimeoutTimer);
            fn();
            this.onClose();
        };
        if (this.writable) {
            debug$a("transport writable - closing right away");
            this.send([{ type: "close" }]);
            onClose();
        }
        else if (this.discarded) {
            debug$a("transport discarded - closing right away");
            onClose();
        }
        else {
            debug$a("transport not writable - buffering orderly close");
            this.shouldClose = onClose;
            closeTimeoutTimer = setTimeout(onClose, this.closeTimeout);
        }
    }
    /**
     * Returns headers for a response.
     *
     * @param {http.IncomingMessage} request
     * @param {Object} extra headers
     * @api private
     */
    headers(req, headers) {
        headers = headers || {};
        // prevent XSS warnings on IE
        // https://github.com/LearnBoost/socket.io/pull/1333
        const ua = req.headers["user-agent"];
        if (ua && (~ua.indexOf(";MSIE") || ~ua.indexOf("Trident/"))) {
            headers["X-XSS-Protection"] = "0";
        }
        this.emit("headers", headers, req);
        return headers;
    }
}
polling$2.Polling = Polling$1;

var pollingJsonp = {};

Object.defineProperty(pollingJsonp, "__esModule", { value: true });
pollingJsonp.JSONP = void 0;
const polling_1$2 = polling$2;
const qs$1 = require$$8__default;
const rDoubleSlashes = /\\\\n/g;
const rSlashes = /(\\)?\\n/g;
class JSONP extends polling_1$2.Polling {
    /**
     * JSON-P polling transport.
     *
     * @api public
     */
    constructor(req) {
        super(req);
        this.head = "___eio[" + (req._query.j || "").replace(/[^0-9]/g, "") + "](";
        this.foot = ");";
    }
    /**
     * Handles incoming data.
     * Due to a bug in \n handling by browsers, we expect a escaped string.
     *
     * @api private
     */
    onData(data) {
        // we leverage the qs module so that we get built-in DoS protection
        // and the fast alternative to decodeURIComponent
        data = qs$1.parse(data).d;
        if ("string" === typeof data) {
            // client will send already escaped newlines as \\\\n and newlines as \\n
            // \\n must be replaced with \n and \\\\n with \\n
            data = data.replace(rSlashes, function (match, slashes) {
                return slashes ? match : "\n";
            });
            super.onData(data.replace(rDoubleSlashes, "\\n"));
        }
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // we must output valid javascript, not valid json
        // see: http://timelessrepo.com/json-isnt-a-javascript-subset
        const js = JSON.stringify(data)
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029");
        // prepare response
        data = this.head + js + this.foot;
        super.doWrite(data, options, callback);
    }
}
pollingJsonp.JSONP = JSONP;

var websocket$1 = {};

Object.defineProperty(websocket$1, "__esModule", { value: true });
websocket$1.WebSocket = void 0;
const transport_1$3 = transport;
const debug_1$8 = server$1.src.exports;
const debug$9 = (0, debug_1$8.default)("engine:ws");
class WebSocket$4 extends transport_1$3.Transport {
    /**
     * WebSocket transport
     *
     * @param {http.IncomingMessage}
     * @api public
     */
    constructor(req) {
        super(req);
        this.socket = req.websocket;
        this.socket.on("message", (data, isBinary) => {
            const message = isBinary ? data : data.toString();
            debug$9('received "%s"', message);
            super.onData(message);
        });
        this.socket.once("close", this.onClose.bind(this));
        this.socket.on("error", this.onError.bind(this));
        this.writable = true;
        this.perMessageDeflate = null;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Advertise upgrade support.
     *
     * @api public
     */
    get handlesUpgrades() {
        return true;
    }
    /**
     * Advertise framing support.
     *
     * @api public
     */
    get supportsFraming() {
        return true;
    }
    /**
     * Writes a packet payload.
     *
     * @param {Array} packets
     * @api private
     */
    send(packets) {
        this.writable = false;
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const isLast = i + 1 === packets.length;
            // always creates a new object since ws modifies it
            const opts = {};
            if (packet.options) {
                opts.compress = packet.options.compress;
            }
            const onSent = (err) => {
                if (err) {
                    return this.onError("write error", err.stack);
                }
                else if (isLast) {
                    this.writable = true;
                    this.emit("drain");
                }
            };
            const send = (data) => {
                if (this.perMessageDeflate) {
                    const len = "string" === typeof data ? Buffer.byteLength(data) : data.length;
                    if (len < this.perMessageDeflate.threshold) {
                        opts.compress = false;
                    }
                }
                debug$9('writing "%s"', data);
                this.socket.send(data, opts, onSent);
            };
            if (packet.options && typeof packet.options.wsPreEncoded === "string") {
                send(packet.options.wsPreEncoded);
            }
            else if (this._canSendPreEncodedFrame(packet)) {
                // the WebSocket frame was computed with WebSocket.Sender.frame()
                // see https://github.com/websockets/ws/issues/617#issuecomment-283002469
                this.socket._sender.sendFrame(packet.options.wsPreEncodedFrame, onSent);
            }
            else {
                this.parser.encodePacket(packet, this.supportsBinary, send);
            }
        }
    }
    /**
     * Whether the encoding of the WebSocket frame can be skipped.
     * @param packet
     * @private
     */
    _canSendPreEncodedFrame(packet) {
        var _a, _b, _c;
        return (!this.perMessageDeflate &&
            typeof ((_b = (_a = this.socket) === null || _a === void 0 ? void 0 : _a._sender) === null || _b === void 0 ? void 0 : _b.sendFrame) === "function" &&
            ((_c = packet.options) === null || _c === void 0 ? void 0 : _c.wsPreEncodedFrame) !== undefined);
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug$9("closing");
        this.socket.close();
        fn && fn();
    }
}
websocket$1.WebSocket = WebSocket$4;

var webtransport = {};

Object.defineProperty(webtransport, "__esModule", { value: true });
webtransport.WebTransport = void 0;
const transport_1$2 = transport;
const debug_1$7 = server$1.src.exports;
const debug$8 = (0, debug_1$7.default)("engine:webtransport");
const BINARY_HEADER = Buffer.of(54);
function shouldIncludeBinaryHeader(packet, encoded) {
    // 48 === "0".charCodeAt(0) (OPEN packet type)
    // 54 === "6".charCodeAt(0) (NOOP packet type)
    return (packet.type === "message" &&
        typeof packet.data !== "string" &&
        encoded[0] >= 48 &&
        encoded[0] <= 54);
}
/**
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API
 */
class WebTransport extends transport_1$2.Transport {
    constructor(session, stream, reader) {
        super({ _query: { EIO: "4" } });
        this.session = session;
        this.writer = stream.writable.getWriter();
        (async () => {
            let binaryFlag = false;
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    debug$8("session is closed");
                    break;
                }
                debug$8("received chunk: %o", value);
                if (!binaryFlag && value.byteLength === 1 && value[0] === 54) {
                    binaryFlag = true;
                    continue;
                }
                this.onPacket(this.parser.decodePacketFromBinary(value, binaryFlag, "nodebuffer"));
                binaryFlag = false;
            }
        })();
        session.closed.then(() => this.onClose());
        this.writable = true;
    }
    get name() {
        return "webtransport";
    }
    get supportsFraming() {
        return true;
    }
    send(packets) {
        this.writable = false;
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const isLast = i + 1 === packets.length;
            this.parser.encodePacketToBinary(packet, (data) => {
                if (shouldIncludeBinaryHeader(packet, data)) {
                    debug$8("writing binary header");
                    this.writer.write(BINARY_HEADER);
                }
                debug$8("writing chunk: %o", data);
                this.writer.write(data);
                if (isLast) {
                    this.writable = true;
                    this.emit("drain");
                }
            });
        }
    }
    doClose(fn) {
        debug$8("closing WebTransport session");
        this.session.close();
        fn && fn();
    }
}
webtransport.WebTransport = WebTransport;

Object.defineProperty(transports, "__esModule", { value: true });
const polling_1$1 = polling$2;
const polling_jsonp_1 = pollingJsonp;
const websocket_1$1 = websocket$1;
const webtransport_1$1 = webtransport;
transports.default = {
    polling: polling$1,
    websocket: websocket_1$1.WebSocket,
    webtransport: webtransport_1$1.WebTransport,
};
/**
 * Polling polymorphic constructor.
 *
 * @api private
 */
function polling$1(req) {
    if ("string" === typeof req._query.j) {
        return new polling_jsonp_1.JSONP(req);
    }
    else {
        return new polling_1$1.Polling(req);
    }
}
polling$1.upgradesTo = ["websocket", "webtransport"];

var socket$1 = {};

Object.defineProperty(socket$1, "__esModule", { value: true });
socket$1.Socket = void 0;
const events_1$3 = require$$0__default$1;
const debug_1$6 = server$1.src.exports;
const timers_1 = require$$2__default;
const debug$7 = (0, debug_1$6.default)("engine:socket");
class Socket$1 extends events_1$3.EventEmitter {
    /**
     * Client class (abstract).
     *
     * @api private
     */
    constructor(id, server, transport, req, protocol) {
        super();
        this.id = id;
        this.server = server;
        this.upgrading = false;
        this.upgraded = false;
        this.readyState = "opening";
        this.writeBuffer = [];
        this.packetsFn = [];
        this.sentCallbackFn = [];
        this.cleanupFn = [];
        this.request = req;
        this.protocol = protocol;
        // Cache IP since it might not be in the req later
        if (req) {
            if (req.websocket && req.websocket._socket) {
                this.remoteAddress = req.websocket._socket.remoteAddress;
            }
            else {
                this.remoteAddress = req.connection.remoteAddress;
            }
        }
        this.checkIntervalTimer = null;
        this.upgradeTimeoutTimer = null;
        this.pingTimeoutTimer = null;
        this.pingIntervalTimer = null;
        this.setTransport(transport);
        this.onOpen();
    }
    get readyState() {
        return this._readyState;
    }
    set readyState(state) {
        debug$7("readyState updated from %s to %s", this._readyState, state);
        this._readyState = state;
    }
    /**
     * Called upon transport considered open.
     *
     * @api private
     */
    onOpen() {
        this.readyState = "open";
        // sends an `open` packet
        this.transport.sid = this.id;
        this.sendPacket("open", JSON.stringify({
            sid: this.id,
            upgrades: this.getAvailableUpgrades(),
            pingInterval: this.server.opts.pingInterval,
            pingTimeout: this.server.opts.pingTimeout,
            maxPayload: this.server.opts.maxHttpBufferSize,
        }));
        if (this.server.opts.initialPacket) {
            this.sendPacket("message", this.server.opts.initialPacket);
        }
        this.emit("open");
        if (this.protocol === 3) {
            // in protocol v3, the client sends a ping, and the server answers with a pong
            this.resetPingTimeout(this.server.opts.pingInterval + this.server.opts.pingTimeout);
        }
        else {
            // in protocol v4, the server sends a ping, and the client answers with a pong
            this.schedulePing();
        }
    }
    /**
     * Called upon transport packet.
     *
     * @param {Object} packet
     * @api private
     */
    onPacket(packet) {
        if ("open" !== this.readyState) {
            return debug$7("packet received with closed socket");
        }
        // export packet event
        debug$7(`received packet ${packet.type}`);
        this.emit("packet", packet);
        // Reset ping timeout on any packet, incoming data is a good sign of
        // other side's liveness
        this.resetPingTimeout(this.server.opts.pingInterval + this.server.opts.pingTimeout);
        switch (packet.type) {
            case "ping":
                if (this.transport.protocol !== 3) {
                    this.onError("invalid heartbeat direction");
                    return;
                }
                debug$7("got ping");
                this.sendPacket("pong");
                this.emit("heartbeat");
                break;
            case "pong":
                if (this.transport.protocol === 3) {
                    this.onError("invalid heartbeat direction");
                    return;
                }
                debug$7("got pong");
                this.pingIntervalTimer.refresh();
                this.emit("heartbeat");
                break;
            case "error":
                this.onClose("parse error");
                break;
            case "message":
                this.emit("data", packet.data);
                this.emit("message", packet.data);
                break;
        }
    }
    /**
     * Called upon transport error.
     *
     * @param {Error} error object
     * @api private
     */
    onError(err) {
        debug$7("transport error");
        this.onClose("transport error", err);
    }
    /**
     * Pings client every `this.pingInterval` and expects response
     * within `this.pingTimeout` or closes connection.
     *
     * @api private
     */
    schedulePing() {
        this.pingIntervalTimer = (0, timers_1.setTimeout)(() => {
            debug$7("writing ping packet - expecting pong within %sms", this.server.opts.pingTimeout);
            this.sendPacket("ping");
            this.resetPingTimeout(this.server.opts.pingTimeout);
        }, this.server.opts.pingInterval);
    }
    /**
     * Resets ping timeout.
     *
     * @api private
     */
    resetPingTimeout(timeout) {
        (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
        this.pingTimeoutTimer = (0, timers_1.setTimeout)(() => {
            if (this.readyState === "closed")
                return;
            this.onClose("ping timeout");
        }, timeout);
    }
    /**
     * Attaches handlers for the given transport.
     *
     * @param {Transport} transport
     * @api private
     */
    setTransport(transport) {
        const onError = this.onError.bind(this);
        const onPacket = this.onPacket.bind(this);
        const flush = this.flush.bind(this);
        const onClose = this.onClose.bind(this, "transport close");
        this.transport = transport;
        this.transport.once("error", onError);
        this.transport.on("packet", onPacket);
        this.transport.on("drain", flush);
        this.transport.once("close", onClose);
        // this function will manage packet events (also message callbacks)
        this.setupSendCallback();
        this.cleanupFn.push(function () {
            transport.removeListener("error", onError);
            transport.removeListener("packet", onPacket);
            transport.removeListener("drain", flush);
            transport.removeListener("close", onClose);
        });
    }
    /**
     * Upgrades socket to the given transport
     *
     * @param {Transport} transport
     * @api private
     */
    maybeUpgrade(transport) {
        debug$7('might upgrade socket transport from "%s" to "%s"', this.transport.name, transport.name);
        this.upgrading = true;
        // set transport upgrade timer
        this.upgradeTimeoutTimer = (0, timers_1.setTimeout)(() => {
            debug$7("client did not complete upgrade - closing transport");
            cleanup();
            if ("open" === transport.readyState) {
                transport.close();
            }
        }, this.server.opts.upgradeTimeout);
        const onPacket = (packet) => {
            if ("ping" === packet.type && "probe" === packet.data) {
                debug$7("got probe ping packet, sending pong");
                transport.send([{ type: "pong", data: "probe" }]);
                this.emit("upgrading", transport);
                clearInterval(this.checkIntervalTimer);
                this.checkIntervalTimer = setInterval(check, 100);
            }
            else if ("upgrade" === packet.type && this.readyState !== "closed") {
                debug$7("got upgrade packet - upgrading");
                cleanup();
                this.transport.discard();
                this.upgraded = true;
                this.clearTransport();
                this.setTransport(transport);
                this.emit("upgrade", transport);
                this.flush();
                if (this.readyState === "closing") {
                    transport.close(() => {
                        this.onClose("forced close");
                    });
                }
            }
            else {
                cleanup();
                transport.close();
            }
        };
        // we force a polling cycle to ensure a fast upgrade
        const check = () => {
            if ("polling" === this.transport.name && this.transport.writable) {
                debug$7("writing a noop packet to polling for fast upgrade");
                this.transport.send([{ type: "noop" }]);
            }
        };
        const cleanup = () => {
            this.upgrading = false;
            clearInterval(this.checkIntervalTimer);
            this.checkIntervalTimer = null;
            (0, timers_1.clearTimeout)(this.upgradeTimeoutTimer);
            this.upgradeTimeoutTimer = null;
            transport.removeListener("packet", onPacket);
            transport.removeListener("close", onTransportClose);
            transport.removeListener("error", onError);
            this.removeListener("close", onClose);
        };
        const onError = (err) => {
            debug$7("client did not complete upgrade - %s", err);
            cleanup();
            transport.close();
            transport = null;
        };
        const onTransportClose = () => {
            onError("transport closed");
        };
        const onClose = () => {
            onError("socket closed");
        };
        transport.on("packet", onPacket);
        transport.once("close", onTransportClose);
        transport.once("error", onError);
        this.once("close", onClose);
    }
    /**
     * Clears listeners and timers associated with current transport.
     *
     * @api private
     */
    clearTransport() {
        let cleanup;
        const toCleanUp = this.cleanupFn.length;
        for (let i = 0; i < toCleanUp; i++) {
            cleanup = this.cleanupFn.shift();
            cleanup();
        }
        // silence further transport errors and prevent uncaught exceptions
        this.transport.on("error", function () {
            debug$7("error triggered by discarded transport");
        });
        // ensure transport won't stay open
        this.transport.close();
        (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
    }
    /**
     * Called upon transport considered closed.
     * Possible reasons: `ping timeout`, `client error`, `parse error`,
     * `transport error`, `server close`, `transport close`
     */
    onClose(reason, description) {
        if ("closed" !== this.readyState) {
            this.readyState = "closed";
            // clear timers
            (0, timers_1.clearTimeout)(this.pingIntervalTimer);
            (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
            clearInterval(this.checkIntervalTimer);
            this.checkIntervalTimer = null;
            (0, timers_1.clearTimeout)(this.upgradeTimeoutTimer);
            // clean writeBuffer in next tick, so developers can still
            // grab the writeBuffer on 'close' event
            process.nextTick(() => {
                this.writeBuffer = [];
            });
            this.packetsFn = [];
            this.sentCallbackFn = [];
            this.clearTransport();
            this.emit("close", reason, description);
        }
    }
    /**
     * Setup and manage send callback
     *
     * @api private
     */
    setupSendCallback() {
        // the message was sent successfully, execute the callback
        const onDrain = () => {
            if (this.sentCallbackFn.length > 0) {
                const seqFn = this.sentCallbackFn.splice(0, 1)[0];
                if ("function" === typeof seqFn) {
                    debug$7("executing send callback");
                    seqFn(this.transport);
                }
                else if (Array.isArray(seqFn)) {
                    debug$7("executing batch send callback");
                    const l = seqFn.length;
                    let i = 0;
                    for (; i < l; i++) {
                        if ("function" === typeof seqFn[i]) {
                            seqFn[i](this.transport);
                        }
                    }
                }
            }
        };
        this.transport.on("drain", onDrain);
        this.cleanupFn.push(() => {
            this.transport.removeListener("drain", onDrain);
        });
    }
    /**
     * Sends a message packet.
     *
     * @param {Object} data
     * @param {Object} options
     * @param {Function} callback
     * @return {Socket} for chaining
     * @api public
     */
    send(data, options, callback) {
        this.sendPacket("message", data, options, callback);
        return this;
    }
    /**
     * Alias of {@link send}.
     *
     * @param data
     * @param options
     * @param callback
     */
    write(data, options, callback) {
        this.sendPacket("message", data, options, callback);
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param {String} type - packet type
     * @param {String} data
     * @param {Object} options
     * @param {Function} callback
     *
     * @api private
     */
    sendPacket(type, data, options = {}, callback) {
        if ("function" === typeof options) {
            callback = options;
            options = {};
        }
        if ("closing" !== this.readyState && "closed" !== this.readyState) {
            debug$7('sending packet "%s" (%s)', type, data);
            // compression is enabled by default
            options.compress = options.compress !== false;
            const packet = {
                type,
                options: options,
            };
            if (data)
                packet.data = data;
            // exports packetCreate event
            this.emit("packetCreate", packet);
            this.writeBuffer.push(packet);
            // add send callback to object, if defined
            if (callback)
                this.packetsFn.push(callback);
            this.flush();
        }
    }
    /**
     * Attempts to flush the packets buffer.
     *
     * @api private
     */
    flush() {
        if ("closed" !== this.readyState &&
            this.transport.writable &&
            this.writeBuffer.length) {
            debug$7("flushing buffer to transport");
            this.emit("flush", this.writeBuffer);
            this.server.emit("flush", this, this.writeBuffer);
            const wbuf = this.writeBuffer;
            this.writeBuffer = [];
            if (!this.transport.supportsFraming) {
                this.sentCallbackFn.push(this.packetsFn);
            }
            else {
                this.sentCallbackFn.push.apply(this.sentCallbackFn, this.packetsFn);
            }
            this.packetsFn = [];
            this.transport.send(wbuf);
            this.emit("drain");
            this.server.emit("drain", this);
        }
    }
    /**
     * Get available upgrades for this socket.
     *
     * @api private
     */
    getAvailableUpgrades() {
        const availableUpgrades = [];
        const allUpgrades = this.server.upgrades(this.transport.name);
        let i = 0;
        const l = allUpgrades.length;
        for (; i < l; ++i) {
            const upg = allUpgrades[i];
            if (this.server.opts.transports.indexOf(upg) !== -1) {
                availableUpgrades.push(upg);
            }
        }
        return availableUpgrades;
    }
    /**
     * Closes the socket and underlying transport.
     *
     * @param {Boolean} discard - optional, discard the transport
     * @return {Socket} for chaining
     * @api public
     */
    close(discard) {
        if ("open" !== this.readyState)
            return;
        this.readyState = "closing";
        if (this.writeBuffer.length) {
            debug$7("there are %d remaining packets in the buffer, waiting for the 'drain' event", this.writeBuffer.length);
            this.once("drain", () => {
                debug$7("all packets have been sent, closing the transport");
                this.closeTransport(discard);
            });
            return;
        }
        debug$7("the buffer is empty, closing the transport right away", discard);
        this.closeTransport(discard);
    }
    /**
     * Closes the underlying transport.
     *
     * @param {Boolean} discard
     * @api private
     */
    closeTransport(discard) {
        debug$7("closing the transport (discard? %s)", discard);
        if (discard)
            this.transport.discard();
        this.transport.close(this.onClose.bind(this, "forced close"));
    }
}
socket$1.Socket = Socket$1;

var cookie = {};

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

cookie.parse = parse$1;
cookie.serialize = serialize;

/**
 * Module variables.
 * @private
 */

var decode$1 = decodeURIComponent;
var encode$1 = encodeURIComponent;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse$1(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(';');
  var dec = opt.decode || decode$1;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var index = pair.indexOf('=');

    // skip things that don't look like key=value
    if (index < 0) {
      continue;
    }

    var key = pair.substring(0, index).trim();

    // only assign once
    if (undefined == obj[key]) {
      var val = pair.substring(index + 1, pair.length).trim();

      // quoted values
      if (val[0] === '"') {
        val = val.slice(1, -1);
      }

      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode$1;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

const { Duplex } = require$$0__default$2;

/**
 * Emits the `'close'` event on a stream.
 *
 * @param {Duplex} stream The stream.
 * @private
 */
function emitClose$1(stream) {
  stream.emit('close');
}

/**
 * The listener of the `'end'` event.
 *
 * @private
 */
function duplexOnEnd() {
  if (!this.destroyed && this._writableState.finished) {
    this.destroy();
  }
}

/**
 * The listener of the `'error'` event.
 *
 * @param {Error} err The error
 * @private
 */
function duplexOnError(err) {
  this.removeListener('error', duplexOnError);
  this.destroy();
  if (this.listenerCount('error') === 0) {
    // Do not suppress the throwing behavior.
    this.emit('error', err);
  }
}

/**
 * Wraps a `WebSocket` in a duplex stream.
 *
 * @param {WebSocket} ws The `WebSocket` to wrap
 * @param {Object} [options] The options for the `Duplex` constructor
 * @return {Duplex} The duplex stream
 * @public
 */
function createWebSocketStream(ws, options) {
  let terminateOnDestroy = true;

  const duplex = new Duplex({
    ...options,
    autoDestroy: false,
    emitClose: false,
    objectMode: false,
    writableObjectMode: false
  });

  ws.on('message', function message(msg, isBinary) {
    const data =
      !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;

    if (!duplex.push(data)) ws.pause();
  });

  ws.once('error', function error(err) {
    if (duplex.destroyed) return;

    // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
    //
    // - If the `'error'` event is emitted before the `'open'` event, then
    //   `ws.terminate()` is a noop as no socket is assigned.
    // - Otherwise, the error is re-emitted by the listener of the `'error'`
    //   event of the `Receiver` object. The listener already closes the
    //   connection by calling `ws.close()`. This allows a close frame to be
    //   sent to the other peer. If `ws.terminate()` is called right after this,
    //   then the close frame might not be sent.
    terminateOnDestroy = false;
    duplex.destroy(err);
  });

  ws.once('close', function close() {
    if (duplex.destroyed) return;

    duplex.push(null);
  });

  duplex._destroy = function (err, callback) {
    if (ws.readyState === ws.CLOSED) {
      callback(err);
      process.nextTick(emitClose$1, duplex);
      return;
    }

    let called = false;

    ws.once('error', function error(err) {
      called = true;
      callback(err);
    });

    ws.once('close', function close() {
      if (!called) callback(err);
      process.nextTick(emitClose$1, duplex);
    });

    if (terminateOnDestroy) ws.terminate();
  };

  duplex._final = function (callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._final(callback);
      });
      return;
    }

    // If the value of the `_socket` property is `null` it means that `ws` is a
    // client websocket and the handshake failed. In fact, when this happens, a
    // socket is never assigned to the websocket. Wait for the `'error'` event
    // that will be emitted by the websocket.
    if (ws._socket === null) return;

    if (ws._socket._writableState.finished) {
      callback();
      if (duplex._readableState.endEmitted) duplex.destroy();
    } else {
      ws._socket.once('finish', function finish() {
        // `duplex` is not destroyed here because the `'end'` event will be
        // emitted on `duplex` after this `'finish'` event. The EOF signaling
        // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
        callback();
      });
      ws.close();
    }
  };

  duplex._read = function () {
    if (ws.isPaused) ws.resume();
  };

  duplex._write = function (chunk, encoding, callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._write(chunk, encoding, callback);
      });
      return;
    }

    ws.send(chunk, callback);
  };

  duplex.on('end', duplexOnEnd);
  duplex.on('error', duplexOnError);
  return duplex;
}

var stream = createWebSocketStream;

const { tokenChars } = index.validation.exports;

/**
 * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
 *
 * @param {String} header The field value of the header
 * @return {Set} The subprotocol names
 * @public
 */
function parse(header) {
  const protocols = new Set();
  let start = -1;
  let end = -1;
  let i = 0;

  for (i; i < header.length; i++) {
    const code = header.charCodeAt(i);

    if (end === -1 && tokenChars[code] === 1) {
      if (start === -1) start = i;
    } else if (
      i !== 0 &&
      (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
    ) {
      if (end === -1 && start !== -1) end = i;
    } else if (code === 0x2c /* ',' */) {
      if (start === -1) {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }

      if (end === -1) end = i;

      const protocol = header.slice(start, end);

      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }

      protocols.add(protocol);
      start = end = -1;
    } else {
      throw new SyntaxError(`Unexpected character at index ${i}`);
    }
  }

  if (start === -1 || end !== -1) {
    throw new SyntaxError('Unexpected end of input');
  }

  const protocol = header.slice(start, i);

  if (protocols.has(protocol)) {
    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
  }

  protocols.add(protocol);
  return protocols;
}

var subprotocol$1 = { parse };

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls|https$" }] */

const EventEmitter = require$$0__default$1;
const http = require$$0__default$3;
const { createHash } = require$$0__default;

const extension = index.extension;
const PerMessageDeflate = index.permessageDeflate;
const subprotocol = subprotocol$1;
const WebSocket$3 = index.websocket;
const { GUID, kWebSocket } = index.constants;

const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

const RUNNING = 0;
const CLOSING = 1;
const CLOSED = 2;

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {Number} [options.backlog=511] The maximum length of the queue of
   *     pending connections
   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
   *     track clients
   * @param {Function} [options.handleProtocols] A hook to handle protocols
   * @param {String} [options.host] The hostname where to bind the server
   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
   *     size
   * @param {Boolean} [options.noServer=false] Enable no server mode
   * @param {String} [options.path] Accept only connections matching this path
   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
   *     permessage-deflate
   * @param {Number} [options.port] The port where to bind the server
   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
   *     server to use
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   * @param {Function} [options.verifyClient] A hook to reject connections
   * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
   *     class to use. It must be the `WebSocket` class or class that extends it
   * @param {Function} [callback] A listener for the `listening` event
   */
  constructor(options, callback) {
    super();

    options = {
      maxPayload: 100 * 1024 * 1024,
      skipUTF8Validation: false,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null,
      WebSocket: WebSocket$3,
      ...options
    };

    if (
      (options.port == null && !options.server && !options.noServer) ||
      (options.port != null && (options.server || options.noServer)) ||
      (options.server && options.noServer)
    ) {
      throw new TypeError(
        'One and only one of the "port", "server", or "noServer" options ' +
          'must be specified'
      );
    }

    if (options.port != null) {
      this._server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.listen(
        options.port,
        options.host,
        options.backlog,
        callback
      );
    } else if (options.server) {
      this._server = options.server;
    }

    if (this._server) {
      const emitConnection = this.emit.bind(this, 'connection');

      this._removeListeners = addListeners(this._server, {
        listening: this.emit.bind(this, 'listening'),
        error: this.emit.bind(this, 'error'),
        upgrade: (req, socket, head) => {
          this.handleUpgrade(req, socket, head, emitConnection);
        }
      });
    }

    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
    if (options.clientTracking) {
      this.clients = new Set();
      this._shouldEmitClose = false;
    }

    this.options = options;
    this._state = RUNNING;
  }

  /**
   * Returns the bound address, the address family name, and port of the server
   * as reported by the operating system if listening on an IP socket.
   * If the server is listening on a pipe or UNIX domain socket, the name is
   * returned as a string.
   *
   * @return {(Object|String|null)} The address of the server
   * @public
   */
  address() {
    if (this.options.noServer) {
      throw new Error('The server is operating in "noServer" mode');
    }

    if (!this._server) return null;
    return this._server.address();
  }

  /**
   * Stop the server from accepting new connections and emit the `'close'` event
   * when all existing connections are closed.
   *
   * @param {Function} [cb] A one-time listener for the `'close'` event
   * @public
   */
  close(cb) {
    if (this._state === CLOSED) {
      if (cb) {
        this.once('close', () => {
          cb(new Error('The server is not running'));
        });
      }

      process.nextTick(emitClose, this);
      return;
    }

    if (cb) this.once('close', cb);

    if (this._state === CLOSING) return;
    this._state = CLOSING;

    if (this.options.noServer || this.options.server) {
      if (this._server) {
        this._removeListeners();
        this._removeListeners = this._server = null;
      }

      if (this.clients) {
        if (!this.clients.size) {
          process.nextTick(emitClose, this);
        } else {
          this._shouldEmitClose = true;
        }
      } else {
        process.nextTick(emitClose, this);
      }
    } else {
      const server = this._server;

      this._removeListeners();
      this._removeListeners = this._server = null;

      //
      // The HTTP/S server was created internally. Close it, and rely on its
      // `'close'` event.
      //
      server.close(() => {
        emitClose(this);
      });
    }
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle(req) {
    if (this.options.path) {
      const index = req.url.indexOf('?');
      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

      if (pathname !== this.options.path) return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {(net.Socket|tls.Socket)} socket The network socket between the
   *     server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade(req, socket, head, cb) {
    socket.on('error', socketOnError);

    const key = req.headers['sec-websocket-key'];
    const version = +req.headers['sec-websocket-version'];

    if (req.method !== 'GET') {
      const message = 'Invalid HTTP method';
      abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
      return;
    }

    if (req.headers.upgrade.toLowerCase() !== 'websocket') {
      const message = 'Invalid Upgrade header';
      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
      return;
    }

    if (!key || !keyRegex.test(key)) {
      const message = 'Missing or invalid Sec-WebSocket-Key header';
      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
      return;
    }

    if (version !== 8 && version !== 13) {
      const message = 'Missing or invalid Sec-WebSocket-Version header';
      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
      return;
    }

    if (!this.shouldHandle(req)) {
      abortHandshake(socket, 400);
      return;
    }

    const secWebSocketProtocol = req.headers['sec-websocket-protocol'];
    let protocols = new Set();

    if (secWebSocketProtocol !== undefined) {
      try {
        protocols = subprotocol.parse(secWebSocketProtocol);
      } catch (err) {
        const message = 'Invalid Sec-WebSocket-Protocol header';
        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
        return;
      }
    }

    const secWebSocketExtensions = req.headers['sec-websocket-extensions'];
    const extensions = {};

    if (
      this.options.perMessageDeflate &&
      secWebSocketExtensions !== undefined
    ) {
      const perMessageDeflate = new PerMessageDeflate(
        this.options.perMessageDeflate,
        true,
        this.options.maxPayload
      );

      try {
        const offers = extension.parse(secWebSocketExtensions);

        if (offers[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        const message =
          'Invalid or unacceptable Sec-WebSocket-Extensions header';
        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
        return;
      }
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin:
          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.socket.authorized || req.socket.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message, headers) => {
          if (!verified) {
            return abortHandshake(socket, code || 401, message, headers);
          }

          this.completeUpgrade(
            extensions,
            key,
            protocols,
            req,
            socket,
            head,
            cb
          );
        });
        return;
      }

      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
    }

    this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {Object} extensions The accepted extensions
   * @param {String} key The value of the `Sec-WebSocket-Key` header
   * @param {Set} protocols The subprotocols
   * @param {http.IncomingMessage} req The request object
   * @param {(net.Socket|tls.Socket)} socket The network socket between the
   *     server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @throws {Error} If called more than once with the same socket
   * @private
   */
  completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    if (socket[kWebSocket]) {
      throw new Error(
        'server.handleUpgrade() was called more than once with the same ' +
          'socket, possibly due to a misconfiguration'
      );
    }

    if (this._state > RUNNING) return abortHandshake(socket, 503);

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${digest}`
    ];

    const ws = new this.options.WebSocket(null);

    if (protocols.size) {
      //
      // Optionally call external protocol selection handler.
      //
      const protocol = this.options.handleProtocols
        ? this.options.handleProtocols(protocols, req)
        : protocols.values().next().value;

      if (protocol) {
        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
        ws._protocol = protocol;
      }
    }

    if (extensions[PerMessageDeflate.extensionName]) {
      const params = extensions[PerMessageDeflate.extensionName].params;
      const value = extension.format({
        [PerMessageDeflate.extensionName]: [params]
      });
      headers.push(`Sec-WebSocket-Extensions: ${value}`);
      ws._extensions = extensions;
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('\r\n').join('\r\n'));
    socket.removeListener('error', socketOnError);

    ws.setSocket(socket, head, {
      maxPayload: this.options.maxPayload,
      skipUTF8Validation: this.options.skipUTF8Validation
    });

    if (this.clients) {
      this.clients.add(ws);
      ws.on('close', () => {
        this.clients.delete(ws);

        if (this._shouldEmitClose && !this.clients.size) {
          process.nextTick(emitClose, this);
        }
      });
    }

    cb(ws, req);
  }
}

var websocketServer = WebSocketServer;

/**
 * Add event listeners on an `EventEmitter` using a map of <event, listener>
 * pairs.
 *
 * @param {EventEmitter} server The event emitter
 * @param {Object.<String, Function>} map The listeners to add
 * @return {Function} A function that will remove the added listeners when
 *     called
 * @private
 */
function addListeners(server, map) {
  for (const event of Object.keys(map)) server.on(event, map[event]);

  return function removeListeners() {
    for (const event of Object.keys(map)) {
      server.removeListener(event, map[event]);
    }
  };
}

/**
 * Emit a `'close'` event on an `EventEmitter`.
 *
 * @param {EventEmitter} server The event emitter
 * @private
 */
function emitClose(server) {
  server._state = CLOSED;
  server.emit('close');
}

/**
 * Handle socket errors.
 *
 * @private
 */
function socketOnError() {
  this.destroy();
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @param {Object} [headers] Additional HTTP response headers
 * @private
 */
function abortHandshake(socket, code, message, headers) {
  //
  // The socket is writable unless the user destroyed or ended it before calling
  // `server.handleUpgrade()` or in the `verifyClient` function, which is a user
  // error. Handling this does not make much sense as the worst that can happen
  // is that some of the data written by the user might be discarded due to the
  // call to `socket.end()` below, which triggers an `'error'` event that in
  // turn causes the socket to be destroyed.
  //
  message = message || http.STATUS_CODES[code];
  headers = {
    Connection: 'close',
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(message),
    ...headers
  };

  socket.once('finish', socket.destroy);

  socket.end(
    `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
      Object.keys(headers)
        .map((h) => `${h}: ${headers[h]}`)
        .join('\r\n') +
      '\r\n\r\n' +
      message
  );
}

/**
 * Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
 * one listener for it, otherwise call `abortHandshake()`.
 *
 * @param {WebSocketServer} server The WebSocket server
 * @param {http.IncomingMessage} req The request object
 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} message The HTTP response body
 * @private
 */
function abortHandshakeOrEmitwsClientError(server, req, socket, code, message) {
  if (server.listenerCount('wsClientError')) {
    const err = new Error(message);
    Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);

    server.emit('wsClientError', err, socket, req);
  } else {
    abortHandshake(socket, code, message);
  }
}

const WebSocket$2 = index.websocket;

WebSocket$2.createWebSocketStream = stream;
WebSocket$2.Server = websocketServer;
WebSocket$2.Receiver = index.receiver;
WebSocket$2.Sender = index.sender;

WebSocket$2.WebSocket = WebSocket$2;
WebSocket$2.WebSocketServer = WebSocket$2.Server;

var ws = WebSocket$2;

Object.defineProperty(server, "__esModule", { value: true });
server.Server = server.BaseServer = void 0;
const qs = require$$8__default;
const url_1 = require$$0__default$4;
const base64id = base64id$1.exports;
const transports_1 = transports;
const events_1$2 = require$$0__default$1;
const socket_1 = socket$1;
const debug_1$5 = server$1.src.exports;
const cookie_1 = cookie;
const ws_1 = ws;
const webtransport_1 = webtransport;
const debug$6 = (0, debug_1$5.default)("engine");
const kResponseHeaders = Symbol("responseHeaders");
const TEXT_DECODER = new TextDecoder();
function parseSessionId(handshake) {
    if (handshake.startsWith("0{")) {
        try {
            const parsed = JSON.parse(handshake.substring(1));
            if (typeof parsed.sid === "string") {
                return parsed.sid;
            }
        }
        catch (e) { }
    }
}
class BaseServer extends events_1$2.EventEmitter {
    /**
     * Server constructor.
     *
     * @param {Object} opts - options
     * @api public
     */
    constructor(opts = {}) {
        super();
        this.middlewares = [];
        this.clients = {};
        this.clientsCount = 0;
        this.opts = Object.assign({
            wsEngine: ws_1.Server,
            pingTimeout: 20000,
            pingInterval: 25000,
            upgradeTimeout: 10000,
            maxHttpBufferSize: 1e6,
            transports: ["polling", "websocket"],
            allowUpgrades: true,
            httpCompression: {
                threshold: 1024,
            },
            cors: false,
            allowEIO3: false,
        }, opts);
        if (opts.cookie) {
            this.opts.cookie = Object.assign({
                name: "io",
                path: "/",
                // @ts-ignore
                httpOnly: opts.cookie.path !== false,
                sameSite: "lax",
            }, opts.cookie);
        }
        if (this.opts.cors) {
            this.use(server$1.lib.exports(this.opts.cors));
        }
        if (opts.perMessageDeflate) {
            this.opts.perMessageDeflate = Object.assign({
                threshold: 1024,
            }, opts.perMessageDeflate);
        }
        this.init();
    }
    /**
     * Compute the pathname of the requests that are handled by the server
     * @param options
     * @protected
     */
    _computePath(options) {
        let path = (options.path || "/engine.io").replace(/\/$/, "");
        if (options.addTrailingSlash !== false) {
            // normalize path
            path += "/";
        }
        return path;
    }
    /**
     * Returns a list of available transports for upgrade given a certain transport.
     *
     * @return {Array}
     * @api public
     */
    upgrades(transport) {
        if (!this.opts.allowUpgrades)
            return [];
        return transports_1.default[transport].upgradesTo || [];
    }
    /**
     * Verifies a request.
     *
     * @param {http.IncomingMessage}
     * @return {Boolean} whether the request is valid
     * @api private
     */
    verify(req, upgrade, fn) {
        // transport check
        const transport = req._query.transport;
        // WebTransport does not go through the verify() method, see the onWebTransportSession() method
        if (!~this.opts.transports.indexOf(transport) ||
            transport === "webtransport") {
            debug$6('unknown transport "%s"', transport);
            return fn(Server$1.errors.UNKNOWN_TRANSPORT, { transport });
        }
        // 'Origin' header check
        const isOriginInvalid = checkInvalidHeaderChar(req.headers.origin);
        if (isOriginInvalid) {
            const origin = req.headers.origin;
            req.headers.origin = null;
            debug$6("origin header invalid");
            return fn(Server$1.errors.BAD_REQUEST, {
                name: "INVALID_ORIGIN",
                origin,
            });
        }
        // sid check
        const sid = req._query.sid;
        if (sid) {
            if (!this.clients.hasOwnProperty(sid)) {
                debug$6('unknown sid "%s"', sid);
                return fn(Server$1.errors.UNKNOWN_SID, {
                    sid,
                });
            }
            const previousTransport = this.clients[sid].transport.name;
            if (!upgrade && previousTransport !== transport) {
                debug$6("bad request: unexpected transport without upgrade");
                return fn(Server$1.errors.BAD_REQUEST, {
                    name: "TRANSPORT_MISMATCH",
                    transport,
                    previousTransport,
                });
            }
        }
        else {
            // handshake is GET only
            if ("GET" !== req.method) {
                return fn(Server$1.errors.BAD_HANDSHAKE_METHOD, {
                    method: req.method,
                });
            }
            if (transport === "websocket" && !upgrade) {
                debug$6("invalid transport upgrade");
                return fn(Server$1.errors.BAD_REQUEST, {
                    name: "TRANSPORT_HANDSHAKE_ERROR",
                });
            }
            if (!this.opts.allowRequest)
                return fn();
            return this.opts.allowRequest(req, (message, success) => {
                if (!success) {
                    return fn(Server$1.errors.FORBIDDEN, {
                        message,
                    });
                }
                fn();
            });
        }
        fn();
    }
    /**
     * Adds a new middleware.
     *
     * @example
     * import helmet from "helmet";
     *
     * engine.use(helmet());
     *
     * @param fn
     */
    use(fn) {
        this.middlewares.push(fn);
    }
    /**
     * Apply the middlewares to the request.
     *
     * @param req
     * @param res
     * @param callback
     * @protected
     */
    _applyMiddlewares(req, res, callback) {
        if (this.middlewares.length === 0) {
            debug$6("no middleware to apply, skipping");
            return callback();
        }
        const apply = (i) => {
            debug$6("applying middleware n°%d", i + 1);
            this.middlewares[i](req, res, (err) => {
                if (err) {
                    return callback(err);
                }
                if (i + 1 < this.middlewares.length) {
                    apply(i + 1);
                }
                else {
                    callback();
                }
            });
        };
        apply(0);
    }
    /**
     * Closes all clients.
     *
     * @api public
     */
    close() {
        debug$6("closing all open clients");
        for (let i in this.clients) {
            if (this.clients.hasOwnProperty(i)) {
                this.clients[i].close(true);
            }
        }
        this.cleanup();
        return this;
    }
    /**
     * generate a socket id.
     * Overwrite this method to generate your custom socket id
     *
     * @param {Object} request object
     * @api public
     */
    generateId(req) {
        return base64id.generateId();
    }
    /**
     * Handshakes a new client.
     *
     * @param {String} transport name
     * @param {Object} request object
     * @param {Function} closeConnection
     *
     * @api protected
     */
    async handshake(transportName, req, closeConnection) {
        const protocol = req._query.EIO === "4" ? 4 : 3; // 3rd revision by default
        if (protocol === 3 && !this.opts.allowEIO3) {
            debug$6("unsupported protocol version");
            this.emit("connection_error", {
                req,
                code: Server$1.errors.UNSUPPORTED_PROTOCOL_VERSION,
                message: Server$1.errorMessages[Server$1.errors.UNSUPPORTED_PROTOCOL_VERSION],
                context: {
                    protocol,
                },
            });
            closeConnection(Server$1.errors.UNSUPPORTED_PROTOCOL_VERSION);
            return;
        }
        let id;
        try {
            id = await this.generateId(req);
        }
        catch (e) {
            debug$6("error while generating an id");
            this.emit("connection_error", {
                req,
                code: Server$1.errors.BAD_REQUEST,
                message: Server$1.errorMessages[Server$1.errors.BAD_REQUEST],
                context: {
                    name: "ID_GENERATION_ERROR",
                    error: e,
                },
            });
            closeConnection(Server$1.errors.BAD_REQUEST);
            return;
        }
        debug$6('handshaking client "%s"', id);
        try {
            var transport = this.createTransport(transportName, req);
            if ("polling" === transportName) {
                transport.maxHttpBufferSize = this.opts.maxHttpBufferSize;
                transport.httpCompression = this.opts.httpCompression;
            }
            else if ("websocket" === transportName) {
                transport.perMessageDeflate = this.opts.perMessageDeflate;
            }
            if (req._query && req._query.b64) {
                transport.supportsBinary = false;
            }
            else {
                transport.supportsBinary = true;
            }
        }
        catch (e) {
            debug$6('error handshaking to transport "%s"', transportName);
            this.emit("connection_error", {
                req,
                code: Server$1.errors.BAD_REQUEST,
                message: Server$1.errorMessages[Server$1.errors.BAD_REQUEST],
                context: {
                    name: "TRANSPORT_HANDSHAKE_ERROR",
                    error: e,
                },
            });
            closeConnection(Server$1.errors.BAD_REQUEST);
            return;
        }
        const socket = new socket_1.Socket(id, this, transport, req, protocol);
        transport.on("headers", (headers, req) => {
            const isInitialRequest = !req._query.sid;
            if (isInitialRequest) {
                if (this.opts.cookie) {
                    headers["Set-Cookie"] = [
                        // @ts-ignore
                        (0, cookie_1.serialize)(this.opts.cookie.name, id, this.opts.cookie),
                    ];
                }
                this.emit("initial_headers", headers, req);
            }
            this.emit("headers", headers, req);
        });
        transport.onRequest(req);
        this.clients[id] = socket;
        this.clientsCount++;
        socket.once("close", () => {
            delete this.clients[id];
            this.clientsCount--;
        });
        this.emit("connection", socket);
        return transport;
    }
    async onWebTransportSession(session) {
        const timeout = setTimeout(() => {
            debug$6("the client failed to establish a bidirectional stream in the given period");
            session.close();
        }, this.opts.upgradeTimeout);
        const streamReader = session.incomingBidirectionalStreams.getReader();
        const result = await streamReader.read();
        if (result.done) {
            debug$6("session is closed");
            return;
        }
        const stream = result.value;
        const reader = stream.readable.getReader();
        // reading the first packet of the stream
        const { value, done } = await reader.read();
        if (done) {
            debug$6("stream is closed");
            return;
        }
        clearTimeout(timeout);
        const handshake = TEXT_DECODER.decode(value);
        // handshake is either
        // "0" => new session
        // '0{"sid":"xxxx"}' => upgrade
        if (handshake === "0") {
            const transport = new webtransport_1.WebTransport(session, stream, reader);
            // note: we cannot use "this.generateId()", because there is no "req" argument
            const id = base64id.generateId();
            debug$6('handshaking client "%s" (WebTransport)', id);
            const socket = new socket_1.Socket(id, this, transport, null, 4);
            this.clients[id] = socket;
            this.clientsCount++;
            socket.once("close", () => {
                delete this.clients[id];
                this.clientsCount--;
            });
            this.emit("connection", socket);
            return;
        }
        const sid = parseSessionId(handshake);
        if (!sid) {
            debug$6("invalid WebTransport handshake");
            return session.close();
        }
        const client = this.clients[sid];
        if (!client) {
            debug$6("upgrade attempt for closed client");
            session.close();
        }
        else if (client.upgrading) {
            debug$6("transport has already been trying to upgrade");
            session.close();
        }
        else if (client.upgraded) {
            debug$6("transport had already been upgraded");
            session.close();
        }
        else {
            debug$6("upgrading existing transport");
            const transport = new webtransport_1.WebTransport(session, stream, reader);
            client.maybeUpgrade(transport);
        }
    }
}
server.BaseServer = BaseServer;
/**
 * Protocol errors mappings.
 */
BaseServer.errors = {
    UNKNOWN_TRANSPORT: 0,
    UNKNOWN_SID: 1,
    BAD_HANDSHAKE_METHOD: 2,
    BAD_REQUEST: 3,
    FORBIDDEN: 4,
    UNSUPPORTED_PROTOCOL_VERSION: 5,
};
BaseServer.errorMessages = {
    0: "Transport unknown",
    1: "Session ID unknown",
    2: "Bad handshake method",
    3: "Bad request",
    4: "Forbidden",
    5: "Unsupported protocol version",
};
/**
 * Exposes a subset of the http.ServerResponse interface, in order to be able to apply the middlewares to an upgrade
 * request.
 *
 * @see https://nodejs.org/api/http.html#class-httpserverresponse
 */
class WebSocketResponse {
    constructor(req, socket) {
        this.req = req;
        this.socket = socket;
        // temporarily store the response headers on the req object (see the "headers" event)
        req[kResponseHeaders] = {};
    }
    setHeader(name, value) {
        this.req[kResponseHeaders][name] = value;
    }
    getHeader(name) {
        return this.req[kResponseHeaders][name];
    }
    removeHeader(name) {
        delete this.req[kResponseHeaders][name];
    }
    write() { }
    writeHead() { }
    end() {
        // we could return a proper error code, but the WebSocket client will emit an "error" event anyway.
        this.socket.destroy();
    }
}
class Server$1 extends BaseServer {
    /**
     * Initialize websocket server
     *
     * @api protected
     */
    init() {
        if (!~this.opts.transports.indexOf("websocket"))
            return;
        if (this.ws)
            this.ws.close();
        this.ws = new this.opts.wsEngine({
            noServer: true,
            clientTracking: false,
            perMessageDeflate: this.opts.perMessageDeflate,
            maxPayload: this.opts.maxHttpBufferSize,
        });
        if (typeof this.ws.on === "function") {
            this.ws.on("headers", (headersArray, req) => {
                // note: 'ws' uses an array of headers, while Engine.IO uses an object (response.writeHead() accepts both formats)
                // we could also try to parse the array and then sync the values, but that will be error-prone
                const additionalHeaders = req[kResponseHeaders] || {};
                delete req[kResponseHeaders];
                const isInitialRequest = !req._query.sid;
                if (isInitialRequest) {
                    this.emit("initial_headers", additionalHeaders, req);
                }
                this.emit("headers", additionalHeaders, req);
                debug$6("writing headers: %j", additionalHeaders);
                Object.keys(additionalHeaders).forEach((key) => {
                    headersArray.push(`${key}: ${additionalHeaders[key]}`);
                });
            });
        }
    }
    cleanup() {
        if (this.ws) {
            debug$6("closing webSocketServer");
            this.ws.close();
            // don't delete this.ws because it can be used again if the http server starts listening again
        }
    }
    /**
     * Prepares a request by processing the query string.
     *
     * @api private
     */
    prepare(req) {
        // try to leverage pre-existing `req._query` (e.g: from connect)
        if (!req._query) {
            req._query = ~req.url.indexOf("?") ? qs.parse((0, url_1.parse)(req.url).query) : {};
        }
    }
    createTransport(transportName, req) {
        return new transports_1.default[transportName](req);
    }
    /**
     * Handles an Engine.IO HTTP request.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @api public
     */
    handleRequest(req, res) {
        debug$6('handling "%s" http request "%s"', req.method, req.url);
        this.prepare(req);
        // @ts-ignore
        req.res = res;
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: Server$1.errorMessages[errorCode],
                    context: errorContext,
                });
                abortRequest(res, errorCode, errorContext);
                return;
            }
            // @ts-ignore
            if (req._query.sid) {
                debug$6("setting new request for existing client");
                // @ts-ignore
                this.clients[req._query.sid].transport.onRequest(req);
            }
            else {
                const closeConnection = (errorCode, errorContext) => abortRequest(res, errorCode, errorContext);
                // @ts-ignore
                this.handshake(req._query.transport, req, closeConnection);
            }
        };
        this._applyMiddlewares(req, res, (err) => {
            if (err) {
                callback(Server$1.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
            }
            else {
                this.verify(req, false, callback);
            }
        });
    }
    /**
     * Handles an Engine.IO HTTP Upgrade.
     *
     * @api public
     */
    handleUpgrade(req, socket, upgradeHead) {
        this.prepare(req);
        const res = new WebSocketResponse(req, socket);
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: Server$1.errorMessages[errorCode],
                    context: errorContext,
                });
                abortUpgrade(socket, errorCode, errorContext);
                return;
            }
            const head = Buffer.from(upgradeHead);
            upgradeHead = null;
            // some middlewares (like express-session) wait for the writeHead() call to flush their headers
            // see https://github.com/expressjs/session/blob/1010fadc2f071ddf2add94235d72224cf65159c6/index.js#L220-L244
            res.writeHead();
            // delegate to ws
            this.ws.handleUpgrade(req, socket, head, (websocket) => {
                this.onWebSocket(req, socket, websocket);
            });
        };
        this._applyMiddlewares(req, res, (err) => {
            if (err) {
                callback(Server$1.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
            }
            else {
                this.verify(req, true, callback);
            }
        });
    }
    /**
     * Called upon a ws.io connection.
     *
     * @param {ws.Socket} websocket
     * @api private
     */
    onWebSocket(req, socket, websocket) {
        websocket.on("error", onUpgradeError);
        if (transports_1.default[req._query.transport] !== undefined &&
            !transports_1.default[req._query.transport].prototype.handlesUpgrades) {
            debug$6("transport doesnt handle upgraded requests");
            websocket.close();
            return;
        }
        // get client id
        const id = req._query.sid;
        // keep a reference to the ws.Socket
        req.websocket = websocket;
        if (id) {
            const client = this.clients[id];
            if (!client) {
                debug$6("upgrade attempt for closed client");
                websocket.close();
            }
            else if (client.upgrading) {
                debug$6("transport has already been trying to upgrade");
                websocket.close();
            }
            else if (client.upgraded) {
                debug$6("transport had already been upgraded");
                websocket.close();
            }
            else {
                debug$6("upgrading existing transport");
                // transport error handling takes over
                websocket.removeListener("error", onUpgradeError);
                const transport = this.createTransport(req._query.transport, req);
                if (req._query && req._query.b64) {
                    transport.supportsBinary = false;
                }
                else {
                    transport.supportsBinary = true;
                }
                transport.perMessageDeflate = this.opts.perMessageDeflate;
                client.maybeUpgrade(transport);
            }
        }
        else {
            const closeConnection = (errorCode, errorContext) => abortUpgrade(socket, errorCode, errorContext);
            this.handshake(req._query.transport, req, closeConnection);
        }
        function onUpgradeError() {
            debug$6("websocket error before upgrade");
            // websocket.close() not needed
        }
    }
    /**
     * Captures upgrade requests for a http.Server.
     *
     * @param {http.Server} server
     * @param {Object} options
     * @api public
     */
    attach(server, options = {}) {
        const path = this._computePath(options);
        const destroyUpgradeTimeout = options.destroyUpgradeTimeout || 1000;
        function check(req) {
            // TODO use `path === new URL(...).pathname` in the next major release (ref: https://nodejs.org/api/url.html)
            return path === req.url.slice(0, path.length);
        }
        // cache and clean up listeners
        const listeners = server.listeners("request").slice(0);
        server.removeAllListeners("request");
        server.on("close", this.close.bind(this));
        server.on("listening", this.init.bind(this));
        // add request handler
        server.on("request", (req, res) => {
            if (check(req)) {
                debug$6('intercepting request for path "%s"', path);
                this.handleRequest(req, res);
            }
            else {
                let i = 0;
                const l = listeners.length;
                for (; i < l; i++) {
                    listeners[i].call(server, req, res);
                }
            }
        });
        if (~this.opts.transports.indexOf("websocket")) {
            server.on("upgrade", (req, socket, head) => {
                if (check(req)) {
                    this.handleUpgrade(req, socket, head);
                }
                else if (false !== options.destroyUpgrade) {
                    // default node behavior is to disconnect when no handlers
                    // but by adding a handler, we prevent that
                    // and if no eio thing handles the upgrade
                    // then the socket needs to die!
                    setTimeout(function () {
                        // @ts-ignore
                        if (socket.writable && socket.bytesWritten <= 0) {
                            socket.on("error", (e) => {
                                debug$6("error while destroying upgrade: %s", e.message);
                            });
                            return socket.end();
                        }
                    }, destroyUpgradeTimeout);
                }
            });
        }
    }
}
server.Server = Server$1;
/**
 * Close the HTTP long-polling request
 *
 * @param res - the response object
 * @param errorCode - the error code
 * @param errorContext - additional error context
 *
 * @api private
 */
function abortRequest(res, errorCode, errorContext) {
    const statusCode = errorCode === Server$1.errors.FORBIDDEN ? 403 : 400;
    const message = errorContext && errorContext.message
        ? errorContext.message
        : Server$1.errorMessages[errorCode];
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        code: errorCode,
        message,
    }));
}
/**
 * Close the WebSocket connection
 *
 * @param {net.Socket} socket
 * @param {string} errorCode - the error code
 * @param {object} errorContext - additional error context
 *
 * @api private
 */
function abortUpgrade(socket, errorCode, errorContext = {}) {
    socket.on("error", () => {
        debug$6("ignoring error from closed connection");
    });
    if (socket.writable) {
        const message = errorContext.message || Server$1.errorMessages[errorCode];
        const length = Buffer.byteLength(message);
        socket.write("HTTP/1.1 400 Bad Request\r\n" +
            "Connection: close\r\n" +
            "Content-type: text/html\r\n" +
            "Content-Length: " +
            length +
            "\r\n" +
            "\r\n" +
            message);
    }
    socket.destroy();
}
/* eslint-disable */
/**
 * From https://github.com/nodejs/node/blob/v8.4.0/lib/_http_common.js#L303-L354
 *
 * True if val contains an invalid field-vchar
 *  field-value    = *( field-content / obs-fold )
 *  field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 *  field-vchar    = VCHAR / obs-text
 *
 * checkInvalidHeaderChar() is currently designed to be inlinable by v8,
 * so take care when making changes to the implementation so that the source
 * code size does not exceed v8's default max_inlined_source_size setting.
 **/
// prettier-ignore
const validHdrChars = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 // ... 255
];
function checkInvalidHeaderChar(val) {
    val += "";
    if (val.length < 1)
        return false;
    if (!validHdrChars[val.charCodeAt(0)]) {
        debug$6('invalid header, index 0, char "%s"', val.charCodeAt(0));
        return true;
    }
    if (val.length < 2)
        return false;
    if (!validHdrChars[val.charCodeAt(1)]) {
        debug$6('invalid header, index 1, char "%s"', val.charCodeAt(1));
        return true;
    }
    if (val.length < 3)
        return false;
    if (!validHdrChars[val.charCodeAt(2)]) {
        debug$6('invalid header, index 2, char "%s"', val.charCodeAt(2));
        return true;
    }
    if (val.length < 4)
        return false;
    if (!validHdrChars[val.charCodeAt(3)]) {
        debug$6('invalid header, index 3, char "%s"', val.charCodeAt(3));
        return true;
    }
    for (let i = 4; i < val.length; ++i) {
        if (!validHdrChars[val.charCodeAt(i)]) {
            debug$6('invalid header, index "%i", char "%s"', i, val.charCodeAt(i));
            return true;
        }
    }
    return false;
}

var userver = {};

var transportsUws = {};

var polling = {};

Object.defineProperty(polling, "__esModule", { value: true });
polling.Polling = void 0;
const transport_1$1 = transport;
const zlib_1 = zlib__default;
const accepts = server$1.accepts;
const debug_1$4 = server$1.src.exports;
const debug$5 = (0, debug_1$4.default)("engine:polling");
const compressionMethods = {
    gzip: zlib_1.createGzip,
    deflate: zlib_1.createDeflate,
};
class Polling extends transport_1$1.Transport {
    /**
     * HTTP polling constructor.
     *
     * @api public.
     */
    constructor(req) {
        super(req);
        this.closeTimeout = 30 * 1000;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "polling";
    }
    get supportsFraming() {
        return false;
    }
    /**
     * Overrides onRequest.
     *
     * @param req
     *
     * @api private
     */
    onRequest(req) {
        const res = req.res;
        if (req.getMethod() === "get") {
            this.onPollRequest(req, res);
        }
        else if (req.getMethod() === "post") {
            this.onDataRequest(req, res);
        }
        else {
            res.writeStatus("500 Internal Server Error");
            res.end();
        }
    }
    /**
     * The client sends a request awaiting for us to send data.
     *
     * @api private
     */
    onPollRequest(req, res) {
        if (this.req) {
            debug$5("request overlap");
            // assert: this.res, '.req and .res should be (un)set together'
            this.onError("overlap from client");
            res.writeStatus("500 Internal Server Error");
            res.end();
            return;
        }
        debug$5("setting request");
        this.req = req;
        this.res = res;
        const onClose = () => {
            this.writable = false;
            this.onError("poll connection closed prematurely");
        };
        const cleanup = () => {
            this.req = this.res = null;
        };
        req.cleanup = cleanup;
        res.onAborted(onClose);
        this.writable = true;
        this.emit("drain");
        // if we're still writable but had a pending close, trigger an empty send
        if (this.writable && this.shouldClose) {
            debug$5("triggering empty send to append close packet");
            this.send([{ type: "noop" }]);
        }
    }
    /**
     * The client sends a request with data.
     *
     * @api private
     */
    onDataRequest(req, res) {
        if (this.dataReq) {
            // assert: this.dataRes, '.dataReq and .dataRes should be (un)set together'
            this.onError("data request overlap from client");
            res.writeStatus("500 Internal Server Error");
            res.end();
            return;
        }
        const expectedContentLength = Number(req.headers["content-length"]);
        if (!expectedContentLength) {
            this.onError("content-length header required");
            res.writeStatus("411 Length Required").end();
            return;
        }
        if (expectedContentLength > this.maxHttpBufferSize) {
            this.onError("payload too large");
            res.writeStatus("413 Payload Too Large").end();
            return;
        }
        const isBinary = "application/octet-stream" === req.headers["content-type"];
        if (isBinary && this.protocol === 4) {
            return this.onError("invalid content");
        }
        this.dataReq = req;
        this.dataRes = res;
        let buffer;
        let offset = 0;
        const headers = {
            // text/html is required instead of text/plain to avoid an
            // unwanted download dialog on certain user-agents (GH-43)
            "Content-Type": "text/html",
        };
        this.headers(req, headers);
        for (let key in headers) {
            res.writeHeader(key, String(headers[key]));
        }
        const onEnd = (buffer) => {
            this.onData(buffer.toString());
            this.onDataRequestCleanup();
            res.cork(() => {
                res.end("ok");
            });
        };
        res.onAborted(() => {
            this.onDataRequestCleanup();
            this.onError("data request connection closed prematurely");
        });
        res.onData((arrayBuffer, isLast) => {
            const totalLength = offset + arrayBuffer.byteLength;
            if (totalLength > expectedContentLength) {
                this.onError("content-length mismatch");
                res.close(); // calls onAborted
                return;
            }
            if (!buffer) {
                if (isLast) {
                    onEnd(Buffer.from(arrayBuffer));
                    return;
                }
                buffer = Buffer.allocUnsafe(expectedContentLength);
            }
            Buffer.from(arrayBuffer).copy(buffer, offset);
            if (isLast) {
                if (totalLength != expectedContentLength) {
                    this.onError("content-length mismatch");
                    res.writeStatus("400 Content-Length Mismatch").end();
                    this.onDataRequestCleanup();
                    return;
                }
                onEnd(buffer);
                return;
            }
            offset = totalLength;
        });
    }
    /**
     * Cleanup request.
     *
     * @api private
     */
    onDataRequestCleanup() {
        this.dataReq = this.dataRes = null;
    }
    /**
     * Processes the incoming data payload.
     *
     * @param {String} encoded payload
     * @api private
     */
    onData(data) {
        debug$5('received "%s"', data);
        const callback = (packet) => {
            if ("close" === packet.type) {
                debug$5("got xhr close packet");
                this.onClose();
                return false;
            }
            this.onPacket(packet);
        };
        if (this.protocol === 3) {
            this.parser.decodePayload(data, callback);
        }
        else {
            this.parser.decodePayload(data).forEach(callback);
        }
    }
    /**
     * Overrides onClose.
     *
     * @api private
     */
    onClose() {
        if (this.writable) {
            // close pending poll request
            this.send([{ type: "noop" }]);
        }
        super.onClose();
    }
    /**
     * Writes a packet payload.
     *
     * @param {Object} packet
     * @api private
     */
    send(packets) {
        this.writable = false;
        if (this.shouldClose) {
            debug$5("appending close packet to payload");
            packets.push({ type: "close" });
            this.shouldClose();
            this.shouldClose = null;
        }
        const doWrite = (data) => {
            const compress = packets.some((packet) => {
                return packet.options && packet.options.compress;
            });
            this.write(data, { compress });
        };
        if (this.protocol === 3) {
            this.parser.encodePayload(packets, this.supportsBinary, doWrite);
        }
        else {
            this.parser.encodePayload(packets, doWrite);
        }
    }
    /**
     * Writes data as response to poll request.
     *
     * @param {String} data
     * @param {Object} options
     * @api private
     */
    write(data, options) {
        debug$5('writing "%s"', data);
        this.doWrite(data, options, () => {
            this.req.cleanup();
        });
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // explicit UTF-8 is required for pages not served under utf
        const isString = typeof data === "string";
        const contentType = isString
            ? "text/plain; charset=UTF-8"
            : "application/octet-stream";
        const headers = {
            "Content-Type": contentType,
        };
        const respond = (data) => {
            this.headers(this.req, headers);
            this.res.cork(() => {
                Object.keys(headers).forEach((key) => {
                    this.res.writeHeader(key, String(headers[key]));
                });
                this.res.end(data);
            });
            callback();
        };
        if (!this.httpCompression || !options.compress) {
            respond(data);
            return;
        }
        const len = isString ? Buffer.byteLength(data) : data.length;
        if (len < this.httpCompression.threshold) {
            respond(data);
            return;
        }
        const encoding = accepts(this.req).encodings(["gzip", "deflate"]);
        if (!encoding) {
            respond(data);
            return;
        }
        this.compress(data, encoding, (err, data) => {
            if (err) {
                this.res.writeStatus("500 Internal Server Error");
                this.res.end();
                callback(err);
                return;
            }
            headers["Content-Encoding"] = encoding;
            respond(data);
        });
    }
    /**
     * Compresses data.
     *
     * @api private
     */
    compress(data, encoding, callback) {
        debug$5("compressing");
        const buffers = [];
        let nread = 0;
        compressionMethods[encoding](this.httpCompression)
            .on("error", callback)
            .on("data", function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        })
            .on("end", function () {
            callback(null, Buffer.concat(buffers, nread));
        })
            .end(data);
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug$5("closing");
        let closeTimeoutTimer;
        const onClose = () => {
            clearTimeout(closeTimeoutTimer);
            fn();
            this.onClose();
        };
        if (this.writable) {
            debug$5("transport writable - closing right away");
            this.send([{ type: "close" }]);
            onClose();
        }
        else if (this.discarded) {
            debug$5("transport discarded - closing right away");
            onClose();
        }
        else {
            debug$5("transport not writable - buffering orderly close");
            this.shouldClose = onClose;
            closeTimeoutTimer = setTimeout(onClose, this.closeTimeout);
        }
    }
    /**
     * Returns headers for a response.
     *
     * @param req - request
     * @param {Object} extra headers
     * @api private
     */
    headers(req, headers) {
        headers = headers || {};
        // prevent XSS warnings on IE
        // https://github.com/LearnBoost/socket.io/pull/1333
        const ua = req.headers["user-agent"];
        if (ua && (~ua.indexOf(";MSIE") || ~ua.indexOf("Trident/"))) {
            headers["X-XSS-Protection"] = "0";
        }
        this.emit("headers", headers, req);
        return headers;
    }
}
polling.Polling = Polling;

var websocket = {};

Object.defineProperty(websocket, "__esModule", { value: true });
websocket.WebSocket = void 0;
const transport_1 = transport;
const debug_1$3 = server$1.src.exports;
const debug$4 = (0, debug_1$3.default)("engine:ws");
class WebSocket$1 extends transport_1.Transport {
    /**
     * WebSocket transport
     *
     * @param req
     * @api public
     */
    constructor(req) {
        super(req);
        this.writable = false;
        this.perMessageDeflate = null;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Advertise upgrade support.
     *
     * @api public
     */
    get handlesUpgrades() {
        return true;
    }
    /**
     * Advertise framing support.
     *
     * @api public
     */
    get supportsFraming() {
        return true;
    }
    /**
     * Writes a packet payload.
     *
     * @param {Array} packets
     * @api private
     */
    send(packets) {
        this.writable = false;
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const isLast = i + 1 === packets.length;
            const send = (data) => {
                const isBinary = typeof data !== "string";
                const compress = this.perMessageDeflate &&
                    Buffer.byteLength(data) > this.perMessageDeflate.threshold;
                debug$4('writing "%s"', data);
                this.socket.send(data, isBinary, compress);
                if (isLast) {
                    this.writable = true;
                    this.emit("drain");
                }
            };
            if (packet.options && typeof packet.options.wsPreEncoded === "string") {
                send(packet.options.wsPreEncoded);
            }
            else {
                this.parser.encodePacket(packet, this.supportsBinary, send);
            }
        }
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug$4("closing");
        fn && fn();
        // call fn first since socket.end() immediately emits a "close" event
        this.socket.end();
    }
}
websocket.WebSocket = WebSocket$1;

Object.defineProperty(transportsUws, "__esModule", { value: true });
const polling_1 = polling;
const websocket_1 = websocket;
transportsUws.default = {
    polling: polling_1.Polling,
    websocket: websocket_1.WebSocket,
};

Object.defineProperty(userver, "__esModule", { value: true });
userver.uServer = void 0;
const debug_1$2 = server$1.src.exports;
const server_1 = server;
const transports_uws_1 = transportsUws;
const debug$3 = (0, debug_1$2.default)("engine:uws");
class uServer extends server_1.BaseServer {
    init() { }
    cleanup() { }
    /**
     * Prepares a request by processing the query string.
     *
     * @api private
     */
    prepare(req, res) {
        req.method = req.getMethod().toUpperCase();
        req.url = req.getUrl();
        const params = new URLSearchParams(req.getQuery());
        req._query = Object.fromEntries(params.entries());
        req.headers = {};
        req.forEach((key, value) => {
            req.headers[key] = value;
        });
        req.connection = {
            remoteAddress: Buffer.from(res.getRemoteAddressAsText()).toString(),
        };
        res.onAborted(() => {
            debug$3("response has been aborted");
        });
    }
    createTransport(transportName, req) {
        return new transports_uws_1.default[transportName](req);
    }
    /**
     * Attach the engine to a µWebSockets.js server
     * @param app
     * @param options
     */
    attach(app /* : TemplatedApp */, options = {}) {
        const path = this._computePath(options);
        app
            .any(path, this.handleRequest.bind(this))
            //
            .ws(path, {
            compression: options.compression,
            idleTimeout: options.idleTimeout,
            maxBackpressure: options.maxBackpressure,
            maxPayloadLength: this.opts.maxHttpBufferSize,
            upgrade: this.handleUpgrade.bind(this),
            open: (ws) => {
                const transport = ws.getUserData().transport;
                transport.socket = ws;
                transport.writable = true;
                transport.emit("drain");
            },
            message: (ws, message, isBinary) => {
                ws.getUserData().transport.onData(isBinary ? message : Buffer.from(message).toString());
            },
            close: (ws, code, message) => {
                ws.getUserData().transport.onClose(code, message);
            },
        });
    }
    _applyMiddlewares(req, res, callback) {
        if (this.middlewares.length === 0) {
            return callback();
        }
        // needed to buffer headers until the status is computed
        req.res = new ResponseWrapper(res);
        super._applyMiddlewares(req, req.res, (err) => {
            // some middlewares (like express-session) wait for the writeHead() call to flush their headers
            // see https://github.com/expressjs/session/blob/1010fadc2f071ddf2add94235d72224cf65159c6/index.js#L220-L244
            req.res.writeHead();
            callback(err);
        });
    }
    handleRequest(res, req) {
        debug$3('handling "%s" http request "%s"', req.getMethod(), req.getUrl());
        this.prepare(req, res);
        req.res = res;
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: server_1.Server.errorMessages[errorCode],
                    context: errorContext,
                });
                this.abortRequest(req.res, errorCode, errorContext);
                return;
            }
            if (req._query.sid) {
                debug$3("setting new request for existing client");
                this.clients[req._query.sid].transport.onRequest(req);
            }
            else {
                const closeConnection = (errorCode, errorContext) => this.abortRequest(res, errorCode, errorContext);
                this.handshake(req._query.transport, req, closeConnection);
            }
        };
        this._applyMiddlewares(req, res, (err) => {
            if (err) {
                callback(server_1.Server.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
            }
            else {
                this.verify(req, false, callback);
            }
        });
    }
    handleUpgrade(res, req, context) {
        debug$3("on upgrade");
        this.prepare(req, res);
        req.res = res;
        const callback = async (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: server_1.Server.errorMessages[errorCode],
                    context: errorContext,
                });
                this.abortRequest(res, errorCode, errorContext);
                return;
            }
            const id = req._query.sid;
            let transport;
            if (id) {
                const client = this.clients[id];
                if (!client) {
                    debug$3("upgrade attempt for closed client");
                    res.close();
                }
                else if (client.upgrading) {
                    debug$3("transport has already been trying to upgrade");
                    res.close();
                }
                else if (client.upgraded) {
                    debug$3("transport had already been upgraded");
                    res.close();
                }
                else {
                    debug$3("upgrading existing transport");
                    transport = this.createTransport(req._query.transport, req);
                    client.maybeUpgrade(transport);
                }
            }
            else {
                transport = await this.handshake(req._query.transport, req, (errorCode, errorContext) => this.abortRequest(res, errorCode, errorContext));
                if (!transport) {
                    return;
                }
            }
            // calling writeStatus() triggers the flushing of any header added in a middleware
            req.res.writeStatus("101 Switching Protocols");
            res.upgrade({
                transport,
            }, req.getHeader("sec-websocket-key"), req.getHeader("sec-websocket-protocol"), req.getHeader("sec-websocket-extensions"), context);
        };
        this._applyMiddlewares(req, res, (err) => {
            if (err) {
                callback(server_1.Server.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
            }
            else {
                this.verify(req, true, callback);
            }
        });
    }
    abortRequest(res, errorCode, errorContext) {
        const statusCode = errorCode === server_1.Server.errors.FORBIDDEN
            ? "403 Forbidden"
            : "400 Bad Request";
        const message = errorContext && errorContext.message
            ? errorContext.message
            : server_1.Server.errorMessages[errorCode];
        res.writeStatus(statusCode);
        res.writeHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            code: errorCode,
            message,
        }));
    }
}
userver.uServer = uServer;
class ResponseWrapper {
    constructor(res) {
        this.res = res;
        this.statusWritten = false;
        this.headers = [];
        this.isAborted = false;
    }
    set statusCode(status) {
        if (!status) {
            return;
        }
        // FIXME: handle all status codes?
        this.writeStatus(status === 200 ? "200 OK" : "204 No Content");
    }
    writeHead(status) {
        this.statusCode = status;
    }
    setHeader(key, value) {
        if (Array.isArray(value)) {
            value.forEach((val) => {
                this.writeHeader(key, val);
            });
        }
        else {
            this.writeHeader(key, value);
        }
    }
    removeHeader() {
        // FIXME: not implemented
    }
    // needed by vary: https://github.com/jshttp/vary/blob/5d725d059b3871025cf753e9dfa08924d0bcfa8f/index.js#L134
    getHeader() { }
    writeStatus(status) {
        if (this.isAborted)
            return;
        this.res.writeStatus(status);
        this.statusWritten = true;
        this.writeBufferedHeaders();
        return this;
    }
    writeHeader(key, value) {
        if (this.isAborted)
            return;
        if (key === "Content-Length") {
            // the content length is automatically added by uWebSockets.js
            return;
        }
        if (this.statusWritten) {
            this.res.writeHeader(key, value);
        }
        else {
            this.headers.push([key, value]);
        }
    }
    writeBufferedHeaders() {
        this.headers.forEach(([key, value]) => {
            this.res.writeHeader(key, value);
        });
    }
    end(data) {
        if (this.isAborted)
            return;
        this.res.cork(() => {
            if (!this.statusWritten) {
                // status will be inferred as "200 OK"
                this.writeBufferedHeaders();
            }
            this.res.end(data);
        });
    }
    onData(fn) {
        if (this.isAborted)
            return;
        this.res.onData(fn);
    }
    onAborted(fn) {
        if (this.isAborted)
            return;
        this.res.onAborted(() => {
            // Any attempt to use the UWS response object after abort will throw!
            this.isAborted = true;
            fn();
        });
    }
    cork(fn) {
        if (this.isAborted)
            return;
        this.res.cork(fn);
    }
}

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.protocol = exports.Transport = exports.Socket = exports.uServer = exports.parser = exports.attach = exports.listen = exports.transports = exports.Server = void 0;
	const http_1 = require$$0__default$3;
	const server_1 = server;
	Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return server_1.Server; } });
	const index_1 = transports;
	exports.transports = index_1.default;
	const parser = cjs$1;
	exports.parser = parser;
	var userver_1 = userver;
	Object.defineProperty(exports, "uServer", { enumerable: true, get: function () { return userver_1.uServer; } });
	var socket_1 = socket$1;
	Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_1.Socket; } });
	var transport_1 = transport;
	Object.defineProperty(exports, "Transport", { enumerable: true, get: function () { return transport_1.Transport; } });
	exports.protocol = parser.protocol;
	/**
	 * Creates an http.Server exclusively used for WS upgrades.
	 *
	 * @param {Number} port
	 * @param {Function} callback
	 * @param {Object} options
	 * @return {Server} websocket.io server
	 * @api public
	 */
	function listen(port, options, fn) {
	    if ("function" === typeof options) {
	        fn = options;
	        options = {};
	    }
	    const server = (0, http_1.createServer)(function (req, res) {
	        res.writeHead(501);
	        res.end("Not Implemented");
	    });
	    // create engine server
	    const engine = attach(server, options);
	    engine.httpServer = server;
	    server.listen(port, fn);
	    return engine;
	}
	exports.listen = listen;
	/**
	 * Captures upgrade requests for a http.Server.
	 *
	 * @param {http.Server} server
	 * @param {Object} options
	 * @return {Server} engine server
	 * @api public
	 */
	function attach(server, options) {
	    const engine = new server_1.Server(options);
	    engine.attach(server, options);
	    return engine;
	}
	exports.attach = attach;
} (engine_io));

var client = {};

var cjs = {};

const require$$0 = /*@__PURE__*/server$1.getAugmentedNamespace(index.componentEmitter);

var binary = {};

var isBinary$1 = {};

Object.defineProperty(isBinary$1, "__esModule", { value: true });
isBinary$1.hasBinary = isBinary$1.isBinary = void 0;
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        toString.call(Blob) === "[object BlobConstructor]");
const withNativeFile = typeof File === "function" ||
    (typeof File !== "undefined" &&
        toString.call(File) === "[object FileConstructor]");
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */
function isBinary(obj) {
    return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
        (withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File));
}
isBinary$1.isBinary = isBinary;
function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
                return true;
            }
        }
        return false;
    }
    if (isBinary(obj)) {
        return true;
    }
    if (obj.toJSON &&
        typeof obj.toJSON === "function" &&
        arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
        }
    }
    return false;
}
isBinary$1.hasBinary = hasBinary;

Object.defineProperty(binary, "__esModule", { value: true });
binary.reconstructPacket = binary.deconstructPacket = void 0;
const is_binary_js_1 = isBinary$1;
/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */
function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return { packet: pack, buffers: buffers };
}
binary.deconstructPacket = deconstructPacket;
function _deconstructPacket(data, buffers) {
    if (!data)
        return data;
    if ((0, is_binary_js_1.isBinary)(data)) {
        const placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
    }
    else if (Array.isArray(data)) {
        const newData = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
    }
    else if (typeof data === "object" && !(data instanceof Date)) {
        const newData = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newData[key] = _deconstructPacket(data[key], buffers);
            }
        }
        return newData;
    }
    return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */
function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    delete packet.attachments; // no longer useful
    return packet;
}
binary.reconstructPacket = reconstructPacket;
function _reconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (data && data._placeholder === true) {
        const isIndexValid = typeof data.num === "number" &&
            data.num >= 0 &&
            data.num < buffers.length;
        if (isIndexValid) {
            return buffers[data.num]; // appropriate buffer (should be natural order anyway)
        }
        else {
            throw new Error("illegal attachments");
        }
    }
    else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
        }
    }
    else if (typeof data === "object") {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                data[key] = _reconstructPacket(data[key], buffers);
            }
        }
    }
    return data;
}

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;
	const component_emitter_1 = require$$0;
	const binary_js_1 = binary;
	const is_binary_js_1 = isBinary$1;
	const debug_1 = server$1.src.exports; // debug()
	const debug = (0, debug_1.default)("socket.io-parser"); // debug()
	/**
	 * These strings must not be used as event names, as they have a special meaning.
	 */
	const RESERVED_EVENTS = [
	    "connect",
	    "connect_error",
	    "disconnect",
	    "disconnecting",
	    "newListener",
	    "removeListener", // used by the Node.js EventEmitter
	];
	/**
	 * Protocol version.
	 *
	 * @public
	 */
	exports.protocol = 5;
	var PacketType;
	(function (PacketType) {
	    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
	    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
	    PacketType[PacketType["EVENT"] = 2] = "EVENT";
	    PacketType[PacketType["ACK"] = 3] = "ACK";
	    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
	    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
	    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
	})(PacketType = exports.PacketType || (exports.PacketType = {}));
	/**
	 * A socket.io Encoder instance
	 */
	class Encoder {
	    /**
	     * Encoder constructor
	     *
	     * @param {function} replacer - custom replacer to pass down to JSON.parse
	     */
	    constructor(replacer) {
	        this.replacer = replacer;
	    }
	    /**
	     * Encode a packet as a single string if non-binary, or as a
	     * buffer sequence, depending on packet type.
	     *
	     * @param {Object} obj - packet object
	     */
	    encode(obj) {
	        debug("encoding packet %j", obj);
	        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
	            if ((0, is_binary_js_1.hasBinary)(obj)) {
	                return this.encodeAsBinary({
	                    type: obj.type === PacketType.EVENT
	                        ? PacketType.BINARY_EVENT
	                        : PacketType.BINARY_ACK,
	                    nsp: obj.nsp,
	                    data: obj.data,
	                    id: obj.id,
	                });
	            }
	        }
	        return [this.encodeAsString(obj)];
	    }
	    /**
	     * Encode packet as string.
	     */
	    encodeAsString(obj) {
	        // first is type
	        let str = "" + obj.type;
	        // attachments if we have them
	        if (obj.type === PacketType.BINARY_EVENT ||
	            obj.type === PacketType.BINARY_ACK) {
	            str += obj.attachments + "-";
	        }
	        // if we have a namespace other than `/`
	        // we append it followed by a comma `,`
	        if (obj.nsp && "/" !== obj.nsp) {
	            str += obj.nsp + ",";
	        }
	        // immediately followed by the id
	        if (null != obj.id) {
	            str += obj.id;
	        }
	        // json data
	        if (null != obj.data) {
	            str += JSON.stringify(obj.data, this.replacer);
	        }
	        debug("encoded %j as %s", obj, str);
	        return str;
	    }
	    /**
	     * Encode packet as 'buffer sequence' by removing blobs, and
	     * deconstructing packet into object with placeholders and
	     * a list of buffers.
	     */
	    encodeAsBinary(obj) {
	        const deconstruction = (0, binary_js_1.deconstructPacket)(obj);
	        const pack = this.encodeAsString(deconstruction.packet);
	        const buffers = deconstruction.buffers;
	        buffers.unshift(pack); // add packet info to beginning of data list
	        return buffers; // write all the buffers
	    }
	}
	exports.Encoder = Encoder;
	// see https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
	function isObject(value) {
	    return Object.prototype.toString.call(value) === "[object Object]";
	}
	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 */
	class Decoder extends component_emitter_1.Emitter {
	    /**
	     * Decoder constructor
	     *
	     * @param {function} reviver - custom reviver to pass down to JSON.stringify
	     */
	    constructor(reviver) {
	        super();
	        this.reviver = reviver;
	    }
	    /**
	     * Decodes an encoded packet string into packet JSON.
	     *
	     * @param {String} obj - encoded packet
	     */
	    add(obj) {
	        let packet;
	        if (typeof obj === "string") {
	            if (this.reconstructor) {
	                throw new Error("got plaintext data when reconstructing a packet");
	            }
	            packet = this.decodeString(obj);
	            const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
	            if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
	                packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
	                // binary packet's json
	                this.reconstructor = new BinaryReconstructor(packet);
	                // no attachments, labeled binary but no binary data to follow
	                if (packet.attachments === 0) {
	                    super.emitReserved("decoded", packet);
	                }
	            }
	            else {
	                // non-binary full packet
	                super.emitReserved("decoded", packet);
	            }
	        }
	        else if ((0, is_binary_js_1.isBinary)(obj) || obj.base64) {
	            // raw binary data
	            if (!this.reconstructor) {
	                throw new Error("got binary data when not reconstructing a packet");
	            }
	            else {
	                packet = this.reconstructor.takeBinaryData(obj);
	                if (packet) {
	                    // received final buffer
	                    this.reconstructor = null;
	                    super.emitReserved("decoded", packet);
	                }
	            }
	        }
	        else {
	            throw new Error("Unknown type: " + obj);
	        }
	    }
	    /**
	     * Decode a packet String (JSON data)
	     *
	     * @param {String} str
	     * @return {Object} packet
	     */
	    decodeString(str) {
	        let i = 0;
	        // look up type
	        const p = {
	            type: Number(str.charAt(0)),
	        };
	        if (PacketType[p.type] === undefined) {
	            throw new Error("unknown packet type " + p.type);
	        }
	        // look up attachments if type binary
	        if (p.type === PacketType.BINARY_EVENT ||
	            p.type === PacketType.BINARY_ACK) {
	            const start = i + 1;
	            while (str.charAt(++i) !== "-" && i != str.length) { }
	            const buf = str.substring(start, i);
	            if (buf != Number(buf) || str.charAt(i) !== "-") {
	                throw new Error("Illegal attachments");
	            }
	            p.attachments = Number(buf);
	        }
	        // look up namespace (if any)
	        if ("/" === str.charAt(i + 1)) {
	            const start = i + 1;
	            while (++i) {
	                const c = str.charAt(i);
	                if ("," === c)
	                    break;
	                if (i === str.length)
	                    break;
	            }
	            p.nsp = str.substring(start, i);
	        }
	        else {
	            p.nsp = "/";
	        }
	        // look up id
	        const next = str.charAt(i + 1);
	        if ("" !== next && Number(next) == next) {
	            const start = i + 1;
	            while (++i) {
	                const c = str.charAt(i);
	                if (null == c || Number(c) != c) {
	                    --i;
	                    break;
	                }
	                if (i === str.length)
	                    break;
	            }
	            p.id = Number(str.substring(start, i + 1));
	        }
	        // look up json data
	        if (str.charAt(++i)) {
	            const payload = this.tryParse(str.substr(i));
	            if (Decoder.isPayloadValid(p.type, payload)) {
	                p.data = payload;
	            }
	            else {
	                throw new Error("invalid payload");
	            }
	        }
	        debug("decoded %s as %j", str, p);
	        return p;
	    }
	    tryParse(str) {
	        try {
	            return JSON.parse(str, this.reviver);
	        }
	        catch (e) {
	            return false;
	        }
	    }
	    static isPayloadValid(type, payload) {
	        switch (type) {
	            case PacketType.CONNECT:
	                return isObject(payload);
	            case PacketType.DISCONNECT:
	                return payload === undefined;
	            case PacketType.CONNECT_ERROR:
	                return typeof payload === "string" || isObject(payload);
	            case PacketType.EVENT:
	            case PacketType.BINARY_EVENT:
	                return (Array.isArray(payload) &&
	                    (typeof payload[0] === "number" ||
	                        (typeof payload[0] === "string" &&
	                            RESERVED_EVENTS.indexOf(payload[0]) === -1)));
	            case PacketType.ACK:
	            case PacketType.BINARY_ACK:
	                return Array.isArray(payload);
	        }
	    }
	    /**
	     * Deallocates a parser's resources
	     */
	    destroy() {
	        if (this.reconstructor) {
	            this.reconstructor.finishedReconstruction();
	            this.reconstructor = null;
	        }
	    }
	}
	exports.Decoder = Decoder;
	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 */
	class BinaryReconstructor {
	    constructor(packet) {
	        this.packet = packet;
	        this.buffers = [];
	        this.reconPack = packet;
	    }
	    /**
	     * Method to be called when binary data received from connection
	     * after a BINARY_EVENT packet.
	     *
	     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	     * @return {null | Object} returns null if more binary data is expected or
	     *   a reconstructed packet object if all buffers have been received.
	     */
	    takeBinaryData(binData) {
	        this.buffers.push(binData);
	        if (this.buffers.length === this.reconPack.attachments) {
	            // done with buffer list
	            const packet = (0, binary_js_1.reconstructPacket)(this.reconPack, this.buffers);
	            this.finishedReconstruction();
	            return packet;
	        }
	        return null;
	    }
	    /**
	     * Cleans up binary packet reconstruction variables.
	     */
	    finishedReconstruction() {
	        this.reconPack = null;
	        this.buffers = [];
	    }
	}
} (cjs));

Object.defineProperty(client, "__esModule", { value: true });
client.Client = void 0;
const socket_io_parser_1 = cjs;
const debugModule = server$1.src.exports;
const url = require$$0__default$4;
const debug$2 = debugModule("socket.io:client");
class Client {
    /**
     * Client constructor.
     *
     * @param server instance
     * @param conn
     * @package
     */
    constructor(server, conn) {
        this.sockets = new Map();
        this.nsps = new Map();
        this.server = server;
        this.conn = conn;
        this.encoder = server.encoder;
        this.decoder = new server._parser.Decoder();
        this.id = conn.id;
        this.setup();
    }
    /**
     * @return the reference to the request that originated the Engine.IO connection
     *
     * @public
     */
    get request() {
        return this.conn.request;
    }
    /**
     * Sets up event listeners.
     *
     * @private
     */
    setup() {
        this.onclose = this.onclose.bind(this);
        this.ondata = this.ondata.bind(this);
        this.onerror = this.onerror.bind(this);
        this.ondecoded = this.ondecoded.bind(this);
        // @ts-ignore
        this.decoder.on("decoded", this.ondecoded);
        this.conn.on("data", this.ondata);
        this.conn.on("error", this.onerror);
        this.conn.on("close", this.onclose);
        this.connectTimeout = setTimeout(() => {
            if (this.nsps.size === 0) {
                debug$2("no namespace joined yet, close the client");
                this.close();
            }
            else {
                debug$2("the client has already joined a namespace, nothing to do");
            }
        }, this.server._connectTimeout);
    }
    /**
     * Connects a client to a namespace.
     *
     * @param {String} name - the namespace
     * @param {Object} auth - the auth parameters
     * @private
     */
    connect(name, auth = {}) {
        if (this.server._nsps.has(name)) {
            debug$2("connecting to namespace %s", name);
            return this.doConnect(name, auth);
        }
        this.server._checkNamespace(name, auth, (dynamicNspName) => {
            if (dynamicNspName) {
                this.doConnect(name, auth);
            }
            else {
                debug$2("creation of namespace %s was denied", name);
                this._packet({
                    type: socket_io_parser_1.PacketType.CONNECT_ERROR,
                    nsp: name,
                    data: {
                        message: "Invalid namespace",
                    },
                });
            }
        });
    }
    /**
     * Connects a client to a namespace.
     *
     * @param name - the namespace
     * @param {Object} auth - the auth parameters
     *
     * @private
     */
    doConnect(name, auth) {
        const nsp = this.server.of(name);
        nsp._add(this, auth, (socket) => {
            this.sockets.set(socket.id, socket);
            this.nsps.set(nsp.name, socket);
            if (this.connectTimeout) {
                clearTimeout(this.connectTimeout);
                this.connectTimeout = undefined;
            }
        });
    }
    /**
     * Disconnects from all namespaces and closes transport.
     *
     * @private
     */
    _disconnect() {
        for (const socket of this.sockets.values()) {
            socket.disconnect();
        }
        this.sockets.clear();
        this.close();
    }
    /**
     * Removes a socket. Called by each `Socket`.
     *
     * @private
     */
    _remove(socket) {
        if (this.sockets.has(socket.id)) {
            const nsp = this.sockets.get(socket.id).nsp.name;
            this.sockets.delete(socket.id);
            this.nsps.delete(nsp);
        }
        else {
            debug$2("ignoring remove for %s", socket.id);
        }
    }
    /**
     * Closes the underlying connection.
     *
     * @private
     */
    close() {
        if ("open" === this.conn.readyState) {
            debug$2("forcing transport close");
            this.conn.close();
            this.onclose("forced server close");
        }
    }
    /**
     * Writes a packet to the transport.
     *
     * @param {Object} packet object
     * @param {Object} opts
     * @private
     */
    _packet(packet, opts = {}) {
        if (this.conn.readyState !== "open") {
            debug$2("ignoring packet write %j", packet);
            return;
        }
        const encodedPackets = opts.preEncoded
            ? packet // previous versions of the adapter incorrectly used socket.packet() instead of writeToEngine()
            : this.encoder.encode(packet);
        this.writeToEngine(encodedPackets, opts);
    }
    writeToEngine(encodedPackets, opts) {
        if (opts.volatile && !this.conn.transport.writable) {
            debug$2("volatile packet is discarded since the transport is not currently writable");
            return;
        }
        const packets = Array.isArray(encodedPackets)
            ? encodedPackets
            : [encodedPackets];
        for (const encodedPacket of packets) {
            this.conn.write(encodedPacket, opts);
        }
    }
    /**
     * Called with incoming transport data.
     *
     * @private
     */
    ondata(data) {
        // try/catch is needed for protocol violations (GH-1880)
        try {
            this.decoder.add(data);
        }
        catch (e) {
            debug$2("invalid packet format");
            this.onerror(e);
        }
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
        let namespace;
        let authPayload;
        if (this.conn.protocol === 3) {
            const parsed = url.parse(packet.nsp, true);
            namespace = parsed.pathname;
            authPayload = parsed.query;
        }
        else {
            namespace = packet.nsp;
            authPayload = packet.data;
        }
        const socket = this.nsps.get(namespace);
        if (!socket && packet.type === socket_io_parser_1.PacketType.CONNECT) {
            this.connect(namespace, authPayload);
        }
        else if (socket &&
            packet.type !== socket_io_parser_1.PacketType.CONNECT &&
            packet.type !== socket_io_parser_1.PacketType.CONNECT_ERROR) {
            process.nextTick(function () {
                socket._onpacket(packet);
            });
        }
        else {
            debug$2("invalid state (packet type: %s)", packet.type);
            this.close();
        }
    }
    /**
     * Handles an error.
     *
     * @param {Object} err object
     * @private
     */
    onerror(err) {
        for (const socket of this.sockets.values()) {
            socket._onerror(err);
        }
        this.conn.close();
    }
    /**
     * Called upon transport close.
     *
     * @param reason
     * @param description
     * @private
     */
    onclose(reason, description) {
        debug$2("client close with reason %s", reason);
        // ignore a potential subsequent `close` event
        this.destroy();
        // `nsps` and `sockets` are cleaned up seamlessly
        for (const socket of this.sockets.values()) {
            socket._onclose(reason, description);
        }
        this.sockets.clear();
        this.decoder.destroy(); // clean up decoder
    }
    /**
     * Cleans up event listeners.
     * @private
     */
    destroy() {
        this.conn.removeListener("data", this.ondata);
        this.conn.removeListener("error", this.onerror);
        this.conn.removeListener("close", this.onclose);
        // @ts-ignore
        this.decoder.removeListener("decoded", this.ondecoded);
        if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = undefined;
        }
    }
}
client.Client = Client;

var namespace = {};

var socket = {};

var typedEvents = {};

Object.defineProperty(typedEvents, "__esModule", { value: true });
typedEvents.StrictEventEmitter = void 0;
const events_1$1 = require$$0__default$1;
/**
 * Strictly typed version of an `EventEmitter`. A `TypedEventEmitter` takes type
 * parameters for mappings of event names to event data types, and strictly
 * types method calls to the `EventEmitter` according to these event maps.
 *
 * @typeParam ListenEvents - `EventsMap` of user-defined events that can be
 * listened to with `on` or `once`
 * @typeParam EmitEvents - `EventsMap` of user-defined events that can be
 * emitted with `emit`
 * @typeParam ReservedEvents - `EventsMap` of reserved events, that can be
 * emitted by socket.io with `emitReserved`, and can be listened to with
 * `listen`.
 */
class StrictEventEmitter extends events_1$1.EventEmitter {
    /**
     * Adds the `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    on(ev, listener) {
        return super.on(ev, listener);
    }
    /**
     * Adds a one-time `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    once(ev, listener) {
        return super.once(ev, listener);
    }
    /**
     * Emits an event.
     *
     * @param ev Name of the event
     * @param args Values to send to listeners of this event
     */
    emit(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Emits a reserved event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can emit its own reserved events.
     *
     * @param ev Reserved event name
     * @param args Arguments to emit along with the event
     */
    emitReserved(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Emits an event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can get around the strict typing. This is useful for
     * calling `emit.apply`, which can be called as `emitUntyped.apply`.
     *
     * @param ev Event name
     * @param args Arguments to emit along with the event
     */
    emitUntyped(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Returns the listeners listening to an event.
     *
     * @param event Event name
     * @returns Array of listeners subscribed to `event`
     */
    listeners(event) {
        return super.listeners(event);
    }
}
typedEvents.StrictEventEmitter = StrictEventEmitter;

var broadcastOperator = {};

var hasRequiredBroadcastOperator;

function requireBroadcastOperator () {
	if (hasRequiredBroadcastOperator) return broadcastOperator;
	hasRequiredBroadcastOperator = 1;
	Object.defineProperty(broadcastOperator, "__esModule", { value: true });
	broadcastOperator.RemoteSocket = broadcastOperator.BroadcastOperator = void 0;
	const socket_1 = requireSocket();
	const socket_io_parser_1 = cjs;
	class BroadcastOperator {
	    constructor(adapter, rooms = new Set(), exceptRooms = new Set(), flags = {}) {
	        this.adapter = adapter;
	        this.rooms = rooms;
	        this.exceptRooms = exceptRooms;
	        this.flags = flags;
	    }
	    /**
	     * Targets a room when emitting.
	     *
	     * @example
	     * // the “foo” event will be broadcast to all connected clients in the “room-101” room
	     * io.to("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms (a client will be notified at most once)
	     * io.to(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * io.to("room-101").to("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    to(room) {
	        const rooms = new Set(this.rooms);
	        if (Array.isArray(room)) {
	            room.forEach((r) => rooms.add(r));
	        }
	        else {
	            rooms.add(room);
	        }
	        return new BroadcastOperator(this.adapter, rooms, this.exceptRooms, this.flags);
	    }
	    /**
	     * Targets a room when emitting. Similar to `to()`, but might feel clearer in some cases:
	     *
	     * @example
	     * // disconnect all clients in the "room-101" room
	     * io.in("room-101").disconnectSockets();
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    in(room) {
	        return this.to(room);
	    }
	    /**
	     * Excludes a room when emitting.
	     *
	     * @example
	     * // the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
	     * io.except("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms
	     * io.except(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * io.except("room-101").except("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    except(room) {
	        const exceptRooms = new Set(this.exceptRooms);
	        if (Array.isArray(room)) {
	            room.forEach((r) => exceptRooms.add(r));
	        }
	        else {
	            exceptRooms.add(room);
	        }
	        return new BroadcastOperator(this.adapter, this.rooms, exceptRooms, this.flags);
	    }
	    /**
	     * Sets the compress flag.
	     *
	     * @example
	     * io.compress(false).emit("hello");
	     *
	     * @param compress - if `true`, compresses the sending data
	     * @return a new BroadcastOperator instance
	     */
	    compress(compress) {
	        const flags = Object.assign({}, this.flags, { compress });
	        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
	     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
	     * and is in the middle of a request-response cycle).
	     *
	     * @example
	     * io.volatile.emit("hello"); // the clients may or may not receive it
	     *
	     * @return a new BroadcastOperator instance
	     */
	    get volatile() {
	        const flags = Object.assign({}, this.flags, { volatile: true });
	        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
	     *
	     * @example
	     * // the “foo” event will be broadcast to all connected clients on this node
	     * io.local.emit("foo", "bar");
	     *
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    get local() {
	        const flags = Object.assign({}, this.flags, { local: true });
	        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
	    }
	    /**
	     * Adds a timeout in milliseconds for the next operation
	     *
	     * @example
	     * io.timeout(1000).emit("some-event", (err, responses) => {
	     *   if (err) {
	     *     // some clients did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per client
	     *   }
	     * });
	     *
	     * @param timeout
	     */
	    timeout(timeout) {
	        const flags = Object.assign({}, this.flags, { timeout });
	        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
	    }
	    /**
	     * Emits to all clients.
	     *
	     * @example
	     * // the “foo” event will be broadcast to all connected clients
	     * io.emit("foo", "bar");
	     *
	     * // the “foo” event will be broadcast to all connected clients in the “room-101” room
	     * io.to("room-101").emit("foo", "bar");
	     *
	     * // with an acknowledgement expected from all connected clients
	     * io.timeout(1000).emit("some-event", (err, responses) => {
	     *   if (err) {
	     *     // some clients did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per client
	     *   }
	     * });
	     *
	     * @return Always true
	     */
	    emit(ev, ...args) {
	        if (socket_1.RESERVED_EVENTS.has(ev)) {
	            throw new Error(`"${String(ev)}" is a reserved event name`);
	        }
	        // set up packet object
	        const data = [ev, ...args];
	        const packet = {
	            type: socket_io_parser_1.PacketType.EVENT,
	            data: data,
	        };
	        const withAck = typeof data[data.length - 1] === "function";
	        if (!withAck) {
	            this.adapter.broadcast(packet, {
	                rooms: this.rooms,
	                except: this.exceptRooms,
	                flags: this.flags,
	            });
	            return true;
	        }
	        const ack = data.pop();
	        let timedOut = false;
	        let responses = [];
	        const timer = setTimeout(() => {
	            timedOut = true;
	            ack.apply(this, [
	                new Error("operation has timed out"),
	                this.flags.expectSingleResponse ? null : responses,
	            ]);
	        }, this.flags.timeout);
	        let expectedServerCount = -1;
	        let actualServerCount = 0;
	        let expectedClientCount = 0;
	        const checkCompleteness = () => {
	            if (!timedOut &&
	                expectedServerCount === actualServerCount &&
	                responses.length === expectedClientCount) {
	                clearTimeout(timer);
	                ack.apply(this, [
	                    null,
	                    this.flags.expectSingleResponse ? null : responses,
	                ]);
	            }
	        };
	        this.adapter.broadcastWithAck(packet, {
	            rooms: this.rooms,
	            except: this.exceptRooms,
	            flags: this.flags,
	        }, (clientCount) => {
	            // each Socket.IO server in the cluster sends the number of clients that were notified
	            expectedClientCount += clientCount;
	            actualServerCount++;
	            checkCompleteness();
	        }, (clientResponse) => {
	            // each client sends an acknowledgement
	            responses.push(clientResponse);
	            checkCompleteness();
	        });
	        this.adapter.serverCount().then((serverCount) => {
	            expectedServerCount = serverCount;
	            checkCompleteness();
	        });
	        return true;
	    }
	    /**
	     * Emits an event and waits for an acknowledgement from all clients.
	     *
	     * @example
	     * try {
	     *   const responses = await io.timeout(1000).emitWithAck("some-event");
	     *   console.log(responses); // one response per client
	     * } catch (e) {
	     *   // some clients did not acknowledge the event in the given delay
	     * }
	     *
	     * @return a Promise that will be fulfilled when all clients have acknowledged the event
	     */
	    emitWithAck(ev, ...args) {
	        return new Promise((resolve, reject) => {
	            args.push((err, responses) => {
	                if (err) {
	                    err.responses = responses;
	                    return reject(err);
	                }
	                else {
	                    return resolve(responses);
	                }
	            });
	            this.emit(ev, ...args);
	        });
	    }
	    /**
	     * Gets a list of clients.
	     *
	     * @deprecated this method will be removed in the next major release, please use {@link Server#serverSideEmit} or
	     * {@link fetchSockets} instead.
	     */
	    allSockets() {
	        if (!this.adapter) {
	            throw new Error("No adapter for this namespace, are you trying to get the list of clients of a dynamic namespace?");
	        }
	        return this.adapter.sockets(this.rooms);
	    }
	    /**
	     * Returns the matching socket instances. This method works across a cluster of several Socket.IO servers.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // return all Socket instances
	     * const sockets = await io.fetchSockets();
	     *
	     * // return all Socket instances in the "room1" room
	     * const sockets = await io.in("room1").fetchSockets();
	     *
	     * for (const socket of sockets) {
	     *   console.log(socket.id);
	     *   console.log(socket.handshake);
	     *   console.log(socket.rooms);
	     *   console.log(socket.data);
	     *
	     *   socket.emit("hello");
	     *   socket.join("room1");
	     *   socket.leave("room2");
	     *   socket.disconnect();
	     * }
	     */
	    fetchSockets() {
	        return this.adapter
	            .fetchSockets({
	            rooms: this.rooms,
	            except: this.exceptRooms,
	            flags: this.flags,
	        })
	            .then((sockets) => {
	            return sockets.map((socket) => {
	                if (socket instanceof socket_1.Socket) {
	                    // FIXME the TypeScript compiler complains about missing private properties
	                    return socket;
	                }
	                else {
	                    return new RemoteSocket(this.adapter, socket);
	                }
	            });
	        });
	    }
	    /**
	     * Makes the matching socket instances join the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     *
	     * // make all socket instances join the "room1" room
	     * io.socketsJoin("room1");
	     *
	     * // make all socket instances in the "room1" room join the "room2" and "room3" rooms
	     * io.in("room1").socketsJoin(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsJoin(room) {
	        this.adapter.addSockets({
	            rooms: this.rooms,
	            except: this.exceptRooms,
	            flags: this.flags,
	        }, Array.isArray(room) ? room : [room]);
	    }
	    /**
	     * Makes the matching socket instances leave the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // make all socket instances leave the "room1" room
	     * io.socketsLeave("room1");
	     *
	     * // make all socket instances in the "room1" room leave the "room2" and "room3" rooms
	     * io.in("room1").socketsLeave(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsLeave(room) {
	        this.adapter.delSockets({
	            rooms: this.rooms,
	            except: this.exceptRooms,
	            flags: this.flags,
	        }, Array.isArray(room) ? room : [room]);
	    }
	    /**
	     * Makes the matching socket instances disconnect.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // make all socket instances disconnect (the connections might be kept alive for other namespaces)
	     * io.disconnectSockets();
	     *
	     * // make all socket instances in the "room1" room disconnect and close the underlying connections
	     * io.in("room1").disconnectSockets(true);
	     *
	     * @param close - whether to close the underlying connection
	     */
	    disconnectSockets(close = false) {
	        this.adapter.disconnectSockets({
	            rooms: this.rooms,
	            except: this.exceptRooms,
	            flags: this.flags,
	        }, close);
	    }
	}
	broadcastOperator.BroadcastOperator = BroadcastOperator;
	/**
	 * Expose of subset of the attributes and methods of the Socket class
	 */
	class RemoteSocket {
	    constructor(adapter, details) {
	        this.id = details.id;
	        this.handshake = details.handshake;
	        this.rooms = new Set(details.rooms);
	        this.data = details.data;
	        this.operator = new BroadcastOperator(adapter, new Set([this.id]), new Set(), {
	            expectSingleResponse: true, // so that remoteSocket.emit() with acknowledgement behaves like socket.emit()
	        });
	    }
	    /**
	     * Adds a timeout in milliseconds for the next operation.
	     *
	     * @example
	     * const sockets = await io.fetchSockets();
	     *
	     * for (const socket of sockets) {
	     *   if (someCondition) {
	     *     socket.timeout(1000).emit("some-event", (err) => {
	     *       if (err) {
	     *         // the client did not acknowledge the event in the given delay
	     *       }
	     *     });
	     *   }
	     * }
	     *
	     * // note: if possible, using a room instead of looping over all sockets is preferable
	     * io.timeout(1000).to(someConditionRoom).emit("some-event", (err, responses) => {
	     *   // ...
	     * });
	     *
	     * @param timeout
	     */
	    timeout(timeout) {
	        return this.operator.timeout(timeout);
	    }
	    emit(ev, ...args) {
	        return this.operator.emit(ev, ...args);
	    }
	    /**
	     * Joins a room.
	     *
	     * @param {String|Array} room - room or array of rooms
	     */
	    join(room) {
	        return this.operator.socketsJoin(room);
	    }
	    /**
	     * Leaves a room.
	     *
	     * @param {String} room
	     */
	    leave(room) {
	        return this.operator.socketsLeave(room);
	    }
	    /**
	     * Disconnects this client.
	     *
	     * @param {Boolean} close - if `true`, closes the underlying connection
	     * @return {Socket} self
	     */
	    disconnect(close = false) {
	        this.operator.disconnectSockets(close);
	        return this;
	    }
	}
	broadcastOperator.RemoteSocket = RemoteSocket;
	return broadcastOperator;
}

var hasRequiredSocket;

function requireSocket () {
	if (hasRequiredSocket) return socket;
	hasRequiredSocket = 1;
	(function (exports) {
		var __importDefault = (server$1.commonjsGlobal && server$1.commonjsGlobal.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.Socket = exports.RESERVED_EVENTS = void 0;
		const socket_io_parser_1 = cjs;
		const debug_1 = __importDefault(server$1.src.exports);
		const typed_events_1 = typedEvents;
		const base64id_1 = __importDefault(base64id$1.exports);
		const broadcast_operator_1 = requireBroadcastOperator();
		const debug = (0, debug_1.default)("socket.io:socket");
		const RECOVERABLE_DISCONNECT_REASONS = new Set([
		    "transport error",
		    "transport close",
		    "forced close",
		    "ping timeout",
		    "server shutting down",
		    "forced server close",
		]);
		exports.RESERVED_EVENTS = new Set([
		    "connect",
		    "connect_error",
		    "disconnect",
		    "disconnecting",
		    "newListener",
		    "removeListener",
		]);
		function noop() { }
		/**
		 * This is the main object for interacting with a client.
		 *
		 * A Socket belongs to a given {@link Namespace} and uses an underlying {@link Client} to communicate.
		 *
		 * Within each {@link Namespace}, you can also define arbitrary channels (called "rooms") that the {@link Socket} can
		 * join and leave. That provides a convenient way to broadcast to a group of socket instances.
		 *
		 * @example
		 * io.on("connection", (socket) => {
		 *   console.log(`socket ${socket.id} connected`);
		 *
		 *   // send an event to the client
		 *   socket.emit("foo", "bar");
		 *
		 *   socket.on("foobar", () => {
		 *     // an event was received from the client
		 *   });
		 *
		 *   // join the room named "room1"
		 *   socket.join("room1");
		 *
		 *   // broadcast to everyone in the room named "room1"
		 *   io.to("room1").emit("hello");
		 *
		 *   // upon disconnection
		 *   socket.on("disconnect", (reason) => {
		 *     console.log(`socket ${socket.id} disconnected due to ${reason}`);
		 *   });
		 * });
		 */
		class Socket extends typed_events_1.StrictEventEmitter {
		    /**
		     * Interface to a `Client` for a given `Namespace`.
		     *
		     * @param {Namespace} nsp
		     * @param {Client} client
		     * @param {Object} auth
		     * @package
		     */
		    constructor(nsp, client, auth, previousSession) {
		        super();
		        this.nsp = nsp;
		        this.client = client;
		        /**
		         * Whether the connection state was recovered after a temporary disconnection. In that case, any missed packets will
		         * be transmitted to the client, the data attribute and the rooms will be restored.
		         */
		        this.recovered = false;
		        /**
		         * Additional information that can be attached to the Socket instance and which will be used in the
		         * {@link Server.fetchSockets()} method.
		         */
		        this.data = {};
		        /**
		         * Whether the socket is currently connected or not.
		         *
		         * @example
		         * io.use((socket, next) => {
		         *   console.log(socket.connected); // false
		         *   next();
		         * });
		         *
		         * io.on("connection", (socket) => {
		         *   console.log(socket.connected); // true
		         * });
		         */
		        this.connected = false;
		        this.acks = new Map();
		        this.fns = [];
		        this.flags = {};
		        this.server = nsp.server;
		        this.adapter = this.nsp.adapter;
		        if (previousSession) {
		            this.id = previousSession.sid;
		            this.pid = previousSession.pid;
		            previousSession.rooms.forEach((room) => this.join(room));
		            this.data = previousSession.data;
		            previousSession.missedPackets.forEach((packet) => {
		                this.packet({
		                    type: socket_io_parser_1.PacketType.EVENT,
		                    data: packet,
		                });
		            });
		            this.recovered = true;
		        }
		        else {
		            if (client.conn.protocol === 3) {
		                // @ts-ignore
		                this.id = nsp.name !== "/" ? nsp.name + "#" + client.id : client.id;
		            }
		            else {
		                this.id = base64id_1.default.generateId(); // don't reuse the Engine.IO id because it's sensitive information
		            }
		            if (this.server._opts.connectionStateRecovery) {
		                this.pid = base64id_1.default.generateId();
		            }
		        }
		        this.handshake = this.buildHandshake(auth);
		        // prevents crash when the socket receives an "error" event without listener
		        this.on("error", noop);
		    }
		    /**
		     * Builds the `handshake` BC object
		     *
		     * @private
		     */
		    buildHandshake(auth) {
		        return {
		            headers: this.request.headers,
		            time: new Date() + "",
		            address: this.conn.remoteAddress,
		            xdomain: !!this.request.headers.origin,
		            // @ts-ignore
		            secure: !!this.request.connection.encrypted,
		            issued: +new Date(),
		            url: this.request.url,
		            // @ts-ignore
		            query: this.request._query,
		            auth,
		        };
		    }
		    /**
		     * Emits to this client.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.emit("hello", "world");
		     *
		     *   // all serializable datastructures are supported (no need to call JSON.stringify)
		     *   socket.emit("hello", 1, "2", { 3: ["4"], 5: Buffer.from([6]) });
		     *
		     *   // with an acknowledgement from the client
		     *   socket.emit("hello", "world", (val) => {
		     *     // ...
		     *   });
		     * });
		     *
		     * @return Always returns `true`.
		     */
		    emit(ev, ...args) {
		        if (exports.RESERVED_EVENTS.has(ev)) {
		            throw new Error(`"${String(ev)}" is a reserved event name`);
		        }
		        const data = [ev, ...args];
		        const packet = {
		            type: socket_io_parser_1.PacketType.EVENT,
		            data: data,
		        };
		        // access last argument to see if it's an ACK callback
		        if (typeof data[data.length - 1] === "function") {
		            const id = this.nsp._ids++;
		            debug("emitting packet with ack id %d", id);
		            this.registerAckCallback(id, data.pop());
		            packet.id = id;
		        }
		        const flags = Object.assign({}, this.flags);
		        this.flags = {};
		        // @ts-ignore
		        if (this.nsp.server.opts.connectionStateRecovery) {
		            // this ensures the packet is stored and can be transmitted upon reconnection
		            this.adapter.broadcast(packet, {
		                rooms: new Set([this.id]),
		                except: new Set(),
		                flags,
		            });
		        }
		        else {
		            this.notifyOutgoingListeners(packet);
		            this.packet(packet, flags);
		        }
		        return true;
		    }
		    /**
		     * Emits an event and waits for an acknowledgement
		     *
		     * @example
		     * io.on("connection", async (socket) => {
		     *   // without timeout
		     *   const response = await socket.emitWithAck("hello", "world");
		     *
		     *   // with a specific timeout
		     *   try {
		     *     const response = await socket.timeout(1000).emitWithAck("hello", "world");
		     *   } catch (err) {
		     *     // the client did not acknowledge the event in the given delay
		     *   }
		     * });
		     *
		     * @return a Promise that will be fulfilled when the client acknowledges the event
		     */
		    emitWithAck(ev, ...args) {
		        // the timeout flag is optional
		        const withErr = this.flags.timeout !== undefined;
		        return new Promise((resolve, reject) => {
		            args.push((arg1, arg2) => {
		                if (withErr) {
		                    return arg1 ? reject(arg1) : resolve(arg2);
		                }
		                else {
		                    return resolve(arg1);
		                }
		            });
		            this.emit(ev, ...args);
		        });
		    }
		    /**
		     * @private
		     */
		    registerAckCallback(id, ack) {
		        const timeout = this.flags.timeout;
		        if (timeout === undefined) {
		            this.acks.set(id, ack);
		            return;
		        }
		        const timer = setTimeout(() => {
		            debug("event with ack id %d has timed out after %d ms", id, timeout);
		            this.acks.delete(id);
		            ack.call(this, new Error("operation has timed out"));
		        }, timeout);
		        this.acks.set(id, (...args) => {
		            clearTimeout(timer);
		            ack.apply(this, [null, ...args]);
		        });
		    }
		    /**
		     * Targets a room when broadcasting.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   // the “foo” event will be broadcast to all connected clients in the “room-101” room, except this socket
		     *   socket.to("room-101").emit("foo", "bar");
		     *
		     *   // the code above is equivalent to:
		     *   io.to("room-101").except(socket.id).emit("foo", "bar");
		     *
		     *   // with an array of rooms (a client will be notified at most once)
		     *   socket.to(["room-101", "room-102"]).emit("foo", "bar");
		     *
		     *   // with multiple chained calls
		     *   socket.to("room-101").to("room-102").emit("foo", "bar");
		     * });
		     *
		     * @param room - a room, or an array of rooms
		     * @return a new {@link BroadcastOperator} instance for chaining
		     */
		    to(room) {
		        return this.newBroadcastOperator().to(room);
		    }
		    /**
		     * Targets a room when broadcasting. Similar to `to()`, but might feel clearer in some cases:
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   // disconnect all clients in the "room-101" room, except this socket
		     *   socket.in("room-101").disconnectSockets();
		     * });
		     *
		     * @param room - a room, or an array of rooms
		     * @return a new {@link BroadcastOperator} instance for chaining
		     */
		    in(room) {
		        return this.newBroadcastOperator().in(room);
		    }
		    /**
		     * Excludes a room when broadcasting.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   // the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
		     *   // and this socket
		     *   socket.except("room-101").emit("foo", "bar");
		     *
		     *   // with an array of rooms
		     *   socket.except(["room-101", "room-102"]).emit("foo", "bar");
		     *
		     *   // with multiple chained calls
		     *   socket.except("room-101").except("room-102").emit("foo", "bar");
		     * });
		     *
		     * @param room - a room, or an array of rooms
		     * @return a new {@link BroadcastOperator} instance for chaining
		     */
		    except(room) {
		        return this.newBroadcastOperator().except(room);
		    }
		    /**
		     * Sends a `message` event.
		     *
		     * This method mimics the WebSocket.send() method.
		     *
		     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.send("hello");
		     *
		     *   // this is equivalent to
		     *   socket.emit("message", "hello");
		     * });
		     *
		     * @return self
		     */
		    send(...args) {
		        this.emit("message", ...args);
		        return this;
		    }
		    /**
		     * Sends a `message` event. Alias of {@link send}.
		     *
		     * @return self
		     */
		    write(...args) {
		        this.emit("message", ...args);
		        return this;
		    }
		    /**
		     * Writes a packet.
		     *
		     * @param {Object} packet - packet object
		     * @param {Object} opts - options
		     * @private
		     */
		    packet(packet, opts = {}) {
		        packet.nsp = this.nsp.name;
		        opts.compress = false !== opts.compress;
		        this.client._packet(packet, opts);
		    }
		    /**
		     * Joins a room.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   // join a single room
		     *   socket.join("room1");
		     *
		     *   // join multiple rooms
		     *   socket.join(["room1", "room2"]);
		     * });
		     *
		     * @param {String|Array} rooms - room or array of rooms
		     * @return a Promise or nothing, depending on the adapter
		     */
		    join(rooms) {
		        debug("join room %s", rooms);
		        return this.adapter.addAll(this.id, new Set(Array.isArray(rooms) ? rooms : [rooms]));
		    }
		    /**
		     * Leaves a room.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   // leave a single room
		     *   socket.leave("room1");
		     *
		     *   // leave multiple rooms
		     *   socket.leave("room1").leave("room2");
		     * });
		     *
		     * @param {String} room
		     * @return a Promise or nothing, depending on the adapter
		     */
		    leave(room) {
		        debug("leave room %s", room);
		        return this.adapter.del(this.id, room);
		    }
		    /**
		     * Leave all rooms.
		     *
		     * @private
		     */
		    leaveAll() {
		        this.adapter.delAll(this.id);
		    }
		    /**
		     * Called by `Namespace` upon successful
		     * middleware execution (ie: authorization).
		     * Socket is added to namespace array before
		     * call to join, so adapters can access it.
		     *
		     * @private
		     */
		    _onconnect() {
		        debug("socket connected - writing packet");
		        this.connected = true;
		        this.join(this.id);
		        if (this.conn.protocol === 3) {
		            this.packet({ type: socket_io_parser_1.PacketType.CONNECT });
		        }
		        else {
		            this.packet({
		                type: socket_io_parser_1.PacketType.CONNECT,
		                data: { sid: this.id, pid: this.pid },
		            });
		        }
		    }
		    /**
		     * Called with each packet. Called by `Client`.
		     *
		     * @param {Object} packet
		     * @private
		     */
		    _onpacket(packet) {
		        debug("got packet %j", packet);
		        switch (packet.type) {
		            case socket_io_parser_1.PacketType.EVENT:
		                this.onevent(packet);
		                break;
		            case socket_io_parser_1.PacketType.BINARY_EVENT:
		                this.onevent(packet);
		                break;
		            case socket_io_parser_1.PacketType.ACK:
		                this.onack(packet);
		                break;
		            case socket_io_parser_1.PacketType.BINARY_ACK:
		                this.onack(packet);
		                break;
		            case socket_io_parser_1.PacketType.DISCONNECT:
		                this.ondisconnect();
		                break;
		        }
		    }
		    /**
		     * Called upon event packet.
		     *
		     * @param {Packet} packet - packet object
		     * @private
		     */
		    onevent(packet) {
		        const args = packet.data || [];
		        debug("emitting event %j", args);
		        if (null != packet.id) {
		            debug("attaching ack callback to event");
		            args.push(this.ack(packet.id));
		        }
		        if (this._anyListeners && this._anyListeners.length) {
		            const listeners = this._anyListeners.slice();
		            for (const listener of listeners) {
		                listener.apply(this, args);
		            }
		        }
		        this.dispatch(args);
		    }
		    /**
		     * Produces an ack callback to emit with an event.
		     *
		     * @param {Number} id - packet id
		     * @private
		     */
		    ack(id) {
		        const self = this;
		        let sent = false;
		        return function () {
		            // prevent double callbacks
		            if (sent)
		                return;
		            const args = Array.prototype.slice.call(arguments);
		            debug("sending ack %j", args);
		            self.packet({
		                id: id,
		                type: socket_io_parser_1.PacketType.ACK,
		                data: args,
		            });
		            sent = true;
		        };
		    }
		    /**
		     * Called upon ack packet.
		     *
		     * @private
		     */
		    onack(packet) {
		        const ack = this.acks.get(packet.id);
		        if ("function" == typeof ack) {
		            debug("calling ack %s with %j", packet.id, packet.data);
		            ack.apply(this, packet.data);
		            this.acks.delete(packet.id);
		        }
		        else {
		            debug("bad ack %s", packet.id);
		        }
		    }
		    /**
		     * Called upon client disconnect packet.
		     *
		     * @private
		     */
		    ondisconnect() {
		        debug("got disconnect packet");
		        this._onclose("client namespace disconnect");
		    }
		    /**
		     * Handles a client error.
		     *
		     * @private
		     */
		    _onerror(err) {
		        // FIXME the meaning of the "error" event is overloaded:
		        //  - it can be sent by the client (`socket.emit("error")`)
		        //  - it can be emitted when the connection encounters an error (an invalid packet for example)
		        //  - it can be emitted when a packet is rejected in a middleware (`socket.use()`)
		        this.emitReserved("error", err);
		    }
		    /**
		     * Called upon closing. Called by `Client`.
		     *
		     * @param {String} reason
		     * @param description
		     * @throw {Error} optional error object
		     *
		     * @private
		     */
		    _onclose(reason, description) {
		        if (!this.connected)
		            return this;
		        debug("closing socket - reason %s", reason);
		        this.emitReserved("disconnecting", reason, description);
		        if (this.server._opts.connectionStateRecovery &&
		            RECOVERABLE_DISCONNECT_REASONS.has(reason)) {
		            debug("connection state recovery is enabled for sid %s", this.id);
		            this.adapter.persistSession({
		                sid: this.id,
		                pid: this.pid,
		                rooms: [...this.rooms],
		                data: this.data,
		            });
		        }
		        this._cleanup();
		        this.nsp._remove(this);
		        this.client._remove(this);
		        this.connected = false;
		        this.emitReserved("disconnect", reason, description);
		        return;
		    }
		    /**
		     * Makes the socket leave all the rooms it was part of and prevents it from joining any other room
		     *
		     * @private
		     */
		    _cleanup() {
		        this.leaveAll();
		        this.join = noop;
		    }
		    /**
		     * Produces an `error` packet.
		     *
		     * @param {Object} err - error object
		     *
		     * @private
		     */
		    _error(err) {
		        this.packet({ type: socket_io_parser_1.PacketType.CONNECT_ERROR, data: err });
		    }
		    /**
		     * Disconnects this client.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   // disconnect this socket (the connection might be kept alive for other namespaces)
		     *   socket.disconnect();
		     *
		     *   // disconnect this socket and close the underlying connection
		     *   socket.disconnect(true);
		     * })
		     *
		     * @param {Boolean} close - if `true`, closes the underlying connection
		     * @return self
		     */
		    disconnect(close = false) {
		        if (!this.connected)
		            return this;
		        if (close) {
		            this.client._disconnect();
		        }
		        else {
		            this.packet({ type: socket_io_parser_1.PacketType.DISCONNECT });
		            this._onclose("server namespace disconnect");
		        }
		        return this;
		    }
		    /**
		     * Sets the compress flag.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.compress(false).emit("hello");
		     * });
		     *
		     * @param {Boolean} compress - if `true`, compresses the sending data
		     * @return {Socket} self
		     */
		    compress(compress) {
		        this.flags.compress = compress;
		        return this;
		    }
		    /**
		     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
		     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
		     * and is in the middle of a request-response cycle).
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.volatile.emit("hello"); // the client may or may not receive it
		     * });
		     *
		     * @return {Socket} self
		     */
		    get volatile() {
		        this.flags.volatile = true;
		        return this;
		    }
		    /**
		     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to every sockets but the
		     * sender.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   // the “foo” event will be broadcast to all connected clients, except this socket
		     *   socket.broadcast.emit("foo", "bar");
		     * });
		     *
		     * @return a new {@link BroadcastOperator} instance for chaining
		     */
		    get broadcast() {
		        return this.newBroadcastOperator();
		    }
		    /**
		     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   // the “foo” event will be broadcast to all connected clients on this node, except this socket
		     *   socket.local.emit("foo", "bar");
		     * });
		     *
		     * @return a new {@link BroadcastOperator} instance for chaining
		     */
		    get local() {
		        return this.newBroadcastOperator().local;
		    }
		    /**
		     * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
		     * given number of milliseconds have elapsed without an acknowledgement from the client:
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.timeout(5000).emit("my-event", (err) => {
		     *     if (err) {
		     *       // the client did not acknowledge the event in the given delay
		     *     }
		     *   });
		     * });
		     *
		     * @returns self
		     */
		    timeout(timeout) {
		        this.flags.timeout = timeout;
		        return this;
		    }
		    /**
		     * Dispatch incoming event to socket listeners.
		     *
		     * @param {Array} event - event that will get emitted
		     * @private
		     */
		    dispatch(event) {
		        debug("dispatching an event %j", event);
		        this.run(event, (err) => {
		            process.nextTick(() => {
		                if (err) {
		                    return this._onerror(err);
		                }
		                if (this.connected) {
		                    super.emitUntyped.apply(this, event);
		                }
		                else {
		                    debug("ignore packet received after disconnection");
		                }
		            });
		        });
		    }
		    /**
		     * Sets up socket middleware.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.use(([event, ...args], next) => {
		     *     if (isUnauthorized(event)) {
		     *       return next(new Error("unauthorized event"));
		     *     }
		     *     // do not forget to call next
		     *     next();
		     *   });
		     *
		     *   socket.on("error", (err) => {
		     *     if (err && err.message === "unauthorized event") {
		     *       socket.disconnect();
		     *     }
		     *   });
		     * });
		     *
		     * @param {Function} fn - middleware function (event, next)
		     * @return {Socket} self
		     */
		    use(fn) {
		        this.fns.push(fn);
		        return this;
		    }
		    /**
		     * Executes the middleware for an incoming event.
		     *
		     * @param {Array} event - event that will get emitted
		     * @param {Function} fn - last fn call in the middleware
		     * @private
		     */
		    run(event, fn) {
		        const fns = this.fns.slice(0);
		        if (!fns.length)
		            return fn(null);
		        function run(i) {
		            fns[i](event, function (err) {
		                // upon error, short-circuit
		                if (err)
		                    return fn(err);
		                // if no middleware left, summon callback
		                if (!fns[i + 1])
		                    return fn(null);
		                // go on to next
		                run(i + 1);
		            });
		        }
		        run(0);
		    }
		    /**
		     * Whether the socket is currently disconnected
		     */
		    get disconnected() {
		        return !this.connected;
		    }
		    /**
		     * A reference to the request that originated the underlying Engine.IO Socket.
		     */
		    get request() {
		        return this.client.request;
		    }
		    /**
		     * A reference to the underlying Client transport connection (Engine.IO Socket object).
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   console.log(socket.conn.transport.name); // prints "polling" or "websocket"
		     *
		     *   socket.conn.once("upgrade", () => {
		     *     console.log(socket.conn.transport.name); // prints "websocket"
		     *   });
		     * });
		     */
		    get conn() {
		        return this.client.conn;
		    }
		    /**
		     * Returns the rooms the socket is currently in.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   console.log(socket.rooms); // Set { <socket.id> }
		     *
		     *   socket.join("room1");
		     *
		     *   console.log(socket.rooms); // Set { <socket.id>, "room1" }
		     * });
		     */
		    get rooms() {
		        return this.adapter.socketRooms(this.id) || new Set();
		    }
		    /**
		     * Adds a listener that will be fired when any event is received. The event name is passed as the first argument to
		     * the callback.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.onAny((event, ...args) => {
		     *     console.log(`got event ${event}`);
		     *   });
		     * });
		     *
		     * @param listener
		     */
		    onAny(listener) {
		        this._anyListeners = this._anyListeners || [];
		        this._anyListeners.push(listener);
		        return this;
		    }
		    /**
		     * Adds a listener that will be fired when any event is received. The event name is passed as the first argument to
		     * the callback. The listener is added to the beginning of the listeners array.
		     *
		     * @param listener
		     */
		    prependAny(listener) {
		        this._anyListeners = this._anyListeners || [];
		        this._anyListeners.unshift(listener);
		        return this;
		    }
		    /**
		     * Removes the listener that will be fired when any event is received.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   const catchAllListener = (event, ...args) => {
		     *     console.log(`got event ${event}`);
		     *   }
		     *
		     *   socket.onAny(catchAllListener);
		     *
		     *   // remove a specific listener
		     *   socket.offAny(catchAllListener);
		     *
		     *   // or remove all listeners
		     *   socket.offAny();
		     * });
		     *
		     * @param listener
		     */
		    offAny(listener) {
		        if (!this._anyListeners) {
		            return this;
		        }
		        if (listener) {
		            const listeners = this._anyListeners;
		            for (let i = 0; i < listeners.length; i++) {
		                if (listener === listeners[i]) {
		                    listeners.splice(i, 1);
		                    return this;
		                }
		            }
		        }
		        else {
		            this._anyListeners = [];
		        }
		        return this;
		    }
		    /**
		     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
		     * e.g. to remove listeners.
		     */
		    listenersAny() {
		        return this._anyListeners || [];
		    }
		    /**
		     * Adds a listener that will be fired when any event is sent. The event name is passed as the first argument to
		     * the callback.
		     *
		     * Note: acknowledgements sent to the client are not included.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.onAnyOutgoing((event, ...args) => {
		     *     console.log(`sent event ${event}`);
		     *   });
		     * });
		     *
		     * @param listener
		     */
		    onAnyOutgoing(listener) {
		        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
		        this._anyOutgoingListeners.push(listener);
		        return this;
		    }
		    /**
		     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		     * callback. The listener is added to the beginning of the listeners array.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   socket.prependAnyOutgoing((event, ...args) => {
		     *     console.log(`sent event ${event}`);
		     *   });
		     * });
		     *
		     * @param listener
		     */
		    prependAnyOutgoing(listener) {
		        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
		        this._anyOutgoingListeners.unshift(listener);
		        return this;
		    }
		    /**
		     * Removes the listener that will be fired when any event is sent.
		     *
		     * @example
		     * io.on("connection", (socket) => {
		     *   const catchAllListener = (event, ...args) => {
		     *     console.log(`sent event ${event}`);
		     *   }
		     *
		     *   socket.onAnyOutgoing(catchAllListener);
		     *
		     *   // remove a specific listener
		     *   socket.offAnyOutgoing(catchAllListener);
		     *
		     *   // or remove all listeners
		     *   socket.offAnyOutgoing();
		     * });
		     *
		     * @param listener - the catch-all listener
		     */
		    offAnyOutgoing(listener) {
		        if (!this._anyOutgoingListeners) {
		            return this;
		        }
		        if (listener) {
		            const listeners = this._anyOutgoingListeners;
		            for (let i = 0; i < listeners.length; i++) {
		                if (listener === listeners[i]) {
		                    listeners.splice(i, 1);
		                    return this;
		                }
		            }
		        }
		        else {
		            this._anyOutgoingListeners = [];
		        }
		        return this;
		    }
		    /**
		     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
		     * e.g. to remove listeners.
		     */
		    listenersAnyOutgoing() {
		        return this._anyOutgoingListeners || [];
		    }
		    /**
		     * Notify the listeners for each packet sent (emit or broadcast)
		     *
		     * @param packet
		     *
		     * @private
		     */
		    notifyOutgoingListeners(packet) {
		        if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
		            const listeners = this._anyOutgoingListeners.slice();
		            for (const listener of listeners) {
		                listener.apply(this, packet.data);
		            }
		        }
		    }
		    newBroadcastOperator() {
		        const flags = Object.assign({}, this.flags);
		        this.flags = {};
		        return new broadcast_operator_1.BroadcastOperator(this.adapter, new Set(), new Set([this.id]), flags);
		    }
		}
		exports.Socket = Socket;
} (socket));
	return socket;
}

(function (exports) {
	var __importDefault = (server$1.commonjsGlobal && server$1.commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Namespace = exports.RESERVED_EVENTS = void 0;
	const socket_1 = requireSocket();
	const typed_events_1 = typedEvents;
	const debug_1 = __importDefault(server$1.src.exports);
	const broadcast_operator_1 = requireBroadcastOperator();
	const debug = (0, debug_1.default)("socket.io:namespace");
	exports.RESERVED_EVENTS = new Set(["connect", "connection", "new_namespace"]);
	/**
	 * A Namespace is a communication channel that allows you to split the logic of your application over a single shared
	 * connection.
	 *
	 * Each namespace has its own:
	 *
	 * - event handlers
	 *
	 * ```
	 * io.of("/orders").on("connection", (socket) => {
	 *   socket.on("order:list", () => {});
	 *   socket.on("order:create", () => {});
	 * });
	 *
	 * io.of("/users").on("connection", (socket) => {
	 *   socket.on("user:list", () => {});
	 * });
	 * ```
	 *
	 * - rooms
	 *
	 * ```
	 * const orderNamespace = io.of("/orders");
	 *
	 * orderNamespace.on("connection", (socket) => {
	 *   socket.join("room1");
	 *   orderNamespace.to("room1").emit("hello");
	 * });
	 *
	 * const userNamespace = io.of("/users");
	 *
	 * userNamespace.on("connection", (socket) => {
	 *   socket.join("room1"); // distinct from the room in the "orders" namespace
	 *   userNamespace.to("room1").emit("holà");
	 * });
	 * ```
	 *
	 * - middlewares
	 *
	 * ```
	 * const orderNamespace = io.of("/orders");
	 *
	 * orderNamespace.use((socket, next) => {
	 *   // ensure the socket has access to the "orders" namespace
	 * });
	 *
	 * const userNamespace = io.of("/users");
	 *
	 * userNamespace.use((socket, next) => {
	 *   // ensure the socket has access to the "users" namespace
	 * });
	 * ```
	 */
	class Namespace extends typed_events_1.StrictEventEmitter {
	    /**
	     * Namespace constructor.
	     *
	     * @param server instance
	     * @param name
	     */
	    constructor(server, name) {
	        super();
	        this.sockets = new Map();
	        /** @private */
	        this._fns = [];
	        /** @private */
	        this._ids = 0;
	        this.server = server;
	        this.name = name;
	        this._initAdapter();
	    }
	    /**
	     * Initializes the `Adapter` for this nsp.
	     * Run upon changing adapter by `Server#adapter`
	     * in addition to the constructor.
	     *
	     * @private
	     */
	    _initAdapter() {
	        // @ts-ignore
	        this.adapter = new (this.server.adapter())(this);
	    }
	    /**
	     * Registers a middleware, which is a function that gets executed for every incoming {@link Socket}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.use((socket, next) => {
	     *   // ...
	     *   next();
	     * });
	     *
	     * @param fn - the middleware function
	     */
	    use(fn) {
	        this._fns.push(fn);
	        return this;
	    }
	    /**
	     * Executes the middleware for an incoming client.
	     *
	     * @param socket - the socket that will get added
	     * @param fn - last fn call in the middleware
	     * @private
	     */
	    run(socket, fn) {
	        const fns = this._fns.slice(0);
	        if (!fns.length)
	            return fn(null);
	        function run(i) {
	            fns[i](socket, function (err) {
	                // upon error, short-circuit
	                if (err)
	                    return fn(err);
	                // if no middleware left, summon callback
	                if (!fns[i + 1])
	                    return fn(null);
	                // go on to next
	                run(i + 1);
	            });
	        }
	        run(0);
	    }
	    /**
	     * Targets a room when emitting.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // the “foo” event will be broadcast to all connected clients in the “room-101” room
	     * myNamespace.to("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms (a client will be notified at most once)
	     * myNamespace.to(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * myNamespace.to("room-101").to("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    to(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).to(room);
	    }
	    /**
	     * Targets a room when emitting. Similar to `to()`, but might feel clearer in some cases:
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // disconnect all clients in the "room-101" room
	     * myNamespace.in("room-101").disconnectSockets();
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    in(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).in(room);
	    }
	    /**
	     * Excludes a room when emitting.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
	     * myNamespace.except("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms
	     * myNamespace.except(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * myNamespace.except("room-101").except("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    except(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).except(room);
	    }
	    /**
	     * Adds a new client.
	     *
	     * @return {Socket}
	     * @private
	     */
	    async _add(client, auth, fn) {
	        var _a;
	        debug("adding socket to nsp %s", this.name);
	        const socket = await this._createSocket(client, auth);
	        if (
	        // @ts-ignore
	        ((_a = this.server.opts.connectionStateRecovery) === null || _a === void 0 ? void 0 : _a.skipMiddlewares) &&
	            socket.recovered &&
	            client.conn.readyState === "open") {
	            return this._doConnect(socket, fn);
	        }
	        this.run(socket, (err) => {
	            process.nextTick(() => {
	                if ("open" !== client.conn.readyState) {
	                    debug("next called after client was closed - ignoring socket");
	                    socket._cleanup();
	                    return;
	                }
	                if (err) {
	                    debug("middleware error, sending CONNECT_ERROR packet to the client");
	                    socket._cleanup();
	                    if (client.conn.protocol === 3) {
	                        return socket._error(err.data || err.message);
	                    }
	                    else {
	                        return socket._error({
	                            message: err.message,
	                            data: err.data,
	                        });
	                    }
	                }
	                this._doConnect(socket, fn);
	            });
	        });
	    }
	    async _createSocket(client, auth) {
	        const sessionId = auth.pid;
	        const offset = auth.offset;
	        if (
	        // @ts-ignore
	        this.server.opts.connectionStateRecovery &&
	            typeof sessionId === "string" &&
	            typeof offset === "string") {
	            let session;
	            try {
	                session = await this.adapter.restoreSession(sessionId, offset);
	            }
	            catch (e) {
	                debug("error while restoring session: %s", e);
	            }
	            if (session) {
	                debug("connection state recovered for sid %s", session.sid);
	                return new socket_1.Socket(this, client, auth, session);
	            }
	        }
	        return new socket_1.Socket(this, client, auth);
	    }
	    _doConnect(socket, fn) {
	        // track socket
	        this.sockets.set(socket.id, socket);
	        // it's paramount that the internal `onconnect` logic
	        // fires before user-set events to prevent state order
	        // violations (such as a disconnection before the connection
	        // logic is complete)
	        socket._onconnect();
	        if (fn)
	            fn(socket);
	        // fire user-set events
	        this.emitReserved("connect", socket);
	        this.emitReserved("connection", socket);
	    }
	    /**
	     * Removes a client. Called by each `Socket`.
	     *
	     * @private
	     */
	    _remove(socket) {
	        if (this.sockets.has(socket.id)) {
	            this.sockets.delete(socket.id);
	        }
	        else {
	            debug("ignoring remove for %s", socket.id);
	        }
	    }
	    /**
	     * Emits to all connected clients.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.emit("hello", "world");
	     *
	     * // all serializable datastructures are supported (no need to call JSON.stringify)
	     * myNamespace.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
	     *
	     * // with an acknowledgement from the clients
	     * myNamespace.timeout(1000).emit("some-event", (err, responses) => {
	     *   if (err) {
	     *     // some clients did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per client
	     *   }
	     * });
	     *
	     * @return Always true
	     */
	    emit(ev, ...args) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).emit(ev, ...args);
	    }
	    /**
	     * Emits an event and waits for an acknowledgement from all clients.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * try {
	     *   const responses = await myNamespace.timeout(1000).emitWithAck("some-event");
	     *   console.log(responses); // one response per client
	     * } catch (e) {
	     *   // some clients did not acknowledge the event in the given delay
	     * }
	     *
	     * @return a Promise that will be fulfilled when all clients have acknowledged the event
	     */
	    emitWithAck(ev, ...args) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).emitWithAck(ev, ...args);
	    }
	    /**
	     * Sends a `message` event to all clients.
	     *
	     * This method mimics the WebSocket.send() method.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.send("hello");
	     *
	     * // this is equivalent to
	     * myNamespace.emit("message", "hello");
	     *
	     * @return self
	     */
	    send(...args) {
	        this.emit("message", ...args);
	        return this;
	    }
	    /**
	     * Sends a `message` event to all clients. Sends a `message` event. Alias of {@link send}.
	     *
	     * @return self
	     */
	    write(...args) {
	        this.emit("message", ...args);
	        return this;
	    }
	    /**
	     * Sends a message to the other Socket.IO servers of the cluster.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.serverSideEmit("hello", "world");
	     *
	     * myNamespace.on("hello", (arg1) => {
	     *   console.log(arg1); // prints "world"
	     * });
	     *
	     * // acknowledgements (without binary content) are supported too:
	     * myNamespace.serverSideEmit("ping", (err, responses) => {
	     *  if (err) {
	     *     // some servers did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per server (except the current one)
	     *   }
	     * });
	     *
	     * myNamespace.on("ping", (cb) => {
	     *   cb("pong");
	     * });
	     *
	     * @param ev - the event name
	     * @param args - an array of arguments, which may include an acknowledgement callback at the end
	     */
	    serverSideEmit(ev, ...args) {
	        if (exports.RESERVED_EVENTS.has(ev)) {
	            throw new Error(`"${String(ev)}" is a reserved event name`);
	        }
	        args.unshift(ev);
	        this.adapter.serverSideEmit(args);
	        return true;
	    }
	    /**
	     * Sends a message and expect an acknowledgement from the other Socket.IO servers of the cluster.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * try {
	     *   const responses = await myNamespace.serverSideEmitWithAck("ping");
	     *   console.log(responses); // one response per server (except the current one)
	     * } catch (e) {
	     *   // some servers did not acknowledge the event in the given delay
	     * }
	     *
	     * @param ev - the event name
	     * @param args - an array of arguments
	     *
	     * @return a Promise that will be fulfilled when all servers have acknowledged the event
	     */
	    serverSideEmitWithAck(ev, ...args) {
	        return new Promise((resolve, reject) => {
	            args.push((err, responses) => {
	                if (err) {
	                    err.responses = responses;
	                    return reject(err);
	                }
	                else {
	                    return resolve(responses);
	                }
	            });
	            this.serverSideEmit(ev, ...args);
	        });
	    }
	    /**
	     * Called when a packet is received from another Socket.IO server
	     *
	     * @param args - an array of arguments, which may include an acknowledgement callback at the end
	     *
	     * @private
	     */
	    _onServerSideEmit(args) {
	        super.emitUntyped.apply(this, args);
	    }
	    /**
	     * Gets a list of clients.
	     *
	     * @deprecated this method will be removed in the next major release, please use {@link Namespace#serverSideEmit} or
	     * {@link Namespace#fetchSockets} instead.
	     */
	    allSockets() {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).allSockets();
	    }
	    /**
	     * Sets the compress flag.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.compress(false).emit("hello");
	     *
	     * @param compress - if `true`, compresses the sending data
	     * @return self
	     */
	    compress(compress) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).compress(compress);
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
	     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
	     * and is in the middle of a request-response cycle).
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.volatile.emit("hello"); // the clients may or may not receive it
	     *
	     * @return self
	     */
	    get volatile() {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).volatile;
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // the “foo” event will be broadcast to all connected clients on this node
	     * myNamespace.local.emit("foo", "bar");
	     *
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    get local() {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).local;
	    }
	    /**
	     * Adds a timeout in milliseconds for the next operation.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.timeout(1000).emit("some-event", (err, responses) => {
	     *   if (err) {
	     *     // some clients did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per client
	     *   }
	     * });
	     *
	     * @param timeout
	     */
	    timeout(timeout) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).timeout(timeout);
	    }
	    /**
	     * Returns the matching socket instances.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // return all Socket instances
	     * const sockets = await myNamespace.fetchSockets();
	     *
	     * // return all Socket instances in the "room1" room
	     * const sockets = await myNamespace.in("room1").fetchSockets();
	     *
	     * for (const socket of sockets) {
	     *   console.log(socket.id);
	     *   console.log(socket.handshake);
	     *   console.log(socket.rooms);
	     *   console.log(socket.data);
	     *
	     *   socket.emit("hello");
	     *   socket.join("room1");
	     *   socket.leave("room2");
	     *   socket.disconnect();
	     * }
	     */
	    fetchSockets() {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).fetchSockets();
	    }
	    /**
	     * Makes the matching socket instances join the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // make all socket instances join the "room1" room
	     * myNamespace.socketsJoin("room1");
	     *
	     * // make all socket instances in the "room1" room join the "room2" and "room3" rooms
	     * myNamespace.in("room1").socketsJoin(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsJoin(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).socketsJoin(room);
	    }
	    /**
	     * Makes the matching socket instances leave the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // make all socket instances leave the "room1" room
	     * myNamespace.socketsLeave("room1");
	     *
	     * // make all socket instances in the "room1" room leave the "room2" and "room3" rooms
	     * myNamespace.in("room1").socketsLeave(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsLeave(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).socketsLeave(room);
	    }
	    /**
	     * Makes the matching socket instances disconnect.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // make all socket instances disconnect (the connections might be kept alive for other namespaces)
	     * myNamespace.disconnectSockets();
	     *
	     * // make all socket instances in the "room1" room disconnect and close the underlying connections
	     * myNamespace.in("room1").disconnectSockets(true);
	     *
	     * @param close - whether to close the underlying connection
	     */
	    disconnectSockets(close = false) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).disconnectSockets(close);
	    }
	}
	exports.Namespace = Namespace;
} (namespace));

var parentNamespace = {};

var __importDefault$1 = (server$1.commonjsGlobal && server$1.commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(parentNamespace, "__esModule", { value: true });
parentNamespace.ParentNamespace = void 0;
const namespace_1 = namespace;
const debug_1$1 = __importDefault$1(server$1.src.exports);
const debug$1 = (0, debug_1$1.default)("socket.io:parent-namespace");
/**
 * A parent namespace is a special {@link Namespace} that holds a list of child namespaces which were created either
 * with a regular expression or with a function.
 *
 * @example
 * const parentNamespace = io.of(/\/dynamic-\d+/);
 *
 * parentNamespace.on("connection", (socket) => {
 *   const childNamespace = socket.nsp;
 * }
 *
 * // will reach all the clients that are in one of the child namespaces, like "/dynamic-101"
 * parentNamespace.emit("hello", "world");
 *
 */
class ParentNamespace extends namespace_1.Namespace {
    constructor(server) {
        super(server, "/_" + ParentNamespace.count++);
        this.children = new Set();
    }
    /**
     * @private
     */
    _initAdapter() {
        const broadcast = (packet, opts) => {
            this.children.forEach((nsp) => {
                nsp.adapter.broadcast(packet, opts);
            });
        };
        // @ts-ignore FIXME is there a way to declare an inner class in TypeScript?
        this.adapter = { broadcast };
    }
    emit(ev, ...args) {
        this.children.forEach((nsp) => {
            nsp.emit(ev, ...args);
        });
        return true;
    }
    createChild(name) {
        debug$1("creating child namespace %s", name);
        const namespace = new namespace_1.Namespace(this.server, name);
        namespace._fns = this._fns.slice(0);
        this.listeners("connect").forEach((listener) => namespace.on("connect", listener));
        this.listeners("connection").forEach((listener) => namespace.on("connection", listener));
        this.children.add(namespace);
        if (this.server._opts.cleanupEmptyChildNamespaces) {
            const remove = namespace._remove;
            namespace._remove = (socket) => {
                remove.call(namespace, socket);
                if (namespace.sockets.size === 0) {
                    debug$1("closing child namespace %s", name);
                    namespace.adapter.close();
                    this.server._nsps.delete(namespace.name);
                    this.children.delete(namespace);
                }
            };
        }
        this.server._nsps.set(name, namespace);
        // @ts-ignore
        this.server.sockets.emitReserved("new_namespace", namespace);
        return namespace;
    }
    fetchSockets() {
        // note: we could make the fetchSockets() method work for dynamic namespaces created with a regex (by sending the
        // regex to the other Socket.IO servers, and returning the sockets of each matching namespace for example), but
        // the behavior for namespaces created with a function is less clear
        // note²: we cannot loop over each children namespace, because with multiple Socket.IO servers, a given namespace
        // may exist on one node but not exist on another (since it is created upon client connection)
        throw new Error("fetchSockets() is not supported on parent namespaces");
    }
}
parentNamespace.ParentNamespace = ParentNamespace;
ParentNamespace.count = 0;

var dist = {};

var yeast$1 = {};

Object.defineProperty(yeast$1, "__esModule", { value: true });
yeast$1.yeast = yeast$1.decode = yeast$1.encode = void 0;
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), length = 64, map = {};
let seed = 0, i = 0, prev;
/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
    let encoded = "";
    do {
        encoded = alphabet[num % length] + encoded;
        num = Math.floor(num / length);
    } while (num > 0);
    return encoded;
}
yeast$1.encode = encode;
/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
    let decoded = 0;
    for (i = 0; i < str.length; i++) {
        decoded = decoded * length + map[str.charAt(i)];
    }
    return decoded;
}
yeast$1.decode = decode;
/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
    const now = encode(+new Date());
    if (now !== prev)
        return (seed = 0), (prev = now);
    return now + "." + encode(seed++);
}
yeast$1.yeast = yeast;
//
// Map each character to its index.
//
for (; i < length; i++)
    map[alphabet[i]] = i;

var _a;
Object.defineProperty(dist, "__esModule", { value: true });
dist.SessionAwareAdapter = dist.Adapter = void 0;
const events_1 = require$$0__default$1;
const yeast_1 = yeast$1;
const WebSocket = ws;
const canPreComputeFrame = typeof ((_a = WebSocket === null || WebSocket === void 0 ? void 0 : WebSocket.Sender) === null || _a === void 0 ? void 0 : _a.frame) === "function";
class Adapter extends events_1.EventEmitter {
    /**
     * In-memory adapter constructor.
     *
     * @param {Namespace} nsp
     */
    constructor(nsp) {
        super();
        this.nsp = nsp;
        this.rooms = new Map();
        this.sids = new Map();
        this.encoder = nsp.server.encoder;
    }
    /**
     * To be overridden
     */
    init() { }
    /**
     * To be overridden
     */
    close() { }
    /**
     * Returns the number of Socket.IO servers in the cluster
     *
     * @public
     */
    serverCount() {
        return Promise.resolve(1);
    }
    /**
     * Adds a socket to a list of room.
     *
     * @param {SocketId}  id      the socket id
     * @param {Set<Room>} rooms   a set of rooms
     * @public
     */
    addAll(id, rooms) {
        if (!this.sids.has(id)) {
            this.sids.set(id, new Set());
        }
        for (const room of rooms) {
            this.sids.get(id).add(room);
            if (!this.rooms.has(room)) {
                this.rooms.set(room, new Set());
                this.emit("create-room", room);
            }
            if (!this.rooms.get(room).has(id)) {
                this.rooms.get(room).add(id);
                this.emit("join-room", room, id);
            }
        }
    }
    /**
     * Removes a socket from a room.
     *
     * @param {SocketId} id     the socket id
     * @param {Room}     room   the room name
     */
    del(id, room) {
        if (this.sids.has(id)) {
            this.sids.get(id).delete(room);
        }
        this._del(room, id);
    }
    _del(room, id) {
        const _room = this.rooms.get(room);
        if (_room != null) {
            const deleted = _room.delete(id);
            if (deleted) {
                this.emit("leave-room", room, id);
            }
            if (_room.size === 0 && this.rooms.delete(room)) {
                this.emit("delete-room", room);
            }
        }
    }
    /**
     * Removes a socket from all rooms it's joined.
     *
     * @param {SocketId} id   the socket id
     */
    delAll(id) {
        if (!this.sids.has(id)) {
            return;
        }
        for (const room of this.sids.get(id)) {
            this._del(room, id);
        }
        this.sids.delete(id);
    }
    /**
     * Broadcasts a packet.
     *
     * Options:
     *  - `flags` {Object} flags for this packet
     *  - `except` {Array} sids that should be excluded
     *  - `rooms` {Array} list of rooms to broadcast to
     *
     * @param {Object} packet   the packet object
     * @param {Object} opts     the options
     * @public
     */
    broadcast(packet, opts) {
        const flags = opts.flags || {};
        const packetOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress,
        };
        packet.nsp = this.nsp.name;
        const encodedPackets = this._encode(packet, packetOpts);
        this.apply(opts, (socket) => {
            if (typeof socket.notifyOutgoingListeners === "function") {
                socket.notifyOutgoingListeners(packet);
            }
            socket.client.writeToEngine(encodedPackets, packetOpts);
        });
    }
    /**
     * Broadcasts a packet and expects multiple acknowledgements.
     *
     * Options:
     *  - `flags` {Object} flags for this packet
     *  - `except` {Array} sids that should be excluded
     *  - `rooms` {Array} list of rooms to broadcast to
     *
     * @param {Object} packet   the packet object
     * @param {Object} opts     the options
     * @param clientCountCallback - the number of clients that received the packet
     * @param ack                 - the callback that will be called for each client response
     *
     * @public
     */
    broadcastWithAck(packet, opts, clientCountCallback, ack) {
        const flags = opts.flags || {};
        const packetOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress,
        };
        packet.nsp = this.nsp.name;
        // we can use the same id for each packet, since the _ids counter is common (no duplicate)
        packet.id = this.nsp._ids++;
        const encodedPackets = this._encode(packet, packetOpts);
        let clientCount = 0;
        this.apply(opts, (socket) => {
            // track the total number of acknowledgements that are expected
            clientCount++;
            // call the ack callback for each client response
            socket.acks.set(packet.id, ack);
            if (typeof socket.notifyOutgoingListeners === "function") {
                socket.notifyOutgoingListeners(packet);
            }
            socket.client.writeToEngine(encodedPackets, packetOpts);
        });
        clientCountCallback(clientCount);
    }
    _encode(packet, packetOpts) {
        const encodedPackets = this.encoder.encode(packet);
        if (canPreComputeFrame &&
            encodedPackets.length === 1 &&
            typeof encodedPackets[0] === "string") {
            // "4" being the "message" packet type in the Engine.IO protocol
            const data = Buffer.from("4" + encodedPackets[0]);
            // see https://github.com/websockets/ws/issues/617#issuecomment-283002469
            packetOpts.wsPreEncodedFrame = WebSocket.Sender.frame(data, {
                readOnly: false,
                mask: false,
                rsv1: false,
                opcode: 1,
                fin: true,
            });
        }
        return encodedPackets;
    }
    /**
     * Gets a list of sockets by sid.
     *
     * @param {Set<Room>} rooms   the explicit set of rooms to check.
     */
    sockets(rooms) {
        const sids = new Set();
        this.apply({ rooms }, (socket) => {
            sids.add(socket.id);
        });
        return Promise.resolve(sids);
    }
    /**
     * Gets the list of rooms a given socket has joined.
     *
     * @param {SocketId} id   the socket id
     */
    socketRooms(id) {
        return this.sids.get(id);
    }
    /**
     * Returns the matching socket instances
     *
     * @param opts - the filters to apply
     */
    fetchSockets(opts) {
        const sockets = [];
        this.apply(opts, (socket) => {
            sockets.push(socket);
        });
        return Promise.resolve(sockets);
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param opts - the filters to apply
     * @param rooms - the rooms to join
     */
    addSockets(opts, rooms) {
        this.apply(opts, (socket) => {
            socket.join(rooms);
        });
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param opts - the filters to apply
     * @param rooms - the rooms to leave
     */
    delSockets(opts, rooms) {
        this.apply(opts, (socket) => {
            rooms.forEach((room) => socket.leave(room));
        });
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param opts - the filters to apply
     * @param close - whether to close the underlying connection
     */
    disconnectSockets(opts, close) {
        this.apply(opts, (socket) => {
            socket.disconnect(close);
        });
    }
    apply(opts, callback) {
        const rooms = opts.rooms;
        const except = this.computeExceptSids(opts.except);
        if (rooms.size) {
            const ids = new Set();
            for (const room of rooms) {
                if (!this.rooms.has(room))
                    continue;
                for (const id of this.rooms.get(room)) {
                    if (ids.has(id) || except.has(id))
                        continue;
                    const socket = this.nsp.sockets.get(id);
                    if (socket) {
                        callback(socket);
                        ids.add(id);
                    }
                }
            }
        }
        else {
            for (const [id] of this.sids) {
                if (except.has(id))
                    continue;
                const socket = this.nsp.sockets.get(id);
                if (socket)
                    callback(socket);
            }
        }
    }
    computeExceptSids(exceptRooms) {
        const exceptSids = new Set();
        if (exceptRooms && exceptRooms.size > 0) {
            for (const room of exceptRooms) {
                if (this.rooms.has(room)) {
                    this.rooms.get(room).forEach((sid) => exceptSids.add(sid));
                }
            }
        }
        return exceptSids;
    }
    /**
     * Send a packet to the other Socket.IO servers in the cluster
     * @param packet - an array of arguments, which may include an acknowledgement callback at the end
     */
    serverSideEmit(packet) {
        console.warn("this adapter does not support the serverSideEmit() functionality");
    }
    /**
     * Save the client session in order to restore it upon reconnection.
     */
    persistSession(session) { }
    /**
     * Restore the session and find the packets that were missed by the client.
     * @param pid
     * @param offset
     */
    restoreSession(pid, offset) {
        return null;
    }
}
dist.Adapter = Adapter;
class SessionAwareAdapter extends Adapter {
    constructor(nsp) {
        super(nsp);
        this.nsp = nsp;
        this.sessions = new Map();
        this.packets = [];
        this.maxDisconnectionDuration =
            nsp.server.opts.connectionStateRecovery.maxDisconnectionDuration;
        const timer = setInterval(() => {
            const threshold = Date.now() - this.maxDisconnectionDuration;
            this.sessions.forEach((session, sessionId) => {
                const hasExpired = session.disconnectedAt < threshold;
                if (hasExpired) {
                    this.sessions.delete(sessionId);
                }
            });
            for (let i = this.packets.length - 1; i >= 0; i--) {
                const hasExpired = this.packets[i].emittedAt < threshold;
                if (hasExpired) {
                    this.packets.splice(0, i + 1);
                    break;
                }
            }
        }, 60 * 1000);
        // prevents the timer from keeping the process alive
        timer.unref();
    }
    persistSession(session) {
        session.disconnectedAt = Date.now();
        this.sessions.set(session.pid, session);
    }
    restoreSession(pid, offset) {
        const session = this.sessions.get(pid);
        if (!session) {
            // the session may have expired
            return null;
        }
        const hasExpired = session.disconnectedAt + this.maxDisconnectionDuration < Date.now();
        if (hasExpired) {
            // the session has expired
            this.sessions.delete(pid);
            return null;
        }
        const index = this.packets.findIndex((packet) => packet.id === offset);
        if (index === -1) {
            // the offset may be too old
            return null;
        }
        const missedPackets = [];
        for (let i = index + 1; i < this.packets.length; i++) {
            const packet = this.packets[i];
            if (shouldIncludePacket(session.rooms, packet.opts)) {
                missedPackets.push(packet.data);
            }
        }
        return Promise.resolve(Object.assign(Object.assign({}, session), { missedPackets }));
    }
    broadcast(packet, opts) {
        var _a;
        const isEventPacket = packet.type === 2;
        // packets with acknowledgement are not stored because the acknowledgement function cannot be serialized and
        // restored on another server upon reconnection
        const withoutAcknowledgement = packet.id === undefined;
        const notVolatile = ((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.volatile) === undefined;
        if (isEventPacket && withoutAcknowledgement && notVolatile) {
            const id = (0, yeast_1.yeast)();
            // the offset is stored at the end of the data array, so the client knows the ID of the last packet it has
            // processed (and the format is backward-compatible)
            packet.data.push(id);
            this.packets.push({
                id,
                opts,
                data: packet.data,
                emittedAt: Date.now(),
            });
        }
        super.broadcast(packet, opts);
    }
}
dist.SessionAwareAdapter = SessionAwareAdapter;
function shouldIncludePacket(sessionRooms, opts) {
    const included = opts.rooms.size === 0 || sessionRooms.some((room) => opts.rooms.has(room));
    const notExcluded = sessionRooms.every((room) => !opts.except.has(room));
    return included && notExcluded;
}

var uws = {};

var __importDefault = (server$1.commonjsGlobal && server$1.commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(uws, "__esModule", { value: true });
uws.serveFile = uws.restoreAdapter = uws.patchAdapter = void 0;
const socket_io_adapter_1 = dist;
const fs_1 = require$$1__default;
const debug_1 = __importDefault(server$1.src.exports);
const debug = (0, debug_1.default)("socket.io:adapter-uws");
const SEPARATOR = "\x1f"; // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const { addAll, del, broadcast } = socket_io_adapter_1.Adapter.prototype;
function patchAdapter(app /* : TemplatedApp */) {
    socket_io_adapter_1.Adapter.prototype.addAll = function (id, rooms) {
        const isNew = !this.sids.has(id);
        addAll.call(this, id, rooms);
        const socket = this.nsp.sockets.get(id);
        if (!socket) {
            return;
        }
        if (socket.conn.transport.name === "websocket") {
            subscribe(this.nsp.name, socket, isNew, rooms);
            return;
        }
        if (isNew) {
            socket.conn.on("upgrade", () => {
                const rooms = this.sids.get(id);
                if (rooms) {
                    subscribe(this.nsp.name, socket, isNew, rooms);
                }
            });
        }
    };
    socket_io_adapter_1.Adapter.prototype.del = function (id, room) {
        del.call(this, id, room);
        const socket = this.nsp.sockets.get(id);
        if (socket && socket.conn.transport.name === "websocket") {
            // @ts-ignore
            const sessionId = socket.conn.id;
            // @ts-ignore
            const websocket = socket.conn.transport.socket;
            const topic = `${this.nsp.name}${SEPARATOR}${room}`;
            debug("unsubscribe connection %s from topic %s", sessionId, topic);
            websocket.unsubscribe(topic);
        }
    };
    socket_io_adapter_1.Adapter.prototype.broadcast = function (packet, opts) {
        const useFastPublish = opts.rooms.size <= 1 && opts.except.size === 0;
        if (!useFastPublish) {
            broadcast.call(this, packet, opts);
            return;
        }
        const flags = opts.flags || {};
        const basePacketOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress,
        };
        packet.nsp = this.nsp.name;
        const encodedPackets = this.encoder.encode(packet);
        const topic = opts.rooms.size === 0
            ? this.nsp.name
            : `${this.nsp.name}${SEPARATOR}${opts.rooms.keys().next().value}`;
        debug("fast publish to %s", topic);
        // fast publish for clients connected with WebSocket
        encodedPackets.forEach((encodedPacket) => {
            const isBinary = typeof encodedPacket !== "string";
            // "4" being the message type in the Engine.IO protocol, see https://github.com/socketio/engine.io-protocol
            app.publish(topic, isBinary ? encodedPacket : "4" + encodedPacket, isBinary);
        });
        this.apply(opts, (socket) => {
            if (socket.conn.transport.name !== "websocket") {
                // classic publish for clients connected with HTTP long-polling
                socket.client.writeToEngine(encodedPackets, basePacketOpts);
            }
        });
    };
}
uws.patchAdapter = patchAdapter;
function subscribe(namespaceName, socket, isNew, rooms) {
    // @ts-ignore
    const sessionId = socket.conn.id;
    // @ts-ignore
    const websocket = socket.conn.transport.socket;
    if (isNew) {
        debug("subscribe connection %s to topic %s", sessionId, namespaceName);
        websocket.subscribe(namespaceName);
    }
    rooms.forEach((room) => {
        const topic = `${namespaceName}${SEPARATOR}${room}`; // '#' can be used as wildcard
        debug("subscribe connection %s to topic %s", sessionId, topic);
        websocket.subscribe(topic);
    });
}
function restoreAdapter() {
    socket_io_adapter_1.Adapter.prototype.addAll = addAll;
    socket_io_adapter_1.Adapter.prototype.del = del;
    socket_io_adapter_1.Adapter.prototype.broadcast = broadcast;
}
uws.restoreAdapter = restoreAdapter;
const toArrayBuffer = (buffer) => {
    const { buffer: arrayBuffer, byteOffset, byteLength } = buffer;
    return arrayBuffer.slice(byteOffset, byteOffset + byteLength);
};
// imported from https://github.com/kolodziejczak-sz/uwebsocket-serve
function serveFile(res /* : HttpResponse */, filepath) {
    const { size } = (0, fs_1.statSync)(filepath);
    const readStream = (0, fs_1.createReadStream)(filepath);
    const destroyReadStream = () => !readStream.destroyed && readStream.destroy();
    const onError = (error) => {
        destroyReadStream();
        throw error;
    };
    const onDataChunk = (chunk) => {
        const arrayBufferChunk = toArrayBuffer(chunk);
        const lastOffset = res.getWriteOffset();
        const [ok, done] = res.tryEnd(arrayBufferChunk, size);
        if (!done && !ok) {
            readStream.pause();
            res.onWritable((offset) => {
                const [ok, done] = res.tryEnd(arrayBufferChunk.slice(offset - lastOffset), size);
                if (!done && ok) {
                    readStream.resume();
                }
                return ok;
            });
        }
    };
    res.onAborted(destroyReadStream);
    readStream
        .on("data", onDataChunk)
        .on("error", onError)
        .on("end", destroyReadStream);
}
uws.serveFile = serveFile;

const name = "socket.io";
const version = "4.7.1";
const description = "node.js realtime framework server";
const keywords = [
	"realtime",
	"framework",
	"websocket",
	"tcp",
	"events",
	"socket",
	"io"
];
const files = [
	"dist/",
	"client-dist/",
	"wrapper.mjs",
	"!**/*.tsbuildinfo"
];
const directories = {
	doc: "docs/",
	example: "example/",
	lib: "lib/",
	test: "test/"
};
const type = "commonjs";
const main = "./dist/index.js";
const exports$1 = {
	types: "./dist/index.d.ts",
	"import": "./wrapper.mjs",
	require: "./dist/index.js"
};
const types = "./dist/index.d.ts";
const license = "MIT";
const repository = {
	type: "git",
	url: "git://github.com/socketio/socket.io"
};
const scripts = {
	compile: "rimraf ./dist && tsc",
	test: "npm run format:check && npm run compile && npm run test:types && npm run test:unit",
	"test:types": "tsd",
	"test:unit": "nyc mocha --require ts-node/register --reporter spec --slow 200 --bail --timeout 10000 test/index.ts",
	"format:check": "prettier --check \"lib/**/*.ts\" \"test/**/*.ts\"",
	"format:fix": "prettier --write \"lib/**/*.ts\" \"test/**/*.ts\"",
	prepack: "npm run compile"
};
const dependencies = {
	accepts: "~1.3.4",
	base64id: "~2.0.0",
	cors: "~2.8.5",
	debug: "~4.3.2",
	"engine.io": "~6.5.0",
	"socket.io-adapter": "~2.5.2",
	"socket.io-parser": "~4.2.4"
};
const devDependencies = {
	"@types/mocha": "^9.0.0",
	"expect.js": "0.3.1",
	mocha: "^10.0.0",
	nyc: "^15.1.0",
	prettier: "^2.3.2",
	rimraf: "^3.0.2",
	"socket.io-client": "4.7.1",
	"socket.io-client-v2": "npm:socket.io-client@^2.4.0",
	superagent: "^8.0.0",
	supertest: "^6.1.6",
	"ts-node": "^10.2.1",
	tsd: "^0.21.0",
	typescript: "^4.4.2",
	"uWebSockets.js": "github:uNetworking/uWebSockets.js#v20.30.0"
};
const contributors = [
	{
		name: "Guillermo Rauch",
		email: "rauchg@gmail.com"
	},
	{
		name: "Arnout Kazemier",
		email: "info@3rd-eden.com"
	},
	{
		name: "Vladimir Dronnikov",
		email: "dronnikov@gmail.com"
	},
	{
		name: "Einar Otto Stangvik",
		email: "einaros@gmail.com"
	}
];
const engines = {
	node: ">=10.0.0"
};
const tsd = {
	directory: "test"
};
const _package = {
	name: name,
	version: version,
	description: description,
	keywords: keywords,
	files: files,
	directories: directories,
	type: type,
	main: main,
	exports: exports$1,
	types: types,
	license: license,
	repository: repository,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	contributors: contributors,
	engines: engines,
	tsd: tsd
};

const _package$1 = {
  __proto__: null,
  name: name,
  version: version,
  description: description,
  keywords: keywords,
  files: files,
  directories: directories,
  type: type,
  main: main,
  exports: exports$1,
  types: types,
  license: license,
  repository: repository,
  scripts: scripts,
  dependencies: dependencies,
  devDependencies: devDependencies,
  contributors: contributors,
  engines: engines,
  tsd: tsd,
  'default': _package
};

const require$$18 = /*@__PURE__*/server$1.getAugmentedNamespace(_package$1);

(function (module, exports) {
	var __createBinding = (server$1.commonjsGlobal && server$1.commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (server$1.commonjsGlobal && server$1.commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (server$1.commonjsGlobal && server$1.commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __importDefault = (server$1.commonjsGlobal && server$1.commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Namespace = exports.Socket = exports.Server = void 0;
	const http = require$$0__default$3;
	const fs_1 = require$$1__default;
	const zlib_1 = zlib__default;
	const accepts = server$1.accepts;
	const stream_1 = require$$0__default$2;
	const path = require$$0__default$5;
	const engine_io_1 = engine_io;
	const client_1 = client;
	const events_1 = require$$0__default$1;
	const namespace_1 = namespace;
	Object.defineProperty(exports, "Namespace", { enumerable: true, get: function () { return namespace_1.Namespace; } });
	const parent_namespace_1 = parentNamespace;
	const socket_io_adapter_1 = dist;
	const parser = __importStar(cjs);
	const debug_1 = __importDefault(server$1.src.exports);
	const socket_1 = requireSocket();
	Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_1.Socket; } });
	const typed_events_1 = typedEvents;
	const uws_1 = uws;
	const cors_1 = __importDefault(server$1.lib.exports);
	const debug = (0, debug_1.default)("socket.io:server");
	const clientVersion = require$$18.version;
	const dotMapRegex = /\.map/;
	/**
	 * Represents a Socket.IO server.
	 *
	 * @example
	 * import { Server } from "socket.io";
	 *
	 * const io = new Server();
	 *
	 * io.on("connection", (socket) => {
	 *   console.log(`socket ${socket.id} connected`);
	 *
	 *   // send an event to the client
	 *   socket.emit("foo", "bar");
	 *
	 *   socket.on("foobar", () => {
	 *     // an event was received from the client
	 *   });
	 *
	 *   // upon disconnection
	 *   socket.on("disconnect", (reason) => {
	 *     console.log(`socket ${socket.id} disconnected due to ${reason}`);
	 *   });
	 * });
	 *
	 * io.listen(3000);
	 */
	class Server extends typed_events_1.StrictEventEmitter {
	    constructor(srv, opts = {}) {
	        super();
	        /**
	         * @private
	         */
	        this._nsps = new Map();
	        this.parentNsps = new Map();
	        /**
	         * A subset of the {@link parentNsps} map, only containing {@link ParentNamespace} which are based on a regular
	         * expression.
	         *
	         * @private
	         */
	        this.parentNamespacesFromRegExp = new Map();
	        if ("object" === typeof srv &&
	            srv instanceof Object &&
	            !srv.listen) {
	            opts = srv;
	            srv = undefined;
	        }
	        this.path(opts.path || "/socket.io");
	        this.connectTimeout(opts.connectTimeout || 45000);
	        this.serveClient(false !== opts.serveClient);
	        this._parser = opts.parser || parser;
	        this.encoder = new this._parser.Encoder();
	        this.opts = opts;
	        if (opts.connectionStateRecovery) {
	            opts.connectionStateRecovery = Object.assign({
	                maxDisconnectionDuration: 2 * 60 * 1000,
	                skipMiddlewares: true,
	            }, opts.connectionStateRecovery);
	            this.adapter(opts.adapter || socket_io_adapter_1.SessionAwareAdapter);
	        }
	        else {
	            this.adapter(opts.adapter || socket_io_adapter_1.Adapter);
	        }
	        opts.cleanupEmptyChildNamespaces = !!opts.cleanupEmptyChildNamespaces;
	        this.sockets = this.of("/");
	        if (srv || typeof srv == "number")
	            this.attach(srv);
	        if (this.opts.cors) {
	            this._corsMiddleware = (0, cors_1.default)(this.opts.cors);
	        }
	    }
	    get _opts() {
	        return this.opts;
	    }
	    serveClient(v) {
	        if (!arguments.length)
	            return this._serveClient;
	        this._serveClient = v;
	        return this;
	    }
	    /**
	     * Executes the middleware for an incoming namespace not already created on the server.
	     *
	     * @param name - name of incoming namespace
	     * @param auth - the auth parameters
	     * @param fn - callback
	     *
	     * @private
	     */
	    _checkNamespace(name, auth, fn) {
	        if (this.parentNsps.size === 0)
	            return fn(false);
	        const keysIterator = this.parentNsps.keys();
	        const run = () => {
	            const nextFn = keysIterator.next();
	            if (nextFn.done) {
	                return fn(false);
	            }
	            nextFn.value(name, auth, (err, allow) => {
	                if (err || !allow) {
	                    return run();
	                }
	                if (this._nsps.has(name)) {
	                    // the namespace was created in the meantime
	                    debug("dynamic namespace %s already exists", name);
	                    return fn(this._nsps.get(name));
	                }
	                const namespace = this.parentNsps.get(nextFn.value).createChild(name);
	                debug("dynamic namespace %s was created", name);
	                fn(namespace);
	            });
	        };
	        run();
	    }
	    path(v) {
	        if (!arguments.length)
	            return this._path;
	        this._path = v.replace(/\/$/, "");
	        const escapedPath = this._path.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
	        this.clientPathRegex = new RegExp("^" +
	            escapedPath +
	            "/socket\\.io(\\.msgpack|\\.esm)?(\\.min)?\\.js(\\.map)?(?:\\?|$)");
	        return this;
	    }
	    connectTimeout(v) {
	        if (v === undefined)
	            return this._connectTimeout;
	        this._connectTimeout = v;
	        return this;
	    }
	    adapter(v) {
	        if (!arguments.length)
	            return this._adapter;
	        this._adapter = v;
	        for (const nsp of this._nsps.values()) {
	            nsp._initAdapter();
	        }
	        return this;
	    }
	    /**
	     * Attaches socket.io to a server or port.
	     *
	     * @param srv - server or port
	     * @param opts - options passed to engine.io
	     * @return self
	     */
	    listen(srv, opts = {}) {
	        return this.attach(srv, opts);
	    }
	    /**
	     * Attaches socket.io to a server or port.
	     *
	     * @param srv - server or port
	     * @param opts - options passed to engine.io
	     * @return self
	     */
	    attach(srv, opts = {}) {
	        if ("function" == typeof srv) {
	            const msg = "You are trying to attach socket.io to an express " +
	                "request handler function. Please pass a http.Server instance.";
	            throw new Error(msg);
	        }
	        // handle a port as a string
	        if (Number(srv) == srv) {
	            srv = Number(srv);
	        }
	        if ("number" == typeof srv) {
	            debug("creating http server and binding to %d", srv);
	            const port = srv;
	            srv = http.createServer((req, res) => {
	                res.writeHead(404);
	                res.end();
	            });
	            srv.listen(port);
	        }
	        // merge the options passed to the Socket.IO server
	        Object.assign(opts, this.opts);
	        // set engine.io path to `/socket.io`
	        opts.path = opts.path || this._path;
	        this.initEngine(srv, opts);
	        return this;
	    }
	    attachApp(app /*: TemplatedApp */, opts = {}) {
	        // merge the options passed to the Socket.IO server
	        Object.assign(opts, this.opts);
	        // set engine.io path to `/socket.io`
	        opts.path = opts.path || this._path;
	        // initialize engine
	        debug("creating uWebSockets.js-based engine with opts %j", opts);
	        const engine = new engine_io_1.uServer(opts);
	        engine.attach(app, opts);
	        // bind to engine events
	        this.bind(engine);
	        if (this._serveClient) {
	            // attach static file serving
	            app.get(`${this._path}/*`, (res, req) => {
	                if (!this.clientPathRegex.test(req.getUrl())) {
	                    req.setYield(true);
	                    return;
	                }
	                const filename = req
	                    .getUrl()
	                    .replace(this._path, "")
	                    .replace(/\?.*$/, "")
	                    .replace(/^\//, "");
	                const isMap = dotMapRegex.test(filename);
	                const type = isMap ? "map" : "source";
	                // Per the standard, ETags must be quoted:
	                // https://tools.ietf.org/html/rfc7232#section-2.3
	                const expectedEtag = '"' + clientVersion + '"';
	                const weakEtag = "W/" + expectedEtag;
	                const etag = req.getHeader("if-none-match");
	                if (etag) {
	                    if (expectedEtag === etag || weakEtag === etag) {
	                        debug("serve client %s 304", type);
	                        res.writeStatus("304 Not Modified");
	                        res.end();
	                        return;
	                    }
	                }
	                debug("serve client %s", type);
	                res.writeHeader("cache-control", "public, max-age=0");
	                res.writeHeader("content-type", "application/" + (isMap ? "json" : "javascript") + "; charset=utf-8");
	                res.writeHeader("etag", expectedEtag);
	                const filepath = path.join(__dirname, "../client-dist/", filename);
	                (0, uws_1.serveFile)(res, filepath);
	            });
	        }
	        (0, uws_1.patchAdapter)(app);
	    }
	    /**
	     * Initialize engine
	     *
	     * @param srv - the server to attach to
	     * @param opts - options passed to engine.io
	     * @private
	     */
	    initEngine(srv, opts) {
	        // initialize engine
	        debug("creating engine.io instance with opts %j", opts);
	        this.eio = (0, engine_io_1.attach)(srv, opts);
	        // attach static file serving
	        if (this._serveClient)
	            this.attachServe(srv);
	        // Export http server
	        this.httpServer = srv;
	        // bind to engine events
	        this.bind(this.eio);
	    }
	    /**
	     * Attaches the static file serving.
	     *
	     * @param srv http server
	     * @private
	     */
	    attachServe(srv) {
	        debug("attaching client serving req handler");
	        const evs = srv.listeners("request").slice(0);
	        srv.removeAllListeners("request");
	        srv.on("request", (req, res) => {
	            if (this.clientPathRegex.test(req.url)) {
	                if (this._corsMiddleware) {
	                    this._corsMiddleware(req, res, () => {
	                        this.serve(req, res);
	                    });
	                }
	                else {
	                    this.serve(req, res);
	                }
	            }
	            else {
	                for (let i = 0; i < evs.length; i++) {
	                    evs[i].call(srv, req, res);
	                }
	            }
	        });
	    }
	    /**
	     * Handles a request serving of client source and map
	     *
	     * @param req
	     * @param res
	     * @private
	     */
	    serve(req, res) {
	        const filename = req.url.replace(this._path, "").replace(/\?.*$/, "");
	        const isMap = dotMapRegex.test(filename);
	        const type = isMap ? "map" : "source";
	        // Per the standard, ETags must be quoted:
	        // https://tools.ietf.org/html/rfc7232#section-2.3
	        const expectedEtag = '"' + clientVersion + '"';
	        const weakEtag = "W/" + expectedEtag;
	        const etag = req.headers["if-none-match"];
	        if (etag) {
	            if (expectedEtag === etag || weakEtag === etag) {
	                debug("serve client %s 304", type);
	                res.writeHead(304);
	                res.end();
	                return;
	            }
	        }
	        debug("serve client %s", type);
	        res.setHeader("Cache-Control", "public, max-age=0");
	        res.setHeader("Content-Type", "application/" + (isMap ? "json" : "javascript") + "; charset=utf-8");
	        res.setHeader("ETag", expectedEtag);
	        Server.sendFile(filename, req, res);
	    }
	    /**
	     * @param filename
	     * @param req
	     * @param res
	     * @private
	     */
	    static sendFile(filename, req, res) {
	        const readStream = (0, fs_1.createReadStream)(path.join(__dirname, "../client-dist/", filename));
	        const encoding = accepts(req).encodings(["br", "gzip", "deflate"]);
	        const onError = (err) => {
	            if (err) {
	                res.end();
	            }
	        };
	        switch (encoding) {
	            case "br":
	                res.writeHead(200, { "content-encoding": "br" });
	                readStream.pipe((0, zlib_1.createBrotliCompress)()).pipe(res);
	                (0, stream_1.pipeline)(readStream, (0, zlib_1.createBrotliCompress)(), res, onError);
	                break;
	            case "gzip":
	                res.writeHead(200, { "content-encoding": "gzip" });
	                (0, stream_1.pipeline)(readStream, (0, zlib_1.createGzip)(), res, onError);
	                break;
	            case "deflate":
	                res.writeHead(200, { "content-encoding": "deflate" });
	                (0, stream_1.pipeline)(readStream, (0, zlib_1.createDeflate)(), res, onError);
	                break;
	            default:
	                res.writeHead(200);
	                (0, stream_1.pipeline)(readStream, res, onError);
	        }
	    }
	    /**
	     * Binds socket.io to an engine.io instance.
	     *
	     * @param engine engine.io (or compatible) server
	     * @return self
	     */
	    bind(engine) {
	        this.engine = engine;
	        this.engine.on("connection", this.onconnection.bind(this));
	        return this;
	    }
	    /**
	     * Called with each incoming transport connection.
	     *
	     * @param {engine.Socket} conn
	     * @return self
	     * @private
	     */
	    onconnection(conn) {
	        debug("incoming connection with id %s", conn.id);
	        const client = new client_1.Client(this, conn);
	        if (conn.protocol === 3) {
	            // @ts-ignore
	            client.connect("/");
	        }
	        return this;
	    }
	    /**
	     * Looks up a namespace.
	     *
	     * @example
	     * // with a simple string
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // with a regex
	     * const dynamicNsp = io.of(/^\/dynamic-\d+$/).on("connection", (socket) => {
	     *   const namespace = socket.nsp; // newNamespace.name === "/dynamic-101"
	     *
	     *   // broadcast to all clients in the given sub-namespace
	     *   namespace.emit("hello");
	     * });
	     *
	     * @param name - nsp name
	     * @param fn optional, nsp `connection` ev handler
	     */
	    of(name, fn) {
	        if (typeof name === "function" || name instanceof RegExp) {
	            const parentNsp = new parent_namespace_1.ParentNamespace(this);
	            debug("initializing parent namespace %s", parentNsp.name);
	            if (typeof name === "function") {
	                this.parentNsps.set(name, parentNsp);
	            }
	            else {
	                this.parentNsps.set((nsp, conn, next) => next(null, name.test(nsp)), parentNsp);
	                this.parentNamespacesFromRegExp.set(name, parentNsp);
	            }
	            if (fn) {
	                // @ts-ignore
	                parentNsp.on("connect", fn);
	            }
	            return parentNsp;
	        }
	        if (String(name)[0] !== "/")
	            name = "/" + name;
	        let nsp = this._nsps.get(name);
	        if (!nsp) {
	            for (const [regex, parentNamespace] of this.parentNamespacesFromRegExp) {
	                if (regex.test(name)) {
	                    debug("attaching namespace %s to parent namespace %s", name, regex);
	                    return parentNamespace.createChild(name);
	                }
	            }
	            debug("initializing namespace %s", name);
	            nsp = new namespace_1.Namespace(this, name);
	            this._nsps.set(name, nsp);
	            if (name !== "/") {
	                // @ts-ignore
	                this.sockets.emitReserved("new_namespace", nsp);
	            }
	        }
	        if (fn)
	            nsp.on("connect", fn);
	        return nsp;
	    }
	    /**
	     * Closes server connection
	     *
	     * @param [fn] optional, called as `fn([err])` on error OR all conns closed
	     */
	    close(fn) {
	        for (const socket of this.sockets.sockets.values()) {
	            socket._onclose("server shutting down");
	        }
	        this.engine.close();
	        // restore the Adapter prototype
	        (0, uws_1.restoreAdapter)();
	        if (this.httpServer) {
	            this.httpServer.close(fn);
	        }
	        else {
	            fn && fn();
	        }
	    }
	    /**
	     * Registers a middleware, which is a function that gets executed for every incoming {@link Socket}.
	     *
	     * @example
	     * io.use((socket, next) => {
	     *   // ...
	     *   next();
	     * });
	     *
	     * @param fn - the middleware function
	     */
	    use(fn) {
	        this.sockets.use(fn);
	        return this;
	    }
	    /**
	     * Targets a room when emitting.
	     *
	     * @example
	     * // the “foo” event will be broadcast to all connected clients in the “room-101” room
	     * io.to("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms (a client will be notified at most once)
	     * io.to(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * io.to("room-101").to("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    to(room) {
	        return this.sockets.to(room);
	    }
	    /**
	     * Targets a room when emitting. Similar to `to()`, but might feel clearer in some cases:
	     *
	     * @example
	     * // disconnect all clients in the "room-101" room
	     * io.in("room-101").disconnectSockets();
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    in(room) {
	        return this.sockets.in(room);
	    }
	    /**
	     * Excludes a room when emitting.
	     *
	     * @example
	     * // the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
	     * io.except("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms
	     * io.except(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * io.except("room-101").except("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    except(room) {
	        return this.sockets.except(room);
	    }
	    /**
	     * Emits an event and waits for an acknowledgement from all clients.
	     *
	     * @example
	     * try {
	     *   const responses = await io.timeout(1000).emitWithAck("some-event");
	     *   console.log(responses); // one response per client
	     * } catch (e) {
	     *   // some clients did not acknowledge the event in the given delay
	     * }
	     *
	     * @return a Promise that will be fulfilled when all clients have acknowledged the event
	     */
	    emitWithAck(ev, ...args) {
	        return this.sockets.emitWithAck(ev, ...args);
	    }
	    /**
	     * Sends a `message` event to all clients.
	     *
	     * This method mimics the WebSocket.send() method.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
	     *
	     * @example
	     * io.send("hello");
	     *
	     * // this is equivalent to
	     * io.emit("message", "hello");
	     *
	     * @return self
	     */
	    send(...args) {
	        this.sockets.emit("message", ...args);
	        return this;
	    }
	    /**
	     * Sends a `message` event to all clients. Alias of {@link send}.
	     *
	     * @return self
	     */
	    write(...args) {
	        this.sockets.emit("message", ...args);
	        return this;
	    }
	    /**
	     * Sends a message to the other Socket.IO servers of the cluster.
	     *
	     * @example
	     * io.serverSideEmit("hello", "world");
	     *
	     * io.on("hello", (arg1) => {
	     *   console.log(arg1); // prints "world"
	     * });
	     *
	     * // acknowledgements (without binary content) are supported too:
	     * io.serverSideEmit("ping", (err, responses) => {
	     *  if (err) {
	     *     // some servers did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per server (except the current one)
	     *   }
	     * });
	     *
	     * io.on("ping", (cb) => {
	     *   cb("pong");
	     * });
	     *
	     * @param ev - the event name
	     * @param args - an array of arguments, which may include an acknowledgement callback at the end
	     */
	    serverSideEmit(ev, ...args) {
	        return this.sockets.serverSideEmit(ev, ...args);
	    }
	    /**
	     * Sends a message and expect an acknowledgement from the other Socket.IO servers of the cluster.
	     *
	     * @example
	     * try {
	     *   const responses = await io.serverSideEmitWithAck("ping");
	     *   console.log(responses); // one response per server (except the current one)
	     * } catch (e) {
	     *   // some servers did not acknowledge the event in the given delay
	     * }
	     *
	     * @param ev - the event name
	     * @param args - an array of arguments
	     *
	     * @return a Promise that will be fulfilled when all servers have acknowledged the event
	     */
	    serverSideEmitWithAck(ev, ...args) {
	        return this.sockets.serverSideEmitWithAck(ev, ...args);
	    }
	    /**
	     * Gets a list of socket ids.
	     *
	     * @deprecated this method will be removed in the next major release, please use {@link Server#serverSideEmit} or
	     * {@link Server#fetchSockets} instead.
	     */
	    allSockets() {
	        return this.sockets.allSockets();
	    }
	    /**
	     * Sets the compress flag.
	     *
	     * @example
	     * io.compress(false).emit("hello");
	     *
	     * @param compress - if `true`, compresses the sending data
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    compress(compress) {
	        return this.sockets.compress(compress);
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
	     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
	     * and is in the middle of a request-response cycle).
	     *
	     * @example
	     * io.volatile.emit("hello"); // the clients may or may not receive it
	     *
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    get volatile() {
	        return this.sockets.volatile;
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
	     *
	     * @example
	     * // the “foo” event will be broadcast to all connected clients on this node
	     * io.local.emit("foo", "bar");
	     *
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    get local() {
	        return this.sockets.local;
	    }
	    /**
	     * Adds a timeout in milliseconds for the next operation.
	     *
	     * @example
	     * io.timeout(1000).emit("some-event", (err, responses) => {
	     *   if (err) {
	     *     // some clients did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per client
	     *   }
	     * });
	     *
	     * @param timeout
	     */
	    timeout(timeout) {
	        return this.sockets.timeout(timeout);
	    }
	    /**
	     * Returns the matching socket instances.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // return all Socket instances
	     * const sockets = await io.fetchSockets();
	     *
	     * // return all Socket instances in the "room1" room
	     * const sockets = await io.in("room1").fetchSockets();
	     *
	     * for (const socket of sockets) {
	     *   console.log(socket.id);
	     *   console.log(socket.handshake);
	     *   console.log(socket.rooms);
	     *   console.log(socket.data);
	     *
	     *   socket.emit("hello");
	     *   socket.join("room1");
	     *   socket.leave("room2");
	     *   socket.disconnect();
	     * }
	     */
	    fetchSockets() {
	        return this.sockets.fetchSockets();
	    }
	    /**
	     * Makes the matching socket instances join the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     *
	     * // make all socket instances join the "room1" room
	     * io.socketsJoin("room1");
	     *
	     * // make all socket instances in the "room1" room join the "room2" and "room3" rooms
	     * io.in("room1").socketsJoin(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsJoin(room) {
	        return this.sockets.socketsJoin(room);
	    }
	    /**
	     * Makes the matching socket instances leave the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // make all socket instances leave the "room1" room
	     * io.socketsLeave("room1");
	     *
	     * // make all socket instances in the "room1" room leave the "room2" and "room3" rooms
	     * io.in("room1").socketsLeave(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsLeave(room) {
	        return this.sockets.socketsLeave(room);
	    }
	    /**
	     * Makes the matching socket instances disconnect.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // make all socket instances disconnect (the connections might be kept alive for other namespaces)
	     * io.disconnectSockets();
	     *
	     * // make all socket instances in the "room1" room disconnect and close the underlying connections
	     * io.in("room1").disconnectSockets(true);
	     *
	     * @param close - whether to close the underlying connection
	     */
	    disconnectSockets(close = false) {
	        return this.sockets.disconnectSockets(close);
	    }
	}
	exports.Server = Server;
	/**
	 * Expose main namespace (/).
	 */
	const emitterMethods = Object.keys(events_1.EventEmitter.prototype).filter(function (key) {
	    return typeof events_1.EventEmitter.prototype[key] === "function";
	});
	emitterMethods.forEach(function (fn) {
	    Server.prototype[fn] = function () {
	        return this.sockets[fn].apply(this.sockets, arguments);
	    };
	});
	module.exports = (srv, opts) => new Server(srv, opts);
	module.exports.Server = Server;
	module.exports.Namespace = namespace_1.Namespace;
	module.exports.Socket = socket_1.Socket;
	requireSocket();
} (dist$1, dist$1.exports));

const io = /*@__PURE__*/server$1.getDefaultExportFromCjs(dist$1.exports);

const {Server, Namespace, Socket} = io;

exports.Namespace = Namespace;
exports.Server = Server;
exports.Socket = Socket;
