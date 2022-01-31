import { getAttribute, listAttributes, setAttribute, removeAttribute } from 'fs-xattr';
const DEFAULT_PREFIX = 'user';
async function setExtendedAttributes(filePath, xattrsToSet, prefix = DEFAULT_PREFIX) {
    prefix && (prefix = prefix + '.'); // add dot if prefix is recieved
    for (const [xattrName, value] of Object.entries(xattrsToSet)) {
        await setAttribute(filePath, prefix + xattrName, value);
    }
}
async function getExtendedAttributes(filePath, xattrsToGet, prefix) {
    let filtered = {};
    for await (const xattrOnFile of await listAttributes(filePath)) {
        const unprefixedXattr = unprefix(xattrOnFile, prefix);
        // ignore file xattrs missing prefix
        if (!unprefixedXattr)
            return;
        // when filtering param is recieved but does not contain current xattr, ignore
        if (xattrsToGet !== undefined && !xattrsToGet.includes(unprefixedXattr))
            return;
        filtered[unprefixedXattr] = (await getAttribute(filePath, xattrOnFile)).toString('utf8');
    }
    return filtered;
}
async function removeExtendedAttributes(filePath, xattrsToRemove, prefix) {
    for await (let xattrOnFile of await listAttributes(filePath)) {
        const unprefixedXattr = unprefix(xattrOnFile, prefix);
        // ignore file xattrs missing the prefix
        if (unprefixedXattr && !xattrsToRemove.includes(unprefixedXattr))
            return;
        await removeAttribute(filePath, xattrOnFile);
    }
}
const unprefix = (xattrName, prefix = DEFAULT_PREFIX) => {
    prefix && (prefix = prefix + '.'); // add dot if prefix is recieved
    if (!xattrName.startsWith(prefix))
        return; // ignore file xattrs missing the prefix
    return xattrName.slice(prefix.length);
};
export { getExtendedAttributes, setExtendedAttributes, removeExtendedAttributes, };
//# sourceMappingURL=index.js.map