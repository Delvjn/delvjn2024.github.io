console.log("Test..");

// Config
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#878787',
    physics: {
        default: 'arcade',
        debug: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

// Game instance
var game = new Phaser.Game(config);

// Global variables

var player;
var cursors;
var keyW, keyA, keyS, keyD;

function preload() 
{
    // Path to assets (relative to index.html)
    this.load.path = './assets/'
    // Atlas
    this.load.atlas('hero', 'character.png', 'character.json');
}

function create() 
{
    // Initialize arrow keys
    cursors = this.input.keyboard.createCursorKeys();

    // Initialize WASD keys
    this.keyW = this.input.keyboard.addKey('w');
    this.keyA = this.input.keyboard.addKey('a');
    this.keyS = this.input.keyboard.addKey('s');
    this.keyD = this.input.keyboard.addKey('d');

    // Create player sprite
    console.log("Loading player...");    
    player = this.physics.add.sprite(400, 300, 'hero');


    // Animations
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'hero', frame: 'sprite0001' }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('hero', {
            prefix: 'sprite',
            start: 1,
            end: 4,      // End frame index
            zeroPad: 4   // Remove or set to 0 to match "sprite1", "sprite2", etc.
        }),
        frameRate: 10,
        repeat: -1
    });

}

function update() 
{
    // Initialize player velocity
    player.setVelocityX(0);
    player.setVelocityY(0);
    
    // Keybinding
    if (cursors.left.isDown || this.keyA.isDown) {
        player.setVelocityX(-200);
        player.anims.play('walk', true);
    }
    if (cursors.right.isDown || this.keyD.isDown){
        player.setVelocityX(200);
        player.anims.play('walk', true)
    }
    if (cursors.up.isDown || this.keyW.isDown) {
        player.setVelocityY(-200);
        player.anims.play('walk', true);
    } 
    if (cursors.down.isDown || this.keyS.isDown) {
        player.setVelocityY(200);
        player.anims.play('walk', true);
    }
    // Idle animation
    if (!(cursors.left.isDown || this.keyA.isDown || cursors.right.isDown || this.keyD.isDown || cursors.up.isDown || this.keyW.isDown || cursors.down.isDown || this.keyS.isDown)) {
        player.anims.play('idle');
    }

    

}

