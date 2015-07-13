/* globals Phaser: false */
/* globals jQuery: false */
var Game = (function (phaser, $) {
    var game = null;
    var currentLevel;

    function preload() {
        game.load.image('sky', 'assets/sky.png');

        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('blob', 'assets/blob.png', 20, 20);

        // ///////////////////////////////////////////////////////////////////////
        $.each(currentLevel.entities, function (i, entity) {
            $.each(entity.assets.images, function (j, image) {
                game.load.image(image.key, image.url);
            });
        });
        // ///////////////////////////////////////////////////////////////////////
    }

    var center;
    var inner;
    var outer;
    var globs = null;
    var Blob = (function (blob) {


        var createGlobs = function (origin, n, radius, frame) {
            var step = (2 * Math.PI) / n;
            var createdGlobs = [];
            for (var i = 0; i < n; ++i) {
                var x = origin.x + Math.cos(step * i) * radius;
                var y = origin.y + Math.sin(step * i) * radius;
                var glob = globs.create(x, y, 'blob', frame);
                glob.body.fixedRotation = true;
                glob.rotation = step * i;
                glob.body.setRectangle(8, 8, 0, 0, 0);
                createdGlobs.push(glob);
            }
            return createdGlobs;
        };

        var createGlobSpring = function (lhs, rhs) {
            var restLength = 9;
            var stiffness = 10;
            var damping = 3;
            game.physics.p2.createSpring(lhs.body, rhs.body, restLength, stiffness, damping);
            // game.physics.p2.createDistanceConstraint(
            //    lhs.body, rhs.body, 8, [0, 0], [0, 0], 20);
        };

        /* var evaluateBlobConstraints = function(composite) {
         return function() {
         var once = false;
         var constraints = Composite.allConstraints(composite);
         $.each(constraints, function(index, constraint) {
         if(!once){

         }
         });
         };
         }; */

        var createBlob = function (origin) {
            globs = game.add.group();
            globs.alpha = 0.5;
            globs.enableBody = true;
            globs.physicsBodyType = Phaser.Physics.P2JS;

            // Create bodies
            center = createGlobs(origin, 1, 0, 2)[0];
            inner = createGlobs(origin, 5, 10, 1);
            outer = createGlobs(origin, 10, 20, 0);

            // Create constraints
            for (var i = 0; i < inner.length; ++i) {
                createGlobSpring(center, inner[i]);
                createGlobSpring(inner[i], inner[(i + 1) % inner.length]);
                createGlobSpring(inner[i], outer[(i * 2) % outer.length]);
                createGlobSpring(inner[i], outer[(i * 2 + 1) % outer.length]);
            }
            for (var j = 0; j < outer.length; ++j) {
                createGlobSpring(outer[j], outer[(j + 1) % outer.length]);
            }

        };

        blob.createBlob = createBlob;

        return blob;
    })(Blob || {});


    function updateBlobTexture() {

    }

    var platforms;
    var player;
    var cursors;


    function create() {

        // start the P2JS physics system
        game.physics.startSystem(phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 500;

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        platforms.physicsBodyType = Phaser.Physics.P2JS;

        // Here we create the ground.
        var ground = platforms.create(200, game.world.height - 16, 'ground');
        ground.body.static = true;
        //  The original sprite is 400x32 in size
        ground = platforms.create(600, game.world.height - 16, 'ground');
        ground = ground.body.static = true;

        //  This stops it from falling away when you jump on it


        //  Now let's create two ledges
        var ledge = platforms.create(200, 400, 'ground');

        ledge.body.static = true;

        // ledge = platforms.create(-150, 250, 'ground');

        // ledge.body.static = true;


        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        game.physics.p2.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        // player.body.bounce.y = 0.2;
        // player.body.gravity.y = 300;
        // player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();


        Blob.createBlob({ x: 200, y: 200 });

        // ///////////////////////////////////////////////////////////////////////
        /* $.each(currentLevel.entities, function(i, entity) {
         var sprite = game.add.sprite(entity.x, entity.y, entity.key);
         game.physics.p2.enableBody(sprite);
         }); */
        // ///////////////////////////////////////////////////////////////////////
    }


    function update() {
        updateBlobTexture();

        //  Collide the player and the stars with the platforms
        // game.physics.arcade.collide(player, platforms);
        // game.physics.arcade.collide(stars, platforms);


        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.rotation = 0;

        if (cursors.left.isDown) {
            //  Move to the left

            globs.forEach(function (glob) {
                if (glob.body.x <= center.x) {
                    glob.body.velocity.x = -150;
                }
                if (Math.random() > 0.7) {

                    glob.body.velocity.x += 30;
                }
            }, this);
            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            globs.forEach(function (glob) {
                if (glob.body.x >= center.x) {
                    glob.body.velocity.x = 150;
                }
                if (Math.random() > 0.7) {

                    glob.body.velocity.x -= 30;
                }
            }, this);

            player.animations.play('right');
        }
        else {
            //  Stand still
            center.body.velocity.y -= 10;
            player.animations.stop();
            player.frame = 4;
        }


    }


    return {
        EntityGroup: function () {

        },
        Entity: function (x, y, key, assets) {
            this.x = x;
            this.y = y;
            this.key = key;
            this.assets = assets || {};
        },
        start: function (level) {
            currentLevel = level;
            game = new phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
        }
    };
}(Phaser, jQuery));

Game.Level = (function (level) {
    // Check out states later on for now this is enough
    var Level = function (assets) {
        this.entities = [];
        this.player = null;
        this.assets = assets;
    };
    Level.prototype.addEntity = function (entity) {
        this.entities.push(entity);
    };
    Level.prototype.addPlayer = function (player) {
        this.player = player;
    };
    level.Level = Level;

    return level;
}(Game.Level || {}));


(function () {
    var level = new Game.Level.Level();
    var blob = new Game.Entity(50, 50, 'glob', {
        images: [{ key: 'glob', url: 'assets/glob.png' }]
    });
    level.addEntity(blob);
    Game.start(level);
}());


