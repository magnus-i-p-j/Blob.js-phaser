define(
    function () {

        var Blob = function (state, x, y) {
            var globs = state.make.group();
            globs.alpha = 0.5;
            globs.enableBody = true;
            globs.physicsBodyType = Phaser.Physics.P2JS;

            // Create bodies
            var center = createGlobs(state, globs, x, y, 1, 0, 2)[0];
            var inner = createGlobs(state, globs, x, y, 5, 10, 1);
            var outer = createGlobs(state, globs, x, y, 10, 20, 0);

            // Create constraints
            for (var i = 0; i < inner.length; ++i) {
                createGlobSpring(state, center, inner[i]);
                createGlobSpring(state, inner[i], inner[(i + 1) % inner.length]);
                createGlobSpring(state, inner[i], outer[(i * 2) % outer.length]);
                createGlobSpring(state, inner[i], outer[(i * 2 + 1) % outer.length]);
            }
            for (var j = 0; j < outer.length; ++j) {
                createGlobSpring(state, outer[j], outer[(j + 1) % outer.length]);
            }

            var blob = new Blob(center, inner, outer);
            var binding = state.onUpdate.add(blob.update, blob);
            binding.params = [state];
            blob.prototype = globs;
            return blob;
        };

        Blob.prototype.update = function (state) {
            console.log('updating blob!');
        };

        var createGlobs = function (state, globs, ix, iy, n, radius, frame) {
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

        var createGlobSpring = function (state, lhs, rhs) {
            var restLength = 9;
            var stiffness = 10;
            var damping = 3;
            state.physics.p2.createSpring(lhs.body, rhs.body, restLength, stiffness, damping);
            // state.physics.p2.createDistanceConstraint(
            //    lhs.body, rhs.body, 8, [0, 0], [0, 0], 20);
        };

        return {
            init: function (state) {
                return {
                    preload: function () {
                        state.load.spritesheet('blob', 'assets/blob.png', 20, 20);
                    },
                    create: function (x, y) {
                        var blob = new Blob(state, x, y);

                    }
                }
            }
        }
    }
);
