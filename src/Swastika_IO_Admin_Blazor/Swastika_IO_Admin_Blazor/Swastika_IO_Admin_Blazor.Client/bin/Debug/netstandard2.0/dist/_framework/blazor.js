/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MonoPlatform_1 = __webpack_require__(6);
exports.platform = MonoPlatform_1.monoPlatform;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InternalRegisteredFunction_1 = __webpack_require__(7);
var registeredFunctions = {};
function registerFunction(identifier, implementation) {
    if (InternalRegisteredFunction_1.internalRegisteredFunctions.hasOwnProperty(identifier)) {
        throw new Error("The function identifier '" + identifier + "' is reserved and cannot be registered.");
    }
    if (registeredFunctions.hasOwnProperty(identifier)) {
        throw new Error("A function with the identifier '" + identifier + "' has already been registered.");
    }
    registeredFunctions[identifier] = implementation;
}
exports.registerFunction = registerFunction;
function getRegisteredFunction(identifier) {
    // By prioritising the internal ones, we ensure you can't override them
    var result = InternalRegisteredFunction_1.internalRegisteredFunctions[identifier] || registeredFunctions[identifier];
    if (result) {
        return result;
    }
    else {
        throw new Error("Could not find registered function with name '" + identifier + "'.");
    }
}
exports.getRegisteredFunction = getRegisteredFunction;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getAssemblyNameFromUrl(url) {
    var lastSegment = url.substring(url.lastIndexOf('/') + 1);
    var queryStringStartPos = lastSegment.indexOf('?');
    var filename = queryStringStartPos < 0 ? lastSegment : lastSegment.substring(0, queryStringStartPos);
    return filename.replace(/\.dll$/, '');
}
exports.getAssemblyNameFromUrl = getAssemblyNameFromUrl;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RenderBatch_1 = __webpack_require__(9);
var BrowserRenderer_1 = __webpack_require__(10);
var browserRenderers = {};
function attachComponentToElement(browserRendererId, elementSelector, componentId) {
    var elementSelectorJs = Environment_1.platform.toJavaScriptString(elementSelector);
    var element = document.querySelector(elementSelectorJs);
    if (!element) {
        throw new Error("Could not find any element matching selector '" + elementSelectorJs + "'.");
    }
    var browserRenderer = browserRenderers[browserRendererId];
    if (!browserRenderer) {
        browserRenderer = browserRenderers[browserRendererId] = new BrowserRenderer_1.BrowserRenderer(browserRendererId);
    }
    browserRenderer.attachComponentToElement(componentId, element);
    clearElement(element);
}
exports.attachComponentToElement = attachComponentToElement;
function renderBatch(browserRendererId, batch) {
    var browserRenderer = browserRenderers[browserRendererId];
    if (!browserRenderer) {
        throw new Error("There is no browser renderer with ID " + browserRendererId + ".");
    }
    var updatedComponents = RenderBatch_1.renderBatch.updatedComponents(batch);
    var updatedComponentsLength = RenderBatch_1.arrayRange.count(updatedComponents);
    var updatedComponentsArray = RenderBatch_1.arrayRange.array(updatedComponents);
    var referenceFramesStruct = RenderBatch_1.renderBatch.referenceFrames(batch);
    var referenceFrames = RenderBatch_1.arrayRange.array(referenceFramesStruct);
    for (var i = 0; i < updatedComponentsLength; i++) {
        var diff = Environment_1.platform.getArrayEntryPtr(updatedComponentsArray, i, RenderBatch_1.renderTreeDiffStructLength);
        var componentId = RenderBatch_1.renderTreeDiff.componentId(diff);
        var editsArraySegment = RenderBatch_1.renderTreeDiff.edits(diff);
        var edits = RenderBatch_1.arraySegment.array(editsArraySegment);
        var editsOffset = RenderBatch_1.arraySegment.offset(editsArraySegment);
        var editsLength = RenderBatch_1.arraySegment.count(editsArraySegment);
        browserRenderer.updateComponent(componentId, edits, editsOffset, editsLength, referenceFrames);
    }
    var disposedComponentIds = RenderBatch_1.renderBatch.disposedComponentIds(batch);
    var disposedComponentIdsLength = RenderBatch_1.arrayRange.count(disposedComponentIds);
    var disposedComponentIdsArray = RenderBatch_1.arrayRange.array(disposedComponentIds);
    for (var i = 0; i < disposedComponentIdsLength; i++) {
        var componentIdPtr = Environment_1.platform.getArrayEntryPtr(disposedComponentIdsArray, i, 4);
        var componentId = Environment_1.platform.readInt32Field(componentIdPtr);
        browserRenderer.disposeComponent(componentId);
    }
}
exports.renderBatch = renderBatch;
function clearElement(element) {
    var childNode;
    while (childNode = element.firstChild) {
        element.removeChild(childNode);
    }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegisteredFunction_1 = __webpack_require__(1);
var Environment_1 = __webpack_require__(0);
var registeredFunctionPrefix = 'Microsoft.AspNetCore.Blazor.Browser.Services.BrowserUriHelper';
var notifyLocationChangedMethod;
var hasRegisteredEventListeners = false;
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".getLocationHref", function () { return Environment_1.platform.toDotNetString(location.href); });
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".getBaseURI", function () { return document.baseURI ? Environment_1.platform.toDotNetString(document.baseURI) : null; });
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".enableNavigationInteception", function () {
    if (hasRegisteredEventListeners) {
        return;
    }
    hasRegisteredEventListeners = true;
    document.addEventListener('click', function (event) {
        // Intercept clicks on all <a> elements where the href is within the <base href> URI space
        var anchorTarget = findClosestAncestor(event.target, 'A');
        if (anchorTarget) {
            var href = anchorTarget.getAttribute('href');
            if (isWithinBaseUriSpace(toAbsoluteUri(href))) {
                event.preventDefault();
                performInternalNavigation(href);
            }
        }
    });
    window.addEventListener('popstate', handleInternalNavigation);
});
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".navigateTo", function (uriDotNetString) {
    navigateTo(Environment_1.platform.toJavaScriptString(uriDotNetString));
});
function navigateTo(uri) {
    if (isWithinBaseUriSpace(toAbsoluteUri(uri))) {
        performInternalNavigation(uri);
    }
    else {
        location.href = uri;
    }
}
exports.navigateTo = navigateTo;
function performInternalNavigation(href) {
    history.pushState(null, /* ignored title */ '', href);
    handleInternalNavigation();
}
function handleInternalNavigation() {
    if (!notifyLocationChangedMethod) {
        notifyLocationChangedMethod = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Services', 'BrowserUriHelper', 'NotifyLocationChanged');
    }
    Environment_1.platform.callMethod(notifyLocationChangedMethod, null, [
        Environment_1.platform.toDotNetString(location.href)
    ]);
}
var testAnchor;
function toAbsoluteUri(relativeUri) {
    testAnchor = testAnchor || document.createElement('a');
    testAnchor.href = relativeUri;
    return testAnchor.href;
}
function findClosestAncestor(element, tagName) {
    return !element
        ? null
        : element.tagName === tagName
            ? element
            : findClosestAncestor(element.parentElement, tagName);
}
function isWithinBaseUriSpace(href) {
    var baseUriPrefixWithTrailingSlash = toBaseUriPrefixWithTrailingSlash(document.baseURI); // TODO: Might baseURI really be null?
    return href.startsWith(baseUriPrefixWithTrailingSlash);
}
function toBaseUriPrefixWithTrailingSlash(baseUri) {
    return baseUri.substr(0, baseUri.lastIndexOf('/') + 1);
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var DotNet_1 = __webpack_require__(2);
__webpack_require__(3);
__webpack_require__(13);
__webpack_require__(4);
__webpack_require__(14);
function boot() {
    return __awaiter(this, void 0, void 0, function () {
        var allScriptElems, thisScriptElem, isLinkerEnabled, entryPointDll, entryPointMethod, entryPointAssemblyName, referenceAssembliesCommaSeparated, referenceAssemblies, loadAssemblyUrls, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allScriptElems = document.getElementsByTagName('script');
                    thisScriptElem = (document.currentScript || allScriptElems[allScriptElems.length - 1]);
                    isLinkerEnabled = thisScriptElem.getAttribute('linker-enabled') === 'true';
                    entryPointDll = getRequiredBootScriptAttribute(thisScriptElem, 'main');
                    entryPointMethod = getRequiredBootScriptAttribute(thisScriptElem, 'entrypoint');
                    entryPointAssemblyName = DotNet_1.getAssemblyNameFromUrl(entryPointDll);
                    referenceAssembliesCommaSeparated = thisScriptElem.getAttribute('references') || '';
                    referenceAssemblies = referenceAssembliesCommaSeparated
                        .split(',')
                        .map(function (s) { return s.trim(); })
                        .filter(function (s) { return !!s; });
                    if (!isLinkerEnabled) {
                        console.info('Blazor is running in dev mode without IL stripping. To make the bundle size significantly smaller, publish the application or see https://go.microsoft.com/fwlink/?linkid=870414');
                    }
                    loadAssemblyUrls = [entryPointDll]
                        .concat(referenceAssemblies)
                        .map(function (filename) { return "_framework/_bin/" + filename; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Environment_1.platform.start(loadAssemblyUrls)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    throw new Error("Failed to start platform. Reason: " + ex_1);
                case 4:
                    // Start up the application
                    Environment_1.platform.callEntryPoint(entryPointAssemblyName, entryPointMethod, []);
                    return [2 /*return*/];
            }
        });
    });
}
function getRequiredBootScriptAttribute(elem, attributeName) {
    var result = elem.getAttribute(attributeName);
    if (!result) {
        throw new Error("Missing \"" + attributeName + "\" attribute on Blazor script tag.");
    }
    return result;
}
boot();


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DotNet_1 = __webpack_require__(2);
var RegisteredFunction_1 = __webpack_require__(1);
var assembly_load;
var find_class;
var find_method;
var invoke_method;
var mono_string_get_utf8;
var mono_string;
exports.monoPlatform = {
    start: function start(loadAssemblyUrls) {
        return new Promise(function (resolve, reject) {
            // mono.js assumes the existence of this
            window['Browser'] = {
                init: function () { },
                asyncLoad: asyncLoad
            };
            // Emscripten works by expecting the module config to be a global
            window['Module'] = createEmscriptenModuleInstance(loadAssemblyUrls, resolve, reject);
            addScriptTagsToDocument();
        });
    },
    findMethod: function findMethod(assemblyName, namespace, className, methodName) {
        // TODO: Cache the assembly_load outputs?
        var assemblyHandle = assembly_load(assemblyName);
        if (!assemblyHandle) {
            throw new Error("Could not find assembly \"" + assemblyName + "\"");
        }
        var typeHandle = find_class(assemblyHandle, namespace, className);
        if (!typeHandle) {
            throw new Error("Could not find type \"" + className + "\" in namespace \"" + namespace + "\" in assembly \"" + assemblyName + "\"");
        }
        var methodHandle = find_method(typeHandle, methodName, -1);
        if (!methodHandle) {
            throw new Error("Could not find method \"" + methodName + "\" on type \"" + namespace + "." + className + "\"");
        }
        return methodHandle;
    },
    callEntryPoint: function callEntryPoint(assemblyName, entrypointMethod, args) {
        // Parse the entrypointMethod, which is of the form MyApp.MyNamespace.MyTypeName::MyMethodName
        // Note that we don't support specifying a method overload, so it has to be unique
        var entrypointSegments = entrypointMethod.split('::');
        if (entrypointSegments.length != 2) {
            throw new Error('Malformed entry point method name; could not resolve class name and method name.');
        }
        var typeFullName = entrypointSegments[0];
        var methodName = entrypointSegments[1];
        var lastDot = typeFullName.lastIndexOf('.');
        var namespace = lastDot > -1 ? typeFullName.substring(0, lastDot) : '';
        var typeShortName = lastDot > -1 ? typeFullName.substring(lastDot + 1) : typeFullName;
        var entryPointMethodHandle = exports.monoPlatform.findMethod(assemblyName, namespace, typeShortName, methodName);
        exports.monoPlatform.callMethod(entryPointMethodHandle, null, args);
    },
    callMethod: function callMethod(method, target, args) {
        if (args.length > 4) {
            // Hopefully this restriction can be eased soon, but for now make it clear what's going on
            throw new Error("Currently, MonoPlatform supports passing a maximum of 4 arguments from JS to .NET. You tried to pass " + args.length + ".");
        }
        var stack = Module.stackSave();
        try {
            var argsBuffer = Module.stackAlloc(args.length);
            var exceptionFlagManagedInt = Module.stackAlloc(4);
            for (var i = 0; i < args.length; ++i) {
                Module.setValue(argsBuffer + i * 4, args[i], 'i32');
            }
            Module.setValue(exceptionFlagManagedInt, 0, 'i32');
            var res = invoke_method(method, target, argsBuffer, exceptionFlagManagedInt);
            if (Module.getValue(exceptionFlagManagedInt, 'i32') !== 0) {
                // If the exception flag is set, the returned value is exception.ToString()
                throw new Error(exports.monoPlatform.toJavaScriptString(res));
            }
            return res;
        }
        finally {
            Module.stackRestore(stack);
        }
    },
    toJavaScriptString: function toJavaScriptString(managedString) {
        // Comments from original Mono sample:
        //FIXME this is wastefull, we could remove the temp malloc by going the UTF16 route
        //FIXME this is unsafe, cuz raw objects could be GC'd.
        var utf8 = mono_string_get_utf8(managedString);
        var res = Module.UTF8ToString(utf8);
        Module._free(utf8);
        return res;
    },
    toDotNetString: function toDotNetString(jsString) {
        return mono_string(jsString);
    },
    getArrayLength: function getArrayLength(array) {
        return Module.getValue(getArrayDataPointer(array), 'i32');
    },
    getArrayEntryPtr: function getArrayEntryPtr(array, index, itemSize) {
        // First byte is array length, followed by entries
        var address = getArrayDataPointer(array) + 4 + index * itemSize;
        return address;
    },
    getObjectFieldsBaseAddress: function getObjectFieldsBaseAddress(referenceTypedObject) {
        // The first two int32 values are internal Mono data
        return (referenceTypedObject + 8);
    },
    readInt32Field: function readHeapInt32(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
    },
    readObjectField: function readHeapObject(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
    },
    readStringField: function readHeapObject(baseAddress, fieldOffset) {
        var fieldValue = Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
        return fieldValue === 0 ? null : exports.monoPlatform.toJavaScriptString(fieldValue);
    },
    readStructField: function readStructField(baseAddress, fieldOffset) {
        return (baseAddress + (fieldOffset || 0));
    },
};
// Bypass normal type checking to add this extra function. It's only intended to be called from
// the JS code in Mono's driver.c. It's never intended to be called from TypeScript.
exports.monoPlatform.monoGetRegisteredFunction = RegisteredFunction_1.getRegisteredFunction;
function addScriptTagsToDocument() {
    // Load either the wasm or asm.js version of the Mono runtime
    var browserSupportsNativeWebAssembly = typeof WebAssembly !== 'undefined' && WebAssembly.validate;
    var monoRuntimeUrlBase = '_framework/' + (browserSupportsNativeWebAssembly ? 'wasm' : 'asmjs');
    var monoRuntimeScriptUrl = monoRuntimeUrlBase + "/mono.js";
    if (!browserSupportsNativeWebAssembly) {
        // In the asmjs case, the initial memory structure is in a separate file we need to download
        var meminitXHR = Module['memoryInitializerRequest'] = new XMLHttpRequest();
        meminitXHR.open('GET', monoRuntimeUrlBase + "/mono.js.mem");
        meminitXHR.responseType = 'arraybuffer';
        meminitXHR.send(null);
    }
    document.write("<script defer src=\"" + monoRuntimeScriptUrl + "\"></script>");
}
function createEmscriptenModuleInstance(loadAssemblyUrls, onReady, onError) {
    var module = {};
    var wasmBinaryFile = '_framework/wasm/mono.wasm';
    var asmjsCodeFile = '_framework/asmjs/mono.asm.js';
    module.print = function (line) { return console.log("WASM: " + line); };
    module.printErr = function (line) { return console.error("WASM: " + line); };
    module.preRun = [];
    module.postRun = [];
    module.preloadPlugins = [];
    module.locateFile = function (fileName) {
        switch (fileName) {
            case 'mono.wasm': return wasmBinaryFile;
            case 'mono.asm.js': return asmjsCodeFile;
            default: return fileName;
        }
    };
    module.preRun.push(function () {
        // By now, emscripten should be initialised enough that we can capture these methods for later use
        assembly_load = Module.cwrap('mono_wasm_assembly_load', 'number', ['string']);
        find_class = Module.cwrap('mono_wasm_assembly_find_class', 'number', ['number', 'string', 'string']);
        find_method = Module.cwrap('mono_wasm_assembly_find_method', 'number', ['number', 'string', 'number']);
        invoke_method = Module.cwrap('mono_wasm_invoke_method', 'number', ['number', 'number', 'number']);
        mono_string_get_utf8 = Module.cwrap('mono_wasm_string_get_utf8', 'number', ['number']);
        mono_string = Module.cwrap('mono_wasm_string_from_js', 'number', ['string']);
        Module.FS_createPath('/', 'appBinDir', true, true);
        loadAssemblyUrls.forEach(function (url) {
            return FS.createPreloadedFile('appBinDir', DotNet_1.getAssemblyNameFromUrl(url) + ".dll", url, true, false, undefined, onError);
        });
    });
    module.postRun.push(function () {
        var load_runtime = Module.cwrap('mono_wasm_load_runtime', null, ['string']);
        load_runtime('appBinDir');
        onReady();
    });
    return module;
}
function asyncLoad(url, onload, onerror) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', url, /* async: */ true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
        if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
            var asm = new Uint8Array(xhr.response);
            onload(asm);
        }
        else {
            onerror(xhr);
        }
    };
    xhr.onerror = onerror;
    xhr.send(null);
}
function getArrayDataPointer(array) {
    return array + 12; // First byte from here is length, then following bytes are entries
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InvokeWithJsonMarshalling_1 = __webpack_require__(8);
var Renderer_1 = __webpack_require__(3);
/**
 * The definitive list of internal functions invokable from .NET code.
 * These function names are treated as 'reserved' and cannot be passed to registerFunction.
 */
exports.internalRegisteredFunctions = {
    attachComponentToElement: Renderer_1.attachComponentToElement,
    invokeWithJsonMarshalling: InvokeWithJsonMarshalling_1.invokeWithJsonMarshalling,
    renderBatch: Renderer_1.renderBatch,
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
function invokeWithJsonMarshalling(identifier) {
    var argsJson = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        argsJson[_i - 1] = arguments[_i];
    }
    var identifierJsString = Environment_1.platform.toJavaScriptString(identifier);
    var funcInstance = RegisteredFunction_1.getRegisteredFunction(identifierJsString);
    var args = argsJson.map(function (json) { return JSON.parse(Environment_1.platform.toJavaScriptString(json)); });
    var result = funcInstance.apply(null, args);
    if (result !== null && result !== undefined) {
        var resultJson = JSON.stringify(result);
        return Environment_1.platform.toDotNetString(resultJson);
    }
    else {
        return null;
    }
}
exports.invokeWithJsonMarshalling = invokeWithJsonMarshalling;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
// Keep in sync with the structs in .NET code
exports.renderBatch = {
    updatedComponents: function (obj) { return Environment_1.platform.readStructField(obj, 0); },
    referenceFrames: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength); },
    disposedComponentIds: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength + arrayRangeStructLength); },
};
var arrayRangeStructLength = 8;
exports.arrayRange = {
    array: function (obj) { return Environment_1.platform.readObjectField(obj, 0); },
    count: function (obj) { return Environment_1.platform.readInt32Field(obj, 4); },
};
var arraySegmentStructLength = 12;
exports.arraySegment = {
    array: function (obj) { return Environment_1.platform.readObjectField(obj, 0); },
    offset: function (obj) { return Environment_1.platform.readInt32Field(obj, 4); },
    count: function (obj) { return Environment_1.platform.readInt32Field(obj, 8); },
};
exports.renderTreeDiffStructLength = 4 + arraySegmentStructLength;
exports.renderTreeDiff = {
    componentId: function (obj) { return Environment_1.platform.readInt32Field(obj, 0); },
    edits: function (obj) { return Environment_1.platform.readStructField(obj, 4); },
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RenderTreeEdit_1 = __webpack_require__(11);
var RenderTreeFrame_1 = __webpack_require__(12);
var Environment_1 = __webpack_require__(0);
var selectValuePropname = '_blazorSelectValue';
var raiseEventMethod;
var renderComponentMethod;
var BrowserRenderer = /** @class */ (function () {
    function BrowserRenderer(browserRendererId) {
        this.browserRendererId = browserRendererId;
        this.childComponentLocations = {};
    }
    BrowserRenderer.prototype.attachComponentToElement = function (componentId, element) {
        this.childComponentLocations[componentId] = element;
    };
    BrowserRenderer.prototype.updateComponent = function (componentId, edits, editsOffset, editsLength, referenceFrames) {
        var element = this.childComponentLocations[componentId];
        if (!element) {
            throw new Error("No element is currently associated with component " + componentId);
        }
        this.applyEdits(componentId, element, 0, edits, editsOffset, editsLength, referenceFrames);
    };
    BrowserRenderer.prototype.disposeComponent = function (componentId) {
        delete this.childComponentLocations[componentId];
    };
    BrowserRenderer.prototype.applyEdits = function (componentId, parent, childIndex, edits, editsOffset, editsLength, referenceFrames) {
        var currentDepth = 0;
        var childIndexAtCurrentDepth = childIndex;
        var maxEditIndexExcl = editsOffset + editsLength;
        for (var editIndex = editsOffset; editIndex < maxEditIndexExcl; editIndex++) {
            var edit = RenderTreeEdit_1.getRenderTreeEditPtr(edits, editIndex);
            var editType = RenderTreeEdit_1.renderTreeEdit.type(edit);
            switch (editType) {
                case RenderTreeEdit_1.EditType.prependFrame: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    this.insertFrame(componentId, parent, childIndexAtCurrentDepth + siblingIndex, referenceFrames, frame, frameIndex);
                    break;
                }
                case RenderTreeEdit_1.EditType.removeFrame: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    removeNodeFromDOM(parent, childIndexAtCurrentDepth + siblingIndex);
                    break;
                }
                case RenderTreeEdit_1.EditType.setAttribute: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var element = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    this.applyAttribute(componentId, element, frame);
                    break;
                }
                case RenderTreeEdit_1.EditType.removeAttribute: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    removeAttributeFromDOM(parent, childIndexAtCurrentDepth + siblingIndex, RenderTreeEdit_1.renderTreeEdit.removedAttributeName(edit));
                    break;
                }
                case RenderTreeEdit_1.EditType.updateText: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var domTextNode = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    domTextNode.textContent = RenderTreeFrame_1.renderTreeFrame.textContent(frame);
                    break;
                }
                case RenderTreeEdit_1.EditType.stepIn: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    parent = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    currentDepth++;
                    childIndexAtCurrentDepth = 0;
                    break;
                }
                case RenderTreeEdit_1.EditType.stepOut: {
                    parent = parent.parentElement;
                    currentDepth--;
                    childIndexAtCurrentDepth = currentDepth === 0 ? childIndex : 0; // The childIndex is only ever nonzero at zero depth
                    break;
                }
                default: {
                    var unknownType = editType; // Compile-time verification that the switch was exhaustive
                    throw new Error("Unknown edit type: " + unknownType);
                }
            }
        }
    };
    BrowserRenderer.prototype.insertFrame = function (componentId, parent, childIndex, frames, frame, frameIndex) {
        var frameType = RenderTreeFrame_1.renderTreeFrame.frameType(frame);
        switch (frameType) {
            case RenderTreeFrame_1.FrameType.element:
                this.insertElement(componentId, parent, childIndex, frames, frame, frameIndex);
                return 1;
            case RenderTreeFrame_1.FrameType.text:
                this.insertText(parent, childIndex, frame);
                return 1;
            case RenderTreeFrame_1.FrameType.attribute:
                throw new Error('Attribute frames should only be present as leading children of element frames.');
            case RenderTreeFrame_1.FrameType.component:
                this.insertComponent(parent, childIndex, frame);
                return 1;
            case RenderTreeFrame_1.FrameType.region:
                return this.insertFrameRange(componentId, parent, childIndex, frames, frameIndex + 1, frameIndex + RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame));
            default:
                var unknownType = frameType; // Compile-time verification that the switch was exhaustive
                throw new Error("Unknown frame type: " + unknownType);
        }
    };
    BrowserRenderer.prototype.insertElement = function (componentId, parent, childIndex, frames, frame, frameIndex) {
        var tagName = RenderTreeFrame_1.renderTreeFrame.elementName(frame);
        var newDomElement = document.createElement(tagName);
        insertNodeIntoDOM(newDomElement, parent, childIndex);
        // Apply attributes
        var descendantsEndIndexExcl = frameIndex + RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame);
        for (var descendantIndex = frameIndex + 1; descendantIndex < descendantsEndIndexExcl; descendantIndex++) {
            var descendantFrame = RenderTreeFrame_1.getTreeFramePtr(frames, descendantIndex);
            if (RenderTreeFrame_1.renderTreeFrame.frameType(descendantFrame) === RenderTreeFrame_1.FrameType.attribute) {
                this.applyAttribute(componentId, newDomElement, descendantFrame);
            }
            else {
                // As soon as we see a non-attribute child, all the subsequent child frames are
                // not attributes, so bail out and insert the remnants recursively
                this.insertFrameRange(componentId, newDomElement, 0, frames, descendantIndex, descendantsEndIndexExcl);
                break;
            }
        }
    };
    BrowserRenderer.prototype.insertComponent = function (parent, childIndex, frame) {
        // Currently, to support O(1) lookups from render tree frames to DOM nodes, we rely on
        // each child component existing as a single top-level element in the DOM. To guarantee
        // that, we wrap child components in these 'blazor-component' wrappers.
        // To improve on this in the future:
        // - If we can statically detect that a given component always produces a single top-level
        //   element anyway, then don't wrap it in a further nonstandard element
        // - If we really want to support child components producing multiple top-level frames and
        //   not being wrapped in a container at all, then every time a component is refreshed in
        //   the DOM, we could update an array on the parent element that specifies how many DOM
        //   nodes correspond to each of its render tree frames. Then when that parent wants to
        //   locate the first DOM node for a render tree frame, it can sum all the frame counts for
        //   all the preceding render trees frames. It's O(N), but where N is the number of siblings
        //   (counting child components as a single item), so N will rarely if ever be large.
        //   We could even keep track of whether all the child components happen to have exactly 1
        //   top level frames, and in that case, there's no need to sum as we can do direct lookups.
        var containerElement = document.createElement('blazor-component');
        insertNodeIntoDOM(containerElement, parent, childIndex);
        // All we have to do is associate the child component ID with its location. We don't actually
        // do any rendering here, because the diff for the child will appear later in the render batch.
        var childComponentId = RenderTreeFrame_1.renderTreeFrame.componentId(frame);
        this.attachComponentToElement(childComponentId, containerElement);
    };
    BrowserRenderer.prototype.insertText = function (parent, childIndex, textFrame) {
        var textContent = RenderTreeFrame_1.renderTreeFrame.textContent(textFrame);
        var newDomTextNode = document.createTextNode(textContent);
        insertNodeIntoDOM(newDomTextNode, parent, childIndex);
    };
    BrowserRenderer.prototype.applyAttribute = function (componentId, toDomElement, attributeFrame) {
        var attributeName = RenderTreeFrame_1.renderTreeFrame.attributeName(attributeFrame);
        var browserRendererId = this.browserRendererId;
        var eventHandlerId = RenderTreeFrame_1.renderTreeFrame.attributeEventHandlerId(attributeFrame);
        if (attributeName === 'value') {
            if (this.tryApplyValueProperty(toDomElement, RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame))) {
                return; // If this DOM element type has special 'value' handling, don't also write it as an attribute
            }
        }
        // TODO: Instead of applying separate event listeners to each DOM element, use event delegation
        // and remove all the _blazor*Listener hacks
        switch (attributeName) {
            case 'onclick': {
                toDomElement.removeEventListener('click', toDomElement['_blazorClickListener']);
                var listener = function (evt) { return raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'mouse', { Type: 'click' }); };
                toDomElement['_blazorClickListener'] = listener;
                toDomElement.addEventListener('click', listener);
                break;
            }
            case 'onchange': {
                toDomElement.removeEventListener('change', toDomElement['_blazorChangeListener']);
                var targetIsCheckbox_1 = isCheckbox(toDomElement);
                var listener = function (evt) {
                    var newValue = targetIsCheckbox_1 ? evt.target.checked : evt.target.value;
                    raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'change', { Type: 'change', Value: newValue });
                };
                toDomElement['_blazorChangeListener'] = listener;
                toDomElement.addEventListener('change', listener);
                break;
            }
            case 'onkeypress': {
                toDomElement.removeEventListener('keypress', toDomElement['_blazorKeypressListener']);
                var listener = function (evt) {
                    // This does not account for special keys nor cross-browser differences. So far it's
                    // just to establish that we can pass parameters when raising events.
                    // We use C#-style PascalCase on the eventInfo to simplify deserialization, but this could
                    // change if we introduced a richer JSON library on the .NET side.
                    raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'keyboard', { Type: evt.type, Key: evt.key });
                };
                toDomElement['_blazorKeypressListener'] = listener;
                toDomElement.addEventListener('keypress', listener);
                break;
            }
            default:
                // Treat as a regular string-valued attribute
                toDomElement.setAttribute(attributeName, RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame));
                break;
        }
    };
    BrowserRenderer.prototype.tryApplyValueProperty = function (element, value) {
        // Certain elements have built-in behaviour for their 'value' property
        switch (element.tagName) {
            case 'INPUT':
            case 'SELECT':
                if (isCheckbox(element)) {
                    element.checked = value === 'True';
                }
                else {
                    element.value = value;
                    if (element.tagName === 'SELECT') {
                        // <select> is special, in that anything we write to .value will be lost if there
                        // isn't yet a matching <option>. To maintain the expected behavior no matter the
                        // element insertion/update order, preserve the desired value separately so
                        // we can recover it when inserting any matching <option>.
                        element[selectValuePropname] = value;
                    }
                }
                return true;
            case 'OPTION':
                element.setAttribute('value', value);
                // See above for why we have this special handling for <select>/<option>
                var parentElement = element.parentElement;
                if (parentElement && (selectValuePropname in parentElement) && parentElement[selectValuePropname] === value) {
                    this.tryApplyValueProperty(parentElement, value);
                    delete parentElement[selectValuePropname];
                }
                return true;
            default:
                return false;
        }
    };
    BrowserRenderer.prototype.insertFrameRange = function (componentId, parent, childIndex, frames, startIndex, endIndexExcl) {
        var origChildIndex = childIndex;
        for (var index = startIndex; index < endIndexExcl; index++) {
            var frame = RenderTreeFrame_1.getTreeFramePtr(frames, index);
            var numChildrenInserted = this.insertFrame(componentId, parent, childIndex, frames, frame, index);
            childIndex += numChildrenInserted;
            // Skip over any descendants, since they are already dealt with recursively
            var subtreeLength = RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame);
            if (subtreeLength > 1) {
                index += subtreeLength - 1;
            }
        }
        return (childIndex - origChildIndex); // Total number of children inserted
    };
    return BrowserRenderer;
}());
exports.BrowserRenderer = BrowserRenderer;
function isCheckbox(element) {
    return element.tagName === 'INPUT' && element.getAttribute('type') === 'checkbox';
}
function insertNodeIntoDOM(node, parent, childIndex) {
    if (childIndex >= parent.childNodes.length) {
        parent.appendChild(node);
    }
    else {
        parent.insertBefore(node, parent.childNodes[childIndex]);
    }
}
function removeNodeFromDOM(parent, childIndex) {
    parent.removeChild(parent.childNodes[childIndex]);
}
function removeAttributeFromDOM(parent, childIndex, attributeName) {
    var element = parent.childNodes[childIndex];
    element.removeAttribute(attributeName);
}
function raiseEvent(event, browserRendererId, componentId, eventHandlerId, eventInfoType, eventInfo) {
    event.preventDefault();
    if (!raiseEventMethod) {
        raiseEventMethod = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Rendering', 'BrowserRendererEventDispatcher', 'DispatchEvent');
    }
    var eventDescriptor = {
        BrowserRendererId: browserRendererId,
        ComponentId: componentId,
        EventHandlerId: eventHandlerId,
        EventArgsType: eventInfoType
    };
    Environment_1.platform.callMethod(raiseEventMethod, null, [
        Environment_1.platform.toDotNetString(JSON.stringify(eventDescriptor)),
        Environment_1.platform.toDotNetString(JSON.stringify(eventInfo))
    ]);
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var renderTreeEditStructLength = 16;
function getRenderTreeEditPtr(renderTreeEdits, index) {
    return Environment_1.platform.getArrayEntryPtr(renderTreeEdits, index, renderTreeEditStructLength);
}
exports.getRenderTreeEditPtr = getRenderTreeEditPtr;
exports.renderTreeEdit = {
    // The properties and memory layout must be kept in sync with the .NET equivalent in RenderTreeEdit.cs
    type: function (edit) { return Environment_1.platform.readInt32Field(edit, 0); },
    siblingIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 4); },
    newTreeIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 8); },
    removedAttributeName: function (edit) { return Environment_1.platform.readStringField(edit, 12); },
};
var EditType;
(function (EditType) {
    EditType[EditType["prependFrame"] = 1] = "prependFrame";
    EditType[EditType["removeFrame"] = 2] = "removeFrame";
    EditType[EditType["setAttribute"] = 3] = "setAttribute";
    EditType[EditType["removeAttribute"] = 4] = "removeAttribute";
    EditType[EditType["updateText"] = 5] = "updateText";
    EditType[EditType["stepIn"] = 6] = "stepIn";
    EditType[EditType["stepOut"] = 7] = "stepOut";
})(EditType = exports.EditType || (exports.EditType = {}));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var renderTreeFrameStructLength = 28;
// To minimise GC pressure, instead of instantiating a JS object to represent each tree frame,
// we work in terms of pointers to the structs on the .NET heap, and use static functions that
// know how to read property values from those structs.
function getTreeFramePtr(renderTreeEntries, index) {
    return Environment_1.platform.getArrayEntryPtr(renderTreeEntries, index, renderTreeFrameStructLength);
}
exports.getTreeFramePtr = getTreeFramePtr;
exports.renderTreeFrame = {
    // The properties and memory layout must be kept in sync with the .NET equivalent in RenderTreeFrame.cs
    frameType: function (frame) { return Environment_1.platform.readInt32Field(frame, 4); },
    subtreeLength: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
    componentId: function (frame) { return Environment_1.platform.readInt32Field(frame, 12); },
    elementName: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    textContent: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    attributeName: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    attributeValue: function (frame) { return Environment_1.platform.readStringField(frame, 24); },
    attributeEventHandlerId: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
};
var FrameType;
(function (FrameType) {
    // The values must be kept in sync with the .NET equivalent in RenderTreeFrameType.cs
    FrameType[FrameType["element"] = 1] = "element";
    FrameType[FrameType["text"] = 2] = "text";
    FrameType[FrameType["attribute"] = 3] = "attribute";
    FrameType[FrameType["component"] = 4] = "component";
    FrameType[FrameType["region"] = 5] = "region";
})(FrameType = exports.FrameType || (exports.FrameType = {}));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegisteredFunction_1 = __webpack_require__(1);
var Environment_1 = __webpack_require__(0);
var httpClientAssembly = 'Microsoft.AspNetCore.Blazor.Browser';
var httpClientNamespace = httpClientAssembly + ".Http";
var httpClientTypeName = 'BrowserHttpMessageHandler';
var httpClientFullTypeName = httpClientNamespace + "." + httpClientTypeName;
var receiveResponseMethod;
RegisteredFunction_1.registerFunction(httpClientFullTypeName + ".Send", function (id, method, requestUri, body, headersJson) {
    sendAsync(id, method, requestUri, body, headersJson);
});
function sendAsync(id, method, requestUri, body, headersJson) {
    return __awaiter(this, void 0, void 0, function () {
        var response, responseText, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(requestUri, {
                            method: method,
                            body: body || undefined,
                            headers: headersJson ? JSON.parse(headersJson) : undefined
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    responseText = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    dispatchErrorResponse(id, ex_1.toString());
                    return [2 /*return*/];
                case 4:
                    dispatchSuccessResponse(id, response, responseText);
                    return [2 /*return*/];
            }
        });
    });
}
function dispatchSuccessResponse(id, response, responseText) {
    var responseDescriptor = {
        StatusCode: response.status,
        Headers: []
    };
    response.headers.forEach(function (value, name) {
        responseDescriptor.Headers.push([name, value]);
    });
    dispatchResponse(id, Environment_1.platform.toDotNetString(JSON.stringify(responseDescriptor)), Environment_1.platform.toDotNetString(responseText), // TODO: Consider how to handle non-string responses
    /* errorMessage */ null);
}
function dispatchErrorResponse(id, errorMessage) {
    dispatchResponse(id, 
    /* responseDescriptor */ null, 
    /* responseText */ null, Environment_1.platform.toDotNetString(errorMessage));
}
function dispatchResponse(id, responseDescriptor, responseText, errorMessage) {
    if (!receiveResponseMethod) {
        receiveResponseMethod = Environment_1.platform.findMethod(httpClientAssembly, httpClientNamespace, httpClientTypeName, 'ReceiveResponse');
    }
    Environment_1.platform.callMethod(receiveResponseMethod, null, [
        Environment_1.platform.toDotNetString(id.toString()),
        responseDescriptor,
        responseText,
        errorMessage,
    ]);
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
var UriHelper_1 = __webpack_require__(4);
if (typeof window !== 'undefined') {
    // When the library is loaded in a browser via a <script> element, make the
    // following APIs available in global scope for invocation from JS
    window['Blazor'] = {
        platform: Environment_1.platform,
        registerFunction: RegisteredFunction_1.registerFunction,
        navigateTo: UriHelper_1.navigateTo,
    };
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWQyYzNlZDE3NjUzYjhiNDBmZDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Vudmlyb25tZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUGxhdGZvcm0vRG90TmV0LnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NlcnZpY2VzL1VyaUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQm9vdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUGxhdGZvcm0vTW9uby9Nb25vUGxhdGZvcm0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ludGVyb3AvSW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ludGVyb3AvSW52b2tlV2l0aEpzb25NYXJzaGFsbGluZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL1JlbmRlckJhdGNoLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvQnJvd3NlclJlbmRlcmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyVHJlZUVkaXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9SZW5kZXJUcmVlRnJhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NlcnZpY2VzL0h0dHAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dsb2JhbEV4cG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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QztBQUNKLENBQUM7QUFFRCwrQkFBK0IsRUFBVSxFQUFFLFlBQW9CO0lBQzdELGdCQUFnQixDQUNkLEVBQUU7SUFDRix3QkFBd0IsQ0FBQyxJQUFJO0lBQzdCLGtCQUFrQixDQUFDLElBQUksRUFDdkIsc0JBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQ3RDLENBQUM7QUFDSixDQUFDO0FBRUQsMEJBQTBCLEVBQVUsRUFBRSxrQkFBd0MsRUFBRSxZQUFrQyxFQUFFLFlBQWtDO0lBQ3BKLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQzNCLHFCQUFxQixHQUFHLHNCQUFRLENBQUMsVUFBVSxDQUN6QyxrQkFBa0IsRUFDbEIsbUJBQW1CLEVBQ25CLGtCQUFrQixFQUNsQixpQkFBaUIsQ0FDbEIsQ0FBQztJQUNKLENBQUM7SUFFRCxzQkFBUSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUU7UUFDL0Msc0JBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLGtCQUFrQjtRQUNsQixZQUFZO1FBQ1osWUFBWTtLQUNiLENBQUMsQ0FBQztBQUNMLENBQUM7Ozs7Ozs7Ozs7QUN6RUQsMkNBQXdDO0FBQ3hDLGtEQUFnRTtBQUNoRSx5Q0FBa0Q7QUFFbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsQywyRUFBMkU7SUFDM0Usa0VBQWtFO0lBQ2xFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRztRQUNqQixRQUFRO1FBQ1IsZ0JBQWdCO1FBQ2hCLFVBQVU7S0FDWCxDQUFDO0FBQ0osQ0FBQyIsImZpbGUiOiJibGF6b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlZDJjM2VkMTc2NTNiOGI0MGZkMSIsIi8vIEV4cG9zZSBhbiBleHBvcnQgY2FsbGVkICdwbGF0Zm9ybScgb2YgdGhlIGludGVyZmFjZSB0eXBlICdQbGF0Zm9ybScsXHJcbi8vIHNvIHRoYXQgY29uc3VtZXJzIGNhbiBiZSBhZ25vc3RpYyBhYm91dCB3aGljaCBpbXBsZW1lbnRhdGlvbiB0aGV5IHVzZS5cclxuLy8gQmFzaWMgYWx0ZXJuYXRpdmUgdG8gaGF2aW5nIGFuIGFjdHVhbCBESSBjb250YWluZXIuXHJcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IG1vbm9QbGF0Zm9ybSB9IGZyb20gJy4vUGxhdGZvcm0vTW9uby9Nb25vUGxhdGZvcm0nO1xyXG5leHBvcnQgY29uc3QgcGxhdGZvcm06IFBsYXRmb3JtID0gbW9ub1BsYXRmb3JtO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvRW52aXJvbm1lbnQudHMiLCJpbXBvcnQgeyBpbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbnMgfSBmcm9tICcuL0ludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IHJlZ2lzdGVyZWRGdW5jdGlvbnM6IHsgW2lkZW50aWZpZXI6IHN0cmluZ106IEZ1bmN0aW9uIHwgdW5kZWZpbmVkIH0gPSB7fTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckZ1bmN0aW9uKGlkZW50aWZpZXI6IHN0cmluZywgaW1wbGVtZW50YXRpb246IEZ1bmN0aW9uKSB7XHJcbiAgaWYgKGludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9ucy5oYXNPd25Qcm9wZXJ0eShpZGVudGlmaWVyKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZnVuY3Rpb24gaWRlbnRpZmllciAnJHtpZGVudGlmaWVyfScgaXMgcmVzZXJ2ZWQgYW5kIGNhbm5vdCBiZSByZWdpc3RlcmVkLmApO1xyXG4gIH1cclxuXHJcbiAgaWYgKHJlZ2lzdGVyZWRGdW5jdGlvbnMuaGFzT3duUHJvcGVydHkoaWRlbnRpZmllcikpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQSBmdW5jdGlvbiB3aXRoIHRoZSBpZGVudGlmaWVyICcke2lkZW50aWZpZXJ9JyBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQuYCk7XHJcbiAgfVxyXG5cclxuICByZWdpc3RlcmVkRnVuY3Rpb25zW2lkZW50aWZpZXJdID0gaW1wbGVtZW50YXRpb247XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWdpc3RlcmVkRnVuY3Rpb24oaWRlbnRpZmllcjogc3RyaW5nKTogRnVuY3Rpb24ge1xyXG4gIC8vIEJ5IHByaW9yaXRpc2luZyB0aGUgaW50ZXJuYWwgb25lcywgd2UgZW5zdXJlIHlvdSBjYW4ndCBvdmVycmlkZSB0aGVtXHJcbiAgY29uc3QgcmVzdWx0ID0gaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zW2lkZW50aWZpZXJdIHx8IHJlZ2lzdGVyZWRGdW5jdGlvbnNbaWRlbnRpZmllcl07XHJcbiAgaWYgKHJlc3VsdCkge1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCByZWdpc3RlcmVkIGZ1bmN0aW9uIHdpdGggbmFtZSAnJHtpZGVudGlmaWVyfScuYCk7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbi50cyIsImV4cG9ydCBmdW5jdGlvbiBnZXRBc3NlbWJseU5hbWVGcm9tVXJsKHVybDogc3RyaW5nKSB7XHJcbiAgY29uc3QgbGFzdFNlZ21lbnQgPSB1cmwuc3Vic3RyaW5nKHVybC5sYXN0SW5kZXhPZignLycpICsgMSk7XHJcbiAgY29uc3QgcXVlcnlTdHJpbmdTdGFydFBvcyA9IGxhc3RTZWdtZW50LmluZGV4T2YoJz8nKTtcclxuICBjb25zdCBmaWxlbmFtZSA9IHF1ZXJ5U3RyaW5nU3RhcnRQb3MgPCAwID8gbGFzdFNlZ21lbnQgOiBsYXN0U2VnbWVudC5zdWJzdHJpbmcoMCwgcXVlcnlTdHJpbmdTdGFydFBvcyk7XHJcbiAgcmV0dXJuIGZpbGVuYW1lLnJlcGxhY2UoL1xcLmRsbCQvLCAnJyk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1BsYXRmb3JtL0RvdE5ldC50cyIsImltcG9ydCB7IFN5c3RlbV9PYmplY3QsIFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSwgTWV0aG9kSGFuZGxlLCBQb2ludGVyIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgcmVuZGVyQmF0Y2ggYXMgcmVuZGVyQmF0Y2hTdHJ1Y3QsIGFycmF5UmFuZ2UsIGFycmF5U2VnbWVudCwgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGgsIHJlbmRlclRyZWVEaWZmLCBSZW5kZXJCYXRjaFBvaW50ZXIsIFJlbmRlclRyZWVEaWZmUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyQmF0Y2gnO1xyXG5pbXBvcnQgeyBCcm93c2VyUmVuZGVyZXIgfSBmcm9tICcuL0Jyb3dzZXJSZW5kZXJlcic7XHJcblxyXG50eXBlIEJyb3dzZXJSZW5kZXJlclJlZ2lzdHJ5ID0geyBbYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlcl06IEJyb3dzZXJSZW5kZXJlciB9O1xyXG5jb25zdCBicm93c2VyUmVuZGVyZXJzOiBCcm93c2VyUmVuZGVyZXJSZWdpc3RyeSA9IHt9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaENvbXBvbmVudFRvRWxlbWVudChicm93c2VyUmVuZGVyZXJJZDogbnVtYmVyLCBlbGVtZW50U2VsZWN0b3I6IFN5c3RlbV9TdHJpbmcsIGNvbXBvbmVudElkOiBudW1iZXIpIHtcclxuICBjb25zdCBlbGVtZW50U2VsZWN0b3JKcyA9IHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhlbGVtZW50U2VsZWN0b3IpO1xyXG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRTZWxlY3RvckpzKTtcclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYW55IGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3IgJyR7ZWxlbWVudFNlbGVjdG9ySnN9Jy5gKTtcclxuICB9XHJcblxyXG4gIGxldCBicm93c2VyUmVuZGVyZXIgPSBicm93c2VyUmVuZGVyZXJzW2Jyb3dzZXJSZW5kZXJlcklkXTtcclxuICBpZiAoIWJyb3dzZXJSZW5kZXJlcikge1xyXG4gICAgYnJvd3NlclJlbmRlcmVyID0gYnJvd3NlclJlbmRlcmVyc1ticm93c2VyUmVuZGVyZXJJZF0gPSBuZXcgQnJvd3NlclJlbmRlcmVyKGJyb3dzZXJSZW5kZXJlcklkKTtcclxuICB9XHJcbiAgYnJvd3NlclJlbmRlcmVyLmF0dGFjaENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZCwgZWxlbWVudCk7XHJcbiAgY2xlYXJFbGVtZW50KGVsZW1lbnQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQmF0Y2goYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgYmF0Y2g6IFJlbmRlckJhdGNoUG9pbnRlcikge1xyXG4gIGNvbnN0IGJyb3dzZXJSZW5kZXJlciA9IGJyb3dzZXJSZW5kZXJlcnNbYnJvd3NlclJlbmRlcmVySWRdO1xyXG4gIGlmICghYnJvd3NlclJlbmRlcmVyKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIGJyb3dzZXIgcmVuZGVyZXIgd2l0aCBJRCAke2Jyb3dzZXJSZW5kZXJlcklkfS5gKTtcclxuICB9XHJcbiAgXHJcbiAgY29uc3QgdXBkYXRlZENvbXBvbmVudHMgPSByZW5kZXJCYXRjaFN0cnVjdC51cGRhdGVkQ29tcG9uZW50cyhiYXRjaCk7XHJcbiAgY29uc3QgdXBkYXRlZENvbXBvbmVudHNMZW5ndGggPSBhcnJheVJhbmdlLmNvdW50KHVwZGF0ZWRDb21wb25lbnRzKTtcclxuICBjb25zdCB1cGRhdGVkQ29tcG9uZW50c0FycmF5ID0gYXJyYXlSYW5nZS5hcnJheSh1cGRhdGVkQ29tcG9uZW50cyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlRnJhbWVzU3RydWN0ID0gcmVuZGVyQmF0Y2hTdHJ1Y3QucmVmZXJlbmNlRnJhbWVzKGJhdGNoKTtcclxuICBjb25zdCByZWZlcmVuY2VGcmFtZXMgPSBhcnJheVJhbmdlLmFycmF5KHJlZmVyZW5jZUZyYW1lc1N0cnVjdCk7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlZENvbXBvbmVudHNMZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgZGlmZiA9IHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIodXBkYXRlZENvbXBvbmVudHNBcnJheSwgaSwgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGgpO1xyXG4gICAgY29uc3QgY29tcG9uZW50SWQgPSByZW5kZXJUcmVlRGlmZi5jb21wb25lbnRJZChkaWZmKTtcclxuXHJcbiAgICBjb25zdCBlZGl0c0FycmF5U2VnbWVudCA9IHJlbmRlclRyZWVEaWZmLmVkaXRzKGRpZmYpO1xyXG4gICAgY29uc3QgZWRpdHMgPSBhcnJheVNlZ21lbnQuYXJyYXkoZWRpdHNBcnJheVNlZ21lbnQpO1xyXG4gICAgY29uc3QgZWRpdHNPZmZzZXQgPSBhcnJheVNlZ21lbnQub2Zmc2V0KGVkaXRzQXJyYXlTZWdtZW50KTtcclxuICAgIGNvbnN0IGVkaXRzTGVuZ3RoID0gYXJyYXlTZWdtZW50LmNvdW50KGVkaXRzQXJyYXlTZWdtZW50KTtcclxuXHJcbiAgICBicm93c2VyUmVuZGVyZXIudXBkYXRlQ29tcG9uZW50KGNvbXBvbmVudElkLCBlZGl0cywgZWRpdHNPZmZzZXQsIGVkaXRzTGVuZ3RoLCByZWZlcmVuY2VGcmFtZXMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHMgPSByZW5kZXJCYXRjaFN0cnVjdC5kaXNwb3NlZENvbXBvbmVudElkcyhiYXRjaCk7XHJcbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHNMZW5ndGggPSBhcnJheVJhbmdlLmNvdW50KGRpc3Bvc2VkQ29tcG9uZW50SWRzKTtcclxuICBjb25zdCBkaXNwb3NlZENvbXBvbmVudElkc0FycmF5ID0gYXJyYXlSYW5nZS5hcnJheShkaXNwb3NlZENvbXBvbmVudElkcyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwb3NlZENvbXBvbmVudElkc0xlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBjb21wb25lbnRJZFB0ciA9IHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIoZGlzcG9zZWRDb21wb25lbnRJZHNBcnJheSwgaSwgNCk7XHJcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGNvbXBvbmVudElkUHRyKTtcclxuICAgIGJyb3dzZXJSZW5kZXJlci5kaXNwb3NlQ29tcG9uZW50KGNvbXBvbmVudElkKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyRWxlbWVudChlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgbGV0IGNoaWxkTm9kZTogTm9kZSB8IG51bGw7XHJcbiAgd2hpbGUgKGNoaWxkTm9kZSA9IGVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG4gICAgZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL1JlbmRlcmVyLnRzIiwiaW1wb3J0IHsgcmVnaXN0ZXJGdW5jdGlvbiB9IGZyb20gJy4uL0ludGVyb3AvUmVnaXN0ZXJlZEZ1bmN0aW9uJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IE1ldGhvZEhhbmRsZSwgU3lzdGVtX1N0cmluZyB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuY29uc3QgcmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4ID0gJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyLlNlcnZpY2VzLkJyb3dzZXJVcmlIZWxwZXInO1xyXG5sZXQgbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kOiBNZXRob2RIYW5kbGU7XHJcbmxldCBoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMgPSBmYWxzZTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5nZXRMb2NhdGlvbkhyZWZgLFxyXG4gICgpID0+IHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGxvY2F0aW9uLmhyZWYpKTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5nZXRCYXNlVVJJYCxcclxuICAoKSA9PiBkb2N1bWVudC5iYXNlVVJJID8gcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoZG9jdW1lbnQuYmFzZVVSSSkgOiBudWxsKTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5lbmFibGVOYXZpZ2F0aW9uSW50ZWNlcHRpb25gLCAoKSA9PiB7XHJcbiAgaWYgKGhhc1JlZ2lzdGVyZWRFdmVudExpc3RlbmVycykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMgPSB0cnVlO1xyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgIC8vIEludGVyY2VwdCBjbGlja3Mgb24gYWxsIDxhPiBlbGVtZW50cyB3aGVyZSB0aGUgaHJlZiBpcyB3aXRoaW4gdGhlIDxiYXNlIGhyZWY+IFVSSSBzcGFjZVxyXG4gICAgY29uc3QgYW5jaG9yVGFyZ2V0ID0gZmluZENsb3Nlc3RBbmNlc3RvcihldmVudC50YXJnZXQgYXMgRWxlbWVudCB8IG51bGwsICdBJyk7XHJcbiAgICBpZiAoYW5jaG9yVGFyZ2V0KSB7XHJcbiAgICAgIGNvbnN0IGhyZWYgPSBhbmNob3JUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcbiAgICAgIGlmIChpc1dpdGhpbkJhc2VVcmlTcGFjZSh0b0Fic29sdXRlVXJpKGhyZWYpKSkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcGVyZm9ybUludGVybmFsTmF2aWdhdGlvbihocmVmKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBoYW5kbGVJbnRlcm5hbE5hdmlnYXRpb24pO1xyXG59KTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5uYXZpZ2F0ZVRvYCwgKHVyaURvdE5ldFN0cmluZzogU3lzdGVtX1N0cmluZykgPT4ge1xyXG4gIG5hdmlnYXRlVG8ocGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKHVyaURvdE5ldFN0cmluZykpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0ZVRvKHVyaTogc3RyaW5nKSB7XHJcbiAgaWYgKGlzV2l0aGluQmFzZVVyaVNwYWNlKHRvQWJzb2x1dGVVcmkodXJpKSkpIHtcclxuICAgIHBlcmZvcm1JbnRlcm5hbE5hdmlnYXRpb24odXJpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbG9jYXRpb24uaHJlZiA9IHVyaTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBlcmZvcm1JbnRlcm5hbE5hdmlnYXRpb24oaHJlZjogc3RyaW5nKSB7XHJcbiAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgLyogaWdub3JlZCB0aXRsZSAqLyAnJywgaHJlZik7XHJcbiAgaGFuZGxlSW50ZXJuYWxOYXZpZ2F0aW9uKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUludGVybmFsTmF2aWdhdGlvbigpIHtcclxuICBpZiAoIW5vdGlmeUxvY2F0aW9uQ2hhbmdlZE1ldGhvZCkge1xyXG4gICAgbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kID0gcGxhdGZvcm0uZmluZE1ldGhvZChcclxuICAgICAgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJyxcclxuICAgICAgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyLlNlcnZpY2VzJyxcclxuICAgICAgJ0Jyb3dzZXJVcmlIZWxwZXInLFxyXG4gICAgICAnTm90aWZ5TG9jYXRpb25DaGFuZ2VkJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2Qobm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kLCBudWxsLCBbXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhsb2NhdGlvbi5ocmVmKVxyXG4gIF0pO1xyXG59XHJcblxyXG5sZXQgdGVzdEFuY2hvcjogSFRNTEFuY2hvckVsZW1lbnQ7XHJcbmZ1bmN0aW9uIHRvQWJzb2x1dGVVcmkocmVsYXRpdmVVcmk6IHN0cmluZykge1xyXG4gIHRlc3RBbmNob3IgPSB0ZXN0QW5jaG9yIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICB0ZXN0QW5jaG9yLmhyZWYgPSByZWxhdGl2ZVVyaTtcclxuICByZXR1cm4gdGVzdEFuY2hvci5ocmVmO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kQ2xvc2VzdEFuY2VzdG9yKGVsZW1lbnQ6IEVsZW1lbnQgfCBudWxsLCB0YWdOYW1lOiBzdHJpbmcpIHtcclxuICByZXR1cm4gIWVsZW1lbnRcclxuICAgID8gbnVsbFxyXG4gICAgOiBlbGVtZW50LnRhZ05hbWUgPT09IHRhZ05hbWVcclxuICAgICAgPyBlbGVtZW50XHJcbiAgICAgIDogZmluZENsb3Nlc3RBbmNlc3RvcihlbGVtZW50LnBhcmVudEVsZW1lbnQsIHRhZ05hbWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzV2l0aGluQmFzZVVyaVNwYWNlKGhyZWY6IHN0cmluZykge1xyXG4gIGNvbnN0IGJhc2VVcmlQcmVmaXhXaXRoVHJhaWxpbmdTbGFzaCA9IHRvQmFzZVVyaVByZWZpeFdpdGhUcmFpbGluZ1NsYXNoKGRvY3VtZW50LmJhc2VVUkkhKTsgLy8gVE9ETzogTWlnaHQgYmFzZVVSSSByZWFsbHkgYmUgbnVsbD9cclxuICByZXR1cm4gaHJlZi5zdGFydHNXaXRoKGJhc2VVcmlQcmVmaXhXaXRoVHJhaWxpbmdTbGFzaCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvQmFzZVVyaVByZWZpeFdpdGhUcmFpbGluZ1NsYXNoKGJhc2VVcmk6IHN0cmluZykge1xyXG4gIHJldHVybiBiYXNlVXJpLnN1YnN0cigwLCBiYXNlVXJpLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU2VydmljZXMvVXJpSGVscGVyLnRzIiwiaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgZ2V0QXNzZW1ibHlOYW1lRnJvbVVybCB9IGZyb20gJy4vUGxhdGZvcm0vRG90TmV0JztcclxuaW1wb3J0ICcuL1JlbmRlcmluZy9SZW5kZXJlcic7XHJcbmltcG9ydCAnLi9TZXJ2aWNlcy9IdHRwJztcclxuaW1wb3J0ICcuL1NlcnZpY2VzL1VyaUhlbHBlcic7XHJcbmltcG9ydCAnLi9HbG9iYWxFeHBvcnRzJztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGJvb3QoKSB7XHJcbiAgLy8gUmVhZCBzdGFydHVwIGNvbmZpZyBmcm9tIHRoZSA8c2NyaXB0PiBlbGVtZW50IHRoYXQncyBpbXBvcnRpbmcgdGhpcyBmaWxlXHJcbiAgY29uc3QgYWxsU2NyaXB0RWxlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XHJcbiAgY29uc3QgdGhpc1NjcmlwdEVsZW0gPSAoZG9jdW1lbnQuY3VycmVudFNjcmlwdCB8fCBhbGxTY3JpcHRFbGVtc1thbGxTY3JpcHRFbGVtcy5sZW5ndGggLSAxXSkgYXMgSFRNTFNjcmlwdEVsZW1lbnQ7XHJcbiAgY29uc3QgaXNMaW5rZXJFbmFibGVkID0gdGhpc1NjcmlwdEVsZW0uZ2V0QXR0cmlidXRlKCdsaW5rZXItZW5hYmxlZCcpID09PSAndHJ1ZSc7XHJcbiAgY29uc3QgZW50cnlQb2ludERsbCA9IGdldFJlcXVpcmVkQm9vdFNjcmlwdEF0dHJpYnV0ZSh0aGlzU2NyaXB0RWxlbSwgJ21haW4nKTtcclxuICBjb25zdCBlbnRyeVBvaW50TWV0aG9kID0gZ2V0UmVxdWlyZWRCb290U2NyaXB0QXR0cmlidXRlKHRoaXNTY3JpcHRFbGVtLCAnZW50cnlwb2ludCcpO1xyXG4gIGNvbnN0IGVudHJ5UG9pbnRBc3NlbWJseU5hbWUgPSBnZXRBc3NlbWJseU5hbWVGcm9tVXJsKGVudHJ5UG9pbnREbGwpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUFzc2VtYmxpZXNDb21tYVNlcGFyYXRlZCA9IHRoaXNTY3JpcHRFbGVtLmdldEF0dHJpYnV0ZSgncmVmZXJlbmNlcycpIHx8ICcnO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUFzc2VtYmxpZXMgPSByZWZlcmVuY2VBc3NlbWJsaWVzQ29tbWFTZXBhcmF0ZWRcclxuICAgIC5zcGxpdCgnLCcpXHJcbiAgICAubWFwKHMgPT4gcy50cmltKCkpXHJcbiAgICAuZmlsdGVyKHMgPT4gISFzKTtcclxuXHJcbiAgaWYgKCFpc0xpbmtlckVuYWJsZWQpIHtcclxuICAgIGNvbnNvbGUuaW5mbygnQmxhem9yIGlzIHJ1bm5pbmcgaW4gZGV2IG1vZGUgd2l0aG91dCBJTCBzdHJpcHBpbmcuIFRvIG1ha2UgdGhlIGJ1bmRsZSBzaXplIHNpZ25pZmljYW50bHkgc21hbGxlciwgcHVibGlzaCB0aGUgYXBwbGljYXRpb24gb3Igc2VlIGh0dHBzOi8vZ28ubWljcm9zb2Z0LmNvbS9md2xpbmsvP2xpbmtpZD04NzA0MTQnKTtcclxuICB9XHJcblxyXG4gIC8vIERldGVybWluZSB0aGUgVVJMcyBvZiB0aGUgYXNzZW1ibGllcyB3ZSB3YW50IHRvIGxvYWRcclxuICBjb25zdCBsb2FkQXNzZW1ibHlVcmxzID0gW2VudHJ5UG9pbnREbGxdXHJcbiAgICAuY29uY2F0KHJlZmVyZW5jZUFzc2VtYmxpZXMpXHJcbiAgICAubWFwKGZpbGVuYW1lID0+IGBfZnJhbWV3b3JrL19iaW4vJHtmaWxlbmFtZX1gKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IHBsYXRmb3JtLnN0YXJ0KGxvYWRBc3NlbWJseVVybHMpO1xyXG4gIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBzdGFydCBwbGF0Zm9ybS4gUmVhc29uOiAke2V4fWApO1xyXG4gIH1cclxuXHJcbiAgLy8gU3RhcnQgdXAgdGhlIGFwcGxpY2F0aW9uXHJcbiAgcGxhdGZvcm0uY2FsbEVudHJ5UG9pbnQoZW50cnlQb2ludEFzc2VtYmx5TmFtZSwgZW50cnlQb2ludE1ldGhvZCwgW10pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSZXF1aXJlZEJvb3RTY3JpcHRBdHRyaWJ1dGUoZWxlbTogSFRNTFNjcmlwdEVsZW1lbnQsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgcmVzdWx0ID0gZWxlbS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbiAgaWYgKCFyZXN1bHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBcIiR7YXR0cmlidXRlTmFtZX1cIiBhdHRyaWJ1dGUgb24gQmxhem9yIHNjcmlwdCB0YWcuYCk7XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmJvb3QoKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0Jvb3QudHMiLCJpbXBvcnQgeyBNZXRob2RIYW5kbGUsIFN5c3RlbV9PYmplY3QsIFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSwgUG9pbnRlciwgUGxhdGZvcm0gfSBmcm9tICcuLi9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IGdldEFzc2VtYmx5TmFtZUZyb21VcmwgfSBmcm9tICcuLi9Eb3ROZXQnO1xyXG5pbXBvcnQgeyBnZXRSZWdpc3RlcmVkRnVuY3Rpb24gfSBmcm9tICcuLi8uLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcblxyXG5sZXQgYXNzZW1ibHlfbG9hZDogKGFzc2VtYmx5TmFtZTogc3RyaW5nKSA9PiBudW1iZXI7XHJcbmxldCBmaW5kX2NsYXNzOiAoYXNzZW1ibHlIYW5kbGU6IG51bWJlciwgbmFtZXNwYWNlOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nKSA9PiBudW1iZXI7XHJcbmxldCBmaW5kX21ldGhvZDogKHR5cGVIYW5kbGU6IG51bWJlciwgbWV0aG9kTmFtZTogc3RyaW5nLCB1bmtub3duQXJnOiBudW1iZXIpID0+IE1ldGhvZEhhbmRsZTtcclxubGV0IGludm9rZV9tZXRob2Q6IChtZXRob2Q6IE1ldGhvZEhhbmRsZSwgdGFyZ2V0OiBTeXN0ZW1fT2JqZWN0LCBhcmdzQXJyYXlQdHI6IG51bWJlciwgZXhjZXB0aW9uRmxhZ0ludFB0cjogbnVtYmVyKSA9PiBTeXN0ZW1fT2JqZWN0O1xyXG5sZXQgbW9ub19zdHJpbmdfZ2V0X3V0Zjg6IChtYW5hZ2VkU3RyaW5nOiBTeXN0ZW1fU3RyaW5nKSA9PiBNb25vLlV0ZjhQdHI7XHJcbmxldCBtb25vX3N0cmluZzogKGpzU3RyaW5nOiBzdHJpbmcpID0+IFN5c3RlbV9TdHJpbmc7XHJcblxyXG5leHBvcnQgY29uc3QgbW9ub1BsYXRmb3JtOiBQbGF0Zm9ybSA9IHtcclxuICBzdGFydDogZnVuY3Rpb24gc3RhcnQobG9hZEFzc2VtYmx5VXJsczogc3RyaW5nW10pIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIC8vIG1vbm8uanMgYXNzdW1lcyB0aGUgZXhpc3RlbmNlIG9mIHRoaXNcclxuICAgICAgd2luZG93WydCcm93c2VyJ10gPSB7XHJcbiAgICAgICAgaW5pdDogKCkgPT4geyB9LFxyXG4gICAgICAgIGFzeW5jTG9hZDogYXN5bmNMb2FkXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBFbXNjcmlwdGVuIHdvcmtzIGJ5IGV4cGVjdGluZyB0aGUgbW9kdWxlIGNvbmZpZyB0byBiZSBhIGdsb2JhbFxyXG4gICAgICB3aW5kb3dbJ01vZHVsZSddID0gY3JlYXRlRW1zY3JpcHRlbk1vZHVsZUluc3RhbmNlKGxvYWRBc3NlbWJseVVybHMsIHJlc29sdmUsIHJlamVjdCk7XHJcblxyXG4gICAgICBhZGRTY3JpcHRUYWdzVG9Eb2N1bWVudCgpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgZmluZE1ldGhvZDogZnVuY3Rpb24gZmluZE1ldGhvZChhc3NlbWJseU5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nLCBtZXRob2ROYW1lOiBzdHJpbmcpOiBNZXRob2RIYW5kbGUge1xyXG4gICAgLy8gVE9ETzogQ2FjaGUgdGhlIGFzc2VtYmx5X2xvYWQgb3V0cHV0cz9cclxuICAgIGNvbnN0IGFzc2VtYmx5SGFuZGxlID0gYXNzZW1ibHlfbG9hZChhc3NlbWJseU5hbWUpO1xyXG4gICAgaWYgKCFhc3NlbWJseUhhbmRsZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFzc2VtYmx5IFwiJHthc3NlbWJseU5hbWV9XCJgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0eXBlSGFuZGxlID0gZmluZF9jbGFzcyhhc3NlbWJseUhhbmRsZSwgbmFtZXNwYWNlLCBjbGFzc05hbWUpO1xyXG4gICAgaWYgKCF0eXBlSGFuZGxlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdHlwZSBcIiR7Y2xhc3NOYW1lfVwiIGluIG5hbWVzcGFjZSBcIiR7bmFtZXNwYWNlfVwiIGluIGFzc2VtYmx5IFwiJHthc3NlbWJseU5hbWV9XCJgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtZXRob2RIYW5kbGUgPSBmaW5kX21ldGhvZCh0eXBlSGFuZGxlLCBtZXRob2ROYW1lLCAtMSk7XHJcbiAgICBpZiAoIW1ldGhvZEhhbmRsZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIG1ldGhvZCBcIiR7bWV0aG9kTmFtZX1cIiBvbiB0eXBlIFwiJHtuYW1lc3BhY2V9LiR7Y2xhc3NOYW1lfVwiYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1ldGhvZEhhbmRsZTtcclxuICB9LFxyXG5cclxuICBjYWxsRW50cnlQb2ludDogZnVuY3Rpb24gY2FsbEVudHJ5UG9pbnQoYXNzZW1ibHlOYW1lOiBzdHJpbmcsIGVudHJ5cG9pbnRNZXRob2Q6IHN0cmluZywgYXJnczogU3lzdGVtX09iamVjdFtdKTogdm9pZCB7XHJcbiAgICAvLyBQYXJzZSB0aGUgZW50cnlwb2ludE1ldGhvZCwgd2hpY2ggaXMgb2YgdGhlIGZvcm0gTXlBcHAuTXlOYW1lc3BhY2UuTXlUeXBlTmFtZTo6TXlNZXRob2ROYW1lXHJcbiAgICAvLyBOb3RlIHRoYXQgd2UgZG9uJ3Qgc3VwcG9ydCBzcGVjaWZ5aW5nIGEgbWV0aG9kIG92ZXJsb2FkLCBzbyBpdCBoYXMgdG8gYmUgdW5pcXVlXHJcbiAgICBjb25zdCBlbnRyeXBvaW50U2VnbWVudHMgPSBlbnRyeXBvaW50TWV0aG9kLnNwbGl0KCc6OicpO1xyXG4gICAgaWYgKGVudHJ5cG9pbnRTZWdtZW50cy5sZW5ndGggIT0gMikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hbGZvcm1lZCBlbnRyeSBwb2ludCBtZXRob2QgbmFtZTsgY291bGQgbm90IHJlc29sdmUgY2xhc3MgbmFtZSBhbmQgbWV0aG9kIG5hbWUuJyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0eXBlRnVsbE5hbWUgPSBlbnRyeXBvaW50U2VnbWVudHNbMF07XHJcbiAgICBjb25zdCBtZXRob2ROYW1lID0gZW50cnlwb2ludFNlZ21lbnRzWzFdO1xyXG4gICAgY29uc3QgbGFzdERvdCA9IHR5cGVGdWxsTmFtZS5sYXN0SW5kZXhPZignLicpO1xyXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbGFzdERvdCA+IC0xID8gdHlwZUZ1bGxOYW1lLnN1YnN0cmluZygwLCBsYXN0RG90KSA6ICcnO1xyXG4gICAgY29uc3QgdHlwZVNob3J0TmFtZSA9IGxhc3REb3QgPiAtMSA/IHR5cGVGdWxsTmFtZS5zdWJzdHJpbmcobGFzdERvdCArIDEpIDogdHlwZUZ1bGxOYW1lO1xyXG5cclxuICAgIGNvbnN0IGVudHJ5UG9pbnRNZXRob2RIYW5kbGUgPSBtb25vUGxhdGZvcm0uZmluZE1ldGhvZChhc3NlbWJseU5hbWUsIG5hbWVzcGFjZSwgdHlwZVNob3J0TmFtZSwgbWV0aG9kTmFtZSk7XHJcbiAgICBtb25vUGxhdGZvcm0uY2FsbE1ldGhvZChlbnRyeVBvaW50TWV0aG9kSGFuZGxlLCBudWxsLCBhcmdzKTtcclxuICB9LFxyXG5cclxuICBjYWxsTWV0aG9kOiBmdW5jdGlvbiBjYWxsTWV0aG9kKG1ldGhvZDogTWV0aG9kSGFuZGxlLCB0YXJnZXQ6IFN5c3RlbV9PYmplY3QsIGFyZ3M6IFN5c3RlbV9PYmplY3RbXSk6IFN5c3RlbV9PYmplY3Qge1xyXG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gNCkge1xyXG4gICAgICAvLyBIb3BlZnVsbHkgdGhpcyByZXN0cmljdGlvbiBjYW4gYmUgZWFzZWQgc29vbiwgYnV0IGZvciBub3cgbWFrZSBpdCBjbGVhciB3aGF0J3MgZ29pbmcgb25cclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDdXJyZW50bHksIE1vbm9QbGF0Zm9ybSBzdXBwb3J0cyBwYXNzaW5nIGEgbWF4aW11bSBvZiA0IGFyZ3VtZW50cyBmcm9tIEpTIHRvIC5ORVQuIFlvdSB0cmllZCB0byBwYXNzICR7YXJncy5sZW5ndGh9LmApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0YWNrID0gTW9kdWxlLnN0YWNrU2F2ZSgpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGFyZ3NCdWZmZXIgPSBNb2R1bGUuc3RhY2tBbGxvYyhhcmdzLmxlbmd0aCk7XHJcbiAgICAgIGNvbnN0IGV4Y2VwdGlvbkZsYWdNYW5hZ2VkSW50ID0gTW9kdWxlLnN0YWNrQWxsb2MoNCk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIE1vZHVsZS5zZXRWYWx1ZShhcmdzQnVmZmVyICsgaSAqIDQsIGFyZ3NbaV0sICdpMzInKTtcclxuICAgICAgfVxyXG4gICAgICBNb2R1bGUuc2V0VmFsdWUoZXhjZXB0aW9uRmxhZ01hbmFnZWRJbnQsIDAsICdpMzInKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlcyA9IGludm9rZV9tZXRob2QobWV0aG9kLCB0YXJnZXQsIGFyZ3NCdWZmZXIsIGV4Y2VwdGlvbkZsYWdNYW5hZ2VkSW50KTtcclxuXHJcbiAgICAgIGlmIChNb2R1bGUuZ2V0VmFsdWUoZXhjZXB0aW9uRmxhZ01hbmFnZWRJbnQsICdpMzInKSAhPT0gMCkge1xyXG4gICAgICAgIC8vIElmIHRoZSBleGNlcHRpb24gZmxhZyBpcyBzZXQsIHRoZSByZXR1cm5lZCB2YWx1ZSBpcyBleGNlcHRpb24uVG9TdHJpbmcoKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtb25vUGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKDxTeXN0ZW1fU3RyaW5nPnJlcykpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgTW9kdWxlLnN0YWNrUmVzdG9yZShzdGFjayk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgdG9KYXZhU2NyaXB0U3RyaW5nOiBmdW5jdGlvbiB0b0phdmFTY3JpcHRTdHJpbmcobWFuYWdlZFN0cmluZzogU3lzdGVtX1N0cmluZykge1xyXG4gICAgLy8gQ29tbWVudHMgZnJvbSBvcmlnaW5hbCBNb25vIHNhbXBsZTpcclxuICAgIC8vRklYTUUgdGhpcyBpcyB3YXN0ZWZ1bGwsIHdlIGNvdWxkIHJlbW92ZSB0aGUgdGVtcCBtYWxsb2MgYnkgZ29pbmcgdGhlIFVURjE2IHJvdXRlXHJcbiAgICAvL0ZJWE1FIHRoaXMgaXMgdW5zYWZlLCBjdXogcmF3IG9iamVjdHMgY291bGQgYmUgR0MnZC5cclxuXHJcbiAgICBjb25zdCB1dGY4ID0gbW9ub19zdHJpbmdfZ2V0X3V0ZjgobWFuYWdlZFN0cmluZyk7XHJcbiAgICBjb25zdCByZXMgPSBNb2R1bGUuVVRGOFRvU3RyaW5nKHV0ZjgpO1xyXG4gICAgTW9kdWxlLl9mcmVlKHV0ZjggYXMgYW55KTtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfSxcclxuXHJcbiAgdG9Eb3ROZXRTdHJpbmc6IGZ1bmN0aW9uIHRvRG90TmV0U3RyaW5nKGpzU3RyaW5nOiBzdHJpbmcpOiBTeXN0ZW1fU3RyaW5nIHtcclxuICAgIHJldHVybiBtb25vX3N0cmluZyhqc1N0cmluZyk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0QXJyYXlMZW5ndGg6IGZ1bmN0aW9uIGdldEFycmF5TGVuZ3RoKGFycmF5OiBTeXN0ZW1fQXJyYXk8YW55Pik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTW9kdWxlLmdldFZhbHVlKGdldEFycmF5RGF0YVBvaW50ZXIoYXJyYXkpLCAnaTMyJyk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0QXJyYXlFbnRyeVB0cjogZnVuY3Rpb24gZ2V0QXJyYXlFbnRyeVB0cjxUUHRyIGV4dGVuZHMgUG9pbnRlcj4oYXJyYXk6IFN5c3RlbV9BcnJheTxUUHRyPiwgaW5kZXg6IG51bWJlciwgaXRlbVNpemU6IG51bWJlcik6IFRQdHIge1xyXG4gICAgLy8gRmlyc3QgYnl0ZSBpcyBhcnJheSBsZW5ndGgsIGZvbGxvd2VkIGJ5IGVudHJpZXNcclxuICAgIGNvbnN0IGFkZHJlc3MgPSBnZXRBcnJheURhdGFQb2ludGVyKGFycmF5KSArIDQgKyBpbmRleCAqIGl0ZW1TaXplO1xyXG4gICAgcmV0dXJuIGFkZHJlc3MgYXMgYW55IGFzIFRQdHI7XHJcbiAgfSxcclxuXHJcbiAgZ2V0T2JqZWN0RmllbGRzQmFzZUFkZHJlc3M6IGZ1bmN0aW9uIGdldE9iamVjdEZpZWxkc0Jhc2VBZGRyZXNzKHJlZmVyZW5jZVR5cGVkT2JqZWN0OiBTeXN0ZW1fT2JqZWN0KTogUG9pbnRlciB7XHJcbiAgICAvLyBUaGUgZmlyc3QgdHdvIGludDMyIHZhbHVlcyBhcmUgaW50ZXJuYWwgTW9ubyBkYXRhXHJcbiAgICByZXR1cm4gKHJlZmVyZW5jZVR5cGVkT2JqZWN0IGFzIGFueSBhcyBudW1iZXIgKyA4KSBhcyBhbnkgYXMgUG9pbnRlcjtcclxuICB9LFxyXG5cclxuICByZWFkSW50MzJGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBJbnQzMihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKTtcclxuICB9LFxyXG5cclxuICByZWFkT2JqZWN0RmllbGQ6IGZ1bmN0aW9uIHJlYWRIZWFwT2JqZWN0PFQgZXh0ZW5kcyBTeXN0ZW1fT2JqZWN0PihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBUIHtcclxuICAgIHJldHVybiBNb2R1bGUuZ2V0VmFsdWUoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApLCAnaTMyJykgYXMgYW55IGFzIFQ7XHJcbiAgfSxcclxuXHJcbiAgcmVhZFN0cmluZ0ZpZWxkOiBmdW5jdGlvbiByZWFkSGVhcE9iamVjdChiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIGNvbnN0IGZpZWxkVmFsdWUgPSBNb2R1bGUuZ2V0VmFsdWUoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApLCAnaTMyJyk7XHJcbiAgICByZXR1cm4gZmllbGRWYWx1ZSA9PT0gMCA/IG51bGwgOiBtb25vUGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKGZpZWxkVmFsdWUgYXMgYW55IGFzIFN5c3RlbV9TdHJpbmcpO1xyXG4gIH0sXHJcblxyXG4gIHJlYWRTdHJ1Y3RGaWVsZDogZnVuY3Rpb24gcmVhZFN0cnVjdEZpZWxkPFQgZXh0ZW5kcyBQb2ludGVyPihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBUIHtcclxuICAgIHJldHVybiAoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApKSBhcyBhbnkgYXMgVDtcclxuICB9LFxyXG59O1xyXG5cclxuLy8gQnlwYXNzIG5vcm1hbCB0eXBlIGNoZWNraW5nIHRvIGFkZCB0aGlzIGV4dHJhIGZ1bmN0aW9uLiBJdCdzIG9ubHkgaW50ZW5kZWQgdG8gYmUgY2FsbGVkIGZyb21cclxuLy8gdGhlIEpTIGNvZGUgaW4gTW9ubydzIGRyaXZlci5jLiBJdCdzIG5ldmVyIGludGVuZGVkIHRvIGJlIGNhbGxlZCBmcm9tIFR5cGVTY3JpcHQuXHJcbihtb25vUGxhdGZvcm0gYXMgYW55KS5tb25vR2V0UmVnaXN0ZXJlZEZ1bmN0aW9uID0gZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uO1xyXG5cclxuZnVuY3Rpb24gYWRkU2NyaXB0VGFnc1RvRG9jdW1lbnQoKSB7XHJcbiAgLy8gTG9hZCBlaXRoZXIgdGhlIHdhc20gb3IgYXNtLmpzIHZlcnNpb24gb2YgdGhlIE1vbm8gcnVudGltZVxyXG4gIGNvbnN0IGJyb3dzZXJTdXBwb3J0c05hdGl2ZVdlYkFzc2VtYmx5ID0gdHlwZW9mIFdlYkFzc2VtYmx5ICE9PSAndW5kZWZpbmVkJyAmJiBXZWJBc3NlbWJseS52YWxpZGF0ZTtcclxuICBjb25zdCBtb25vUnVudGltZVVybEJhc2UgPSAnX2ZyYW1ld29yay8nICsgKGJyb3dzZXJTdXBwb3J0c05hdGl2ZVdlYkFzc2VtYmx5ID8gJ3dhc20nIDogJ2FzbWpzJyk7XHJcbiAgY29uc3QgbW9ub1J1bnRpbWVTY3JpcHRVcmwgPSBgJHttb25vUnVudGltZVVybEJhc2V9L21vbm8uanNgO1xyXG5cclxuICBpZiAoIWJyb3dzZXJTdXBwb3J0c05hdGl2ZVdlYkFzc2VtYmx5KSB7XHJcbiAgICAvLyBJbiB0aGUgYXNtanMgY2FzZSwgdGhlIGluaXRpYWwgbWVtb3J5IHN0cnVjdHVyZSBpcyBpbiBhIHNlcGFyYXRlIGZpbGUgd2UgbmVlZCB0byBkb3dubG9hZFxyXG4gICAgY29uc3QgbWVtaW5pdFhIUiA9IE1vZHVsZVsnbWVtb3J5SW5pdGlhbGl6ZXJSZXF1ZXN0J10gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIG1lbWluaXRYSFIub3BlbignR0VUJywgYCR7bW9ub1J1bnRpbWVVcmxCYXNlfS9tb25vLmpzLm1lbWApO1xyXG4gICAgbWVtaW5pdFhIUi5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG4gICAgbWVtaW5pdFhIUi5zZW5kKG51bGwpO1xyXG4gIH1cclxuXHJcbiAgZG9jdW1lbnQud3JpdGUoYDxzY3JpcHQgZGVmZXIgc3JjPVwiJHttb25vUnVudGltZVNjcmlwdFVybH1cIj48L3NjcmlwdD5gKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRW1zY3JpcHRlbk1vZHVsZUluc3RhbmNlKGxvYWRBc3NlbWJseVVybHM6IHN0cmluZ1tdLCBvblJlYWR5OiAoKSA9PiB2b2lkLCBvbkVycm9yOiAocmVhc29uPzogYW55KSA9PiB2b2lkKSB7XHJcbiAgY29uc3QgbW9kdWxlID0ge30gYXMgdHlwZW9mIE1vZHVsZTtcclxuICBjb25zdCB3YXNtQmluYXJ5RmlsZSA9ICdfZnJhbWV3b3JrL3dhc20vbW9uby53YXNtJztcclxuICBjb25zdCBhc21qc0NvZGVGaWxlID0gJ19mcmFtZXdvcmsvYXNtanMvbW9uby5hc20uanMnO1xyXG5cclxuICBtb2R1bGUucHJpbnQgPSBsaW5lID0+IGNvbnNvbGUubG9nKGBXQVNNOiAke2xpbmV9YCk7XHJcbiAgbW9kdWxlLnByaW50RXJyID0gbGluZSA9PiBjb25zb2xlLmVycm9yKGBXQVNNOiAke2xpbmV9YCk7XHJcbiAgbW9kdWxlLnByZVJ1biA9IFtdO1xyXG4gIG1vZHVsZS5wb3N0UnVuID0gW107XHJcbiAgbW9kdWxlLnByZWxvYWRQbHVnaW5zID0gW107XHJcblxyXG4gIG1vZHVsZS5sb2NhdGVGaWxlID0gZmlsZU5hbWUgPT4ge1xyXG4gICAgc3dpdGNoIChmaWxlTmFtZSkge1xyXG4gICAgICBjYXNlICdtb25vLndhc20nOiByZXR1cm4gd2FzbUJpbmFyeUZpbGU7XHJcbiAgICAgIGNhc2UgJ21vbm8uYXNtLmpzJzogcmV0dXJuIGFzbWpzQ29kZUZpbGU7XHJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBmaWxlTmFtZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBtb2R1bGUucHJlUnVuLnB1c2goKCkgPT4ge1xyXG4gICAgLy8gQnkgbm93LCBlbXNjcmlwdGVuIHNob3VsZCBiZSBpbml0aWFsaXNlZCBlbm91Z2ggdGhhdCB3ZSBjYW4gY2FwdHVyZSB0aGVzZSBtZXRob2RzIGZvciBsYXRlciB1c2VcclxuICAgIGFzc2VtYmx5X2xvYWQgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9hc3NlbWJseV9sb2FkJywgJ251bWJlcicsIFsnc3RyaW5nJ10pO1xyXG4gICAgZmluZF9jbGFzcyA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2Fzc2VtYmx5X2ZpbmRfY2xhc3MnLCAnbnVtYmVyJywgWydudW1iZXInLCAnc3RyaW5nJywgJ3N0cmluZyddKTtcclxuICAgIGZpbmRfbWV0aG9kID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fYXNzZW1ibHlfZmluZF9tZXRob2QnLCAnbnVtYmVyJywgWydudW1iZXInLCAnc3RyaW5nJywgJ251bWJlciddKTtcclxuICAgIGludm9rZV9tZXRob2QgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9pbnZva2VfbWV0aG9kJywgJ251bWJlcicsIFsnbnVtYmVyJywgJ251bWJlcicsICdudW1iZXInXSk7XHJcbiAgICBtb25vX3N0cmluZ19nZXRfdXRmOCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX3N0cmluZ19nZXRfdXRmOCcsICdudW1iZXInLCBbJ251bWJlciddKTtcclxuICAgIG1vbm9fc3RyaW5nID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fc3RyaW5nX2Zyb21fanMnLCAnbnVtYmVyJywgWydzdHJpbmcnXSk7XHJcblxyXG4gICAgTW9kdWxlLkZTX2NyZWF0ZVBhdGgoJy8nLCAnYXBwQmluRGlyJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBsb2FkQXNzZW1ibHlVcmxzLmZvckVhY2godXJsID0+XHJcbiAgICAgIEZTLmNyZWF0ZVByZWxvYWRlZEZpbGUoJ2FwcEJpbkRpcicsIGAke2dldEFzc2VtYmx5TmFtZUZyb21VcmwodXJsKX0uZGxsYCwgdXJsLCB0cnVlLCBmYWxzZSwgdW5kZWZpbmVkLCBvbkVycm9yKSk7XHJcbiAgfSk7XHJcblxyXG4gIG1vZHVsZS5wb3N0UnVuLnB1c2goKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZF9ydW50aW1lID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fbG9hZF9ydW50aW1lJywgbnVsbCwgWydzdHJpbmcnXSk7XHJcbiAgICBsb2FkX3J1bnRpbWUoJ2FwcEJpbkRpcicpO1xyXG4gICAgb25SZWFkeSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gbW9kdWxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhc3luY0xvYWQodXJsLCBvbmxvYWQsIG9uZXJyb3IpIHtcclxuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xyXG4gIHhoci5vcGVuKCdHRVQnLCB1cmwsIC8qIGFzeW5jOiAqLyB0cnVlKTtcclxuICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICB4aHIub25sb2FkID0gZnVuY3Rpb24geGhyX29ubG9hZCgpIHtcclxuICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCB8fCB4aHIuc3RhdHVzID09IDAgJiYgeGhyLnJlc3BvbnNlKSB7XHJcbiAgICAgIHZhciBhc20gPSBuZXcgVWludDhBcnJheSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICBvbmxvYWQoYXNtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9uZXJyb3IoeGhyKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHhoci5vbmVycm9yID0gb25lcnJvcjtcclxuICB4aHIuc2VuZChudWxsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXJyYXlEYXRhUG9pbnRlcjxUPihhcnJheTogU3lzdGVtX0FycmF5PFQ+KTogbnVtYmVyIHtcclxuICByZXR1cm4gPG51bWJlcj48YW55PmFycmF5ICsgMTI7IC8vIEZpcnN0IGJ5dGUgZnJvbSBoZXJlIGlzIGxlbmd0aCwgdGhlbiBmb2xsb3dpbmcgYnl0ZXMgYXJlIGVudHJpZXNcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGxhdGZvcm0vTW9uby9Nb25vUGxhdGZvcm0udHMiLCJpbXBvcnQgeyBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nIH0gZnJvbSAnLi9JbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nJztcclxuaW1wb3J0IHsgYXR0YWNoQ29tcG9uZW50VG9FbGVtZW50LCByZW5kZXJCYXRjaCB9IGZyb20gJy4uL1JlbmRlcmluZy9SZW5kZXJlcic7XHJcblxyXG4vKipcclxuICogVGhlIGRlZmluaXRpdmUgbGlzdCBvZiBpbnRlcm5hbCBmdW5jdGlvbnMgaW52b2thYmxlIGZyb20gLk5FVCBjb2RlLlxyXG4gKiBUaGVzZSBmdW5jdGlvbiBuYW1lcyBhcmUgdHJlYXRlZCBhcyAncmVzZXJ2ZWQnIGFuZCBjYW5ub3QgYmUgcGFzc2VkIHRvIHJlZ2lzdGVyRnVuY3Rpb24uXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zID0ge1xyXG4gIGF0dGFjaENvbXBvbmVudFRvRWxlbWVudCxcclxuICBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nLFxyXG4gIHJlbmRlckJhdGNoLFxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9JbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbi50cyIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBTeXN0ZW1fU3RyaW5nIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBnZXRSZWdpc3RlcmVkRnVuY3Rpb24gfSBmcm9tICcuL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlV2l0aEpzb25NYXJzaGFsbGluZyhpZGVudGlmaWVyOiBTeXN0ZW1fU3RyaW5nLCAuLi5hcmdzSnNvbjogU3lzdGVtX1N0cmluZ1tdKSB7XHJcbiAgY29uc3QgaWRlbnRpZmllckpzU3RyaW5nID0gcGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKGlkZW50aWZpZXIpO1xyXG4gIGNvbnN0IGZ1bmNJbnN0YW5jZSA9IGdldFJlZ2lzdGVyZWRGdW5jdGlvbihpZGVudGlmaWVySnNTdHJpbmcpO1xyXG4gIGNvbnN0IGFyZ3MgPSBhcmdzSnNvbi5tYXAoanNvbiA9PiBKU09OLnBhcnNlKHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhqc29uKSkpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGZ1bmNJbnN0YW5jZS5hcHBseShudWxsLCBhcmdzKTtcclxuICBpZiAocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb25zdCByZXN1bHRKc29uID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcclxuICAgIHJldHVybiBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhyZXN1bHRKc29uKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9JbnRlcm9wL0ludm9rZVdpdGhKc29uTWFyc2hhbGxpbmcudHMiLCJpbXBvcnQgeyBQb2ludGVyLCBTeXN0ZW1fQXJyYXkgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBSZW5kZXJUcmVlRnJhbWVQb2ludGVyIH0gZnJvbSAnLi9SZW5kZXJUcmVlRnJhbWUnO1xyXG5pbXBvcnQgeyBSZW5kZXJUcmVlRWRpdFBvaW50ZXIgfSBmcm9tICcuL1JlbmRlclRyZWVFZGl0JztcclxuXHJcbi8vIEtlZXAgaW4gc3luYyB3aXRoIHRoZSBzdHJ1Y3RzIGluIC5ORVQgY29kZVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlckJhdGNoID0ge1xyXG4gIHVwZGF0ZWRDb21wb25lbnRzOiAob2JqOiBSZW5kZXJCYXRjaFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJ1Y3RGaWVsZDxBcnJheVJhbmdlUG9pbnRlcjxSZW5kZXJUcmVlRGlmZlBvaW50ZXI+PihvYmosIDApLFxyXG4gIHJlZmVyZW5jZUZyYW1lczogKG9iajogUmVuZGVyQmF0Y2hQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlSYW5nZVBvaW50ZXI8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4+KG9iaiwgYXJyYXlSYW5nZVN0cnVjdExlbmd0aCksXHJcbiAgZGlzcG9zZWRDb21wb25lbnRJZHM6IChvYmo6IFJlbmRlckJhdGNoUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cnVjdEZpZWxkPEFycmF5UmFuZ2VQb2ludGVyPG51bWJlcj4+KG9iaiwgYXJyYXlSYW5nZVN0cnVjdExlbmd0aCArIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGgpLFxyXG59O1xyXG5cclxuY29uc3QgYXJyYXlSYW5nZVN0cnVjdExlbmd0aCA9IDg7XHJcbmV4cG9ydCBjb25zdCBhcnJheVJhbmdlID0ge1xyXG4gIGFycmF5OiA8VD4ob2JqOiBBcnJheVJhbmdlUG9pbnRlcjxUPikgPT4gcGxhdGZvcm0ucmVhZE9iamVjdEZpZWxkPFN5c3RlbV9BcnJheTxUPj4ob2JqLCAwKSxcclxuICBjb3VudDogPFQ+KG9iajogQXJyYXlSYW5nZVBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgNCksXHJcbn07XHJcblxyXG5jb25zdCBhcnJheVNlZ21lbnRTdHJ1Y3RMZW5ndGggPSAxMjtcclxuZXhwb3J0IGNvbnN0IGFycmF5U2VnbWVudCA9IHtcclxuICBhcnJheTogPFQ+KG9iajogQXJyYXlTZWdtZW50UG9pbnRlcjxUPikgPT4gcGxhdGZvcm0ucmVhZE9iamVjdEZpZWxkPFN5c3RlbV9BcnJheTxUPj4ob2JqLCAwKSxcclxuICBvZmZzZXQ6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgNCksXHJcbiAgY291bnQ6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgOCksXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGggPSA0ICsgYXJyYXlTZWdtZW50U3RydWN0TGVuZ3RoO1xyXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZURpZmYgPSB7XHJcbiAgY29tcG9uZW50SWQ6IChvYmo6IFJlbmRlclRyZWVEaWZmUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQob2JqLCAwKSxcclxuICBlZGl0czogKG9iajogUmVuZGVyVHJlZURpZmZQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlTZWdtZW50UG9pbnRlcjxSZW5kZXJUcmVlRWRpdFBvaW50ZXI+PihvYmosIDQpLCAgXHJcbn07XHJcblxyXG4vLyBOb21pbmFsIHR5cGVzIHRvIGVuc3VyZSBvbmx5IHZhbGlkIHBvaW50ZXJzIGFyZSBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9ucyBhYm92ZS5cclxuLy8gQXQgcnVudGltZSB0aGUgdmFsdWVzIGFyZSBqdXN0IG51bWJlcnMuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyQmF0Y2hQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlckJhdGNoUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuZXhwb3J0IGludGVyZmFjZSBBcnJheVJhbmdlUG9pbnRlcjxUPiBleHRlbmRzIFBvaW50ZXIgeyBBcnJheVJhbmdlUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuZXhwb3J0IGludGVyZmFjZSBBcnJheVNlZ21lbnRQb2ludGVyPFQ+IGV4dGVuZHMgUG9pbnRlciB7IEFycmF5U2VnbWVudFBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyVHJlZURpZmZQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlclRyZWVEaWZmUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9SZW5kZXJCYXRjaC50cyIsImltcG9ydCB7IFN5c3RlbV9BcnJheSwgTWV0aG9kSGFuZGxlIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBnZXRSZW5kZXJUcmVlRWRpdFB0ciwgcmVuZGVyVHJlZUVkaXQsIFJlbmRlclRyZWVFZGl0UG9pbnRlciwgRWRpdFR5cGUgfSBmcm9tICcuL1JlbmRlclRyZWVFZGl0JztcclxuaW1wb3J0IHsgZ2V0VHJlZUZyYW1lUHRyLCByZW5kZXJUcmVlRnJhbWUsIEZyYW1lVHlwZSwgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyVHJlZUZyYW1lJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmNvbnN0IHNlbGVjdFZhbHVlUHJvcG5hbWUgPSAnX2JsYXpvclNlbGVjdFZhbHVlJztcclxubGV0IHJhaXNlRXZlbnRNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxubGV0IHJlbmRlckNvbXBvbmVudE1ldGhvZDogTWV0aG9kSGFuZGxlO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJyb3dzZXJSZW5kZXJlciB7XHJcbiAgcHJpdmF0ZSBjaGlsZENvbXBvbmVudExvY2F0aW9uczogeyBbY29tcG9uZW50SWQ6IG51bWJlcl06IEVsZW1lbnQgfSA9IHt9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJyb3dzZXJSZW5kZXJlcklkOiBudW1iZXIpIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhdHRhY2hDb21wb25lbnRUb0VsZW1lbnQoY29tcG9uZW50SWQ6IG51bWJlciwgZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgdGhpcy5jaGlsZENvbXBvbmVudExvY2F0aW9uc1tjb21wb25lbnRJZF0gPSBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZUNvbXBvbmVudChjb21wb25lbnRJZDogbnVtYmVyLCBlZGl0czogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVFZGl0UG9pbnRlcj4sIGVkaXRzT2Zmc2V0OiBudW1iZXIsIGVkaXRzTGVuZ3RoOiBudW1iZXIsIHJlZmVyZW5jZUZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+KSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jaGlsZENvbXBvbmVudExvY2F0aW9uc1tjb21wb25lbnRJZF07XHJcbiAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGlzIGN1cnJlbnRseSBhc3NvY2lhdGVkIHdpdGggY29tcG9uZW50ICR7Y29tcG9uZW50SWR9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcHBseUVkaXRzKGNvbXBvbmVudElkLCBlbGVtZW50LCAwLCBlZGl0cywgZWRpdHNPZmZzZXQsIGVkaXRzTGVuZ3RoLCByZWZlcmVuY2VGcmFtZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc3Bvc2VDb21wb25lbnQoY29tcG9uZW50SWQ6IG51bWJlcikge1xyXG4gICAgZGVsZXRlIHRoaXMuY2hpbGRDb21wb25lbnRMb2NhdGlvbnNbY29tcG9uZW50SWRdO1xyXG4gIH1cclxuXHJcbiAgYXBwbHlFZGl0cyhjb21wb25lbnRJZDogbnVtYmVyLCBwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgZWRpdHM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRWRpdFBvaW50ZXI+LCBlZGl0c09mZnNldDogbnVtYmVyLCBlZGl0c0xlbmd0aDogbnVtYmVyLCByZWZlcmVuY2VGcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPikge1xyXG4gICAgbGV0IGN1cnJlbnREZXB0aCA9IDA7XHJcbiAgICBsZXQgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoID0gY2hpbGRJbmRleDtcclxuICAgIGNvbnN0IG1heEVkaXRJbmRleEV4Y2wgPSBlZGl0c09mZnNldCArIGVkaXRzTGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgZWRpdEluZGV4ID0gZWRpdHNPZmZzZXQ7IGVkaXRJbmRleCA8IG1heEVkaXRJbmRleEV4Y2w7IGVkaXRJbmRleCsrKSB7XHJcbiAgICAgIGNvbnN0IGVkaXQgPSBnZXRSZW5kZXJUcmVlRWRpdFB0cihlZGl0cywgZWRpdEluZGV4KTtcclxuICAgICAgY29uc3QgZWRpdFR5cGUgPSByZW5kZXJUcmVlRWRpdC50eXBlKGVkaXQpO1xyXG4gICAgICBzd2l0Y2ggKGVkaXRUeXBlKSB7XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5wcmVwZW5kRnJhbWU6IHtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSByZW5kZXJUcmVlRWRpdC5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihyZWZlcmVuY2VGcmFtZXMsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgdGhpcy5pbnNlcnRGcmFtZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgsIHJlZmVyZW5jZUZyYW1lcywgZnJhbWUsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUucmVtb3ZlRnJhbWU6IHtcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIHJlbW92ZU5vZGVGcm9tRE9NKHBhcmVudCwgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnNldEF0dHJpYnV0ZToge1xyXG4gICAgICAgICAgY29uc3QgZnJhbWVJbmRleCA9IHJlbmRlclRyZWVFZGl0Lm5ld1RyZWVJbmRleChlZGl0KTtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lID0gZ2V0VHJlZUZyYW1lUHRyKHJlZmVyZW5jZUZyYW1lcywgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSByZW5kZXJUcmVlRWRpdC5zaWJsaW5nSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBlbGVtZW50ID0gcGFyZW50LmNoaWxkTm9kZXNbY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4XSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgIHRoaXMuYXBwbHlBdHRyaWJ1dGUoY29tcG9uZW50SWQsIGVsZW1lbnQsIGZyYW1lKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnJlbW92ZUF0dHJpYnV0ZToge1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgcmVtb3ZlQXR0cmlidXRlRnJvbURPTShwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCwgcmVuZGVyVHJlZUVkaXQucmVtb3ZlZEF0dHJpYnV0ZU5hbWUoZWRpdCkhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnVwZGF0ZVRleHQ6IHtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSByZW5kZXJUcmVlRWRpdC5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihyZWZlcmVuY2VGcmFtZXMsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgY29uc3QgZG9tVGV4dE5vZGUgPSBwYXJlbnQuY2hpbGROb2Rlc1tjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXhdIGFzIFRleHQ7XHJcbiAgICAgICAgICBkb21UZXh0Tm9kZS50ZXh0Q29udGVudCA9IHJlbmRlclRyZWVGcmFtZS50ZXh0Q29udGVudChmcmFtZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5zdGVwSW46IHtcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleF0gYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICBjdXJyZW50RGVwdGgrKztcclxuICAgICAgICAgIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCA9IDA7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5zdGVwT3V0OiB7XHJcbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudCE7XHJcbiAgICAgICAgICBjdXJyZW50RGVwdGgtLTtcclxuICAgICAgICAgIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCA9IGN1cnJlbnREZXB0aCA9PT0gMCA/IGNoaWxkSW5kZXggOiAwOyAvLyBUaGUgY2hpbGRJbmRleCBpcyBvbmx5IGV2ZXIgbm9uemVybyBhdCB6ZXJvIGRlcHRoXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgY29uc3QgdW5rbm93blR5cGU6IG5ldmVyID0gZWRpdFR5cGU7IC8vIENvbXBpbGUtdGltZSB2ZXJpZmljYXRpb24gdGhhdCB0aGUgc3dpdGNoIHdhcyBleGhhdXN0aXZlXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZWRpdCB0eXBlOiAke3Vua25vd25UeXBlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5zZXJ0RnJhbWUoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+LCBmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlciwgZnJhbWVJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGZyYW1lVHlwZSA9IHJlbmRlclRyZWVGcmFtZS5mcmFtZVR5cGUoZnJhbWUpO1xyXG4gICAgc3dpdGNoIChmcmFtZVR5cGUpIHtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuZWxlbWVudDpcclxuICAgICAgICB0aGlzLmluc2VydEVsZW1lbnQoY29tcG9uZW50SWQsIHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWVzLCBmcmFtZSwgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIGNhc2UgRnJhbWVUeXBlLnRleHQ6XHJcbiAgICAgICAgdGhpcy5pbnNlcnRUZXh0KHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlIEZyYW1lVHlwZS5hdHRyaWJ1dGU6XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgZnJhbWVzIHNob3VsZCBvbmx5IGJlIHByZXNlbnQgYXMgbGVhZGluZyBjaGlsZHJlbiBvZiBlbGVtZW50IGZyYW1lcy4nKTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuY29tcG9uZW50OlxyXG4gICAgICAgIHRoaXMuaW5zZXJ0Q29tcG9uZW50KHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlIEZyYW1lVHlwZS5yZWdpb246XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0RnJhbWVSYW5nZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4LCBmcmFtZXMsIGZyYW1lSW5kZXggKyAxLCBmcmFtZUluZGV4ICsgcmVuZGVyVHJlZUZyYW1lLnN1YnRyZWVMZW5ndGgoZnJhbWUpKTtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zdCB1bmtub3duVHlwZTogbmV2ZXIgPSBmcmFtZVR5cGU7IC8vIENvbXBpbGUtdGltZSB2ZXJpZmljYXRpb24gdGhhdCB0aGUgc3dpdGNoIHdhcyBleGhhdXN0aXZlXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGZyYW1lIHR5cGU6ICR7dW5rbm93blR5cGV9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbnNlcnRFbGVtZW50KGNvbXBvbmVudElkOiBudW1iZXIsIHBhcmVudDogRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPiwgZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIsIGZyYW1lSW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgdGFnTmFtZSA9IHJlbmRlclRyZWVGcmFtZS5lbGVtZW50TmFtZShmcmFtZSkhO1xyXG4gICAgY29uc3QgbmV3RG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XHJcbiAgICBpbnNlcnROb2RlSW50b0RPTShuZXdEb21FbGVtZW50LCBwYXJlbnQsIGNoaWxkSW5kZXgpO1xyXG5cclxuICAgIC8vIEFwcGx5IGF0dHJpYnV0ZXNcclxuICAgIGNvbnN0IGRlc2NlbmRhbnRzRW5kSW5kZXhFeGNsID0gZnJhbWVJbmRleCArIHJlbmRlclRyZWVGcmFtZS5zdWJ0cmVlTGVuZ3RoKGZyYW1lKTtcclxuICAgIGZvciAobGV0IGRlc2NlbmRhbnRJbmRleCA9IGZyYW1lSW5kZXggKyAxOyBkZXNjZW5kYW50SW5kZXggPCBkZXNjZW5kYW50c0VuZEluZGV4RXhjbDsgZGVzY2VuZGFudEluZGV4KyspIHtcclxuICAgICAgY29uc3QgZGVzY2VuZGFudEZyYW1lID0gZ2V0VHJlZUZyYW1lUHRyKGZyYW1lcywgZGVzY2VuZGFudEluZGV4KTtcclxuICAgICAgaWYgKHJlbmRlclRyZWVGcmFtZS5mcmFtZVR5cGUoZGVzY2VuZGFudEZyYW1lKSA9PT0gRnJhbWVUeXBlLmF0dHJpYnV0ZSkge1xyXG4gICAgICAgIHRoaXMuYXBwbHlBdHRyaWJ1dGUoY29tcG9uZW50SWQsIG5ld0RvbUVsZW1lbnQsIGRlc2NlbmRhbnRGcmFtZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gQXMgc29vbiBhcyB3ZSBzZWUgYSBub24tYXR0cmlidXRlIGNoaWxkLCBhbGwgdGhlIHN1YnNlcXVlbnQgY2hpbGQgZnJhbWVzIGFyZVxyXG4gICAgICAgIC8vIG5vdCBhdHRyaWJ1dGVzLCBzbyBiYWlsIG91dCBhbmQgaW5zZXJ0IHRoZSByZW1uYW50cyByZWN1cnNpdmVseVxyXG4gICAgICAgIHRoaXMuaW5zZXJ0RnJhbWVSYW5nZShjb21wb25lbnRJZCwgbmV3RG9tRWxlbWVudCwgMCwgZnJhbWVzLCBkZXNjZW5kYW50SW5kZXgsIGRlc2NlbmRhbnRzRW5kSW5kZXhFeGNsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5zZXJ0Q29tcG9uZW50KHBhcmVudDogRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikge1xyXG4gICAgLy8gQ3VycmVudGx5LCB0byBzdXBwb3J0IE8oMSkgbG9va3VwcyBmcm9tIHJlbmRlciB0cmVlIGZyYW1lcyB0byBET00gbm9kZXMsIHdlIHJlbHkgb25cclxuICAgIC8vIGVhY2ggY2hpbGQgY29tcG9uZW50IGV4aXN0aW5nIGFzIGEgc2luZ2xlIHRvcC1sZXZlbCBlbGVtZW50IGluIHRoZSBET00uIFRvIGd1YXJhbnRlZVxyXG4gICAgLy8gdGhhdCwgd2Ugd3JhcCBjaGlsZCBjb21wb25lbnRzIGluIHRoZXNlICdibGF6b3ItY29tcG9uZW50JyB3cmFwcGVycy5cclxuICAgIC8vIFRvIGltcHJvdmUgb24gdGhpcyBpbiB0aGUgZnV0dXJlOlxyXG4gICAgLy8gLSBJZiB3ZSBjYW4gc3RhdGljYWxseSBkZXRlY3QgdGhhdCBhIGdpdmVuIGNvbXBvbmVudCBhbHdheXMgcHJvZHVjZXMgYSBzaW5nbGUgdG9wLWxldmVsXHJcbiAgICAvLyAgIGVsZW1lbnQgYW55d2F5LCB0aGVuIGRvbid0IHdyYXAgaXQgaW4gYSBmdXJ0aGVyIG5vbnN0YW5kYXJkIGVsZW1lbnRcclxuICAgIC8vIC0gSWYgd2UgcmVhbGx5IHdhbnQgdG8gc3VwcG9ydCBjaGlsZCBjb21wb25lbnRzIHByb2R1Y2luZyBtdWx0aXBsZSB0b3AtbGV2ZWwgZnJhbWVzIGFuZFxyXG4gICAgLy8gICBub3QgYmVpbmcgd3JhcHBlZCBpbiBhIGNvbnRhaW5lciBhdCBhbGwsIHRoZW4gZXZlcnkgdGltZSBhIGNvbXBvbmVudCBpcyByZWZyZXNoZWQgaW5cclxuICAgIC8vICAgdGhlIERPTSwgd2UgY291bGQgdXBkYXRlIGFuIGFycmF5IG9uIHRoZSBwYXJlbnQgZWxlbWVudCB0aGF0IHNwZWNpZmllcyBob3cgbWFueSBET01cclxuICAgIC8vICAgbm9kZXMgY29ycmVzcG9uZCB0byBlYWNoIG9mIGl0cyByZW5kZXIgdHJlZSBmcmFtZXMuIFRoZW4gd2hlbiB0aGF0IHBhcmVudCB3YW50cyB0b1xyXG4gICAgLy8gICBsb2NhdGUgdGhlIGZpcnN0IERPTSBub2RlIGZvciBhIHJlbmRlciB0cmVlIGZyYW1lLCBpdCBjYW4gc3VtIGFsbCB0aGUgZnJhbWUgY291bnRzIGZvclxyXG4gICAgLy8gICBhbGwgdGhlIHByZWNlZGluZyByZW5kZXIgdHJlZXMgZnJhbWVzLiBJdCdzIE8oTiksIGJ1dCB3aGVyZSBOIGlzIHRoZSBudW1iZXIgb2Ygc2libGluZ3NcclxuICAgIC8vICAgKGNvdW50aW5nIGNoaWxkIGNvbXBvbmVudHMgYXMgYSBzaW5nbGUgaXRlbSksIHNvIE4gd2lsbCByYXJlbHkgaWYgZXZlciBiZSBsYXJnZS5cclxuICAgIC8vICAgV2UgY291bGQgZXZlbiBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgYWxsIHRoZSBjaGlsZCBjb21wb25lbnRzIGhhcHBlbiB0byBoYXZlIGV4YWN0bHkgMVxyXG4gICAgLy8gICB0b3AgbGV2ZWwgZnJhbWVzLCBhbmQgaW4gdGhhdCBjYXNlLCB0aGVyZSdzIG5vIG5lZWQgdG8gc3VtIGFzIHdlIGNhbiBkbyBkaXJlY3QgbG9va3Vwcy5cclxuICAgIGNvbnN0IGNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdibGF6b3ItY29tcG9uZW50Jyk7XHJcbiAgICBpbnNlcnROb2RlSW50b0RPTShjb250YWluZXJFbGVtZW50LCBwYXJlbnQsIGNoaWxkSW5kZXgpO1xyXG5cclxuICAgIC8vIEFsbCB3ZSBoYXZlIHRvIGRvIGlzIGFzc29jaWF0ZSB0aGUgY2hpbGQgY29tcG9uZW50IElEIHdpdGggaXRzIGxvY2F0aW9uLiBXZSBkb24ndCBhY3R1YWxseVxyXG4gICAgLy8gZG8gYW55IHJlbmRlcmluZyBoZXJlLCBiZWNhdXNlIHRoZSBkaWZmIGZvciB0aGUgY2hpbGQgd2lsbCBhcHBlYXIgbGF0ZXIgaW4gdGhlIHJlbmRlciBiYXRjaC5cclxuICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50SWQgPSByZW5kZXJUcmVlRnJhbWUuY29tcG9uZW50SWQoZnJhbWUpO1xyXG4gICAgdGhpcy5hdHRhY2hDb21wb25lbnRUb0VsZW1lbnQoY2hpbGRDb21wb25lbnRJZCwgY29udGFpbmVyRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBpbnNlcnRUZXh0KHBhcmVudDogRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCB0ZXh0RnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpIHtcclxuICAgIGNvbnN0IHRleHRDb250ZW50ID0gcmVuZGVyVHJlZUZyYW1lLnRleHRDb250ZW50KHRleHRGcmFtZSkhO1xyXG4gICAgY29uc3QgbmV3RG9tVGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0Q29udGVudCk7XHJcbiAgICBpbnNlcnROb2RlSW50b0RPTShuZXdEb21UZXh0Tm9kZSwgcGFyZW50LCBjaGlsZEluZGV4KTtcclxuICB9XHJcblxyXG4gIGFwcGx5QXR0cmlidXRlKGNvbXBvbmVudElkOiBudW1iZXIsIHRvRG9tRWxlbWVudDogRWxlbWVudCwgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpIHtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlTmFtZShhdHRyaWJ1dGVGcmFtZSkhO1xyXG4gICAgY29uc3QgYnJvd3NlclJlbmRlcmVySWQgPSB0aGlzLmJyb3dzZXJSZW5kZXJlcklkO1xyXG4gICAgY29uc3QgZXZlbnRIYW5kbGVySWQgPSByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlRXZlbnRIYW5kbGVySWQoYXR0cmlidXRlRnJhbWUpO1xyXG5cclxuICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAndmFsdWUnKSB7XHJcbiAgICAgIGlmICh0aGlzLnRyeUFwcGx5VmFsdWVQcm9wZXJ0eSh0b0RvbUVsZW1lbnQsIHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVGcmFtZSkpKSB7XHJcbiAgICAgICAgcmV0dXJuOyAvLyBJZiB0aGlzIERPTSBlbGVtZW50IHR5cGUgaGFzIHNwZWNpYWwgJ3ZhbHVlJyBoYW5kbGluZywgZG9uJ3QgYWxzbyB3cml0ZSBpdCBhcyBhbiBhdHRyaWJ1dGVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE86IEluc3RlYWQgb2YgYXBwbHlpbmcgc2VwYXJhdGUgZXZlbnQgbGlzdGVuZXJzIHRvIGVhY2ggRE9NIGVsZW1lbnQsIHVzZSBldmVudCBkZWxlZ2F0aW9uXHJcbiAgICAvLyBhbmQgcmVtb3ZlIGFsbCB0aGUgX2JsYXpvcipMaXN0ZW5lciBoYWNrc1xyXG4gICAgc3dpdGNoIChhdHRyaWJ1dGVOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ29uY2xpY2snOiB7XHJcbiAgICAgICAgdG9Eb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9Eb21FbGVtZW50WydfYmxhem9yQ2xpY2tMaXN0ZW5lciddKTtcclxuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGV2dCA9PiByYWlzZUV2ZW50KGV2dCwgYnJvd3NlclJlbmRlcmVySWQsIGNvbXBvbmVudElkLCBldmVudEhhbmRsZXJJZCwgJ21vdXNlJywgeyBUeXBlOiAnY2xpY2snIH0pO1xyXG4gICAgICAgIHRvRG9tRWxlbWVudFsnX2JsYXpvckNsaWNrTGlzdGVuZXInXSA9IGxpc3RlbmVyO1xyXG4gICAgICAgIHRvRG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxpc3RlbmVyKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlICdvbmNoYW5nZSc6IHtcclxuICAgICAgICB0b0RvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdG9Eb21FbGVtZW50WydfYmxhem9yQ2hhbmdlTGlzdGVuZXInXSk7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0SXNDaGVja2JveCA9IGlzQ2hlY2tib3godG9Eb21FbGVtZW50KTtcclxuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGV2dCA9PiB7XHJcbiAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRhcmdldElzQ2hlY2tib3ggPyBldnQudGFyZ2V0LmNoZWNrZWQgOiBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgcmFpc2VFdmVudChldnQsIGJyb3dzZXJSZW5kZXJlcklkLCBjb21wb25lbnRJZCwgZXZlbnRIYW5kbGVySWQsICdjaGFuZ2UnLCB7IFR5cGU6ICdjaGFuZ2UnLCBWYWx1ZTogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0b0RvbUVsZW1lbnRbJ19ibGF6b3JDaGFuZ2VMaXN0ZW5lciddID0gbGlzdGVuZXI7XHJcbiAgICAgICAgdG9Eb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlICdvbmtleXByZXNzJzoge1xyXG4gICAgICAgIHRvRG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIHRvRG9tRWxlbWVudFsnX2JsYXpvcktleXByZXNzTGlzdGVuZXInXSk7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBldnQgPT4ge1xyXG4gICAgICAgICAgLy8gVGhpcyBkb2VzIG5vdCBhY2NvdW50IGZvciBzcGVjaWFsIGtleXMgbm9yIGNyb3NzLWJyb3dzZXIgZGlmZmVyZW5jZXMuIFNvIGZhciBpdCdzXHJcbiAgICAgICAgICAvLyBqdXN0IHRvIGVzdGFibGlzaCB0aGF0IHdlIGNhbiBwYXNzIHBhcmFtZXRlcnMgd2hlbiByYWlzaW5nIGV2ZW50cy5cclxuICAgICAgICAgIC8vIFdlIHVzZSBDIy1zdHlsZSBQYXNjYWxDYXNlIG9uIHRoZSBldmVudEluZm8gdG8gc2ltcGxpZnkgZGVzZXJpYWxpemF0aW9uLCBidXQgdGhpcyBjb3VsZFxyXG4gICAgICAgICAgLy8gY2hhbmdlIGlmIHdlIGludHJvZHVjZWQgYSByaWNoZXIgSlNPTiBsaWJyYXJ5IG9uIHRoZSAuTkVUIHNpZGUuXHJcbiAgICAgICAgICByYWlzZUV2ZW50KGV2dCwgYnJvd3NlclJlbmRlcmVySWQsIGNvbXBvbmVudElkLCBldmVudEhhbmRsZXJJZCwgJ2tleWJvYXJkJywgeyBUeXBlOiBldnQudHlwZSwgS2V5OiAoZXZ0IGFzIGFueSkua2V5IH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdG9Eb21FbGVtZW50WydfYmxhem9yS2V5cHJlc3NMaXN0ZW5lciddID0gbGlzdGVuZXI7XHJcbiAgICAgICAgdG9Eb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgbGlzdGVuZXIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgLy8gVHJlYXQgYXMgYSByZWd1bGFyIHN0cmluZy12YWx1ZWQgYXR0cmlidXRlXHJcbiAgICAgICAgdG9Eb21FbGVtZW50LnNldEF0dHJpYnV0ZShcclxuICAgICAgICAgIGF0dHJpYnV0ZU5hbWUsXHJcbiAgICAgICAgICByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlVmFsdWUoYXR0cmlidXRlRnJhbWUpIVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0cnlBcHBseVZhbHVlUHJvcGVydHkoZWxlbWVudDogRWxlbWVudCwgdmFsdWU6IHN0cmluZyB8IG51bGwpIHtcclxuICAgIC8vIENlcnRhaW4gZWxlbWVudHMgaGF2ZSBidWlsdC1pbiBiZWhhdmlvdXIgZm9yIHRoZWlyICd2YWx1ZScgcHJvcGVydHlcclxuICAgIHN3aXRjaCAoZWxlbWVudC50YWdOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ0lOUFVUJzpcclxuICAgICAgY2FzZSAnU0VMRUNUJzpcclxuICAgICAgICBpZiAoaXNDaGVja2JveChlbGVtZW50KSkge1xyXG4gICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IHZhbHVlID09PSAnVHJ1ZSc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIChlbGVtZW50IGFzIGFueSkudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSAnU0VMRUNUJykge1xyXG4gICAgICAgICAgICAvLyA8c2VsZWN0PiBpcyBzcGVjaWFsLCBpbiB0aGF0IGFueXRoaW5nIHdlIHdyaXRlIHRvIC52YWx1ZSB3aWxsIGJlIGxvc3QgaWYgdGhlcmVcclxuICAgICAgICAgICAgLy8gaXNuJ3QgeWV0IGEgbWF0Y2hpbmcgPG9wdGlvbj4uIFRvIG1haW50YWluIHRoZSBleHBlY3RlZCBiZWhhdmlvciBubyBtYXR0ZXIgdGhlXHJcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgaW5zZXJ0aW9uL3VwZGF0ZSBvcmRlciwgcHJlc2VydmUgdGhlIGRlc2lyZWQgdmFsdWUgc2VwYXJhdGVseSBzb1xyXG4gICAgICAgICAgICAvLyB3ZSBjYW4gcmVjb3ZlciBpdCB3aGVuIGluc2VydGluZyBhbnkgbWF0Y2hpbmcgPG9wdGlvbj4uXHJcbiAgICAgICAgICAgIGVsZW1lbnRbc2VsZWN0VmFsdWVQcm9wbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIGNhc2UgJ09QVElPTic6XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdmFsdWUhKTtcclxuICAgICAgICAvLyBTZWUgYWJvdmUgZm9yIHdoeSB3ZSBoYXZlIHRoaXMgc3BlY2lhbCBoYW5kbGluZyBmb3IgPHNlbGVjdD4vPG9wdGlvbj5cclxuICAgICAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIGlmIChwYXJlbnRFbGVtZW50ICYmIChzZWxlY3RWYWx1ZVByb3BuYW1lIGluIHBhcmVudEVsZW1lbnQpICYmIHBhcmVudEVsZW1lbnRbc2VsZWN0VmFsdWVQcm9wbmFtZV0gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICB0aGlzLnRyeUFwcGx5VmFsdWVQcm9wZXJ0eShwYXJlbnRFbGVtZW50LCB2YWx1ZSk7XHJcbiAgICAgICAgICBkZWxldGUgcGFyZW50RWxlbWVudFtzZWxlY3RWYWx1ZVByb3BuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5zZXJ0RnJhbWVSYW5nZShjb21wb25lbnRJZDogbnVtYmVyLCBwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgZnJhbWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4sIHN0YXJ0SW5kZXg6IG51bWJlciwgZW5kSW5kZXhFeGNsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3Qgb3JpZ0NoaWxkSW5kZXggPSBjaGlsZEluZGV4O1xyXG4gICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEluZGV4OyBpbmRleCA8IGVuZEluZGV4RXhjbDsgaW5kZXgrKykge1xyXG4gICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihmcmFtZXMsIGluZGV4KTtcclxuICAgICAgY29uc3QgbnVtQ2hpbGRyZW5JbnNlcnRlZCA9IHRoaXMuaW5zZXJ0RnJhbWUoY29tcG9uZW50SWQsIHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWVzLCBmcmFtZSwgaW5kZXgpO1xyXG4gICAgICBjaGlsZEluZGV4ICs9IG51bUNoaWxkcmVuSW5zZXJ0ZWQ7XHJcblxyXG4gICAgICAvLyBTa2lwIG92ZXIgYW55IGRlc2NlbmRhbnRzLCBzaW5jZSB0aGV5IGFyZSBhbHJlYWR5IGRlYWx0IHdpdGggcmVjdXJzaXZlbHlcclxuICAgICAgY29uc3Qgc3VidHJlZUxlbmd0aCA9IHJlbmRlclRyZWVGcmFtZS5zdWJ0cmVlTGVuZ3RoKGZyYW1lKTtcclxuICAgICAgaWYgKHN1YnRyZWVMZW5ndGggPiAxKSB7XHJcbiAgICAgICAgaW5kZXggKz0gc3VidHJlZUxlbmd0aCAtIDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKGNoaWxkSW5kZXggLSBvcmlnQ2hpbGRJbmRleCk7IC8vIFRvdGFsIG51bWJlciBvZiBjaGlsZHJlbiBpbnNlcnRlZFxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNDaGVja2JveChlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgcmV0dXJuIGVsZW1lbnQudGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnY2hlY2tib3gnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnROb2RlSW50b0RPTShub2RlOiBOb2RlLCBwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlcikge1xyXG4gIGlmIChjaGlsZEluZGV4ID49IHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aCkge1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhdKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZU5vZGVGcm9tRE9NKHBhcmVudDogRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyKSB7XHJcbiAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQXR0cmlidXRlRnJvbURPTShwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgYXR0cmlidXRlTmFtZTogc3RyaW5nKSB7XHJcbiAgY29uc3QgZWxlbWVudCA9IHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhdIGFzIEVsZW1lbnQ7XHJcbiAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhaXNlRXZlbnQoZXZlbnQ6IEV2ZW50LCBicm93c2VyUmVuZGVyZXJJZDogbnVtYmVyLCBjb21wb25lbnRJZDogbnVtYmVyLCBldmVudEhhbmRsZXJJZDogbnVtYmVyLCBldmVudEluZm9UeXBlOiBFdmVudEluZm9UeXBlLCBldmVudEluZm86IGFueSkge1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIGlmICghcmFpc2VFdmVudE1ldGhvZCkge1xyXG4gICAgcmFpc2VFdmVudE1ldGhvZCA9IHBsYXRmb3JtLmZpbmRNZXRob2QoXHJcbiAgICAgICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3NlcicsICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlci5SZW5kZXJpbmcnLCAnQnJvd3NlclJlbmRlcmVyRXZlbnREaXNwYXRjaGVyJywgJ0Rpc3BhdGNoRXZlbnQnXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZXZlbnREZXNjcmlwdG9yID0ge1xyXG4gICAgQnJvd3NlclJlbmRlcmVySWQ6IGJyb3dzZXJSZW5kZXJlcklkLFxyXG4gICAgQ29tcG9uZW50SWQ6IGNvbXBvbmVudElkLFxyXG4gICAgRXZlbnRIYW5kbGVySWQ6IGV2ZW50SGFuZGxlcklkLFxyXG4gICAgRXZlbnRBcmdzVHlwZTogZXZlbnRJbmZvVHlwZVxyXG4gIH07XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2QocmFpc2VFdmVudE1ldGhvZCwgbnVsbCwgW1xyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkoZXZlbnREZXNjcmlwdG9yKSksXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhKU09OLnN0cmluZ2lmeShldmVudEluZm8pKVxyXG4gIF0pO1xyXG59XHJcblxyXG50eXBlIEV2ZW50SW5mb1R5cGUgPSAnbW91c2UnIHwgJ2tleWJvYXJkJyB8ICdjaGFuZ2UnO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL0Jyb3dzZXJSZW5kZXJlci50cyIsImltcG9ydCB7IFN5c3RlbV9BcnJheSwgUG9pbnRlciB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmNvbnN0IHJlbmRlclRyZWVFZGl0U3RydWN0TGVuZ3RoID0gMTY7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVuZGVyVHJlZUVkaXRQdHIocmVuZGVyVHJlZUVkaXRzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUVkaXRQb2ludGVyPiwgaW5kZXg6IG51bWJlcikge1xyXG4gIHJldHVybiBwbGF0Zm9ybS5nZXRBcnJheUVudHJ5UHRyKHJlbmRlclRyZWVFZGl0cywgaW5kZXgsIHJlbmRlclRyZWVFZGl0U3RydWN0TGVuZ3RoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlclRyZWVFZGl0ID0ge1xyXG4gIC8vIFRoZSBwcm9wZXJ0aWVzIGFuZCBtZW1vcnkgbGF5b3V0IG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBSZW5kZXJUcmVlRWRpdC5jc1xyXG4gIHR5cGU6IChlZGl0OiBSZW5kZXJUcmVlRWRpdFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGVkaXQsIDApIGFzIEVkaXRUeXBlLFxyXG4gIHNpYmxpbmdJbmRleDogKGVkaXQ6IFJlbmRlclRyZWVFZGl0UG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZWRpdCwgNCksXHJcbiAgbmV3VHJlZUluZGV4OiAoZWRpdDogUmVuZGVyVHJlZUVkaXRQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChlZGl0LCA4KSxcclxuICByZW1vdmVkQXR0cmlidXRlTmFtZTogKGVkaXQ6IFJlbmRlclRyZWVFZGl0UG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGVkaXQsIDEyKSxcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEVkaXRUeXBlIHtcclxuICBwcmVwZW5kRnJhbWUgPSAxLFxyXG4gIHJlbW92ZUZyYW1lID0gMixcclxuICBzZXRBdHRyaWJ1dGUgPSAzLFxyXG4gIHJlbW92ZUF0dHJpYnV0ZSA9IDQsXHJcbiAgdXBkYXRlVGV4dCA9IDUsXHJcbiAgc3RlcEluID0gNixcclxuICBzdGVwT3V0ID0gNyxcclxufVxyXG5cclxuLy8gTm9taW5hbCB0eXBlIHRvIGVuc3VyZSBvbmx5IHZhbGlkIHBvaW50ZXJzIGFyZSBwYXNzZWQgdG8gdGhlIHJlbmRlclRyZWVFZGl0IGZ1bmN0aW9ucy5cclxuLy8gQXQgcnVudGltZSB0aGUgdmFsdWVzIGFyZSBqdXN0IG51bWJlcnMuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyVHJlZUVkaXRQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlclRyZWVFZGl0UG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9SZW5kZXJUcmVlRWRpdC50cyIsImltcG9ydCB7IFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSwgUG9pbnRlciB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmNvbnN0IHJlbmRlclRyZWVGcmFtZVN0cnVjdExlbmd0aCA9IDI4O1xyXG5cclxuLy8gVG8gbWluaW1pc2UgR0MgcHJlc3N1cmUsIGluc3RlYWQgb2YgaW5zdGFudGlhdGluZyBhIEpTIG9iamVjdCB0byByZXByZXNlbnQgZWFjaCB0cmVlIGZyYW1lLFxyXG4vLyB3ZSB3b3JrIGluIHRlcm1zIG9mIHBvaW50ZXJzIHRvIHRoZSBzdHJ1Y3RzIG9uIHRoZSAuTkVUIGhlYXAsIGFuZCB1c2Ugc3RhdGljIGZ1bmN0aW9ucyB0aGF0XHJcbi8vIGtub3cgaG93IHRvIHJlYWQgcHJvcGVydHkgdmFsdWVzIGZyb20gdGhvc2Ugc3RydWN0cy5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmVlRnJhbWVQdHIocmVuZGVyVHJlZUVudHJpZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPiwgaW5kZXg6IG51bWJlcikge1xyXG4gIHJldHVybiBwbGF0Zm9ybS5nZXRBcnJheUVudHJ5UHRyKHJlbmRlclRyZWVFbnRyaWVzLCBpbmRleCwgcmVuZGVyVHJlZUZyYW1lU3RydWN0TGVuZ3RoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlclRyZWVGcmFtZSA9IHtcclxuICAvLyBUaGUgcHJvcGVydGllcyBhbmQgbWVtb3J5IGxheW91dCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSAuTkVUIGVxdWl2YWxlbnQgaW4gUmVuZGVyVHJlZUZyYW1lLmNzXHJcbiAgZnJhbWVUeXBlOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lLCA0KSBhcyBGcmFtZVR5cGUsXHJcbiAgc3VidHJlZUxlbmd0aDogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgOCkgYXMgRnJhbWVUeXBlLFxyXG4gIGNvbXBvbmVudElkOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lLCAxMiksXHJcbiAgZWxlbWVudE5hbWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAxNiksXHJcbiAgdGV4dENvbnRlbnQ6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAxNiksXHJcbiAgYXR0cmlidXRlTmFtZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RyaW5nRmllbGQoZnJhbWUsIDE2KSxcclxuICBhdHRyaWJ1dGVWYWx1ZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RyaW5nRmllbGQoZnJhbWUsIDI0KSxcclxuICBhdHRyaWJ1dGVFdmVudEhhbmRsZXJJZDogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgOCksXHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBGcmFtZVR5cGUge1xyXG4gIC8vIFRoZSB2YWx1ZXMgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUgLk5FVCBlcXVpdmFsZW50IGluIFJlbmRlclRyZWVGcmFtZVR5cGUuY3NcclxuICBlbGVtZW50ID0gMSxcclxuICB0ZXh0ID0gMixcclxuICBhdHRyaWJ1dGUgPSAzLFxyXG4gIGNvbXBvbmVudCA9IDQsXHJcbiAgcmVnaW9uID0gNSxcclxufVxyXG5cclxuLy8gTm9taW5hbCB0eXBlIHRvIGVuc3VyZSBvbmx5IHZhbGlkIHBvaW50ZXJzIGFyZSBwYXNzZWQgdG8gdGhlIHJlbmRlclRyZWVGcmFtZSBmdW5jdGlvbnMuXHJcbi8vIEF0IHJ1bnRpbWUgdGhlIHZhbHVlcyBhcmUganVzdCBudW1iZXJzLlxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclRyZWVGcmFtZVBvaW50ZXIgZXh0ZW5kcyBQb2ludGVyIHsgUmVuZGVyVHJlZUZyYW1lUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9SZW5kZXJUcmVlRnJhbWUudHMiLCJpbXBvcnQgeyByZWdpc3RlckZ1bmN0aW9uIH0gZnJvbSAnLi4vSW50ZXJvcC9SZWdpc3RlcmVkRnVuY3Rpb24nO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgTWV0aG9kSGFuZGxlLCBTeXN0ZW1fU3RyaW5nIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5jb25zdCBodHRwQ2xpZW50QXNzZW1ibHkgPSAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXInO1xyXG5jb25zdCBodHRwQ2xpZW50TmFtZXNwYWNlID0gYCR7aHR0cENsaWVudEFzc2VtYmx5fS5IdHRwYDtcclxuY29uc3QgaHR0cENsaWVudFR5cGVOYW1lID0gJ0Jyb3dzZXJIdHRwTWVzc2FnZUhhbmRsZXInO1xyXG5jb25zdCBodHRwQ2xpZW50RnVsbFR5cGVOYW1lID0gYCR7aHR0cENsaWVudE5hbWVzcGFjZX0uJHtodHRwQ2xpZW50VHlwZU5hbWV9YDtcclxubGV0IHJlY2VpdmVSZXNwb25zZU1ldGhvZDogTWV0aG9kSGFuZGxlO1xyXG5cclxucmVnaXN0ZXJGdW5jdGlvbihgJHtodHRwQ2xpZW50RnVsbFR5cGVOYW1lfS5TZW5kYCwgKGlkOiBudW1iZXIsIG1ldGhvZDogc3RyaW5nLCByZXF1ZXN0VXJpOiBzdHJpbmcsIGJvZHk6IHN0cmluZyB8IG51bGwsIGhlYWRlcnNKc29uOiBzdHJpbmcgfCBudWxsKSA9PiB7XHJcbiAgc2VuZEFzeW5jKGlkLCBtZXRob2QsIHJlcXVlc3RVcmksIGJvZHksIGhlYWRlcnNKc29uKTtcclxufSk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzZW5kQXN5bmMoaWQ6IG51bWJlciwgbWV0aG9kOiBzdHJpbmcsIHJlcXVlc3RVcmk6IHN0cmluZywgYm9keTogc3RyaW5nIHwgbnVsbCwgaGVhZGVyc0pzb246IHN0cmluZyB8IG51bGwpIHtcclxuICBsZXQgcmVzcG9uc2U6IFJlc3BvbnNlO1xyXG4gIGxldCByZXNwb25zZVRleHQ6IHN0cmluZztcclxuICB0cnkge1xyXG4gICAgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0VXJpLCB7XHJcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICBib2R5OiBib2R5IHx8IHVuZGVmaW5lZCxcclxuICAgICAgaGVhZGVyczogaGVhZGVyc0pzb24gPyAoSlNPTi5wYXJzZShoZWFkZXJzSnNvbikgYXMgc3RyaW5nW11bXSkgOiB1bmRlZmluZWRcclxuICAgIH0pO1xyXG4gICAgcmVzcG9uc2VUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICBkaXNwYXRjaEVycm9yUmVzcG9uc2UoaWQsIGV4LnRvU3RyaW5nKCkpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgZGlzcGF0Y2hTdWNjZXNzUmVzcG9uc2UoaWQsIHJlc3BvbnNlLCByZXNwb25zZVRleHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaFN1Y2Nlc3NSZXNwb25zZShpZDogbnVtYmVyLCByZXNwb25zZTogUmVzcG9uc2UsIHJlc3BvbnNlVGV4dDogc3RyaW5nKSB7XHJcbiAgY29uc3QgcmVzcG9uc2VEZXNjcmlwdG9yOiBSZXNwb25zZURlc2NyaXB0b3IgPSB7XHJcbiAgICBTdGF0dXNDb2RlOiByZXNwb25zZS5zdGF0dXMsXHJcbiAgICBIZWFkZXJzOiBbXVxyXG4gIH07XHJcbiAgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2YWx1ZSwgbmFtZSkgPT4ge1xyXG4gICAgcmVzcG9uc2VEZXNjcmlwdG9yLkhlYWRlcnMucHVzaChbbmFtZSwgdmFsdWVdKTtcclxuICB9KTtcclxuXHJcbiAgZGlzcGF0Y2hSZXNwb25zZShcclxuICAgIGlkLFxyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VEZXNjcmlwdG9yKSksXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhyZXNwb25zZVRleHQpLCAvLyBUT0RPOiBDb25zaWRlciBob3cgdG8gaGFuZGxlIG5vbi1zdHJpbmcgcmVzcG9uc2VzXHJcbiAgICAvKiBlcnJvck1lc3NhZ2UgKi8gbnVsbFxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoRXJyb3JSZXNwb25zZShpZDogbnVtYmVyLCBlcnJvck1lc3NhZ2U6IHN0cmluZykge1xyXG4gIGRpc3BhdGNoUmVzcG9uc2UoXHJcbiAgICBpZCxcclxuICAgIC8qIHJlc3BvbnNlRGVzY3JpcHRvciAqLyBudWxsLFxyXG4gICAgLyogcmVzcG9uc2VUZXh0ICovIG51bGwsXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhlcnJvck1lc3NhZ2UpXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGF0Y2hSZXNwb25zZShpZDogbnVtYmVyLCByZXNwb25zZURlc2NyaXB0b3I6IFN5c3RlbV9TdHJpbmcgfCBudWxsLCByZXNwb25zZVRleHQ6IFN5c3RlbV9TdHJpbmcgfCBudWxsLCBlcnJvck1lc3NhZ2U6IFN5c3RlbV9TdHJpbmcgfCBudWxsKSB7XHJcbiAgaWYgKCFyZWNlaXZlUmVzcG9uc2VNZXRob2QpIHtcclxuICAgIHJlY2VpdmVSZXNwb25zZU1ldGhvZCA9IHBsYXRmb3JtLmZpbmRNZXRob2QoXHJcbiAgICAgIGh0dHBDbGllbnRBc3NlbWJseSxcclxuICAgICAgaHR0cENsaWVudE5hbWVzcGFjZSxcclxuICAgICAgaHR0cENsaWVudFR5cGVOYW1lLFxyXG4gICAgICAnUmVjZWl2ZVJlc3BvbnNlJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2QocmVjZWl2ZVJlc3BvbnNlTWV0aG9kLCBudWxsLCBbXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhpZC50b1N0cmluZygpKSxcclxuICAgIHJlc3BvbnNlRGVzY3JpcHRvcixcclxuICAgIHJlc3BvbnNlVGV4dCxcclxuICAgIGVycm9yTWVzc2FnZSxcclxuICBdKTtcclxufVxyXG5cclxuLy8gS2VlcCB0aGlzIGluIHN5bmMgd2l0aCB0aGUgLk5FVCBlcXVpdmFsZW50IGluIEh0dHBDbGllbnQuY3NcclxuaW50ZXJmYWNlIFJlc3BvbnNlRGVzY3JpcHRvciB7XHJcbiAgLy8gV2UgZG9uJ3QgaGF2ZSBCb2R5VGV4dCBpbiBoZXJlIGJlY2F1c2UgaWYgd2UgZGlkLCB0aGVuIGluIHRoZSBKU09OLXJlc3BvbnNlIGNhc2UgKHdoaWNoXHJcbiAgLy8gaXMgdGhlIG1vc3QgY29tbW9uIGNhc2UpLCB3ZSdkIGJlIGRvdWJsZS1lbmNvZGluZyBpdCwgc2luY2UgdGhlIGVudGlyZSBSZXNwb25zZURlc2NyaXB0b3JcclxuICAvLyBhbHNvIGdldHMgSlNPTiBlbmNvZGVkLiBJdCB3b3VsZCB3b3JrIGJ1dCBpcyB0d2ljZSB0aGUgYW1vdW50IG9mIHN0cmluZyBwcm9jZXNzaW5nLlxyXG4gIFN0YXR1c0NvZGU6IG51bWJlcjtcclxuICBIZWFkZXJzOiBzdHJpbmdbXVtdO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TZXJ2aWNlcy9IdHRwLnRzIiwiaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuL0Vudmlyb25tZW50J1xyXG5pbXBvcnQgeyByZWdpc3RlckZ1bmN0aW9uIH0gZnJvbSAnLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcbmltcG9ydCB7IG5hdmlnYXRlVG8gfSBmcm9tICcuL1NlcnZpY2VzL1VyaUhlbHBlcic7XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAvLyBXaGVuIHRoZSBsaWJyYXJ5IGlzIGxvYWRlZCBpbiBhIGJyb3dzZXIgdmlhIGEgPHNjcmlwdD4gZWxlbWVudCwgbWFrZSB0aGVcclxuICAvLyBmb2xsb3dpbmcgQVBJcyBhdmFpbGFibGUgaW4gZ2xvYmFsIHNjb3BlIGZvciBpbnZvY2F0aW9uIGZyb20gSlNcclxuICB3aW5kb3dbJ0JsYXpvciddID0ge1xyXG4gICAgcGxhdGZvcm0sXHJcbiAgICByZWdpc3RlckZ1bmN0aW9uLFxyXG4gICAgbmF2aWdhdGVUbyxcclxuICB9O1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HbG9iYWxFeHBvcnRzLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==