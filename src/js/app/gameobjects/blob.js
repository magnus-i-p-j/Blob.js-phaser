define(['app/GameObjectFactory'],
    function (GameObjectFactory) {

        var Blob = function (state, x, y) {
            this.x = x;
            this.y = y;
            var view = new View(state, this);
            this._controller = new Controller(state, this, view);
        };

        Blob.prototype.update = function () {
            this._controller.update();
        };

        // View
        var View = function (state, model) {
            var x = model.x;
            var y = model.y;

            this.globs = state.make.group();
            this.globs.alpha = 0.5;
            this.globs.enableBody = true;
            this.globs.physicsBodyType = Phaser.Physics.P2JS;

            // Create bodies
            this.center = this.createGlobs(state, this.globs, x, y, 1, 0, 2)[0];
            this.inner = this.createGlobs(state, this.globs, x, y, 5, 10, 1);
            this.outer = this.createGlobs(state, this.globs, x, y, 10, 20, 0);

            // Create constraints
            for (var i = 0; i < this.inner.length; ++i) {
                this.createGlobSpring(state, this.center, this.inner[i]);
                this.createGlobSpring(state, this.inner[i], this.inner[(i + 1) % this.inner.length]);
                this.createGlobSpring(state, this.inner[i], this.outer[(i * 2) % this.outer.length]);
                this.createGlobSpring(state, this.inner[i], this.outer[(i * 2 + 1) % this.outer.length]);
            }
            for (var j = 0; j < this.outer.length; ++j) {
                this.createGlobSpring(state, this.outer[j], this.outer[(j + 1) % this.outer.length]);
            }

            state.world.add(this.globs);
        };

        View.prototype.createGlobs = function (state, globs, ix, iy, n, radius, frame) {
            var step = (2 * Math.PI) / n;
            var createdGlobs = [];
            for (var i = 0; i < n; ++i) {
                var x = ix + Math.cos(step * i) * radius;
                var y = iy + Math.sin(step * i) * radius;
                var glob = globs.create(x, y, 'blob', frame);
                glob.body.fixedRotation = true;
                glob.rotation = step * i;
                glob.body.setRectangle(8, 8, 0, 0, 0);
                createdGlobs.push(glob);
            }
            return createdGlobs;
        };

        View.prototype.createGlobSpring = function (state, lhs, rhs) {
            var restLength = 9;
            var stiffness = 10;
            var damping = 3;
            state.physics.p2.createSpring(lhs.body, rhs.body, restLength, stiffness, damping);
            // state.physics.p2.createDistanceConstraint(
            //    lhs.body, rhs.body, 8, [0, 0], [0, 0], 20);
        };

        var Controller = function(state, model, view) {
            this._view = view;
            this._cursors = state.input.keyboard.createCursorKeys();
        };

        Controller.prototype.update = function() {
            if (this._cursors.left.isDown) {
                //  Move to the left
                this._view.globs.forEach(function (glob) {
                    if (glob.body.x <= this._view.center.x) {
                        glob.body.velocity.x = -150;
                    }
                    if (Math.random() > 0.7) {

                        glob.body.velocity.x += 30;
                    }
                }, this);
            }
            else if (this._cursors.right.isDown) {
                //  Move to the right
                this._view.globs.forEach(function (glob) {
                    if (glob.body.x >= this._view.center.x) {
                        glob.body.velocity.x = 150;
                    }
                    if (Math.random() > 0.7) {

                        glob.body.velocity.x -= 30;
                    }
                }, this);


            }
            else {
                //  Stand still
                this._view.center.body.velocity.y -= 10;
            }
        };

        return {

            preload: function (state) {
                state.load.spritesheet('blob', 'assets/blob.png', 20, 20);
            },
            factory: function (state) {
                return new GameObjectFactory(state, Blob);
            }
        }
    }
);
