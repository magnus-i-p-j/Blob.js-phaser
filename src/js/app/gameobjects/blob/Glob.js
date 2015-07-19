define(
    function () {
        var Glob = function (globSpec) {
            this.size = globSpec.size || 10;
            this.mass = globSpec.mass || 5;
            this.alive = true;
        };
        return Glob;
    }
);