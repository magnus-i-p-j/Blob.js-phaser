define(['app/Phaser', 'app/sprites/platform'],
    function (phaser, platform) {

        var Level01 = function () {
            this.onUpdate = new phaser.Signal();
        };

        Level01.prototype.init = function()
        {
            platform = platform.init(this);
        };

        Level01.prototype.preload = function () {
            this.load.image('sky', 'assets/sky.png');
            platform.preload(this);
        };

        Level01.prototype.create = function () {
            // start the P2JS physics system
            this.physics.startSystem(phaser.Physics.P2JS);
            this.physics.p2.gravity.y = 500;

            this.add.sprite(0, 0, 'sky');

            var ground = this.add.group();
            ground.add(platform.create( 600, this.world.height - 16, '1'));
            ground.add(platform.create( 200, this.world.height - 16, '2'));
            this.world.add(ground);

            this.world.add(platform.create( 200, 400, '3'));

        };

        Level01.prototype.update = function () {
            this.onUpdate.dispatch(this);
        };


        return Level01;
    }
);
