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



        let cannonHead = this.add.image(130, 450, 'cannon_head').setDepth(1);
        let cannon = this.add.image(130, 500, 'cannon_body').setDepth(1);
        let chick = this.physics.add.sprite(cannon.x, cannon.y - 50, 'chick')
                        .setScale(2)
                        .setVelocity(300, 300)
                        .setCollideWorldBounds(true, 1, 1);
                        

        let graphics = this.add.graphics({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } });
        let line = new Phaser.Geom.Line();

        chick.disableBody(true, true);

        let angle = 0;

        this.input.on('pointermove', (pointer) => {
            angle = Phaser.Math.Angle.BetweenPoints(cannon, pointer);
            cannonHead.rotation = angle;
            Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, this.long);
            graphics.clear().strokeLineShape(line);
        });

        this.input.on('pointerup', () => {
            chick.enableBody(true, cannon.x, cannon.y - 50, true, true);
            chick.play('fly');
            this.physics.velocityFromRotation(angle, this.speed, chick.body.velocity);
        });
    }



    update() {
        this.input.on('pointerdown', () => {
            if(this.speed < 1000) {
                this.speed += 1;
            }
    
            if(this.long < 500) {
                this.long += 0.1;
            }
    
            console.log(this.speed);
            console.log(this.long);
            })

            this.input.on('pointerup', () => {
                this.returnBar;
            });
        }




    returnBar() {
        this.speed = 500;
        this.long = 120; 
    }

}

   

