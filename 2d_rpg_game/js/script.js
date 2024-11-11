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
var keyW, keyA, keyS, keyD, keyShift;
var camera;

function preload() 
{
    // Path to assets (relative from index.html)
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
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);    

    // Create player sprite
    console.log("Loading player...");    
    player = this.physics.add.sprite(400, 300, 'hero');


    // Animations
    this.anims.create({
        key: 'idleDown',
        frames: [{ key: 'hero', frame: 'moveDown001' }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleUp',
        frames: [{ key: 'hero', frame: 'moveUp001' }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleRight',
        frames: [{ key: 'hero', frame: 'moveRight001' }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleLeft',
        frames: [{ key: 'hero', frame: 'moveLeft001' }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'moveDown',
        frames: this.anims.generateFrameNames('hero', {
            prefix: 'moveDown',
            start: 1,
            end: 4,
            zeroPad: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'moveUp',
        frames: this.anims.generateFrameNames('hero', {
            prefix: 'moveUp',
            start: 1,
            end: 4,
            zeroPad: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'moveRight',
        frames: this.anims.generateFrameNames('hero', {
            prefix: 'moveRight',
            start: 1,
            end: 4,
            zeroPad: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'moveLeft',
        frames: this.anims.generateFrameNames('hero', {
            prefix: 'moveLeft',
            start: 1,
            end: 4,
            zeroPad: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    // Camera
    camera = this.cameras.main;

    // Zoom
    camera.setZoom(1.5);

    // Follow player
    // camera.startFollow(player);

    

}

// Idle animation logic

function update() 
{

    const defaultVelocity = 100
    const prevVelocity = player.body.velocity.clone();

    // Initialize player velocity
    player.setVelocity(0, 0);

    // Sprint
    // let multiplier = 1;
    // if (this.keyShift.isDown)  multiplier = 1.5

    // Keybindings and associated animations
    
    // Vertical movement
    if (cursors.down.isDown || this.keyS.isDown) {
        player.setVelocityY(defaultVelocity); // * multiplier to enable sprint
        // player.anims.play('moveDown', true);
    } else if (cursors.up.isDown || this.keyW.isDown) {
            player.setVelocityY(-defaultVelocity);
            // player.anims.play('moveUp', true);
    }

    // Horizontal movement
    if (cursors.right.isDown || this.keyD.isDown){
        player.setVelocityX(defaultVelocity);
        // player.anims.play('moveRight', true)
    } else if (cursors.left.isDown || this.keyA.isDown) {
            player.setVelocityX(-defaultVelocity);
            // player.anims.play('moveLeft', true);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(defaultVelocity);

    // Animations - animation get precedence in the start of the if else, and less down in the if else
    if (cursors.right.isDown || this.keyD.isDown) {
        player.anims.play('moveRight', true);
    } else if (cursors.left.isDown || this.keyA.isDown) {
        player.anims.play('moveLeft', true);
    } else if (cursors.down.isDown || this.keyS.isDown) {
        player.anims.play('moveDown', true);
    } else if (cursors.up.isDown || this.keyW.isDown) {
        player.anims.play('moveUp', true);
    } else player.anims.stop();

    // Idle animations
    // if (velocity)




}

