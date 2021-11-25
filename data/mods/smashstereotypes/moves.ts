export const Moves: {[moveid: string]: ModdedMoveData} = {
	allterrainblast: {
		accuracy: 100,
		basePower: 50,
		category: "Special",
		shortDesc: "Power doubles and type varies in each terrain.",
		id: "allterrainblast",
		name: "All-Terrain Blast",
		pp: 10,
		priority: 0,
		flags: {
			bullet: 1,
			protect: 1,
			mirror: 1
		},
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
				move.type = 'Fairy';
				break;
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			if (this.field.terrain && pokemon.isGrounded()) {
				move.basePower *= 2;
			}
		},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Weather Ball", target);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMovePower: 160,
		contestType: "Beautiful",
	},
	leafage: {
		inherit: true,
		onModifyPriority(priority, source, target, move) {
			if (source.species.id === 'shaymin') {
				return priority + 1;
			}
		},
	},
	shedleaves: {
 		  accuracy: true,
		  basePower: 0,
		  category: "Status",
		  shortDesc: "Removes the user's Grass-type, resets negative stat changes, and cures the user of status.",		
		  name: "Shed Leaves",
		  pp: 10,
		  priority: 0,
		  flags: {snatch: 1},
		  onTryMove(pokemon, target, move) {
			  if (pokemon.hasType('Grass')) return;
			  this.add('-fail', pokemon, 'move: Shed Leaves');
			  this.attrLastMove('[still]');
			  return null;
		  },		
		  onHit(pokemon) {
				if (['', 'slp', 'frz'].includes(pokemon.status)) return;
				pokemon.cureStatus();
		  },
		  self: {
			  onHit(pokemon) {
				const boosts: SparseBoostsTable = {};
				let i: BoostName;
				for (i in pokemon.boosts) {
					if (pokemon.boosts[i] < 0) {
						boosts[i] = 0;
					}
				}
				pokemon.setBoost(boosts);
				this.add('-clearnegativeboost', pokemon, '[silent]');
				this.add('-message', pokemon.name + "'s negative stat changes were removed!");
				
				  pokemon.setType(pokemon.getTypes(true).map(type => type === "Grass" ? "???" : type));
				  this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[from] move: Shed Leaves');
			  },
		  },
		  secondary: null,
		  target: "self",
		  type: "Grass",
		  zMove: {effect: 'heal'},
		  contestType: "Clever",
	},
	seedbomb: {
		inherit: true,
		secondary: {
			chance: 50,
			onHit(target, source, move) {
				if (source.species.id !== 'shaymin') return;
				target.addVolatile('leechseed');
			},
		},
	},
	focusblast: {
		inherit: true,
		onSourceModifyAccuracy(accuracy) {
			if (source.species.id !== 'heatmor') return;
			return accuracy + 15;
		},
	},
	adaptableattack: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		shortDesc: "Deals typeless damage. Special if SpA > Atk.",
		isViable: true,
		name: "Adaptable Attack",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onPrepareHit: function(target, source, move) {
		  this.attrLastMove('[still]');
		  this.add('-anim', source, "Multi-Attack", target);
		},
		onModifyMove(move, pokemon, target) {
			move.type = '???';
			if (pokemon.getStat('spa', false, true) > pokemon.getStat('atk', false, true)) move.category = 'Special';
		},
		onBasePower(basePower, pokemon, target) {
			if (pokemon.species.name === 'Type: Null') {
				return this.chainModify(1.5);
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	chipaway: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'mytheon') {
				move.type = 'Dragon';
				move.basePower = 85;
			}
		},
		onUseMoveMessage(pokemon, target, move) {
			if (pokemon.species.id === 'mytheon') {
				this.add('-message', `${pokemon.name}'s ${move.name} is ${move.type}-type!`);
			}
		},
	},
	doublekick: {
		inherit: true,
		onSourceModifyAccuracy(accuracy) {
			if (source.species.id !== 'mytheon') return;
			return accuracy - 10;
		},
		onModifyMove(move, source, target) {
			if (source.species.id === 'mytheon') {
				move.basePower = 50;
			}
		},
	},
	naturalgift: {
		inherit: true,
		onPrepareHit(target, pokemon, move) {
			if (pokemon.species.id !== 'mytheon') {
				if (pokemon.ignoringItem()) return false;
				const item = pokemon.getItem();
				if (!item.naturalGift) return false;
				move.basePower = item.naturalGift.basePower;
				pokemon.setItem('');
				pokemon.lastItem = item.id;
				pokemon.usedItemThisTurn = true;
				this.runEvent('AfterUseItem', pokemon, null, null, item);
			}
			else if (pokemon.species.id === 'mytheon') {
				if (pokemon.ignoringItem()) return false;
				const item = pokemon.getItem();
				if (!item.naturalGift) return false;
				move.basePower = item.naturalGift.basePower;
			}
		},
	},
	poisonfang: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'mytheon') {
				move.basePower = 65;
			}
		},
		onSourceModifyAccuracy(accuracy) {
			if (source.species.id !== 'mytheon') return;
			return accuracy - 5;
		},
		secondary: {
			chance: 50,
			status: 'tox',
		}, 
		self: {
			chance: 10,
			onHit(source, pokemon) {
				if (source.species.id !== 'mytheon') return;
				pokemon.addVolatile('flinch');
			}
		},				
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	skittersmack: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'mytheon') {
				move.basePower = 90;
			}
		},
		onSourceModifyAccuracy(accuracy) {
			if (source.species.id !== 'mytheon') return;
			return accuracy = 100;
		},
		secondaries: [
			{
				chance: 30,
				onHit(source, pokemon) {
					if (pokemon.species.id === 'mytheon') {
						this.boost({spa: -1}, source);
					}
				}
			}, {
				chance: 100,
				onHit(source, pokemon) {
					if (pokemon.species.id !== 'mytheon') {
						this.boost({spa: -1}, source);
					}
				}
			},
		],
	},
	synchronoise: {
		inherit: true,
		onTryImmunity(target, source) {
			if (source.species.id !== 'mytheon') {
				return target.hasType(source.getTypes());
			}
		},
		onModifyMove(move, source, target) {
			if (source.species.id === 'mytheon') {
				move.basePower = 70;
				move.ignoreImmunity = false;
				move.flags.sound = 1;
			}
		},
		onBasePower(basePower, pokemon, target) {
			if (target.hasType(pokemon.getTypes()) && pokemon.species.id === 'mytheon') {
				return this.chainModify(2);
			}
		},
	},
	uturn: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'mytheon') {
				move.basePower = 60;
			}
		},
	},
	doubleironbash: {
		num: 742,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		shortDesc: "Hits twice.",
		name: "Double Iron Bash",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		multihit: 2,
		target: "normal",
		type: "Steel",
		zMove: {basePower: 180},
		maxMove: {basePower: 140},
		contestType: "Clever",
	},
	eyeofchaos: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "Uses user's SpD stat as SpA in damage calculation.",
		isViable: true,
		name: "Eye of Chaos",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Glare", target);
		},
		useSourceDefensiveAsOffensive: true,
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	multiattack: {
		num: 718,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Multi-Attack",
		shortDesc: "Type varies based on the user's type.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onModifyType(move, pokemon) {
			let type = pokemon.types[0];
			if (type === "Bird") type = "???";
			move.type = type;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	slitherstrike: {
		num: -1,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		shortDesc: "User switches out after damaging the target. If used by Sandaconda, it transforms into Sandaconda-Uncoiled for the rest of the match.",
		name: "Slither Strike",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit(target, pokemon, move) {
			if (pokemon.baseSpecies.baseSpecies === 'Sandaconda' && !pokemon.transformed && pokemon.species.id !== 'sandacondauncoiled') {
				move.willChangeForme = true;
			}
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.willChangeForme) {
				let forme = '';
				if (pokemon.species.id === 'sandaconda') {
					forme = '-Uncoiled';
				}
				pokemon.formeChange('Sandaconda' + forme, move, true, '[silent]');
				this.add('-message', `${pokemon.name} uncoiled!`);
				const species = this.dex.getSpecies(pokemon.species.name);
				const abilities = species.abilities;
				const baseStats = species.baseStats;
				const type = species.types[0];
			}
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Cute",
	},
	coralcrash: {
		num: 1006,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: " Has 1/4 recoil. 10% chance to lower the target's Special Attack by 1.",
		name: "Coral Crash",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 4],
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Head Smash", target);
		},
		secondary: {
			chance: 10,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Tough",
	},
	puyopop: {
		num: 40046,
		accuracy: 90,
		basePower: 10,
		basePowerCallback(pokemon, target, move) {
			return 10 * move.hit;
		},
		category: "Special",
		shortDesc: "Hits 4 times. Each hit can miss, but power rises. Fourth hit clears user side's hazards.",
		id: "puyopop",
		name: "Puyo Pop",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit(target, source, move) {
		if (move.hit !== 4) return;
			let removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: Puyo Pop', '[of] ' + source);
				}
			}
		},
		multihit: 4,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Water",
		zMovePower: 180,
		contestType: "Cute",
	},
	permutation: {
		num: 40053,
		accuracy: true,
		basePower: 200,
		category: "Special",
		shortDesc: "No additional effect.",
		id: "permutation",
		name: "Permutation",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "puyoniumz",
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	crunch: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'arcanine') {
				move.basePower = 85;
			}
		},
	},
	thunderfang: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'arcanine') {
				move.basePower = 85;
			}
		},
	},
	firefang: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'arcanine') {
				move.basePower = 85;
			}
		},
	},
	wildcharge: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'arcanine') {
				move.basePower = 100;
			}
		},
	},
	doublekick: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.species.id === 'arcanine') {
				move.basePower = 50;
			}
		},
	},
	dragonragesylve: {
		num: 82,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Special",
		shortDesc: "Deals fixed damage equal to the user's level",
		id: "dragonragesylve",
		isViable: true,
		name: "Dragon Rage (Sylve)",
		pp: 20,
		priority: 0,
		flags: {
			protect: 1,
			mirror: 1
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
		zMovePower: 100,
		contestType: "Cool",
	},
	flamewheelsylve: {
		num: 228,
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the flame wheel succeeds
			if (target.beingCalledBack) {
				this.debug('Flame Wheel damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "Power doubles if a foe is switching out.",
		id: "flamewheelsylve",
		isViable: true,
		name: "Flame Wheel (Sylve)",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side === pokemon.side) continue;
				side.addSideCondition('flamewheelsylve', pokemon);
				const data = side.getSideConditionData('flamewheelsylve');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack) move.accuracy = true;
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('flamewheelsylve');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Flame Wheel start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectData.sources) {
					if (!this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Flame Wheel');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Flame Wheel user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.runMove('flamewheelsylve', source, this.getTargetLoc(pokemon, source));
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		zMovePower: 100,
		contestType: "Clever",
	},
	incineratesylve: {
		accuracy: 100,
		basePower: 65,
		category: "Special",
		shortDesc: "1.5x damage if foe holds an item. Removes item.",
		id: "incineratesylve",
		isViable: true,
		name: "Incinerate (Sylve)",
		pp: 20,
		priority: 0,
		flags: {
			protect: 1,
			mirror: 1
		},
		onBasePowerPriority: 4,
		onBasePower: function(basePower, source, target, move) {
			let item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemData, target, source, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onHit: function(target, source) {
			let item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Incinerate', '[of] ' + source);
				if (this.singleEvent('Eat', item, null, source, null, null)) {
					this.runEvent('EatItem', source, null, null, item);
				}
				if (item.onEat) source.ateBerry = true;
			}
		},
		onAfterHit: function(target, source) {
			if (source.hp) {
				let item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Incinerate', '[of] ' + source);
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		zMovePower: 120,
	},
	morningsun: {
		num: 234,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Morning Sun",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onModifyMove(move, source, target) {
			if (source.species.id === 'arcanine') {
				move.pp = 10;
			}
		},
		onHit: function(pokemon) {
			if (this.field.isWeather(['desolateland', 'sunnyday'])) {
				return this.heal(this.modify(pokemon.maxhp, 0.667));
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail']) && pokemon.species.id !== 'arcanine') {
				return this.heal(this.modify(pokemon.maxhp, 0.25));
			} else {
				return this.heal(this.modify(pokemon.maxhp, 0.5));
			}
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Beautiful",
	},
	mudslapsylve: {
		num: 98,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		shortDesc: "Usually goes first.",
		id: "mudslapsylve",
		isViable: true,
		name: "Mud Slap (Sylve)",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Ground",
		zMovePower: 100,
		contestType: "Cool",
	},
	teleport: {
		num: 100,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Teleport",
		pp: 20,
		priority: -6,
		flags: {},
		onModifyMove(move, source, target) {
			if (source.species.id === 'arcanine') {
				move.basePower = 70;
				move.target = 'normal';
			}
		},
		onModifyPriority(priority, source, target, move) {
			if (source.species.id === 'arcanine') {
				return priority + 0;
			}
		},
		selfSwitch: true,
		onTryHit: true,
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: {effect: 'heal'},
		contestType: "Cool",
	},
	stormstrike: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		shortDesc: "Power doubles and type varies in each weather.",
		id: "stormstrike",
		name: "Storm Strike",
		pp: 10,
		priority: 0,
		flags: {
			bullet: 1,
			protect: 1,
			mirror: 1
		},
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
				move.type = 'Ice';
				break;
			case 'aircurrent':
				move.type = 'Flying';
				break;
			case 'shadowsky':
				move.type = 'Ghost';
				break;					
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
				move.basePower *= 2;
				break;
			case 'aircurrent':
				move.basePower *= 2;
				break;
			case 'shadowsky':
				move.basePower *= 2;
				break;					
			}
		},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Weather Ball", target);
			this.add('-anim', source, "Knock Off", target);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMovePower: 160,
		contestType: "Beautiful",
	},
	/*peekaboo: {
		num: 712,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			return this.random(130);
		},
		category: "Special",
		name: "Peek-a-Boo",
		shortDesc: "Deals a random amount of damage and forces user out.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		/*onTryHit(pokemon, target, move, source) {
            if (!this.canSwitch(pokemon.side)) {
                return false;
            }
			source.forceSwitch();
			return;
		},
		self: {
			forceSwitch: true,
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},*/
	planetarycrash: {
		num: 1002,
		accuracy: 80,
		basePower: 120,
		category: "Special",
		name: "Planetary Crash",
		shortDesc: "User takes 50% of max HP if it misses. Phys if Atk > Sp. Atk",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		hasCrashDamage: true,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.getEffect('Planetary Crash'));
		},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cosmic Power", target);
			this.add('-anim', source, "Head Smash", target);
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Cool",
	},
	terraforming: {
		num: 1015,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		name: "Terraforming",
		shortDesc: "Fails if there is no weather active. Ends the weather.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit() {
			if (this.field.isWeather('')) return false;
		},
		onHit() {
			this.field.clearWeather();
		},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rototiller", target);
		},
		secondary: null,
		target: "normal",
		type: "Ground",
	},
	aerostrike: {
		num: 369,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "User switches out after damaging the target.",
		name: "Aerostrike",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aeroblast", target);
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Flying",
		contestType: "Cute",
	},
	sweetmelody: {
		num: 10001,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "The target is freed from Infestation.",
		name: "Sweet Melody",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sparkling Aria", target);
		},
		secondary: {
			dustproof: true,
			chance: 100,
			onHit(target) {
				if (target.volatiles['infestation']) target.removeVolatile('infestation');
			},
		},
		target: "allAdjacent",
		type: "Water",
		contestType: "Tough",
	},
	flashhandoff: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		shortDesc: "User switches out. The replacement's next move has perfect accuracy.",
		isViable: true,
		name: "Flash Handoff",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		slotCondition: 'flashhandoff',
		condition: {
			duration: 1,
			onResidualOrder: 7,
			onEnd(source) {
				for (const pokemon of source.side.active) {
					if (!pokemon.fainted) {
						source.addVolatile('lockon');
					}
				}
			},
		},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "U-turn", target);
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: {effect: 'healreplacement'},
		contestType: "Tough",
	},
	terracharge: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "Deals 33% of the damage dealt in recoil. 10% chance to lower the target's Speed.",
		isViable: true,
		name: "Terra Charge",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Head Smash", target);
		},
		recoil: [33, 100],
		secondary: {
			chance: 10,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Cool",
	},
};
