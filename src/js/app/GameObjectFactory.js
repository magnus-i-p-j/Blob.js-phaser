define(['jquery'],
    function ($) {
        var GameObjectFactory = function (state, GameObject) {
            this._state = state;
            this._GameObject = GameObject;
            this._created = [];
        };

        GameObjectFactory.prototype.create = function () {
            var args = [];
            // You should not slice on arguments because it prevents optimizations in
            // JavaScript engines (V8 for example). Instead, try constructing a new
            // array by iterating through the arguments object.
            args.push(this._state);
            $.each(arguments, function (i, arg) {
                args.push(arg);
            });

            var that = Object.create(this._GameObject.prototype);
            this._GameObject.apply(that, args);
            that.constructor = this._GameObject;
            this._created.push(that);
        };

        GameObjectFactory.prototype.update = function () {
            $.each(this._created, function (i, gameObject) {
                gameObject.update();
            });
        };

        return GameObjectFactory;
    }
);

