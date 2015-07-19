define(['app/Phaser', 'app/GameObjectFactory', 'app/gameobjects/blob/GlobMesh', 'app/gameobjects/blob/BlobController', 'app/gameobjects/blob/BlobView'],
    function (Phaser, GameObjectFactory, GlobMesh, BlobController, BlobView) {

        //TODO: Handle enabling/disabling of debug.
        var debug = true;

        var Blob = function (state, x, y, mesh, mass, viscosity, stickiness) {
            this._state = state;
            this.mass = mass || mesh.vertices.length * 5;
            this.viscosity = viscosity || 1;
            this.stickiness = stickiness || 1; //TODO: Use this!

            this.onUpdate = new Phaser.Signal();

            this.bodies = this.createBodies(x, y, mesh);
            this.springs = this.createSprings(mesh);
        };

        Blob.prototype.createBodies = function(x, y, mesh) {
            var bodies = [];
            var physics = this._state.physics.p2;
            var bodyMass = this.mass / mesh.vertices.length;
            var shapeSize = 4;
            _.each(mesh.vertices, function(vertice) {
                var sprite = this._state.game.add.sprite(x + vertice.x, y + vertice.y, null);
                physics.enableBody(sprite);
                var body = sprite.body;
                body.mass = bodyMass;
                body.setRectangle(shapeSize, shapeSize);
                bodies.push(body);
                body.debug = debug;
            }, this);
            return bodies;
        };

        Blob.prototype.createSprings = function(mesh) {
            var restLength = 20; // TODO: calculate this one
            var stiffness =  40 * this.viscosity;
            var damping =  10 * (1 / this.viscosity);
            var physics = this._state.physics.p2;
            var springs = [];
            _.each(mesh.edges, function(edge) {
                var spring = physics.createSpring(
                    this.bodies[edge.p1],
                    this.bodies[edge.p2],
                    restLength,
                    stiffness,
                    damping);
                springs.push(spring);
            }, this);
            return springs;
        };

        //TODO: add Components!

        Blob.defaultMesh = function(scale) {
            scale = scale || 1;

            var layers = [1, 2, 3, 4, 5, 6, 6];

            var getVertices = function () {
                var vertices = [];
                var maxY = 4;
                var minY = -4;
                var minX = -5;
                var maxX = 5;
                for (var i = 0; i < layers.length; ++i) {
                    for (var x = (layers[i] - 1) * -1; x <= (layers[i] - 1); x += 2) {
                        vertices.push({ x: x * scale, y: -1* (maxY - i) * scale });
                    }
                }
                return vertices;
            };
            var getEdges = function() {
                var edges = [];
                var topMin = 0;
                var topMax;
                var bottomMin;
                var bottomMax;
                //Vertical
                for (var i = 0; i < layers.length - 1; ++i) {
                    var top = layers[i];
                    var bottom = layers[i + 1];
                    topMax = (top - 1) + topMin;
                    bottomMin = topMax + 1;
                    bottomMax = bottomMin + (bottom - 1);
                    for (var j = 0; j < top; ++j) {
                        var p1 = topMin + j;
                        var p2s = [];
                        if (!Math.abs(top - bottom)) {
                            p2s.push(bottomMin + j - 1);
                        }
                        p2s.push(bottomMin + j);
                        p2s.push(bottomMin + j + 1);
                        _.each(p2s, function (p2) {
                            if (p2 >= bottomMin && p2 <= bottomMax) {
                                edges.push({ p1: p1, p2: p2 });
                            }
                        });
                    }
                    topMin = bottomMin;
                }

                //TODO: Horizontal edges

                return edges;
            };

            var mesh = {
                vertices: getVertices(),
                edges: getEdges()
            };

            return mesh;
        };

        Blob.prototype.update = function () {
            this.onUpdate.dispatch(this);
        };

        return {
            defaultMesh: Blob.defaultMesh,
            preload: function (state) {
                state.load.spritesheet('glob', 'assets/glob-test.png');
            },
            factory: function (state) {
                return new GameObjectFactory(state, Blob);
            }
        }
    }
)
;
