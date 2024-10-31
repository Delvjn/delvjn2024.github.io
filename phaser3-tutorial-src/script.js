var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            debug: false,
            checkCollision: { up: false },
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
//  Global variables
var player;
var platforms;
var stars;
var cursors;
var score = 0;
var scoreText;
var bombs;
var gameOver = false;
var bomb;

// Game
var game = new Phaser.Game(config)

function preload () 
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}



function create () 
{   
    // Background
    this.add.image(400, 300, 'sky');
    
    // Platforms staticGroup
    platforms = this.physics.add.staticGroup();
    
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(600, 400, 'ground');


    
    // Player
    player = this.physics.add.sprite(100, 450, 'dude');
    
    // player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    // player.body.setGravityY(700);
    
    // Left movement animation
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    // Turn animation
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    
    // Right movement animation
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // In-build keyboard manager
    cursors = this.input.keyboard.createCursorKeys();
    
    // Stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 5,
        setXY: { x: 48, y: 0, stepX: 140 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Bombs
    bombs = this.physics.add.group();
    
    // Collision
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    // this.physics.add.collider(player, stars);
    // this.physics.add.collider(stars, stars);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    
    // Overlap
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Score
    scoreText = this.add.text(16, 16, 'Sindre`s score: 0', { fontSize: '32px', fill: '#fff' } );

    //  Timer
    this.initialTime = 10;
    this.gameOver = false;
    // Display timer
    this.timeText = this.add.text(16, 50, `Time: ${this.initialTime}`, { fontSize: '32px', fill: '#fff'} );
    
    this.updateTimer = function () {
        if (this.gameOver) {
            return;
        }
        this.initialTime -= 1;
        this.timeText.setText(`Time: ${this.initialTime}`);

        if (this.initialTime <= 0) {
        
            this.physics.pause();

            player.setTint(0xff0000);

            player.anims.play('turn');

            gameOver = true;

            this.add.text(400, 150, `Game Over`, { fontSize: '64px', fill: '#fff' } ).setOrigin(0.5);
            this.add.text(400, 300, `Total score: ${score}`, { fontSize: '32px', fill: '#fff' } ).setOrigin(0.5);
        }
    }

    this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
    });


}

function update () 
{
    // Game over
    if (this.gameOver) {
        return;
    }
    if (gameOver)
    {
        return;
    }
    // Key logic and velocity
    if (cursors.left.isDown)
    {
        player.setVelocityX(-260);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(260);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-740);
    }


}

// Collecting/disabling body stars
function collectStar(player, star) 
{
    star.disableBody(true, true);

    score += 100;
    scoreText.setText('Sindre`s score: ' + score);

    // Check if star count is 0
    if (stars.countActive(true) === 0)
    {   

        stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        // If player is on the x coordinate less than 400 save a value between 400 and 800, else same a number between 0 and 400.
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        // var y = Phaser.Math.Between(0, 400);

        bomb = bombs.create(x, 0, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 300);
    }
}

function hitBomb (player, bomb) 
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    this.add.text(400, 150, `Game Over`, { fontSize: '64px', fill: '#fff' } ).setOrigin(0.5);
    this.add.text(400, 300, `Total score: ${score}`, { fontSize: '32px', fill: '#fff' } ).setOrigin(0.5);
}















