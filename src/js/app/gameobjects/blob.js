define(['jquery', 'app/GameObjectFactory', 'vendor/ConvexHullGrahamScan'],
    function ($, GameObjectFactory, ConvexHullGrahamScan) {

        // A blob consists of globs
        var Glob = function () {
            this.view = null;
        };

        var Blob = function (state, x, y) {
            this.x = x;
            this.y = y;

            this.globSize = 8;
            this.globs = this.createGlobs();

            this._view = new View(state, this);
            this._controller = new Controller(state, this, this._view);
        };

        Blob.prototype.createGlobs = function () {
            var globs = [];
            var layout = [1, 2, 3, 4, 5, 6, 6, 4];
            for (var i = 0; i < layout.length; ++i) {
                globs.push([]);
                for (var j = 0; j < layout[i]; ++j) {
                    var glob = new Glob();
                    globs[i].push(glob);
                }
            }
            return globs;
        };

        Blob.prototype.update = function () {
            this._controller.update();
            this._view.update();
        };

        // View
        var View = function (state, model) {
            this.state = state;
            this.model = model;
            this.group = state.make.group();
            this.group.alpha = 1;
            this.group.enableBody = true;
            this.group.physicsBodyType = Phaser.Physics.P2JS;

            var globs = this.createGlobs();
            this.createGlobSprings(globs);

            state.world.add(this.group);

            this.graphics = this.state.add.graphics(0,0);
        };

        View.prototype.createGlobs = function () {
            var globs = this.model.globs;
            var globSize = this.model.globSize;
            var layoutMax = Math.max.apply(Math, globs.map(function (array) {
                return array.length;
            }));
            for (var i = 0; i < globs.length; ++i) {
                var offsetX = (((layoutMax - globs[i].length)) / 2) * globSize;
                var offsetY = globs.length - i * globSize;
                for (var j = 0; j < globs[i].length; ++j) {
                    var x = offsetX + this.model.x + j * globSize;
                    var y = this.model.y - offsetY;
                    var glob = this.group.create(x, y, 'glob');
                    glob.body.setRectangle(globSize);
                    globs[i][j].view = glob;
                    //glob.body.static = true;
                }
            }
            return globs;
        };

        View.prototype.createGlobSprings = function (globs) {
            var restLength = 10;
            var stiffness = 50;
            var damping = 10;

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
                    this.state.physics.p2.createSpring(
                        g_long[j].view,
                        g_short[Math.floor(j * step)].view,
                        restLength,
                        stiffness,
                        damping);
                }
            }

            for (i = 0; i < globs.length; ++i) {
                for (j = 1; j < globs[i].length; j++) {
                    this.state.physics.p2.createSpring(
                        globs[i][j].view,
                        globs[i][j - 1].view,
                        restLength,
                        stiffness,
                        damping);
                }
            }
        };

        View.prototype.update = function () {
            var hull = this.convexHull();
            var polygon = new Phaser.Polygon(hull);
            this.graphics.clear();
            this.graphics.beginFill(0xFF0000, 0.8);
            this.graphics.drawShape(polygon);
            this.graphics.endFill();
        };

        View.prototype.convexHull = function () {

            var convexHullScan = new ConvexHullGrahamScan();
            var globs = $.map(this.model.globs, function (layer) {
                return layer;
            });
            $.each(globs, function (i, g) {
                var x = g.view.x;
                var y = g.view.y;
                convexHullScan.addPoint(x, y);
            });

            return convexHullScan.getHull();
        };

        // Controller
        var Controller = function (state, model, view) {
            this._view = view;
            this._cursors = state.input.keyboard.createCursorKeys();
        };

        Controller.prototype.update = function () {
            if (this._cursors.left.isDown) {
                //  Move to the left
                this._view.group.forEach(function (glob) {
                    if (Math.random() > 0.7) {
                        glob.body.velocity.x = -150;
                    }
                }, this);
            }
            else if (this._cursors.right.isDown) {
                //  Move to the right
                this._view.group.forEach(function (glob) {
                    if (Math.random() > 0.7) {
                        glob.body.velocity.x = 150;
                    }
                }, this);


            }
            else {
                //  Stand still
                //this._view.center.body.velocity.y -= 10;
            }
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
