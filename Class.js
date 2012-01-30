/*
 * Class: Super lightweight class-based inheritance for JavaScript
 * http://oroboto.github.com/class/
 *
 * Copyright (c) 2012 Oroboto. All rights reserved.
 * MIT License: http://oroboto.github.com/class/LICENSE
 */
(function (namespace) {
    // http://caniuse.com/use-strict
    // http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
    "use strict";

    // string constants to optimize compression
    var CTOR = 'constructor',
        PROTO = 'prototype';

    namespace.Class = namespace.Class || {};
    namespace.Class.create = function (members) {
        if (!members) { return; }

        var base = members.base || Object, // all prototype chains lead to Object
            baseCtor = base[PROTO][CTOR],
            // try to use defined constructor, falling back to base constructor
            ctor = members.hasOwnProperty(CTOR) ? members[CTOR] : baseCtor,
            proto = members[PROTO],
            subclass = function (child, parent) {
                var key;

                // inherit base properties
                for (key in parent) {
                    if (parent.hasOwnProperty(key)) {
                        child[key] = parent[key];
                    }
                }

                // inherit prototype
                function Class () {} // constructor to host base prototype
                Class[PROTO] = child.__base__ = parent[PROTO];
                child[PROTO] = new Class;
                child[PROTO][CTOR] = child;
                return child;
            }(function () { // pass modified constructor as argument to subclass function
                // add base constructor to object so subclass can call it
                this._base = baseCtor;

                // execute original constructor
                ctor.apply(this, arguments);
            }, base);

        // add members to prototype
        if (proto) { proto.call(subclass[PROTO], subclass.__base__); }

        return subclass;
    };

})(this); // change argument to namespace of your choice; default is "this" (global or window)
