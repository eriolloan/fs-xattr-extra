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
function setExtendedAttributes(filePath, xattrs, prefix = DEFAULT_PREFIX) {
    return __awaiter(this, void 0, void 0, function* () {
        prefix && (prefix = prefix + '.'); // add dot if prefix is recieved
        for (const [xattrName, value] of Object.entries(xattrs)) {
            yield setAttribute(filePath, prefix + xattrName, value);
        }
    });
}
function getExtendedAttributes(filePath, prefix) {
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
import { iterateOnFilePaths } from 'fs-custom-tools';
import fs from 'fs';
/** for dev purposes */
const NODES_ROOT_DIR = './playground_dir';
const NODE_RECORD_ATTRIBUTES = ['uuid', 'created', 'knownLocation'];
/** for dev purposes */
const knownNodeRecords = [
    {
        uuid: '43085948',
        created: 'created',
        knownLocation: 'node_01.txt',
    },
    {
        uuid: '55369411',
        created: 'created',
        knownLocation: 'node_02.txt',
    },
    {
        uuid: '95837745',
        created: 'created',
        knownLocation: 'subfolder/subnode_01.txt',
    },
    {
        uuid: '38855012',
        created: 'created',
        knownLocation: 'subfolder/subsubfolder/subsubnode_01.txt',
    },
];
function stampKnownNodes(nodeRecords) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const nodeRecord of nodeRecords) {
            yield stampNodeFile(nodeRecord);
        }
    });
}
function stampNodeFile(nodeRecord) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = NODES_ROOT_DIR + '/' + nodeRecord.knownLocation;
        // if path exists and is writable
        fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (error) => __awaiter(this, void 0, void 0, function* () {
            if (error)
                return; // TODO better error handling
            yield setExtendedAttributes(path, nodeRecord);
        }));
    });
}
function unstampNodeFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        yield removeExtendedAttributes(path, NODE_RECORD_ATTRIBUTES);
    });
}
function unstampAllInDir(path) {
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (var _b = __asyncValues(iterateOnFilePaths(path)), _c; _c = yield _b.next(), !_c.done;) {
                const filePath = _c.value;
                yield unstampNodeFile(filePath);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    });
}
function listStampsInDir(path) {
    var e_4, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (var _b = __asyncValues(iterateOnFilePaths(path)), _c; _c = yield _b.next(), !_c.done;) {
                const filePath = _c.value;
                console.log(`${filePath} : `, yield getExtendedAttributes(filePath));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    });
}
function doIt() {
    return __awaiter(this, void 0, void 0, function* () {
        yield stampKnownNodes(knownNodeRecords);
        // await unstampAllInDir(NODES_ROOT_DIR)
        yield listStampsInDir(NODES_ROOT_DIR);
    });
}
doIt();
export { getExtendedAttributes, setExtendedAttributes, removeExtendedAttributes, };
