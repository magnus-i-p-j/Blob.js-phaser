define(
    function () {

        var Platform = function (state) {
            this.state = state;
        };

        Platform.prototype.update = function () {
            console.log('updating a platform!');
        };

        return {
            init: function (state) {
                return {
                    preload: function () {
                        state.load.image('ground', 'assets/platform.png');
                    }
                    ,
                    create: function (x, y) {
                        var sprite = state.make.sprite(x, y, 'ground');
                        state.physics.p2.enable(sprite);
                        sprite.body.static = true;
                        var platform = new Platform(state);
                        var binding = state.onUpdate.add(platform.update, platform);
                        return sprite;
                    }
                }
            }
        }
    }
);
