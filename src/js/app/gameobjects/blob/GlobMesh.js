define(
    function () {

        var GlobMesh = function (layout, globSpec) {
            this._globs = [];
            var seed = 0;
            this._nextId = function () {
                return seed++;
            };
            this.createGlobs(layout, globSpec);
            this.connectGlobs(layout);
        };

        GlobMesh.prototype.createGlobs = function (layout, globSpec) {
            for (var i = 0; i < layout.length; ++i) {
                for (var j = 0; j < layout[i]; ++j) {
                    var glob = new Glob(globSpec);
                    var node = new GlobMeshNode(glob, this._nextId());
                    this._globs.push(node);
                }
            }
        };

        GlobMesh.prototype.connectGlobs = function (layout) {
            var offset = 0;
            for (var i = 0; i < layout.length - 1; ++i) {
                var top = this._globs.slice(offset, layout[i]);
                offset += layout[i];
                var bottom = this._globs.slice(offset, layout[i + 1]);
                offset += layout[i];

                var long;
                var short;
                var setAdjacent;
                if (top.length <= bottom.length) {
                    setAdjacent = function (j, k) {
                        top[k].setAdjacent(bottom[j]);
                    };
                    long = bottom;
                    short = top;
                } else {
                    setAdjacent = function (j, k) {
                        top[j].setAdjacent(bottom[k]);
                    };
                    long = top;
                    short = bottom;
                }

                var step = short.length / long.length;

                for (var j = 0; j < long.length; j++) {
                    var k = Math.floor(j * step);
                    setAdjacent(j, k);
                }
            }
        };

        var GlobMeshNode = function (glob, id) {
            this.glob = glob;
            this.id = id;
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

        GlobMesh.prototype.forEach = function (func) {
            _.forEach(this._globs, function (node) {
                func(node)
            });
        };

        GlobMesh.prototype.forEachLayer = function (func) {
            _.forEach(this._globs, function (node) {

            });
        };

        return GlobMesh;
    }
);