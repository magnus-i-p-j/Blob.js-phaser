define(['app/Phaser', 'app/states/level01'],
    function (phaser, level01) {
        var game = new phaser.Game(800, 600, Phaser.AUTO, '');
        game.state.add('level01', level01);
        game.start = function() {
            game.state.start('level01');
        };
        return game;
    }
);
