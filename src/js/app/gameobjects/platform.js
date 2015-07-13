define(['app/GameObjectFactory'],
    function (GameObjectFactory) {
        // Model
        var Platform = function ( state, x, y, name) {
            this.name = name;
            this.x = x;
            this.y = y;
            var view = new View(state, this);
        };

        Platform.prototype.update = function () {
        };

        // View
        var View = function (state, model) {
            this._model = model;
            var sprite = state.make.sprite(this._model.x, this._model.y, 'ground');
            state.physics.p2.enable(sprite);
            sprite.body.static = true;
            state.world.add(sprite);
        };

        // Controller

        return {
            preload: function(state) {
                state.load.image('ground', 'assets/platform.png');
            },
            factory: function (state) {
                return new GameObjectFactory(state, Platform);
            }
        }
    }
);
