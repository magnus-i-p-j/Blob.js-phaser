define(['jquery', 'app/GameObjectFactory', 'app/gameobjects/blob/BlobController', 'app/gameobjects/blob/BlobView'],
    function ($, GameObjectFactory, BlobController, BlobView) {

        // A blob consists of globs
        var Glob = function (globSpec) {
            this.size = globSpec.size || 10;
            this.mass = globSpec.mass || 5;
        };

        var Blob = function (state, x, y, blobSpec) {
            this.x = x;
            this.y = y;

            this.viscosity = blobSpec && blobSpec.viscosity || 1;
            this.stickiness = blobSpec && blobSpec.stickiness || 1;
            this.dissolution = blobSpec && blobSpec.dissolution || 0;
            this.maxVelocity =  blobSpec && blobSpec.maxVelocity || 150;

            this.onUpdate = new Phaser.Signal();

            var globSpec = {
                size: 10,
                mass: 5
            };
            var layout = [1, 2, 3, 4, 5, 6, 6, 4];
            this.globs = this.createGlobs(layout, globSpec);

            var view = new BlobView(state, this);
            new BlobController(state, this, view);
        };

        Blob.prototype.createGlobs = function (layout, globSpec) {
            var globs = [];
            for (var i = 0; i < layout.length; ++i) {
                globs.push([]);
                for (var j = 0; j < layout[i]; ++j) {
                    var glob = new Glob(globSpec);
                    globs[i].push(glob);
                }
            }
            return globs;
        };

        Blob.prototype.update = function () {
            this.onUpdate.dispatch(this);
        };

        return {

            preload: function (state) {
                state.load.spritesheet('glob', 'assets/glob-test.png');
            },
            factory: function (state) {
                return new GameObjectFactory(state, Blob);
            }
        }
    }
);
