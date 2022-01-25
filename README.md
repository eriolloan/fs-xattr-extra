# fs-xattr-extra
Batch access/change/remove extended attributes on a file.

## Dependecies
This library imports [fs-xattr](https://github.com/LinusU/fs-xattr), which depends on `make` being installed on the system. (available installing `gnumake` on linux)


### System support for extended attributes
To check manually, you can try setting attributes on a file :

```
setfattr -n user.comment -v "some comment" myFile.txt  // set attribute
getfattr -n user.comment myFile.txt  // get attribute
```


## Usage

### Filtering namespaces and attributes

#### Targeting namespaces with `prefix` (default is 'user')
The operating system and other applications may set their own extended attributes on files and some namespaces are reserved or unavailable depending on the OS.

As a precaution, all operations will ignore extended attributes not starting with the prefix.

By default the `'user'` namespace is used (is seems a sensible default as it is supported accross a [wide array of systems](https://en.wikipedia.org/wiki/Extended_file_attributes)).

To perform operations within a known namespace, the `prefix` argument can be passed to override this behaviour. To get all extended attributes, pass an empty string.

#### Removing / Getting specific attributes
For operations to target specific attributes, an array of attribute names can be passed as a filter.



## await getExtendedAttributes()
Returns a Promise.

Resolves as an object of extended attributes starting with a given prefix (`user` is a sensible default as it is supported accross a [wide array of systems](https://en.wikipedia.org/wiki/Extended_file_attributes)).


### usage

`await getExtendedAttributes(filePath: string [,xattrsToGet, prefix])`

|  parameter 	| type | details |
|---|---|---------|
|`filePath`		| string 	| path to the file (with extension)	|
|`xattrsToGet`		| Array<\string> 	| array of desired attributes (whithout the prefix)<br>*Optional, all attributes are returned by defaults*	|
|`prefix` 	| string	| namespacing prefix <br>Only extended attributes strating with `[prefix].` will be returned. The prefix is removed from the returned object's attributes. <br>*Optional, defaults to* `'user'`	 |


### return object
For a file named `file.txt` with the following extended properties:
```
	user.someProp : 'some value'
	user.anotherProp : 'another value'
	user.parentProp.childProp : 'nested value'
```

`await getExtendedAttributes('file.txt')` returns :
```
	{
		someProp : 'some value',
		anotherProp : 'another value',
		'parentProp.childProp' : 'nested value'
		// does not deal with nesting
	}
```

`await getExtendedAttributes('file.txt', 'user.parentProp')` returns :
```
	{
		childProp : 'nested value'
	}
```

When no corresponding attributes are found, the function returns an empty object `{}`.



## await setExtendedAttributes()

### usage
`await setExtendedAttributes(filePath: string [, xattrsToSet: object, prefix: string = 'user'])`

**Note:** Does not support xattrsToSet having nested properties.


|  parameter 	| type | details |
|---|---|---------|
|`filePath`		| string 	| path to the file (with extension)	|
|`xattrsToSet`		| object 	| object of attributes to set on the file. <br> Object properties keys are used as extended attribute names.<br> **Note:** extended attribute names are produced by prepending the prefix to the object key names (i.e.: prefix should be ommited from your object keys.)	|
|`prefix` 	| string	| namespacing prefix <br>Only extended attributes strating with `[prefix].` will be returned. The prefix is removed from the returned object's attributes. <br>*Optional, defaults to* `'user'`	 |

## await removeExtendedAttributes()

### usage
`await removeExtendedAttributes(filePath: string [, xattrsToRemove: Array<string>, prefix: string = 'user'])`

**Note:** Performs some checks on file existing and being readable, but does not currently handle exceptions.

|  parameter 	| type | details |
|---|---|---------|
|`filePath`		| string 	| path to the file (with extension)	|
|`xattrsToRemove`		| Array < string > 	| array of desired attributes (whithout the prefix)<br>	|
|`prefix` 	| string	| namespacing prefix <br>Only extended attributes strating with `[prefix].` will be returned. The prefix is removed from the returned object's attributes. <br>*Optional, defaults to* `'user'`	 |