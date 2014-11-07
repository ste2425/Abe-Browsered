var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});

function preload() {
	game.load.atlasJSONHash('abeCharacter', 'assets/walking.png', 'assets/walking.json');
	game.load.json('animationDataAbe', 'assets/animationDataAbe.json');
}

function create() {
	game.player = new character('abe', 'animationDataAbe', game, 50, 35, 'abeCharacter').abe;
}

function update() {
	var cursors = game.input.keyboard.createCursorKeys();
	var wsad = {
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
	};
	var jump = game.input.keyboard.addKey(Phaser.Keyboard.P);
	var doh = game.input.keyboard.addKey(Phaser.Keyboard.D);

	//game.player.update();

	/*if (doh.isDown) {
		game.player.doh();
	} else if (jump.isDown) {
		if (!jumping) {
			console.log('jump')
			jumping = true;
			//game.player.animations.play('walkingJumpR');
		}
	} else */

	if (cursors.left.isDown) {
		game.player.walk('L')
	} else if (cursors.right.isDown) {
		game.player.walk('R');
	} else {
		game.player.idle();
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

	init();

	me.walk = function(direction) {
		direction = direction.toUpperCase();

		if (me.state.turning) return;

		if (direction != me.state.facing && !me.state.turning) {
			me.state.idle = false;
			me.state.turning = true;
			me.state.facing = direction;

			//play turn anim
			me.currentAnmin = me.player.animations.play('walkTurn' + direction);
		} else if (me.state.idle || !me.state.turning) {
			me.state.idle = false;
			me.state.walking = true;
			me.state.facing = direction;
			//play walk anmin
			me.currentAnmin = me.player.animations.play('walking' + direction);
		}
	}
	me.idle = function() {
		if (!me.state.idle && !me.state.turning) {
			me.state.idle = true;
			me.currentAnmin = me.player.animations.play('idle' + me.state.facing);
		}
	}
	me.doh = function() {
		if (!me.state.doh)
			me.currentAnmin = me.player.animations.play('doh');
	}
	me.stop = function() {
		if (!me.state.stopping)
			me.state.stopping = true;
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
	}

	me.player.events.onAnimationComplete.add(function() {
		if (me.state.turning) {
			me.state.turning = false;

			if (!me.state.walking) me.currentAnmin = me.player.animations.play('idle' + me.state.facing);
		} else if (me.state.doh) {
			me.state.doh = false;
		}
	}, me.player);

	function init() {
		//Initialise function
		me.name = Name;
		me.anminData = Game.cache.getJSON(AnminData);

		//Create phaser player object
		me.player = Game.add.sprite(posX, posY, characterKey);
		me.player.anchor.setTo(0.5, 0.5);
		//Add adnimations from animation data json
		for (var i in me.anminData) {
			me.player.animations.add(i, me.anminData[i].Data, me.anminData[i].FrameRate, me.anminData[i].Loop);
		}

		me.state = {
			idle: true,
			facing: 'R',
			walking: false,
			turning: false,
			doh: false,
			stopping: false
		}

		me.currentAnmin = me.player.animations.play('idle' + me.state.facing);
	}

	this[me.name] = me;
}