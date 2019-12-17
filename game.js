const canvasW = 1080;
const canvasH = 880;
const updateInterval = 20;

const creatureTypes = {
    plant: {
        width: 3,
        height: 8,
        color: 'green',
    },
    critter: {
        hunger: 0,
        maxHunger: 40,
        width: 20,
        height: 20,
        color: 'blue',
        radius: 10,
        x: 10,
        y: 20,
        speed: 3.5,
    },
};

function component(type, x, y) {
    this.id = Date.now();
    this.type = type;
    if (type === 'critter') {
        this.radius = creatureTypes.critter.radius;
    } else {
        this.width = creatureTypes[type].width;
        this.height = creatureTypes[type].height;
    }
    this.x = x || creatureTypes[type].x;
    this.y = y || creatureTypes[type].y;
    this.speedMultiplier = creatureTypes[type].speed;
    this.color = creatureTypes[type].color;
    this.dead = false;
    if (type !== 'plant') {
        this.hunger = creatureTypes[type].hunger;
        this.act = function () {
            this.hunger += Math.random()*0.1;
            //
            if (this.hunger >= 70) {
                this.color = 'yellow';
                this.speedMultiplier = 0;
            } else if (this.hunger >= 50) {
                // if dying from hunger
                this.color = 'black';
                this.speedMultiplier = 1.5;
            } else if (this.hunger >= 15 && plants.length > 0) {
                // if hungry
                // find nearest plant
                let nearestPlant = plants[0];
                let pxMoves = (plants[0].x + plants[0].y) - (this.x + this.y);
                if (pxMoves < 0) pxMoves *= -1;
                plants.forEach((plant, index) => {
                    if (index > 0) {
                       let compareMoves = (plant.x + plant.y) - (this.x + this.y);
                       if (compareMoves < 0) compareMoves *= -1;
                       if (compareMoves < pxMoves) {
                           pxMoves = compareMoves;
                           nearestPlant = plant;
                       }
                    }
                });
                if (nearestPlant.x < this.x) {
                    this.x -= this.speedMultiplier;
                }
                if (nearestPlant.x > this.x) {
                    this.x += this.speedMultiplier;
                }
                if (nearestPlant.y < this.y) {
                    this.y -= this.speedMultiplier;
                }
                if (nearestPlant.y > this.y) {
                    this.y += this.speedMultiplier;
                }
                if ((nearestPlant.x - this.x <= 5) && (nearestPlant.y - this.y <= 5)) {
                    console.log('got food');
                    this.hunger = 0;
                    plants.splice(plants.indexOf(nearestPlant), 1);
                }
            } else {
                // move randomly
                const leftOrRight = Math.random();
                const upOrDown = Math.random();
                let newX, newY;

                if (leftOrRight < .5) {
                    newX = -1 * Math.random();
                } else {
                    newX = Math.random();
                }

                if (upOrDown < .5) {
                    newY = -1 * Math.random();
                } else {
                    newY = Math.random();
                }

                // check boundaries
                this.x += newX * this.speedMultiplier;
                if (this.x < 0) this.x = 0;
                else if (this.x > canvasW) this.x = canvasW;

                this.y += newY * this.speedMultiplier;
                if (this.y < 0) this.y = 0;
                else if (this.y > canvasH) this.y = canvasH;
            }

            this.update();
        };
    }
    this.update = function() {
        ctx = world.context;
        if (this.type === 'critter') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

const critters = [];
for (let i = 0; i < 3; i++) {
    const x = (canvasW/2 * Math.random());
    const y = (canvasH/2 * Math.random());
    critters.push(new component('critter', x, y));
}
const plants = [];
for (let i = 50; i < 100; i++) {
    const x = (1 + Math.random()) * (i*5);
    const y = (1 + Math.random()) * (i*5);
    plants.push(new component('plant', x, y));
}

const world = {
    canvas: document.createElement('canvas'),
    start: function() {
        this.canvas.width = canvasW;
        this.canvas.height = canvasH;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, updateInterval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function startGame() {
    world.start();
}

function updateGameArea() {
    world.clear();
    critters.forEach((critter) => critter.act());
    plants.forEach((plant) => plant.update());
}