define(['lodash', 'app/gameobjects/blob/Glob'],
    function (_, Glob) {

        var GlobMesh = function (layout, globSpec) {
            this._globs = [];
            var seed = 0;
            this._nextId = function () {
                return seed++;
            };
            this.createGlobs(layout, globSpec);
            this.connectGlobs(layout);
            this.width = _.max(layout);
            this.height = layout.length;
        };

        GlobMesh.prototype.createGlobs = function (layout, globSpec) {
            for (var i = 0; i < layout.length; ++i) {
                for (var j = 0; j < layout[i]; ++j) {
                    var glob = new Glob(globSpec);
                    var node = new GlobMeshNode(glob, this._nextId(), j);
                    this._globs.push(node);
                }
            }
        };

        GlobMesh.prototype.connectGlobs = function (layout) {
            this.connectVertically(layout);
            this.connectHorizontally(layout);
        };

        GlobMesh.prototype.connectVertically = function (layout) {
            var offset = 0;
            for (var i = 0; i < layout.length - 1; ++i) {
                var top = this._globs.slice(offset, offset + layout[i]);
                offset += layout[i];
                var bottom = this._globs.slice(offset, offset + layout[i + 1]);

                var long;
                var short;
                var setAdjacent;
                if (top.length <= bottom.length) {
                    long = bottom;
                    short = top;
                    setAdjacent = function (j, k) {
                        top[k].setAdjacent(bottom[j]);
                    };
                } else {
                    long = top;
                    short = bottom;
                    setAdjacent = function (j, k) {
                        top[j].setAdjacent(bottom[k]);
                    };
                }

                var step = short.length / long.length;

                for (var j = 0; j < long.length; j++) {
                    var k = Math.floor(j * step);
                    setAdjacent(j, k);
                }
            }
        };

        GlobMesh.prototype.connectHorizontally = function (layout) {
            _.reduce(layout, function (offset, n) {
                var layer = this._globs.slice(offset, offset + n);
                for (var i = 1; i < layer.length; ++i) {
                    layer[i - 1].setAdjacent(layer[i]);
                }
                return offset + n;
            }, 0, this);
        };

        var GlobMeshNode = function (glob, id, layer) {
            this.glob = glob;
            this.id = id;
            this._layer = layer;
            this._adjacent = [];
            this._connected = [];
        };

        GlobMeshNode.prototype.setAdjacent = function (other) {
            this._adjacent.push(other);
            this._connected.push(true);
        };

        GlobMeshNode.prototype.getAdjacent = function () {
            return _.map(this._adjacent, function (other, i) {
                return {
                    start: this,
                    end: other,
                    connected: this._connected[i]
                };
            }, this);
        };

        GlobMesh.prototype.forEach = function (func, that) {
            _.forEach(this._globs, function (node, index) {
                if (that) {
                    func.call(that, node, index, node._layer);
                } else {
                    func(node, index, node._layer);
                }
            });
        };


        return GlobMesh;
    }
);