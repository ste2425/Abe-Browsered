var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});

function preload() {
	game.load.image('ground', 'assets/platform.png');
	game.load.atlasJSONHash('abeCharacter', 'assets/walking.png', 'assets/walking.json');
	game.load.json('animationDataAbe', 'assets/animationDataAbe.json');
}

function create() {
	game.stage.backgroundColor = 0xbada55;
	game.physics.startSystem(Phaser.Physics.ARCADE);

	ground = game.add.group();
	platforms = game.add.group();


	platforms.enableBody = true;
	ground.enableBody = true;

	var floor = ground.create(0, game.world.height - 64, 'ground');
	var wall = platforms.create(500, game.world.height - 84, 'ground');
	var wall2 = platforms.create(20, game.world.height - 84, 'ground');

	wall.scale.setTo(0.5, 0.5);
	wall.body.immovable = true;

	wall2.scale.setTo(0.5, 0.5);
	wall2.body.immovable = true;

	floor.scale.setTo(2, 2);
	floor.body.immovable = true;

	game.player = new character('abe', 'animationDataAbe', game, 50, game.world.height - 100, 'abeCharacter').abe;
	game.physics.arcade.enable(game.player.player);

	game.player.player.body.bounce.y = 0.1;
	game.player.player.body.gravity.y = 900;
	game.player.player.body.collideWorldBounds = true;
}

function update() {
	if (!game.player) return;


	game.physics.arcade.collide(game.player.player, platforms, function(e, i) {
		if (game.player.state.walking) {
			game.player.collide(i.body.touching, {
				invert: true
			});
		}
	});

	game.physics.arcade.collide(game.player.player, ground);



	var cursors = game.input.keyboard.createCursorKeys();
	var wsad = {
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
	};
	var jump = game.input.keyboard.addKey(Phaser.Keyboard.P);
	var doh = game.input.keyboard.addKey(Phaser.Keyboard.D);

	game.player.update();

	if (doh.isDown) {
		game.player.doh();
	} else if (jump.isDown) {
		game.player.jumpForward();
	} else

	if (cursors.left.isDown) {
		game.player.walk('L')
	} else if (cursors.right.isDown) {
		game.player.walk('R');
	} else if(cursors.up.isDown){
		game.player.jumpUp();
	} else {
		game.player.stop();
		//game.player.idle();
	}

	//  Allow the player to jump if they are touching the ground.
	/*if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }*/
}

function character(Name, AnminData, Game, posX, posY, characterKey) {
	if (!(this instanceof character)) {
		return new character(name, anminData);
	}

	var me = {};

	me.walk = function(direction) {
		direction = direction.toUpperCase();
		if (me.state.turning || me.state.walkingCollide) return; //me.player.body.touching.right) return;

		if (direction != me.state.facing && !me.state.turning) {
			me.player.scale.setTo(1, 1);
			var turning = (me.state.facing == 'R' ? 'L' : 'R')
			console.log('Facing', me.state.facing)
			me.state.idle = false;
			me.state.turning = true;
			me.state.walking = false;
			me.state.facing = direction;


			//play turn anim
			if (me.player.body)
				me.player.body.velocity.x = 0;
			console.log('turning', turning)
			me.currentAnmin = me.player.animations.play('walkTurn' + turning);
		} else if (me.state.idle || !me.state.turning) {

			me.state.idle = false;
			me.state.walking = true;
			me.state.facing = direction;
			//play walk anmin

			me.player.body.velocity.x = (me.state.facing == 'R' ? 120 : -120);
			me.currentAnmin = me.player.animations.play('walking');
		}
	}
	me.idle = function() {
		if (!me.state.idle && !me.state.turning) {
			me.state.idle = true;
			if (me.player.body)
				me.player.body.velocity.x = 0;
			me.currentAnmin = me.player.animations.play('idle');
		}
	}
	me.doh = function() {
		if (!me.state.doh) {
			me.state.idle = false;
			me.state.doh = true;
			me.currentAnmin = me.player.animations.play('doh');
		}
	}
	me.stop = function() {
		if (!me.state.stopping && !me.state.idle) {
			me.state.idle = false;
			me.state.stopping = true;
		}
	}
	me.jumpForward = function() {
		if (!me.state.jumpingForward) {
			me.state.idle = false;
			me.state.jumpingForward = true;
			me.currentAnmin = me.player.animations.play('standingJump');
		}
	}
	me.jumpUp = function(){
		me.player.body.velocity.y = -200;
	}
	me.normalizeState = function() {
		for (var i in me.state) {
			me.state.idle = false;
			me.state[i] = false;
		}
	}
	me.collide = function(location, opts) {
		if (me.state.walkingCollide) return;

		if (opts.invert) {
			location = {
				up: location.down,
				down: location.up,
				left: location.right,
				right: location.left
			};
		}

		if (location.up || location.down) return;

		me.state.idle = false;
		me.state.walkingCollide = true;
		me.currentAnmin = me.player.animations.play('StandingCollide');

	}
	me.update = function() {
		/*if (me.currentAnmin) {
			if (me.state.stopping && me.currentAnmin.currentFrame.name == 'wr4.png') {
				me.state.stopping = false;
				me.state.walking = false;
			}
			if (!me.currentAnmin.isPlaying) {
				if (me.state.turning) {
					me.state.turning = false;

					if (!me.state.walking) me.currentAnmin = me.player.animations.play('idle' + me.state.facing);
				} else if (me.state.doh) {
					me.state.doh = false;
				}
			}
		}*/
		if (!me.currentAnmin || !me.currentAnmin.currentFrame) return;

		if (me.state.stopping && me.currentAnmin.currentFrame.name.indexOf('S') != -1) {
			me.state.stopping = false;
			me.state.walking = false;
			me.idle();
		}else if(me.state.jumpingForward && me.currentAnmin.currentFrame.name.indexOf('j9') != -1){
			me.player.body.velocity.y = -100;
			me.player.body.velocity.x = (me.state.facing == 'R' ? 400 : -400);
		}else if(me.state.jumpingForward && me.currentAnmin.currentFrame.name.indexOf('16') != -1){
			me.player.body.velocity.x = 0;
		}
	}


	init();

	me.player.events.onAnimationComplete.add(function() {
		if (me.state.turning) {
			me.state.turning = false;
			me.player.scale.setTo((me.state.facing == 'R' ? 1 : -1), 1);
			if (!me.state.walking) me.idle();
		} else if (me.state.doh) {
			me.state.doh = false;
			me.idle();
		} else if (me.state.walkingCollide) {

			me.state.walkingCollide = false;
			me.idle();
		}

		if (me.state.jumpingForward) {
			me.state.jumpingForward = false;
			console.log(me.state)
			me.idle();
		}

	}, me.player);

	function init() {
		//Initialise function
		me.name = Name;
		me.anminData = Game.cache.getJSON(AnminData);

		//Create phaser player object
		me.player = Game.add.sprite(posX, posY, characterKey);
		me.player.anchor.setTo(0.5, 1);
		//Add adnimations from animation data json
		for (var i in me.anminData) {
			me.player.animations.add(i, me.anminData[i].Data, me.anminData[i].FrameRate, me.anminData[i].Loop);
		}

		me.state = {
			idle: false,
			facing: 'R',
			walking: false,
			turning: false,
			doh: false,
			stopping: false,
			walkingCollide: false,
			jumpingForward: false
		}

		me.idle();
	}

	this[me.name] = me;
}