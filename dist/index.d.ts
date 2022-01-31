declare function setExtendedAttributes(filePath: string, xattrsToSet: object, prefix?: string): Promise<void>;
declare function getExtendedAttributes(filePath: string, xattrsToGet?: Readonly<Array<string>> | Array<string>, prefix?: string): Promise<Record<string, any> | undefined>;
declare function removeExtendedAttributes(filePath: string, xattrsToRemove: Readonly<Array<string>> | Array<string>, prefix?: string): Promise<void>;
export { getExtendedAttributes, setExtendedAttributes, removeExtendedAttributes, };
