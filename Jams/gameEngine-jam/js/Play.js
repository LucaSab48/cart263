class Play extends Phaser.Scene {
    constructor() {
        super({
            key: "play"
        });
        this.speed = 500;
        this.long = 120;
    }

    create ()
    {
        this.anims.create({ key: 'fly', frames: this.anims.generateFrameNumbers('chick', [ 0, 1, 2, 3 ]), frameRate: 5, repeat: -1 });

        this.add.image(400, 300, 'backdrop').setScale(2.5);

        this.catGroup = this.physics.add.group();

        let cannonHead = this.add.image(130, 450, 'cannon_head').setDepth(1);
        let cannon = this.add.image(130, 500, 'cannon_body').setDepth(1);


        let graphics = this.add.graphics({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } });
        let line = new Phaser.Geom.Line();

        let angle = 0;

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'platform').setScale(0.01).refreshBody();

        this.platforms.create(600, 400, 'platform');
        this.platforms.create(50, 250, 'platform');
        this.platforms.create(750, 220, 'platform');


        this.input.on('pointermove', (pointer) => {
            angle = Phaser.Math.Angle.BetweenPoints(cannon, pointer);
            cannonHead.rotation = angle;
            Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, this.long);
            graphics.clear().strokeLineShape(line);
        });

        this.input.on('pointerup', () => {
            // chick.enableBody(true, cannon.x, cannon.y - 50, true, true);
            let chick = this.createCat(cannon.x, cannon.y - 50);
            chick.play('fly');
            this.physics.velocityFromRotation(angle, this.speed, chick.body.velocity);
            chick.body.setCollideWorldBounds(true);
            chick.body.setBounce(1, 1);
        });

        this.physics.world.setBounds(0, 0, 800, 600);
        this.physics.add.collider(this.chick, this.platforms);
    }

    
    createCat(x, y) {
        let chick = this.physics.add.sprite(x, y, 'chick')
                        .setScale(2)
                        .setCollideWorldBounds(true)
                        .setBounce(1, 1);

        this.catGroup.add(chick);

        return chick;
    }


    update() {

    }
}

   

