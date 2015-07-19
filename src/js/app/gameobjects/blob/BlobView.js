define(['jquery', 'lodash', 'vendor/ConvexHullGrahamScan'],
    function ($, _, ConvexHullGrahamScan) {

        var BlobView = function (state, model) {
            this._state = state;
            this._model = model;
            this._graphics = this._state.add.graphics(0, 6);

            this.group = this.makeGroup();
            this._sprites = this.createGlobSprites();
            state.world.add(this.group);

            /*
             this._springSpec = {
             restLength: 10 * model.viscosity,
             stiffness: 40 * model.viscosity,
             damping: 10 * (1 / model.viscosity)
             };
             this._springs = this.createGlobSprings(this._springSpec);
             */


            this._model.onUpdate.add(this.update, this);
        };

        BlobView.prototype.makeGroup = function () {
            var group = this._state.make.group();
            group.alpha = 1;
            group.enableBody = true;
            group.physicsBodyType = Phaser.Physics.P2JS;
            return group;
        };

        BlobView.prototype.createGlobSprites = function () {
            var globMesh = this._model.globMesh;
            var globSize = globMesh[0].glob.size;
            var width = globMesh.width;
            var height = globMesh.height;

            var sprites = {};

            globMesh.forEach(
                function (node, index, layer) {
                    var offsetX = (((width - layer.length)) / 2) * globSize;
                    var offsetY = height - index * globSize;

                    _.forEach(layer, function (meshNode, j) {
                        var glob = meshNode.glob;
                        var x = offsetX + this._model.x + j * glob.size;
                        var y = this._model.y - offsetY;
                        var globSprite = this.group.create(x, y, 'glob');
                        globSprite.body.setRectangle(glob.size, glob.size * 2);
                        globSprite.body.mass = glob.mass;
                        globSprite.body.staic = true;
                        globSprite.fixedRotation = true;
                        sprites[i].push(globSprite);
                    }, this);

                    for (var j = 0; j < globs[i].length; ++j) {
                        var glob = globs[i][j];
                        var x = offsetX + this._model.x + j * glob.size;
                        var y = this._model.y - offsetY;
                        var globSprite = this.group.create(x, y, 'glob');
                        globSprite.body.setRectangle(glob.size, glob.size * 2);
                        globSprite.body.mass = glob.mass;
                        globSprite.body.mass = glob.mass;
                        globSprite.fixedRotation = true;
                        sprites[i].push(globSprite);
                    }
                }, this
            );

            for (var i = 0; i < globs.length; ++i) {
                sprites.push([]);
                var offsetGlobSize = globs[0][0].size; // For now use the first size.
                var offsetX = (((width - globs[i].length)) / 2) * offsetGlobSize;
                var offsetY = globs.length - i * offsetGlobSize;
                for (var j = 0; j < globs[i].length; ++j) {
                    var glob = globs[i][j];
                    var x = offsetX + this._model.x + j * glob.size;
                    var y = this._model.y - offsetY;
                    var globSprite = this.group.create(x, y, 'glob');
                    globSprite.body.setRectangle(glob.size, glob.size * 2);
                    globSprite.body.mass = glob.mass;
                    globSprite.fixedRotation = true;
                    sprites[i].push(globSprite);
                }
            }
            return sprites;
        };

        BlobView.prototype.createGlobSprings = function (springSpec) {
            var globs = this._sprites;

            var springs = [];
            var restLength = springSpec.restLength;
            var stiffness = springSpec.stiffness;
            var damping = springSpec.damping;

            var g_long;
            var g_short;
            for (var i = 0; i < globs.length - 1; ++i) {
                if (globs[i].length <= globs[i + 1].length) {
                    g_long = globs[i + 1];
                    g_short = globs[i];
                } else {
                    g_long = globs[i];
                    g_short = globs[i + 1];
                }
                var step = g_short.length / g_long.length;

                for (var j = 0; j < g_long.length; j++) {
                    var spring = this._state.physics.p2.createSpring(
                        g_long[j],
                        g_short[Math.floor(j * step)],
                        restLength,
                        stiffness,
                        damping);
                    springs.push(spring);
                }
            }

            for (i = 0; i < globs.length; ++i) {
                for (j = 1; j < globs[i].length; j++) {
                    spring = this._state.physics.p2.createSpring(
                        globs[i][j],
                        globs[i][j - 1],
                        restLength,
                        stiffness,
                        damping);
                    springs.push(spring);
                }
            }
            return springs;
        };

        BlobView.prototype.update = function () {
            this.drawBlob();
            //this.dissolveOrJell();
            //this.jiggle();
        };

        BlobView.prototype.drawBlob = function () {
            var hull = this.getConvexHull();
            var polygon = new Phaser.Polygon(hull);
            this._graphics.clear();
            this._graphics.beginFill(0xFF0000, 0.5);
            this._graphics.drawShape(polygon);
            this._graphics.endFill();
        };

        BlobView.prototype.dissolveOrJell = function () {
            var that = this;
            $.each(this._springs, function (i, spring) {
                spring.data.stiffness = that._springSpec.stiffness * (1 - that._model.dissolution);
            });
        };

        BlobView.prototype.jiggle = function () {
            var that = this;
            this.group.forEach(function (glob) {
                if (Math.random() < 0.1) {
                    var x = 50 + Math.random() * 10;
                    var y = 100 + Math.random() * 800;
                    var force = [x, y];
                    glob.body.applyForce(force, glob.x, glob.y);
                }
            }, this);
        };

        BlobView.prototype.getConvexHull = function () {
            var convexHullScan = new ConvexHullGrahamScan();
            this.group.forEach(function (globSprite) {
                var x = globSprite.x;
                var y = globSprite.y;
                convexHullScan.addPoint(x, y);
            }, this);
            return convexHullScan.getHull();
        };

        return BlobView;
    }
);
