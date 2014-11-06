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
	var anminData = game.cache.getJSON('animationDataAbe');
	var player = game.add.sprite(50, 35, 'abeCharacter');

	player.anchor.setTo(0.5, 0.5); //so it flips around its middle

	player.animations.add('walkingR', anminData.walkingR, 20, true);
	player.animations.add('walkingL', anminData.walkingL, 20, true);
	player.animations.add('idleR', anminData.idleR, 10, true);
	player.animations.add('idleL', anminData.idleL, 10, true);
	player.animations.add('doh', anminData.doh, 20, false);
	player.animations.add('walkingJumpR', anminData.walkingJumpR, 20, true);
	player.animations.add('walkTurnR', anminData.walkTurnR, 13, false);
	player.animations.add('walkTurnL', anminData.walkTurnL, 13, false)

	game.player = new character('abe', anminData, player).abe;

}
var jumping = false;
var dohing = false;

function update() {
	var cursors = game.input.keyboard.createCursorKeys();
	var jump = game.input.keyboard.addKey(Phaser.Keyboard.P);
	var doh = game.input.keyboard.addKey(Phaser.Keyboard.D);

	//game.player.update();

	if (doh.isDown) {
		game.player.doh();
	} else if (jump.isDown) {
		if (!jumping) {
			console.log('jump')
			jumping = true;
			//game.player.animations.play('walkingJumpR');
		}
	} else if (cursors.left.isDown) {
		game.player.walk('L')
	} else if (cursors.right.isDown) {
		game.player.walk('R');
	} else {
		game.player.animations.play('idle');
	}

	//  Allow the player to jump if they are touching the ground.
	/*if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }*/
}

function character(name, anminData, player) {
	if (!(this instanceof character)) {
		return new character(name, anminData);
	}

	var me = {};

	me.name = name;
	me.anminData = anminData;
	me.player = player;
	me.state = {
		idle: true,
		facing: 'R',
		walking: false,
		turning: false,
		doh: false,
		stopping: false
	}
	me.currentAnmin;

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

	this[name] = me;
}