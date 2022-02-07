let avatarWidth = 100;
let avatarHeight = 150;
let characterMoveSpeed = 1.1;

class Avatar {
    constructor (avatarType) {
        this.avatarType = avatarType;
        this.imageIndex = 0;
        this.images = [];
        this.x = Math.round(Math.random() * (window.innerWidth - avatarWidth));
        this.y = window.innerHeight - avatarHeight;
        this.loadImages();
        this.moveFrames = 0;
        this.switchingSidesFrames = 0;
        this.isMovingRight = true;
    }

    loadImages() { 
        for (let i = 1; i < 3; i++) {
            loadImage(`images/${this.avatarType}/Poses/${this.avatarType.toLowerCase()}_walk${i}.png`, (image) => {
                image.resize(avatarWidth, avatarHeight);
                this.images.push(image);
            })
        }
    }

    draw() {
        if (!this.isMovingRight) {
            push();
            scale(-1, 1);
            image(this.images[this.imageIndex], -this.x, this.y);
            pop();
        } else {
            image(this.images[this.imageIndex], this.x, this.y);
        }
        this.x += characterMoveSpeed * (this.isMovingRight ? 1 : -1);

        if (this.moveFrames > 10) {
            this.imageIndex += 1;
            this.moveFrames = 0;

            if (this.imageIndex === this.images.length) {
                this.imageIndex = 0;
            }
        }

        if (this.switchingSidesFrames > 200) {
            this.isMovingRight = !this.isMovingRight;
            this.switchingSidesFrames = 0;
        }

        this.moveFrames += 1;
        this.switchingSidesFrames += 1;
    }
}

let avatars = [];
const client = tmi.Client({
    options: {debug: true},
    channels: ['kodingdesires']
})

client.connect();
client.on('message', (channel, tags, message, self) => {
    if (self) return;
    const avatar = avatars.find(avatar => avatar.userId = tags['user-id']);
    if (avatar) return;

    // when a new user types a message into the chat
    avatars.push()
})

function preload() {
    avatars.push(new Avatar('Adventurer'));
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background(220);

    for (let avatar of avatars) {
        avatar.draw();
    }
}


