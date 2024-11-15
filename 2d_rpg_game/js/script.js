console.log("Test..");

// Global variables
var player;
var cursors;
var keyW, keyA, keyS, keyD, keyShift;
var camera;
var layerBackground;

function preload() 
{
    // Path to assets (relative from index.html)
    this.load.path = './assets/'

    // Character atlas
    this.load.atlas('hero', 'character.png', 'character.json');

    // Enemy atlas
    this.load.atlas('enemy', 'NPC_test.png', 'NPC_test.json');

    // Map tiles image
    this.load.image('overworldTiles', 'overworld.png');
    // Map json file
    this.load.tilemapTiledJSON('map', '2d_rpg_map.json');

}

function create() 
{

    // test if overworld tile image loads correctly
    // this.add.image(400, 300, 'overworldTiles')

    // Map - Create tilemap
    const map = this.make.tilemap( { key: 'map'} );

    // overworld tileset image
    const overworldTiles = map.addTilesetImage('overworld', 'overworldTiles');

    
    // Layer 0 background
    const layerBackground = map.createLayer('background', overworldTiles);
    
    // Layer 1 ground
    const layerGround = map.createLayer('ground', overworldTiles);
    
    // Layer 2 Objects with Collision
    const layerObjectsWithCollision = map.createLayer('objectsWithCollision', overworldTiles);
    layerObjectsWithCollision.setCollisionByExclusion([-1]);
    // layerObjectsWithCollision.setCollisionByProperty( { collision: true } ); // Could not get this to work

    



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
    player = this.physics.add.sprite(0, 0, 'hero');
    // player size
    player.setSize(14, 14);
    // Size offset
    player.setOffset(0, 7)

    // Layer 3 above
    const layerAbove = map.createLayer('above', overworldTiles);


    // Camera
    camera = this.cameras.main;
    
    // Follow player
    camera.startFollow(player);

    // Bounds
    // camera.setBounds(0, 0, layerGround.widthInPixels, layerGround.heightInPixels);

    // Zoom
    camera.setZoom(1.4);


    // Collision
    this.physics.add.collider(player, layerObjectsWithCollision);
    


    // Animations

    // Hero
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

    // Enemy
    this.anims.create({
        key: 'enemyMove',
        frames: [{ key: 'enemy', frame: 'sprite1' }],
        frameRate: 10,
        repeat: -1
    });

    // Debug Graphics

    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    // const graphics = this.add
    //   .graphics()
    //   .setAlpha(0.75)
    //   .setDepth(20);
    // layerObjectsWithCollision.renderDebug(graphics, {
    // tileColor: null, // Color of non-colliding tiles
    // collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    // faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    

}


function update() 
{

    const defaultVelocity = 100
    const prevVelocity = player.body.velocity.clone();

    // Initialize player velocity
    player.setVelocity(0);

    // Sprint
    // let multiplier = 1;
    if (this.keyShift.isDown)  multiplier = 1.5

    // Keybindings
    // Vertical movement
    if (cursors.down.isDown || this.keyS.isDown) {
        player.body.setVelocityY(defaultVelocity); // * multiplier to enable sprint
    } else if (cursors.up.isDown || this.keyW.isDown) {
        player.body.setVelocityY(-defaultVelocity);
    }

    // Horizontal movement
    if (cursors.right.isDown || this.keyD.isDown){
        player.body.setVelocityX(defaultVelocity);
    } else if (cursors.left.isDown || this.keyA.isDown) {
        player.body.setVelocityX(-defaultVelocity);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(defaultVelocity);

    // Animations - animation get precedence in the start of the if else
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
    if (
        !cursors.left.isDown && !this.keyA.isDown &&
        !cursors.right.isDown && !this.keyD.isDown &&
        !cursors.up.isDown && !this.keyW.isDown &&
        !cursors.down.isDown && !this.keyS.isDown
    ) {
    if (prevVelocity.x < 0) player.setTexture('hero', 'moveLeft001');
    else if (prevVelocity.x > 0) player.setTexture('hero', 'moveRight001');
    else if (prevVelocity.y > 0) player.setTexture('hero', 'moveDown001');
    else if (prevVelocity.y < 0) player.setTexture('hero', 'moveUp001');
    }
    

}

// Config
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#878787',
    // pixelArt: true,
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