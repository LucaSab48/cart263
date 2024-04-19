class Particle {
    constructor(x, y, fill) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.fill = fill;
        this.size = 10;
        this.maxForce = 5;
        this.minForce = 0;
    }

    update() {
        let mouseVector = createVector(mouseX, mouseY);
        let particleVector = createVector(this.x, this.y);
        let targetVector = createVector(this.targetX, this.targetY);
        let mouseToParticle = p5.Vector.sub(particleVector, mouseVector);
        let mouseDistance = mouseToParticle.mag();
        let particleToTarget = p5.Vector.sub(targetVector, particleVector);
        let targetDistance = particleToTarget.mag();
        let sumForce = createVector(0, 0);

        if(mouseDistance < 80) {
            let pushForce = map(mouseDistance, 0, 100, this.maxForce, this.minForce);
            mouseToParticle.setMag(pushForce);
            sumForce.add(mouseToParticle);
        }

        if(mouseDistance > 0) {
            let pullForce = map(targetDistance, 0, 100, this.minForce, this.maxForce);
            particleToTarget.setMag(pullForce);
            sumForce.add(particleToTarget);
        }

        this.x += sumForce.x
        this.y += sumForce.y

    }

    display() {
        fill(this.fill);
        noStroke();
        ellipse(this.x, this.y, this.size);

    }
}