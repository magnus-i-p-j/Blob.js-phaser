define(['jquery'],
    function ($) {
        var BlobController = function (state, model, view) {
            this._state = state;
            this._model = model;
            this._view = view;
            this._cursors = state.input.keyboard.createCursorKeys();

            this._model.onUpdate.add(this.update, this);
        };

        BlobController.prototype.update = function () {
            var moving = false;
            if (this._cursors.left.isDown) {
                //  Move to the left
                this._view.group.forEach(function (glob) {
                    if (Math.random() < 0.1) {
                        glob.body.velocity.x = -150;
                    }
                }, this);
                moving = true;
            }

            if (this._cursors.right.isDown) {
                //  Move to the right
                this._view.group.forEach(function (glob) {
                    if (Math.random() < 0.1) {
                        glob.body.velocity.x = 150;
                    }
                }, this);
                moving = true;
            }

            var dissolution = this.getDissolution(moving);
            this._model.dissolution = dissolution;

        };

        BlobController.prototype.getDissolution = function (moving) {
            var min_d = 0.01;
            var max_d = 1;
            var deltaTime = this._state.time.elapsed / 1000;
            // f_dissolution = 0.3x + 0.1
            var totalTime = (this._model.dissolution - min_d) / 0.3;
            totalTime = moving ? totalTime + deltaTime : totalTime - deltaTime;
            var dissolution = max_d * totalTime * 0.3 + min_d;
            return Math.max( min_d, Math.min(max_d, dissolution));
        };

        return BlobController;
    }
);