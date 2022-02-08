let avatarWidth = 100;
let avatarHeight = 150;
let characterMoveSpeed = 1.1;
let usernameTextSize = 20;
let fontFamily = "Poppins";
let avatarNames = ["Adventurer", "Female", "Soldier", "Player", "Zombie"];
let messageTextSize = 15;
let messageBoxSize = {width: 200, height: 100};
let textPadding = 10;
const imagesLength = 2;

class Avatar {
    constructor (avatarType, name) {
        this.scaleSize = 0.1;
        this.width = avatarWidth * this.scaleSize;
        this.height = avatarHeight * this.scaleSize;
        this.tagSize = usernameTextSize * this.scaleSize;
        this.name = name;
        this.avatarType = avatarType;
        this.imageIndex = 0;
        this.images = [];
        this.fullImages = [];
        this.scalingHasFinished = false;
        this.x = Math.round(Math.random() * (window.innerWidth - avatarWidth));
        this.y = window.innerHeight - avatarHeight;
        this.loadingImagesFinished = false;
        this.loadImages();
        this.moveFrames = 0;
        this.switchingSidesFrames = 0;
        this.isMovingRight = true;
        this.message = null;
        this.messageSize = 0.1;
        this.messageTimeElapsed = 0;
        this.maxMessageTimeElapsed = 100;
        this.messageShrinking = false;
        this.isFullyScaled = false;
    }

    loadImages() { 
        for (let i = 1; i < imagesLength + 1; i++) {
            loadImage(`images/${this.avatarType}/Poses/${this.avatarType.toLowerCase()}_walk${i}.png`, (image) => {
                image.resize(avatarWidth, avatarHeight);
                this.fullImages.push(image);
                let smallImage = createImage(avatarWidth, avatarHeight);
                smallImage.copy(image, 0, 0, avatarWidth, avatarHeight, 0, 0, avatarWidth, avatarHeight);
                smallImage.resize(this.width, this.height);
                this.images.push(smallImage);
                if (i === imagesLength) {
                    this.loadingImagesFinished = true;
                }
            })
        }
    }

    draw() {
        if (this.loadingImagesFinished) {
            this.update();
        }
    }

    update() {
        if (!this.isFullyScaled) {
            this.scaleSize += 0.1;
            if (this.scaleSize === 1) {
                this.isFullyScaled = true;
            }
            else {
                if (this.width < avatarWidth) {
                    this.width = avatarWidth * this.scaleSize;
                }
                if (this.height < avatarHeight) {
                    this.height = avatarHeight * this.scaleSize;
                }
                if (this.tagSize < usernameTextSize) {
                    this.tagSize = usernameTextSize * this.scaleSize;
                }

                for (let i = 0; i < this.images.length; i++) {
                    let scaledImage = createImage(avatarWidth, avatarHeight);
                    scaledImage.copy(this.fullImages[i], 0, 0, avatarWidth, avatarHeight, 0, 0, avatarWidth, avatarHeight);
                    scaledImage.resize(this.width, this.height);
                    this.images[i] = scaledImage;
                }
            } 
        }

        if (!this.isMovingRight) {
            push();
            scale(-1, 1);
            image(this.images[this.imageIndex], -this.x - avatarWidth, this.y);
            pop();
        } else {
            image(this.images[this.imageIndex], this.x, this.y,);
        }
        
        if (this.message) {
            let relativeBoxSize = { width: messageBoxSize.width * this.messageSize, height: messageBoxSize.height * this.messageSize };
            rect(this.x + avatarWidth / 2 - relativeBoxSize.width / 2, this.y - relativeBoxSize.height, relativeBoxSize.width, relativeBoxSize.height - usernameTextSize, 10 );
            textSize(messageTextSize * this.messageSize);
            text(this.message, this.x + avatarWidth / 2 - relativeBoxSize.width / 2 + textPadding, this.y - relativeBoxSize.height + textPadding, relativeBoxSize.width - textPadding, relativeBoxSize.height - textPadding);

            if (this.messageSize < 1 && !this.messageShrinking) {
                this.messageSize += 0.1;
            }

            if (this.messageTimeElapsed > this.maxMessageTimeElapsed) {
                this.messageShrinking = true;
                this.messageSize -= 0.1;
                if (this.messageSize < 0.1) {
                    this.message = null;
                    this.messageTimeElapsed = 0;
                    this.messageShrinking = false;
                }
            } else {
                this.messageTimeElapsed += 1;
            }
        }

        textSize(this.tagSize);
        text(this.name, this.x + avatarWidth / 2 - textWidth(this.name) / 2, this.y + usernameTextSize / 2);
        
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function createNewAvatar(name) {
    avatars.push(new Avatar(avatarNames[getRandomInt(0, avatarNames.length)], name));
}

client.connect();
client.on('message', (channel, tags, message, self) => {
    if (self) return;
    if (!tags['display-name']) return;
    const avatar = avatars.find(avatar => avatar.name === tags['display-name']);
    if (avatar) {
        avatar.message = message;
        return;
    }

    createNewAvatar(tags['display-name']);
})

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background(220);
    textFont(fontFamily);

    for (let avatar of avatars) {
        avatar.draw();
    }
}


