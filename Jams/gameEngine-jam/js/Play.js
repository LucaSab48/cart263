class Play extends Phaser.Scene {
    constructor() {
        super({
            key: "play"
        });
        this.speed = 500;
        this.long = 120;
    }

    platforms;
    score = 0;
    chickGroup = [];
    scoreText;
    cursors;

    create ()
    {
        this.anims.create({ key: 'fly', frames: this.anims.generateFrameNumbers('chick', [ 0, 1, 2, 3 ]), frameRate: 5, repeat: -1 });

        this.add.image(400, 300, 'backdrop').setScale(2.5);

        this.chickGroup = this.physics.add.group();

        let cannonHead = this.add.image(130, 450, 'cannon_head').setDepth(1);
        let cannon = this.add.image(130, 500, 'cannon_body').setDepth(1);



        let graphics = this.add.graphics({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } });
        let line = new Phaser.Geom.Line();

        let angle = 0;

        this.platforms = this.physics.add.staticGroup();

        // this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'platform');
        this.platforms.create(50, 250, 'platform');
        this.platforms.create(750, 220, 'platform');

        this.house = this.physics.add.sprite(750, 100,'house').setScale(0.2);

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.input.on('pointermove', (pointer) => {
            angle = Phaser.Math.Angle.BetweenPoints(cannon, pointer);
            cannonHead.rotation = angle;
            Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, this.long);
            graphics.clear().strokeLineShape(line);
        });

        this.input.on('pointerup', () => {
            let chick = this.makeChick(cannon.x, cannon.y - 50);
            chick.play('fly');
            this.physics.velocityFromRotation(angle, this.speed, chick.body.velocity);
            chick.body.setCollideWorldBounds(true);
            chick.body.setBounce(1, 1);
            this.physics.add.collider(chick, this.platforms);
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0, 0, 800, 600);
        this.physics.add.collider(this.house, this.platforms);
        this.physics.add.overlap(this.chickGroup.getChildren(), this.house, this.goneHome, null, this);

    }

    
    makeChick(x, y) {
        let chick = this.physics.add.sprite(x, y, 'chick')
                        .setScale(2)
                        .setCollideWorldBounds(true)
                        .setBounce(1, 1);

        this.chickGroup.add(chick);

        return chick;
    }


    update() {
        if (this.gameOver)
        {
            return;
        }

        if (this.cursors.up.isDown)
        {
            if(this.speed < 1000 && this.long < 300) {
                this.speed += 10;
                this.long += 5;
            }
        }
        else if (this.cursors.down.isDown)
        {
            if(this.speed > 20 && this.long > 50) {
                this.speed += -10;
                this.long += -5;
            }
        }

    }

    goneHome(chick, house) {
        chick.destroy();

        //  Add and update the score
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);


    }
}

   

