define(['app/Phaser', 'app/gameobjects/Platform', 'app/gameobjects/blob/Blob'],
    function (Phaser, Platform, Blob) {

        var Level01 = function(){};

        // TODO: Base class for levels.
        Level01.prototype.preload = function () {
            this.load.image('sky', 'assets/sky.png');
            Platform.preload(this);
            Blob.preload(this);
            this.game.time.advancedTiming = true;
            this.lines = []; // TODO: Add to base class.
        };

        Level01.prototype.addLine = function(x1, y1, x2, y2) {
            this.lines.push(new Phaser.Line(x1, y1, x2, y2));
        };

        var factories = [];

        Level01.prototype.create = function () {
            // start the P2JS physics system
            this.physics.startSystem(Phaser.Physics.P2JS);
            this.physics.p2.gravity.y = 500;

            this.add.sprite(0, 0, 'sky');

            var platformFactory = Platform.factory(this);
            factories.push(platformFactory);

            // ground
            platformFactory.create(600, this.world.height - 16, '1');
            platformFactory.create( 200, this.world.height - 16, '2');
            // ledge
            platformFactory.create(200, 400, '3');

            var blobFactory = Blob.factory(this);
            factories.push(blobFactory);
            blobFactory.create(200, 200, 20, 20);
        };

        Level01.prototype.update = function () {
            $.each(factories, function (i, factory) {
                factory.update();
            });
            //console.log(this.game.time.fps);
        };


        return Level01;
    }
);
