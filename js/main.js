import "../style.css";
import "phaser";
import Home from "./scenes/Home";
import io from "socket.io-client";
import Home1 from "./scenes/Home1";
import Snackbar from "./ui/Alerts/Snackbar";
import Stats from "./ui/Alerts/Stats";
// import GamePicker from "./ui/Popup/GamePicker";
// import Leaderboard from "./ui/Popup/Leaderboard";
// import AudioChatPopup from "./ui/Popup/AudioChatPopup";

export let state = {};
export const stats = new Stats();
export const setState = (update) => {
  state = update;
};

export const socket = io();
export const snackbar = new Snackbar();
socket.on("connect", () => {
  console.log("Connected to the server...");
});

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 700,
  parent: "canvas",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },

  scene: Home1,
};

// const audioPopup = new AudioChatPopup("abc", {
//   username: "sandeep",
//   avatar: "cap_blue_boy",
// });
// audioPopup.show();
// const leaderboard = new Leaderboard("Dinosaur");
// leaderboard.show();

// const gamePicker = new GamePicker();
// gamePicker.show();

const game = new Phaser.Game(config);
game.scene.add("Home", Home);

/*
let cursors;so
let player, watchman;
let showDebug = false;

function preload() {
  this.load.image("tiles", "./maps/BeachTileset.png");
  this.load.tilemapTiledJSON(
    "beach",
    "./maps/beach.json",
    null,
    Phaser.Tilemaps.TILED_JSON
  );
  this.load.atlas(
    "self",
    `${baseURL}/characters/sprites/cap_blue_boy.png`,
    `${baseURL}/characters/json/spritesheet.json`
  );
}

const decideFace = (sprite, colCoords) => {
  const xDiff = sprite.x - colCoords.x;
  const yDiff = sprite.y - colCoords.y;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    xDiff > 0
      ? sprite.setTexture("self", "left-walk.000")
      : sprite.setTexture("self", "right-walk.000");
  } else {
    yDiff > 0
      ? sprite.setTexture("self", "back-walk.000")
      : sprite.setTexture("self", "front-walk.000");
  }
};

function create() {
  const map = this.make.tilemap({
    key: "beach",
    tileWidth: 32,
    tileHeight: 32,
  });
  const tileset = map.addTilesetImage("beach", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  let closeDoor;
  const ground = map.createLayer("ground", tileset, 0, 0);
  const water = map.createLayer("water", tileset, 0, 0);
  // const objLayer = map.createLayer("objLayer", tileset, 0, 0);
  // const door = map.createLayer("door", tileset, 0, 0);
  // const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
  //background.setDepth(-10)
  water.setCollisionByProperty({ collides: true });
  // door.setCollisionByProperty({ collides: true });

  // const objectLayer = map.getObjectLayer('objLayer');

  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  // water.setDepth(10);

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  // const spawnPoint = map.findObject(
  //   "Objects",
  //   (obj) => obj.name === "Spawn Point"
  // );

  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  player = this.physics.add
    .sprite(500, 500, "self", "front-walk.000")
    .setSize(20, 30)
    .setOffset(0, 24);

  watchman = this.physics.add
    .sprite(500, 550, "self", "front-walk.000")
    .setSize(20, 30)
    .setOffset(0, 24);
  watchman.body.immovable = true;
  // const removeColliderLayer = (coll, layer) => {
  //   this.physics.world.removeCollider(closeDoor);
  //   layer.setDepth(-10);
  // }
  // Wat  ch the player and worldLayer for collisions, for the duration of the scene:
  this.physics.add.collider(player, water);
  // closeDoor = this.physics.add.collider(player, door, () => {
  //   // removeColliderLayer(null, door);
  // });
  this.physics.add.collider(player, watchman, (collision) => {
    decideFace(watchman, { x: collision.x, y: collision.y });
  });

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  const anims = this.anims;
  anims.create({
    key: "left-walk",
    frames: anims.generateFrameNames("self", {
      prefix: "left-walk.",
      start: 0,
      end: 2,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "right-walk",
    frames: anims.generateFrameNames("self", {
      prefix: "right-walk.",
      start: 0,
      end: 2,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "front-walk",
    frames: anims.generateFrameNames("self", {
      prefix: "front-walk.",
      start: 0,
      end: 2,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "back-walk",
    frames: anims.generateFrameNames("self", {
      prefix: "back-walk.",
      start: 0,
      end: 2,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();

  // Debug graphics
  this.input.keyboard.once("keydown_D", (event) => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
    ground.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
  });
}
function update(time, delta) {
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("self", "left-walk.000");
    else if (prevVelocity.x > 0) player.setTexture("self", "right-walk.000");
    else if (prevVelocity.y < 0) player.setTexture("self", "back-walk.000");
    else if (prevVelocity.y > 0) player.setTexture("self", "front-walk.000");
  }
}
*/
