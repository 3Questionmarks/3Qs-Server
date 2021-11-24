export const Moves: {[k: string]: ModdedMoveData} = {
	coalsting: {
		num: 827,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Coal Sting",
		shortDesc: "30% chance to burn the target. Thaws target.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
    inkgulp: {
		num: 828,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Ink Gulp",
		shortDesc: "User recovers 50% of the damage dealt. Raises user's Special Attack by 1 if this KOes the target.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({spa: 1}, pokemon, pokemon, move);
		},
      drain: [3, 4],
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	bouldertoss: {
		num: 829,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Boulder Toss",
		shortDesc: "No additional effect.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	icescream: {
		num: 830,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		name: "Ice Scream",
        shortDesc: "Lowers the user's Sp. Atk by 2.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	baitsplash: {
		num: 831,
		accuracy: 75,
		basePower: 100,
		category: "Special",
		name: "Bait Splash",
        shortDesc: "Traps and damages the target for 4-5 turns.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	hamsterslam: {
        accuracy: 100,
        basePower: 45,
        category: "Physical",
        name: "Hamster Slam",
        pp: 10,
        priority: 0,
        flags: {contact: 1, protect: 1, mirror: 1},
        onModifyType(move, source) {
            move.type = source.getTypes()[0];
        },
        onHit(target, source, move) {
            if (source.getTypes().length === 1) {
                move.type = source.getTypes()[0];
            } else {
                move.type = source.getTypes()[1];
            }
        },
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough",
   },
	shellstack: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Shell Stack",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		useSourceDefensiveAsOffensive: true,
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	biobelly: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Bio Belly",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1, heal: 1},
		self: {
			onHit(source) {
				for (const ally of source.side.pokemon) {
					ally.cureStatus();
				}
			},
		},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	hardwork: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Hard Work",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			spd: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Cool",
	},
	excaliburslash: {
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Excalibur Slash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Cool",
	},
	bubbleblades: {
		accuracy: 90,
		basePower: 18,
		category: "Physical",
		name: "Bubble Blades",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	float: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Float",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, gravity: 1},
		volatileStatus: 'float',
		condition: {
			duration: 5,
			onStart(target) {
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Float');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'Float');
			},
		},
		secondary: null,
		target: "self",
		type: "Flying",
		contestType: "Clever",
	},
	gravity: {
		num: 356,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Gravity",
		pp: 5,
		priority: 0,
		flags: {nonsky: 1},
		pseudoWeather: 'gravity',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', effect);
					return 7;
				}
				return 5;
			},
			onStart() {
				this.add('-fieldstart', 'move: Gravity');
				for (const pokemon of this.getAllActive()) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['magnetrise']) {
						applies = true;
						delete pokemon.volatiles['magnetrise'];
					}
					if (pokemon.volatiles['telekinesis']) {
						applies = true;
						delete pokemon.volatiles['telekinesis'];
					}
					if (pokemon.volatiles['float']) {
						applies = true;
						delete pokemon.volatiles['float'];
					}
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return accuracy * 5 / 3;
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.getMove(moveSlot.id).flags['gravity']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity']) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd() {
				this.add('-fieldend', 'move: Gravity');
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: {boost: {spa: 1}},
		contestType: "Clever",
	},
	smackdown: {
		num: 479,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Smack Down",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		volatileStatus: 'smackdown',
		condition: {
			noCopy: true,
			onStart(pokemon) {
				let applies = false;
				if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate')) applies = true;
				if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] ||
					this.field.getPseudoWeather('gravity')) applies = false;
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					applies = true;
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
				}
				if (pokemon.volatiles['magnetrise']) {
					applies = true;
					delete pokemon.volatiles['magnetrise'];
				}
				if (pokemon.volatiles['telekinesis']) {
					applies = true;
					delete pokemon.volatiles['telekinesis'];
				}
				if (pokemon.volatiles['float']) {
					applies = true;
					delete pokemon.volatiles['float'];
				}
				if (!applies) return false;
				this.add('-start', pokemon, 'Smack Down');
			},
			onRestart(pokemon) {
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					this.queue.cancelMove(pokemon);
					this.add('-start', pokemon, 'Smack Down');
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	balloonburner: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Balloon Burner",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		self: {
				volatileStatus: 'float',
			},
		thawsTarget: true,
		secondary: {
		chance: 10,
		status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	extendneck: {
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack) {
				this.debug('Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Special",
		isNonstandard: "Past",
		name: "Extend Neck",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side === pokemon.side) continue;
				side.addSideCondition('pursuit', pokemon);
				const data = side.getSideConditionData('pursuit');
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
			target.side.removeSideCondition('pursuit');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectData.sources) {
					if (!this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
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
					this.runMove('pursuit', source, this.getTargetLoc(pokemon, source));
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Clever",
	},
	pungiblow: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Pungi Blow",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		useSourceDefensiveAsOffensive: true,
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	beamup: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Beam Up",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		ignoreImmunity: {'Psychic': true},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	darkfractals: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Dark Fractals",
		pp: 10,
		priority: 0,
		flags: {},
		ignoreImmunity: true,
		isFutureMove: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'darkfractals',
				source: source,
				moveData: {
					id: 'darkfractals',
					name: "Dark Fractals",
					accuracy: 100,
					basePower: 100,
					category: "Physical",
					priority: 0,
					flags: {},
					ignoreImmunity: false,
					effectType: 'Move',
					isFutureMove: true,
					type: 'Dark',
				},
			});
			this.add('-start', source, 'move: Dark Fractals');
			return null;
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	sulfuricacid: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Sulfuric Acid",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onBasePower(basePower, pokemon, target) {
			if (target.status === 'psn' || target.status === 'tox') {
				return this.chainModify(1.5);
			}
		},
		secondary: {
			dustproof: true,
			chance: 100,
			onHit(target) {
				if (target.status === 'brn') target.cureStatus();
				if (target.status === 'par') target.cureStatus();
				if (target.status === 'frz') target.cureStatus();
			},
		},
		target: "allAdjacent",
		type: "Fire",
		contestType: "Tough",
	},
};

