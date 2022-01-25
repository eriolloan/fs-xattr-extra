declare function setExtendedAttributes(filePath: string, xattrs: object, prefix?: string): Promise<void>;
declare function getExtendedAttributes(filePath: string, prefix?: string): Promise<{}>;
declare function removeExtendedAttributes(filePath: string, xattrsToRemove: Readonly<Array<string>> | Array<string>, prefix?: string): Promise<void>;
export { getExtendedAttributes, setExtendedAttributes, removeExtendedAttributes, };
