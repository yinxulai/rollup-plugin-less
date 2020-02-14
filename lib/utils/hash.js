"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hash(input) {
    var hash = 5381;
    var i = input.length - 1;
    var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
    if (typeof input == 'string') {
        for (; i > -1; i--)
            hash += (hash << 5) + input.charCodeAt(i);
    }
    else {
        for (; i > -1; i--)
            hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF;
    var retValue = '';
    do {
        retValue += I64BIT_TABLE[value & 0x3F];
    } while (value >>= 6);
    return retValue;
}
exports.default = hash;
//# sourceMappingURL=hash.js.map