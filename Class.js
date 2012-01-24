/*
 * Copyright (c) 2012 Oroboto. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
(function (namespace) {
    // http://caniuse.com/use-strict
    // http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
    "use strict";

    namespace.Class = namespace.Class || {
        create: function (members) {
            if (!members) { return; }

            var base = members.base || Object, // all prototype chains lead to Object
                baseCtor = base.prototype.constructor,
                ctor = members.hasOwnProperty('constructor') ? members.constructor : baseCtor,
                proto = members.prototype,

                // subclass constructor
                Class = function (child, parent) {
                    // inherit base properties
                    var key;
                    for (key in parent) {
                        if (parent.hasOwnProperty(key)) {
                            child[key] = parent[key];
                        }
                    }

                    // inherit prototype
                    function Class() {} // constructor to host base prototype
                    Class.prototype = child.__base__ = parent.prototype;
                    child.prototype = new Class;
                    child.prototype.constructor = child;
                    return child;
                }(function () { // pass modified constructor as argument to subclass function
                    // add base constructor to object so subclass can call it
                    this._base = baseCtor;

                    // execute original constructor
                    ctor.apply(this, arguments);
                }, base);

            // add members to prototype
            if (proto) { proto.call(Class.prototype, Class.__base__); }

            return Class;
        }
    };

})(this); // change argument to namespace of your choice; default is "this" (global or window)
