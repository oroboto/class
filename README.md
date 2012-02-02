Class
=====

Super lightweight class-based inheritance for JavaScript


Features
--------

(or, "There are a dozen other implementations for class-based inheritance in JavaScript, why should I use this?")

* override base prototype members without affecting base prototype itself
* support for private properties and methods
* Class can be added to a namespace to keep global scope clean


Usage
-----


### Creating a base class ###

    // class extends Object if base is not specified
    var Animal = Class.create({
        constructor: function () {
            console.info('In Animal constructor');
            this.kingdom = 'Animalia';
            this.who = 'I am an ' + this.toType();
        },
        prototype: function () {
            this.toString = function () {
                return '[object Animal]';
            };

            this.toType = function () {
                return this.toString().match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            };

            this.feed = function (food) {
                console.info('In Animal.prototype.feed()');
                console.log(this.toType(), 'consumes', food);
            };
        }
    });


### Creating subclasses ###

    var Primate = Class.create({
        base: Animal, // Primate extends Animal
        constructor: function () {
            // call super ctor, executing Animal() before Primate()
            this._base.apply(this, arguments);

            console.info('In Primate constructor');
            this.order = 'Primates';
            // this.who will override the base property
            // while this.toType() will execute the base method
            this.who = 'I am a ' + this.toType();
        },
        prototype: function () {
            this.toString = function () {
                return '[object Primate]';
            };

            this.say = function (message) {
                console.info('In Primate.prototype.say()');
                console.log(this.toType(), 'says:', message);
            };

            this.burp = function () {
                console.info('In Primate.prototype.burp()');
                console.log(this.toType(), 'burps');
            };
        }
    });


### Using base (super) class constructor/methods from subclass ###

    var Human = Class.create({
        base: Primate, // Human extends Primate
        constructor: function (species) {
            // call super ctor, executing Primate() before Human()
            this._base.apply(this, arguments);

            console.info('In Human constructor');
            this.species = species;
        },
        // first argument represents the base prototype,
        // or may be omitted if base prototype isn't needed
        prototype: function (_base) {
            this.toString = function () {
                return '[object Human]';
            };

            this.say = function (message) {
                // log Human before Primate
                console.info('In Human.prototype.say()');

                // execute base method
                _base.say.apply(this, arguments);
            };

            this.think = function (thought) {
                console.info('In Human.prototype.think()');
                console.log(this.toType(), 'thinks about', thought);
            };
        }
    });


### Private variables and functions, and no constructor ###

    var BigMouth = Class.create({
        base: Human, // BigMouth extends Human
        // classes without constructors execute the base constructor
        prototype: function (_base) {
            // private variable
            var secret = 'Soylent Green is people!.';

            // private function
            var tellSecret = function () {
                console.log(this.toType(), 'tells a secret:', secret);
            };

            this.toString = function () {
                return '[object BigMouth]';
            };

            this.say = function (message) {
                // log Human before Primate
                console.info('In BigMouth.prototype.say()');

                // execute base method
                _base.say.apply(this, arguments);

                // execute private function (apply or call must be used to bind instance scope)
                tellSecret.apply(this);
            };
        }
    });


License
-------

[MIT License](http://www.opensource.org/licenses/mit-license.php)
