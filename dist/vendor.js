webpackJsonp([7,8],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*==================================================
	 Copyright (c) 2013-2015 司徒正美 and other contributors
	 http://www.cnblogs.com/rubylouvre/
	 https://github.com/RubyLouvre
	 http://weibo.com/jslouvre/
	 
	 Released under the MIT license
	 avalon.js 1.4.7.1 built in 2015.11.19
	 support IE6+ and other browsers
	 ==================================================*/
	(function(global, factory) {
	
	    if (typeof module === "object" && typeof module.exports === "object") {
	        // For CommonJS and CommonJS-like environments where a proper `window`
	        // is present, execute the factory and get avalon.
	        // For environments that do not have a `window` with a `document`
	        // (such as Node.js), expose a factory as module.exports.
	        // This accentuates the need for the creation of a real `window`.
	        // e.g. var avalon = require("avalon")(window);
	        module.exports = global.document ? factory(global, true) : function(w) {
	            if (!w.document) {
	                throw new Error("Avalon requires a window with a document")
	            }
	            return factory(w)
	        }
	    } else {
	        factory(global)
	    }
	
	    // Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
	
	    /*********************************************************************
	     *                    全局变量及方法                                  *
	     **********************************************************************/
	    var expose = new Date() - 0
	        //http://stackoverflow.com/questions/7290086/javascript-use-strict-and-nicks-find-global-function
	    var DOC = window.document
	    var head = DOC.getElementsByTagName("head")[0] //HEAD元素
	    var ifGroup = head.insertBefore(document.createElement("avalon"), head.firstChild) //避免IE6 base标签BUG
	    ifGroup.innerHTML = "X<style id='avalonStyle'>.avalonHide{ display: none!important }</style>"
	    ifGroup.setAttribute("ms-skip", "1")
	    ifGroup.className = "avalonHide"
	    var rnative = /\[native code\]/ //判定是否原生函数
	    function log() {
	        if (window.console && avalon.config.debug) {
	            // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
	            Function.apply.call(console.log, console, arguments)
	        }
	    }
	
	
	    var subscribers = "$" + expose
	    var stopRepeatAssign = false
	    var rword = /[^, ]+/g //切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach
	    var rcomplexType = /^(?:object|array)$/
	    var rsvg = /^\[object SVG\w*Element\]$/
	    var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/
	    var oproto = Object.prototype
	    var ohasOwn = oproto.hasOwnProperty
	    var serialize = oproto.toString
	    var ap = Array.prototype
	    var aslice = ap.slice
	    var W3C = window.dispatchEvent
	    var root = DOC.documentElement
	    var avalonFragment = DOC.createDocumentFragment()
	    var cinerator = DOC.createElement("div")
	    var class2type = {}
	    "Boolean Number String Function Array Date RegExp Object Error".replace(rword, function(name) {
	        class2type["[object " + name + "]"] = name.toLowerCase()
	    })
	
	
	    function noop() {}
	
	
	    function oneObject(array, val) {
	        if (typeof array === "string") {
	            array = array.match(rword) || []
	        }
	        var result = {},
	            value = val !== void 0 ? val : 1
	        for (var i = 0, n = array.length; i < n; i++) {
	            result[array[i]] = value
	        }
	        return result
	    }
	
	    //生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	    var generateID = function(prefix) {
	        prefix = prefix || "avalon"
	        return String(Math.random() + Math.random()).replace(/\d\.\d{4}/, prefix)
	    }
	
	    function IE() {
	        if (window.VBArray) {
	            var mode = document.documentMode
	            return mode ? mode : window.XMLHttpRequest ? 7 : 6
	        } else {
	            return NaN
	        }
	    }
	    var IEVersion = IE()
	
	    avalon = function(el) { //创建jQuery式的无new 实例化结构
	        return new avalon.init(el)
	    }
	
	    avalon.profile = function() {
	        if (window.console && avalon.config.profile) {
	            Function.apply.call(console.log, console, arguments)
	        }
	    }
	
	    /*视浏览器情况采用最快的异步回调*/
	    avalon.nextTick = new function() { // jshint ignore:line
	            var tickImmediate = window.setImmediate
	            var tickObserver = window.MutationObserver
	            if (tickImmediate) { //IE10 \11 edage
	                return tickImmediate.bind(window)
	            }
	
	            var queue = []
	
	            function callback() {
	                var n = queue.length
	                for (var i = 0; i < n; i++) {
	                    queue[i]()
	                }
	                queue = queue.slice(n)
	            }
	
	            if (tickObserver) { // 支持MutationObserver
	                var node = document.createTextNode("avalon")
	                new tickObserver(callback).observe(node, {
	                        characterData: true
	                    }) // jshint ignore:line
	                return function(fn) {
	                    queue.push(fn)
	                    node.data = Math.random()
	                }
	            }
	
	            if (window.VBArray) {
	                return function(fn) {
	                    queue.push(fn)
	                    var node = DOC.createElement("script")
	                    node.onreadystatechange = function() {
	                        callback() //在interactive阶段就触发
	                        node.onreadystatechange = null
	                        head.removeChild(node)
	                        node = null
	                    }
	                    head.appendChild(node)
	                }
	            }
	
	
	            return function(fn) {
	                setTimeout(fn, 4)
	            }
	        } // jshint ignore:line
	        /*********************************************************************
	         *                 avalon的静态方法定义区                              *
	         **********************************************************************/
	    avalon.init = function(el) {
	        this[0] = this.element = el
	    }
	    avalon.fn = avalon.prototype = avalon.init.prototype
	
	    avalon.type = function(obj) { //取得目标的类型
	        if (obj == null) {
	            return String(obj)
	        }
	        // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
	        return typeof obj === "object" || typeof obj === "function" ?
	            class2type[serialize.call(obj)] || "object" :
	            typeof obj
	    }
	
	    var isFunction = typeof alert === "object" ? function(fn) {
	        try {
	            return /^\s*\bfunction\b/.test(fn + "")
	        } catch (e) {
	            return false
	        }
	    } : function(fn) {
	        return serialize.call(fn) === "[object Function]"
	    }
	    avalon.isFunction = isFunction
	
	    avalon.isWindow = function(obj) {
	        if (!obj)
	            return false
	                // 利用IE678 window == document为true,document == window竟然为false的神奇特性
	                // 标准浏览器及IE9，IE10等使用 正则检测
	        return obj == obj.document && obj.document != obj //jshint ignore:line
	    }
	
	    function isWindow(obj) {
	        return rwindow.test(serialize.call(obj))
	    }
	    if (isWindow(window)) {
	        avalon.isWindow = isWindow
	    }
	    var enu
	    for (enu in avalon({})) {
	        break
	    }
	    var enumerateBUG = enu !== "0" //IE6下为true, 其他为false
	        /*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/
	    avalon.isPlainObject = function(obj, key) {
	        if (!obj || avalon.type(obj) !== "object" || obj.nodeType || avalon.isWindow(obj)) {
	            return false;
	        }
	        try { //IE内置对象没有constructor
	            if (obj.constructor && !ohasOwn.call(obj, "constructor") && !ohasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
	                return false;
	            }
	        } catch (e) { //IE8 9会在这里抛错
	            return false;
	        }
	        if (enumerateBUG) {
	            for (key in obj) {
	                return ohasOwn.call(obj, key)
	            }
	        }
	        for (key in obj) {}
	        return key === void 0 || ohasOwn.call(obj, key)
	    }
	    if (rnative.test(Object.getPrototypeOf)) {
	        avalon.isPlainObject = function(obj) {
	            // 简单的 typeof obj === "object"检测，会致使用isPlainObject(window)在opera下通不过
	            return serialize.call(obj) === "[object Object]" && Object.getPrototypeOf(obj) === oproto
	        }
	    }
	    //与jQuery.extend方法，可用于浅拷贝，深拷贝
	    avalon.mix = avalon.fn.mix = function() {
	        var options, name, src, copy, copyIsArray, clone,
	            target = arguments[0] || {},
	            i = 1,
	            length = arguments.length,
	            deep = false
	
	        // 如果第一个参数为布尔,判定是否深拷贝
	        if (typeof target === "boolean") {
	            deep = target
	            target = arguments[1] || {}
	            i++
	        }
	
	        //确保接受方为一个复杂的数据类型
	        if (typeof target !== "object" && !isFunction(target)) {
	            target = {}
	        }
	
	        //如果只有一个参数，那么新成员添加于mix所在的对象上
	        if (i === length) {
	            target = this
	            i--
	        }
	
	        for (; i < length; i++) {
	            //只处理非空参数
	            if ((options = arguments[i]) != null) {
	                for (name in options) {
	                    src = target[name]
	                    try {
	                        copy = options[name] //当options为VBS对象时报错
	                    } catch (e) {
	                        continue
	                    }
	
	                    // 防止环引用
	                    if (target === copy) {
	                        continue
	                    }
	                    if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
	
	                        if (copyIsArray) {
	                            copyIsArray = false
	                            clone = src && Array.isArray(src) ? src : []
	
	                        } else {
	                            clone = src && avalon.isPlainObject(src) ? src : {}
	                        }
	
	                        target[name] = avalon.mix(deep, clone, copy)
	                    } else if (copy !== void 0) {
	                        target[name] = copy
	                    }
	                }
	            }
	        }
	        return target
	    }
	
	    function _number(a, len) { //用于模拟slice, splice的效果
	        a = Math.floor(a) || 0
	        return a < 0 ? Math.max(len + a, 0) : Math.min(a, len);
	    }
	
	    avalon.mix({
	        rword: rword,
	        subscribers: subscribers,
	        version: 1.471,
	        ui: {},
	        log: log,
	        slice: W3C ? function(nodes, start, end) {
	            return aslice.call(nodes, start, end)
	        } : function(nodes, start, end) {
	            var ret = []
	            var len = nodes.length
	            if (end === void 0)
	                end = len
	            if (typeof end === "number" && isFinite(end)) {
	                start = _number(start, len)
	                end = _number(end, len)
	                for (var i = start; i < end; ++i) {
	                    ret[i - start] = nodes[i]
	                }
	            }
	            return ret
	        },
	        noop: noop,
	        /*如果不用Error对象封装一下，str在控制台下可能会乱码*/
	        error: function(str, e) {
	            throw (e || Error)(str)
	        },
	        /*将一个以空格或逗号隔开的字符串或数组,转换成一个键值都为1的对象*/
	        oneObject: oneObject,
	        /* avalon.range(10)
	         => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
	         avalon.range(1, 11)
	         => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	         avalon.range(0, 30, 5)
	         => [0, 5, 10, 15, 20, 25]
	         avalon.range(0, -10, -1)
	         => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
	         avalon.range(0)
	         => []*/
	        range: function(start, end, step) { // 用于生成整数数组
	            step || (step = 1)
	            if (end == null) {
	                end = start || 0
	                start = 0
	            }
	            var index = -1,
	                length = Math.max(0, Math.ceil((end - start) / step)),
	                result = new Array(length)
	            while (++index < length) {
	                result[index] = start
	                start += step
	            }
	            return result
	        },
	        eventHooks: [],
	        /*绑定事件*/
	        bind: function(el, type, fn, phase) {
	            var hooks = avalon.eventHooks
	            var hook = hooks[type]
	            if (typeof hook === "object") {
	                type = hook.type || type
	                phase = hook.phase || !!phase
	                fn = hook.fn ? hook.fn(el, fn) : fn
	            }
	            var callback = W3C ? fn : function(e) {
	                fn.call(el, fixEvent(e));
	            }
	            if (W3C) {
	                el.addEventListener(type, callback, phase)
	            } else {
	                el.attachEvent("on" + type, callback)
	            }
	            return callback
	        },
	        /*卸载事件*/
	        unbind: function(el, type, fn, phase) {
	            var hooks = avalon.eventHooks
	            var hook = hooks[type]
	            var callback = fn || noop
	            if (typeof hook === "object") {
	                type = hook.type || type
	                phase = hook.phase || !!phase
	            }
	            if (W3C) {
	                el.removeEventListener(type, callback, phase)
	            } else {
	                el.detachEvent("on" + type, callback)
	            }
	        },
	        /*读写删除元素节点的样式*/
	        css: function(node, name, value) {
	            if (node instanceof avalon) {
	                node = node[0]
	            }
	            var prop = /[_-]/.test(name) ? camelize(name) : name,
	                fn
	            name = avalon.cssName(prop) || prop
	            if (value === void 0 || typeof value === "boolean") { //获取样式
	                fn = cssHooks[prop + ":get"] || cssHooks["@:get"]
	                if (name === "background") {
	                    name = "backgroundColor"
	                }
	                var val = fn(node, name)
	                return value === true ? parseFloat(val) || 0 : val
	            } else if (value === "") { //请除样式
	                node.style[name] = ""
	            } else { //设置样式
	                if (value == null || value !== value) {
	                    return
	                }
	                if (isFinite(value) && !avalon.cssNumber[prop]) {
	                    value += "px"
	                }
	                fn = cssHooks[prop + ":set"] || cssHooks["@:set"]
	                fn(node, name, value)
	            }
	        },
	        /*遍历数组与对象,回调的第一个参数为索引或键名,第二个或元素或键值*/
	        each: function(obj, fn) {
	            if (obj) { //排除null, undefined
	                var i = 0
	                if (isArrayLike(obj)) {
	                    for (var n = obj.length; i < n; i++) {
	                        if (fn(i, obj[i]) === false)
	                            break
	                    }
	                } else {
	                    for (i in obj) {
	                        if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
	                            break
	                        }
	                    }
	                }
	            }
	        },
	        //收集元素的data-{{prefix}}-*属性，并转换为对象
	        getWidgetData: function(elem, prefix) {
	            var raw = avalon(elem).data()
	            var result = {}
	            for (var i in raw) {
	                if (i.indexOf(prefix) === 0) {
	                    result[i.replace(prefix, "").replace(/\w/, function(a) {
	                        return a.toLowerCase()
	                    })] = raw[i]
	                }
	            }
	            return result
	        },
	        Array: {
	            /*只有当前数组不存在此元素时只添加它*/
	            ensure: function(target, item) {
	                if (target.indexOf(item) === -1) {
	                    return target.push(item)
	                }
	            },
	            /*移除数组中指定位置的元素，返回布尔表示成功与否*/
	            removeAt: function(target, index) {
	                return !!target.splice(index, 1).length
	            },
	            /*移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否*/
	            remove: function(target, item) {
	                var index = target.indexOf(item)
	                if (~index)
	                    return avalon.Array.removeAt(target, index)
	                return false
	            }
	        }
	    })
	
	    var bindingHandlers = avalon.bindingHandlers = {}
	    var bindingExecutors = avalon.bindingExecutors = {}
	
	    /*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
	    function isArrayLike(obj) {
	        if (!obj)
	            return false
	        var n = obj.length
	        if (n === (n >>> 0)) { //检测length属性是否为非负整数
	            var type = serialize.call(obj).slice(8, -1)
	            if (/(?:regexp|string|function|window|global)$/i.test(type))
	                return false
	            if (type === "Array")
	                return true
	            try {
	                if ({}.propertyIsEnumerable.call(obj, "length") === false) { //如果是原生对象
	                    return /^\s?function/.test(obj.item || obj.callee)
	                }
	                return true
	            } catch (e) { //IE的NodeList直接抛错
	                return !obj.window //IE6-8 window
	            }
	        }
	        return false
	    }
	
	
	    // https://github.com/rsms/js-lru
	    var Cache = new function() { // jshint ignore:line
	            function LRU(maxLength) {
	                this.size = 0
	                this.limit = maxLength
	                this.head = this.tail = void 0
	                this._keymap = {}
	            }
	
	            var p = LRU.prototype
	
	            p.put = function(key, value) {
	                var entry = {
	                    key: key,
	                    value: value
	                }
	                this._keymap[key] = entry
	                if (this.tail) {
	                    this.tail.newer = entry
	                    entry.older = this.tail
	                } else {
	                    this.head = entry
	                }
	                this.tail = entry
	                if (this.size === this.limit) {
	                    this.shift()
	                } else {
	                    this.size++
	                }
	                return value
	            }
	
	            p.shift = function() {
	                var entry = this.head
	                if (entry) {
	                    this.head = this.head.newer
	                    this.head.older =
	                        entry.newer =
	                        entry.older =
	                        this._keymap[entry.key] = void 0
	                    delete this._keymap[entry.key] //#1029
	                }
	            }
	            p.get = function(key) {
	                var entry = this._keymap[key]
	                if (entry === void 0)
	                    return
	                if (entry === this.tail) {
	                    return entry.value
	                }
	                // HEAD--------------TAIL
	                //   <.older   .newer>
	                //  <--- add direction --
	                //   A  B  C  <D>  E
	                if (entry.newer) {
	                    if (entry === this.head) {
	                        this.head = entry.newer
	                    }
	                    entry.newer.older = entry.older // C <-- E.
	                }
	                if (entry.older) {
	                    entry.older.newer = entry.newer // C. --> E
	                }
	                entry.newer = void 0 // D --x
	                entry.older = this.tail // D. --> E
	                if (this.tail) {
	                    this.tail.newer = entry // E. <-- D
	                }
	                this.tail = entry
	                return entry.value
	            }
	            return LRU
	        } // jshint ignore:line
	
	    /*********************************************************************
	     *                         javascript 底层补丁                       *
	     **********************************************************************/
	    if (!"司徒正美".trim) {
	        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
	        String.prototype.trim = function() {
	            return this.replace(rtrim, "")
	        }
	    }
	    var hasDontEnumBug = !({
	            'toString': null
	        }).propertyIsEnumerable('toString'),
	        hasProtoEnumBug = (function() {}).propertyIsEnumerable('prototype'),
	        dontEnums = [
	            "toString",
	            "toLocaleString",
	            "valueOf",
	            "hasOwnProperty",
	            "isPrototypeOf",
	            "propertyIsEnumerable",
	            "constructor"
	        ],
	        dontEnumsLength = dontEnums.length;
	    if (!Object.keys) {
	        Object.keys = function(object) { //ecma262v5 15.2.3.14
	            var theKeys = []
	            var skipProto = hasProtoEnumBug && typeof object === "function"
	            if (typeof object === "string" || (object && object.callee)) {
	                for (var i = 0; i < object.length; ++i) {
	                    theKeys.push(String(i))
	                }
	            } else {
	                for (var name in object) {
	                    if (!(skipProto && name === "prototype") && ohasOwn.call(object, name)) {
	                        theKeys.push(String(name))
	                    }
	                }
	            }
	
	            if (hasDontEnumBug) {
	                var ctor = object.constructor,
	                    skipConstructor = ctor && ctor.prototype === object
	                for (var j = 0; j < dontEnumsLength; j++) {
	                    var dontEnum = dontEnums[j]
	                    if (!(skipConstructor && dontEnum === "constructor") && ohasOwn.call(object, dontEnum)) {
	                        theKeys.push(dontEnum)
	                    }
	                }
	            }
	            return theKeys
	        }
	    }
	    if (!Array.isArray) {
	        Array.isArray = function(a) {
	            return serialize.call(a) === "[object Array]"
	        }
	    }
	
	    if (!noop.bind) {
	        Function.prototype.bind = function(scope) {
	            if (arguments.length < 2 && scope === void 0)
	                return this
	            var fn = this,
	                argv = arguments
	            return function() {
	                var args = [],
	                    i
	                for (i = 1; i < argv.length; i++)
	                    args.push(argv[i])
	                for (i = 0; i < arguments.length; i++)
	                    args.push(arguments[i])
	                return fn.apply(scope, args)
	            }
	        }
	    }
	
	    function iterator(vars, body, ret) {
	        var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret
	            /* jshint ignore:start */
	        return Function("fn,scope", fun)
	            /* jshint ignore:end */
	    }
	    if (!rnative.test([].map)) {
	        avalon.mix(ap, {
	            //定位操作，返回数组中第一个等于给定参数的元素的索引值。
	            indexOf: function(item, index) {
	                var n = this.length,
	                    i = ~~index
	                if (i < 0)
	                    i += n
	                for (; i < n; i++)
	                    if (this[i] === item)
	                        return i
	                return -1
	            },
	            //定位操作，同上，不过是从后遍历。
	            lastIndexOf: function(item, index) {
	                var n = this.length,
	                    i = index == null ? n - 1 : index
	                if (i < 0)
	                    i = Math.max(0, n + i)
	                for (; i >= 0; i--)
	                    if (this[i] === item)
	                        return i
	                return -1
	            },
	            //迭代操作，将数组的元素挨个儿传入一个函数中执行。Prototype.js的对应名字为each。
	            forEach: iterator("", '_', ""),
	            //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
	            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
	            //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Prototype.js的对应名字为collect。
	            map: iterator('r=[],', 'r[i]=_', 'return r'),
	            //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Prototype.js的对应名字为any。
	            some: iterator("", 'if(_)return true', 'return false'),
	            //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Prototype.js的对应名字为all。
	            every: iterator("", 'if(!_)return false', 'return true')
	        })
	    }
	    /*********************************************************************
	     *                           DOM 底层补丁                             *
	     **********************************************************************/
	
	    function fixContains(root, el) {
	        try { //IE6-8,游离于DOM树外的文本节点，访问parentNode有时会抛错
	            while ((el = el.parentNode))
	                if (el === root)
	                    return true
	            return false
	        } catch (e) {
	            return false
	        }
	    }
	    avalon.contains = fixContains
	        //IE6-11的文档对象没有contains
	    if (!DOC.contains) {
	        DOC.contains = function(b) {
	            return fixContains(DOC, b)
	        }
	    }
	
	    function outerHTML() {
	        return new XMLSerializer().serializeToString(this)
	    }
	
	    if (window.SVGElement) {
	        //safari5+是把contains方法放在Element.prototype上而不是Node.prototype
	        if (!DOC.createTextNode("x").contains) {
	            Node.prototype.contains = function(arg) { //IE6-8没有Node对象
	                return !!(this.compareDocumentPosition(arg) & 16)
	            }
	        }
	        var svgns = "http://www.w3.org/2000/svg"
	        var svg = DOC.createElementNS(svgns, "svg")
	        svg.innerHTML = '<circle cx="50" cy="50" r="40" fill="red" />'
	        if (!rsvg.test(svg.firstChild)) { // #409
	            function enumerateNode(node, targetNode) { // jshint ignore:line
	                if (node && node.childNodes) {
	                    var nodes = node.childNodes
	                    for (var i = 0, el; el = nodes[i++];) {
	                        if (el.tagName) {
	                            var svg = DOC.createElementNS(svgns,
	                                el.tagName.toLowerCase())
	                            ap.forEach.call(el.attributes, function(attr) {
	                                    svg.setAttribute(attr.name, attr.value) //复制属性
	                                }) // jshint ignore:line
	                                // 递归处理子节点
	                            enumerateNode(el, svg)
	                            targetNode.appendChild(svg)
	                        }
	                    }
	                }
	            }
	            Object.defineProperties(SVGElement.prototype, {
	                "outerHTML": { //IE9-11,firefox不支持SVG元素的innerHTML,outerHTML属性
	                    enumerable: true,
	                    configurable: true,
	                    get: outerHTML,
	                    set: function(html) {
	                        var tagName = this.tagName.toLowerCase(),
	                            par = this.parentNode,
	                            frag = avalon.parseHTML(html)
	                            // 操作的svg，直接插入
	                        if (tagName === "svg") {
	                            par.insertBefore(frag, this)
	                                // svg节点的子节点类似
	                        } else {
	                            var newFrag = DOC.createDocumentFragment()
	                            enumerateNode(frag, newFrag)
	                            par.insertBefore(newFrag, this)
	                        }
	                        par.removeChild(this)
	                    }
	                },
	                "innerHTML": {
	                    enumerable: true,
	                    configurable: true,
	                    get: function() {
	                        var s = this.outerHTML
	                        var ropen = new RegExp("<" + this.nodeName + '\\b(?:(["\'])[^"]*?(\\1)|[^>])*>', "i")
	                        var rclose = new RegExp("<\/" + this.nodeName + ">$", "i")
	                        return s.replace(ropen, "").replace(rclose, "")
	                    },
	                    set: function(html) {
	                        if (avalon.clearHTML) {
	                            avalon.clearHTML(this)
	                            var frag = avalon.parseHTML(html)
	                            enumerateNode(frag, this)
	                        }
	                    }
	                }
	            })
	        }
	    }
	    if (!root.outerHTML && window.HTMLElement) { //firefox 到11时才有outerHTML
	        HTMLElement.prototype.__defineGetter__("outerHTML", outerHTML);
	    }
	
	
	    //============================= event binding =======================
	    var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/
	
	    function fixEvent(event) {
	        var ret = {}
	        for (var i in event) {
	            ret[i] = event[i]
	        }
	        var target = ret.target = event.srcElement
	        if (event.type.indexOf("key") === 0) {
	            ret.which = event.charCode != null ? event.charCode : event.keyCode
	        } else if (rmouseEvent.test(event.type)) {
	            var doc = target.ownerDocument || DOC
	            var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
	            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
	            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
	            ret.wheelDeltaY = ret.wheelDelta
	            ret.wheelDeltaX = 0
	        }
	        ret.timeStamp = new Date() - 0
	        ret.originalEvent = event
	        ret.preventDefault = function() { //阻止默认行为
	            event.returnValue = false
	        }
	        ret.stopPropagation = function() { //阻止事件在DOM树中的传播
	            event.cancelBubble = true
	        }
	        return ret
	    }
	
	    var eventHooks = avalon.eventHooks
	        //针对firefox, chrome修正mouseenter, mouseleave
	    if (!("onmouseenter" in root)) {
	        avalon.each({
	            mouseenter: "mouseover",
	            mouseleave: "mouseout"
	        }, function(origType, fixType) {
	            eventHooks[origType] = {
	                type: fixType,
	                fn: function(elem, fn) {
	                    return function(e) {
	                        var t = e.relatedTarget
	                        if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
	                            delete e.type
	                            e.type = origType
	                            return fn.call(elem, e)
	                        }
	                    }
	                }
	            }
	        })
	    }
	    //针对IE9+, w3c修正animationend
	    avalon.each({
	            AnimationEvent: "animationend",
	            WebKitAnimationEvent: "webkitAnimationEnd"
	        }, function(construct, fixType) {
	            if (window[construct] && !eventHooks.animationend) {
	                eventHooks.animationend = {
	                    type: fixType
	                }
	            }
	        })
	        //针对IE6-8修正input
	    if (!("oninput" in DOC.createElement("input"))) {
	        eventHooks.input = {
	            type: "propertychange",
	            fn: function(elem, fn) {
	                return function(e) {
	                    if (e.propertyName === "value") {
	                        e.type = "input"
	                        return fn.call(elem, e)
	                    }
	                }
	            }
	        }
	    }
	    if (DOC.onmousewheel === void 0) {
	        /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
	         firefox DOMMouseScroll detail 下3 上-3
	         firefox wheel detlaY 下3 上-3
	         IE9-11 wheel deltaY 下40 上-40
	         chrome wheel deltaY 下100 上-100 */
	        var fixWheelType = DOC.onwheel !== void 0 ? "wheel" : "DOMMouseScroll"
	        var fixWheelDelta = fixWheelType === "wheel" ? "deltaY" : "detail"
	        eventHooks.mousewheel = {
	            type: fixWheelType,
	            fn: function(elem, fn) {
	                return function(e) {
	                    e.wheelDeltaY = e.wheelDelta = e[fixWheelDelta] > 0 ? -120 : 120
	                    e.wheelDeltaX = 0
	                    if (Object.defineProperty) {
	                        Object.defineProperty(e, "type", {
	                            value: "mousewheel"
	                        })
	                    }
	                    fn.call(elem, e)
	                }
	            }
	        }
	    }
	
	
	
	    /*********************************************************************
	     *                           配置系统                                 *
	     **********************************************************************/
	
	    function kernel(settings) {
	        for (var p in settings) {
	            if (!ohasOwn.call(settings, p))
	                continue
	            var val = settings[p]
	            if (typeof kernel.plugins[p] === "function") {
	                kernel.plugins[p](val)
	            } else if (typeof kernel[p] === "object") {
	                avalon.mix(kernel[p], val)
	            } else {
	                kernel[p] = val
	            }
	        }
	        return this
	    }
	    var openTag, closeTag, rexpr, rexprg, rbind, rregexp = /[-.*+?^${}()|[\]\/\\]/g
	
	    function escapeRegExp(target) {
	        //http://stevenlevithan.com/regex/xregexp/
	        //将字符串安全格式化为正则表达式的源码
	        return (target + "").replace(rregexp, "\\$&")
	    }
	
	    var plugins = {
	
	        interpolate: function(array) {
	            openTag = array[0]
	            closeTag = array[1]
	            if (openTag === closeTag) {
	                throw new SyntaxError("openTag===closeTag")
	            } else {
	                var test = openTag + "test" + closeTag
	                cinerator.innerHTML = test
	                if (cinerator.innerHTML !== test && cinerator.innerHTML.indexOf("&lt;") > -1) {
	                    throw new SyntaxError("此定界符不合法")
	                }
	                kernel.openTag = openTag
	                kernel.closeTag = closeTag
	                cinerator.innerHTML = ""
	            }
	            var o = escapeRegExp(openTag),
	                c = escapeRegExp(closeTag)
	            rexpr = new RegExp(o + "(.*?)" + c)
	            rexprg = new RegExp(o + "(.*?)" + c, "g")
	            rbind = new RegExp(o + ".*?" + c + "|\\sms-")
	        }
	    }
	
	    kernel.debug = false
	    kernel.plugins = plugins
	    kernel.plugins['interpolate'](["{{", "}}"])
	    kernel.paths = {}
	    kernel.shim = {}
	    kernel.maxRepeatSize = 100
	    avalon.config = kernel
	    var ravalon = /(\w+)\[(avalonctrl)="(\S+)"\]/
	    var findNodes = DOC.querySelectorAll ? function(str) {
	            return DOC.querySelectorAll(str)
	        } : function(str) {
	            var match = str.match(ravalon)
	            var all = DOC.getElementsByTagName(match[1])
	            var nodes = []
	            for (var i = 0, el; el = all[i++];) {
	                if (el.getAttribute(match[2]) === match[3]) {
	                    nodes.push(el)
	                }
	            }
	            return nodes
	        }
	        /*********************************************************************
	         *                            事件总线                               *
	         **********************************************************************/
	    var EventBus = {
	            $watch: function(type, callback) {
	                if (typeof callback === "function") {
	                    var callbacks = this.$events[type]
	                    if (callbacks) {
	                        callbacks.push(callback)
	                    } else {
	                        this.$events[type] = [callback]
	                    }
	                } else { //重新开始监听此VM的第一重简单属性的变动
	                    this.$events = this.$watch.backup
	                }
	                return this
	            },
	            $unwatch: function(type, callback) {
	                var n = arguments.length
	                if (n === 0) { //让此VM的所有$watch回调无效化
	                    this.$watch.backup = this.$events
	                    this.$events = {}
	                } else if (n === 1) {
	                    this.$events[type] = []
	                } else {
	                    var callbacks = this.$events[type] || []
	                    var i = callbacks.length
	                    while (~--i < 0) {
	                        if (callbacks[i] === callback) {
	                            return callbacks.splice(i, 1)
	                        }
	                    }
	                }
	                return this
	            },
	            $fire: function(type) {
	                var special, i, v, callback
	                if (/^(\w+)!(\S+)$/.test(type)) {
	                    special = RegExp.$1
	                    type = RegExp.$2
	                }
	                var events = this.$events
	                if (!events)
	                    return
	                var args = aslice.call(arguments, 1)
	                var detail = [type].concat(args)
	                if (special === "all") {
	                    for (i in avalon.vmodels) {
	                        v = avalon.vmodels[i]
	                        if (v !== this) {
	                            v.$fire.apply(v, detail)
	                        }
	                    }
	                } else if (special === "up" || special === "down") {
	                    var elements = events.expr ? findNodes(events.expr) : []
	                    if (elements.length === 0)
	                        return
	                    for (i in avalon.vmodels) {
	                        v = avalon.vmodels[i]
	                        if (v !== this) {
	                            if (v.$events.expr) {
	                                var eventNodes = findNodes(v.$events.expr)
	                                if (eventNodes.length === 0) {
	                                    continue
	                                }
	                                //循环两个vmodel中的节点，查找匹配（向上匹配或者向下匹配）的节点并设置标识
	                                /* jshint ignore:start */
	                                ap.forEach.call(eventNodes, function(node) {
	                                        ap.forEach.call(elements, function(element) {
	                                            var ok = special === "down" ? element.contains(node) : //向下捕获
	                                                node.contains(element) //向上冒泡
	                                            if (ok) {
	                                                node._avalon = v //符合条件的加一个标识
	                                            }
	                                        });
	                                    })
	                                    /* jshint ignore:end */
	                            }
	                        }
	                    }
	                    var nodes = DOC.getElementsByTagName("*") //实现节点排序
	                    var alls = []
	                    ap.forEach.call(nodes, function(el) {
	                        if (el._avalon) {
	                            alls.push(el._avalon)
	                            el._avalon = ""
	                            el.removeAttribute("_avalon")
	                        }
	                    })
	                    if (special === "up") {
	                        alls.reverse()
	                    }
	                    for (i = 0; callback = alls[i++];) {
	                        if (callback.$fire.apply(callback, detail) === false) {
	                            break
	                        }
	                    }
	                } else {
	                    var callbacks = events[type] || []
	                    var all = events.$all || []
	                    for (i = 0; callback = callbacks[i++];) {
	                        if (isFunction(callback))
	                            callback.apply(this, args)
	                    }
	                    for (i = 0; callback = all[i++];) {
	                        if (isFunction(callback))
	                            callback.apply(this, arguments)
	                    }
	                }
	            }
	        }
	        /*********************************************************************
	         *                           modelFactory                             *
	         **********************************************************************/
	        //avalon最核心的方法的两个方法之一（另一个是avalon.scan），返回一个ViewModel(VM)
	    var VMODELS = avalon.vmodels = {} //所有vmodel都储存在这里
	    avalon.define = function(id, factory) {
	        var $id = id.$id || id
	        if (!$id) {
	            log("warning: vm必须指定$id")
	        }
	        if (VMODELS[$id]) {
	                    console.log(VMODELS);
	            log("warning: " + $id + " 已经存在于avalon.vmodels中")
	        }
	        if (typeof id === "object") {
	            var model = modelFactory(id)
	        } else {
	            var scope = {
	                $watch: noop
	            }
	            factory(scope) //得到所有定义
	
	            model = modelFactory(scope) //偷天换日，将scope换为model
	            stopRepeatAssign = true
	            factory(model)
	            stopRepeatAssign = false
	        }
	        model.$id = $id
	        return VMODELS[$id] = model
	    }
	
	    //一些不需要被监听的属性
	    var $$skipArray = String("$id,$watch,$unwatch,$fire,$events,$model,$skipArray,$reinitialize").match(rword)
	    var defineProperty = Object.defineProperty
	    var canHideOwn = true
	        //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
	        //标准浏览器使用__defineGetter__, __defineSetter__实现
	    try {
	        defineProperty({}, "_", {
	            value: "x"
	        })
	        var defineProperties = Object.defineProperties
	    } catch (e) {
	        canHideOwn = false
	    }
	
	    function modelFactory(source, $special, $model) {
	        if (Array.isArray(source)) {
	            var arr = source.concat()
	            source.length = 0
	            var collection = arrayFactory(source)
	            collection.pushArray(arr)
	            return collection
	        }
	        //0 null undefined || Node || VModel(fix IE6-8 createWithProxy $val: val引发的BUG)
	        if (!source || (source.$id && source.$events) || (source.nodeType > 0 && source.nodeName)) {
	            return source
	        }
	        var $skipArray = Array.isArray(source.$skipArray) ? source.$skipArray : []
	        $skipArray.$special = $special || {} //强制要监听的属性
	        var $vmodel = {} //要返回的对象, 它在IE6-8下可能被偷龙转凤
	        $model = $model || {} //vmodels.$model属性
	        var $events = {} //vmodel.$events属性
	        var accessors = {} //监控属性
	        var computed = []
	        $$skipArray.forEach(function(name) {
	            delete source[name]
	        })
	        var names = Object.keys(source)
	            /* jshint ignore:start */
	        names.forEach(function(name, accessor) {
	                var val = source[name]
	                $model[name] = val
	                if (isObservable(name, val, $skipArray)) {
	                    //总共产生三种accessor
	                    $events[name] = []
	                    var valueType = avalon.type(val)
	                        //总共产生三种accessor
	                    if (valueType === "object" && isFunction(val.get) && Object.keys(val).length <= 2) {
	                        accessor = makeComputedAccessor(name, val)
	                        computed.push(accessor)
	                    } else if (rcomplexType.test(valueType)) {
	                        // issue #940 解决$model层次依赖丢失 https://github.com/RubyLouvre/avalon/issues/940
	                        //  $model[name] = {}
	                        accessor = makeComplexAccessor(name, val, valueType, $events[name], $model)
	                    } else {
	                        accessor = makeSimpleAccessor(name, val)
	                    }
	                    accessors[name] = accessor
	                }
	            })
	            /* jshint ignore:end */
	        $vmodel = defineProperties($vmodel, descriptorFactory(accessors), source) //生成一个空的ViewModel
	        for (var i = 0; i < names.length; i++) {
	            var name = names[i]
	            if (!accessors[name]) {
	                $vmodel[name] = source[name]
	            }
	        }
	        //添加$id, $model, $events, $watch, $unwatch, $fire
	        hideProperty($vmodel, "$id", generateID())
	        hideProperty($vmodel, "$model", $model)
	        hideProperty($vmodel, "$events", $events)
	            /* jshint ignore:start */
	        if (canHideOwn) {
	            hideProperty($vmodel, "hasOwnProperty", function(name) {
	                return name in $vmodel.$model
	            })
	        } else {
	            $vmodel.hasOwnProperty = function(name) {
	                return (name in $vmodel.$model) && (name !== "hasOwnProperty")
	            }
	        }
	        /* jshint ignore:end */
	        for (i in EventBus) {
	            hideProperty($vmodel, i, EventBus[i].bind($vmodel))
	        }
	
	        $vmodel.$reinitialize = function() {
	            computed.forEach(function(accessor) {
	                delete accessor._value
	                delete accessor.oldArgs
	                accessor.digest = function() {
	                    accessor.call($vmodel)
	                }
	                dependencyDetection.begin({
	                    callback: function(vm, dependency) { //dependency为一个accessor
	                        var name = dependency._name
	                        if (dependency !== accessor) {
	                            var list = vm.$events[name]
	                            injectDependency(list, accessor.digest)
	                        }
	                    }
	                })
	                try {
	                    accessor.get.call($vmodel)
	                } finally {
	                    dependencyDetection.end()
	                }
	            })
	        }
	        $vmodel.$reinitialize()
	        return $vmodel
	    }
	
	
	    function hideProperty(host, name, value) {
	        if (canHideOwn) {
	            Object.defineProperty(host, name, {
	                value: value,
	                writable: true,
	                enumerable: false,
	                configurable: true
	            })
	        } else {
	            host[name] = value
	        }
	    }
	    //创建一个简单访问器
	    function makeSimpleAccessor(name, value) {
	        function accessor(value) {
	            var oldValue = accessor._value
	            if (arguments.length > 0) {
	                if (!stopRepeatAssign && !isEqual(value, oldValue)) {
	                    accessor.updateValue(this, value)
	                    accessor.notify(this, value, oldValue)
	                }
	                return this
	            } else {
	                dependencyDetection.collectDependency(this, accessor)
	                return oldValue
	            }
	        }
	        accessorFactory(accessor, name)
	        accessor._value = value
	        return accessor;
	    }
	
	    //创建一个计算访问器
	    function makeComputedAccessor(name, options) {
	        function accessor(value) { //计算属性
	            var oldValue = accessor._value
	            var init = ("_value" in accessor)
	            if (arguments.length > 0) {
	                if (stopRepeatAssign) {
	                    return this
	                }
	                if (typeof accessor.set === "function") {
	                    if (accessor.oldArgs !== value) {
	                        accessor.oldArgs = value
	                        var $events = this.$events
	                        var lock = $events[name]
	                        $events[name] = [] //清空回调，防止内部冒泡而触发多次$fire
	                        accessor.set.call(this, value)
	                        $events[name] = lock
	                        value = accessor.get.call(this)
	                        if (value !== oldValue) {
	                            accessor.updateValue(this, value)
	                            accessor.notify(this, value, oldValue) //触发$watch回调
	                        }
	                    }
	                }
	                return this
	            } else {
	                //将依赖于自己的高层访问器或视图刷新函数（以绑定对象形式）放到自己的订阅数组中
	                //将自己注入到低层访问器的订阅数组中
	                value = accessor.get.call(this)
	                accessor.updateValue(this, value)
	                if (init && oldValue !== value) {
	                    accessor.notify(this, value, oldValue) //触发$watch回调
	                }
	                return value
	            }
	        }
	        accessor.set = options.set
	        accessor.get = options.get
	        accessorFactory(accessor, name)
	        return accessor
	    }
	
	    //创建一个复杂访问器
	    function makeComplexAccessor(name, initValue, valueType, list, parentModel) {
	
	        function accessor(value) {
	            var oldValue = accessor._value
	
	            var son = accessor._vmodel
	            if (arguments.length > 0) {
	                if (stopRepeatAssign) {
	                    return this
	                }
	                if (valueType === "array") {
	                    var a = son,
	                        b = value,
	                        an = a.length,
	                        bn = b.length
	                    a.$lock = true
	                    if (an > bn) {
	                        a.splice(bn, an - bn)
	                    } else if (bn > an) {
	                        a.push.apply(a, b.slice(an))
	                    }
	                    var n = Math.min(an, bn)
	                    for (var i = 0; i < n; i++) {
	                        a.set(i, b[i])
	                    }
	                    delete a.$lock
	                    a._fire("set")
	                } else if (valueType === "object") {
	                    value = value.$model ? value.$model : value
	                    var observes = this.$events[name] || []
	                    var newObject = avalon.mix(true, {}, value)
	                    for (i in son) {
	                        if (son.hasOwnProperty(i) && ohasOwn.call(newObject, i)) {
	                            son[i] = newObject[i]
	                        }
	                    }
	                    son = accessor._vmodel = modelFactory(value)
	                    son.$events[subscribers] = observes
	                    if (observes.length) {
	                        observes.forEach(function(data) {
	                            if (!data.type) {
	                                return //数据未准备好时忽略更新
	                            }
	                            if (data.rollback) {
	                                data.rollback() //还原 ms-with ms-on
	                            }
	                            bindingHandlers[data.type](data, data.vmodels)
	                        })
	                    }
	                }
	                accessor.updateValue(this, son.$model)
	                accessor.notify(this, this._value, oldValue)
	                return this
	            } else {
	                dependencyDetection.collectDependency(this, accessor)
	                return son
	            }
	        }
	        accessorFactory(accessor, name)
	        if (Array.isArray(initValue)) {
	            parentModel[name] = initValue
	        } else {
	            parentModel[name] = parentModel[name] || {}
	        }
	        var son = accessor._vmodel = modelFactory(initValue, 0, parentModel[name])
	        son.$events[subscribers] = list
	        return accessor
	    }
	
	    function globalUpdateValue(vmodel, value) {
	        vmodel.$model[this._name] = this._value = value
	    }
	
	    function globalNotify(vmodel, value, oldValue) {
	        var name = this._name
	        var array = vmodel.$events[name] //刷新值
	        if (array) {
	            fireDependencies(array) //同步视图
	            EventBus.$fire.call(vmodel, name, value, oldValue) //触发$watch回调
	        }
	    }
	
	    function accessorFactory(accessor, name) {
	        accessor._name = name
	            //同时更新_value与model
	        accessor.updateValue = globalUpdateValue
	        accessor.notify = globalNotify
	    }
	
	    //比较两个值是否相等
	    var isEqual = Object.is || function(v1, v2) {
	        if (v1 === 0 && v2 === 0) {
	            return 1 / v1 === 1 / v2
	        } else if (v1 !== v1) {
	            return v2 !== v2
	        } else {
	            return v1 === v2
	        }
	    }
	
	    function isObservable(name, value, $skipArray) {
	        if (isFunction(value) || value && value.nodeName && (value.nodeType > 0)) {
	            return false
	        }
	        if ($skipArray.indexOf(name) !== -1) {
	            return false
	        }
	        var $special = $skipArray.$special
	        if (name && name.charAt(0) === "$" && !$special[name]) {
	            return false
	        }
	        return true
	    }
	
	    function keysVM(obj) {
	        var arr = Object.keys(obj.$model ? obj.$model : obj)
	        for (var i = 0; i < $$skipArray.length; i++) {
	            var index = arr.indexOf($$skipArray[i])
	            if (index !== -1) {
	                arr.splice(index, 1)
	            }
	        }
	        return arr
	    }
	    var descriptorFactory = W3C ? function(obj) {
	        var descriptors = {}
	        for (var i in obj) {
	            descriptors[i] = {
	                get: obj[i],
	                set: obj[i],
	                enumerable: true,
	                configurable: true
	            }
	        }
	        return descriptors
	    } : function(a) {
	        return a
	    }
	
	    //===================修复浏览器对Object.defineProperties的支持=================
	    if (!canHideOwn) {
	        if ("__defineGetter__" in avalon) {
	            defineProperty = function(obj, prop, desc) {
	                if ('value' in desc) {
	                    obj[prop] = desc.value
	                }
	                if ("get" in desc) {
	                    obj.__defineGetter__(prop, desc.get)
	                }
	                if ('set' in desc) {
	                    obj.__defineSetter__(prop, desc.set)
	                }
	                return obj
	            }
	            defineProperties = function(obj, descs) {
	                for (var prop in descs) {
	                    if (descs.hasOwnProperty(prop)) {
	                        defineProperty(obj, prop, descs[prop])
	                    }
	                }
	                return obj
	            }
	        }
	        if (IEVersion) {
	            var VBClassPool = {}
	            window.execScript([ // jshint ignore:line
	                "Function parseVB(code)",
	                "\tExecuteGlobal(code)",
	                "End Function" //转换一段文本为VB代码
	            ].join("\n"), "VBScript")
	
	            function VBMediator(instance, accessors, name, value) { // jshint ignore:line
	                var accessor = accessors[name]
	                if (arguments.length === 4) {
	                    accessor.call(instance, value)
	                } else {
	                    return accessor.call(instance)
	                }
	            }
	            defineProperties = function(name, accessors, properties) {
	                // jshint ignore:line
	                var buffer = []
	                buffer.push(
	                        "\r\n\tPrivate [__data__], [__proxy__]",
	                        "\tPublic Default Function [__const__](d" + expose + ", p" + expose + ")",
	                        "\t\tSet [__data__] = d" + expose + ": set [__proxy__] = p" + expose,
	                        "\t\tSet [__const__] = Me", //链式调用
	                        "\tEnd Function")
	                    //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	                for (name in properties) {
	                    if (!accessors.hasOwnProperty(name)) {
	                        buffer.push("\tPublic [" + name + "]")
	                    }
	                }
	                $$skipArray.forEach(function(name) {
	                    if (!accessors.hasOwnProperty(name)) {
	                        buffer.push("\tPublic [" + name + "]")
	                    }
	                })
	                buffer.push("\tPublic [" + 'hasOwnProperty' + "]")
	                    //添加访问器属性 
	                for (name in accessors) {
	                    buffer.push(
	                        //由于不知对方会传入什么,因此set, let都用上
	                        "\tPublic Property Let [" + name + "](val" + expose + ")", //setter
	                        "\t\tCall [__proxy__](Me,[__data__], \"" + name + "\", val" + expose + ")",
	                        "\tEnd Property",
	                        "\tPublic Property Set [" + name + "](val" + expose + ")", //setter
	                        "\t\tCall [__proxy__](Me,[__data__], \"" + name + "\", val" + expose + ")",
	                        "\tEnd Property",
	                        "\tPublic Property Get [" + name + "]", //getter
	                        "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
	                        "\t\tSet[" + name + "] = [__proxy__](Me,[__data__],\"" + name + "\")",
	                        "\tIf Err.Number <> 0 Then",
	                        "\t\t[" + name + "] = [__proxy__](Me,[__data__],\"" + name + "\")",
	                        "\tEnd If",
	                        "\tOn Error Goto 0",
	                        "\tEnd Property")
	
	                }
	
	                buffer.push("End Class")
	                var body = buffer.join("\r\n")
	                var className = VBClassPool[body]
	                if (!className) {
	                    className = generateID("VBClass")
	                    window.parseVB("Class " + className + body)
	                    window.parseVB([
	                        "Function " + className + "Factory(a, b)", //创建实例并传入两个关键的参数
	                        "\tDim o",
	                        "\tSet o = (New " + className + ")(a, b)",
	                        "\tSet " + className + "Factory = o",
	                        "End Function"
	                    ].join("\r\n"))
	                    VBClassPool[body] = className
	                }
	                var ret = window[className + "Factory"](accessors, VBMediator) //得到其产品
	                return ret //得到其产品
	            }
	        }
	    }
	
	    /*********************************************************************
	     *          监控数组（与ms-each, ms-repeat配合使用）                     *
	     **********************************************************************/
	
	    function arrayFactory(model) {
	        var array = []
	        array.$id = generateID()
	        array.$model = model //数据模型
	        array.$events = {}
	        array.$events[subscribers] = []
	        array._ = modelFactory({
	            length: model.length
	        })
	        array._.$watch("length", function(a, b) {
	            array.$fire("length", a, b)
	        })
	        for (var i in EventBus) {
	            array[i] = EventBus[i]
	        }
	        avalon.mix(array, arrayPrototype)
	        return array
	    }
	
	    function mutateArray(method, pos, n, index, method2, pos2, n2) {
	        var oldLen = this.length,
	            loop = 2
	        while (--loop) {
	            switch (method) {
	                case "add":
	                    /* jshint ignore:start */
	                    var array = this.$model.slice(pos, pos + n).map(function(el) {
	                            if (rcomplexType.test(avalon.type(el))) {
	                                return el.$id ? el : modelFactory(el, 0, el)
	                            } else {
	                                return el
	                            }
	                        })
	                        /* jshint ignore:end */
	                    _splice.apply(this, [pos, 0].concat(array))
	                    this._fire("add", pos, n)
	                    break
	                case "del":
	                    var ret = this._splice(pos, n)
	                    this._fire("del", pos, n)
	                    break
	            }
	            if (method2) {
	                method = method2
	                pos = pos2
	                n = n2
	                loop = 2
	                method2 = 0
	            }
	        }
	        this._fire("index", index)
	        if (this.length !== oldLen) {
	            this._.length = this.length
	        }
	        return ret
	    }
	
	    var _splice = ap.splice
	    var arrayPrototype = {
	            _splice: _splice,
	            _fire: function(method, a, b) {
	                fireDependencies(this.$events[subscribers], method, a, b)
	            },
	            size: function() { //取得数组长度，这个函数可以同步视图，length不能
	                return this._.length
	            },
	            pushArray: function(array) {
	                var m = array.length,
	                    n = this.length
	                if (m) {
	                    ap.push.apply(this.$model, array)
	                    mutateArray.call(this, "add", n, m, Math.max(0, n - 1))
	                }
	                return m + n
	            },
	            push: function() {
	                //http://jsperf.com/closure-with-arguments
	                var array = []
	                var i, n = arguments.length
	                for (i = 0; i < n; i++) {
	                    array[i] = arguments[i]
	                }
	                return this.pushArray(array)
	            },
	            unshift: function() {
	                var m = arguments.length,
	                    n = this.length
	                if (m) {
	                    ap.unshift.apply(this.$model, arguments)
	                    mutateArray.call(this, "add", 0, m, 0)
	                }
	                return m + n //IE67的unshift不会返回长度
	            },
	            shift: function() {
	                if (this.length) {
	                    var el = this.$model.shift()
	                    mutateArray.call(this, "del", 0, 1, 0)
	                    return el //返回被移除的元素
	                }
	            },
	            pop: function() {
	                var n = this.length
	                if (n) {
	                    var el = this.$model.pop()
	                    mutateArray.call(this, "del", n - 1, 1, Math.max(0, n - 2))
	                    return el //返回被移除的元素
	                }
	            },
	            splice: function(start) {
	                var m = arguments.length,
	                    args = [],
	                    change
	                var removed = _splice.apply(this.$model, arguments)
	                if (removed.length) { //如果用户删掉了元素
	                    args.push("del", start, removed.length, 0)
	                    change = true
	                }
	                if (m > 2) { //如果用户添加了元素
	                    if (change) {
	                        args.splice(3, 1, 0, "add", start, m - 2)
	                    } else {
	                        args.push("add", start, m - 2, 0)
	                    }
	                    change = true
	                }
	                if (change) { //返回被移除的元素
	                    return mutateArray.apply(this, args)
	                } else {
	                    return []
	                }
	            },
	            contains: function(el) { //判定是否包含
	                return this.indexOf(el) !== -1
	            },
	            remove: function(el) { //移除第一个等于给定值的元素
	                return this.removeAt(this.indexOf(el))
	            },
	            removeAt: function(index) { //移除指定索引上的元素
	                if (index >= 0) {
	                    this.$model.splice(index, 1)
	                    return mutateArray.call(this, "del", index, 1, 0)
	                }
	                return []
	            },
	            clear: function() {
	                this.$model.length = this.length = this._.length = 0 //清空数组
	                this._fire("clear", 0)
	                return this
	            },
	            removeAll: function(all) { //移除N个元素
	                if (Array.isArray(all)) {
	                    for (var i = this.length - 1; i >= 0; i--) {
	                        if (all.indexOf(this[i]) !== -1) {
	                            this.removeAt(i)
	                        }
	                    }
	                } else if (typeof all === "function") {
	                    for (i = this.length - 1; i >= 0; i--) {
	                        var el = this[i]
	                        if (all(el, i)) {
	                            this.removeAt(i)
	                        }
	                    }
	                } else {
	                    this.clear()
	                }
	            },
	            ensure: function(el) {
	                if (!this.contains(el)) { //只有不存在才push
	                    this.push(el)
	                }
	                return this
	            },
	            set: function(index, val) {
	                if (index < this.length && index > -1) {
	                    var valueType = avalon.type(val)
	                    if (val && val.$model) {
	                        val = val.$model
	                    }
	                    var target = this[index]
	                    if (valueType === "object") {
	                        for (var i in val) {
	                            if (target.hasOwnProperty(i)) {
	                                target[i] = val[i]
	                            }
	                        }
	                    } else if (valueType === "array") {
	                        target.clear().push.apply(target, val)
	                    } else if (target !== val) {
	                        this[index] = val
	                        this.$model[index] = val
	                        this._fire("set", index, val)
	                    }
	                }
	                return this
	            }
	        }
	        //相当于原来bindingExecutors.repeat 的index分支
	    function resetIndex(array, pos) {
	        var last = array.length - 1
	        for (var el; el = array[pos]; pos++) {
	            el.$index = pos
	            el.$first = pos === 0
	            el.$last = pos === last
	        }
	    }
	
	    function sortByIndex(array, indexes) {
	        var map = {};
	        for (var i = 0, n = indexes.length; i < n; i++) {
	            map[i] = array[i] // preserve
	            var j = indexes[i]
	            if (j in map) {
	                array[i] = map[j]
	                delete map[j]
	            } else {
	                array[i] = array[j]
	            }
	        }
	    }
	
	    "sort,reverse".replace(rword, function(method) {
	        arrayPrototype[method] = function() {
	            var newArray = this.$model //这是要排序的新数组
	            var oldArray = newArray.concat() //保持原来状态的旧数组
	            var mask = Math.random()
	            var indexes = []
	            var hasSort
	            ap[method].apply(newArray, arguments) //排序
	            for (var i = 0, n = oldArray.length; i < n; i++) {
	                var neo = newArray[i]
	                var old = oldArray[i]
	                if (isEqual(neo, old)) {
	                    indexes.push(i)
	                } else {
	                    var index = oldArray.indexOf(neo)
	                    indexes.push(index) //得到新数组的每个元素在旧数组对应的位置
	                    oldArray[index] = mask //屏蔽已经找过的元素
	                    hasSort = true
	                }
	            }
	            if (hasSort) {
	                sortByIndex(this, indexes)
	                    // sortByIndex(this.$proxy, indexes)
	                this._fire("move", indexes)
	                this._fire("index", 0)
	            }
	            return this
	        }
	    })
	
	
	    /*********************************************************************
	     *                           依赖调度系统                             *
	     **********************************************************************/
	    //检测两个对象间的依赖关系
	    var dependencyDetection = (function() {
	            var outerFrames = []
	            var currentFrame
	            return {
	                begin: function(accessorObject) {
	                    //accessorObject为一个拥有callback的对象
	                    outerFrames.push(currentFrame)
	                    currentFrame = accessorObject
	                },
	                end: function() {
	                    currentFrame = outerFrames.pop()
	                },
	                collectDependency: function(vmodel, accessor) {
	                    if (currentFrame) {
	                        //被dependencyDetection.begin调用
	                        currentFrame.callback(vmodel, accessor);
	                    }
	                }
	            };
	        })()
	        //将绑定对象注入到其依赖项的订阅数组中
	    var ronduplex = /^(duplex|on)$/
	    avalon.injectBinding = function(data) {
	        var valueFn = data.evaluator
	        if (valueFn) { //如果是求值函数
	            dependencyDetection.begin({
	                callback: function(vmodel, dependency) {
	                    injectDependency(vmodel.$events[dependency._name], data)
	                }
	            })
	            try {
	                var value = ronduplex.test(data.type) ? data : valueFn.apply(0, data.args)
	                if (value === void 0) {
	                    delete data.evaluator
	                }
	                if (data.handler) {
	                    data.handler(value, data.element, data)
	                }
	            } catch (e) {
	                log("warning:exception throwed in [avalon.injectBinding] ", e)
	                delete data.evaluator
	                var node = data.element
	                if (node && node.nodeType === 3) {
	                    var parent = node.parentNode
	                    if (kernel.commentInterpolate) {
	                        parent.replaceChild(DOC.createComment(data.value), node)
	                    } else {
	                        node.data = openTag + (data.oneTime ? "::" : "") + data.value + closeTag
	                    }
	                }
	            } finally {
	                dependencyDetection.end()
	            }
	        }
	    }
	
	    //将依赖项(比它高层的访问器或构建视图刷新函数的绑定对象)注入到订阅者数组 
	    function injectDependency(list, data) {
	        if (data.oneTime)
	            return
	        if (list && avalon.Array.ensure(list, data) && data.element) {
	            injectDisposeQueue(data, list)
	            if (new Date() - beginTime > 444) {
	                rejectDisposeQueue()
	            }
	        }
	    }
	
	    //通知依赖于这个访问器的订阅者更新自身
	    function fireDependencies(list) {
	        if (list && list.length) {
	            if (new Date() - beginTime > 444 && typeof list[0] === "object") {
	                rejectDisposeQueue()
	            }
	            var args = aslice.call(arguments, 1)
	            for (var i = list.length, fn; fn = list[--i];) {
	                var el = fn.element
	                if (el && el.parentNode) {
	                    try {
	                        var valueFn = fn.evaluator
	                        if (fn.$repeat) {
	                            fn.handler.apply(fn, args) //处理监控数组的方法
	                        } else if ("$repeat" in fn || !valueFn) { //如果没有eval,先eval
	                            bindingHandlers[fn.type](fn, fn.vmodels)
	                        } else if (fn.type !== "on") { //事件绑定只能由用户触发,不能由程序触发
	                            var value = valueFn.apply(0, fn.args || [])
	                            fn.handler(value, el, fn)
	                        }
	                    } catch (e) {
	                        console.log(e)
	                    }
	                }
	            }
	        }
	    }
	    /*********************************************************************
	     *                          定时GC回收机制                             *
	     **********************************************************************/
	    var disposeCount = 0
	    var disposeQueue = avalon.$$subscribers = []
	    var beginTime = new Date()
	    var oldInfo = {}
	        //var uuid2Node = {}
	    function getUid(elem, makeID) { //IE9+,标准浏览器
	        if (!elem.uuid && !makeID) {
	            elem.uuid = ++disposeCount
	        }
	        return elem.uuid
	    }
	
	    //添加到回收列队中
	    function injectDisposeQueue(data, list) {
	        var elem = data.element
	        if (!data.uuid) {
	            if (elem.nodeType !== 1) {
	                data.uuid = data.type + getUid(elem.parentNode) + "-" + (++disposeCount)
	            } else {
	                data.uuid = data.name + "-" + getUid(elem)
	            }
	        }
	        var lists = data.lists || (data.lists = [])
	        avalon.Array.ensure(lists, list)
	        list.$uuid = list.$uuid || generateID()
	        if (!disposeQueue[data.uuid]) {
	            disposeQueue[data.uuid] = 1
	            disposeQueue.push(data)
	        }
	    }
	
	    function rejectDisposeQueue(data) {
	        if (avalon.optimize)
	            return
	        var i = disposeQueue.length
	        var n = i
	        var allTypes = []
	        var iffishTypes = {}
	        var newInfo = {}
	            //对页面上所有绑定对象进行分门别类, 只检测个数发生变化的类型
	        while (data = disposeQueue[--i]) {
	            var type = data.type
	            if (newInfo[type]) {
	                newInfo[type]++
	            } else {
	                newInfo[type] = 1
	                allTypes.push(type)
	            }
	        }
	        var diff = false
	        allTypes.forEach(function(type) {
	            if (oldInfo[type] !== newInfo[type]) {
	                iffishTypes[type] = 1
	                diff = true
	            }
	        })
	        i = n
	        if (diff) {
	            while (data = disposeQueue[--i]) {
	                if (data.element === null) {
	                    disposeQueue.splice(i, 1)
	                    continue
	                }
	                if (iffishTypes[data.type] && shouldDispose(data.element)) { //如果它没有在DOM树
	                    disposeQueue.splice(i, 1)
	                    delete disposeQueue[data.uuid]
	                        //delete uuid2Node[data.element.uuid]
	                    var lists = data.lists
	                    for (var k = 0, list; list = lists[k++];) {
	                        avalon.Array.remove(lists, list)
	                        avalon.Array.remove(list, data)
	                    }
	                    disposeData(data)
	                }
	            }
	        }
	        oldInfo = newInfo
	        beginTime = new Date()
	    }
	
	    function disposeData(data) {
	        delete disposeQueue[data.uuid] // 先清除，不然无法回收了
	        data.element = null
	        data.rollback && data.rollback()
	        for (var key in data) {
	            data[key] = null
	        }
	    }
	
	    function shouldDispose(el) {
	        try { //IE下，如果文本节点脱离DOM树，访问parentNode会报错
	            var fireError = el.parentNode.nodeType
	        } catch (e) {
	            return true
	        }
	        if (el.ifRemove) {
	            // 如果节点被放到ifGroup，才移除
	            if (!root.contains(el.ifRemove) && (ifGroup === el.parentNode)) {
	                el.parentNode && el.parentNode.removeChild(el)
	                return true
	            }
	        }
	        return el.msRetain ? 0 : (el.nodeType === 1 ? !root.contains(el) : !avalon.contains(root, el))
	    }
	
	    /************************************************************************
	     *            HTML处理(parseHTML, innerHTML, clearHTML)                  *
	     ************************************************************************/
	    // We have to close these tags to support XHTML 
	    var tagHooks = {
	        area: [1, "<map>", "</map>"],
	        param: [1, "<object>", "</object>"],
	        col: [2, "<table><colgroup>", "</colgroup></table>"],
	        legend: [1, "<fieldset>", "</fieldset>"],
	        option: [1, "<select multiple='multiple'>", "</select>"],
	        thead: [1, "<table>", "</table>"],
	        tr: [2, "<table>", "</table>"],
	        td: [3, "<table><tr>", "</tr></table>"],
	        g: [1, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">', '</svg>'],
	        //IE6-8在用innerHTML生成节点时，不能直接创建no-scope元素与HTML5的新标签
	        _default: W3C ? [0, "", ""] : [1, "X<div>", "</div>"] //div可以不用闭合
	    }
	    tagHooks.th = tagHooks.td
	    tagHooks.optgroup = tagHooks.option
	    tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead
	    String("circle,defs,ellipse,image,line,path,polygon,polyline,rect,symbol,text,use").replace(rword, function(tag) {
	        tagHooks[tag] = tagHooks.g //处理SVG
	    })
	    var rtagName = /<([\w:]+)/ //取得其tagName
	    var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig
	    var rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig
	    var scriptTypes = oneObject(["", "text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript"])
	    var rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/ //需要处理套嵌关系的标签
	    var script = DOC.createElement("script")
	    var rhtml = /<|&#?\w+;/
	    avalon.parseHTML = function(html) {
	        var fragment = avalonFragment.cloneNode(false)
	        if (typeof html !== "string") {
	            return fragment
	        }
	        if (!rhtml.test(html)) {
	            fragment.appendChild(DOC.createTextNode(html))
	            return fragment
	        }
	        html = html.replace(rxhtml, "<$1></$2>").trim()
	        var tag = (rtagName.exec(html) || ["", ""])[1].toLowerCase(),
	            //取得其标签名
	            wrap = tagHooks[tag] || tagHooks._default,
	            wrapper = cinerator,
	            firstChild, neo
	        if (!W3C) { //fix IE
	            html = html.replace(rcreate, "<br class=msNoScope>$1") //在link style script等标签之前添加一个补丁
	        }
	        wrapper.innerHTML = wrap[1] + html + wrap[2]
	        var els = wrapper.getElementsByTagName("script")
	        if (els.length) { //使用innerHTML生成的script节点不会发出请求与执行text属性
	            for (var i = 0, el; el = els[i++];) {
	                if (scriptTypes[el.type]) {
	                    //以偷龙转凤方式恢复执行脚本功能
	                    neo = script.cloneNode(false) //FF不能省略参数
	                    ap.forEach.call(el.attributes, function(attr) {
	                            if (attr && attr.specified) {
	                                neo[attr.name] = attr.value //复制其属性
	                                neo.setAttribute(attr.name, attr.value)
	                            }
	                        }) // jshint ignore:line
	                    neo.text = el.text
	                    el.parentNode.replaceChild(neo, el) //替换节点
	                }
	            }
	        }
	        if (!W3C) { //fix IE
	            var target = wrap[1] === "X<div>" ? wrapper.lastChild.firstChild : wrapper.lastChild
	            if (target && target.tagName === "TABLE" && tag !== "tbody") {
	                //IE6-7处理 <thead> --> <thead>,<tbody>
	                //<tfoot> --> <tfoot>,<tbody>
	                //<table> --> <table><tbody></table>
	                for (els = target.childNodes, i = 0; el = els[i++];) {
	                    if (el.tagName === "TBODY" && !el.innerHTML) {
	                        target.removeChild(el)
	                        break
	                    }
	                }
	            }
	            els = wrapper.getElementsByTagName("br")
	            var n = els.length
	            while (el = els[--n]) {
	                if (el.className === "msNoScope") {
	                    el.parentNode.removeChild(el)
	                }
	            }
	            for (els = wrapper.all, i = 0; el = els[i++];) { //fix VML
	                if (isVML(el)) {
	                    fixVML(el)
	                }
	            }
	        }
	        //移除我们为了符合套嵌关系而添加的标签
	        for (i = wrap[0]; i--; wrapper = wrapper.lastChild) {}
	        while (firstChild = wrapper.firstChild) { // 将wrapper上的节点转移到文档碎片上！
	            fragment.appendChild(firstChild)
	        }
	        return fragment
	    }
	
	    function isVML(src) {
	        var nodeName = src.nodeName
	        return nodeName.toLowerCase() === nodeName && src.scopeName && src.outerText === ""
	    }
	
	    function fixVML(node) {
	        if (node.currentStyle.behavior !== "url(#default#VML)") {
	            node.style.behavior = "url(#default#VML)"
	            node.style.display = "inline-block"
	            node.style.zoom = 1 //hasLayout
	        }
	    }
	    avalon.innerHTML = function(node, html) {
	        if (!W3C && (!rcreate.test(html) && !rnest.test(html))) {
	            try {
	                node.innerHTML = html
	                return
	            } catch (e) {}
	        }
	        var a = this.parseHTML(html)
	        this.clearHTML(node).appendChild(a)
	    }
	    avalon.clearHTML = function(node) {
	        node.textContent = ""
	        while (node.firstChild) {
	            node.removeChild(node.firstChild)
	        }
	        return node
	    }
	
	    /*********************************************************************
	     *                  avalon的原型方法定义区                            *
	     **********************************************************************/
	
	    function hyphen(target) {
	        //转换为连字符线风格
	        return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase()
	    }
	
	    function camelize(target) {
	        //提前判断，提高getStyle等的效率
	        if (!target || target.indexOf("-") < 0 && target.indexOf("_") < 0) {
	            return target
	        }
	        //转换为驼峰风格
	        return target.replace(/[-_][^-_]/g, function(match) {
	            return match.charAt(1).toUpperCase()
	        })
	    }
	
	    var fakeClassListMethods = {
	        _toString: function() {
	            var node = this.node
	            var cls = node.className
	            var str = typeof cls === "string" ? cls : cls.baseVal
	            return str.split(/\s+/).join(" ")
	        },
	        _contains: function(cls) {
	            return (" " + this + " ").indexOf(" " + cls + " ") > -1
	        },
	        _add: function(cls) {
	            if (!this.contains(cls)) {
	                this._set(this + " " + cls)
	            }
	        },
	        _remove: function(cls) {
	            this._set((" " + this + " ").replace(" " + cls + " ", " "))
	        },
	        __set: function(cls) {
	                cls = cls.trim()
	                var node = this.node
	                if (rsvg.test(node)) {
	                    //SVG元素的className是一个对象 SVGAnimatedString { baseVal="", animVal=""}，只能通过set/getAttribute操作
	                    node.setAttribute("class", cls)
	                } else {
	                    node.className = cls
	                }
	            } //toggle存在版本差异，因此不使用它
	    }
	
	    function fakeClassList(node) {
	        if (!("classList" in node)) {
	            node.classList = {
	                node: node
	            }
	            for (var k in fakeClassListMethods) {
	                node.classList[k.slice(1)] = fakeClassListMethods[k]
	            }
	        }
	        return node.classList
	    }
	
	
	    "add,remove".replace(rword, function(method) {
	        avalon.fn[method + "Class"] = function(cls) {
	            var el = this[0]
	                //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
	            if (cls && typeof cls === "string" && el && el.nodeType === 1) {
	                cls.replace(/\S+/g, function(c) {
	                    fakeClassList(el)[method](c)
	                })
	            }
	            return this
	        }
	    })
	    avalon.fn.mix({
	        hasClass: function(cls) {
	            var el = this[0] || {}
	            return el.nodeType === 1 && fakeClassList(el).contains(cls)
	        },
	        toggleClass: function(value, stateVal) {
	            var className, i = 0
	            var classNames = String(value).split(/\s+/)
	            var isBool = typeof stateVal === "boolean"
	            while ((className = classNames[i++])) {
	                var state = isBool ? stateVal : !this.hasClass(className)
	                this[state ? "addClass" : "removeClass"](className)
	            }
	            return this
	        },
	        attr: function(name, value) {
	            if (arguments.length === 2) {
	                this[0].setAttribute(name, value)
	                return this
	            } else {
	                return this[0].getAttribute(name)
	            }
	        },
	        data: function(name, value) {
	            name = "data-" + hyphen(name || "")
	            switch (arguments.length) {
	                case 2:
	                    this.attr(name, value)
	                    return this
	                case 1:
	                    var val = this.attr(name)
	                    return parseData(val)
	                case 0:
	                    var ret = {}
	                    ap.forEach.call(this[0].attributes, function(attr) {
	                        if (attr) {
	                            name = attr.name
	                            if (!name.indexOf("data-")) {
	                                name = camelize(name.slice(5))
	                                ret[name] = parseData(attr.value)
	                            }
	                        }
	                    })
	                    return ret
	            }
	        },
	        removeData: function(name) {
	            name = "data-" + hyphen(name)
	            this[0].removeAttribute(name)
	            return this
	        },
	        css: function(name, value) {
	            if (avalon.isPlainObject(name)) {
	                for (var i in name) {
	                    avalon.css(this, i, name[i])
	                }
	            } else {
	                var ret = avalon.css(this, name, value)
	            }
	            return ret !== void 0 ? ret : this
	        },
	        position: function() {
	            var offsetParent, offset,
	                elem = this[0],
	                parentOffset = {
	                    top: 0,
	                    left: 0
	                }
	            if (!elem) {
	                return
	            }
	            if (this.css("position") === "fixed") {
	                offset = elem.getBoundingClientRect()
	            } else {
	                offsetParent = this.offsetParent() //得到真正的offsetParent
	                offset = this.offset() // 得到正确的offsetParent
	                if (offsetParent[0].tagName !== "HTML") {
	                    parentOffset = offsetParent.offset()
	                }
	                parentOffset.top += avalon.css(offsetParent[0], "borderTopWidth", true)
	                parentOffset.left += avalon.css(offsetParent[0], "borderLeftWidth", true)
	
	                // Subtract offsetParent scroll positions
	                parentOffset.top -= offsetParent.scrollTop()
	                parentOffset.left -= offsetParent.scrollLeft()
	            }
	            return {
	                top: offset.top - parentOffset.top - avalon.css(elem, "marginTop", true),
	                left: offset.left - parentOffset.left - avalon.css(elem, "marginLeft", true)
	            }
	        },
	        offsetParent: function() {
	            var offsetParent = this[0].offsetParent
	            while (offsetParent && avalon.css(offsetParent, "position") === "static") {
	                offsetParent = offsetParent.offsetParent;
	            }
	            return avalon(offsetParent || root)
	        },
	        bind: function(type, fn, phase) {
	            if (this[0]) { //此方法不会链
	                return avalon.bind(this[0], type, fn, phase)
	            }
	        },
	        unbind: function(type, fn, phase) {
	            if (this[0]) {
	                avalon.unbind(this[0], type, fn, phase)
	            }
	            return this
	        },
	        val: function(value) {
	            var node = this[0]
	            if (node && node.nodeType === 1) {
	                var get = arguments.length === 0
	                var access = get ? ":get" : ":set"
	                var fn = valHooks[getValType(node) + access]
	                if (fn) {
	                    var val = fn(node, value)
	                } else if (get) {
	                    return (node.value || "").replace(/\r/g, "")
	                } else {
	                    node.value = value
	                }
	            }
	            return get ? val : this
	        }
	    })
	
	    function parseData(data) {
	        try {
	            if (typeof data === "object")
	                return data
	            data = data === "true" ? true :
	                data === "false" ? false :
	                data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? avalon.parseJSON(data) : data
	        } catch (e) {}
	        return data
	    }
	    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	        rvalidchars = /^[\],:{}\s]*$/,
	        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g
	    avalon.parseJSON = window.JSON ? JSON.parse : function(data) {
	        if (typeof data === "string") {
	            data = data.trim();
	            if (data) {
	                if (rvalidchars.test(data.replace(rvalidescape, "@")
	                        .replace(rvalidtokens, "]")
	                        .replace(rvalidbraces, ""))) {
	                    return (new Function("return " + data))() // jshint ignore:line
	                }
	            }
	            avalon.error("Invalid JSON: " + data)
	        }
	        return data
	    }
	    avalon.fireDom = function(elem, type, opts) {
	        if (DOC.createEvent) {
	            var hackEvent = DOC.createEvent("Events");
	            hackEvent.initEvent(type, true, true)
	            avalon.mix(hackEvent, opts)
	            elem.dispatchEvent(hackEvent)
	        } else {
	            try {
	                hackEvent = DOC.createEventObject()
	                avalon.mix(hackEvent, opts)
	                elem.fireEvent("on" + type, hackEvent)
	            } catch (e) { //IE6-8触发事件必须保证在DOM树中,否则报"SCRIPT16389: 未指明的错误"
	            }
	        }
	    }
	
	    //生成avalon.fn.scrollLeft, avalon.fn.scrollTop方法
	    avalon.each({
	        scrollLeft: "pageXOffset",
	        scrollTop: "pageYOffset"
	    }, function(method, prop) {
	        avalon.fn[method] = function(val) {
	            var node = this[0] || {},
	                win = getWindow(node),
	                top = method === "scrollTop"
	            if (!arguments.length) {
	                return win ? (prop in win) ? win[prop] : root[method] : node[method]
	            } else {
	                if (win) {
	                    win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
	                } else {
	                    node[method] = val
	                }
	            }
	        }
	    })
	
	    function getWindow(node) {
	        return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
	    }
	    //=============================css相关=======================
	    var cssHooks = avalon.cssHooks = {}
	    var prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"]
	    var cssMap = {
	        "float": W3C ? "cssFloat" : "styleFloat"
	    }
	    avalon.cssNumber = oneObject("animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom")
	
	    avalon.cssName = function(name, host, camelCase) {
	        if (cssMap[name]) {
	            return cssMap[name]
	        }
	        host = host || root.style
	        for (var i = 0, n = prefixes.length; i < n; i++) {
	            camelCase = camelize(prefixes[i] + name)
	            if (camelCase in host) {
	                return (cssMap[name] = camelCase)
	            }
	        }
	        return null
	    }
	    cssHooks["@:set"] = function(node, name, value) {
	        try { //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine 在旧式IE下会抛异常
	            node.style[name] = value
	        } catch (e) {}
	    }
	    if (window.getComputedStyle) {
	        cssHooks["@:get"] = function(node, name) {
	            if (!node || !node.style) {
	                throw new Error("getComputedStyle要求传入一个节点 " + node)
	            }
	            var ret, styles = getComputedStyle(node, null)
	            if (styles) {
	                ret = name === "filter" ? styles.getPropertyValue(name) : styles[name]
	                if (ret === "") {
	                    ret = node.style[name] //其他浏览器需要我们手动取内联样式
	                }
	            }
	            return ret
	        }
	        cssHooks["opacity:get"] = function(node) {
	            var ret = cssHooks["@:get"](node, "opacity")
	            return ret === "" ? "1" : ret
	        }
	    } else {
	        var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
	        var rposition = /^(top|right|bottom|left)$/
	        var ralpha = /alpha\([^)]*\)/i
	        var ie8 = !!window.XDomainRequest
	        var salpha = "DXImageTransform.Microsoft.Alpha"
	        var border = {
	            thin: ie8 ? '1px' : '2px',
	            medium: ie8 ? '3px' : '4px',
	            thick: ie8 ? '5px' : '6px'
	        }
	        cssHooks["@:get"] = function(node, name) {
	            //取得精确值，不过它有可能是带em,pc,mm,pt,%等单位
	            var currentStyle = node.currentStyle
	            var ret = currentStyle[name]
	            if ((rnumnonpx.test(ret) && !rposition.test(ret))) {
	                //①，保存原有的style.left, runtimeStyle.left,
	                var style = node.style,
	                    left = style.left,
	                    rsLeft = node.runtimeStyle.left
	                    //②由于③处的style.left = xxx会影响到currentStyle.left，
	                    //因此把它currentStyle.left放到runtimeStyle.left，
	                    //runtimeStyle.left拥有最高优先级，不会style.left影响
	                node.runtimeStyle.left = currentStyle.left
	                    //③将精确值赋给到style.left，然后通过IE的另一个私有属性 style.pixelLeft
	                    //得到单位为px的结果；fontSize的分支见http://bugs.jquery.com/ticket/760
	                style.left = name === 'fontSize' ? '1em' : (ret || 0)
	                ret = style.pixelLeft + "px"
	                    //④还原 style.left，runtimeStyle.left
	                style.left = left
	                node.runtimeStyle.left = rsLeft
	            }
	            if (ret === "medium") {
	                name = name.replace("Width", "Style")
	                    //border width 默认值为medium，即使其为0"
	                if (currentStyle[name] === "none") {
	                    ret = "0px"
	                }
	            }
	            return ret === "" ? "auto" : border[ret] || ret
	        }
	        cssHooks["opacity:set"] = function(node, name, value) {
	            var style = node.style
	            var opacity = isFinite(value) && value <= 1 ? "alpha(opacity=" + value * 100 + ")" : ""
	            var filter = style.filter || "";
	            style.zoom = 1
	                //不能使用以下方式设置透明度
	                //node.filters.alpha.opacity = value * 100
	            style.filter = (ralpha.test(filter) ?
	                filter.replace(ralpha, opacity) :
	                filter + " " + opacity).trim()
	            if (!style.filter) {
	                style.removeAttribute("filter")
	            }
	        }
	        cssHooks["opacity:get"] = function(node) {
	            //这是最快的获取IE透明值的方式，不需要动用正则了！
	            var alpha = node.filters.alpha || node.filters[salpha],
	                op = alpha && alpha.enabled ? alpha.opacity : 100
	            return (op / 100) + "" //确保返回的是字符串
	        }
	    }
	
	    "top,left".replace(rword, function(name) {
	        cssHooks[name + ":get"] = function(node) {
	            var computed = cssHooks["@:get"](node, name)
	            return /px$/.test(computed) ? computed :
	                avalon(node).position()[name] + "px"
	        }
	    })
	
	    var cssShow = {
	        position: "absolute",
	        visibility: "hidden",
	        display: "block"
	    }
	
	    var rdisplayswap = /^(none|table(?!-c[ea]).+)/
	
	    function showHidden(node, array) {
	        //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
	        if (node.offsetWidth <= 0) { //opera.offsetWidth可能小于0
	            if (rdisplayswap.test(cssHooks["@:get"](node, "display"))) {
	                var obj = {
	                    node: node
	                }
	                for (var name in cssShow) {
	                    obj[name] = node.style[name]
	                    node.style[name] = cssShow[name]
	                }
	                array.push(obj)
	            }
	            var parent = node.parentNode
	            if (parent && parent.nodeType === 1) {
	                showHidden(parent, array)
	            }
	        }
	    }
	    "Width,Height".replace(rword, function(name) { //fix 481
	        var method = name.toLowerCase(),
	            clientProp = "client" + name,
	            scrollProp = "scroll" + name,
	            offsetProp = "offset" + name
	        cssHooks[method + ":get"] = function(node, which, override) {
	            var boxSizing = -4
	            if (typeof override === "number") {
	                boxSizing = override
	            }
	            which = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"]
	            var ret = node[offsetProp] // border-box 0
	            if (boxSizing === 2) { // margin-box 2
	                return ret + avalon.css(node, "margin" + which[0], true) + avalon.css(node, "margin" + which[1], true)
	            }
	            if (boxSizing < 0) { // padding-box  -2
	                ret = ret - avalon.css(node, "border" + which[0] + "Width", true) - avalon.css(node, "border" + which[1] + "Width", true)
	            }
	            if (boxSizing === -4) { // content-box -4
	                ret = ret - avalon.css(node, "padding" + which[0], true) - avalon.css(node, "padding" + which[1], true)
	            }
	            return ret
	        }
	        cssHooks[method + "&get"] = function(node) {
	            var hidden = [];
	            showHidden(node, hidden);
	            var val = cssHooks[method + ":get"](node)
	            for (var i = 0, obj; obj = hidden[i++];) {
	                node = obj.node
	                for (var n in obj) {
	                    if (typeof obj[n] === "string") {
	                        node.style[n] = obj[n]
	                    }
	                }
	            }
	            return val;
	        }
	        avalon.fn[method] = function(value) { //会忽视其display
	            var node = this[0]
	            if (arguments.length === 0) {
	                if (node.setTimeout) { //取得窗口尺寸,IE9后可以用node.innerWidth /innerHeight代替
	                    return node["inner" + name] || node.document.documentElement[clientProp] ||
	                        node.document.body[clientProp] //IE6下前两个分别为undefine,0
	                }
	                if (node.nodeType === 9) { //取得页面尺寸
	                    var doc = node.documentElement
	                        //FF chrome    html.scrollHeight< body.scrollHeight
	                        //IE 标准模式 : html.scrollHeight> body.scrollHeight
	                        //IE 怪异模式 : html.scrollHeight 最大等于可视窗口多一点？
	                    return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
	                }
	                return cssHooks[method + "&get"](node)
	            } else {
	                return this.css(method, value)
	            }
	        }
	        avalon.fn["inner" + name] = function() {
	            return cssHooks[method + ":get"](this[0], void 0, -2)
	        }
	        avalon.fn["outer" + name] = function(includeMargin) {
	            return cssHooks[method + ":get"](this[0], void 0, includeMargin === true ? 2 : 0)
	        }
	    })
	    avalon.fn.offset = function() { //取得距离页面左右角的坐标
	        var node = this[0],
	            box = {
	                left: 0,
	                top: 0
	            }
	        if (!node || !node.tagName || !node.ownerDocument) {
	            return box
	        }
	        var doc = node.ownerDocument,
	            body = doc.body,
	            root = doc.documentElement,
	            win = doc.defaultView || doc.parentWindow
	        if (!avalon.contains(root, node)) {
	            return box
	        }
	        //http://hkom.blog1.fc2.com/?mode=m&no=750 body的偏移量是不包含margin的
	        //我们可以通过getBoundingClientRect来获得元素相对于client的rect.
	        //http://msdn.microsoft.com/en-us/library/ms536433.aspx
	        if (node.getBoundingClientRect) {
	            box = node.getBoundingClientRect() // BlackBerry 5, iOS 3 (original iPhone)
	        }
	        //chrome/IE6: body.scrollTop, firefox/other: root.scrollTop
	        var clientTop = root.clientTop || body.clientTop,
	            clientLeft = root.clientLeft || body.clientLeft,
	            scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
	            scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft)
	            // 把滚动距离加到left,top中去。
	            // IE一些版本中会自动为HTML元素加上2px的border，我们需要去掉它
	            // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
	        return {
	            top: box.top + scrollTop - clientTop,
	            left: box.left + scrollLeft - clientLeft
	        }
	    }
	
	    //==================================val相关============================
	
	    function getValType(elem) {
	        var ret = elem.tagName.toLowerCase()
	        return ret === "input" && /checkbox|radio/.test(elem.type) ? "checked" : ret
	    }
	    var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
	    var valHooks = {
	        "option:get": IEVersion ? function(node) {
	            //在IE11及W3C，如果没有指定value，那么node.value默认为node.text（存在trim作），但IE9-10则是取innerHTML(没trim操作)
	            //specified并不可靠，因此通过分析outerHTML判定用户有没有显示定义value
	            return roption.test(node.outerHTML) ? node.value : node.text.trim()
	        } : function(node) {
	            return node.value
	        },
	        "select:get": function(node, value) {
	            var option, options = node.options,
	                index = node.selectedIndex,
	                getter = valHooks["option:get"],
	                one = node.type === "select-one" || index < 0,
	                values = one ? null : [],
	                max = one ? index + 1 : options.length,
	                i = index < 0 ? max : one ? index : 0
	            for (; i < max; i++) {
	                option = options[i]
	                    //旧式IE在reset后不会改变selected，需要改用i === index判定
	                    //我们过滤所有disabled的option元素，但在safari5下，如果设置select为disable，那么其所有孩子都disable
	                    //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
	                if ((option.selected || i === index) && !option.disabled) {
	                    value = getter(option)
	                    if (one) {
	                        return value
	                    }
	                    //收集所有selected值组成数组返回
	                    values.push(value)
	                }
	            }
	            return values
	        },
	        "select:set": function(node, values, optionSet) {
	            values = [].concat(values) //强制转换为数组
	            var getter = valHooks["option:get"]
	            for (var i = 0, el; el = node.options[i++];) {
	                if ((el.selected = values.indexOf(getter(el)) > -1)) {
	                    optionSet = true
	                }
	            }
	            if (!optionSet) {
	                node.selectedIndex = -1
	            }
	        }
	    }
	
	    /*********************************************************************
	     *                          编译系统                                  *
	     **********************************************************************/
	    var meta = {
	        '\b': '\\b',
	        '\t': '\\t',
	        '\n': '\\n',
	        '\f': '\\f',
	        '\r': '\\r',
	        '"': '\\"',
	        '\\': '\\\\'
	    }
	    var quote = window.JSON && JSON.stringify || function(str) {
	        return '"' + str.replace(/[\\\"\x00-\x1f]/g, function(a) {
	            var c = meta[a];
	            return typeof c === 'string' ? c :
	                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"'
	    }
	
	    var keywords = [
	        "break,case,catch,continue,debugger,default,delete,do,else,false",
	        "finally,for,function,if,in,instanceof,new,null,return,switch,this",
	        "throw,true,try,typeof,var,void,while,with", /* 关键字*/
	        "abstract,boolean,byte,char,class,const,double,enum,export,extends",
	        "final,float,goto,implements,import,int,interface,long,native",
	        "package,private,protected,public,short,static,super,synchronized",
	        "throws,transient,volatile", /*保留字*/
	        "arguments,let,yield,undefined" /* ECMA 5 - use strict*/
	    ].join(",")
	    var rrexpstr = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g
	    var rsplit = /[^\w$]+/g
	    var rkeywords = new RegExp(["\\b" + keywords.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g')
	    var rnumber = /\b\d[^,]*/g
	    var rcomma = /^,+|,+$/g
	    var variablePool = new Cache(512)
	    var getVariables = function(code) {
	            var key = "," + code.trim()
	            var ret = variablePool.get(key)
	            if (ret) {
	                return ret
	            }
	            var match = code
	                .replace(rrexpstr, "")
	                .replace(rsplit, ",")
	                .replace(rkeywords, "")
	                .replace(rnumber, "")
	                .replace(rcomma, "")
	                .split(/^$|,+/)
	            return variablePool.put(key, uniqSet(match))
	        }
	        /*添加赋值语句*/
	
	    function addAssign(vars, scope, name, data) {
	        var ret = [],
	            prefix = " = " + name + "."
	        for (var i = vars.length, prop; prop = vars[--i];) {
	            if (scope.hasOwnProperty(prop)) {
	                ret.push(prop + prefix + prop)
	                data.vars.push(prop)
	                if (data.type === "duplex") {
	                    vars.get = name + "." + prop
	                }
	                vars.splice(i, 1)
	            }
	        }
	        return ret
	    }
	
	    function uniqSet(array) {
	        var ret = [],
	            unique = {}
	        for (var i = 0; i < array.length; i++) {
	            var el = array[i]
	            var id = el && typeof el.$id === "string" ? el.$id : el
	            if (!unique[id]) {
	                unique[id] = ret.push(el)
	            }
	        }
	        return ret
	    }
	    //缓存求值函数，以便多次利用
	    var evaluatorPool = new Cache(128)
	        //取得求值函数及其传参
	    var rduplex = /\w\[.*\]|\w\.\w/
	    var rproxy = /(\$proxy\$[a-z]+)\d+$/
	    var rthimRightParentheses = /\)\s*$/
	    var rthimOtherParentheses = /\)\s*\|/g
	    var rquoteFilterName = /\|\s*([$\w]+)/g
	    var rpatchBracket = /"\s*\["/g
	    var rthimLeftParentheses = /"\s*\(/g
	
	    function parseFilter(val, filters) {
	        filters = filters
	            .replace(rthimRightParentheses, "") //处理最后的小括号
	            .replace(rthimOtherParentheses, function() { //处理其他小括号
	                return "],|"
	            })
	            .replace(rquoteFilterName, function(a, b) { //处理|及它后面的过滤器的名字
	                return "[" + quote(b)
	            })
	            .replace(rpatchBracket, function() {
	                return '"],["'
	            })
	            .replace(rthimLeftParentheses, function() {
	                return '",'
	            }) + "]"
	        return "return this.filters.$filter(" + val + ", " + filters + ")"
	    }
	
	    function parseExpr(code, scopes, data) {
	        var dataType = data.type
	        var filters = data.filters || ""
	        var exprId = scopes.map(function(el) {
	            return String(el.$id).replace(rproxy, "$1")
	        }) + code + dataType + filters
	        var vars = getVariables(code).concat(),
	            assigns = [],
	            names = [],
	            args = [],
	            prefix = ""
	            //args 是一个对象数组， names 是将要生成的求值函数的参数
	        scopes = uniqSet(scopes)
	        data.vars = []
	        for (var i = 0, sn = scopes.length; i < sn; i++) {
	            if (vars.length) {
	                var name = "vm" + expose + "_" + i
	                names.push(name)
	                args.push(scopes[i])
	                assigns.push.apply(assigns, addAssign(vars, scopes[i], name, data))
	            }
	        }
	        if (!assigns.length && dataType === "duplex") {
	            return
	        }
	        if (dataType !== "duplex" && (code.indexOf("||") > -1 || code.indexOf("&&") > -1)) {
	            //https://github.com/RubyLouvre/avalon/issues/583
	            data.vars.forEach(function(v) {
	                var reg = new RegExp("\\b" + v + "(?:\\.\\w+|\\[\\w+\\])+", "ig")
	                code = code.replace(reg, function(_, cap) {
	                    var c = _.charAt(v.length)
	                        //var r = IEVersion ? code.slice(arguments[1] + _.length) : RegExp.rightContext
	                        //https://github.com/RubyLouvre/avalon/issues/966
	                    var r = code.slice(cap + _.length)
	                    var method = /^\s*\(/.test(r)
	                    if (c === "." || c === "[" || method) { //比如v为aa,我们只匹配aa.bb,aa[cc],不匹配aaa.xxx
	                        var name = "var" + String(Math.random()).replace(/^0\./, "")
	                        if (method) { //array.size()
	                            var array = _.split(".")
	                            if (array.length > 2) {
	                                var last = array.pop()
	                                assigns.push(name + " = " + array.join("."))
	                                return name + "." + last
	                            } else {
	                                return _
	                            }
	                        }
	                        assigns.push(name + " = " + _)
	                        return name
	                    } else {
	                        return _
	                    }
	                })
	            })
	        }
	        //---------------args----------------
	        data.args = args
	            //---------------cache----------------
	        delete data.vars
	        var fn = evaluatorPool.get(exprId) //直接从缓存，免得重复生成
	        if (fn) {
	            data.evaluator = fn
	            return
	        }
	        prefix = assigns.join(", ")
	        if (prefix) {
	            prefix = "var " + prefix
	        }
	        if (/\S/.test(filters)) { //文本绑定，双工绑定才有过滤器
	            if (!/text|html/.test(data.type)) {
	                throw Error("ms-" + data.type + "不支持过滤器")
	            }
	            code = "\nvar ret" + expose + " = " + code + ";\r\n"
	            code += parseFilter("ret" + expose, filters)
	            try {
	                fn = Function.apply(noop, names.concat("'use strict';\n" + prefix + code))
	                data.evaluator = evaluatorPool.put(exprId, function() {
	                    return fn.apply(avalon, arguments) //确保可以在编译代码中使用this获取avalon对象
	                })
	            } catch (e) {
	                log("debug: parse error," + e.message)
	            }
	            vars = assigns = names = null //释放内存
	            return
	        } else if (dataType === "duplex") { //双工绑定
	            var _body = "'use strict';\nreturn function(vvv){\n\t" +
	                prefix +
	                ";\n\tif(!arguments.length){\n\t\treturn " +
	                code +
	                "\n\t}\n\t" + (!rduplex.test(code) ? vars.get : code) +
	                "= vvv;\n} "
	            try {
	                fn = Function.apply(noop, names.concat(_body))
	                data.evaluator = evaluatorPool.put(exprId, fn)
	            } catch (e) {
	                log("debug: parse error," + e.message)
	            }
	            vars = assigns = names = null //释放内存
	            return
	        } else if (dataType === "on") { //事件绑定
	            if (code.indexOf("(") === -1) {
	                code += ".call(this, $event)"
	            } else {
	                code = code.replace("(", ".call(this,")
	            }
	            names.push("$event")
	            code = "\nreturn " + code + ";" //IE全家 Function("return ")出错，需要Function("return ;")
	            var lastIndex = code.lastIndexOf("\nreturn")
	            var header = code.slice(0, lastIndex)
	            var footer = code.slice(lastIndex)
	            code = header + "\n" + footer
	        } else { //其他绑定
	            code = "\nreturn " + code + ";" //IE全家 Function("return ")出错，需要Function("return ;")
	        }
	        try {
	            fn = Function.apply(noop, names.concat("'use strict';\n" + prefix + code))
	            data.evaluator = evaluatorPool.put(exprId, fn)
	        } catch (e) {
	            log("debug: parse error," + e.message)
	        }
	        vars = assigns = names = null //释放内存
	    }
	
	    function stringifyExpr(code) {
	        var hasExpr = rexpr.test(code) //比如ms-class="width{{w}}"的情况
	        if (hasExpr) {
	            var array = scanExpr(code)
	            if (array.length === 1) {
	                return array[0].value
	            }
	            return array.map(function(el) {
	                return el.expr ? "(" + el.value + ")" : quote(el.value)
	            }).join(" + ")
	        } else {
	            return code
	        }
	    }
	    //parseExpr的智能引用代理
	
	    function parseExprProxy(code, scopes, data, noRegister) {
	        code = code || "" //code 可能未定义
	        parseExpr(code, scopes, data)
	        if (data.evaluator && !noRegister) {
	            data.handler = bindingExecutors[data.handlerName || data.type]
	                //方便调试
	                //这里非常重要,我们通过判定视图刷新函数的element是否在DOM树决定
	                //将它移出订阅者列表
	            avalon.injectBinding(data)
	        }
	    }
	    avalon.parseExprProxy = parseExprProxy
	        /*********************************************************************
	         *                           扫描系统                                 *
	         **********************************************************************/
	
	    avalon.scan = function(elem, vmodel) {
	        elem = elem || root
	        var vmodels = vmodel ? [].concat(vmodel) : []
	        scanTag(elem, vmodels)
	    }
	
	    //http://www.w3.org/TR/html5/syntax.html#void-elements
	    var stopScan = oneObject("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,script,style,textarea".toUpperCase())
	
	    function checkScan(elem, callback, innerHTML) {
	        var id = setTimeout(function() {
	            var currHTML = elem.innerHTML
	            clearTimeout(id)
	            if (currHTML === innerHTML) {
	                callback()
	            } else {
	                checkScan(elem, callback, currHTML)
	            }
	        })
	    }
	
	
	    function createSignalTower(elem, vmodel) {
	        var id = elem.getAttribute("avalonctrl") || vmodel.$id
	        elem.setAttribute("avalonctrl", id)
	        vmodel.$events.expr = elem.tagName + '[avalonctrl="' + id + '"]'
	    }
	
	    var getBindingCallback = function(elem, name, vmodels) {
	        var callback = elem.getAttribute(name)
	        if (callback) {
	            for (var i = 0, vm; vm = vmodels[i++];) {
	                if (vm.hasOwnProperty(callback) && typeof vm[callback] === "function") {
	                    return vm[callback]
	                }
	            }
	        }
	    }
	
	    function executeBindings(bindings, vmodels) {
	        for (var i = 0, data; data = bindings[i++];) {
	            data.vmodels = vmodels
	            bindingHandlers[data.type](data, vmodels)
	            if (data.evaluator && data.element && data.element.nodeType === 1) { //移除数据绑定，防止被二次解析
	                //chrome使用removeAttributeNode移除不存在的特性节点时会报错 https://github.com/RubyLouvre/avalon/issues/99
	                data.element.removeAttribute(data.name)
	            }
	        }
	        bindings.length = 0
	    }
	
	    //https://github.com/RubyLouvre/avalon/issues/636
	    var mergeTextNodes = IEVersion && window.MutationObserver ? function(elem) {
	        var node = elem.firstChild,
	            text
	        while (node) {
	            var aaa = node.nextSibling
	            if (node.nodeType === 3) {
	                if (text) {
	                    text.nodeValue += node.nodeValue
	                    elem.removeChild(node)
	                } else {
	                    text = node
	                }
	            } else {
	                text = null
	            }
	            node = aaa
	        }
	    } : 0
	    var roneTime = /^\s*::/
	    var rmsAttr = /ms-(\w+)-?(.*)/
	    var priorityMap = {
	        "if": 10,
	        "repeat": 90,
	        "data": 100,
	        "widget": 110,
	        "each": 1400,
	        "with": 1500,
	        "duplex": 2000,
	        "on": 3000
	    }
	
	    var events = oneObject("animationend,blur,change,input,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit")
	    var obsoleteAttrs = oneObject("value,title,alt,checked,selected,disabled,readonly,enabled")
	
	    function bindingSorter(a, b) {
	        return a.priority - b.priority
	    }
	
	    function scanAttr(elem, vmodels, match) {
	        var scanNode = true
	        if (vmodels.length) {
	            var attributes = getAttributes ? getAttributes(elem) : elem.attributes
	            var bindings = []
	            var fixAttrs = []
	            var msData = {}
	            var uniq = {}
	            for (var i = 0, attr; attr = attributes[i++];) {
	                if (attr.specified) {
	                    if (match = attr.name.match(rmsAttr)) {
	                        //如果是以指定前缀命名的
	                        var type = match[1]
	                        var param = match[2] || ""
	                        var value = attr.value
	                        var name = attr.name
	                        if (uniq[name]) { //IE8下ms-repeat,ms-with BUG
	                            continue
	                        }
	                        uniq[name] = 1
	                        if (events[type]) {
	                            param = type
	                            type = "on"
	                        } else if (obsoleteAttrs[type]) {
	                            if (type === "enabled") { //吃掉ms-enabled绑定,用ms-disabled代替
	                                log("warning!ms-enabled或ms-attr-enabled已经被废弃")
	                                type = "disabled"
	                                value = "!(" + value + ")"
	                            }
	                            param = type
	                            type = "attr"
	                            name = "ms-" + type + "-" + param
	                            fixAttrs.push([attr.name, name, value])
	                        }
	                        msData[name] = value
	                        if (typeof bindingHandlers[type] === "function") {
	                            var newValue = value.replace(roneTime, "")
	                            var oneTime = value !== newValue
	                            var binding = {
	                                type: type,
	                                param: param,
	                                element: elem,
	                                name: name,
	                                value: newValue,
	                                oneTime: oneTime,
	                                uuid: name + "-" + getUid(elem),
	                                //chrome与firefox下Number(param)得到的值不一样 #855
	                                priority: (priorityMap[type] || type.charCodeAt(0) * 10) + (Number(param.replace(/\D/g, "")) || 0)
	                            }
	                            if (type === "html" || type === "text") {
	                                var token = getToken(value)
	                                avalon.mix(binding, token)
	                                binding.filters = binding.filters.replace(rhasHtml, function() {
	                                        binding.type = "html"
	                                        binding.group = 1
	                                        return ""
	                                    }) // jshint ignore:line
	                            } else if (type === "duplex") {
	                                var hasDuplex = name
	                            } else if (name === "ms-if-loop") {
	                                binding.priority += 100
	                            }
	                            bindings.push(binding)
	                            if (type === "widget") {
	                                elem.msData = elem.msData || msData
	                            }
	                        }
	                    }
	                }
	            }
	            if (bindings.length) {
	                bindings.sort(bindingSorter)
	                fixAttrs.forEach(function(arr) {
	                        log("warning!请改用" + arr[1] + "代替" + arr[0] + "!")
	                        elem.removeAttribute(arr[0])
	                        elem.setAttribute(arr[1], arr[2])
	                    })
	                    //http://bugs.jquery.com/ticket/7071
	                    //在IE下对VML读取type属性,会让此元素所有属性都变成<Failed>
	                if (hasDuplex && msData["ms-attr-value"] && !elem.scopeName && elem.type === "text") {
	                    log("warning!一个控件不能同时定义ms-attr-value与" + hasDuplex)
	                }
	                for (i = 0; binding = bindings[i]; i++) {
	                    type = binding.type
	                    if (rnoscanAttrBinding.test(type)) {
	                        return executeBindings(bindings.slice(0, i + 1), vmodels)
	                    } else if (scanNode) {
	                        scanNode = !rnoscanNodeBinding.test(type)
	                    }
	                }
	                executeBindings(bindings, vmodels)
	            }
	        }
	        if (scanNode && !stopScan[elem.tagName] && rbind.test(elem.innerHTML.replace(rlt, "<").replace(rgt, ">"))) {
	            mergeTextNodes && mergeTextNodes(elem)
	            scanNodeList(elem, vmodels) //扫描子孙元素
	        }
	    }
	    var rnoscanAttrBinding = /^if|widget|repeat$/
	    var rnoscanNodeBinding = /^each|with|html|include$/
	        //IE67下，在循环绑定中，一个节点如果是通过cloneNode得到，自定义属性的specified为false，无法进入里面的分支，
	        //但如果我们去掉scanAttr中的attr.specified检测，一个元素会有80+个特性节点（因为它不区分固有属性与自定义属性），很容易卡死页面
	    if (!W3C) {
	        var attrPool = new Cache(512)
	        var rattrs = /\s+(ms-[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g,
	            rquote = /^['"]/,
	            rtag = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/i,
	            ramp = /&amp;/g
	            //IE6-8解析HTML5新标签，会将它分解两个元素节点与一个文本节点
	            //<body><section>ddd</section></body>
	            //        window.onload = function() {
	            //            var body = document.body
	            //            for (var i = 0, el; el = body.children[i++]; ) {
	            //                avalon.log(el.outerHTML)
	            //            }
	            //        }
	            //依次输出<SECTION>, </SECTION>
	        var getAttributes = function(elem) {
	            var html = elem.outerHTML
	                //处理IE6-8解析HTML5新标签的情况，及<br>等半闭合标签outerHTML为空的情况
	            if (html.slice(0, 2) === "</" || !html.trim()) {
	                return []
	            }
	            var str = html.match(rtag)[0]
	            var attributes = [],
	                match,
	                k, v
	            var ret = attrPool.get(str)
	            if (ret) {
	                return ret
	            }
	            while (k = rattrs.exec(str)) {
	                v = k[2]
	                if (v) {
	                    v = (rquote.test(v) ? v.slice(1, -1) : v).replace(ramp, "&")
	                }
	                var name = k[1].toLowerCase()
	                match = name.match(rmsAttr)
	                var binding = {
	                    name: name,
	                    specified: true,
	                    value: v || ""
	                }
	                attributes.push(binding)
	            }
	            return attrPool.put(str, attributes)
	        }
	    }
	
	    function scanNodeList(parent, vmodels) {
	        var nodes = avalon.slice(parent.childNodes)
	        scanNodeArray(nodes, vmodels)
	    }
	
	    function scanNodeArray(nodes, vmodels) {
	        for (var i = 0, node; node = nodes[i++];) {
	            switch (node.nodeType) {
	                case 1:
	                    scanTag(node, vmodels) //扫描元素节点
	                    if (node.msCallback) {
	                        node.msCallback()
	                        node.msCallback = void 0
	                    }
	                    break
	                case 3:
	                    if (rexpr.test(node.nodeValue)) {
	                        scanText(node, vmodels, i) //扫描文本节点
	                    }
	                    break
	            }
	        }
	    }
	
	
	    function scanTag(elem, vmodels, node) {
	        //扫描顺序  ms-skip(0) --> ms-important(1) --> ms-controller(2) --> ms-if(10) --> ms-repeat(100) 
	        //--> ms-if-loop(110) --> ms-attr(970) ...--> ms-each(1400)-->ms-with(1500)--〉ms-duplex(2000)垫后
	        var a = elem.getAttribute("ms-skip")
	            //#360 在旧式IE中 Object标签在引入Flash等资源时,可能出现没有getAttributeNode,innerHTML的情形
	        if (!elem.getAttributeNode) {
	            return log("warning " + elem.tagName + " no getAttributeNode method")
	        }
	        var b = elem.getAttributeNode("ms-important")
	        var c = elem.getAttributeNode("ms-controller")
	        if (typeof a === "string") {
	            return
	        } else if (node = b || c) {
	            var newVmodel = avalon.vmodels[node.value]
	            if (!newVmodel) {
	                return
	            }
	            //ms-important不包含父VM，ms-controller相反
	            vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels)
	            var name = node.name
	            elem.removeAttribute(name) //removeAttributeNode不会刷新[ms-controller]样式规则
	            avalon(elem).removeClass(name)
	            createSignalTower(elem, newVmodel)
	        }
	        scanAttr(elem, vmodels) //扫描特性节点
	    }
	    var rhasHtml = /\|\s*html(?:\b|$)/,
	        r11a = /\|\|/g,
	        rlt = /&lt;/g,
	        rgt = /&gt;/g,
	        rstringLiteral = /(['"])(\\\1|.)+?\1/g
	
	    function getToken(value) {
	        if (value.indexOf("|") > 0) {
	            var scapegoat = value.replace(rstringLiteral, function(_) {
	                return Array(_.length + 1).join("1") // jshint ignore:line
	            })
	            var index = scapegoat.replace(r11a, "\u1122\u3344").indexOf("|") //干掉所有短路或
	            if (index > -1) {
	                return {
	                    filters: value.slice(index),
	                    value: value.slice(0, index),
	                    expr: true
	                }
	            }
	        }
	        return {
	            value: value,
	            filters: "",
	            expr: true
	        }
	    }
	
	    function scanExpr(str) {
	        var tokens = [],
	            value, start = 0,
	            stop
	        do {
	            stop = str.indexOf(openTag, start)
	            if (stop === -1) {
	                break
	            }
	            value = str.slice(start, stop)
	            if (value) { // {{ 左边的文本
	                tokens.push({
	                    value: value,
	                    filters: "",
	                    expr: false
	                })
	            }
	            start = stop + openTag.length
	            stop = str.indexOf(closeTag, start)
	            if (stop === -1) {
	                break
	            }
	            value = str.slice(start, stop)
	            if (value) { //处理{{ }}插值表达式
	                tokens.push(getToken(value))
	            }
	            start = stop + closeTag.length
	        } while (1)
	        value = str.slice(start)
	        if (value) { //}} 右边的文本
	            tokens.push({
	                value: value,
	                expr: false,
	                filters: ""
	            })
	        }
	        return tokens
	    }
	
	    function scanText(textNode, vmodels) {
	        var bindings = [],
	            tokens = scanExpr(textNode.data)
	        if (tokens.length) {
	            for (var i = 0, token; token = tokens[i++];) {
	                var node = DOC.createTextNode(token.value) //将文本转换为文本节点，并替换原来的文本节点
	                if (token.expr) {
	                    token.value = token.value.replace(roneTime, function() {
	                            token.oneTime = true
	                            return ""
	                        }) // jshint ignore:line
	                    token.type = "text"
	                    token.element = node
	                    token.filters = token.filters.replace(rhasHtml, function(a, b, c) {
	                            token.type = "html"
	                            return ""
	                        }) // jshint ignore:line
	                    bindings.push(token) //收集带有插值表达式的文本
	                }
	                avalonFragment.appendChild(node)
	            }
	            textNode.parentNode.replaceChild(avalonFragment, textNode)
	            if (bindings.length)
	                executeBindings(bindings, vmodels)
	        }
	    }
	
	    var bools = ["autofocus,autoplay,async,allowTransparency,checked,controls",
	        "declare,disabled,defer,defaultChecked,defaultSelected",
	        "contentEditable,isMap,loop,multiple,noHref,noResize,noShade",
	        "open,readOnly,selected"
	    ].join(",")
	    var boolMap = {}
	    bools.replace(rword, function(name) {
	        boolMap[name.toLowerCase()] = name
	    })
	
	    var propMap = { //属性名映射
	        "accept-charset": "acceptCharset",
	        "char": "ch",
	        "charoff": "chOff",
	        "class": "className",
	        "for": "htmlFor",
	        "http-equiv": "httpEquiv"
	    }
	
	    var anomaly = ["accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan",
	        "dateTime,defaultValue,frameBorder,longDesc,maxLength,marginWidth,marginHeight",
	        "rowSpan,tabIndex,useMap,vSpace,valueType,vAlign"
	    ].join(",")
	    anomaly.replace(rword, function(name) {
	        propMap[name.toLowerCase()] = name
	    })
	
	    var rnoscripts = /<noscript.*?>(?:[\s\S]+?)<\/noscript>/img
	    var rnoscriptText = /<noscript.*?>([\s\S]+?)<\/noscript>/im
	
	    var getXHR = function() {
	        return new(window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP") // jshint ignore:line
	    }
	
	    var templatePool = avalon.templateCache = {}
	
	    bindingHandlers.attr = function(data, vmodels) {
	        var value = stringifyExpr(data.value.trim())
	        if (data.type === "include") {
	            var elem = data.element
	            data.includeRendered = getBindingCallback(elem, "data-include-rendered", vmodels)
	            data.includeLoaded = getBindingCallback(elem, "data-include-loaded", vmodels)
	            var outer = data.includeReplace = !!avalon(elem).data("includeReplace")
	            if (avalon(elem).data("includeCache")) {
	                data.templateCache = {}
	            }
	            data.startInclude = DOC.createComment("ms-include")
	            data.endInclude = DOC.createComment("ms-include-end")
	            if (outer) {
	                data.element = data.startInclude
	                elem.parentNode.insertBefore(data.startInclude, elem)
	                elem.parentNode.insertBefore(data.endInclude, elem.nextSibling)
	            } else {
	                elem.insertBefore(data.startInclude, elem.firstChild)
	                elem.appendChild(data.endInclude)
	            }
	        }
	        data.handlerName = "attr" //handleName用于处理多种绑定共用同一种bindingExecutor的情况
	        parseExprProxy(value, vmodels, data)
	    }
	
	    bindingExecutors.attr = function(val, elem, data) {
	        var method = data.type,
	            attrName = data.param
	        if (method === "css") {
	            avalon(elem).css(attrName, val)
	        } else if (method === "attr") {
	
	            // ms-attr-class="xxx" vm.xxx="aaa bbb ccc"将元素的className设置为aaa bbb ccc
	            // ms-attr-class="xxx" vm.xxx=false  清空元素的所有类名
	            // ms-attr-name="yyy"  vm.yyy="ooo" 为元素设置name属性
	            var toRemove = (val === false) || (val === null) || (val === void 0)
	
	            if (!W3C && propMap[attrName]) { //旧式IE下需要进行名字映射
	                attrName = propMap[attrName]
	            }
	            var bool = boolMap[attrName]
	            if (typeof elem[bool] === "boolean") {
	                elem[bool] = !!val //布尔属性必须使用el.xxx = true|false方式设值
	                if (!val) { //如果为false, IE全系列下相当于setAttribute(xxx,''),会影响到样式,需要进一步处理
	                    toRemove = true
	                }
	            }
	            if (toRemove) {
	                return elem.removeAttribute(attrName)
	            }
	            //SVG只能使用setAttribute(xxx, yyy), VML只能使用elem.xxx = yyy ,HTML的固有属性必须elem.xxx = yyy
	            var isInnate = rsvg.test(elem) ? false : (DOC.namespaces && isVML(elem)) ? true : attrName in elem.cloneNode(false)
	            if (isInnate) {
	                elem[attrName] = val + ""
	            } else {
	                elem.setAttribute(attrName, val)
	            }
	        } else if (method === "include" && val) {
	            var vmodels = data.vmodels
	            var rendered = data.includeRendered
	            var loaded = data.includeLoaded
	            var replace = data.includeReplace
	            var target = replace ? elem.parentNode : elem
	            var scanTemplate = function(text) {
	                if (data.vmodels === null) {
	                    return
	                }
	
	                if (loaded) {
	                    var newText = loaded.apply(target, [text].concat(vmodels))
	                    if (typeof newText === "string")
	                        text = newText
	                }
	                if (rendered) {
	                    checkScan(target, function() {
	                        rendered.call(target)
	                    }, NaN)
	                }
	                var lastID = data.includeLastID
	                if (data.templateCache && lastID && lastID !== val) {
	                    var lastTemplate = data.templateCache[lastID]
	                    if (!lastTemplate) {
	                        lastTemplate = data.templateCache[lastID] = DOC.createElement("div")
	                        ifGroup.appendChild(lastTemplate)
	                    }
	                }
	                data.includeLastID = val
	                while (data.startInclude) {
	                    var node = data.startInclude.nextSibling
	                    if (node && node !== data.endInclude) {
	                        target.removeChild(node)
	                        if (lastTemplate)
	                            lastTemplate.appendChild(node)
	                    } else {
	                        break
	                    }
	                }
	                var dom = getTemplateNodes(data, val, text)
	                var nodes = avalon.slice(dom.childNodes)
	                target.insertBefore(dom, data.endInclude)
	                scanNodeArray(nodes, vmodels)
	            }
	
	            if (data.param === "src") {
	                if (typeof templatePool[val] === "string") {
	                    avalon.nextTick(function() {
	                        scanTemplate(templatePool[val])
	                    })
	                } else if (Array.isArray(templatePool[val])) { //#805 防止在循环绑定中发出许多相同的请求
	                    templatePool[val].push(scanTemplate)
	                } else {
	                    var xhr = getXHR()
	                    xhr.onreadystatechange = function() {
	                        if (xhr.readyState === 4) {
	                            var s = xhr.status
	                            if (s >= 200 && s < 300 || s === 304 || s === 1223) {
	                                var text = xhr.responseText
	                                for (var f = 0, fn; fn = templatePool[val][f++];) {
	                                    fn(text)
	                                }
	                                templatePool[val] = text
	                            }
	                        }
	                    }
	                    templatePool[val] = [scanTemplate]
	                    xhr.open("GET", val, true)
	                    if ("withCredentials" in xhr) {
	                        xhr.withCredentials = true
	                    }
	                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
	                    xhr.send(null)
	                }
	            } else {
	                //IE系列与够新的标准浏览器支持通过ID取得元素（firefox14+）
	                //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
	                var el = val && val.nodeType === 1 ? val : DOC.getElementById(val)
	                if (el) {
	                    if (el.tagName === "NOSCRIPT" && !(el.innerHTML || el.fixIE78)) { //IE7-8 innerText,innerHTML都无法取得其内容，IE6能取得其innerHTML
	                        xhr = getXHR() //IE9-11与chrome的innerHTML会得到转义的内容，它们的innerText可以
	                        xhr.open("GET", location, false) //谢谢Nodejs 乱炖群 深圳-纯属虚构
	                        xhr.send(null)
	                            //http://bbs.csdn.net/topics/390349046?page=1#post-393492653
	                        var noscripts = DOC.getElementsByTagName("noscript")
	                        var array = (xhr.responseText || "").match(rnoscripts) || []
	                        var n = array.length
	                        for (var i = 0; i < n; i++) {
	                            var tag = noscripts[i]
	                            if (tag) { //IE6-8中noscript标签的innerHTML,innerText是只读的
	                                tag.style.display = "none" //http://haslayout.net/css/noscript-Ghost-Bug
	                                tag.fixIE78 = (array[i].match(rnoscriptText) || ["", "&nbsp;"])[1]
	                            }
	                        }
	                    }
	                    avalon.nextTick(function() {
	                        scanTemplate(el.fixIE78 || el.value || el.innerText || el.innerHTML)
	                    })
	                }
	            }
	        } else {
	            if (!root.hasAttribute && typeof val === "string" && (method === "src" || method === "href")) {
	                val = val.replace(/&amp;/g, "&") //处理IE67自动转义的问题
	            }
	            elem[method] = val
	            if (window.chrome && elem.tagName === "EMBED") {
	                var parent = elem.parentNode //#525  chrome1-37下embed标签动态设置src不能发生请求
	                var comment = document.createComment("ms-src")
	                parent.replaceChild(comment, elem)
	                parent.replaceChild(elem, comment)
	            }
	        }
	    }
	
	    function getTemplateNodes(data, id, text) {
	        var div = data.templateCache && data.templateCache[id]
	        if (div) {
	            var dom = DOC.createDocumentFragment(),
	                firstChild
	            while (firstChild = div.firstChild) {
	                dom.appendChild(firstChild)
	            }
	            return dom
	        }
	        return avalon.parseHTML(text)
	    }
	
	    //这几个指令都可以使用插值表达式，如ms-src="aaa/{{b}}/{{c}}.html"
	    "title,alt,src,value,css,include,href".replace(rword, function(name) {
	            bindingHandlers[name] = bindingHandlers.attr
	        })
	        //根据VM的属性值或表达式的值切换类名，ms-class="xxx yyy zzz:flag" 
	        //http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
	    bindingHandlers["class"] = function(binding, vmodels) {
	        var oldStyle = binding.param,
	            text = binding.value,
	            rightExpr
	        binding.handlerName = "class"
	        if (!oldStyle || isFinite(oldStyle)) {
	            binding.param = "" //去掉数字
	            var colonIndex = text.replace(rexprg, function(a) {
	                    return a.replace(/./g, "0")
	                }).indexOf(":") //取得第一个冒号的位置
	            if (colonIndex === -1) { // 比如 ms-class="aaa bbb ccc" 的情况
	                var className = text
	                rightExpr = true
	            } else { // 比如 ms-class-1="ui-state-active:checked" 的情况
	                className = text.slice(0, colonIndex)
	                rightExpr = text.slice(colonIndex + 1)
	            }
	            if (!rexpr.test(text)) {
	                className = quote(className)
	            } else {
	                className = stringifyExpr(className)
	            }
	            binding.expr = "[" + className + "," + rightExpr + "]"
	        } else {
	            binding.expr = '[' + quote(oldStyle) + "," + text + "]"
	            binding.oldStyle = oldStyle
	        }
	        var method = binding.type
	        if (method === "hover" || method === "active") { //确保只绑定一次
	            if (!binding.hasBindEvent) {
	                var elem = binding.element
	                var $elem = avalon(elem)
	                var activate = "mouseenter" //在移出移入时切换类名
	                var abandon = "mouseleave"
	                if (method === "active") { //在聚焦失焦中切换类名
	                    elem.tabIndex = elem.tabIndex || -1
	                    activate = "mousedown"
	                    abandon = "mouseup"
	                    var fn0 = $elem.bind("mouseleave", function() {
	                        binding.toggleClass && $elem.removeClass(binding.newClass)
	                    })
	                }
	            }
	
	            var fn1 = $elem.bind(activate, function() {
	                binding.toggleClass && $elem.addClass(binding.newClass)
	            })
	            var fn2 = $elem.bind(abandon, function() {
	                binding.toggleClass && $elem.removeClass(binding.newClass)
	            })
	            binding.rollback = function() {
	                $elem.unbind("mouseleave", fn0)
	                $elem.unbind(activate, fn1)
	                $elem.unbind(abandon, fn2)
	            }
	            binding.hasBindEvent = true
	        }
	        parseExprProxy(binding.expr, vmodels, binding)
	    }
	
	    bindingExecutors["class"] = function(arr, elem, binding) {
	        var $elem = avalon(elem)
	        binding.newClass = arr[0]
	        binding.toggleClass = !!arr[1]
	        if (binding.oldClass && binding.newClass !== binding.oldClass) {
	            $elem.removeClass(binding.oldClass)
	        }
	        binding.oldClass = binding.newClass
	        if (binding.type === "class") {
	            if (binding.oldStyle) {
	                $elem.toggleClass(binding.oldStyle, !!arr[1])
	            } else {
	                $elem.toggleClass(binding.newClass, binding.toggleClass)
	            }
	        }
	
	    }
	
	    "hover,active".replace(rword, function(method) {
	            bindingHandlers[method] = bindingHandlers["class"]
	        })
	        //ms-controller绑定已经在scanTag 方法中实现
	        //ms-css绑定已由ms-attr绑定实现
	
	
	    // bindingHandlers.data 定义在if.js
	    bindingExecutors.data = function(val, elem, data) {
	            var key = "data-" + data.param
	            if (val && typeof val === "object") {
	                elem[key] = val
	            } else {
	                elem.setAttribute(key, String(val))
	            }
	        }
	        //双工绑定
	    var duplexBinding = bindingHandlers.duplex = function(data, vmodels) {
	            var elem = data.element,
	                hasCast
	            parseExprProxy(data.value, vmodels, data, 1)
	
	            data.changed = getBindingCallback(elem, "data-duplex-changed", vmodels) || noop
	            if (data.evaluator && data.args) {
	                var params = []
	                var casting = oneObject("string,number,boolean,checked")
	                if (elem.type === "radio" && data.param === "") {
	                    data.param = "checked"
	                }
	                if (elem.msData) {
	                    elem.msData["ms-duplex"] = data.value
	                }
	                data.param.replace(/\w+/g, function(name) {
	                    if (/^(checkbox|radio)$/.test(elem.type) && /^(radio|checked)$/.test(name)) {
	                        if (name === "radio")
	                            log("ms-duplex-radio已经更名为ms-duplex-checked")
	                        name = "checked"
	                        data.isChecked = true
	                    }
	                    if (name === "bool") {
	                        name = "boolean"
	                        log("ms-duplex-bool已经更名为ms-duplex-boolean")
	                    } else if (name === "text") {
	                        name = "string"
	                        log("ms-duplex-text已经更名为ms-duplex-string")
	                    }
	                    if (casting[name]) {
	                        hasCast = true
	                    }
	                    avalon.Array.ensure(params, name)
	                })
	                if (!hasCast) {
	                    params.push("string")
	                }
	                data.param = params.join("-")
	                data.bound = function(type, callback) {
	                    if (elem.addEventListener) {
	                        elem.addEventListener(type, callback, false)
	                    } else {
	                        elem.attachEvent("on" + type, callback)
	                    }
	                    var old = data.rollback
	                    data.rollback = function() {
	                        elem.avalonSetter = null
	                        avalon.unbind(elem, type, callback)
	                        old && old()
	                    }
	                }
	                for (var i in avalon.vmodels) {
	                    var v = avalon.vmodels[i]
	                    v.$fire("avalon-ms-duplex-init", data)
	                }
	                var cpipe = data.pipe || (data.pipe = pipe)
	                cpipe(null, data, "init")
	                var tagName = elem.tagName
	                duplexBinding[tagName] && duplexBinding[tagName](elem, data.evaluator.apply(null, data.args), data)
	            }
	        }
	        //不存在 bindingExecutors.duplex
	
	    function fixNull(val) {
	        return val == null ? "" : val
	    }
	    avalon.duplexHooks = {
	        checked: {
	            get: function(val, data) {
	                return !data.element.oldValue
	            }
	        },
	        string: {
	            get: function(val) { //同步到VM
	                return val
	            },
	            set: fixNull
	        },
	        "boolean": {
	            get: function(val) {
	                return val === "true"
	            },
	            set: fixNull
	        },
	        number: {
	            get: function(val, data) {
	                var number = parseFloat(val)
	                if (-val === -number) {
	                    return number
	                }
	                var arr = /strong|medium|weak/.exec(data.element.getAttribute("data-duplex-number")) || ["medium"]
	                switch (arr[0]) {
	                    case "strong":
	                        return 0
	                    case "medium":
	                        return val === "" ? "" : 0
	                    case "weak":
	                        return val
	                }
	            },
	            set: fixNull
	        }
	    }
	
	    function pipe(val, data, action, e) {
	        data.param.replace(/\w+/g, function(name) {
	            var hook = avalon.duplexHooks[name]
	            if (hook && typeof hook[action] === "function") {
	                val = hook[action](val, data)
	            }
	        })
	        return val
	    }
	
	    var TimerID, ribbon = []
	
	    avalon.tick = function(fn) {
	        if (ribbon.push(fn) === 1) {
	            TimerID = setInterval(ticker, 60)
	        }
	    }
	
	    function ticker() {
	        for (var n = ribbon.length - 1; n >= 0; n--) {
	            var el = ribbon[n]
	            if (el() === false) {
	                ribbon.splice(n, 1)
	            }
	        }
	        if (!ribbon.length) {
	            clearInterval(TimerID)
	        }
	    }
	
	    var watchValueInTimer = noop
	    new function() { // jshint ignore:line
	        try { //#272 IE9-IE11, firefox
	            var setters = {}
	            var aproto = HTMLInputElement.prototype
	            var bproto = HTMLTextAreaElement.prototype
	
	            function newSetter(value) { // jshint ignore:line
	                setters[this.tagName].call(this, value)
	                if (!this.msFocus && this.avalonSetter) {
	                    this.avalonSetter()
	                }
	            }
	            var inputProto = HTMLInputElement.prototype
	            Object.getOwnPropertyNames(inputProto) //故意引发IE6-8等浏览器报错
	            setters["INPUT"] = Object.getOwnPropertyDescriptor(aproto, "value").set
	
	            Object.defineProperty(aproto, "value", {
	                set: newSetter
	            })
	            setters["TEXTAREA"] = Object.getOwnPropertyDescriptor(bproto, "value").set
	            Object.defineProperty(bproto, "value", {
	                set: newSetter
	            })
	        } catch (e) {
	            //在chrome 43中 ms-duplex终于不需要使用定时器实现双向绑定了
	            // http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype
	            // https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
	            watchValueInTimer = avalon.tick
	        }
	    } // jshint ignore:line
	    if (IEVersion) {
	        avalon.bind(DOC, "selectionchange", function(e) {
	            var el = DOC.activeElement || {}
	            if (!el.msFocus && el.avalonSetter) {
	                el.avalonSetter()
	            }
	        })
	    }
	    var rnoduplex = /^(file|button|reset|submit|checkbox|radio|range)$/
	        //处理radio, checkbox, text, textarea, password
	    duplexBinding.INPUT = function(elem, evaluator, data) {
	        var $type = elem.type,
	            bound = data.bound,
	            $elem = avalon(elem),
	            composing = false
	
	        function callback(value) {
	            data.changed.call(this, value, data)
	        }
	
	        function compositionStart() {
	            composing = true
	        }
	
	        function compositionEnd() {
	            composing = false
	        }
	        var IE9Value
	            //当value变化时改变model的值
	        var updateVModel = function() {
	                var val = elem.value //防止递归调用形成死循环
	                if (composing || val === IE9Value) //处理中文输入法在minlengh下引发的BUG
	                    return
	                var lastValue = data.pipe(val, data, "get")
	                if ($elem.data("duplexObserve") !== false) {
	                    IE9Value = val
	                    evaluator(lastValue)
	                    callback.call(elem, lastValue)
	                }
	            }
	            //当model变化时,它就会改变value的值
	        data.handler = function() {
	            var val = data.pipe(evaluator(), data, "set") //fix #673 #1106
	            if (val !== IE9Value) {
	                var fixCaret = false
	                if (elem.msFocus) {
	                    try {
	                        var pos = getCaret(elem)
	                        if (pos.start === pos.end) {
	                            pos = pos.start
	                            fixCaret = true
	                        }
	                    } catch (e) {}
	                }
	                elem.value = IE9Value = val
	                if (fixCaret && !elem.readyOnly) {
	                    setCaret(elem, pos, pos)
	                }
	            }
	        }
	        if (data.isChecked || $type === "radio") {
	            var IE6 = IEVersion === 6
	            updateVModel = function() {
	                if ($elem.data("duplexObserve") !== false) {
	                    var lastValue = data.pipe(elem.value, data, "get")
	                    evaluator(lastValue)
	                    callback.call(elem, lastValue)
	                }
	            }
	            data.handler = function() {
	                var val = evaluator()
	                var checked = data.isChecked ? !!val : val + "" === elem.value
	                elem.oldValue = checked
	                if (IE6) {
	                    setTimeout(function() {
	                        //IE8 checkbox, radio是使用defaultChecked控制选中状态，
	                        //并且要先设置defaultChecked后设置checked
	                        //并且必须设置延迟
	                        elem.defaultChecked = checked
	                        elem.checked = checked
	                    }, 31)
	                } else {
	                    elem.checked = checked
	                }
	            }
	            bound("click", updateVModel)
	        } else if ($type === "checkbox") {
	            updateVModel = function() {
	                if ($elem.data("duplexObserve") !== false) {
	                    var method = elem.checked ? "ensure" : "remove"
	                    var array = evaluator()
	                    if (!Array.isArray(array)) {
	                        log("ms-duplex应用于checkbox上要对应一个数组")
	                        array = [array]
	                    }
	                    var val = data.pipe(elem.value, data, "get")
	                    avalon.Array[method](array, val)
	                    callback.call(elem, array)
	                }
	            }
	
	            data.handler = function() {
	                var array = [].concat(evaluator()) //强制转换为数组
	                var val = data.pipe(elem.value, data, "get")
	                elem.checked = array.indexOf(val) > -1
	            }
	            bound(W3C ? "change" : "click", updateVModel)
	        } else {
	            var events = elem.getAttribute("data-duplex-event") || "input"
	            if (elem.attributes["data-event"]) {
	                log("data-event指令已经废弃，请改用data-duplex-event")
	            }
	
	            function delay(e) { // jshint ignore:line
	                setTimeout(function() {
	                    updateVModel(e)
	                })
	            }
	            events.replace(rword, function(name) {
	                switch (name) {
	                    case "input":
	                        if (!IEVersion) { // W3C
	                            bound("input", updateVModel)
	                                //非IE浏览器才用这个
	                            bound("compositionstart", compositionStart)
	                            bound("compositionend", compositionEnd)
	                            bound("DOMAutoComplete", updateVModel)
	                        } else {
	                            // IE下通过selectionchange事件监听IE9+点击input右边的X的清空行为，及粘贴，剪切，删除行为
	                            if (IEVersion > 8) {
	                                if (IEVersion === 9) {
	                                    //IE9删除字符后再失去焦点不会同步 #1167
	                                    bound("keyup", updateVModel)
	                                }
	                                //IE9使用propertychange无法监听中文输入改动
	                                bound("input", updateVModel)
	                            } else {
	                                //onpropertychange事件无法区分是程序触发还是用户触发
	                                //IE6-8下第一次修改时不会触发,需要使用keydown或selectionchange修正
	                                bound("propertychange", function(e) {
	                                    if (e.propertyName === "value") {
	                                        updateVModel()
	                                    }
	                                })
	                            }
	                            bound("dragend", delay)
	                                //http://www.cnblogs.com/rubylouvre/archive/2013/02/17/2914604.html
	                                //http://www.matts411.com/post/internet-explorer-9-oninput/
	                        }
	                        break
	                    default:
	                        bound(name, updateVModel)
	                        break
	                }
	            })
	
	
	            if (!rnoduplex.test(elem.type)) {
	                if (elem.type !== "hidden") {
	                    bound("focus", function() {
	                        elem.msFocus = true
	                    })
	                    bound("blur", function() {
	                        elem.msFocus = false
	                    })
	                }
	
	                elem.avalonSetter = updateVModel //#765
	                watchValueInTimer(function() {
	                    if (root.contains(elem)) {
	                        if (!elem.msFocus) {
	                            updateVModel()
	                        }
	                    } else if (!elem.msRetain) {
	                        return false
	                    }
	                })
	            }
	
	        }
	
	        avalon.injectBinding(data)
	        callback.call(elem, elem.value)
	    }
	    duplexBinding.TEXTAREA = duplexBinding.INPUT
	
	    function getCaret(ctrl) {
	        var start = NaN,
	            end = NaN
	            //https://github.com/RobinHerbots/jquery.inputmask/blob/3.x/js/inputmask.js#L1736
	        if (ctrl.setSelectionRange) {
	            start = ctrl.selectionStart
	            end = ctrl.selectionEnd
	        } else {
	            var range = document.selection.createRange()
	            start = 0 - range.duplicate().moveStart('character', -100000)
	            end = start + range.text.length
	        }
	        return {
	            start: start,
	            end: end
	        }
	    }
	
	    function setCaret(ctrl, begin, end) {
	        if (!ctrl.value || ctrl.readOnly)
	            return
	        if (ctrl.createTextRange) { //IE6-8
	            var range = ctrl.createTextRange()
	            range.collapse(true)
	            range.moveStart("character", begin)
	            range.select()
	        } else {
	            ctrl.selectionStart = begin
	            ctrl.selectionEnd = end
	        }
	    }
	    duplexBinding.SELECT = function(element, evaluator, data) {
	            var $elem = avalon(element)
	
	            function updateVModel() {
	                if ($elem.data("duplexObserve") !== false) {
	                    var val = $elem.val() //字符串或字符串数组
	                    if (Array.isArray(val)) {
	                        val = val.map(function(v) {
	                            return data.pipe(v, data, "get")
	                        })
	                    } else {
	                        val = data.pipe(val, data, "get")
	                    }
	                    if (val + "" !== element.oldValue) {
	                        evaluator(val)
	                    }
	                    data.changed.call(element, val, data)
	                }
	            }
	            data.handler = function() {
	                var val = evaluator()
	                val = val && val.$model || val
	                if (Array.isArray(val)) {
	                    if (!element.multiple) {
	                        log("ms-duplex在<select multiple=true>上要求对应一个数组")
	                    }
	                } else {
	                    if (element.multiple) {
	                        log("ms-duplex在<select multiple=false>不能对应一个数组")
	                    }
	                }
	                //必须变成字符串后才能比较
	                val = Array.isArray(val) ? val.map(String) : val + ""
	                if (val + "" !== element.oldValue) {
	                    $elem.val(val)
	                    element.oldValue = val + ""
	                }
	            }
	            data.bound("change", updateVModel)
	            element.msCallback = function() {
	                avalon.injectBinding(data)
	                data.changed.call(element, evaluator(), data)
	            }
	        }
	        // bindingHandlers.html 定义在if.js
	    bindingExecutors.html = function(val, elem, data) {
	        var isHtmlFilter = elem.nodeType !== 1
	        var parent = isHtmlFilter ? elem.parentNode : elem
	        if (!parent)
	            return
	        val = val == null ? "" : val
	        if (data.oldText !== val) {
	            data.oldText = val
	        } else {
	            return
	        }
	        if (elem.nodeType === 3) {
	            var signature = generateID("html")
	            parent.insertBefore(DOC.createComment(signature), elem)
	            data.element = DOC.createComment(signature + ":end")
	            parent.replaceChild(data.element, elem)
	            elem = data.element
	        }
	        if (typeof val !== "object") { //string, number, boolean
	            var fragment = avalon.parseHTML(String(val))
	        } else if (val.nodeType === 11) { //将val转换为文档碎片
	            fragment = val
	        } else if (val.nodeType === 1 || val.item) {
	            var nodes = val.nodeType === 1 ? val.childNodes : val.item
	            fragment = avalonFragment.cloneNode(true)
	            while (nodes[0]) {
	                fragment.appendChild(nodes[0])
	            }
	        }
	
	        nodes = avalon.slice(fragment.childNodes)
	            //插入占位符, 如果是过滤器,需要有节制地移除指定的数量,如果是html指令,直接清空
	        if (isHtmlFilter) {
	            var endValue = elem.nodeValue.slice(0, -4)
	            while (true) {
	                var node = elem.previousSibling
	                if (!node || node.nodeType === 8 && node.nodeValue === endValue) {
	                    break
	                } else {
	                    parent.removeChild(node)
	                }
	            }
	            parent.insertBefore(fragment, elem)
	        } else {
	            avalon.clearHTML(elem).appendChild(fragment)
	        }
	        scanNodeArray(nodes, data.vmodels)
	    }
	    bindingHandlers["if"] =
	        bindingHandlers.data =
	        bindingHandlers.text =
	        bindingHandlers.html =
	        function(data, vmodels) {
	            parseExprProxy(data.value, vmodels, data)
	        }
	
	    bindingExecutors["if"] = function(val, elem, data) {
	            try {
	                if (!elem.parentNode) return
	            } catch (e) {
	                return
	            }
	            if (val) { //插回DOM树
	                if (elem.nodeType === 8) {
	                    elem.parentNode.replaceChild(data.template, elem)
	                    elem.ifRemove = null
	                        //   animate.enter(data.template, elem.parentNode)
	                    elem = data.element = data.template //这时可能为null
	                }
	                if (elem.getAttribute(data.name)) {
	                    elem.removeAttribute(data.name)
	                    scanAttr(elem, data.vmodels)
	                }
	                data.rollback = null
	            } else { //移出DOM树，并用注释节点占据原位置
	                if (elem.nodeType === 1) {
	                    var node = data.element = DOC.createComment("ms-if")
	                    elem.parentNode.replaceChild(node, elem)
	                    elem.ifRemove = node
	                        //     animate.leave(elem, node.parentNode, node)
	                    data.template = elem //元素节点
	                    ifGroup.appendChild(elem)
	                    data.rollback = function() {
	                        if (elem.parentNode === ifGroup) {
	                            ifGroup.removeChild(elem)
	                        }
	                    }
	                }
	            }
	        }
	        //ms-important绑定已经在scanTag 方法中实现
	        //ms-include绑定已由ms-attr绑定实现
	
	    var rdash = /\(([^)]*)\)/
	    bindingHandlers.on = function(data, vmodels) {
	        var value = data.value
	        data.type = "on"
	        var eventType = data.param.replace(/-\d+$/, "") // ms-on-mousemove-10
	        if (typeof bindingHandlers.on[eventType + "Hook"] === "function") {
	            bindingHandlers.on[eventType + "Hook"](data)
	        }
	        if (value.indexOf("(") > 0 && value.indexOf(")") > -1) {
	            var matched = (value.match(rdash) || ["", ""])[1].trim()
	            if (matched === "" || matched === "$event") { // aaa() aaa($event)当成aaa处理
	                value = value.replace(rdash, "")
	            }
	        }
	        parseExprProxy(value, vmodels, data)
	    }
	
	    bindingExecutors.on = function(callback, elem, data) {
	        callback = function(e) {
	            var fn = data.evaluator || noop
	            return fn.apply(this, data.args.concat(e))
	        }
	        var eventType = data.param.replace(/-\d+$/, "") // ms-on-mousemove-10
	        if (eventType === "scan") {
	            callback.call(elem, {
	                type: eventType
	            })
	        } else if (typeof data.specialBind === "function") {
	            data.specialBind(elem, callback)
	        } else {
	            var removeFn = avalon.bind(elem, eventType, callback)
	        }
	        data.rollback = function() {
	            if (typeof data.specialUnbind === "function") {
	                data.specialUnbind()
	            } else {
	                avalon.unbind(elem, eventType, removeFn)
	            }
	        }
	    }
	    bindingHandlers.repeat = function(data, vmodels) {
	        var type = data.type
	        parseExprProxy(data.value, vmodels, data, 1)
	        data.proxies = []
	        var freturn = false
	        try {
	            var $repeat = data.$repeat = data.evaluator.apply(0, data.args || [])
	            var xtype = avalon.type($repeat)
	            if (xtype !== "object" && xtype !== "array") {
	                freturn = true
	                avalon.log("warning:" + data.value + "只能是对象或数组")
	            } else {
	                data.xtype = xtype
	            }
	        } catch (e) {
	            freturn = true
	        }
	        var arr = data.value.split(".") || []
	        if (arr.length > 1) {
	            arr.pop()
	            var n = arr[0]
	            for (var i = 0, v; v = vmodels[i++];) {
	                if (v && v.hasOwnProperty(n)) {
	                    var events = v[n].$events || {}
	                    events[subscribers] = events[subscribers] || []
	                    events[subscribers].push(data)
	                    break
	                }
	            }
	        }
	
	        var oldHandler = data.handler
	        data.handler = noop
	        avalon.injectBinding(data)
	        data.handler = oldHandler
	
	        var elem = data.element
	        if (elem.nodeType === 1) {
	            elem.removeAttribute(data.name)
	            data.sortedCallback = getBindingCallback(elem, "data-with-sorted", vmodels)
	            data.renderedCallback = getBindingCallback(elem, "data-" + type + "-rendered", vmodels)
	            var signature = generateID(type)
	            var start = DOC.createComment(signature)
	            var end = DOC.createComment(signature + ":end")
	            data.signature = signature
	            data.template = avalonFragment.cloneNode(false)
	            if (type === "repeat") {
	                var parent = elem.parentNode
	                parent.replaceChild(end, elem)
	                parent.insertBefore(start, end)
	                data.template.appendChild(elem)
	            } else {
	                while (elem.firstChild) {
	                    data.template.appendChild(elem.firstChild)
	                }
	                elem.appendChild(start)
	                elem.appendChild(end)
	            }
	            data.element = end
	            data.handler = bindingExecutors.repeat
	            data.rollback = function() {
	                var elem = data.element
	                if (!elem)
	                    return
	                data.handler("clear")
	            }
	        }
	
	        if (freturn) {
	            return
	        }
	
	        data.$outer = {}
	        var check0 = "$key"
	        var check1 = "$val"
	        if (Array.isArray($repeat)) {
	            check0 = "$first"
	            check1 = "$last"
	        }
	
	        for (i = 0; v = vmodels[i++];) {
	            if (v.hasOwnProperty(check0) && v.hasOwnProperty(check1)) {
	                data.$outer = v
	                break
	            }
	        }
	        var $events = $repeat.$events
	        var $list = ($events || {})[subscribers]
	        injectDependency($list, data)
	        if (xtype === "object") {
	            data.handler("append")
	        } else if ($repeat.length) {
	            data.handler("add", 0, $repeat.length)
	        }
	    }
	
	    bindingExecutors.repeat = function(method, pos, el) {
	        var data = this
	        if (!method && data.xtype) {
	            var old = data.$repeat
	            var neo = data.evaluator.apply(0, data.args || [])
	
	            if (data.xtype === "array") {
	                if (old.length === neo.length) {
	                    if (old !== neo && old.length > 0) {
	                        bindingExecutors.repeat.call(this, 'clear', pos, el)
	                    } else {
	                        return
	                    }
	                }
	                method = "add"
	                pos = 0
	                data.$repeat = neo
	                el = neo.length
	            } else {
	                if (keysVM(old).join(";;") === keysVM(neo).join(";;")) {
	                    return
	                }
	                method = "append"
	                data.$repeat = neo
	            }
	        }
	        if (method) {
	            var start, fragment
	            var end = data.element
	            var comments = getComments(data)
	            var parent = end.parentNode
	            var proxies = data.proxies
	            var transation = avalonFragment.cloneNode(false)
	            switch (method) {
	                case "add": //在pos位置后添加el数组（pos为插入位置,el为要插入的个数）
	                    var n = pos + el
	                    var fragments = []
	                    for (var i = pos; i < n; i++) {
	                        var proxy = eachProxyAgent(i, data)
	                        proxies.splice(i, 0, proxy)
	                        shimController(data, transation, proxy, fragments)
	                    }
	                    parent.insertBefore(transation, comments[pos] || end)
	                    for (i = 0; fragment = fragments[i++];) {
	                        scanNodeArray(fragment.nodes, fragment.vmodels)
	                        fragment.nodes = fragment.vmodels = null
	                    }
	
	                    break
	                case "del": //将pos后的el个元素删掉(pos, el都是数字)
	                    sweepNodes(comments[pos], comments[pos + el] || end)
	                    var removed = proxies.splice(pos, el)
	                    recycleProxies(removed, "each")
	                    break
	                case "clear":
	                    start = comments[0]
	                    if (start) {
	                        sweepNodes(start, end)
	                        if (data.xtype === "object") {
	                            parent.insertBefore(start, end)
	                        } else {
	                            recycleProxies(proxies, "each")
	                        }
	                    }
	                    break
	                case "move":
	                    start = comments[0]
	                    if (start) {
	                        var signature = start.nodeValue
	                        var rooms = []
	                        var room = [],
	                            node
	                        sweepNodes(start, end, function() {
	                            room.unshift(this)
	                            if (this.nodeValue === signature) {
	                                rooms.unshift(room)
	                                room = []
	                            }
	                        })
	                        sortByIndex(rooms, pos)
	                        sortByIndex(proxies, pos)
	                        while (room = rooms.shift()) {
	                            while (node = room.shift()) {
	                                transation.appendChild(node)
	                            }
	                        }
	                        parent.insertBefore(transation, end)
	                    }
	                    break
	                case "index": //将proxies中的第pos个起的所有元素重新索引
	                    var last = proxies.length - 1
	                    for (; el = proxies[pos]; pos++) {
	                        el.$index = pos
	                        el.$first = pos === 0
	                        el.$last = pos === last
	                    }
	                    return
	                case "set": //将proxies中的第pos个元素的VM设置为el（pos为数字，el任意）
	                    proxy = proxies[pos]
	                    if (proxy) {
	                        fireDependencies(proxy.$events[data.param || "el"])
	                    }
	                    break
	                case "append":
	                    var object = data.$repeat //原来第2参数， 被循环对象
	                    var pool = Array.isArray(proxies) || !proxies ? {} : proxies //代理对象组成的hash
	                    data.proxies = pool
	                    var keys = []
	                    fragments = []
	                    for (var key in pool) {
	                        if (!object.hasOwnProperty(key)) {
	                            proxyRecycler(pool[key], withProxyPool) //去掉之前的代理VM
	                            delete(pool[key])
	                        }
	                    }
	                    for (key in object) { //得到所有键名
	                        if (object.hasOwnProperty(key) && key !== "hasOwnProperty") {
	                            keys.push(key)
	                        }
	                    }
	                    if (data.sortedCallback) { //如果有回调，则让它们排序
	                        var keys2 = data.sortedCallback.call(parent, keys)
	                        if (keys2 && Array.isArray(keys2) && keys2.length) {
	                            keys = keys2
	                        }
	                    }
	                    for (i = 0; key = keys[i++];) {
	                        if (key !== "hasOwnProperty") {
	                            pool[key] = withProxyAgent(pool[key], key, data)
	                            shimController(data, transation, pool[key], fragments)
	                        }
	                    }
	
	                    parent.insertBefore(transation, end)
	                    for (i = 0; fragment = fragments[i++];) {
	                        scanNodeArray(fragment.nodes, fragment.vmodels)
	                        fragment.nodes = fragment.vmodels = null
	                    }
	                    break
	            }
	            if (!data.$repeat || data.$repeat.hasOwnProperty("$lock")) //IE6-8 VBScript对象会报错, 有时候data.$repeat不存在
	                return
	            if (method === "clear")
	                method = "del"
	            var callback = data.renderedCallback || noop,
	                args = arguments
	            if (parent.oldValue && parent.tagName === "SELECT") { //fix #503
	                avalon(parent).val(parent.oldValue.split(","))
	            }
	            callback.apply(parent, args)
	        }
	    }
	    "with,each".replace(rword, function(name) {
	        bindingHandlers[name] = bindingHandlers.repeat
	    })
	
	    function shimController(data, transation, proxy, fragments) {
	        var content = data.template.cloneNode(true)
	        var nodes = avalon.slice(content.childNodes)
	        content.insertBefore(DOC.createComment(data.signature), content.firstChild)
	        transation.appendChild(content)
	        var nv = [proxy].concat(data.vmodels)
	        var fragment = {
	            nodes: nodes,
	            vmodels: nv
	        }
	        fragments.push(fragment)
	    }
	
	    function getComments(data) {
	        var ret = []
	        var nodes = data.element.parentNode.childNodes
	        for (var i = 0, node; node = nodes[i++];) {
	            if (node.nodeValue === data.signature) {
	                ret.push(node)
	            } else if (node.nodeValue === data.signature + ":end") {
	                break
	            }
	        }
	        return ret
	    }
	
	
	    //移除掉start与end之间的节点(保留end)
	    function sweepNodes(start, end, callback) {
	        while (true) {
	            var node = end.previousSibling
	            if (!node)
	                break
	            node.parentNode.removeChild(node)
	            callback && callback.call(node)
	            if (node === start) {
	                break
	            }
	        }
	    }
	
	    // 为ms-each,ms-with, ms-repeat会创建一个代理VM，
	    // 通过它们保持一个下上文，让用户能调用$index,$first,$last,$remove,$key,$val,$outer等属性与方法
	    // 所有代理VM的产生,消费,收集,存放通过xxxProxyFactory,xxxProxyAgent, recycleProxies,xxxProxyPool实现
	    var withProxyPool = []
	
	    function withProxyFactory() {
	        var proxy = modelFactory({
	            $key: "",
	            $outer: {},
	            $host: {},
	            $val: {
	                get: function() {
	                    return this.$host[this.$key]
	                },
	                set: function(val) {
	                    this.$host[this.$key] = val
	                }
	            }
	        }, {
	            $val: 1
	        })
	        proxy.$id = generateID("$proxy$with")
	        return proxy
	    }
	
	    function withProxyAgent(proxy, key, data) {
	        proxy = proxy || withProxyPool.pop()
	        if (!proxy) {
	            proxy = withProxyFactory()
	        } else {
	            proxy.$reinitialize()
	        }
	        var host = data.$repeat
	        proxy.$key = key
	
	        proxy.$host = host
	        proxy.$outer = data.$outer
	        if (host.$events) {
	            proxy.$events.$val = host.$events[key]
	        } else {
	            proxy.$events = {}
	        }
	        return proxy
	    }
	
	
	    function recycleProxies(proxies) {
	        eachProxyRecycler(proxies)
	    }
	
	    function eachProxyRecycler(proxies) {
	        proxies.forEach(function(proxy) {
	            proxyRecycler(proxy, eachProxyPool)
	        })
	        proxies.length = 0
	    }
	
	
	    var eachProxyPool = []
	
	    function eachProxyFactory(name) {
	        var source = {
	            $host: [],
	            $outer: {},
	            $index: 0,
	            $first: false,
	            $last: false,
	            $remove: avalon.noop
	        }
	        source[name] = {
	            get: function() {
	                var e = this.$events
	                var array = e.$index
	                e.$index = e[name] //#817 通过$index为el收集依赖
	                try {
	                    return this.$host[this.$index]
	                } finally {
	                    e.$index = array
	                }
	            },
	            set: function(val) {
	                try {
	                    var e = this.$events
	                    var array = e.$index
	                    e.$index = []
	                    this.$host.set(this.$index, val)
	                } finally {
	                    e.$index = array
	                }
	            }
	        }
	        var second = {
	            $last: 1,
	            $first: 1,
	            $index: 1
	        }
	        var proxy = modelFactory(source, second)
	        proxy.$id = generateID("$proxy$each")
	        return proxy
	    }
	
	    function eachProxyAgent(index, data) {
	        var param = data.param || "el",
	            proxy
	        for (var i = 0, n = eachProxyPool.length; i < n; i++) {
	            var candidate = eachProxyPool[i]
	            if (candidate && candidate.hasOwnProperty(param)) {
	                proxy = candidate
	                eachProxyPool.splice(i, 1)
	            }
	        }
	        if (!proxy) {
	            proxy = eachProxyFactory(param)
	        }
	        var host = data.$repeat
	        var last = host.length - 1
	        proxy.$index = index
	        proxy.$first = index === 0
	        proxy.$last = index === last
	        proxy.$host = host
	        proxy.$outer = data.$outer
	        proxy.$remove = function() {
	            return host.removeAt(proxy.$index)
	        }
	        return proxy
	    }
	
	
	    function proxyRecycler(proxy, proxyPool) {
	        for (var i in proxy.$events) {
	            var arr = proxy.$events[i]
	            if (Array.isArray(arr)) {
	                arr.forEach(function(data) {
	                        if (typeof data === "object")
	                            disposeData(data)
	                    }) // jshint ignore:line
	                arr.length = 0
	            }
	        }
	        proxy.$host = proxy.$outer = {}
	        if (proxyPool.unshift(proxy) > kernel.maxRepeatSize) {
	            proxyPool.pop()
	        }
	    }
	
	    /*********************************************************************
	     *                         各种指令                                  *
	     **********************************************************************/
	    //ms-skip绑定已经在scanTag 方法中实现
	    // bindingHandlers.text 定义在if.js
	    bindingExecutors.text = function(val, elem) {
	        val = val == null ? "" : val //不在页面上显示undefined null
	        if (elem.nodeType === 3) { //绑定在文本节点上
	            try { //IE对游离于DOM树外的节点赋值会报错
	                elem.data = val
	            } catch (e) {}
	        } else { //绑定在特性节点上
	            if ("textContent" in elem) {
	                elem.textContent = val
	            } else {
	                elem.innerText = val
	            }
	        }
	    }
	
	    function parseDisplay(nodeName, val) {
	        //用于取得此类标签的默认display值
	        var key = "_" + nodeName
	        if (!parseDisplay[key]) {
	            var node = DOC.createElement(nodeName)
	            root.appendChild(node)
	            if (W3C) {
	                val = getComputedStyle(node, null).display
	            } else {
	                val = node.currentStyle.display
	            }
	            root.removeChild(node)
	            parseDisplay[key] = val
	        }
	        return parseDisplay[key]
	    }
	
	    avalon.parseDisplay = parseDisplay
	
	    bindingHandlers.visible = function(data, vmodels) {
	        parseExprProxy(data.value, vmodels, data)
	    }
	
	    bindingExecutors.visible = function(val, elem, binding) {
	        if (val) {
	            elem.style.display = binding.display || ""
	            if (avalon(elem).css("display") === "none") {
	                elem.style.display = binding.display = parseDisplay(elem.nodeName)
	            }
	        } else {
	            elem.style.display = "none"
	        }
	    }
	    bindingHandlers.widget = function(data, vmodels) {
	        var args = data.value.match(rword)
	        var elem = data.element
	        var widget = args[0]
	        var id = args[1]
	        if (!id || id === "$") { //没有定义或为$时，取组件名+随机数
	            id = generateID(widget)
	        }
	        var optName = args[2] || widget //没有定义，取组件名
	        var constructor = avalon.ui[widget]
	        if (typeof constructor === "function") { //ms-widget="tabs,tabsAAA,optname"
	            vmodels = elem.vmodels || vmodels
	            for (var i = 0, v; v = vmodels[i++];) {
	                if (v.hasOwnProperty(optName) && typeof v[optName] === "object") {
	                    var vmOptions = v[optName]
	                    vmOptions = vmOptions.$model || vmOptions
	                    break
	                }
	            }
	            if (vmOptions) {
	                var wid = vmOptions[widget + "Id"]
	                if (typeof wid === "string") {
	                    log("warning!不再支持" + widget + "Id")
	                    id = wid
	                }
	            }
	            //抽取data-tooltip-text、data-tooltip-attr属性，组成一个配置对象
	            var widgetData = avalon.getWidgetData(elem, widget)
	            data.value = [widget, id, optName].join(",")
	            data[widget + "Id"] = id
	            data.evaluator = noop
	            elem.msData["ms-widget-id"] = id
	            var options = data[widget + "Options"] = avalon.mix({}, constructor.defaults, vmOptions || {}, widgetData)
	            elem.removeAttribute("ms-widget")
	            var vmodel = constructor(elem, data, vmodels) || {} //防止组件不返回VM
	            if (vmodel.$id) {
	                avalon.vmodels[id] = vmodel
	                createSignalTower(elem, vmodel)
	                try {
	                    vmodel.$init(function() {
	                        avalon.scan(elem, [vmodel].concat(vmodels))
	                        if (typeof options.onInit === "function") {
	                            options.onInit.call(elem, vmodel, options, vmodels)
	                        }
	                    })
	                } catch (e) {
	                    log(e)
	                }
	                data.rollback = function() {
	                    try {
	                        vmodel.$remove()
	                        vmodel.widgetElement = null // 放到$remove后边
	                    } catch (e) {}
	                    elem.msData = {}
	                    delete avalon.vmodels[vmodel.$id]
	                }
	                injectDisposeQueue(data, widgetList)
	                if (window.chrome) {
	                    elem.addEventListener("DOMNodeRemovedFromDocument", function() {
	                        setTimeout(rejectDisposeQueue)
	                    })
	                }
	            } else {
	                avalon.scan(elem, vmodels)
	            }
	        } else if (vmodels.length) { //如果该组件还没有加载，那么保存当前的vmodels
	            elem.vmodels = vmodels
	        }
	    }
	    var widgetList = []
	        //不存在 bindingExecutors.widget
	        /*********************************************************************
	         *                             自带过滤器                            *
	         **********************************************************************/
	    var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim
	    var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g
	    var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/ig
	    var rsanitize = {
	        a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/ig,
	        img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/ig,
	        form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/ig
	    }
	    var rsurrogate = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
	    var rnoalphanumeric = /([^\#-~| |!])/g;
	
	    function numberFormat(number, decimals, point, thousands) {
	        //form http://phpjs.org/functions/number_format/
	        //number	必需，要格式化的数字
	        //decimals	可选，规定多少个小数位。
	        //point	可选，规定用作小数点的字符串（默认为 . ）。
	        //thousands	可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
	        number = (number + '')
	            .replace(/[^0-9+\-Ee.]/g, '')
	        var n = !isFinite(+number) ? 0 : +number,
	            prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
	            sep = thousands || ",",
	            dec = point || ".",
	            s = '',
	            toFixedFix = function(n, prec) {
	                var k = Math.pow(10, prec)
	                return '' + (Math.round(n * k) / k)
	                    .toFixed(prec)
	            }
	            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
	            .split('.')
	        if (s[0].length > 3) {
	            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
	        }
	        if ((s[1] || '')
	            .length < prec) {
	            s[1] = s[1] || ''
	            s[1] += new Array(prec - s[1].length + 1)
	                .join('0')
	        }
	        return s.join(dec)
	    }
	
	
	    var filters = avalon.filters = {
	            uppercase: function(str) {
	                return str.toUpperCase()
	            },
	            lowercase: function(str) {
	                return str.toLowerCase()
	            },
	            truncate: function(str, length, truncation) {
	                //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
	                length = length || 30
	                truncation = typeof truncation === "string" ? truncation : "..."
	                return str.length > length ? str.slice(0, length - truncation.length) + truncation : String(str)
	            },
	            $filter: function(val) {
	                for (var i = 1, n = arguments.length; i < n; i++) {
	                    var array = arguments[i]
	                    var fn = avalon.filters[array[0]]
	                    if (typeof fn === "function") {
	                        var arr = [val].concat(array.slice(1))
	                        val = fn.apply(null, arr)
	                    }
	                }
	                return val
	            },
	            camelize: camelize,
	            //https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
	            //    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a> 
	            //    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
	            //    <a href="jav	ascript:alert('XSS');">IE67chrome</a>
	            //    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
	            //    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
	            sanitize: function(str) {
	                return str.replace(rscripts, "").replace(ropen, function(a, b) {
	                    var match = a.toLowerCase().match(/<(\w+)\s/)
	                    if (match) { //处理a标签的href属性，img标签的src属性，form标签的action属性
	                        var reg = rsanitize[match[1]]
	                        if (reg) {
	                            a = a.replace(reg, function(s, name, value) {
	                                var quote = value.charAt(0)
	                                return name + "=" + quote + "javascript:void(0)" + quote // jshint ignore:line
	                            })
	                        }
	                    }
	                    return a.replace(ron, " ").replace(/\s+/g, " ") //移除onXXX事件
	                })
	            },
	            escape: function(str) {
	                //将字符串经过 str 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt 
	                return String(str).
	                replace(/&/g, '&amp;').
	                replace(rsurrogate, function(value) {
	                    var hi = value.charCodeAt(0)
	                    var low = value.charCodeAt(1)
	                    return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';'
	                }).
	                replace(rnoalphanumeric, function(value) {
	                    return '&#' + value.charCodeAt(0) + ';'
	                }).
	                replace(/</g, '&lt;').
	                replace(/>/g, '&gt;')
	            },
	            currency: function(amount, symbol, fractionSize) {
	                return (symbol || "\uFFE5") + numberFormat(amount, isFinite(fractionSize) ? fractionSize : 2)
	            },
	            number: numberFormat
	        }
	        /*
	         'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
	         'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
	         'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
	         'MMMM': Month in year (January-December)
	         'MMM': Month in year (Jan-Dec)
	         'MM': Month in year, padded (01-12)
	         'M': Month in year (1-12)
	         'dd': Day in month, padded (01-31)
	         'd': Day in month (1-31)
	         'EEEE': Day in Week,(Sunday-Saturday)
	         'EEE': Day in Week, (Sun-Sat)
	         'HH': Hour in day, padded (00-23)
	         'H': Hour in day (0-23)
	         'hh': Hour in am/pm, padded (01-12)
	         'h': Hour in am/pm, (1-12)
	         'mm': Minute in hour, padded (00-59)
	         'm': Minute in hour (0-59)
	         'ss': Second in minute, padded (00-59)
	         's': Second in minute (0-59)
	         'a': am/pm marker
	         'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
	         format string can also be one of the following predefined localizable formats:
	         
	         'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
	         'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
	         'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
	         'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
	         'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
	         'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
	         'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
	         'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
	         */
	    new function() { // jshint ignore:line
	        function toInt(str) {
	            return parseInt(str, 10) || 0
	        }
	
	        function padNumber(num, digits, trim) {
	            var neg = ""
	            if (num < 0) {
	                neg = '-'
	                num = -num
	            }
	            num = "" + num
	            while (num.length < digits)
	                num = "0" + num
	            if (trim)
	                num = num.substr(num.length - digits)
	            return neg + num
	        }
	
	        function dateGetter(name, size, offset, trim) {
	            return function(date) {
	                var value = date["get" + name]()
	                if (offset > 0 || value > -offset)
	                    value += offset
	                if (value === 0 && offset === -12) {
	                    value = 12
	                }
	                return padNumber(value, size, trim)
	            }
	        }
	
	        function dateStrGetter(name, shortForm) {
	            return function(date, formats) {
	                var value = date["get" + name]()
	                var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
	                return formats[get][value]
	            }
	        }
	
	        function timeZoneGetter(date) {
	            var zone = -1 * date.getTimezoneOffset()
	            var paddedZone = (zone >= 0) ? "+" : ""
	            paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
	            return paddedZone
	        }
	        //取得上午下午
	
	        function ampmGetter(date, formats) {
	            return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
	        }
	        var DATE_FORMATS = {
	            yyyy: dateGetter("FullYear", 4),
	            yy: dateGetter("FullYear", 2, 0, true),
	            y: dateGetter("FullYear", 1),
	            MMMM: dateStrGetter("Month"),
	            MMM: dateStrGetter("Month", true),
	            MM: dateGetter("Month", 2, 1),
	            M: dateGetter("Month", 1, 1),
	            dd: dateGetter("Date", 2),
	            d: dateGetter("Date", 1),
	            HH: dateGetter("Hours", 2),
	            H: dateGetter("Hours", 1),
	            hh: dateGetter("Hours", 2, -12),
	            h: dateGetter("Hours", 1, -12),
	            mm: dateGetter("Minutes", 2),
	            m: dateGetter("Minutes", 1),
	            ss: dateGetter("Seconds", 2),
	            s: dateGetter("Seconds", 1),
	            sss: dateGetter("Milliseconds", 3),
	            EEEE: dateStrGetter("Day"),
	            EEE: dateStrGetter("Day", true),
	            a: ampmGetter,
	            Z: timeZoneGetter
	        }
	        var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
	        var raspnetjson = /^\/Date\((\d+)\)\/$/
	        filters.date = function(date, format) {
	            var locate = filters.date.locate,
	                text = "",
	                parts = [],
	                fn, match
	            format = format || "mediumDate"
	            format = locate[format] || format
	            if (typeof date === "string") {
	                if (/^\d+$/.test(date)) {
	                    date = toInt(date)
	                } else if (raspnetjson.test(date)) {
	                    date = +RegExp.$1
	                } else {
	                    var trimDate = date.trim()
	                    var dateArray = [0, 0, 0, 0, 0, 0, 0]
	                    var oDate = new Date(0)
	                        //取得年月日
	                    trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function(_, a, b, c) {
	                        var array = c.length === 4 ? [c, a, b] : [a, b, c]
	                        dateArray[0] = toInt(array[0]) //年
	                        dateArray[1] = toInt(array[1]) - 1 //月
	                        dateArray[2] = toInt(array[2]) //日
	                        return ""
	                    })
	                    var dateSetter = oDate.setFullYear
	                    var timeSetter = oDate.setHours
	                    trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function(_, a, b, c, d) {
	                        dateArray[3] = toInt(a) //小时
	                        dateArray[4] = toInt(b) //分钟
	                        dateArray[5] = toInt(c) //秒
	                        if (d) { //毫秒
	                            dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
	                        }
	                        return ""
	                    })
	                    var tzHour = 0
	                    var tzMin = 0
	                    trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function(z, symbol, c, d) {
	                        dateSetter = oDate.setUTCFullYear
	                        timeSetter = oDate.setUTCHours
	                        if (symbol) {
	                            tzHour = toInt(symbol + c)
	                            tzMin = toInt(symbol + d)
	                        }
	                        return ""
	                    })
	
	                    dateArray[3] -= tzHour
	                    dateArray[4] -= tzMin
	                    dateSetter.apply(oDate, dateArray.slice(0, 3))
	                    timeSetter.apply(oDate, dateArray.slice(3))
	                    date = oDate
	                }
	            }
	            if (typeof date === "number") {
	                date = new Date(date)
	            }
	            if (avalon.type(date) !== "date") {
	                return
	            }
	            while (format) {
	                match = rdateFormat.exec(format)
	                if (match) {
	                    parts = parts.concat(match.slice(1))
	                    format = parts.pop()
	                } else {
	                    parts.push(format)
	                    format = null
	                }
	            }
	            parts.forEach(function(value) {
	                fn = DATE_FORMATS[value]
	                text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
	            })
	            return text
	        }
	        var locate = {
	            AMPMS: {
	                0: "上午",
	                1: "下午"
	            },
	            DAY: {
	                0: "星期日",
	                1: "星期一",
	                2: "星期二",
	                3: "星期三",
	                4: "星期四",
	                5: "星期五",
	                6: "星期六"
	            },
	            MONTH: {
	                0: "1月",
	                1: "2月",
	                2: "3月",
	                3: "4月",
	                4: "5月",
	                5: "6月",
	                6: "7月",
	                7: "8月",
	                8: "9月",
	                9: "10月",
	                10: "11月",
	                11: "12月"
	            },
	            SHORTDAY: {
	                "0": "周日",
	                "1": "周一",
	                "2": "周二",
	                "3": "周三",
	                "4": "周四",
	                "5": "周五",
	                "6": "周六"
	            },
	            fullDate: "y年M月d日EEEE",
	            longDate: "y年M月d日",
	            medium: "yyyy-M-d H:mm:ss",
	            mediumDate: "yyyy-M-d",
	            mediumTime: "H:mm:ss",
	            "short": "yy-M-d ah:mm",
	            shortDate: "yy-M-d",
	            shortTime: "ah:mm"
	        }
	        locate.SHORTMONTH = locate.MONTH
	        filters.date.locate = locate
	    } // jshint ignore:line
	    /*********************************************************************
	     *                     END                                  *
	     **********************************************************************/
	    new function() {
	        avalon.config({
	            loader: false
	        })
	        var fns = [],
	            loaded = DOC.readyState === "complete",
	            fn
	
	        function flush(f) {
	            loaded = 1
	            while (f = fns.shift())
	                f()
	        }
	
	        avalon.bind(DOC, "DOMContentLoaded", fn = function() {
	            avalon.unbind(DOC, "DOMContentLoaded", fn)
	            flush()
	        })
	
	        var id = setInterval(function() {
	            if (document.readyState === "complete" && document.body) {
	                clearInterval(id)
	                flush()
	            }
	        }, 50)
	
	        avalon.ready = function(fn) {
	            loaded ? fn(avalon) : fns.push(fn)
	        }
	        avalon.ready(function() {
	            avalon.scan(DOC.body)
	        })
	    }
	    // Register as a named AMD module, since avalon can be concatenated with other
	    // files that may use define, but not via a proper concatenation script that
	    // understands anonymous AMD modules. A named AMD is safest and most robust
	    // way to register. Lowercase avalon is used because AMD module names are
	    // derived from file names, and Avalon is normally delivered in a lowercase
	    // file name. Do this after creating the global so that if an AMD module wants
	    // to call noConflict to hide this version of avalon, it will work.
	
	    // Note that for maximum portability, libraries that are not avalon should
	    // declare themselves as anonymous modules, and avoid setting a global if an
	    // AMD loader is present. avalon is a special case. For more information, see
	    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return avalon
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	    }
	    // Map over avalon in case of overwrite
	    var _avalon = window.avalon
	    avalon.noConflict = function(deep) {
	            if (deep && window.avalon === avalon) {
	                window.avalon = _avalon
	            }
	            return avalon
	        }
	        // Expose avalon identifiers, even in AMD
	        // and CommonJS for browser emulators
	    if (noGlobal === void 0) {
	        window.avalon = avalon
	    }
	
	    return avalon
	
	}));

/***/ },
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v1.12.4
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-05-20T17:17Z
	 */
	
	(function( global, factory ) {
	
		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}
	
	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var deletedIds = [];
	
	var document = window.document;
	
	var slice = deletedIds.slice;
	
	var concat = deletedIds.concat;
	
	var push = deletedIds.push;
	
	var indexOf = deletedIds.indexOf;
	
	var class2type = {};
	
	var toString = class2type.toString;
	
	var hasOwn = class2type.hasOwnProperty;
	
	var support = {};
	
	
	
	var
		version = "1.12.4",
	
		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
	
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},
	
		// Support: Android<4.1, IE<9
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	
		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,
	
		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};
	
	jQuery.fn = jQuery.prototype = {
	
		// The current version of jQuery being used
		jquery: version,
	
		constructor: jQuery,
	
		// Start with an empty selector
		selector: "",
	
		// The default length of a jQuery object is 0
		length: 0,
	
		toArray: function() {
			return slice.call( this );
		},
	
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?
	
				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :
	
				// Return all the elements in a clean array
				slice.call( this );
		},
	
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {
	
			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );
	
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;
	
			// Return the newly-formed element set
			return ret;
		},
	
		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},
	
		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},
	
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},
	
		first: function() {
			return this.eq( 0 );
		},
	
		last: function() {
			return this.eq( -1 );
		},
	
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},
	
		end: function() {
			return this.prevObject || this.constructor();
		},
	
		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: deletedIds.sort,
		splice: deletedIds.splice
	};
	
	jQuery.extend = jQuery.fn.extend = function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
	
			// skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}
	
		// extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}
	
		for ( ; i < length; i++ ) {
	
			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {
	
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {
	
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];
	
						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}
	
						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	
	jQuery.extend( {
	
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	
		// Assume jQuery is ready without the ready module
		isReady: true,
	
		error: function( msg ) {
			throw new Error( msg );
		},
	
		noop: function() {},
	
		// See test/unit/core.js for details concerning isFunction.
		// Since version 1.3, DOM methods and functions like alert
		// aren't supported. They return false on IE (#2968).
		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},
	
		isArray: Array.isArray || function( obj ) {
			return jQuery.type( obj ) === "array";
		},
	
		isWindow: function( obj ) {
			/* jshint eqeqeq: false */
			return obj != null && obj == obj.window;
		},
	
		isNumeric: function( obj ) {
	
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
		},
	
		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},
	
		isPlainObject: function( obj ) {
			var key;
	
			// Must be an Object.
			// Because of IE, we also have to check the presence of the constructor property.
			// Make sure that DOM nodes and window objects don't pass through, as well
			if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}
	
			try {
	
				// Not own constructor property must be Object
				if ( obj.constructor &&
					!hasOwn.call( obj, "constructor" ) &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
					return false;
				}
			} catch ( e ) {
	
				// IE8,9 Will throw exceptions on certain host objects #9897
				return false;
			}
	
			// Support: IE<9
			// Handle iteration over inherited properties before own properties.
			if ( !support.ownFirst ) {
				for ( key in obj ) {
					return hasOwn.call( obj, key );
				}
			}
	
			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
			for ( key in obj ) {}
	
			return key === undefined || hasOwn.call( obj, key );
		},
	
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},
	
		// Workarounds based on findings by Jim Driscoll
		// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
		globalEval: function( data ) {
			if ( data && jQuery.trim( data ) ) {
	
				// We use execScript on Internet Explorer
				// We use an anonymous function so that context is window
				// rather than jQuery in Firefox
				( window.execScript || function( data ) {
					window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
				} )( data );
			}
		},
	
		// Convert dashed to camelCase; used by the css and data modules
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},
	
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},
	
		each: function( obj, callback ) {
			var length, i = 0;
	
			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}
	
			return obj;
		},
	
		// Support: Android<4.1, IE<9
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
	
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];
	
			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}
	
			return ret;
		},
	
		inArray: function( elem, arr, i ) {
			var len;
	
			if ( arr ) {
				if ( indexOf ) {
					return indexOf.call( arr, elem, i );
				}
	
				len = arr.length;
				i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
	
				for ( ; i < len; i++ ) {
	
					// Skip accessing in sparse arrays
					if ( i in arr && arr[ i ] === elem ) {
						return i;
					}
				}
			}
	
			return -1;
		},
	
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;
	
			while ( j < len ) {
				first[ i++ ] = second[ j++ ];
			}
	
			// Support: IE<9
			// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
			if ( len !== len ) {
				while ( second[ j ] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}
	
			first.length = i;
	
			return first;
		},
	
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;
	
			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
	
			return matches;
		},
	
		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];
	
			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
	
			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
			}
	
			// Flatten any nested arrays
			return concat.apply( [], ret );
		},
	
		// A global GUID counter for objects
		guid: 1,
	
		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var args, proxy, tmp;
	
			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}
	
			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}
	
			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};
	
			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
			return proxy;
		},
	
		now: function() {
			return +( new Date() );
		},
	
		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );
	
	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
	}
	/* jshint ignore: end */
	
	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );
	
	function isArrayLike( obj ) {
	
		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );
	
		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */
	(function( window ) {
	
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,
	
		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,
	
		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},
	
		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,
	
		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},
	
		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	
		// Regular expressions
	
		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
	
		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	
		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",
	
		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",
	
		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	
		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	
		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	
		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),
	
		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},
	
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,
	
		rnative = /^[^{]+\{\s*\[native \w/,
	
		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
		rsibling = /[+~]/,
		rescape = /'|\\/g,
	
		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},
	
		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};
	
	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?
	
			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :
	
			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}
	
	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, nidselect, match, groups, newSelector,
			newContext = context && context.ownerDocument,
	
			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;
	
		results = results || [];
	
		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	
			return results;
		}
	
		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
	
			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;
	
			if ( documentIsHTML ) {
	
				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
	
					// ID selector
					if ( (m = match[1]) ) {
	
						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {
	
								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}
	
						// Element context
						} else {
	
							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {
	
								results.push( elem );
								return results;
							}
						}
	
					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;
	
					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {
	
						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}
	
				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
	
					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;
	
					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {
	
						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rescape, "\\$&" );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}
	
						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
						while ( i-- ) {
							groups[i] = nidselect + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );
	
						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}
	
					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}
	
		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}
	
	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];
	
		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}
	
	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}
	
	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");
	
		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}
	
	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;
	
		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}
	
	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );
	
		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}
	
		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}
	
		return a ? 1 : -1;
	}
	
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;
	
				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}
	
	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}
	
	// Expose support vars for convenience
	support = Sizzle.support = {};
	
	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};
	
	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;
	
		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}
	
		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );
	
		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( (parent = document.defaultView) && parent.top !== parent ) {
			// Support: IE 11
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );
	
			// Support: IE 9 - 10 only
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}
	
		/* Attributes
		---------------------------------------------------------------------- */
	
		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});
	
		/* getElement(s)By*
		---------------------------------------------------------------------- */
	
		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( document.createComment("") );
			return !div.getElementsByTagName("*").length;
		});
	
		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );
	
		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});
	
		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					return m ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];
	
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}
	
		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );
	
				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :
	
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );
	
				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}
	
					return tmp;
				}
				return results;
			};
	
		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};
	
		/* QSA/matchesSelector
		---------------------------------------------------------------------- */
	
		// QSA and matchesSelector support
	
		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];
	
		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];
	
		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";
	
				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}
	
				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}
	
				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}
	
				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
	
				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});
	
			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );
	
				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}
	
				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}
	
		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {
	
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );
	
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}
	
		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	
		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );
	
		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};
	
		/* Sorting
		---------------------------------------------------------------------- */
	
		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {
	
			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}
	
			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :
	
				// Otherwise we know they are disconnected
				1;
	
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
	
				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}
	
				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}
	
			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];
	
			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
	
			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}
	
			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}
	
			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}
	
			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :
	
				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};
	
		return document;
	};
	
	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};
	
	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );
	
		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
			try {
				var ret = matches.call( elem, expr );
	
				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}
	
		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};
	
	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};
	
	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;
	
		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};
	
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	
	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;
	
		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );
	
		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}
	
		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;
	
		return results;
	};
	
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
	
		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	
		return ret;
	};
	
	Expr = Sizzle.selectors = {
	
		// Can be adjusted by the user
		cacheLength: 50,
	
		createPseudo: markFunction,
	
		match: matchExpr,
	
		attrHandle: {},
	
		find: {},
	
		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},
	
		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );
	
				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
	
				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}
	
				return match.slice( 0, 4 );
			},
	
			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();
	
				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}
	
					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
	
				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}
	
				return match;
			},
	
			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];
	
				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}
	
				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";
	
				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
	
					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}
	
				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},
	
		filter: {
	
			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},
	
			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];
	
				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},
	
			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );
	
					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}
	
					result += "";
	
					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},
	
			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";
	
				return first === 1 && last === 0 ?
	
					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :
	
					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;
	
						if ( parent ) {
	
							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {
	
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}
	
							start = [ forward ? parent.firstChild : parent.lastChild ];
	
							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
	
								// Seek `elem` from a previously-cached index
	
								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});
	
								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});
	
								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];
	
								while ( (node = ++nodeIndex && node && node[ dir ] ||
	
									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {
	
									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}
	
							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});
	
									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});
	
									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}
	
								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {
	
										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {
	
											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});
	
												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});
	
												uniqueCache[ type ] = [ dirruns, diff ];
											}
	
											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}
	
							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},
	
			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );
	
				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}
	
				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}
	
				return fn;
			}
		},
	
		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );
	
				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;
	
						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),
	
			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),
	
			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),
	
			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
	
							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),
	
			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},
	
			"root": function( elem ) {
				return elem === docElem;
			},
	
			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},
	
			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},
	
			"disabled": function( elem ) {
				return elem.disabled === true;
			},
	
			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},
	
			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
	
				return elem.selected === true;
			},
	
			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},
	
			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},
	
			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},
	
			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},
	
			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},
	
			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
	
					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},
	
			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),
	
			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),
	
			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),
	
			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};
	
	Expr.pseudos["nth"] = Expr.pseudos["eq"];
	
	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}
	
	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();
	
	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];
	
		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}
	
		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;
	
		while ( soFar ) {
	
			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}
	
			matched = false;
	
			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}
	
			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}
	
			if ( !matched ) {
				break;
			}
		}
	
		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};
	
	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}
	
	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;
	
		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :
	
			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];
	
				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
	
							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});
	
							if ( (oldCache = uniqueCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
	
								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ dir ] = newCache;
	
								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}
	
	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}
	
	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}
	
	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;
	
		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}
	
		return newUnmatched;
	}
	
	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,
	
				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
	
				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,
	
				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
						// ...intermediate processing is necessary
						[] :
	
						// ...otherwise use results directly
						results :
					matcherIn;
	
			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}
	
			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );
	
				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}
	
			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}
	
					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
	
							seed[temp] = !(results[temp] = elem);
						}
					}
				}
	
			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}
	
	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,
	
			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];
	
		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
	
				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}
	
		return elementMatcher( matchers );
	}
	
	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;
	
				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}
	
				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}
	
					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}
	
						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}
	
				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;
	
				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}
	
					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}
	
						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}
	
					// Add matches to results
					push.apply( results, setMatched );
	
					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {
	
						Sizzle.uniqueSort( results );
					}
				}
	
				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}
	
				return unmatched;
			};
	
		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}
	
	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];
	
		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}
	
			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	
			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};
	
	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );
	
		results = results || [];
	
		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {
	
			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {
	
				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
	
				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}
	
				selector = selector.slice( tokens.shift().value.length );
			}
	
			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];
	
				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {
	
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
	
						break;
					}
				}
			}
		}
	
		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};
	
	// One-time assignments
	
	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
	
	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;
	
	// Initialize against the default document
	setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}
	
	return Sizzle;
	
	})( window );
	
	
	
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	
	
	
	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;
	
		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};
	
	
	var siblings = function( n, elem ) {
		var matched = [];
	
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}
	
		return matched;
	};
	
	
	var rneedsContext = jQuery.expr.match.needsContext;
	
	var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );
	
	
	
	var risSimple = /^.[^:#\[\.,]*$/;
	
	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
	
		}
	
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
	
		}
	
		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}
	
			qualifier = jQuery.filter( qualifier, elements );
		}
	
		return jQuery.grep( elements, function( elem ) {
			return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
		} );
	}
	
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];
	
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
	
		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			} ) );
	};
	
	jQuery.fn.extend( {
		find: function( selector ) {
			var i,
				ret = [],
				self = this,
				len = self.length;
	
			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}
	
			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}
	
			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,
	
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );
	
	
	// Initialize a jQuery object
	
	
	// A central reference to the root jQuery(document)
	var rootjQuery,
	
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	
		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;
	
			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}
	
			// init accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;
	
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector.charAt( 0 ) === "<" &&
					selector.charAt( selector.length - 1 ) === ">" &&
					selector.length >= 3 ) {
	
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = rquickExpr.exec( selector );
				}
	
				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;
	
						// scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
	
						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
	
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );
	
								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}
	
						return this;
	
					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );
	
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
	
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id !== match[ 2 ] ) {
								return rootjQuery.find( selector );
							}
	
							// Otherwise, we inject the element directly into the jQuery object
							this.length = 1;
							this[ 0 ] = elem;
						}
	
						this.context = document;
						this.selector = selector;
						return this;
					}
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[ 0 ] = selector;
				this.length = 1;
				return this;
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return typeof root.ready !== "undefined" ?
					root.ready( selector ) :
	
					// Execute immediately if ready is not present
					selector( jQuery );
			}
	
			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}
	
			return jQuery.makeArray( selector, this );
		};
	
	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;
	
	// Initialize central reference
	rootjQuery = jQuery( document );
	
	
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	
		// methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	
	jQuery.fn.extend( {
		has: function( target ) {
			var i,
				targets = jQuery( target, this ),
				len = targets.length;
	
			return this.filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},
	
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;
	
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
	
					// Always skip document fragments
					if ( cur.nodeType < 11 && ( pos ?
						pos.index( cur ) > -1 :
	
						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {
	
						matched.push( cur );
						break;
					}
				}
			}
	
			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},
	
		// Determine the position of an element within
		// the matched set of elements
		index: function( elem ) {
	
			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}
	
			// index in selector
			if ( typeof elem === "string" ) {
				return jQuery.inArray( this[ 0 ], jQuery( elem ) );
			}
	
			// Locate the position of the desired element
			return jQuery.inArray(
	
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem, this );
		},
	
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},
	
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );
	
	function sibling( cur, dir ) {
		do {
			cur = cur[ dir ];
		} while ( cur && cur.nodeType !== 1 );
	
		return cur;
	}
	
	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return jQuery.nodeName( elem, "iframe" ) ?
				elem.contentDocument || elem.contentWindow.document :
				jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var ret = jQuery.map( this, fn, until );
	
			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}
	
			if ( selector && typeof selector === "string" ) {
				ret = jQuery.filter( selector, ret );
			}
	
			if ( this.length > 1 ) {
	
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					ret = jQuery.uniqueSort( ret );
				}
	
				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					ret = ret.reverse();
				}
			}
	
			return this.pushStack( ret );
		};
	} );
	var rnotwhite = ( /\S+/g );
	
	
	
	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {
	
		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );
	
		var // Flag to know if list is currently firing
			firing,
	
			// Last fire value for non-forgettable lists
			memory,
	
			// Flag to know if list was already fired
			fired,
	
			// Flag to prevent firing
			locked,
	
			// Actual callback list
			list = [],
	
			// Queue of execution data for repeatable lists
			queue = [],
	
			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,
	
			// Fire callbacks
			fire = function() {
	
				// Enforce single-firing
				locked = options.once;
	
				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {
	
						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {
	
							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}
	
				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}
	
				firing = false;
	
				// Clean up if we're done firing for good
				if ( locked ) {
	
					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];
	
					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},
	
			// Actual Callbacks object
			self = {
	
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
	
						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}
	
						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {
	
									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );
	
						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
	
							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},
	
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},
	
				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},
	
				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},
	
				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = true;
					if ( !memory ) {
						self.disable();
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},
	
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
	
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};
	
		return self;
	};
	
	
	jQuery.extend( {
	
		Deferred: function( func ) {
			var tuples = [
	
					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
	
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this === promise ? newDefer.promise() : this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
	
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};
	
			// Keep pipe for back-compat
			promise.pipe = promise.then;
	
			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];
	
				// promise[ done | fail | progress ] = list.add
				promise[ tuple[ 1 ] ] = list.add;
	
				// Handle state
				if ( stateString ) {
					list.add( function() {
	
						// state = [ resolved | rejected ]
						state = stateString;
	
					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}
	
				// deferred[ resolve | reject | notify ]
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );
	
			// Make the deferred a promise
			promise.promise( deferred );
	
			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}
	
			// All done!
			return deferred;
		},
	
		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,
	
				// the count of uncompleted subordinates
				remaining = length !== 1 ||
					( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
	
				// the master Deferred.
				// If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
	
				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
	
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},
	
				progressValues, progressContexts, resolveContexts;
	
			// add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.progress( updateFunc( i, progressContexts, progressValues ) )
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject );
					} else {
						--remaining;
					}
				}
			}
	
			// if we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}
	
			return deferred.promise();
		}
	} );
	
	
	// The deferred used on DOM ready
	var readyList;
	
	jQuery.fn.ready = function( fn ) {
	
		// Add the callback
		jQuery.ready.promise().done( fn );
	
		return this;
	};
	
	jQuery.extend( {
	
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
	
		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,
	
		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},
	
		// Handle when the DOM is ready
		ready: function( wait ) {
	
			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}
	
			// Remember that the DOM is ready
			jQuery.isReady = true;
	
			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}
	
			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
	
			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	} );
	
	/**
	 * Clean-up method for dom ready events
	 */
	function detach() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed );
			window.removeEventListener( "load", completed );
	
		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	}
	
	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
	
		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener ||
			window.event.type === "load" ||
			document.readyState === "complete" ) {
	
			detach();
			jQuery.ready();
		}
	}
	
	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {
	
			readyList = jQuery.Deferred();
	
			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE6-10
			// Older IE sometimes signals "interactive" too soon
			if ( document.readyState === "complete" ||
				( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
	
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout( jQuery.ready );
	
			// Standards-based browsers support DOMContentLoaded
			} else if ( document.addEventListener ) {
	
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed );
	
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed );
	
			// If IE event model is used
			} else {
	
				// Ensure firing before onload, maybe late but safe also for iframes
				document.attachEvent( "onreadystatechange", completed );
	
				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", completed );
	
				// If IE and not a frame
				// continually check to see if the document is ready
				var top = false;
	
				try {
					top = window.frameElement == null && document.documentElement;
				} catch ( e ) {}
	
				if ( top && top.doScroll ) {
					( function doScrollCheck() {
						if ( !jQuery.isReady ) {
	
							try {
	
								// Use the trick by Diego Perini
								// http://javascript.nwbox.com/IEContentLoaded/
								top.doScroll( "left" );
							} catch ( e ) {
								return window.setTimeout( doScrollCheck, 50 );
							}
	
							// detach all dom ready events
							detach();
	
							// and execute any waiting functions
							jQuery.ready();
						}
					} )();
				}
			}
		}
		return readyList.promise( obj );
	};
	
	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();
	
	
	
	
	// Support: IE<9
	// Iteration over object's inherited properties before its own
	var i;
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownFirst = i === "0";
	
	// Note: most support tests are defined in their respective modules.
	// false until the test is run
	support.inlineBlockNeedsLayout = false;
	
	// Execute ASAP in case we need to set body.style.zoom
	jQuery( function() {
	
		// Minified: var a,b,c,d
		var val, div, body, container;
	
		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
	
			// Return for frameset docs that don't have a body
			return;
		}
	
		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );
	
		if ( typeof div.style.zoom !== "undefined" ) {
	
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";
	
			support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
			if ( val ) {
	
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}
	
		body.removeChild( container );
	} );
	
	
	( function() {
		var div = document.createElement( "div" );
	
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch ( e ) {
			support.deleteExpando = false;
		}
	
		// Null elements to avoid leaks in IE.
		div = null;
	} )();
	var acceptData = function( elem ) {
		var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
			nodeType = +elem.nodeType || 1;
	
		// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
		return nodeType !== 1 && nodeType !== 9 ?
			false :
	
			// Nodes accept data unless otherwise specified; rejection can be conditional
			!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
	};
	
	
	
	
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /([A-Z])/g;
	
	function dataAttr( elem, key, data ) {
	
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
	
			var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
	
			data = elem.getAttribute( name );
	
			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
	
						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch ( e ) {}
	
				// Make sure we set the data so it isn't changed later
				jQuery.data( elem, key, data );
	
			} else {
				data = undefined;
			}
		}
	
		return data;
	}
	
	// checks a cache object for emptiness
	function isEmptyDataObject( obj ) {
		var name;
		for ( name in obj ) {
	
			// if the public data object is empty, the private is still empty
			if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
				continue;
			}
			if ( name !== "toJSON" ) {
				return false;
			}
		}
	
		return true;
	}
	
	function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !acceptData( elem ) ) {
			return;
		}
	
		var ret, thisCache,
			internalKey = jQuery.expando,
	
			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,
	
			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,
	
			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
	
		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
			data === undefined && typeof name === "string" ) {
			return;
		}
	
		if ( !id ) {
	
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}
	
		if ( !cache[ id ] ) {
	
			// Avoid exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
		}
	
		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}
	
		thisCache = cache[ id ];
	
		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}
	
			thisCache = thisCache.data;
		}
	
		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}
	
		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( typeof name === "string" ) {
	
			// First Try to find as-is property data
			ret = thisCache[ name ];
	
			// Test for null|undefined property data
			if ( ret == null ) {
	
				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}
	
		return ret;
	}
	
	function internalRemoveData( elem, name, pvt ) {
		if ( !acceptData( elem ) ) {
			return;
		}
	
		var thisCache, i,
			isNode = elem.nodeType,
	
			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;
	
		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}
	
		if ( name ) {
	
			thisCache = pvt ? cache[ id ] : cache[ id ].data;
	
			if ( thisCache ) {
	
				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {
	
					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {
	
						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				} else {
	
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = name.concat( jQuery.map( name, jQuery.camelCase ) );
				}
	
				i = name.length;
				while ( i-- ) {
					delete thisCache[ name[ i ] ];
				}
	
				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
					return;
				}
			}
		}
	
		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;
	
			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}
	
		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );
	
		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		/* jshint eqeqeq: false */
		} else if ( support.deleteExpando || cache != cache.window ) {
			/* jshint eqeqeq: true */
			delete cache[ id ];
	
		// When all else fails, undefined
		} else {
			cache[ id ] = undefined;
		}
	}
	
	jQuery.extend( {
		cache: {},
	
		// The following elements (space-suffixed to avoid Object.prototype collisions)
		// throw uncatchable exceptions if you attempt to set expando properties
		noData: {
			"applet ": true,
			"embed ": true,
	
			// ...but Flash objects (which have this classid) *can* handle expandos
			"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
		},
	
		hasData: function( elem ) {
			elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
			return !!elem && !isEmptyDataObject( elem );
		},
	
		data: function( elem, name, data ) {
			return internalData( elem, name, data );
		},
	
		removeData: function( elem, name ) {
			return internalRemoveData( elem, name );
		},
	
		// For internal use only.
		_data: function( elem, name, data ) {
			return internalData( elem, name, data, true );
		},
	
		_removeData: function( elem, name ) {
			return internalRemoveData( elem, name, true );
		}
	} );
	
	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;
	
			// Special expections of .data basically thwart jQuery.access,
			// so implement the relevant behavior ourselves
	
			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = jQuery.data( elem );
	
					if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {
	
							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						jQuery._data( elem, "parsedAttrs", true );
					}
				}
	
				return data;
			}
	
			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					jQuery.data( this, key );
				} );
			}
	
			return arguments.length > 1 ?
	
				// Sets one value
				this.each( function() {
					jQuery.data( this, key, value );
				} ) :
	
				// Gets one value
				// Try to fetch any internally stored data first
				elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
		},
	
		removeData: function( key ) {
			return this.each( function() {
				jQuery.removeData( this, key );
			} );
		}
	} );
	
	
	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;
	
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = jQuery._data( elem, type );
	
				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},
	
		dequeue: function( elem, type ) {
			type = type || "fx";
	
			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};
	
			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}
	
			if ( fn ) {
	
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}
	
				// clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}
	
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},
	
		// not intended for public consumption - generates a queueHooks object,
		// or returns the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return jQuery._data( elem, key ) || jQuery._data( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					jQuery._removeData( elem, type + "queue" );
					jQuery._removeData( elem, key );
				} )
			} );
		}
	} );
	
	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;
	
			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}
	
			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}
	
			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );
	
					// ensure a hooks for this queue
					jQuery._queueHooks( this, type );
	
					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
	
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};
	
			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";
	
			while ( i-- ) {
				tmp = jQuery._data( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	
	
	( function() {
		var shrinkWrapBlocksVal;
	
		support.shrinkWrapBlocks = function() {
			if ( shrinkWrapBlocksVal != null ) {
				return shrinkWrapBlocksVal;
			}
	
			// Will be changed later if needed.
			shrinkWrapBlocksVal = false;
	
			// Minified: var b,c,d
			var div, body, container;
	
			body = document.getElementsByTagName( "body" )[ 0 ];
			if ( !body || !body.style ) {
	
				// Test fired too early or in an unsupported environment, exit.
				return;
			}
	
			// Setup
			div = document.createElement( "div" );
			container = document.createElement( "div" );
			container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
			body.appendChild( container ).appendChild( div );
	
			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			if ( typeof div.style.zoom !== "undefined" ) {
	
				// Reset CSS: box-sizing; display; margin; border
				div.style.cssText =
	
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;" +
					"padding:1px;width:1px;zoom:1";
				div.appendChild( document.createElement( "div" ) ).style.width = "5px";
				shrinkWrapBlocksVal = div.offsetWidth !== 3;
			}
	
			body.removeChild( container );
	
			return shrinkWrapBlocksVal;
		};
	
	} )();
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
	
	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
	
	
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	var isHidden = function( elem, el ) {
	
			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" ||
				!jQuery.contains( elem.ownerDocument, elem );
		};
	
	
	
	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() { return tween.cur(); } :
				function() { return jQuery.css( elem, prop, "" ); },
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );
	
		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
	
			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];
	
			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
	
			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;
	
			do {
	
				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";
	
				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );
	
			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}
	
		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;
	
			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	
	
	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;
	
		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}
	
		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
	
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
	
				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
	
			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn(
						elems[ i ],
						key,
						raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}
	
		return chainable ?
			elems :
	
			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var rcheckableType = ( /^(?:checkbox|radio)$/i );
	
	var rtagName = ( /<([\w:-]+)/ );
	
	var rscriptType = ( /^$|\/(?:java|ecma)script/i );
	
	var rleadingWhitespace = ( /^\s+/ );
	
	var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
			"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
			"mark|meter|nav|output|picture|progress|section|summary|template|time|video";
	
	
	
	function createSafeFragment( document ) {
		var list = nodeNames.split( "|" ),
			safeFrag = document.createDocumentFragment();
	
		if ( safeFrag.createElement ) {
			while ( list.length ) {
				safeFrag.createElement(
					list.pop()
				);
			}
		}
		return safeFrag;
	}
	
	
	( function() {
		var div = document.createElement( "div" ),
			fragment = document.createDocumentFragment(),
			input = document.createElement( "input" );
	
		// Setup
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	
		// IE strips leading whitespace when .innerHTML is used
		support.leadingWhitespace = div.firstChild.nodeType === 3;
	
		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		support.tbody = !div.getElementsByTagName( "tbody" ).length;
	
		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;
	
		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		support.html5Clone =
			document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";
	
		// Check if a disconnected checkbox will retain its checked
		// value of true after appended to the DOM (IE6/7)
		input.type = "checkbox";
		input.checked = true;
		fragment.appendChild( input );
		support.appendChecked = input.checked;
	
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		// Support: IE6-IE11+
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	
		// #11217 - WebKit loses check when the name is after the checked attribute
		fragment.appendChild( div );
	
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input = document.createElement( "input" );
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
	
		// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
		// old WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Support: IE<9
		// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
		support.noCloneEvent = !!div.addEventListener;
	
		// Support: IE<9
		// Since attributes and properties are the same in IE,
		// cleanData must set properties to undefined rather than use removeAttribute
		div[ jQuery.expando ] = 1;
		support.attributes = !div.getAttribute( jQuery.expando );
	} )();
	
	
	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
	
		// Support: IE8
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
	};
	
	// Support: IE8-IE9
	wrapMap.optgroup = wrapMap.option;
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	
	function getAll( context, tag ) {
		var elems, elem,
			i = 0,
			found = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( tag || "*" ) :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll( tag || "*" ) :
					undefined;
	
		if ( !found ) {
			for ( found = [], elems = context.childNodes || context;
				( elem = elems[ i ] ) != null;
				i++
			) {
				if ( !tag || jQuery.nodeName( elem, tag ) ) {
					found.push( elem );
				} else {
					jQuery.merge( found, getAll( elem, tag ) );
				}
			}
		}
	
		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], found ) :
			found;
	}
	
	
	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var elem,
			i = 0;
		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			jQuery._data(
				elem,
				"globalEval",
				!refElements || jQuery._data( refElements[ i ], "globalEval" )
			);
		}
	}
	
	
	var rhtml = /<|&#?\w+;/,
		rtbody = /<tbody/i;
	
	function fixDefaultChecked( elem ) {
		if ( rcheckableType.test( elem.type ) ) {
			elem.defaultChecked = elem.checked;
		}
	}
	
	function buildFragment( elems, context, scripts, selection, ignored ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,
	
			// Ensure a safe fragment
			safe = createSafeFragment( context ),
	
			nodes = [],
			i = 0;
	
		for ( ; i < l; i++ ) {
			elem = elems[ i ];
	
			if ( elem || elem === 0 ) {
	
				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
	
				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement( "div" ) );
	
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
	
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
	
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
	
					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
					}
	
					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {
	
						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :
	
							// String was a bare <thead> or <tfoot>
							wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;
	
						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
								!tbody.childNodes.length ) {
	
								elem.removeChild( tbody );
							}
						}
					}
	
					jQuery.merge( nodes, tmp.childNodes );
	
					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";
	
					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}
	
					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}
	
		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}
	
		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}
	
		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {
	
			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
	
				continue;
			}
	
			contains = jQuery.contains( elem.ownerDocument, elem );
	
			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );
	
			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}
	
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}
	
		tmp = null;
	
		return safe;
	}
	
	
	( function() {
		var i, eventName,
			div = document.createElement( "div" );
	
		// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
		for ( i in { submit: true, change: true, focusin: true } ) {
			eventName = "on" + i;
	
			if ( !( support[ i ] = eventName in window ) ) {
	
				// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
				div.setAttribute( eventName, "t" );
				support[ i ] = div.attributes[ eventName ].expando === false;
			}
		}
	
		// Null elements to avoid leaks in IE.
		div = null;
	} )();
	
	
	var rformElems = /^(?:input|select|textarea)$/i,
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
	
	function returnTrue() {
		return true;
	}
	
	function returnFalse() {
		return false;
	}
	
	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}
	
	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;
	
		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
	
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
	
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}
	
		if ( data == null && fn == null ) {
	
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
	
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
	
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}
	
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
	
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
	
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}
	
	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {
	
		global: {},
	
		add: function( elem, types, handler, data, selector ) {
			var tmp, events, t, handleObjIn,
				special, eventHandle, handleObj,
				handlers, type, namespaces, origType,
				elemData = jQuery._data( elem );
	
			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}
	
			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}
	
			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}
	
			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {
	
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" &&
						( !e || jQuery.event.triggered !== e.type ) ?
						jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
						undefined;
				};
	
				// Add elem as a property of the handle fn to prevent a memory leak
				// with IE non-native events
				eventHandle.elem = elem;
			}
	
			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}
	
				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};
	
				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;
	
				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};
	
				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );
	
				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;
	
					// Only use addEventListener/attachEvent if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	
						// Bind the global event handler to the element
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle, false );
	
						} else if ( elem.attachEvent ) {
							elem.attachEvent( "on" + type, eventHandle );
						}
					}
				}
	
				if ( special.add ) {
					special.add.call( elem, handleObj );
	
					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}
	
				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}
	
				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}
	
			// Nullify elem to prevent memory leaks in IE
			elem = null;
		},
	
		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
			var j, handleObj, tmp,
				origCount, t, events,
				special, handlers, type,
				namespaces, origType,
				elemData = jQuery.hasData( elem ) && jQuery._data( elem );
	
			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}
	
			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}
	
				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
	
				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];
	
					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );
	
						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}
	
				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
	
						jQuery.removeEvent( elem, type, elemData.handle );
					}
	
					delete events[ type ];
				}
			}
	
			// Remove the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				delete elemData.handle;
	
				// removeData also checks for emptiness and clears the expando if empty
				// so use it instead of delete
				jQuery._removeData( elem, "events" );
			}
		},
	
		trigger: function( event, data, elem, onlyHandlers ) {
			var handle, ontype, cur,
				bubbleType, special, tmp, i,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];
	
			cur = tmp = elem = elem || document;
	
			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}
	
			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}
	
			if ( type.indexOf( "." ) > -1 ) {
	
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;
	
			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );
	
			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;
	
			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}
	
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );
	
			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}
	
			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
	
				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}
	
				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}
	
			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
	
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;
	
				// jQuery handler
				handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
					jQuery._data( cur, "handle" );
	
				if ( handle ) {
					handle.apply( cur, data );
				}
	
				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;
	
			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
				if (
					( !special._default ||
					 special._default.apply( eventPath.pop(), data ) === false
					) && acceptData( elem )
				) {
	
					// Call a native DOM method on the target with the same name name as the event.
					// Can't use an .isFunction() check here because IE6/7 fails that test.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {
	
						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];
	
						if ( tmp ) {
							elem[ ontype ] = null;
						}
	
						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						try {
							elem[ type ]();
						} catch ( e ) {
	
							// IE<9 dies on focus/blur to hidden element (#1486,#12518)
							// only reproducible on winXP IE8 native, not IE9 in IE8 mode
						}
						jQuery.event.triggered = undefined;
	
						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}
	
			return event.result;
		},
	
		dispatch: function( event ) {
	
			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );
	
			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};
	
			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
			event.delegateTarget = this;
	
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}
	
			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;
	
				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {
	
					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {
	
						event.handleObj = handleObj;
						event.data = handleObj.data;
	
						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );
	
						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}
	
			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}
	
			return event.result;
		},
	
		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
	
			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if ( delegateCount && cur.nodeType &&
				( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {
	
				/* jshint eqeqeq: false */
				for ( ; cur != this; cur = cur.parentNode || this ) {
					/* jshint eqeqeq: true */
	
					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
	
							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";
	
							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push( { elem: cur, handlers: matches } );
						}
					}
				}
			}
	
			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
			}
	
			return handlerQueue;
		},
	
		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}
	
			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];
	
			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
	
			event = new jQuery.Event( originalEvent );
	
			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}
	
			// Support: IE<9
			// Fix target property (#1925)
			if ( !event.target ) {
				event.target = originalEvent.srcElement || document;
			}
	
			// Support: Safari 6-8+
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}
	
			// Support: IE<9
			// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
			event.metaKey = !!event.metaKey;
	
			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},
	
		// Includes some event props shared by KeyEvent and MouseEvent
		props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),
	
		fixHooks: {},
	
		keyHooks: {
			props: "char charCode key keyCode".split( " " ),
			filter: function( event, original ) {
	
				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}
	
				return event;
			}
		},
	
		mouseHooks: {
			props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
				"pageX pageY screenX screenY toElement" ).split( " " ),
			filter: function( event, original ) {
				var body, eventDoc, doc,
					button = original.button,
					fromElement = original.fromElement;
	
				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;
	
					event.pageX = original.clientX +
						( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
						( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY +
						( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
						( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}
	
				// Add relatedTarget, if necessary
				if ( !event.relatedTarget && fromElement ) {
					event.relatedTarget = fromElement === event.target ?
						original.toElement :
						fromElement;
				}
	
				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}
	
				return event;
			}
		},
	
		special: {
			load: {
	
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
	
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						try {
							this.focus();
							return false;
						} catch ( e ) {
	
							// Support: IE<9
							// If we error on focus to hidden element (#1486, #12518),
							// let .trigger() run the handlers
						}
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
	
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
						this.click();
						return false;
					}
				},
	
				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},
	
			beforeunload: {
				postDispatch: function( event ) {
	
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},
	
		// Piggyback on a donor event to simulate a different one
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
	
					// Previously, `originalEvent: {}` was set here, so stopPropagation call
					// would not be triggered on donor event, since in our own
					// jQuery.event.stopPropagation function we had a check for existence of
					// originalEvent.stopPropagation method, so, consequently it would be a noop.
					//
					// Guard for simulated events was moved to jQuery.event.stopPropagation function
					// since `originalEvent` should point to the original event for the
					// constancy with other events and for more focused logic
				}
			);
	
			jQuery.event.trigger( e, null, elem );
	
			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}
	};
	
	jQuery.removeEvent = document.removeEventListener ?
		function( elem, type, handle ) {
	
			// This "if" is needed for plain objects
			if ( elem.removeEventListener ) {
				elem.removeEventListener( type, handle );
			}
		} :
		function( elem, type, handle ) {
			var name = "on" + type;
	
			if ( elem.detachEvent ) {
	
				// #8545, #7054, preventing memory leaks for custom events in IE6-8
				// detachEvent needed property on element, by name of that event,
				// to properly expose it to GC
				if ( typeof elem[ name ] === "undefined" ) {
					elem[ name ] = null;
				}
	
				elem.detachEvent( name, handle );
			}
		};
	
	jQuery.Event = function( src, props ) {
	
		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}
	
		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
	
					// Support: IE < 9, Android < 4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}
	
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();
	
		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
	
		preventDefault: function() {
			var e = this.originalEvent;
	
			this.isDefaultPrevented = returnTrue;
			if ( !e ) {
				return;
			}
	
			// If preventDefault exists, run it on the original event
			if ( e.preventDefault ) {
				e.preventDefault();
	
			// Support: IE
			// Otherwise set the returnValue property of the original event to false
			} else {
				e.returnValue = false;
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;
	
			this.isPropagationStopped = returnTrue;
	
			if ( !e || this.isSimulated ) {
				return;
			}
	
			// If stopPropagation exists, run it on the original event
			if ( e.stopPropagation ) {
				e.stopPropagation();
			}
	
			// Support: IE
			// Set the cancelBubble property of the original event to true
			e.cancelBubble = true;
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
	
			this.isImmediatePropagationStopped = returnTrue;
	
			if ( e && e.stopImmediatePropagation ) {
				e.stopImmediatePropagation();
			}
	
			this.stopPropagation();
		}
	};
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,
	
			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
	
				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );
	
	// IE submit delegation
	if ( !support.submit ) {
	
		jQuery.event.special.submit = {
			setup: function() {
	
				// Only need this for delegated form submit events
				if ( jQuery.nodeName( this, "form" ) ) {
					return false;
				}
	
				// Lazy-add a submit handler when a descendant form may potentially be submitted
				jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
	
					// Node name check avoids a VML-related crash in IE (#9807)
					var elem = e.target,
						form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?
	
							// Support: IE <=8
							// We use jQuery.prop instead of elem.form
							// to allow fixing the IE8 delegated submit issue (gh-2332)
							// by 3rd party polyfills/workarounds.
							jQuery.prop( elem, "form" ) :
							undefined;
	
					if ( form && !jQuery._data( form, "submit" ) ) {
						jQuery.event.add( form, "submit._submit", function( event ) {
							event._submitBubble = true;
						} );
						jQuery._data( form, "submit", true );
					}
				} );
	
				// return undefined since we don't need an event listener
			},
	
			postDispatch: function( event ) {
	
				// If form was submitted by the user, bubble the event up the tree
				if ( event._submitBubble ) {
					delete event._submitBubble;
					if ( this.parentNode && !event.isTrigger ) {
						jQuery.event.simulate( "submit", this.parentNode, event );
					}
				}
			},
	
			teardown: function() {
	
				// Only need this for delegated form submit events
				if ( jQuery.nodeName( this, "form" ) ) {
					return false;
				}
	
				// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
				jQuery.event.remove( this, "._submit" );
			}
		};
	}
	
	// IE change delegation and checkbox/radio fix
	if ( !support.change ) {
	
		jQuery.event.special.change = {
	
			setup: function() {
	
				if ( rformElems.test( this.nodeName ) ) {
	
					// IE doesn't fire change on a check/radio until blur; trigger it on click
					// after a propertychange. Eat the blur-change in special.change.handle.
					// This still fires onchange a second time for check/radio after blur.
					if ( this.type === "checkbox" || this.type === "radio" ) {
						jQuery.event.add( this, "propertychange._change", function( event ) {
							if ( event.originalEvent.propertyName === "checked" ) {
								this._justChanged = true;
							}
						} );
						jQuery.event.add( this, "click._change", function( event ) {
							if ( this._justChanged && !event.isTrigger ) {
								this._justChanged = false;
							}
	
							// Allow triggered, simulated change events (#11500)
							jQuery.event.simulate( "change", this, event );
						} );
					}
					return false;
				}
	
				// Delegated event; lazy-add a change handler on descendant inputs
				jQuery.event.add( this, "beforeactivate._change", function( e ) {
					var elem = e.target;
	
					if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
						jQuery.event.add( elem, "change._change", function( event ) {
							if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
								jQuery.event.simulate( "change", this.parentNode, event );
							}
						} );
						jQuery._data( elem, "change", true );
					}
				} );
			},
	
			handle: function( event ) {
				var elem = event.target;
	
				// Swallow native change events from checkbox/radio, we already triggered them above
				if ( this !== elem || event.isSimulated || event.isTrigger ||
					( elem.type !== "radio" && elem.type !== "checkbox" ) ) {
	
					return event.handleObj.handler.apply( this, arguments );
				}
			},
	
			teardown: function() {
				jQuery.event.remove( this, "._change" );
	
				return !rformElems.test( this.nodeName );
			}
		};
	}
	
	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};
	
			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = jQuery._data( doc, fix );
	
					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = jQuery._data( doc, fix ) - 1;
	
					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						jQuery._removeData( doc, fix );
					} else {
						jQuery._data( doc, fix, attaches );
					}
				}
			};
		} );
	}
	
	jQuery.fn.extend( {
	
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
	
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
	
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
	
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		},
	
		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );
	
	
	var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
		rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
	
		// Support: IE 10-11, Edge 10240+
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,
	
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
		safeFragment = createSafeFragment( document ),
		fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );
	
	// Support: IE<8
	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?
	
			elem.getElementsByTagName( "tbody" )[ 0 ] ||
				elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
			elem;
	}
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );
		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}
		return elem;
	}
	
	function cloneCopyEvent( src, dest ) {
		if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
			return;
		}
	
		var type, i, l,
			oldData = jQuery._data( src ),
			curData = jQuery._data( dest, oldData ),
			events = oldData.events;
	
		if ( events ) {
			delete curData.handle;
			curData.events = {};
	
			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	
		// make the cloned public data object a copy from the original
		if ( curData.data ) {
			curData.data = jQuery.extend( {}, curData.data );
		}
	}
	
	function fixCloneNodeIssues( src, dest ) {
		var nodeName, e, data;
	
		// We do not need to do anything for non-Elements
		if ( dest.nodeType !== 1 ) {
			return;
		}
	
		nodeName = dest.nodeName.toLowerCase();
	
		// IE6-8 copies events bound via attachEvent when using cloneNode.
		if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
			data = jQuery._data( dest );
	
			for ( e in data.events ) {
				jQuery.removeEvent( dest, e, data.handle );
			}
	
			// Event data gets referenced instead of copied if the expando gets copied too
			dest.removeAttribute( jQuery.expando );
		}
	
		// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
		if ( nodeName === "script" && dest.text !== src.text ) {
			disableScript( dest ).text = src.text;
			restoreScript( dest );
	
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		} else if ( nodeName === "object" ) {
			if ( dest.parentNode ) {
				dest.outerHTML = src.outerHTML;
			}
	
			// This path appears unavoidable for IE9. When cloning an object
			// element in IE9, the outerHTML strategy above is not sufficient.
			// If the src has innerHTML and the destination does not,
			// copy the src.innerHTML into the dest.innerHTML. #10324
			if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
				dest.innerHTML = src.innerHTML;
			}
	
		} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
	
			// IE6-8 fails to persist the checked state of a cloned checkbox
			// or radio button. Worse, IE6-7 fail to give the cloned element
			// a checked appearance if the defaultChecked value isn't also set
	
			dest.defaultChecked = dest.checked = src.checked;
	
			// IE6-7 get confused and end up setting the value of a cloned
			// checkbox/radio button to an empty string instead of "on"
			if ( dest.value !== src.value ) {
				dest.value = src.value;
			}
	
		// IE6-8 fails to return the selected option to the default selected
		// state when cloning options
		} else if ( nodeName === "option" ) {
			dest.defaultSelected = dest.selected = src.defaultSelected;
	
		// IE6-8 fails to set the defaultValue to the correct value when
		// cloning other types of input fields
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}
	
	function domManip( collection, args, callback, ignored ) {
	
		// Flatten any nested arrays
		args = concat.apply( [], args );
	
		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );
	
		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}
	
		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;
	
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}
	
			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;
	
				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
	
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );
	
						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
	
							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
	
					callback.call( collection[ i ], node, i );
				}
	
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;
	
					// Reenable scripts
					jQuery.map( scripts, restoreScript );
	
					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {
	
							if ( node.src ) {
	
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval(
									( node.text || node.textContent || node.innerHTML || "" )
										.replace( rcleanScript, "" )
								);
							}
						}
					}
				}
	
				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}
	
		return collection;
	}
	
	function remove( elem, selector, keepData ) {
		var node,
			elems = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;
	
		for ( ; ( node = elems[ i ] ) != null; i++ ) {
	
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}
	
			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}
	
		return elem;
	}
	
	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},
	
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var destElements, node, clone, i, srcElements,
				inPage = jQuery.contains( elem.ownerDocument, elem );
	
			if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
				!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
	
				clone = elem.cloneNode( true );
	
			// IE<=8 does not properly clone detached, unknown element nodes
			} else {
				fragmentDiv.innerHTML = elem.outerHTML;
				fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
			}
	
			if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
					( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {
	
				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );
	
				// Fix all IE cloning issues
				for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {
	
					// Ensure that the destination node is not null; Fixes #9587
					if ( destElements[ i ] ) {
						fixCloneNodeIssues( node, destElements[ i ] );
					}
				}
			}
	
			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );
	
					for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
						cloneCopyEvent( node, destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}
	
			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}
	
			destElements = srcElements = node = null;
	
			// Return the cloned set
			return clone;
		},
	
		cleanData: function( elems, /* internal */ forceAcceptData ) {
			var elem, type, id, data,
				i = 0,
				internalKey = jQuery.expando,
				cache = jQuery.cache,
				attributes = support.attributes,
				special = jQuery.event.special;
	
			for ( ; ( elem = elems[ i ] ) != null; i++ ) {
				if ( forceAcceptData || acceptData( elem ) ) {
	
					id = elem[ internalKey ];
					data = id && cache[ id ];
	
					if ( data ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );
	
								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
	
						// Remove cache only if it was not already removed by jQuery.event.remove
						if ( cache[ id ] ) {
	
							delete cache[ id ];
	
							// Support: IE<9
							// IE does not allow us to delete expando properties from nodes
							// IE creates expando attributes along with the property
							// IE does not have a removeAttribute function on Document nodes
							if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
								elem.removeAttribute( internalKey );
	
							// Webkit & Blink performance suffers when deleting properties
							// from DOM nodes, so set to undefined instead
							// https://code.google.com/p/chromium/issues/detail?id=378607
							} else {
								elem[ internalKey ] = undefined;
							}
	
							deletedIds.push( id );
						}
					}
				}
			}
		}
	} );
	
	jQuery.fn.extend( {
	
		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,
	
		detach: function( selector ) {
			return remove( this, selector, true );
		},
	
		remove: function( selector ) {
			return remove( this, selector );
		},
	
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().append(
						( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
					);
			}, null, value, arguments.length );
		},
	
		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},
	
		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},
	
		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},
	
		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},
	
		empty: function() {
			var elem,
				i = 0;
	
			for ( ; ( elem = this[ i ] ) != null; i++ ) {
	
				// Remove element nodes and prevent memory leaks
				if ( elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem, false ) );
				}
	
				// Remove any remaining nodes
				while ( elem.firstChild ) {
					elem.removeChild( elem.firstChild );
				}
	
				// If this is a select, ensure that it displays empty (#12336)
				// Support: IE<9
				if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
					elem.options.length = 0;
				}
			}
	
			return this;
		},
	
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},
	
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;
	
				if ( value === undefined ) {
					return elem.nodeType === 1 ?
						elem.innerHTML.replace( rinlinejQuery, "" ) :
						undefined;
				}
	
				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
					( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
	
					value = jQuery.htmlPrefilter( value );
	
					try {
						for ( ; i < l; i++ ) {
	
							// Remove element nodes and prevent memory leaks
							elem = this[ i ] || {};
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}
	
						elem = 0;
	
					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}
	
				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},
	
		replaceWith: function() {
			var ignored = [];
	
			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;
	
				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}
	
			// Force callback invocation
			}, ignored );
		}
	} );
	
	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				i = 0,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1;
	
			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );
	
				// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
				push.apply( ret, elems.get() );
			}
	
			return this.pushStack( ret );
		};
	} );
	
	
	var iframe,
		elemdisplay = {
	
			// Support: Firefox
			// We have to pre-define these values for FF (#10227)
			HTML: "block",
			BODY: "block"
		};
	
	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */
	
	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
	
			display = jQuery.css( elem[ 0 ], "display" );
	
		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();
	
		return display;
	}
	
	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];
	
		if ( !display ) {
			display = actualDisplay( nodeName, doc );
	
			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {
	
				// Use the already-created iframe if possible
				iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
					.appendTo( doc.documentElement );
	
				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;
	
				// Support: IE
				doc.write();
				doc.close();
	
				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}
	
			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}
	
		return display;
	}
	var rmargin = ( /^margin/ );
	
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
	
	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};
	
		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
	
		ret = callback.apply( elem, args || [] );
	
		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	
		return ret;
	};
	
	
	var documentElement = document.documentElement;
	
	
	
	( function() {
		var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
			reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );
	
		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}
	
		div.style.cssText = "float:left;opacity:.5";
	
		// Support: IE<9
		// Make sure that element opacity exists (as opposed to filter)
		support.opacity = div.style.opacity === "0.5";
	
		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		support.cssFloat = !!div.style.cssFloat;
	
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
		container = document.createElement( "div" );
		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		div.innerHTML = "";
		container.appendChild( div );
	
		// Support: Firefox<29, Android 2.3
		// Vendor-prefix box-sizing
		support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
			div.style.WebkitBoxSizing === "";
	
		jQuery.extend( support, {
			reliableHiddenOffsets: function() {
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableHiddenOffsetsVal;
			},
	
			boxSizingReliable: function() {
	
				// We're checking for pixelPositionVal here instead of boxSizingReliableVal
				// since that compresses better and they're computed together anyway.
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return boxSizingReliableVal;
			},
	
			pixelMarginRight: function() {
	
				// Support: Android 4.0-4.3
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},
	
			pixelPosition: function() {
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return pixelPositionVal;
			},
	
			reliableMarginRight: function() {
	
				// Support: Android 2.3
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableMarginRightVal;
			},
	
			reliableMarginLeft: function() {
	
				// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			}
		} );
	
		function computeStyleTests() {
			var contents, divStyle,
				documentElement = document.documentElement;
	
			// Setup
			documentElement.appendChild( container );
	
			div.style.cssText =
	
				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
	
			// Support: IE<9
			// Assume reasonable values in the absence of getComputedStyle
			pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
			pixelMarginRightVal = reliableMarginRightVal = true;
	
			// Check for getComputedStyle so that this code is not run in IE<9.
			if ( window.getComputedStyle ) {
				divStyle = window.getComputedStyle( div );
				pixelPositionVal = ( divStyle || {} ).top !== "1%";
				reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
				boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";
	
				// Support: Android 4.0 - 4.3 only
				// Some styles come back with percentage values, even though they shouldn't
				div.style.marginRight = "50%";
				pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";
	
				// Support: Android 2.3 only
				// Div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				contents = div.appendChild( document.createElement( "div" ) );
	
				// Reset CSS: box-sizing; display; margin; border; padding
				contents.style.cssText = div.style.cssText =
	
					// Support: Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				contents.style.marginRight = contents.style.width = "0";
				div.style.width = "1px";
	
				reliableMarginRightVal =
					!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );
	
				div.removeChild( contents );
			}
	
			// Support: IE6-8
			// First check that getClientRects works as expected
			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			div.style.display = "none";
			reliableHiddenOffsetsVal = div.getClientRects().length === 0;
			if ( reliableHiddenOffsetsVal ) {
				div.style.display = "";
				div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
				div.childNodes[ 0 ].style.borderCollapse = "separate";
				contents = div.getElementsByTagName( "td" );
				contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
				if ( reliableHiddenOffsetsVal ) {
					contents[ 0 ].style.display = "";
					contents[ 1 ].style.display = "none";
					reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
				}
			}
	
			// Teardown
			documentElement.removeChild( container );
		}
	
	} )();
	
	
	var getStyles, curCSS,
		rposition = /^(top|right|bottom|left)$/;
	
	if ( window.getComputedStyle ) {
		getStyles = function( elem ) {
	
			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;
	
			if ( !view || !view.opener ) {
				view = window;
			}
	
			return view.getComputedStyle( elem );
		};
	
		curCSS = function( elem, name, computed ) {
			var width, minWidth, maxWidth, ret,
				style = elem.style;
	
			computed = computed || getStyles( elem );
	
			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;
	
			// Support: Opera 12.1x only
			// Fall back to style even without computed
			// computed is undefined for elems on document fragments
			if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}
	
			if ( computed ) {
	
				// A tribute to the "awesome hack by Dean Edwards"
				// Chrome < 17 and Safari 5.0 uses "computed value"
				// instead of "used value" for margin-right
				// Safari 5.1.7 (at least) returns percentage for a larger set of values,
				// but width seems to be reliably pixels
				// this is against the CSSOM draft spec:
				// http://dev.w3.org/csswg/cssom/#resolved-values
				if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {
	
					// Remember the original values
					width = style.width;
					minWidth = style.minWidth;
					maxWidth = style.maxWidth;
	
					// Put in the new values to get a computed value out
					style.minWidth = style.maxWidth = style.width = ret;
					ret = computed.width;
	
					// Revert the changed values
					style.width = width;
					style.minWidth = minWidth;
					style.maxWidth = maxWidth;
				}
			}
	
			// Support: IE
			// IE returns zIndex value as an integer.
			return ret === undefined ?
				ret :
				ret + "";
		};
	} else if ( documentElement.currentStyle ) {
		getStyles = function( elem ) {
			return elem.currentStyle;
		};
	
		curCSS = function( elem, name, computed ) {
			var left, rs, rsLeft, ret,
				style = elem.style;
	
			computed = computed || getStyles( elem );
			ret = computed ? computed[ name ] : undefined;
	
			// Avoid setting ret to empty string here
			// so we don't default to auto
			if ( ret == null && style && style[ name ] ) {
				ret = style[ name ];
			}
	
			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
	
			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			// but not position css attributes, as those are
			// proportional to the parent element instead
			// and we can't measure the parent instead because it
			// might trigger a "stacking dolls" problem
			if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {
	
				// Remember the original values
				left = style.left;
				rs = elem.runtimeStyle;
				rsLeft = rs && rs.left;
	
				// Put in the new values to get a computed value out
				if ( rsLeft ) {
					rs.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : ret;
				ret = style.pixelLeft + "px";
	
				// Revert the changed values
				style.left = left;
				if ( rsLeft ) {
					rs.left = rsLeft;
				}
			}
	
			// Support: IE
			// IE returns zIndex value as an integer.
			return ret === undefined ?
				ret :
				ret + "" || "auto";
		};
	}
	
	
	
	
	function addGetHookIf( conditionFn, hookFn ) {
	
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
	
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}
	
				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}
	
	
	var
	
			ralpha = /alpha\([^)]*\)/i,
		ropacity = /opacity\s*=\s*([^)]*)/i,
	
		// swappable if display is none or starts with table except
		// "table", "table-cell", or "table-caption"
		// see here for display values:
		// https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
	
		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;
	
	
	// return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {
	
		// shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}
	
		// check for vendor prefixed names
		var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;
	
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}
	
	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;
	
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
	
			values[ index ] = jQuery._data( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {
	
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}
	
				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] =
						jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
				}
			} else {
				hidden = isHidden( elem );
	
				if ( display && display !== "none" || !hidden ) {
					jQuery._data(
						elem,
						"olddisplay",
						hidden ? display : jQuery.css( elem, "display" )
					);
				}
			}
		}
	
		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}
	
		return elements;
	}
	
	function setPositiveNumber( elem, value, subtract ) {
		var matches = rnumsplit.exec( value );
		return matches ?
	
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
	}
	
	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?
	
			// If we already have the right measurement, avoid augmentation
			4 :
	
			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,
	
			val = 0;
	
		for ( ; i < 4; i += 2 ) {
	
			// both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}
	
			if ( isBorderBox ) {
	
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}
	
				// at this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
	
				// at this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
				// at this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}
	
		return val;
	}
	
	function getWidthOrHeight( elem, name, extra ) {
	
		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = support.boxSizing &&
				jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
		// some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
	
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}
	
			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}
	
			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );
	
			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}
	
		// use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}
	
	jQuery.extend( {
	
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
	
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
	
		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
	
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
	
			// normalize float css property
			"float": support.cssFloat ? "cssFloat" : "styleFloat"
		},
	
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
	
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;
	
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );
	
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that null and NaN values aren't set. See: #7116
				if ( value == null || value !== value ) {
					return;
				}
	
				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}
	
				// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
				// but it would mean to define eight
				// (for every problematic property) identical functions
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {
	
					// Support: IE
					// Swallow errors from 'invalid' CSS values (#5509)
					try {
						style[ name ] = value;
					} catch ( e ) {}
				}
	
			} else {
	
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
	
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra, styles ) {
			var num, val, hooks,
				origName = jQuery.camelCase( name );
	
			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}
	
			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}
	
			//convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}
	
			// Return, converting to number if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );
	
	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
	
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
						elem.offsetWidth === 0 ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},
	
			set: function( elem, value, extra ) {
				var styles = extra && getStyles( elem );
				return setPositiveNumber( elem, value, extra ?
					augmentWidthOrHeight(
						elem,
						name,
						extra,
						support.boxSizing &&
							jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					) : 0
				);
			}
		};
	} );
	
	if ( !support.opacity ) {
		jQuery.cssHooks.opacity = {
			get: function( elem, computed ) {
	
				// IE uses filters for opacity
				return ropacity.test( ( computed && elem.currentStyle ?
					elem.currentStyle.filter :
					elem.style.filter ) || "" ) ?
						( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
						computed ? "1" : "";
			},
	
			set: function( elem, value ) {
				var style = elem.style,
					currentStyle = elem.currentStyle,
					opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
					filter = currentStyle && currentStyle.filter || style.filter || "";
	
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;
	
				// if setting opacity to 1, and no other filters exist -
				// attempt to remove filter attribute #6652
				// if value === "", then remove inline opacity #12685
				if ( ( value >= 1 || value === "" ) &&
						jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
						style.removeAttribute ) {
	
					// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
					// if "filter:" is present at all, clearType is disabled, we want to avoid this
					// style.removeAttribute is IE Only, but so apparently is this code path...
					style.removeAttribute( "filter" );
	
					// if there is no filter style applied in a css rule
					// or unset inline opacity, we are done
					if ( value === "" || currentStyle && !currentStyle.filter ) {
						return;
					}
				}
	
				// otherwise, set new filter values
				style.filter = ralpha.test( filter ) ?
					filter.replace( ralpha, opacity ) :
					filter + " " + opacity;
			}
		};
	}
	
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);
	
	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return (
					parseFloat( curCSS( elem, "marginLeft" ) ) ||
	
					// Support: IE<=11+
					// Running getBoundingClientRect on a disconnected node in IE throws an error
					// Support: IE8 only
					// getClientRects() errors on disconnected elems
					( jQuery.contains( elem.ownerDocument, elem ) ?
						elem.getBoundingClientRect().left -
							swap( elem, { marginLeft: 0 }, function() {
								return elem.getBoundingClientRect().left;
							} ) :
						0
					)
				) + "px";
			}
		}
	);
	
	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},
	
					// assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];
	
				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}
	
				return expanded;
			}
		};
	
		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );
	
	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;
	
				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;
	
					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}
	
					return map;
				}
	
				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}
	
			return this.each( function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	
	
	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;
	
	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];
	
			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];
	
			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;
	
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}
	
			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};
	
	Tween.prototype.init.prototype = Tween.prototype;
	
	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;
	
				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}
	
				// passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails
				// so, simple values such as "10px" are parsed to Float.
				// complex values such as "rotate(1rad)" are returned as is.
				result = jQuery.css( tween.elem, tween.prop, "" );
	
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
	
				// use step hook for back compat - use cssHook if its there - use .style if its
				// available and use plain properties where available
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};
	
	// Support: IE <=9
	// Panic based approach to setting things on disconnected nodes
	
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};
	
	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};
	
	jQuery.fx = Tween.prototype.init;
	
	// Back Compat <1.8 extension point
	jQuery.fx.step = {};
	
	
	
	
	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;
	
	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}
	
	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			attrs = { height: type },
			i = 0;
	
		// if we include width, step value is 1 to do all cssExpand values,
		// if we don't include width, step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}
	
		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}
	
		return attrs;
	}
	
	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
	
				// we're done with this property
				return tween;
			}
		}
	}
	
	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = jQuery._data( elem, "fxshow" );
	
		// handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;
	
			anim.always( function() {
	
				// doing this makes sure that the complete handler will be called
				// before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}
	
		// height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
	
			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE does not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );
	
			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;
	
			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
	
				// inline-level elements accept inline-block;
				// block-level elements need to be inline with layout
				if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
					style.display = "inline-block";
				} else {
					style.zoom = 1;
				}
			}
		}
	
		if ( opts.overflow ) {
			style.overflow = "hidden";
			if ( !support.shrinkWrapBlocks() ) {
				anim.always( function() {
					style.overflow = opts.overflow[ 0 ];
					style.overflowX = opts.overflow[ 1 ];
					style.overflowY = opts.overflow[ 2 ];
				} );
			}
		}
	
		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {
	
					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
	
			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}
	
		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = jQuery._data( elem, "fxshow", {} );
			}
	
			// store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done( function() {
					jQuery( elem ).hide();
				} );
			}
			anim.done( function() {
				var prop;
				jQuery._removeData( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
	
				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}
	
		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
			style.display = display;
		}
	}
	
	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;
	
		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}
	
			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}
	
			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];
	
				// not quite $.extend, this wont overwrite keys already present.
				// also - reusing 'index' from above because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}
	
	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {
	
				// don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
	
					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;
	
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}
	
				deferred.notifyWith( elem, [ animation, percent, remaining ] );
	
				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
	
						// if we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
	
					// resolve when we played the last frame
					// otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;
	
		propFilter( props, animation.opts.specialEasing );
	
		for ( ; index < length ; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}
	
		jQuery.map( props, createTween, animation );
	
		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}
	
		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);
	
		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}
	
	jQuery.Animation = jQuery.extend( Animation, {
	
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},
	
		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnotwhite );
			}
	
			var prop,
				index = 0,
				length = props.length;
	
			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},
	
		prefilters: [ defaultPrefilter ],
	
		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );
	
	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};
	
		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ?
				jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
	
		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}
	
		// Queueing
		opt.old = opt.complete;
	
		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
	
			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};
	
		return opt;
	};
	
	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {
	
			// show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()
	
				// animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
	
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
					// Empty animations, or finishing resolves immediately
					if ( empty || jQuery._data( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;
	
			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};
	
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}
	
			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = jQuery._data( this );
	
				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}
	
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {
	
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}
	
				// start the next in the queue if the last step wasn't forced
				// timers currently will call their complete callbacks, which will dequeue
				// but only if they were gotoEnd
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = jQuery._data( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
	
				// enable finishing flag on private data
				data.finish = true;
	
				// empty the queue first
				jQuery.queue( this, type, [] );
	
				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}
	
				// look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}
	
				// look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}
	
				// turn off finishing flag
				delete data.finish;
			} );
		}
	} );
	
	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );
	
	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );
	
	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			timers = jQuery.timers,
			i = 0;
	
		fxNow = jQuery.now();
	
		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
	
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}
	
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};
	
	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};
	
	jQuery.fx.interval = 13;
	
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};
	
	jQuery.fx.stop = function() {
		window.clearInterval( timerId );
		timerId = null;
	};
	
	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
	
		// Default speed
		_default: 400
	};
	
	
	// Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";
	
		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};
	
	
	( function() {
		var a,
			input = document.createElement( "input" ),
			div = document.createElement( "div" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );
	
		// Setup
		div = document.createElement( "div" );
		div.setAttribute( "className", "t" );
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
		a = div.getElementsByTagName( "a" )[ 0 ];
	
		// Support: Windows Web Apps (WWA)
		// `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "checkbox" );
		div.appendChild( input );
	
		a = div.getElementsByTagName( "a" )[ 0 ];
	
		// First batch of tests.
		a.style.cssText = "top:1px";
	
		// Test setAttribute on camelCase class.
		// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		support.getSetAttribute = div.className !== "t";
	
		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		support.style = /top/.test( a.getAttribute( "style" ) );
	
		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		support.hrefNormalized = a.getAttribute( "href" ) === "/a";
	
		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		support.checkOn = !!input.value;
	
		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		support.optSelected = opt.selected;
	
		// Tests for enctype support on a form (#6743)
		support.enctype = !!document.createElement( "form" ).enctype;
	
		// Make sure that the options inside disabled selects aren't marked as disabled
		// (WebKit marks them as disabled)
		select.disabled = true;
		support.optDisabled = !opt.disabled;
	
		// Support: IE8 only
		// Check if we can trust getAttribute("value")
		input = document.createElement( "input" );
		input.setAttribute( "value", "" );
		support.input = input.getAttribute( "value" ) === "";
	
		// Check if an input maintains its value after becoming a radio
		input.value = "t";
		input.setAttribute( "type", "radio" );
		support.radioValue = input.value === "t";
	} )();
	
	
	var rreturn = /\r/g,
		rspaces = /[\x20\t\r\n\f]+/g;
	
	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];
	
			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
					if (
						hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}
	
					ret = elem.value;
	
					return typeof ret === "string" ?
	
						// handle most common string cases
						ret.replace( rreturn, "" ) :
	
						// handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}
	
				return;
			}
	
			isFunction = jQuery.isFunction( value );
	
			return this.each( function( i ) {
				var val;
	
				if ( this.nodeType !== 1 ) {
					return;
				}
	
				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}
	
				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
				} else if ( typeof val === "number" ) {
					val += "";
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}
	
				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );
	
	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
	
						// Support: IE10-11+
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;
	
					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];
	
						// oldIE doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
	
								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ?
									!option.disabled :
									option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
	
							// Get the specific value for the option
							value = jQuery( option ).val();
	
							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
	
							// Multi-Selects return an array
							values.push( value );
						}
					}
	
					return values;
				},
	
				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;
	
					while ( i-- ) {
						option = options[ i ];
	
						if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {
	
							// Support: IE6
							// When new option element is added to select box we need to
							// force reflow of newly added node in order to workaround delay
							// of initialization properties
							try {
								option.selected = optionSet = true;
	
							} catch ( _ ) {
	
								// Will be executed only in IE6
								option.scrollHeight;
							}
	
						} else {
							option.selected = false;
						}
					}
	
					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
	
					return options;
				}
			}
		}
	} );
	
	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );
	
	
	
	
	var nodeHook, boolHook,
		attrHandle = jQuery.expr.attrHandle,
		ruseDefault = /^(?:checked|selected)$/i,
		getSetAttribute = support.getSetAttribute,
		getSetInput = support.input;
	
	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},
	
		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );
	
	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}
	
			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
			}
	
			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}
	
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				elem.setAttribute( name, value + "" );
				return value;
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			ret = jQuery.find.attr( elem, name );
	
			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},
	
		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
	
						// Setting the type on a radio button after the value resets the value in IE8-9
						// Reset value to default in case type is set after value during creation
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},
	
		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );
	
			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					propName = jQuery.propFix[ name ] || name;
	
					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {
	
						// Set corresponding property to false
						if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
							elem[ propName ] = false;
	
						// Support: IE<9
						// Also clear defaultChecked/defaultSelected (if appropriate)
						} else {
							elem[ jQuery.camelCase( "default-" + name ) ] =
								elem[ propName ] = false;
						}
	
					// See #9699 for explanation of this approach (setting first, then removal)
					} else {
						jQuery.attr( elem, name, "" );
					}
	
					elem.removeAttribute( getSetAttribute ? name : propName );
				}
			}
		}
	} );
	
	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
	
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
	
				// IE<8 needs the *property* name
				elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );
	
			} else {
	
				// Support: IE<9
				// Use defaultChecked and defaultSelected for oldIE
				elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
			}
			return name;
		}
	};
	
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;
	
		if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			attrHandle[ name ] = function( elem, name, isXML ) {
				var ret, handle;
				if ( !isXML ) {
	
					// Avoid an infinite loop by temporarily removing this function from the getter
					handle = attrHandle[ name ];
					attrHandle[ name ] = ret;
					ret = getter( elem, name, isXML ) != null ?
						name.toLowerCase() :
						null;
					attrHandle[ name ] = handle;
				}
				return ret;
			};
		} else {
			attrHandle[ name ] = function( elem, name, isXML ) {
				if ( !isXML ) {
					return elem[ jQuery.camelCase( "default-" + name ) ] ?
						name.toLowerCase() :
						null;
				}
			};
		}
	} );
	
	// fix oldIE attroperties
	if ( !getSetInput || !getSetAttribute ) {
		jQuery.attrHooks.value = {
			set: function( elem, value, name ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
	
					// Does not return so that setAttribute is also used
					elem.defaultValue = value;
				} else {
	
					// Use nodeHook if defined (#1954); otherwise setAttribute is fine
					return nodeHook && nodeHook.set( elem, value, name );
				}
			}
		};
	}
	
	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	if ( !getSetAttribute ) {
	
		// Use this for any attribute in IE6/7
		// This fixes almost every IE6/7 issue
		nodeHook = {
			set: function( elem, value, name ) {
	
				// Set the existing or create a new attribute node
				var ret = elem.getAttributeNode( name );
				if ( !ret ) {
					elem.setAttributeNode(
						( ret = elem.ownerDocument.createAttribute( name ) )
					);
				}
	
				ret.value = value += "";
	
				// Break association with cloned elements by also using setAttribute (#9646)
				if ( name === "value" || value === elem.getAttribute( name ) ) {
					return value;
				}
			}
		};
	
		// Some attributes are constructed with empty-string values when not defined
		attrHandle.id = attrHandle.name = attrHandle.coords =
			function( elem, name, isXML ) {
				var ret;
				if ( !isXML ) {
					return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
						ret.value :
						null;
				}
			};
	
		// Fixing value retrieval on a button requires this module
		jQuery.valHooks.button = {
			get: function( elem, name ) {
				var ret = elem.getAttributeNode( name );
				if ( ret && ret.specified ) {
					return ret.value;
				}
			},
			set: nodeHook.set
		};
	
		// Set contenteditable to false on removals(#10429)
		// Setting to empty string throws an error as an invalid value
		jQuery.attrHooks.contenteditable = {
			set: function( elem, value, name ) {
				nodeHook.set( elem, value === "" ? false : value, name );
			}
		};
	
		// Set width and height to auto instead of 0 on empty string( Bug #8150 )
		// This is for removals
		jQuery.each( [ "width", "height" ], function( i, name ) {
			jQuery.attrHooks[ name ] = {
				set: function( elem, value ) {
					if ( value === "" ) {
						elem.setAttribute( name, "auto" );
						return value;
					}
				}
			};
		} );
	}
	
	if ( !support.style ) {
		jQuery.attrHooks.style = {
			get: function( elem ) {
	
				// Return undefined in the case of empty string
				// Note: IE uppercases css property names, but if we were to .toLowerCase()
				// .cssText, that would destroy case sensitivity in URL's, like in "background"
				return elem.style.cssText || undefined;
			},
			set: function( elem, value ) {
				return ( elem.style.cssText = value + "" );
			}
		};
	}
	
	
	
	
	var rfocusable = /^(?:input|select|textarea|button|object)$/i,
		rclickable = /^(?:a|area)$/i;
	
	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},
	
		removeProp: function( name ) {
			name = jQuery.propFix[ name ] || name;
			return this.each( function() {
	
				// try/catch handles cases where IE balks (such as removing a property on window)
				try {
					this[ name ] = undefined;
					delete this[ name ];
				} catch ( e ) {}
			} );
		}
	} );
	
	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
	
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}
	
			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				return ( elem[ name ] = value );
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			return elem[ name ];
		},
	
		propHooks: {
			tabIndex: {
				get: function( elem ) {
	
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );
	
					return tabindex ?
						parseInt( tabindex, 10 ) :
						rfocusable.test( elem.nodeName ) ||
							rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								-1;
				}
			}
		},
	
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );
	
	// Some attributes require a special call on IE
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !support.hrefNormalized ) {
	
		// href/src property should get the full normalized URL (#10299/#12915)
		jQuery.each( [ "href", "src" ], function( i, name ) {
			jQuery.propHooks[ name ] = {
				get: function( elem ) {
					return elem.getAttribute( name, 4 );
				}
			};
		} );
	}
	
	// Support: Safari, IE9+
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
	
				if ( parent ) {
					parent.selectedIndex;
	
					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
				return null;
			},
			set: function( elem ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}
	
	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );
	
	// IE6/7 call enctype encoding
	if ( !support.enctype ) {
		jQuery.propFix.enctype = "encoding";
	}
	
	
	
	
	var rclass = /[\t\r\n\f]/g;
	
	function getClass( elem ) {
		return jQuery.attr( elem, "class" ) || "";
	}
	
	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}
	
						// only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							jQuery.attr( elem, "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
	
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
	
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							jQuery.attr( elem, "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		toggleClass: function( value, stateVal ) {
			var type = typeof value;
	
			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}
	
			return this.each( function() {
				var className, i, self, classNames;
	
				if ( type === "string" ) {
	
					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnotwhite ) || [];
	
					while ( ( className = classNames[ i++ ] ) ) {
	
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}
	
				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {
	
						// store className if set
						jQuery._data( this, "__className__", className );
					}
	
					// If the element has a class name or if we're passed "false",
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					jQuery.attr( this, "class",
						className || value === false ?
						"" :
						jQuery._data( this, "__className__" ) || ""
					);
				}
			} );
		},
	
		hasClass: function( selector ) {
			var className, elem,
				i = 0;
	
			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + getClass( elem ) + " " ).replace( rclass, " " )
						.indexOf( className ) > -1
				) {
					return true;
				}
			}
	
			return false;
		}
	} );
	
	
	
	
	// Return jQuery for attributes-only inclusion
	
	
	jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
		function( i, name ) {
	
		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );
	
	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );
	
	
	var location = window.location;
	
	var nonce = jQuery.now();
	
	var rquery = ( /\?/ );
	
	
	
	var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
	
	jQuery.parseJSON = function( data ) {
	
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
	
			// Support: Android 2.3
			// Workaround failure to string-cast null input
			return window.JSON.parse( data + "" );
		}
	
		var requireNonComma,
			depth = null,
			str = jQuery.trim( data + "" );
	
		// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
		// after removing valid tokens
		return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {
	
			// Force termination if we see a misplaced comma
			if ( requireNonComma && comma ) {
				depth = 0;
			}
	
			// Perform no more replacements after returning to outermost depth
			if ( depth === 0 ) {
				return token;
			}
	
			// Commas must not follow "[", "{", or ","
			requireNonComma = open || comma;
	
			// Determine new depth
			// array/object open ("[" or "{"): depth += true - false (increment)
			// array/object close ("]" or "}"): depth += false - true (decrement)
			// other cases ("," or primitive): depth += true - true (numeric cast)
			depth += !close - !open;
	
			// Remove this token
			return "";
		} ) ) ?
			( Function( "return " + str ) )() :
			jQuery.error( "Invalid JSON: " + data );
	};
	
	
	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new window.DOMParser();
				xml = tmp.parseFromString( data, "text/xml" );
			} else { // IE
				xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch ( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};
	
	
	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
	
		// IE leaves an \r character at EOL
		rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
	
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
	
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},
	
		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},
	
		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),
	
		// Document location
		ajaxLocation = location.href,
	
		// Segment location into parts
		ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {
	
		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {
	
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}
	
			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];
	
			if ( jQuery.isFunction( func ) ) {
	
				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {
	
					// Prepend if requested
					if ( dataType.charAt( 0 ) === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );
	
					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}
	
	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
		var inspected = {},
			seekingTransport = ( structure === transports );
	
		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {
	
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}
	
		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var deep, key,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	
		return target;
	}
	
	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
		var firstDataType, ct, finalDataType, type,
			contents = s.contents,
			dataTypes = s.dataTypes;
	
		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}
	
		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}
	
		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
	
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
	
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}
	
		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}
	
	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
	
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();
	
		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}
	
		current = dataTypes.shift();
	
		// Convert to each sequential dataType
		while ( current ) {
	
			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}
	
			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}
	
			prev = current;
			current = dataTypes.shift();
	
			if ( current ) {
	
				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {
	
					current = prev;
	
				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {
	
					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {
	
							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {
	
								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
	
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];
	
									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}
	
					// Apply converter (if not an equivalence)
					if ( conv !== true ) {
	
						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}
	
		return { state: "success", data: response };
	}
	
	jQuery.extend( {
	
		// Counter for holding the number of active queries
		active: 0,
	
		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},
	
		ajaxSettings: {
			url: ajaxLocation,
			type: "GET",
			isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/
	
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
	
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
	
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
	
			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {
	
				// Convert anything to text
				"* text": String,
	
				// Text to html (true = no transformation)
				"text html": true,
	
				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,
	
				// Parse text as xml
				"text xml": jQuery.parseXML
			},
	
			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},
	
		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?
	
				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},
	
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
	
		// Main method
		ajax: function( url, options ) {
	
			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}
	
			// Force options to be an object
			options = options || {};
	
			var
	
				// Cross-domain detection vars
				parts,
	
				// Loop variable
				i,
	
				// URL without anti-cache param
				cacheURL,
	
				// Response headers as string
				responseHeadersString,
	
				// timeout handle
				timeoutTimer,
	
				// To know if global events are to be dispatched
				fireGlobals,
	
				transport,
	
				// Response headers
				responseHeaders,
	
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
	
				// Callbacks context
				callbackContext = s.context || s,
	
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,
	
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),
	
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
	
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
	
				// The jqXHR state
				state = 0,
	
				// Default abort message
				strAbort = "canceled",
	
				// Fake xhr
				jqXHR = {
					readyState: 0,
	
					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},
	
					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},
	
					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
	
					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},
	
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {
	
									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {
	
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},
	
					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};
	
			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
	
			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || ajaxLocation ) + "" )
				.replace( rhash, "" )
				.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
	
			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;
	
			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];
	
			// A cross-domain request is in order when we have a protocol:host:port mismatch
			if ( s.crossDomain == null ) {
				parts = rurl.exec( s.url.toLowerCase() );
				s.crossDomain = !!( parts &&
					( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
						( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
							( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
				);
			}
	
			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}
	
			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}
	
			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;
	
			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}
	
			// Uppercase the type
			s.type = s.type.toUpperCase();
	
			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );
	
			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;
	
			// More options handling for requests with no content
			if ( !s.hasContent ) {
	
				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
	
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}
	
				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?
	
						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :
	
						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}
	
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}
	
			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}
	
			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);
	
			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}
	
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
	
				// Abort if not done already and return
				return jqXHR.abort();
			}
	
			// aborting is no longer a cancellation
			strAbort = "abort";
	
			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}
	
			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
	
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
	
				// If request was aborted inside ajaxSend, stop there
				if ( state === 2 ) {
					return jqXHR;
				}
	
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}
	
				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {
	
					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );
	
					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}
	
			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;
	
				// Called once
				if ( state === 2 ) {
					return;
				}
	
				// State is "done" now
				state = 2;
	
				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}
	
				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;
	
				// Cache response headers
				responseHeadersString = headers || "";
	
				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;
	
				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;
	
				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}
	
				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );
	
				// If successful, handle type chaining
				if ( isSuccess ) {
	
					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}
	
					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";
	
					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";
	
					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
	
					// We extract error from statusText
					// then normalize statusText and status for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}
	
				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}
	
				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;
	
				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}
	
				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
	
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}
	
			return jqXHR;
		},
	
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},
	
		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );
	
	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
	
			// shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
	
			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );
	
	
	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,
	
			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		} );
	};
	
	
	jQuery.fn.extend( {
		wrapAll: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapAll( html.call( this, i ) );
				} );
			}
	
			if ( this[ 0 ] ) {
	
				// The elements to wrap the target around
				var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
	
				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}
	
				wrap.map( function() {
					var elem = this;
	
					while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
						elem = elem.firstChild;
					}
	
					return elem;
				} ).append( this );
			}
	
			return this;
		},
	
		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}
	
			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();
	
				if ( contents.length ) {
					contents.wrapAll( html );
	
				} else {
					self.append( html );
				}
			} );
		},
	
		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );
	
			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},
	
		unwrap: function() {
			return this.parent().each( function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			} ).end();
		}
	} );
	
	
	function getDisplay( elem ) {
		return elem.style && elem.style.display || jQuery.css( elem, "display" );
	}
	
	function filterHidden( elem ) {
	
		// Disconnected elements are considered hidden
		if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
			return true;
		}
		while ( elem && elem.nodeType === 1 ) {
			if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
				return true;
			}
			elem = elem.parentNode;
		}
		return false;
	}
	
	jQuery.expr.filters.hidden = function( elem ) {
	
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return support.reliableHiddenOffsets() ?
			( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
				!elem.getClientRects().length ) :
				filterHidden( elem );
	};
	
	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
	
	
	
	
	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	function buildParams( prefix, obj, traditional, add ) {
		var name;
	
		if ( jQuery.isArray( obj ) ) {
	
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
	
					// Treat each array item as a scalar.
					add( prefix, v );
	
				} else {
	
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );
	
		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
	
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
	
		} else {
	
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {
	
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};
	
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
	
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );
	
		} else {
	
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};
	
	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {
	
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;
	
				// Use .is(":disabled") so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();
	
				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						} ) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );
	
	
	// Create the request object
	// (This is still attached to ajaxSettings for backward compatibility)
	jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
	
		// Support: IE6-IE8
		function() {
	
			// XHR cannot access local files, always use ActiveX for that case
			if ( this.isLocal ) {
				return createActiveXHR();
			}
	
			// Support: IE 9-11
			// IE seems to error on cross-domain PATCH requests when ActiveX XHR
			// is used. In IE 9+ always use the native XHR.
			// Note: this condition won't catch Edge as it doesn't define
			// document.documentMode but it also doesn't support ActiveX so it won't
			// reach this code.
			if ( document.documentMode > 8 ) {
				return createStandardXHR();
			}
	
			// Support: IE<9
			// oldIE XHR does not support non-RFC2616 methods (#13240)
			// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
			// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
			// Although this check for six methods instead of eight
			// since IE also does not support "trace" and "connect"
			return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
				createStandardXHR() || createActiveXHR();
		} :
	
		// For all other browsers, use the standard XMLHttpRequest object
		createStandardXHR;
	
	var xhrId = 0,
		xhrCallbacks = {},
		xhrSupported = jQuery.ajaxSettings.xhr();
	
	// Support: IE<10
	// Open requests must be manually aborted on unload (#5280)
	// See https://support.microsoft.com/kb/2856746 for more info
	if ( window.attachEvent ) {
		window.attachEvent( "onunload", function() {
			for ( var key in xhrCallbacks ) {
				xhrCallbacks[ key ]( undefined, true );
			}
		} );
	}
	
	// Determine support properties
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	xhrSupported = support.ajax = !!xhrSupported;
	
	// Create transport if the browser can provide an xhr
	if ( xhrSupported ) {
	
		jQuery.ajaxTransport( function( options ) {
	
			// Cross domain only allowed if supported through XMLHttpRequest
			if ( !options.crossDomain || support.cors ) {
	
				var callback;
	
				return {
					send: function( headers, complete ) {
						var i,
							xhr = options.xhr(),
							id = ++xhrId;
	
						// Open the socket
						xhr.open(
							options.type,
							options.url,
							options.async,
							options.username,
							options.password
						);
	
						// Apply custom fields if provided
						if ( options.xhrFields ) {
							for ( i in options.xhrFields ) {
								xhr[ i ] = options.xhrFields[ i ];
							}
						}
	
						// Override mime type if needed
						if ( options.mimeType && xhr.overrideMimeType ) {
							xhr.overrideMimeType( options.mimeType );
						}
	
						// X-Requested-With header
						// For cross-domain requests, seeing as conditions for a preflight are
						// akin to a jigsaw puzzle, we simply never set it to be sure.
						// (it can always be set on a per-request basis or even using ajaxSetup)
						// For same-domain requests, won't change header if already provided.
						if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
							headers[ "X-Requested-With" ] = "XMLHttpRequest";
						}
	
						// Set headers
						for ( i in headers ) {
	
							// Support: IE<9
							// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
							// request header to a null-value.
							//
							// To keep consistent with other XHR implementations, cast the value
							// to string and ignore `undefined`.
							if ( headers[ i ] !== undefined ) {
								xhr.setRequestHeader( i, headers[ i ] + "" );
							}
						}
	
						// Do send the request
						// This may raise an exception which is actually
						// handled in jQuery.ajax (so no try/catch here)
						xhr.send( ( options.hasContent && options.data ) || null );
	
						// Listener
						callback = function( _, isAbort ) {
							var status, statusText, responses;
	
							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
	
								// Clean up
								delete xhrCallbacks[ id ];
								callback = undefined;
								xhr.onreadystatechange = jQuery.noop;
	
								// Abort manually if needed
								if ( isAbort ) {
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
	
									// Support: IE<10
									// Accessing binary-data responseText throws an exception
									// (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}
	
									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch ( e ) {
	
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}
	
									// Filter status for non standard behaviors
	
									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && options.isLocal && !options.crossDomain ) {
										status = responses.text ? 200 : 404;
	
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
	
							// Call complete if needed
							if ( responses ) {
								complete( status, statusText, responses, xhr.getAllResponseHeaders() );
							}
						};
	
						// Do send the request
						// `xhr.send` may raise an exception, but it will be
						// handled in jQuery.ajax (so no try/catch here)
						if ( !options.async ) {
	
							// If we're in sync mode we fire the callback
							callback();
						} else if ( xhr.readyState === 4 ) {
	
							// (IE6 & IE7) if it's in cache and has been
							// retrieved directly we need to fire the callback
							window.setTimeout( callback );
						} else {
	
							// Register the callback, but delay it in case `xhr.send` throws
							// Add to the list of active xhr callbacks
							xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
						}
					},
	
					abort: function() {
						if ( callback ) {
							callback( undefined, true );
						}
					}
				};
			}
		} );
	}
	
	// Functions to create xhrs
	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	}
	
	function createActiveXHR() {
		try {
			return new window.ActiveXObject( "Microsoft.XMLHTTP" );
		} catch ( e ) {}
	}
	
	
	
	
	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );
	
	// Handle cache's special case and global
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
			s.global = false;
		}
	} );
	
	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
	
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
	
			var script,
				head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;
	
			return {
	
				send: function( _, callback ) {
	
					script = document.createElement( "script" );
	
					script.async = true;
	
					if ( s.scriptCharset ) {
						script.charset = s.scriptCharset;
					}
	
					script.src = s.url;
	
					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function( _, isAbort ) {
	
						if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {
	
							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;
	
							// Remove the script
							if ( script.parentNode ) {
								script.parentNode.removeChild( script );
							}
	
							// Dereference the script
							script = null;
	
							// Callback if not abort
							if ( !isAbort ) {
								callback( 200, "success" );
							}
						}
					};
	
					// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
					// Use native DOM manipulation to avoid our domManip AJAX trickery
					head.insertBefore( script, head.firstChild );
				},
	
				abort: function() {
					if ( script ) {
						script.onload( undefined, true );
					}
				}
			};
		}
	} );
	
	
	
	
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );
	
	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);
	
		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;
	
			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}
	
			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};
	
			// force json dataType
			s.dataTypes[ 0 ] = "json";
	
			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};
	
			// Clean-up function (fires after converters)
			jqXHR.always( function() {
	
				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );
	
				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}
	
				// Save back as free
				if ( s[ callbackName ] ) {
	
					// make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;
	
					// save the callback name for future use
					oldCallbacks.push( callbackName );
				}
	
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}
	
				responseContainer = overwritten = undefined;
			} );
	
			// Delegate to script
			return "script";
		}
	} );
	
	
	
	
	// data: string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;
	
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}
	
		parsed = buildFragment( [ data ], context, scripts );
	
		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}
	
		return jQuery.merge( [], parsed.childNodes );
	};
	
	
	// Keep a copy of the old load method
	var _load = jQuery.fn.load;
	
	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}
	
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );
	
		if ( off > -1 ) {
			selector = jQuery.trim( url.slice( off, url.length ) );
			url = url.slice( 0, off );
		}
	
		// If it's a function
		if ( jQuery.isFunction( params ) ) {
	
			// We assume that it's the callback
			callback = params;
			params = undefined;
	
		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}
	
		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,
	
				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {
	
				// Save response for use in complete callback
				response = arguments;
	
				self.html( selector ?
	
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
					// Otherwise use the full result
					responseText );
	
			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}
	
		return this;
	};
	
	
	
	
	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );
	
	
	
	
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};
	
	
	
	
	
	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ?
			elem :
			elem.nodeType === 9 ?
				elem.defaultView || elem.parentWindow :
				false;
	}
	
	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};
	
			// set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}
	
			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;
	
			// need to be able to calculate position if either top or left
			// is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}
	
			if ( jQuery.isFunction( options ) ) {
	
				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}
	
			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}
	
			if ( "using" in options ) {
				options.using.call( elem, props );
			} else {
				curElem.css( props );
			}
		}
	};
	
	jQuery.fn.extend( {
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}
	
			var docElem, win,
				box = { top: 0, left: 0 },
				elem = this[ 0 ],
				doc = elem && elem.ownerDocument;
	
			if ( !doc ) {
				return;
			}
	
			docElem = doc.documentElement;
	
			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}
	
			// If we don't have gBCR, just use 0,0 rather than error
			// BlackBerry 5, iOS 3 (original iPhone)
			if ( typeof elem.getBoundingClientRect !== "undefined" ) {
				box = elem.getBoundingClientRect();
			}
			win = getWindow( doc );
			return {
				top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
				left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
			};
		},
	
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}
	
			var offsetParent, offset,
				parentOffset = { top: 0, left: 0 },
				elem = this[ 0 ];
	
			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
	
				// we assume that getBoundingClientRect is available when computed position is fixed
				offset = elem.getBoundingClientRect();
			} else {
	
				// Get *real* offsetParent
				offsetParent = this.offsetParent();
	
				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}
	
				// Add offsetParent borders
				parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}
	
			// Subtract parent offsets and element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft
			// are the same in Safari causing offset.left to incorrectly be 0
			return {
				top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},
	
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;
	
				while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
					jQuery.css( offsetParent, "position" ) === "static" ) ) {
					offsetParent = offsetParent.offsetParent;
				}
				return offsetParent || documentElement;
			} );
		}
	} );
	
	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = /Y/.test( prop );
	
		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );
	
				if ( val === undefined ) {
					return win ? ( prop in win ) ? win[ prop ] :
						win.document.documentElement[ method ] :
						elem[ method ];
				}
	
				if ( win ) {
					win.scrollTo(
						!top ? val : jQuery( win ).scrollLeft(),
						top ? val : jQuery( win ).scrollTop()
					);
	
				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length, null );
		};
	} );
	
	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
	
					// if curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );
	
	
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {
	
			// margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
				return access( this, function( elem, type, value ) {
					var doc;
	
					if ( jQuery.isWindow( elem ) ) {
	
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}
	
					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;
	
						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						// unfortunately, this causes bug #3838 in IE6/8 only,
						// but there is currently no good, small way to fix it.
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}
	
					return value === undefined ?
	
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :
	
						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		} );
	} );
	
	
	jQuery.fn.extend( {
	
		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},
	
		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
	
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		}
	} );
	
	// The number of elements contained in the matched element set
	jQuery.fn.size = function() {
		return this.length;
	};
	
	jQuery.fn.andSelf = jQuery.fn.addBack;
	
	
	
	
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	
	
	var
	
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
	
		// Map over the $ in case of overwrite
		_$ = window.$;
	
	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
	
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}
	
		return jQuery;
	};
	
	// Expose jQuery and $ identifiers, even in
	// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}
	
	return jQuery;
	}));


/***/ }
]);
//# sourceMappingURL=vendor.js.map