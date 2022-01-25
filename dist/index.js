var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { getAttribute, listAttributes, setAttribute, removeAttribute } from 'fs-xattr';
const DEFAULT_PREFIX = 'user';
function setExtendedAttributes(filePath, xattrsToSet, prefix = DEFAULT_PREFIX) {
    return __awaiter(this, void 0, void 0, function* () {
        prefix && (prefix = prefix + '.'); // add dot if prefix is recieved
        for (const [xattrName, value] of Object.entries(xattrsToSet)) {
            yield setAttribute(filePath, prefix + xattrName, value);
        }
    });
}
function getExtendedAttributes(filePath, xattrsToGet, prefix) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let filtered = {};
        try {
            for (var _b = __asyncValues(yield listAttributes(filePath)), _c; _c = yield _b.next(), !_c.done;) {
                const xattrOnFile = _c.value;
                const unprefixedXattr = unprefix(xattrOnFile, prefix);
                // ignore file xattrs missing prefix
                if (!unprefixedXattr)
                    return;
                // when filtering param is recieved but does not contain current xattr, ignore
                if (xattrsToGet !== undefined && !xattrsToGet.includes(unprefixedXattr))
                    return;
                filtered[unprefixedXattr] = (yield getAttribute(filePath, xattrOnFile)).toString('utf8');
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return filtered;
    });
}
function removeExtendedAttributes(filePath, xattrsToRemove, prefix) {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (var _b = __asyncValues(yield listAttributes(filePath)), _c; _c = yield _b.next(), !_c.done;) {
                let xattrOnFile = _c.value;
                const unprefixedXattr = unprefix(xattrOnFile, prefix);
                // ignore file xattrs missing the prefix
                if (!xattrsToRemove.includes(unprefixedXattr))
                    return;
                yield removeAttribute(filePath, xattrOnFile);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
const unprefix = (xattrName, prefix = DEFAULT_PREFIX) => {
    prefix && (prefix = prefix + '.'); // add dot if prefix is recieved
    if (!xattrName.startsWith(prefix))
        return; // ignore file xattrs missing the prefix
    return xattrName.slice(prefix.length);
};
export { getExtendedAttributes, setExtendedAttributes, removeExtendedAttributes, };
