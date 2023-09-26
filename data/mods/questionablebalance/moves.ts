/*

List of flags and their descriptions:

bypasssub: Ignores a target's substitute.
bite: Power is multiplied by 1.5 when used by a Pokemon with the Strong Jaw Ability.
bullet: Has no effect on Pokemon with the Bulletproof Ability. Power is multiplied by 1.5 when used by a Pokemon with the Mega Launcher Ability.
charge: The user is unable to make a move between turns.
contact: Makes contact.
dance: When used by a Pokemon, other Pokemon with the Dancer Ability can attempt to execute the same move.
defrost: Thaws the user if executed successfully while the user is frozen.
distance: Can target a Pokemon positioned anywhere in a Triple Battle.
gravity: Prevented from being executed or selected during Gravity's effect.
heal: Prevented from being executed or selected during Heal Block's effect.
mirror: Can be copied by Mirror Move.
allyanim: Animates when used against allies
nonsky: Prevented from being executed or selected in a Sky Battle.
powder: Has no effect on Grass-type Pokemon, Pokemon with the Overcoat Ability, and Pokemon holding Safety Goggles.
protect: Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield.
pulse: Power is multiplied by 1.5 when used by a Pokemon with the Mega Launcher Ability.
punch: Power is multiplied by 1.3 when used by a Pokemon with the Iron Fist Ability.
kick: Power is multiplied by 1.3 when used by a Pokemon with the Steel Toe Ability.
recharge: If this move is successful, the user must recharge on the following turn and cannot make a move.
reflectable: Bounced back to the original user by Magic Coat or the Magic Bounce Ability.
slicing: Power is multiplied by 1.5 when used by a Pokemon with the Ability Sharpness.
snatch: Can be stolen from the original user and instead used by another Pokemon using Snatch.
sound: Has no effect on Pokemon with the Soundproof Ability. Power is 1.25x when used by a Pokemon with Amplifier
wind: Activates the Wind Power and Wind Rider Abilities.

*/

export const Moves: {[moveid: string]: MoveData} = {
	acidspray: {
        inherit: true,
		basePower: 60,
	},
	aerialace: {
		inherit: true,
		basePower: 85,
	},
	aeroblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1, distance: 1, bullet: 1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Blown Away by Aeroblast! ",
	},
	airslash: {
		inherit: true,
		accuracy: 100,
		basePower: 85,
	},
	anchorshot: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, bullet: 1},
	},
	armorcannon: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	armthrust: {
		inherit: true,
		basePower: 25,
	},
	attackorder: {
		inherit: true,
		basePower: 100,
		category: "Special",
	},
	aurasphere: {
		inherit: true,
		basePower: 90,
	},
	aurawheel: {
		num: 783,
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		name: "Aura Wheel",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
		},
        onTry(source) {
			if (source.species.baseSpecies === 'Morpeko') {
				return;
			}
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Aura Wheel');
			this.hint("Only a Pokemon whose form is Morpeko or Morpeko-Hangry can use this move.");
			return null;
		},
		onModifyMove(move, pokemon) {
			if (pokemon.species.name === 'Morpeko-Hangry') {
				move.secondaries.push({
					chance: 100,
					self: {
				        boosts: {
					       atk: 1,
				        },
                    },
				});
			} 
            if (pokemon.species.name === 'Morpeko') {
				move.secondaries.push({
					chance: 100,
					self: {
				        boosts: {
					       spe: 1,
				        },
                    },
				});
            }
		},
        onModifyType(move, pokemon) {
			if (pokemon.species.name === 'Morpeko-Hangry') {
				move.type = 'Dark';
			} else {
				move.type = 'Electric';
			}
		},
		target: "normal",
		type: "Electric",
        desc: "This move cannot be used successfully unless the user's current form, while considering Transform, is Full Belly or Hangry Mode Morpeko. If the user is a Morpeko in Full Belly Mode, this move is Electric type and has a 100% chance to raise the user's Speed by 1 stage. If the user is a Morpeko in Hangry Mode, this move is Dark type and has a 100% chance to raise the user's Attack by 1 stage.",
		shortDesc: "Morpeko: Electric, +1 Spe; Hangry: Dark, +1 Atk.",
	},
	aurorabeam: {
		inherit: true,
		basePower: 60,
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		desc: "Has a 100% chance to lower the target's Attack by 1 stage.",
		shortDesc: "100% chance to lower the target's Attack by 1.",
	},
	axekick: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	baddybad: {
		num: 737,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Baddy Bad",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		self: {
			sideCondition: 'reflect',
		},
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, This move summons Reflect for 5 turns upon use.",
		shortDesc: "phys if user's Atk > Sp. Atk. Summons Reflect.",
	},
	barrage: {
		inherit: true,
		basePower: 25,
		isNonstandard: null,
		name: "Barrage",
        type: "Fire",
	},
	batonpass: {
		inherit: true,
		onTryHit(target, source) {
			if (!this.canSwitch(target.side) || target.volatiles['commanded']) {
				this.attrLastMove('[still]');
				this.add('-fail', target);
				return this.NOT_FAIL;
			}
            if (source.hp <= Math.ceil(source.maxhp / 4)) {
				this.add('-fail', source, 'move: Baton Pass', '[weak]');
				return this.NOT_FAIL;
			}
		},
        onHit(target) {
			this.directDamage(Math.ceil(target.maxhp / 4));
		},
        desc: "The user takes 1/4 of its maximum HP, rounded up, and is replaced with another Pokemon in its party. The selected Pokemon has the user's stat stage changes, confusion, and certain move effects transferred to it.",
		shortDesc: "User takes 1/4 HP to pass stat changes and more.",
	},
	behemothbash: {
		inherit: true,
        overrideOffensiveStat: 'def',
        desc: "Damage is calculated using the user's Defense stat as its Attack, including stat stage changes. Other effects that modify the Attack stat are used as normal.",
		shortDesc: "Uses user's Def stat as Atk in damage calculation.",
	},
	bittermalice: {
		inherit: true,
		secondary: {
			chance: 50,
			status: 'frz',
		},
        desc: "Has a 50% chance to freeze the target.",
		shortDesc: "50% chance to freeze the target.",
	},
	blastburn: {
		num: 307,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Blast Burn",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, bullet: 1},
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'blastburn') pokemon.disableMove('blastburn');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'blastburn') pokemon.addVolatile('blastburn');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('blastburn')) {
				this.add('-hint', "Some effects can force a Pokemon to use Blast Burn again in a row.");
			}
		},
		condition: {},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Immolated by Blast Burn! ",
	},
	blazekick: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	blazingtorque: {
		inherit: true,
		basePower: 100,
		isNonstandard: null,
        flags: {protect: 1}
	},
	bleakwindstorm: {
		inherit: true,
		accuracy: 95,
        onModifyMove(move) {
            if (this.field.isWeather(['hail', 'snow'])) {
				move.secondaries.push({
					chance: 50,
					status: 'frz',
				});
                move.accuracy = true;
			}
		},
		secondary: {
			chance: 20,
			status: 'frz',
        },
		desc: "Has a 20% chance to freeze target's. If the weather is Snow, this move does not check accuracy and gains a +30% chance to freeze.",
		shortDesc: "20% frz. Hits adjacent foes. Snow: Doesn't miss, +30% frz.",
	},
	blizzard: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  A Frigid Shot from Blizzard! ",
	},
	bloodmoon: {
		inherit: true,
		basePower: 150,
	},
	blueflare: {
		inherit: true,
		isNonstandard: null,
	},
	boltbeak: {
		inherit: true,
		basePower: 75,
	},
	boltstrike: {
		inherit: true,
		isNonstandard: null,
	},
	boneclub: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		isNonstandard: null,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
        ignoreImmunity: {'Ground': true},
        desc: "Has a 30% chance to make the target flinch. This move can hit airborne Pokemon, which includes Flying-type Pokemon, Pokemon with the Levitate Ability, Pokemon holding an Air Balloon, and Pokemon under the effect of Magnet Rise or Telekinesis.",
		shortDesc: "Hits Flying Pokemon. 30% flinch.",
	},
	bonemerang: {
		inherit: true,
		basePower: 55,
		isNonstandard: null,
        ignoreImmunity: {'Ground': true},
        desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. This move can hit airborne Pokemon, which includes Flying-type Pokemon, Pokemon with the Levitate Ability, Pokemon holding an Air Balloon, and Pokemon under the effect of Magnet Rise or Telekinesis.",
		shortDesc: "Hits Flying Pokemon. Hits 2 times in one turn",
	},
	bonerush: {
		inherit: true,
        ignoreImmunity: {'Ground': true},
		desc: "Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times. This move can hit airborne Pokemon, which includes Flying-type Pokemon, Pokemon with the Levitate Ability, Pokemon holding an Air Balloon, and Pokemon under the effect of Magnet Rise or Telekinesis.",
		shortDesc: "Hits Flying Pokemon. Hits 2-5 times in one turn.",
	},
	bounce: {
		num: 340,
		accuracy: 95,
		basePower: 85,
		category: "Physical",
		name: "Bounce",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1, distance: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "any",
		type: "Flying",
		contestType: "Cute",
        desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze. ",
	},
	bouncybubble: {
		num: 733,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Bouncy Bubble",
		pp: 10,
		priority: 0,
		flags: {protect: 1, heal: 1},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Clever",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "Phys if Atk > Sp. Atk. Recovers 50% of dealt damage.",
	},
	bubblebeam: {
		inherit: true,
		basePower: 60,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
	},
	bugbite: {
		inherit: true,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
	},
	buzzybuzz: {
		num: 734,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Buzzy Buzz",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Clever",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack. Has a 100% chance to paralyze the foe.",
		shortDesc: "Phys if Atk > Sp. Atk. 100% chance to paralyze.",
	},
	chargebeam: {
		inherit: true,
		accuracy: 100,
		basePower: 60,
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		desc: "Has a 100% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "100% chance to raise the user's Sp. Atk by 1.",
	},
	chatter: {
		inherit: true,
		basePower: 90,
		category: "Special",
	},
	chillingwater: {
		inherit: true,
		basePower: 70,
	},
	chipaway: {
		inherit: true,
        isNonstandard: null,
        onHit(target, source, move) {
            this.damage(target.baseMaxhp / 8, target);
		},
        onAfterSubDamage(damage, target, source, move) {
            this.damage(target.baseMaxhp / 8, target);
		},
        desc: "Ignores the target's stat stage changes, including evasiveness. Deals an additional flat 1/8th damage to the target.",
		shortDesc: "Ignores foe's stat stage changes. Deals +1/8th damage.",
	},
	chloroblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
		mindBlownRecoil: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				const hpBeforeRecoil = pokemon.hp;
				this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Chloroblast'), true);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}
		},
	},
	closecombat: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Beaten Down by Close Combat! ",
	},
	combattorque: {
		inherit: true,
        isNonstandard: null,
		flags: {protect: 1},
	},
	cometpunch: {
        inherit: true,
		basePower: 30,
		isNonstandard: null,
		type: "Steel",
		maxMove: {basePower: 120},
	},
	confide: {
		inherit: true,
		boosts: {
			spa: -2,
		},
		desc: "Lowers the target's Special Attack by 2 stages.",
		shortDesc: "Lowers the target's Sp. Atk by 2.",
	},
	constrict: {
		inherit: true,
		accuracy: 95,
		basePower: 55,
		isNonstandard: null,
		pp: 20,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
        desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
	},
	crabhammer: {
		inherit: true,
		accuracy: 100,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		desc: "Has a higher chance for a critical hit. Has a 10% chance to make the target flinch.",
		shortDesc: "High critical hit ratio. 10% chance to make the target flinch.",
	},
	crosspoison: {
		inherit: true,
		basePower: 80,
	},
	crunch: {
		inherit: true,
		basePower: 85,		
	},
	crushgrip: {
		num: 462,
		accuracy: 100,
		basePower: 120,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		category: "Physical",
		name: "Crush Grip",
        onHit(target) {
			if (target.getAbility().isPermanent) return;
			if (target.newlySwitched || this.queue.willMove(target)) return;
			target.addVolatile('gastroacid');
		},
		onAfterSubDamage(damage, target) {
			if (target.getAbility().isPermanent) return;
			if (target.newlySwitched || this.queue.willMove(target)) return;
			target.addVolatile('gastroacid');
		},
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: {basePower: 190},
		maxMove: {basePower: 140},
		contestType: "Tough",
        desc: "If the user moves after the target, the target's Ability is rendered ineffective as long as it remains active. If the target uses Baton Pass, the replacement will remain under this effect. If the target's Ability is As One, Battle Bond, Comatose, Commander, Disguise, Gulp Missile, Hadron Engine, Ice Face, Multitype, Orichalcum Pulse, Power Construct, Protosynthesis, Quark Drive, RKS System, Schooling, Shields Down, Stance Change, Zen Mode, or Zero to Hero, this effect does not happen, and receiving the effect through Baton Pass ends the effect immediately.",
		shortDesc: "Nullifies the target Ability if it moves first.",
	},
	cut: {
		inherit: true,
        willCrit: true,
		type: "Grass",
	},
	darkpulse: {
		inherit: true,
		basePower: 90,
	},
	darkvoid: {
        inherit: true,
        accuracy: 85,
        boosts: {
            def: -1,
            spd: -1,
        },
        desc: "Lowers the targets Defence and Special Defence by 1 stage each and causes the target to fall asleep. This move cannot be used successfully unless the user's current form, while considering Transform, is Darkrai.",
        shortDesc: "Darkrai: Hits foe(s). Sleeps and -1 Def and SpD.",
    },
	diamondstorm: {
		inherit: true,
		accuracy: 100,
		category: "Special",
		self: {
			chance: 50,
			boosts: {
				def: 1,
				spd: 1,
			},
		},
		desc: "Has a 50% chance to raise the user's Defense and Special Defense by 1 stage.",
		shortDesc: "50% chance to raise user's Def and Sp. Def by 1.",
	},
	dig: {
		inherit: true,
		basePower: 100,
        breaksProtect: true,
        desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Earthquake and Magnitude but takes double damage from them, and is also unaffected by weather. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Digs turn 1, strikes turn 2. Breaks Protect.",
	},
	disarmingvoice: {
		inherit: true,
		priority: 1,
		desc: "This move does not check accuracy.",
		shortDesc: "Does not check accuracy. Hits foes. +1 priority.",
	},
	discharge: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Electrified by Discharge! ",
	},
	dive: {
		inherit: true,
		basePower: 100,
        breaksProtect: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Surf and Whirlpool but takes double damage from them, and is also unaffected by weather. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Dives turn 1, hits turn 2. Breaks Protect.",
	},
	dizzypunch: {
		inherit: true,
		basePower: 80,
		isNonstandard: null,
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		desc: "Has a 100% chance to confuse the target.",
		shortDesc: "100% chance to confuse the target.",
	},
	doubleedge: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Sliced Apart by Double-Edge! ",
	},
	doublekick: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	doubleteam: {
		inherit: true,
		boosts: {
			atk: 1,
		},
		esc: "Raises the user's Attack by 1 stage.",
		shortDesc: "Raises the user's atk by 1.",
	},
	dracometeor: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Pounded by Draco Meteor! ",
	},
	dragonclaw: {
		inherit: true,
		basePower: 90,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Ripped by Dragon Claw! ",
	},
	dragondarts: {
		inherit: true,
		basePower: 40,
		category: "Special",
	},
	dragonpulse: {
		inherit: true,
		accuracy: true,
	},
	dragonrush: {
		inherit: true,
		accuracy: 85,
		basePower: 110,
	},
	drainingkiss: {
		inherit: true,
		basePower: 75,
	},
	drainpunch: {
		inherit: true,
		basePower: 80,
	},
	dreameater: {
		inherit: true,
		basePower: 120,
		drain: [1, 1],
        desc: "The target is unaffected by this move unless it is asleep. The user recovers HP equal to the damage dealt to the target. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User gains HP equal to damage inflicted. Sleeping target only.",
	},
	drillpeck: {
		inherit: true,
		basePower: 85,
        critRatio: 2,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Nailed by Drill Peck! ",
	},
	drillrun: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
		desc: "Has a higher chance for a critical hit. 10% chance to lower the target's Defense by 1 stage.",
		shortDesc: "High crit ratio. 10% chance to lower the target's Def by 1.",
	},
	drumbeating: {
		inherit: true,
		basePower: 100,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
	},
    dynamaxcannon: {
        inherit: true,
		flags: {protect: 1, bullet: 1},
	},
	dynamicpunch: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Beated Down by Dynamic Punch! ",
	},
	earthquake: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			this.add('-activate', pokemon, move.name);
		},
        activate: "  Earthquake tears open the ground! ",
	},
	eruption: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Nailed by Eruption! ",
	},
	eternabeam: {
		num: 795,
		accuracy: 90,
		basePower: 160,
		category: "Special",
		isNonstandard: "Past",
		name: "Eternabeam",
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'eternabeam') pokemon.disableMove('eternabeam');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'eternabeam') pokemon.addVolatile('eternabeam');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('eternabeam')) {
				this.add('-hint', "Some effects can force a Pokemon to use Eternabeam again in a row.");
			}
		},
		condition: {},
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Dragon",
        shortDesc: "Cannot be used twice in a row.",
	},
	explosion: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Annihilated by Explosion! ",
	},
	extremespeed: {
		num: 245,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Extreme Speed",
		pp: 5,
		priority: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	facade: {
        inherit: true,
        onBasePower(basePower, pokemon) {
            if (pokemon.status || pokemon.hasAbility('comatose')) {
                return this.chainModify(2);
            }
        },
        desc: "Power doubles if the user has a non-volatile status condition. The physical damage halving effect from the user's burn is ignored.",
        shortDesc: "Power doubles if user has a status ailment.",
    },
	fairywind: {
		inherit: true,
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		desc: "Has a 10% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "10% chance to raise all stats by 1 (not acc/eva).",
	},
	falseswipe: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
	},
	fireblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Torched by Fire Blast! ",
	},
	firefang: {
		inherit: true,
		accuracy: 100,
		basePower: 80,
	},
	firepunch: {
		inherit: true,
		basePower: 85,
	},
	fishiousrend: {
		inherit: true,
		basePower: 75,
	},
	fissure: {
		num: 90,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		name: "Fissure",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'fissure') pokemon.disableMove('fissure');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'fissure') pokemon.addVolatile('fissure');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('fissure')) {
				this.add('-hint', "Some effects can force a Pokemon to use Fissure again in a row.");
			}
		},
		condition: {},
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Fissue opens an Abyss of Destruction! ",
	},
	flameburst: {
		inherit: true,
		onHit(target, source, move) {
            this.damage(target.baseMaxhp / 8, target);
			for (const ally of target.adjacentAllies()) {
				this.damage(ally.baseMaxhp / 8, ally, source, this.dex.conditions.get('Flame Burst'));
			}
		},
		onAfterSubDamage(damage, target, source, move) {
            this.damage(target.baseMaxhp / 8, target);
			for (const ally of target.adjacentAllies()) {
				this.damage(ally.baseMaxhp / 8, ally, source, this.dex.conditions.get('Flame Burst'));
			}
		},
		desc: "If this move is successful, the target and each ally adjacent to the target loses 1/8 of its maximum HP, rounded down, unless it has the Magic Guard Ability.",
		shortDesc: "Damages Pokemon next to the target as well.",
		damage: "  The bursting flame hit [POKEMON]!",
	},
	flamewheel: {
		inherit: true,
        onAfterHit(target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Flame Wheel', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Flame Wheel', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Flame Wheel', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Flame Wheel', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		desc: "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Has a 10% chance to burn the target.",
		shortDesc: "10% burn, frees user from hazards/bind/leech.",
	},
	flamethrower: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Singed by Flamethower! ",
	},
	flareblitz: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Torched by Flare Blitz! ",
	},
	flash: {
		inherit: true,
		basePower: 60,
		category: "Special",
		isNonstandard: null,
        flags: {protect: 1},
        boosts: {
		},
		secondary: {
            chance: 50,
			atk: -1,
        },
		target: "allAdjacent",
		type: "Electric",
		zMove: null,
        desc: "Hits adjacent Pokemon. Has a 50% chance to lower each targets attack by 1 stage.",
		shortDesc: "50% chance to lower Foe(s) atk.",
	},
	flashcannon: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	flatter: {
		inherit: true,
		boosts: {
			spa: 2,
		},
		desc: "Raises the target's Special Attack by 2 stage and confuses it.",
		shortDesc: "Raises the target's Sp. Atk by 2 and confuses it.",
	},
	fleurcannon: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	floatyfall: {
		num: 731,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Floaty Fall",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Flying",
		contestType: "Cool",
	},
	fly: {
		inherit: true,
        breaksProtect: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder, and Twister, and Gust and Twister have doubled power when used against it. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Flies up on 1st turn, then his 2nd turn. Breaks Protect.",
	},
	flyingpress: {
		inherit: true,
		accuracy: 100,
		onEffectiveness(typeMod, target, type, move) {
            if (type === 'Bug') return 1;
            if (type === 'Grass') return 1;
            if (type === 'Fighting') return 1;
		},
		desc: "This move deals super effective damage to any Pokemon that is normally weak to Flying. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "Deals super effective damage to flying weak Targets",
	},
	focusblast: {
		inherit: true,
		accuracy: 80,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
        activate: "  Busted by Focus Blast! ",
	},
	focusenergy: {
		inherit: true,
        boosts: {
			accuracy: 1,
		},
		desc: "Raises the user's chance for a critical hit by 2 stages and Raises the user's accuracy by 1 stage. Fails if the user already has the effect. Baton Pass can be used to transfer this effect to an ally.",
		shortDesc: "Raises accuracy by 1 and critical hit ratio by 2.",
	},
	focuspunch: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Slammed by Focus Punch! ",
	},
	freezeshock: {
		num: 553,
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		isNonstandard: "Past",
		name: "Freeze Shock",
		pp: 5,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			status: 'par',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
        shortDesc: "Has a 50% chance to paralyze the target",
	},
	freezingglare: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'frz',
		},
		desc: "Has a 30% chance to freeze the target.",
		shortDesc: "30% chance to freeze the target.",
	},
	freezyfrost: {
		num: 739,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Freezy Frost",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		secondary: {
			chance: 100,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Clever",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack. Has a 100% chance to freeze the foe.",
		shortDesc: "Phys if Atk > Sp. Atk. 100% chance to freeze.",
	},
	frenzyplant: {
		num: 338,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Frenzy Plant",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'frenzyplant') pokemon.disableMove('frenzyplant');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'frenzyplant') pokemon.addVolatile('frenzyplant');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('frenzyplant')) {
				this.add('-hint', "Some effects can force a Pokemon to use Frenzy Plant again in a row.");
			}
		},
		condition: {},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Shredded by Frenzy Plant! ",
	},
	geargrind: {
		inherit: true,
		accuracy: 95,
		isNonstandard: null,
	},
	geomancy: {
		inherit: true,
		isNonstandard: null,
		flags: {charge: 1, nonsky: 1},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		boosts: {
			spa: 2,
			spd: 2,
			spe: 2,
		},
        onHit(target, pokemon, move) {
			if (pokemon.species.id === 'xerneasneutral' && !pokemon.transformed) {
				pokemon.formeChange('Xerneas', this.effect, false, '[msg]');
			}
		},
		desc: "Raises the user's Special Attack, Special Defense, and Speed by 2 stages. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn. After successfully completing the second turn and the user is a Xerneas, it changes to it's Active Forme.",
		shortDesc: "Charges, then +2 SpA, SpD, Spe. Xerneas transforms.",
	},
	gigaimpact: {
		num: 416,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		name: "Giga Impact",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'gigaimpact') pokemon.disableMove('gigaimpact');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'gigaimpact') pokemon.addVolatile('gigaimpact');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('gigaimpact')) {
				this.add('-hint', "Some effects can force a Pokemon to use Giga Impact again in a row.");
			}
		},
		condition: {},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Crushed by Giga Impact! ",
	},
	glaciate: {
		inherit: true,
		accuracy: 100,
		basePower: 100,
		isNonstandard: null,
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		pp: 5,
		desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "Physical if user's Atk > Sp. Atk. Lower the foe(s) Spe by 1.",
	},
	glitzyglow: {
		num: 736,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Glitzy Glow",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		self: {
			sideCondition: 'lightscreen',
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack. This move summons Light Screen for 5 turns upon use.",
		shortDesc: "Phys if Atk > Sp. Atk. Summons Light Screen.",
	},
	grasswhistle: {
        inherit: true,
        accuracy: 75,
        target: "allAdjacentFoes",
    },
	grassyglide: {
		inherit: true,
		basePower: 60,
	},
	guardianofalola: {
		num: 698,
		accuracy: true,
		basePower: 200,
		category: "Special",
		isNonstandard: "Past",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		name: "Guardian of Alola",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "tapuniumz",
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Tough",
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes.",
		shortDesc: "Physical if user's Atk > Sp. Atk.",
	},
	guillotine: {
		num: 12,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		name: "Guillotine",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'guillotine') pokemon.disableMove('guillotine');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'guillotine') pokemon.addVolatile('gullotine');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('guillotine')) {
				this.add('-hint', "Some effects can force a Pokemon to use Guillotine again in a row.");
			}
		},
		condition: {},
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Guillotine does massive damage! ",
	},
	gunkshot: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Glooped by Gunk Shot! ",
	},
	headcharge: {
		inherit: true,
		secondary: {
			chance: 30,
			boosts: {
				def: -1,
			},
		},
		desc: "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP. Has a 30% chance to lower the target's Defense by 1 stage.",
		shortDesc: "Has 1/4 recoil. 30% chance to lower the target's Def by 1.",
	},
	headsmash: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Slammed by Head Smash! ",
	},
    doomdesire: {
        inherit: true,
		activate: "  The DOOM desire has been granted, [TARGET] took the damage!",
	},
	heatwave: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Burned by Heat Wave! ",
	},
	hiddenpower: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerbug: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerdark: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerdragon: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerelectric: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerfighting: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerfire: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerflying: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerghost: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowergrass: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerground: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerice: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerpoison: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerpsychic: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerrock: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowersteel: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	hiddenpowerwater: {
		inherit: true,
        basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('runicpower')) {
				return move.basePower + 40;
			}
			return move.basePower;
		},
	},
	highhorsepower: {
		inherit: true,
		accuracy: 100,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	highjumpkick: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1, kick: 1},
	},
	horndrill: {
		num: 32,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		name: "Horn Drill",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'horndrill') pokemon.disableMove('horndrill');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'horndrill') pokemon.addVolatile('horndrill');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('horndrill')) {
				this.add('-hint', "Some effects can force a Pokemon to use Horn Drill again in a row.");
			}
		},
		condition: {},
		secondary: null,
		target: "normal",
		type: "Rock",
		zMove: {basePower: 180},
		maxMove: {basePower: 130},
		contestType: "Cool",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Horn Drill Impales its Target! ",
	},
	hydrocannon: {
		num: 308,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Hydro Cannon",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, bullet: 1},
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'hydrocannon') pokemon.disableMove('hydrocannon');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'hydrocannon') pokemon.addVolatile('hydrocannon');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('hydrocannon')) {
				this.add('-hint', "Some effects can force a Pokemon to use Hydro Cannon again in a row.");
			}
		},
		condition: {},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Deluged by Hydro Cannon! ",
	},
	hydropump: {
		inherit: true,
        critRatio: 2,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "High critical hit ratio.",
        activate: "  Swamped by Hydro Pump! ",
	},
	hyperbeam: {
		num: 63,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Hyper Beam",
		pp: 5,
		priority: 0,
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'hyperbeam') pokemon.disableMove('hyperbeam');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'hyperbeam') pokemon.addVolatile('hyperbeam');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('hyperbeam')) {
				this.add('-hint', "Some effects can force a Pokemon to use Hyper Beam again in a row.");
			}
		},
		condition: {},
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Blasted by Hyper Beam! ",
	},
	hyperfang: {
		inherit: true,
		basePower: 85,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
        desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to make the target flinch.",
	},
	hyperspacefury: {
        inherit: true,
		boosts: {
        },
        desc: "This move cannot be used successfully unless the user's current form, while considering Transform, is Hoopa Unbound. If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
		shortDesc: "Hoopa-U: Breaks protect.",
	},
	hyperspacehole: {
		inherit: true,
		basePower: 100,
	},
	hypnosis: {
        inherit: true,
        accuracy: 90,
    },
	iceburn: {
		num: 554,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		isNonstandard: "Past",
		name: "Ice Burn",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
        shortDesc: "Has a 50% chance to burn the target.",
		prepare: "  [POKEMON] became cloaked in freezing air!",
	},
	icefang: {
		inherit: true,
		accuracy: 100,
		basePower: 80,
	},
	icepunch: {
		inherit: true,
		basePower: 85,
	},
	icespinner: {
		inherit: true,
		basePower: 90,
	},
	iciclecrash: {
		inherit: true,
		basePower: 110,
	},
	incinerate: {
		num: 510,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Incinerate",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Incinerate', '[of] ' + source);
				}
			}
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Tough",
        desc: "If the target is holding an item that can be removed from it, ignoring the Sticky Hold Ability, this move's power is multiplied by 1.5. If the user has not fainted, the target loses its held item. This move cannot cause Pokemon with the Sticky Hold Ability to lose their held item or cause a Kyogre, a Groudon, a Giratina, an Arceus, a Genesect, a Silvally, a Zacian, or a Zamazenta to lose their Blue Orb, Red Orb, Griseous Orb, Plate, Drive, Memory, Rusted Sword, or Rusted Shield respectively. Items lost to this move cannot be regained with Recycle or the Harvest Ability.",
		shortDesc: "1.5x damage if foe holds an item. Removes item.",
	},
	irontail: {
		inherit: true,
		accuracy: 80,
		basePower: 120,
	},
	jawlock: {
		inherit: true,
		basePower: 85,
	},
	judgment: {
		inherit: true,
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. This move's type depends on the user's held Plate.",
		shortDesc: "Physical if Atk > Sp. Atk. Type based on held Plate.",
        
        activate: "  Judgment has been dealt! ",
	},
	jumpkick: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1, kick: 1},
	},
	junglehealing: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.33));
			return pokemon.cureStatus() || success;
		},
        name: "Jungle Healing",
		desc: "Each Pokemon on the user's side restores 1/3 of its maximum HP, rounded half up, and has its status condition cured.",
		shortDesc: "User and allies: healed 1/3 max HP, status cured.",
	},
	kinesis: {
		num: 134,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		isNonstandard: "Past",
		name: "Kinesis",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        secondary: {
			chance: 100,
			boosts: {
                spd: -2,
            },
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
        desc: "Lowers the target's Special Defence by 2 stages.",
		shortDesc: "Lowers the target's Sp. Def by 2.",
	},
	landswrath: {
		inherit: true,
		basePower: 95,
		category: "Special",
		isNonstandard: null,
	},
	lastrespects: {
		inherit: true,
		basePower: 80,
		basePowerCallback(pokemon, target, move) {
			return 80 + 10 * pokemon.side.totalFainted;
		},
        desc: "Power is equal to 80+(X*10), where X is the total number of times any Pokemon has fainted on the user's side, and X cannot be greater than 100.",
		shortDesc: "+10 power for each time a party member fainted.",
	},
	lavaplume: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Scorched by Lava Plume! ",
	},
	leafage: {
		inherit: true,
		priority: 1,
		desc: "No additional effect.",
        shortDesc: "Usually goes first.",
	},
	leafstorm: {
		inherit: true,
		flags: {protect: 1, mirror: 1, wind: 1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Torn up by Leaf Storm! ",
	},
	leaftornado: {
		inherit: true,
		accuracy: 100,
		basePower: 65,
		flags: {protect: 1, mirror: 1, wind: 1},
		secondary: {
			chance: 50,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		desc: "Has a 50% chance to lower the target's Speed by 1.",
		shortDesc: "50% chance to lower the foe(s) Speed by 1.",
	},
	leechlife: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1, bite: 1},
	},
	lick: {
		inherit: true,
		secondary: {
			chance: 100,
			status: 'par',
		},
		desc: "Has a 100% chance to paralyze the target.",
		shortDesc: "100% chance to paralyze the target.",
	},
	lovelykiss: {
        inherit: true,
        accuracy: 100,
    },
    lowkick: {
        inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	lunarblessing: {
		inherit: true,
		pp: 10,
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.33));
			return pokemon.cureStatus() || success;
		},
		type: "Fairy",
        desc: "Each Pokemon on the user's side restores 1/3 of its maximum HP, rounded half up, and has its status condition cured.",
		shortDesc: "User and allies: healed 1/3 max HP, status cured.",
	},
	lunardance: {
		inherit: true,
		type: "Fairy",
	},
	lusterpurge: {
		inherit: true,
		basePower: 90,
		isNonstandard: null,
		secondary: {
			chance: 100,
			boosts: {
				spd: -1,
                def: -1,
			},
		},
		desc: "Has a 100% chance to lower the target's Defense and Special Defense by 1 stage.",
		shortDesc: "100% chance to lower the target's Def and Sp. Def by 1.",
	},
	magicaltorque: {
		num: 900,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Magical Torque",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fairy",
	},
	magmastorm: {
		inherit: true,
		accuracy: 90,
		basePower: 100,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Incinerated by Magma Storm! ",
	},
	magnetbomb: {
		inherit: true,
		basePower: 80,
		category: "Special",
		pp: 15,
        onEffectiveness(typeMod, target, type) {
			if (type === 'Steel') return 1;
		},
	},
	magnitude: {
        inherit: true,
		activate: "  A Magnitude [NUMBER] Shakes the Ground! ",
	},
	makeitrain: {
		inherit: true,
		basePower: 130,
		self: {
			boosts: {
				spa: -2,
			},
		},
		desc: "Lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2. Hits foe(s).",
	},
    maliciousmoonsault: {
		num: 696,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Malicious Moonsault",
		pp: 1,
		priority: 0,
		flags: {contact: 1},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	meditate: {
		inherit: true,
        self: {
			onHit(target) {
				target.clearBoosts();
                this.add('-clearboost', target);
                this.boost({atk: +2}, target)
                this.boost({spa: +2}, target);
            }
		},
		zMove: {boost: {atk: 2, spa: 2}},
        desc: "Clears the users stat boosts, then raises the user's Attack and Special attack by 2 stages each.",
		shortDesc: "Clears stat boosts, +2 Atk and Sp. Atk.",
	},
	megadrain: {
		inherit: true,
		basePower: 60,
	},
	megahorn: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Pierced by Megahorn! ",
	},
	megakick: {
		inherit: true,
		accuracy: 90,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	megapunch: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		desc: "Has a 10% chance to raise the user's Attack by 1 stage.",
		shortDesc: "10% chance to raise the user's Attack by 1.",
	},
	metalclaw: {
		inherit: true,
		accuracy: 100,
		basePower: 75,
	},
	meteorassault: {
		num: 794,
		accuracy: 100,
		basePower: 160,
		category: "Physical",
		isNonstandard: "Past",
		name: "Meteor Assault",
		pp: 5,
		priority: 0,
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'meteorassault') pokemon.disableMove('meteorassault');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'meteorassault') pokemon.addVolatile('meteorassault');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('meteorassault')) {
				this.add('-hint', "Some effects can force a Pokemon to use Meteor Assault again in a row.");
			}
		},
		condition: {},
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Fighting",
        shortDesc: "Cannot be used twice in a row.",
	},
	meteorbeam: {
		inherit: true,
		accuracy: 90,
	},
	meteormash: {
		inherit: true,
		accuracy: 85,
		basePower: 110,
	},
	minimize: {
		inherit: true,
		boosts: {
			def: 1,
			spe: 1,
		},
        desc: "Raises the user's Defence and Speed by 1 stage. Body Slam, Dragon Rush, Flying Press, Heat Crash, Heavy Slam, Malicious Moonsault, Steamroller, and Stomp will not check accuracy and have their damage doubled if used against the user while it is active.",
		shortDesc: "Raises the user's Def and Spe by 1.",
	},
	mirrorshot: {
        inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	mistyexplosion: {
		inherit: true,
		basePower: 150,
	},
	moonblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	mountaingale: {
		inherit: true,
		basePower: 120,
		secondary: {
			chance: 30,
			status: 'frz',
		},
		desc: "Has a 30% chance to freeze the target.",
		shortDesc: "30% chance to freeze the target.",
	},
	mudbomb: {
		inherit: true,
		accuracy: 100,
		basePower: 75,
		secondary: {
			chance: 30,
			boosts: {
				spe: -1,
			},
		},
		desc: "Has a 30% chance to lower the target's speed by 1 stage.",
		shortDesc: "30% chance to lower the target's spe by 1.",
	},
	mudshot: {
        inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	mudslap: {
		inherit: true,
		basePower: 60,
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		desc: "Has a 100% chance to lower the target's Attack by 1 stage.",
		shortDesc: "100% chance to lower the target's atk by 1.",
	},
	muddywater: {
		inherit: true,
		secondary: {
			chance: 50,
			boosts: {
				atk: -1,
			},
		},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        desc: "Has a 50% chance to lower the target's Attack by 1 stage.",
		shortDesc: "50% chance to lower the foe(s) atk by 1.",
        activate: "  Splashed by Muddy Water! ",
	},
	multiattack: {
		inherit: true,
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) < pokemon.getStat('spa', false, true)) move.category = 'Special';
		},
		desc: "This move becomes a Special attack if the user's Special Attack is greater than its Attack, including stat stage changes. This move's type depends on the user's held Memory.",
		shortDesc: "Special if Sp. Atk > Atk. Type based on held Memory.",
	},
	needlearm: {
		inherit: true,
		basePower: 100,
		isNonstandard: null,
	},
	nightdaze: {
		inherit: true,
		accuracy: 100,
		basePower: 100,
		secondary: null,
		shortDesc: "No additional effect.",
	},
	nightslash: {
		inherit: true,
		basePower: 80,
	},
	noxioustorque: {
		num: 898,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Noxious Torque",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
	},
	oblivionwing: {
		inherit: true,
		basePower: 95,
	},
	octazooka: {
		inherit: true,
		accuracy: 100,
		basePower: 75,
		isNonstandard: null,
		secondary: {
			chance: 50,
			boosts: {
				spe: -1,
			},
		},
		desc: "Has a 50% chance to lower the target's speed by 1 stage.",
		shortDesc: "50% chance to lower the target's speed by 1.",
	},
	odorsleuth: {
		num: 316,
		accuracy: true,
		basePower: 80,
		category: "Physical",
		isNonstandard: "Past",
		name: "Odor Sleuth",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, bypasssub: 1, allyanim: 1},
		volatileStatus: 'foresight',
		onTryHit(target) {
			if (target.volatiles['miracleeye']) return false;
		},
        ignoreImmunity: {'Normal': true},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
        desc: "As long as the target remains active, its evasiveness stat stage is ignored during accuracy checks against it if it is greater than 0, and Normal- and Fighting-type attacks can hit the target if it is a Ghost type. Fails if the target is already affected, or affected by Foresight or Miracle Eye.",
		shortDesc: "Fighting, Normal hit Ghost. Evasiveness ignored.",
	},
	outrage: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Smacked down by Outrage! ",
	},
	overheat: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Cooked by Overheat! ",
	},
	paleowave: {
		num: 0,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Paleo Wave",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Beautiful",
	},
	paraboliccharge: {
		inherit: true,
		basePower: 75,
	},
    partingshot: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, bullet: 1},
	},
	payday: {
		inherit: true,
		basePower: 30,
        multihit: [2, 5],
		desc: "Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times.",
		shortDesc: "Scatters coins. Hits 2-5 times in one turn.",
	},
	phantomforce: {
		inherit: true,
		basePower: 100,
	},
	pikapapow: {
		num: 732,
		accuracy: true,
		basePower: 0,
		basePowerCallback(pokemon) {
			const bp = Math.floor((pokemon.happiness * 10) / 25) || 1;
			this.debug('BP: ' + bp);
			return bp;
		},
		category: "Special",
		name: "Pika Papow",
		pp: 20,
		priority: 0,
		flags: {protect: 1},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cute",
	},
	playrough: {
		inherit: true,
		basePower: 120,
        self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		desc: "Lowers the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
	},
	poisonfang: {
		inherit: true,
		basePower: 80,
		secondaries: [
			{
				chance: 10,
				status: 'tox',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
        secondary: null,
		desc: "Has a 10% chance to bady poison the target and a 10% chance to make it flinch.",
		shortDesc: "10% chance to bady poison. 10% chance to flinch.",
	},
	populationbomb: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, bullet: 1},
	},
	powdersnow: {
		num: 181,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Powder Snow",
		pp: 15,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
		status: 'frz',
		secondary: null,
		target: "normal",
		type: "Ice",
        zMove: {boost: {spa: 1}},
		contestType: "Beautiful",
        desc: "Freezes the target.",
		shortDesc: "Freezes the target.",
	},
	powergem: {
		inherit: true,
		basePower: 90,
	},
	poweruppunch: {
		inherit: true,
		basePower: 60,
		category: "Physical",
		isNonstandard: null,
	},
	powerwhip: {
        inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Lashed by Power Whip! ",
	},
	precipiceblades: {
		inherit: true,
		flags: {protect: 1, mirror: 1, nonsky: 1, slicing: 1},
	},
	present: {
		num: 217,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Present",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit(target, source, move) {
			if (source.isAlly(target)) {
				move.basePower = 0;
				move.infiltrates = true;
			}
		},
		onHit(target, source) {
			if (source.isAlly(target)) {
				if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) {
					this.add('-immune', target);
					return this.NOT_FAIL;
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
        desc: "If the target is an ally, this move restores 1/2 of its maximum HP, rounded down, instead of dealing damage.",
		shortDesc: "If the target is an ally, heals 50% of its max HP.",
	},
	prismaticlaser: {
		num: 711,
		accuracy: 100,
		basePower: 160,
		category: "Special",
		isNonstandard: "Past",
		name: "Prismatic Laser",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'prismaticlaser') pokemon.disableMove('prismaticlaser');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'prismaticlaser') pokemon.addVolatile('prismaticlaser');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('prismaticlaser')) {
				this.add('-hint', "Some effects can force a Pokemon to use Prismatic Laser again in a row.");
			}
		},
		condition: {},
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
        shortDesc: "Physical if user's Atk > Sp. Atk. Cannot be used twice in a row.", 
	},
	psychoboost: {
		inherit: true,
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		self: {
			boosts: {
				spa: -1,
				atk: -1,
			},
		},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. Lowers the user's Attack and Special Attack by 1 stages. ",
		shortDesc: "Phys if Atk > SpA. Lowers the user's Atk and Sp. Atk by 1.",
        activate: "  Torn Apart by Psycho Boost! ",
	},
	psychocut: {
		inherit: true,
		basePower: 80,
	},
	psyshieldbash: {
		inherit: true,
		secondary: {
			chance: 100,
			self: {
				boosts: {
					def: 1,
					spd: 1,
				},
			},
		},
		desc: "Has a 100% chance to raise the user's Defense by 1 stage.",
		shortDesc: "100% chance to raise the user's Defense by 1.",
	},
	purify: {
		inherit: true,
		pp: 5,
		onHit(target, source) {
			pokemon.cureStatus();
		},
        heal: [1, 2],
        shortDesc: "Cures target's status and heals user 1/2 max HP.",
	},
	pyroball: {
		inherit: true,
		flags: {protect: 1, mirror: 1, defrost: 1, bullet: 1, kick: 1},
	},
    quickguard: {
        inherit: true,
		priority: 4,
	},
	rage: {
		num: 99,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Rage",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
        desc: "Has a 100% chance to raise the user's Attack by 1 stage.",
		shortDesc: "100% chance to raise the user's Attack by 1.",
	},
	ragefist: {
		inherit: true,
		basePower: 80,
		basePowerCallback(pokemon) {
			return Math.min(300, 80 + 10 * pokemon.timesAttacked);
		},
		desc: "Power is equal to 80+(X*10), where X is the total number of times the user has been hit by a damaging attack during the battle, even if the user did not lose HP from the attack. X cannot be greater than 22 and does not reset upon switching out or fainting. Each hit of a multi-hit attack is counted, but confusion damage is not counted.",
		shortDesc: "+10 power for each time user was hit. Max 22 hits.",
	},
	ragingbull: {
		inherit: true,
		basePower: 100,
        breaksProtect: true,
		desc: "If this move is successful, the effects of Reflect, Light Screen, and Aurora Veil end for the target's side of the field before damage is calculated. Additionally, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. If the user's current form is a Paldean Tauros, this move's type changes to match. Fighting type for Combat Breed, Fire type for Blaze Breed, and Water type for Aqua Breed.",
		shortDesc: "Destroys Protections. Type depends on user's form.",
	},
	razorwind: {
		num: 13,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		isNonstandard: "Past",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, slicing: 1, wind: 1},
		critRatio: 2,
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
        desc: "Has a higher chance for a critical hit.",
		shortDesc: "High crit ratio.",
	},
	relicsong: {
		inherit: true,
		basePower: 95,
		secondary: {
			chance: 30,
			status: 'slp',
		},
        desc: "Has a 30% chance to cause the target to fall asleep. If this move is successful on at least one target and the user is a Meloetta, it changes to Pirouette Forme if it is currently in Aria Forme, or changes to Aria Forme if it is currently in Pirouette Forme. This forme change does not happen if the Meloetta has the Sheer Force Ability. The Pirouette Forme reverts to Aria Forme when Meloetta is not active.",
		shortDesc: "30% chance to sleep foe(s). Meloetta transforms.",
	},
	roaroftime: {
		num: 459,
		accuracy: 90,
		basePower: 160,
		category: "Special",
		name: "Roar of Time",
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'roaroftime') pokemon.disableMove('roaroftime');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'roaroftime') pokemon.addVolatile('roaroftime');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('roaroftime')) {
				this.add('-hint', "Some effects can force a Pokemon to use Roar of Time again in a row.");
			}
		},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		condition: {},
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Ripped by Roar of Time! ",
	},
	rockclimb: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		type: "Rock",
		desc: "Has a 30% chance to confuse the target.",
		shortDesc: "30% chance to confuse the target.",
	},
	rockslide: {
		inherit: true,
		basePower: 85,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			this.add('-activate', pokemon, move.name);
		},
        activate: "  Rock Slide Tumbles Down! ",
	},
	rocksmash: {
		inherit: true,
		basePower: 60,
        onAfterHit(target, pokemon) {
			const sideConditions = ['stealthrock'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rock Smash', '[of] ' + pokemon);
				}
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			const sideConditions = ['stealthrock'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rock Smash', '[of] ' + pokemon);
				}
			}
		},
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		desc: "Has a 100% chance to lower the target's Defense by 1 stage. Stealth Rock hazards are removed from the user's side of the field.",
		shortDesc: "Lowers target's Def by 1. Clears user's Stealth Rocks.",
	},
	rockthrow: {
		inherit: true,
		basePower: 80,
	},
	rockwrecker: {
		num: 439,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		isNonstandard: "Past",
		name: "Rock Wrecker",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'rockwrecker') pokemon.disableMove('rockwrecker');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'rockwrecker') pokemon.addVolatile('rockwrecker');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('rockwrecker')) {
				this.add('-hint', "Some effects can force a Pokemon to use Rock Wrecker again in a row.");
			}
		},
		condition: {},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Demolished by Rock Wrecker! ",
	},
	rollingkick: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	ruination: {
		num: 877,
		accuracy: 90,
		basePower: 110,
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		category: "Special",
		name: "Ruination",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes.",
		shortDesc: "Physical if user's Atk > Sp. Atk.",
	},
	sacredfire: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Set aflame by Sacred Fire! ",
	},
	sandattack: {
		inherit: true,
		boosts: {
			atk: -1,
			def: -1,
		},
		desc: "Lowers the target's Attack and Defence by 1 stage.",
		shortDesc: "Lowers the target's atk and def by 1.",
	},
	sandsearstorm: {
		inherit: true,
		accuracy: 95,
        onModifyMove(move) {
            if (this.field.isWeather(['sandstorm'])) {
				move.secondaries.push({
					chance: 50,
					status: 'brn',
				});
                move.accuracy = true;
			}
		},
		desc: "Has a 20% chance to burn target's. If the weather is Sandstorm, this move does not check accuracy and gains a +30% chance to burn.",
		shortDesc: "20% brn. Hits adjacent foes. Sand: Doesn't miss, +30% brn.",
	},
	sappyseed: {
		num: 738,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Sappy Seed",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1},
		onHit(target, source) {
			if (target.hasType('Grass')) return null;
			target.addVolatile('leechseed', source);
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack. This move summons Leech Seed on the foe.",
		shortDesc: "Phys if Atk > Sp. Atk. Summons Leech Seed.",
	},
	scald: {
		inherit: true,
		basePower: 70,
        onEffectiveness(typeMod, target, type) {
			if (type === 'Ice') return 1;
		},
		desc: "Has a 30% chance to burn the target. The target thaws out if it is frozen. This move's type effectiveness against Ice is changed to be super effective no matter what this move's type is.",
		shortDesc: "30% brn chance. Thaws. Super effective on Ice.",
	},
	scaleshot: {
        inherit: true,
        flags: {protect: 1, mirror: 1, bullet: 1},
        multihit: [2, 5],
        selfBoost: {
            boosts: {
                spe: 1,
            },
        },
    },
	secretsword: {
		inherit: true,
		basePower: 90,
		category: "Physical",
		isNonstandard: null,
		onModifyMove(move, pokemon, target) {
			if (!target) return;
			const atk = pokemon.getStat('atk', false, true);
			const spa = pokemon.getStat('spa', false, true);
			const def = target.getStat('def', false, true);
			const spd = target.getStat('spd', false, true);
			const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
			const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
			if (physical < special || (physical === special && this.random(2) === 0)) {
				move.category = 'Special';
			}
		},
		flags: {protect: 1, mirror: 1, slicing: 1},
		desc: "This move becomes a Special attack if the value of ((((2 * the user's level / 5 + 2) * 90 * X) / Y) / 50), where X is the user's Special Attack stat and Y is the target's Defense stat, is greater than the same value where X is the user's Attack stat and Y is the target's Special Defense stat. No stat modifiers other than stat stage changes are considered for this purpose. If the two values are equal, this move chooses a damage category at random.",
		shortDesc: "Special if it would be stronger.",
	},
	seedflare: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Ripped into by Seed Flare! ",
	},
	seismictoss: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Hurled by Seismic Toss! ",
	},
	selfdestruct: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			this.add('-activate', pokemon, move.name);
		},
        activate: "  Selfdestruct Detonates! ",
	},
	shadowball: {
		inherit: true,
		basePower: 90,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
	},
	shadowbone: {
		inherit: true,
		basePower: 90,
		secondary: {
			chance: 30,
			boosts: {
				def: -1,
			},
		},
		desc: "Has a 30% chance to lower the target's Defense by 1 stage.",
		shortDesc: "30% chance to lower the target's Defense by 1.",
	},
	shadowclaw: {
		inherit: true,
		basePower: 80,
	},
	shadowforce: {
		num: 467,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Shadow Force",
		pp: 5,
		priority: 0,
		flags: {contact: 1, mirror: 1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        breaksProtect: true,
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
        desc: "If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
		shortDesc: "Breaks protection.",
        activate: "  Complete Destruction by Shadow Force!",
	},
	shadowpunch: {
		inherit: true,
		basePower: 85,
	},
	shadowstrike: {
		num: 0,
		accuracy: 95,
		basePower: 95,
		category: "Physical",
		name: "Shadow Strike",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	sheercold: {
		num: 329,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Sheer Cold",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'sheercold') pokemon.disableMove('sheercold');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.lastMove?.id === 'sheercold') pokemon.addVolatile('sheercold');
		},
		onAfterMove(pokemon) {
			if (pokemon.removeVolatile('sheercold')) {
				this.add('-hint', "Some effects can force a Pokemon to use Sheercold again in a row.");
			}
		},
		condition: {},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        shortDesc: "Cannot be used twice in a row.",
        activate: "  Sheer Cold Delivers Chilling Misery! ",
	},
	shelltrap: {
		inherit: true,
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('shelltrap');
            this.boost({def: 1});
		},
		desc: "Raises the users Defence by 1 then fails unless the user is hit by a physical attack from an opponent this turn before it can execute the move. If the user was hit and has not fainted, it attacks immediately after being hit, and the effect ends. If the opponent's physical attack had a secondary effect removed by the Sheer Force Ability, it does not count for the purposes of this effect.",
		shortDesc: "Raises Def by 1; User must take physical damage before moving.",
	},
	shelter: {
		inherit: true,
		boosts: {
			def: 1,
            spd: 1,
		},
		desc: "Raises the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Raises the user's Defense and Special Defense by 1 stage.",
	},
	silverwind: {
		inherit: true,
		flags: {protect: 1, mirror: 1, wind: 1},		
	},
	sing: {
        inherit: true,
        accuracy: 75,
        target: "allAdjacentFoes",
        shortDesc: "Causes the foes(s) to fall asleep.",
    },
	sizzlyslide: {
		num: 735,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Sizzly Slide",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, defrost: 1},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Clever",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack. Has a 100% chance to burn the foe.",
		shortDesc: "Phys if Atk > Sp. Atk. 100% chance to burn.",
	},
	skyattack: {
		inherit: true,
		accuracy: 80,
		basePower: 120,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        desc: "Has a 30% chance to make the target flinch and a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. Has a 30% chance to flinch",
        activate: "Sky Attack brings down Havoc!",
	},
	sleeppowder: {
        inherit: true,
        accuracy: 85,
    },
    sleeptalk: {
		num: 214,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sleep Talk",
		pp: 10,
		priority: 0,
		flags: {},
		sleepUsable: true,
		onTry(source) {
			return source.status === 'slp' || source.hasAbility('comatose');
		},
		onHit(pokemon) {
            pokemon.cureStatus();
			const noSleepTalk = [
				'assist', 'beakblast', 'belch', 'bide', 'celebrate', 'copycat', 'focuspunch', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'shelltrap', 'sketch', 'sleeptalk', 'uproar', 'rest'
			];
			const moves = [];
			for (const moveSlot of pokemon.moveSlots) {
				const moveid = moveSlot.id;
				if (!moveid) continue;
				const move = this.dex.moves.get(moveid);
				if (noSleepTalk.includes(moveid) || move.flags['charge'] || (move.isZ && move.basePower !== 1) || move.isMax) {
					continue;
				}
				moves.push(moveid);
			}
			let randomMove = '';
			if (moves.length) randomMove = this.sample(moves);
			if (!randomMove) {
				return false;
			}
			this.actions.useMove(randomMove, pokemon);
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: {effect: 'crit2'},
		contestType: "Cute",
        desc: "One of the user's known moves, besides this move, is selected for use at random. Fails if the user is not asleep. The selected move does not have PP deducted from it, and can currently have 0 PP. This move cannot select Assist, Beak Blast, Belch, Bide, Celebrate, Chatter, Copycat, Dynamax Cannon, Focus Punch, Hold Hands, Me First, Metronome, Mimic, Mirror Move, Nature Power, Shell Trap, Sketch, Sleep Talk, Struggle, Uproar, Rest, any two-turn move, or any Max Move.",
		shortDesc: "Must be asleep. Cures Sleep. Uses another move.",
	},
	sludge: {
		inherit: true,
		basePower: 60,
	},
	sludgewave: {
		inherit: true,
		accuracy: 85,
		basePower: 120,
	},
	smackdown: {
		inherit: true,
		basePower: 75,
	},
	smellingsalts: {
		inherit: true,
		basePower: 80,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		onHit(target) {
		},
        desc: "Power doubles if the target has a non-volatile status condition.",
		shortDesc: "Power doubles if the target has a status ailment.",
	},
	smog: {
		inherit: true,
		accuracy: 100,
		flags: {protect: 1, mirror: 1, bypasssub: 1},
		secondary: {
			chance: 100,
			status: 'psn',
		},
		desc: "Has a 100% chance to poison the target.",
		shortDesc: "100% chance to poison the target.",
	},
	smokescreen: {
		inherit: true,
		boosts: {
			atk: -1,
			def: -1,
		},
		desc: "Lowers the target's Attack and Defence by 1 stage.",
		shortDesc: "Lowers the target's atk and def by 1.",
	},
	snipeshot: {
		inherit: true,
		accuracy: true,
		basePower: 90,
		flags: {protect: 1, mirror: 1, bullet: 1},
		critRatio: 2,
	},
	solarbeam: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
            this.boost({spd: 1}, attacker, attacker, move);
			if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        desc: "This attack charges on the first turn raising its Special Defence by 1 and executes on the second. Power is halved if the weather is Primordial Sea, Rain Dance, Sandstorm, or Snow and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.",
		shortDesc: "+1 SpD on turn 1. Hits turn 2. No charge in sun.",
        activate: "  Seared by Solar Beam! ",
	},
	spacialrend: {
		inherit: true,
		basePower: 120,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Torn Apart By Spacial Rend! ",
	},
	sparklingaria: {
		inherit: true,
        onTryHit(target, source, move) {
			if (source.isAlly(target)) {
				move.basePower = 0;
				move.infiltrates = true;
			}
		},
		onHit(target, source) {
			if (source.isAlly(target)) {
				if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) {
					this.add('-immune', target);
					return this.NOT_FAIL;
				}
			}
		},
		desc: "If the target is an ally, this move restores 1/2 of its maximum HP, rounded down, instead of dealing damage. If the user has not fainted, the target is cured of its burn.",
		shortDesc: "If the target is ally, it heals 50%. Cures trget's burn.",
	},
	sparklyswirl: {
		num: 740,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Sparkly Swirl",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		self: {
			onHit(pokemon, source, move) {
				this.add('-activate', source, 'move: Aromatherapy');
				for (const ally of source.side.pokemon) {
					if (ally !== source && (ally.volatiles['substitute'] && !move.infiltrates)) {
						continue;
					}
					ally.cureStatus();
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Clever",
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack. Every Pokemon in the user's party is cured of its non-volatile status condition.",
		shortDesc: "Phys if Atk > Sp. Atk. Cures party's status conditions.",
	},
	spicyextract: {
		num: 858,
		accuracy: true,
		basePower: 80,
		category: "Special",
		name: "Spicy Extract",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		boosts: {
			atk: 2,
		},
        onEffectiveness(typeMod, target, type) {
			if (type === 'Grass') return 1;
            if (type === 'Steel') return 1;
            if (type === 'Bug') return 1;
            if (type === 'Ice') return 1;
		},
        status: 'brn',
		secondary: null,
		target: "normal",
		type: "Grass",
        desc: "Raises the target's Attack by 2 stages and burns it. This move deals super effective damage to any Pokemon that is normally weak to fire.",
		shortDesc: "Target's Atk +2 and BRNs it. Super effective on fire weak targets.",
	},
	spikecannon: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
		onAfterMove(source) {
            for (const side of source.side.foeSidesWithConditions()) {
                side.addSideCondition('spikes');
            }
        },
		secondary: {}, // allows sheer force to trigger
		desc: "Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times. If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in, unless it is a Flying-type Pokemon or has the Levitate Ability. A maximum of three layers may be set, and opponents lose 1/8 of their maximum HP with one layer, 1/6 of their maximum HP with two layers, and 1/4 of their maximum HP with three layers, all rounded down. Can be removed from the opposing side if any opposing Pokemon uses Mortal Spin, Rapid Spin, or Defog successfully, or is hit by Defog",
		shortDesc: "Hits 2-5 times. Sets a layer of Spikes on foes side.",
	},
	spiritbreak: {
		inherit: true,
		basePower: 85,
	},
	spiritshackle: {
		inherit: true,
		basePower: 100,
	},
	spitup: {
		num: 255,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			if (!pokemon.volatiles['stockpile']?.layers) return false;
			return pokemon.volatiles['stockpile'].layers * 50;
		},
		category: "Special",
		name: "Spit Up",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTry(source) {
			return !!source.volatiles['stockpile'];
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
        desc: "Power is equal to 50 times the user's Stockpile count. Fails if the user's Stockpile count is 0.",
		shortDesc: "More power with more uses of Stockpile.",
	},
	splishysplash: {
		num: 730,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Splishy Splash",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Cool",
	},
	springtidestorm: {
		inherit: true,
		accuracy: 95,
        onModifyMove(move) {
            if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				move.secondaries.push({
					chance: 50,
					status: 'slp',
				});
                move.accuracy = true;
			}
		},
		secondary: {
			chance: 20,
			status: 'slp',
        },
		desc: "Has a 20% chance to put target's to sleep. If the weather is Sunny, this move does not check accuracy and gains a +30% chance to sleep.",
		shortDesc: "20% slp. Hits adjacent foes. Sun: Doesn't miss, +30% slp.",
	},
	steameruption: {
		inherit: true,
        onEffectiveness(typeMod, target, type) {
			if (type === 'Ice') return 1;
		},
		desc: "Has a 30% chance to burn the target. The target thaws out if it is frozen. This move's type effectiveness against Ice is changed to be super effective no matter what this move's type is.",
		shortDesc: "30% brn chance. Thaws. Super effective on Ice.",
	},
	steamroller: {
		inherit: true,
		basePower: 100,
	},
	steelbeam: {
		num: 796,
		accuracy: 95,
		basePower: 120,
		category: "Special",
		name: "Steel Beam",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		mindBlownRecoil: true,
		recoil: [33, 100],
		secondary: null,
		target: "normal",
		type: "Steel",
        desc: "If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil.",
	},
	steelwing: {
		inherit: true,
		basePower: 80,
		secondary: {
			chance: 30,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		desc: "Has a 30% chance to raise the user's Defense by 1 stage.",
		shortDesc: "30% chance to raise the user's Defense by 1.",
	},
	stomp: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1, kick: 1},
	},
	stompingtantrum: {
		inherit: true,
		basePower: 85,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	stoneedge: {
		inherit: true,
		accuracy: 85,
		basePower: 110,
		flags: {protect: 1, mirror: 1, slicing: 1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Sliced by Stone Edge! ",
	},
	strength: {
		inherit: true,
		basePower: 120,
        self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		desc: "Lowers the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
	},
	stringshot: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, bullet: 1},
	},
	struggle: {
        inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			this.add('-activate', pokemon, move.name);
		},
        activate: "  This is the only thing it can do! ",
	},
	submission: {
		inherit: true,
		accuracy: 100,
		basePower: 100,
	},
	suckerpunch: {
		inherit: true,
		priority: 2,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		desc: "Fails if the target did not select a physical attack, special attack, or Me First for use this turn, or if the target moves before the user.",
		shortDesc: "Nearly always goes first. Fails if target isn't attacking.",
	},
	superpower: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Devastated by Superpower! ",
	},
	surf: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Soaked by Surf! ",
	},
	swallow: {
		inherit: true,
		onHit(pokemon) {
			const healAmount = [0.25, 0.5, 0.75];
			const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[(pokemon.volatiles['stockpile'].layers - 1)]));
			if (!success) this.add('-fail', pokemon, 'heal');
			return success || this.NOT_FAIL;
		},
		desc: "The user restores its HP based on its Stockpile count. Restores 1/4 of its maximum HP if it's 1, 1/2 of its maximum HP if it's 2, and 3/4 of its HP if it's 3, all rounded half down. Fails if the user's Stockpile count is 0.",
		shortDesc: "Heals the user based on uses of Stockpile.",
	},
	swift: {
		inherit: true,
		priority: 1,
		desc: "This move does not check accuracy.",
		shortDesc: "Does not check accuracy. Hits foes. +1 priority.",
	},
	takeheart: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.boost({spa: 1, spd: 1, def: 1});
			return pokemon.cureStatus() || success;
		},
		type: "Fairy",
        desc: "The user cures its non-volatile status condition. Raises the user's Defense, Special Attack and Special Defense by 1 stage.",
		shortDesc: "Cures user's status, raises Def, Sp. Atk, Sp. Def by 1.",
	},
	tarshot: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, bullet: 1},
	},
	technoblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	terablast: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
				move.category = 'Physical';
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. If the user is Terastallized this move's type becomes the same as the user's Tera Type.",
		shortDesc: "Phys if Atk > SpA. If Terastallized type = Tera.",
	},
	thrash: {
		num: 37,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Thrash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "randomNormal",
		type: "Normal",
		contestType: "Tough",
        desc: "Has a 30% chance to confuse the target.",
		shortDesc: "30% chance to confuse the target.",
	},
	thunder: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Thunder Detonated with a Boom! ",
	},
	thunderbolt: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Zapped by Thunderbolt! ",
	},
	thunderfang: {
		inherit: true,
		accuracy: 100,
		basePower: 80,
	},
	thunderouskick: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	thunderpunch: {
		inherit: true,
		basePower: 85,
	},
	toxicthread: {
		num: 564,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Toxic Thread",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('stickyweb');
				}
                for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('toxicspikes');
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: {boost: {spe: 1}},
		contestType: "Tough",
        desc: "Sets Sticky web and 1 layer of toxic spikes on the target's side.",
		shortDesc: "Sets Sticky web and 1 layer of toxic spikes.",
	},
	triplearrows: {
		inherit: true,
		accuracy: 100,
		flags: {protect: 1, mirror: 1, kick: 1},
	},
	tripleaxel: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	tripledive: {
		inherit: true,
		basePower: 35,
	},
	triplekick: {
		inherit: true,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	tropkick: {
		inherit: true,
		basePower: 90,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
	},
	twinbeam: {
		inherit: true,
		basePower: 50,
	},
	twineedle: {
		inherit: true,
		basePower: 50,
	},
	twister: {
		inherit: true,
		basePower: 60,
        onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'snow':
				move.basePower *= 2;
				break;
			}
			this.debug('BP: ' + move.basePower);
		},
		secondary: null,
        desc: "If the weather is Primordial Sea, Rain Dance, Hail, Snow, or Sandstorm this move's power is doubled. Power doubles if the target is using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop.",
		shortDesc: "2x power if used in sandstorm, hail, snow or rain.",
	},
	uturn: {
		inherit: true,
		basePower: 60,
	},
	veeveevolley: {
		num: 741,
		accuracy: true,
		basePower: 0,
		basePowerCallback(pokemon) {
			const bp = Math.floor((pokemon.happiness * 10) / 25) || 1;
			this.debug('BP: ' + bp);
			return bp;
		},
		category: "Special",
		name: "Veevee Volley",
		pp: 20,
		priority: 0,
		flags: {protect: 1},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	voltswitch: {
		inherit: true,
		basePower: 60,
	},
	volttackle: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
        activate: "  Slammed by Volt Tackle! ",
	},
	watergun: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	
	watershuriken: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.hasAbility('battlebond')) {
				return move.basePower + 5;
			}
			return move.basePower;
		},
	},
	wickedtorque: {
		num: 897,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Wicked Torque",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		secondary: {
			chance: 30,
			status: 'slp',
		},
		target: "normal",
		type: "Dark",
	},
	wildboltstorm: {
		inherit: true,
		accuracy: 95,
        onModifyMove(move) {
            if (this.field.isWeather(['raindance', 'primordialsea'])) {
				move.secondaries.push({
					chance: 50,
					status: 'par',
				});
                move.accuracy = true;
			}
		},
		secondary: {
			chance: 20,
			status: 'par',
		},
		desc: "Has a 20% chance to paralyze target's. If the weather is Rain, this move does not check accuracy and gains a +30% chance to paralyze.",
		shortDesc: "20% prz. Hits adjacent foes. Rain: Doesn't miss, +30% prz.",
	},
	wildcharge: {
		inherit: true,
		basePower: 110,
	},
	
	woodhammer: {
		inherit: true,
        onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.add('-activate', pokemon, move.name);
		},
		activate: "  Pounded by Wood Hammer! ",
	},
	xscissor: {
		inherit: true,
        critRatio: 2,
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
	},
	
	zenheadbutt: {
		inherit: true,
		accuracy: 100,
	},
	zippyzap: {
		num: 729,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Zippy Zap",
		pp: 10,
		priority: 2,
        willCrit: true,
		flags: {contact: 1, protect: 1},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
    
    //custom
    blazingmoonsault: {
		num: 696,
		accuracy: true,
		basePower: 180,
		category: "Physical",
		isNonstandard: "Past",
		name: "Blazing Moonsault",
		pp: 1,
		priority: 0,
		flags: {contact: 1},
		isZ: "inciniumz",
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
    lightofruin: {
		num: 617,
		accuracy: true,
		basePower: 200,
		category: "Special",
		isNonstandard: "Past",
		name: "Light of Ruin",
		pp: 1,
		priority: 0,
		flags: {},
        isZ: "eternalflower",
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
				def: -1,
				spa: -1,
				spd: -1,
				spe: -1,
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
    bestboisap: {
		num: -5,
		accuracy: true,
		basePower: 185,
		category: "Physical",
		isNonstandard: "Past",
		name: "Bestboi Sap",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "bestboiolite",
		secondary: {
			chance: 100,
			self: {
				onHit() {
					this.field.setTerrain('grassyterrain');
				},
			},
		},
        onHit(target, source) {
			if (target.hasType('Grass')) return null;
			target.addVolatile('leechseed', source);
		},
		target: "allAdjacentFoes",
		type: "Grass",
		contestType: "Cool",
		shortDesc: "Hits all foes. On hit sets grassy terrain and leech seeds the target(s)",
	},
    eruptingearth: {
		num: -6,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		name: "Erupting Earth",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: {
			chance: 10,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Beautiful",
        desc: "Has a 10% chance to lower the target's Attack by 1 stage.",
		shortDesc: "10% chance to lower the target's Atk by 1.",
	},
    synapticstatic: {
		num: -7,
		accuracy: 85,
		basePower: 110,
		category: "Special",
		name: "Synaptic Static",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
        desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to make the target flinch.",
	},
    mindcrush: {
		num: -8,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Mind Crush",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			boosts: {
				atk: -1,
				spd: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
        desc: "Lowers the user's Attack and Special Defense by 1 stage.",
		shortDesc: "Lowers the user's Atk and Sp. Def by 1.",
	},
    swarmsalvo: {
		num: -9,
		accuracy: 90,
		basePower: 60,
		category: "Special",
		name: "Swarm Salvo",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
        multihit: 2,
		multiaccuracy: true,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
        desc: "Hits twice, with each hit having a 10% chance to confuse the target. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "10% confuse. Hits 2 times, acuraccy is checked both times",
	},
    crystalcannon: {
		num: -10,
		accuracy: 80,
		basePower: 120,
		category: "Special",
		name: "Crystal Cannon",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Cool",
        desc: "Has a 10% chance to lower the targets Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the targets Sp. Def by 1.",
	},
    soulrend: {
		num: -11,
		accuracy: 85,
		basePower: 110,
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Soul Rend",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Beautiful",
        desc: "Deals damage to the target based on its Defense instead of Special Defense.",
        shortDesc: "Damages target based on Def, not Sp. Def.",
	},
    exorcism: {
		num: -12,
		accuracy: 100,
		basePower: 130,
		category: "Special",
		name: "Exorcism",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Ghost')) return;
			this.add('-fail', pokemon, 'move: Exorcism');
			this.attrLastMove('[still]');
			return null;
		},
		self: {
			onHit(pokemon) {
				pokemon.setType(pokemon.getTypes(true).map(type => type === "Ghost" ? "???" : type));
				this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Exorcism');
			},
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
        desc: "Fails unless the user is a Ghost type. If this move is successful and the user is not Terastallized, the user's Ghost type becomes typeless as long as it remains active.",
		shortDesc: "User's Ghost type beacomes typeless; Ghost only.",
		typeChange: "  [POKEMON] dispelled its spirit energy!",
	},
    beatdown: {
		num: -13,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Beat Down",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
        desc: "Lowers the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
	},
    coppermines: {
		num: -14,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Steel type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the opposing side if any opposing Pokemon uses Rapid Spin or Defog successfully, or is hit by Defog.",
		shortDesc: "Hurts foes on switch-in. Factors Steel weakness.",
		name: "Copper Mines",
        onPrepareHit(pokemon) {
            this.add('-anim', pokemon, 'Stealth Rock');
        },
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		sideCondition: 'gmaxsteelsurge',
		secondary: null,
		target: "foeSide",
		type: "Steel",
	},
    eclipse: {
		num: -15,
		accuracy: 85,
		basePower: 110,
		category: "Special",
		name: "Eclipse",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'slp',
		},
		target: "normal",
		type: "Dark",
		contestType: "Tough",
        desc: "Has a 10% chance to put the target to sleep",
		shortDesc: "10% chance to sleep the target",
	},
    tripledig: {
		num: -16,
		accuracy: 95,
		basePower: 35,
		category: "Physical",
		name: "Triple Dig",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 3,
		secondary: null,
		target: "normal",
		type: "Ground",
        desc: "Hits three times.",
		shortDesc: "Hits 3 times.",
	},
    /*steelblade: {
		num: -17,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Steelblade",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		secondary: null,
		onBasePower(basePower, source) {
			if (this.field.isTerrain('electricterrain')) {
				this.debug('steelblade electric terrain boost');
				return this.chainModify(1.5);
			}
		},
		target: "normal",
		type: "Steel",
	},*/
    pirouette: {
		num: -18,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Pirouette",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, dance: 1},
		boosts: {
			spa: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Fairy",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Cool",
        desc: "Raises the user's Special Attack and Speed by 1 stage.",
		shortDesc: "Raises the user's Sp. Atk and Spe by 1.",
	},
    pendulumswing: {
		num: -19,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Pendulum Swing",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'slp',
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Beautiful",
        shortDesc: "Causes the target to fall asleep.",
	},
    innerdragon: {
		num: -20,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Inner Dragon",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
        self: {
            onHit(source) {
                if (source.hasType('Dragon')) return false;
                if (!source.addType('Dragon')) return false;
                this.add('-start', source, 'typeadd', 'Dragon', '[from] move: Inner Dragon');
            },
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Clever",
        desc: "Causes the Dragon type to be added to the user, effectively making it have two or three types. If Trick-or-Treat or Forrest Curse adds a type to the target, it replaces the type added by this move. This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes.",
        shortDesc: "Adds the dragon type to the user. Phys if Atk > SpA.",
	},
    unknownpower: {
		num: -21,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Unknown Power",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        ignoreImmunity: {'Psychic': true},
        onEffectiveness(typeMod, target, type) {
			return 1;
		},
		secondary: null,
		target: "normal",
		type: "???",
		contestType: "Clever",
        shortDesc: "Always deals supereffective damge. Ignores immunity.",
	},
    rebound: {
        desc: "Deals damage to the last opposing Pokemon to hit the user with a physical or special attack this turn equal to 2 times the HP lost by the user from that attack, rounded down. If the user did not lose HP from that attack, this move deals 1 HP of damage instead. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical or special attack this turn.",
		shortDesc: "If hit by an attack, returns 2x damage.",
		num: -22,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			const lastDamagedBy = pokemon.getLastDamagedBy(true);
			if (lastDamagedBy !== undefined) {
				return (lastDamagedBy.damage * 2) || 1;
			}
			return 0;
		},
		category: "Physical",
		name: "Rebound",
		pp: 10,
		priority: -6,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTry(source) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (lastDamagedBy === undefined || !lastDamagedBy.thisTurn) return false;
		},
		onModifyTarget(targetRelayVar, source, target, move) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (lastDamagedBy) {
				targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot);
			}
		},
		secondary: null,
		target: "scripted",
		type: "Psychic",
		contestType: "Cool",
	},
    drizzledance: {
        desc: "If this move is successful, the effect of Rain Dance begins.",
        shortDesc: "Starts Rain Dance",
		num: -23,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Drizzle Dance",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, dance: 1},
		secondary: {
            onHit(source) {
				this.field.setWeather('raindance');
			},
        },
		target: "normal",
		type: "Water",
	},
    sonicslash: {
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let ratio = Math.floor(pokemon.getStat('spe') / target.getStat('spe'));
			if (!isFinite(ratio)) ratio = 0;
			let bp = 80;
			if (ratio >= 3) {
				bp = 140;
			} else if (ratio >= 2) {
				bp = 120;
			}
			this.debug(`${bp} bp`);
			return bp;
		},
		category: "Physical",
		name: "Sonic Slash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		target: "normal",
		type: "Flying",
		zMove: {basePower: 160},
		maxMove: {basePower: 140},
		desc: "The power of this move depends on (user's current Speed / target's current Speed), rounded down. Power is equal to 140 if the result is 3 or more, 120 if 2, 80 if less than 2. If the target's current Speed is 0, this move's power is 80.",
		shortDesc: "140 BP if 3x target's speed; 120 BP if 2x; else 80 BP.",
		num: -24,
	},
    metalfang: {
		num: -25,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Metal Fang",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
        desc: "Has a 30% chance to lower the target's Defense by 1 stage.",
		shortDesc: "30% chance to lower the target's Def by 1.",
	},
    aquafang: {
		num: -26,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Aqua Fang",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
        desc: "Has a 30% chance to lower the target's Attack by 1 stage.",
		shortDesc: "30% chance to lower the target's Atk by 1.",
	},
    gnashteeth: {
		num: -27,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Gnash Teeth",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
		},
        self: {
			onHit(source) {
				source.addVolatile('gnashteeth');
			},
		},
		condition: {
			noCopy: true,
			onStart(target, source, effect) {
				this.effectState.layers = 1;
				if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) {
					this.add('-start', target, 'move: Gnash Teeth');
				}
			},
			onRestart(target, source, effect) {
				this.effectState.layers++;
				if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) {
					this.add('-start', target, 'move: Gnash Teeth');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + this.effectState.layers;
			},
		},
		secondary: null,
		target: "self",
		type: "Dark",
		zMove: {boost: {atk: 1}},
		contestType: "Cute",
        desc: "Raises the user's Attack and Critical Radio by 1 stage.",
		shortDesc: "Raises the user's Atk and Crit Radio by 1.",
	},
    shieldbash: {
		num: -28,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Shield Bash",
        overrideOffensiveStat: 'def',
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Steel",
        desc: "Damage is calculated using the user's Defense stat as its Attack, including stat stage changes. Other effects that modify the Attack stat are used as normal.",
		shortDesc: "Uses user's Def stat as Atk in damage calculation.",
	},
    grassymaw: {
		num: -29,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Grassy Maw",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Bug') return 1;
		},
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
        desc: "This move's type effectiveness against Bug is changed to be super effective no matter what this move's type is.",
		shortDesc: "Super effective on Bug.",
	},
    seasonstrike: {
		num: -30,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Season Strike",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		target: "normal",
		type: "Normal",
        onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Sawsbuck':
				move.type = 'Fairy';
				break;
			case 'Sawsbuck-Summer':
				move.type = 'Fire';
				break;
			case 'Sawsbuck-Autumn':
				move.type = 'Dark';
				break;
            case 'Sawsbuck-Winter':
				move.type = 'Ice';
				break;
			}
		},
		contestType: "Beautiful",
        desc: "If this pokemon is Sawsbuck this move's type changes to match its form. Fairy type for Spring, Fire type for Summer, Dark type for Autumn, and Ice type for Winter.",
		shortDesc: "Type depends on users form.",
	},
    drainingshock: {
		num: -31,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Draining Shock",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1, bite: 1},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
        desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
	},
    dualslash: {
		num: -32,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Dual Slash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Dragon",
		maxMove: {basePower: 130},
		contestType: "Tough",
        desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn.",
	},
    rocketpunch: {
		num: -33,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		name: "Rocket Punch",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, punch: 1},
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
        shortDesc: "No additional effect.",
	},
    bladeslash: {
		num: -34,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Bladeslash",
		pp: 10,
		priority: 0,
        critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
        desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
	},
    chromaticblast: {
		num: -35,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Chromatic Blast",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, bullet: 1},
		onModifyType(move, pokemon) {
			let type = pokemon.getTypes()[0];
			if (type === "Bird") type = "???";
			move.type = type;
		},
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
        desc: "This move's type depends on the user's primary type. If the user's primary type is typeless, this move's type is the user's secondary type if it has one, otherwise the added type from Forest's Curse or Trick-or-Treat. This move is typeless if the user's type is typeless alone.",
		shortDesc: "Type varies based on the user's primary type.",
	},
    cretaceouscrunch: {
		num: -36,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Cretaceous Crunch",
		pp: 10,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
        desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to make the target flinch.",
	},
    arourawave: {
		num: -37,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Aroura Wave",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        onTry() {
			return this.field.isWeather(['hail', 'snow']);
		},
        self: {
			sideCondition: 'auroraveil',
		},
        secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
        desc: "Fails unless the weather is Hail or Snow. Summons Aurora Veil for 5 turns upon use.",
		shortDesc: "Summons Aurora Veil. Snow/Hail only.",
        start: "#auroraveil",
        end: "#auroraveil",
        
	},
    sirenscall: {
        num: -38,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Siren's Call",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
        secondary: {
			chance: 100,
			volatileStatus: 'attract',
		},
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
        desc: "Causes the target to become infatuated, making it unable to attack 50% of the time. The effect ends when either the user or the target is no longer active. Pokemon with the Oblivious Ability or protected by the Aroma Veil Ability are immune.",
		shortDesc: "A target gets infatuated.",
	},
    infernoslam: {
		num: -39,
		accuracy: 90,
		basePower: 120,
		category: "Physical",
		name: "Inferno Slam",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: {
			chance: 30,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
        desc: "Has a 30% chance to lower the target's Defense by 1 stage.",
		shortDesc: "30% chance to lower the target's Def by 1.",
	},
    mysticalblaze: {
		num: -40,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		name: "Mystical Blaze",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Beautiful",
        desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn the target.",
	},
    spikewallbarrage: {
		num: -41,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Spikewall Barrage",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Tough",
        desc: "Has a 100% chance to raise the user's Defence by 1 stage.",
		shortDesc: "100% chance to raise the user's Def by 1.",
	},
    torrentialslash: {
		num: -42,
		accuracy: 90,
		basePower: 95,
		category: "Physical",
		name: "Torrential Slash",
		pp: 5,
		priority: 0,
        critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
        desc: "Has a higher chance for a critical hit..",
		shortDesc: "High critical hit ratio.",
	},
    flamequake: {
		num: -43,
		accuracy: 85,
		basePower: 110,
		category: "Physical",
		name: "Flame Quake",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "allAdjacent",
		type: "Fire",
		contestType: "Tough",
        desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn adjacent Pokemon.",
	},
    vinewhirl: {
		num: -44,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Vine Whirl",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Clever",
        desc: "Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.",
		shortDesc: "Prevents the target from switching out.",
	},
    teraquakerampage: {
		num: -45,
		accuracy: 95,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
		category: "Physical",
		name: "Teraquake Rampage",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: 3,
		multiaccuracy: true,
		secondary: null,
		target: "allAdjacent",
		type: "Ground",
		zMove: {basePower: 120},
		maxMove: {basePower: 140},
        desc: "Hits three times. Power increases to 40 for the second hit and 60 for the third. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit three times.",
		shortDesc: "Hits adjacent. 3 hits; each can miss, but power rises.",
	},
    imperialtorrent: {
		num: -46,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Imperial Torrent",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
        desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
	},
    swiftblaze: {
		num: -47,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Swift Blaze",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'swiftblaze',
		condition: {
			onStart(pokemon, source, effect) {
				this.add('-start', pokemon, 'Swift Blaze');
			},
			onRestart(pokemon, source, effect) {
				this.add('-start', pokemon, 'Swift Blaze');
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('swift blaze boost');
					return this.chainModify(2);
				}
			},
			onMoveAborted(pokemon, target, move) {
				if (move.type === 'Fire' && move.id !== 'swiftblaze') {
					pokemon.removeVolatile('swiftblaze');
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.type === 'Fire' && move.id !== 'swiftblaze') {
					pokemon.removeVolatile('swiftblaze');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Swift Blaze', '[silent]');
			},
		},
		boosts: {
			spe: 2,
		},
		secondary: null,
		target: "self",
		type: "Fire",
		zMove: {boost: {atk: 2, spa: 2}},
		contestType: "Clever",
        desc: "Raises the user's Speed by 2 stages. The user's next Fire-type attack will have its power doubled; the effect ends when the user is no longer active, or after the user attempts to use any Fire-type move besides Swift Blaze, even if it is not successful.",
		shortDesc: "+2 Spe, user's next Fire move 2x power.",
	},
    verdantblade: {
		num: -48,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Verdant Blade",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		critRatio: 2,
		secondary: {
			chance: 100,
            onHit(target, source, move) {
				if (target.getMoveHitData(move).crit) {
					this.field.setTerrain('grassyterrain');
				}
			},
		},
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
        desc: "Has a higher chance for a critical hit. If this move results in a critial hit, the terrain becomes Grassy Terrain.",
		shortDesc: "High critical hit ratio; If crit summons Grassy Terrain.",
	},
    blazingkickstorm: {
		num: -49,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Blazing Kickstorm",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, kick: 1},
		critRatio: 2,
		secondary: {
			chance: 100,
            onHit(target, source, move) {
				if (target.getMoveHitData(move).crit) {
					target.trySetStatus('brn', source, move);
				}
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
        desc: "Has a higher chance for a critical hit. If this move results in a critial hit, the target is burned.",
		shortDesc: "High critical hit ratio; If crit burns the target.",
	},
    mudsurge: {
		num: -50,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Mud Surge",
		pp: 10,
		priority: 0,
        critRatio: 2,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
            onHit(target, source, move) {
				if (target.getMoveHitData(move).crit) {
                    target.addVolatile('partiallytrapped', source, this.dex.getActiveMove('Mud Surge'));
				}
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Clever",
        desc: "Has a higher chance for a critical hit. If this move results in a critial hit, prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Mortal Spin, Rapid Spin, or Substitute successfully. This effect is not stackable or reset by using this or another binding move.",
		shortDesc: "High crit rate. If crit; traps and damages for 4-5 turns.",
        
        start: "  [POKEMON] became stuck in thick mud!",
	},
    naturesveil: {
		num: -51,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Nature's Veil",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
        self: {
			sideCondition: 'safeguard',
		},
		boosts: {
			def: 1,
			spd: 1,
		},
		secondary: null,
		target: "adjacentAllyOrSelf",
		type: "Grass",
		zMove: {boost: {spa: 1, atk: 1}},
		contestType: "Beautiful",
        desc: "Raises the target's Defense and Special Defense by 1 stage.  Summons Safeguard for 5 turns upon use.",
		shortDesc: "+1 Def and Sp. Def to target. Summons Safeguard.",
	},
    riptidejaw: {
		num: -52,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Riptide Jaw",
		pp: 10,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
            onHit(target, source, move) {
                target.addVolatile('partiallytrapped', source, this.dex.getActiveMove('Riptide Jaw'));
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
		shortDesc: "Traps the target in a whirlpool",
        
        start: "  [POKEMON] became trapped in the vortex!",
	},
    volcanicsurge: {
		num: -53,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Volcanic Surge",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onBasePower(basePower, pokemon, target) {
			if (pokemon.hp * 2 < pokemon.maxhp) {
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Tough",
        desc: "Power doubles if the user has less than half of its maximum HP remaining.",
		shortDesc: "Power doubles if the user's HP is less than 50%.",
	},
    hydrotorrent: {
		num: -54,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Hydro Torrent",
		pp: 10,
		priority: 0,
        critRatio: 2,
		flags: {protect: 1, mirror: 1, bullet: 1, distance: 1},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Tough",
        desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
	},
    drainingbloom: {
		num: -55,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Draining Bloom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
            onHit(target, source) {
                if (target.hasType('Grass')) return null;
                target.addVolatile('leechseed', source);
            },
		},
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
        desc: "Has a 30% chance to summons Leech Seed on the foe.",
		shortDesc: "30% chance to summons Leech Seed.",
	},
    wildfiretempest: {
		num: -52,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Wildfire Tempest",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, wind: 1},
		secondary: {
			chance: 30,
            onHit(target, source, move) {
                target.addVolatile('partiallytrapped', source, this.dex.getActiveMove('Wildfire Tempest'));
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Clever",
        desc: "Has a 30% chance to prevent the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Mortal Spin, Rapid Spin, or Substitute successfully. This effect is not stackable or reset by using this or another binding move.",
		shortDesc: "30% chance to traps and damage the target for 4-5 turns.",
        
        start: "  [POKEMON] became trapped in the fiery tempest!",
	},
    skyshatter: {
		num: -53,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Skyshatter",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
        shortDesc: "No additional effect.",
	},
    obsidianstonestorm: {
		num: -54,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Obsidian Stonestorm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "allAdjacentFoes",
		type: "Rock",
		contestType: "Cool",
        desc: "Has a 50% chance to raise the user's Defense by 1 stage for each target hit.",
        shortDesc: "50% chance to raise user's Def by 1 for each hit.",
	},
    draconicskyrend: {
		num: -55,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		name: "Draconic Skyrend",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		secondary: {
			chance: 100,
            onHit(target, source, move) {
                this.field.clearWeather();
			},
		},
		target: "any",
		type: "Flying",
		contestType: "Cool",
        shortDesc: "Clears any active weather",
	},
    psyonicslam: {
		num: -56,
		accuracy: 95,
		basePower: 105,
		category: "Physical",
		name: "Psyonic Slam",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
        desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
	},
    sandstormsurge: {
        desc: "If this move is successful, the effect of Sandstorm begin.",
        shortDesc: "Starts Sandstorm",
		num: -57,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Sandstorm Surge",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
            onHit(source) {
				this.field.setWeather('sandstorm');
			},
        },
		target: "normal",
		type: "Ground",
	},
    oblivionbreath: {
		num: -58,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Oblivion Breath",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
	},
    draconictyphoon: {
		num: -59,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Draconic Typhoon",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		secondary: {
			chance: 100,
            onHit(target, source, move) {
                target.addVolatile('partiallytrapped', source, this.dex.getActiveMove('Draconic Typhoon'));
			},
		},
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. Traps the target in a whirlpool",
		shortDesc: "Phys if Atk > Sp.Atk. Traps the target in a whirlpool",
        
        start: "  [POKEMON] became trapped in the vortex!",
	},
    aerocrash: {
		num: -60,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Aero Crash",
		pp: 15,
		priority: 0,
        critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		recoil: [33, 100],
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
        desc: "Has a higher chance for a critical hit. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "High critical hit ratio. Has 33% recoil.",
	},
    fossilscythe: {
		num: -61,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		name: "Fossil Scythe",
		pp: 10,
		priority: 0,
        critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Cool",
        desc: "Has a higher chance for a critical hit and has a 50% chance to lower the target's Defense by 1 stage.",
		shortDesc: "High critical hit ratio. 50% chance to lower the target's Def by 1.",
	},
    helixtorrent: {
		num: -62,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Helix Torrent",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
        desc: "Has a 10% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "10% chance to raise all stats by 1 (not acc/eva).",
	},
    petrifingvine: {
		num: -63,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Petrifing Vine",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Grass",
		contestType: "Tough",
        desc: "Has a 100% chance to paralyze the target.",
		shortDesc: "100% chance to paralyze the target.",
	},
    paleozoicpiercer: {
		num: -64,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Paleozoic Piercer",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        onBasePower(basePower, target, source, move) {
			if (target?.statsRaisedThisTurn) {
				this.debug('lashout buff');
				return this.chainModify(2);
			}
		},
		target: "normal",
		type: "Bug",
		contestType: "Tough",
        desc: "Power doubles if the target had a stat stage raised this turn.",
		shortDesc: "2x power if the target had a stat raised this turn.",
	},
    craniumcrash: {
		num: -65,
		accuracy: 90,
		basePower: 120,
		category: "Physical",
		name: "Cranium Crash",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
        desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to make the target flinch.",
	},
    ironfortress: {
		num: -66,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Iron Fortress",
		pp: 5,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
        boosts: {
			def: 1,
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		secondary: null,
		target: "self",
		type: "Steel",
		zMove: {boost: {def: 1}},
		contestType: "Cool",
        desc: "Raises the user's Defense by 1 stages. The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.",
		shortDesc: "+1 Def. Prevents moves from affecting the user this turn.",
	},
    stonetorrent: {
		num: -67,
		accuracy: 100,
		basePower: 105,
		category: "Physical",
		name: "Stone Torrent",
		pp: 10,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		priority: 0,
		secondary: null,
		target: "any",
		type: "Water",
		zMove: {basePower: 170},
		contestType: "Tough",
	},
    victorywing: {
		num: -68,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Victory Wing",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1, heal: 1, contact: 1},
		drain: [1, 2],
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
        desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
	},
    sonicecho: {
		num: -69,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Sonic Echo",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1, sound: 1, bypasssub: 1},
		multihit: 2,
		secondary: null,
		target: "allAdjacent",
		type: "Flying",
		contestType: "Cool",
		shortDesc: "Hits 2 times",
	},
    glacialcataclysm: {
		num: -70,
		accuracy: 85,
		basePower: 130,
		category: "Special",
		name: "Glacial Cataclysm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		secondary: {
			chance: 20,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
        desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. Has a 20% chance to freeze the target. ",
		shortDesc: "20% chance to freeze the target. Phys if Atk > Sp. Atk.",
	},
    arcticgale: {
		num: -71,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Arctic Gale",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, wind: 1},
		secondary: {
			chance: 30,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
        desc: "Has a 30% chance to freeze the target.",
		shortDesc: "30% chance to freeze the target.",
	},
    voltagesurge: {
		num: -72,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Voltage Surge",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
        desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
	},
    infernocyclone: {
		num: -73,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Inferno Cyclone",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, wind: 1},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
        desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn the target.",
	},
    stormboundroar: {
		num: -74,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Stormbound Roar",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		secondary: {
			chance: 30,
			boosts: {
				atk: -1,
                spa: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Electric",
		contestType: "Cool",
        desc: "Has a 30% chance to lower the target's Attack and Special Attack by 1 stage.",
		shortDesc: "30% chance to lower the foe(s) Atk and Sp. Atk by 1.",
	},
    eruptingroar: {
		num: -75,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Erupting Roar",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		secondary: {
			chance: 30,
			boosts: {
				def: -1,
                spd: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Cool",
        desc: "Has a 30% chance to lower the target's Defence and Special Defence by 1 stage.",
		shortDesc: "30% chance to lower the foe(s) Def and Sp. Def by 1.",
	},
    crystalineroar: {
		num: -76,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Crystaline Roar",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		secondary: {
			chance: 30,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Cool",
        desc: "Has a 30% chance to lower the target's Speed by 1 stage.",
		shortDesc: "30% chance to lower the foe(s) Speed by 1.",
	},
    temporalblossom: {
		num: -77,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		name: "Temporal Blossom",
		pp: 5,
		priority: 0,
		flags: {},
		isFutureMove: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'temporalblossom',
				source: source,
				moveData: {
					id: 'temporalblossom',
					name: "Temporal Blossom",
					accuracy: 100,
					basePower: 140,
					category: "Special",
					priority: 0,
					flags: {},
					effectType: 'Move',
					isFutureMove: true,
					type: 'Grass',
                    onDamage() {
                        this.add('-message', `The attack from the past landed!`);
                    },
				},
			});
			//this.add('-start', source, 'move: Temportal Blossom');
            this.add('-message', `${source.name} strikes into the future!`);
			return this.NOT_FAIL;
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
        desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if another future move is in effect for the target's position.",
		shortDesc: "Hits two turns after being used.",
		start: "  [POKEMON] strikes into the future!",
		activate: " [TARGET] was attacked from the past!",
	},
    stonefragmentation: {
		num: -78,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stone Fragmentation",
		pp: 5,
		priority: 0,
		flags: {snatch: 1},
        onTry(source) {
			if (source.hp <= source.maxhp / 4 || source.maxhp === 1) return false;
		},
		onHit(pokemon) {
			this.directDamage(pokemon.maxhp / 4);
		},
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('stealthrock');
				}
			},
		},
		secondary: null,
        boosts: {
			atk: 2,
			spe: 3,
		},
		target: "self",
		type: "Rock",
		zMove: {boost: {atk: 1}},
		contestType: "Cool",
        Desc: "Sets Stealth Rock on the target's side. The user loses 1/4 of its maximum HP, rounded down. Riases the users Attack and Speed by 2,",
        shortDesc: "Foe: Set Rocks. Self: -25% HP, +2 Spe, +2 Atk.",
	},
    absolutezero: {
		num: -79,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Absolute Zero",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
        onEffectiveness(typeMod, target, type) {
			if (type === 'Fire') return 1;
		},
		secondary: {
			chance: 100,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
        desc: "Has a 100% chance to freeze the target. This move's type effectiveness against Fire is changed to be super effective no matter what this move's type is.",
		shortDesc: "100% chance to freeze. Super effective on Fire.",
	},
    metalsurge: {
		num: -80,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Metal Surge",
        overrideOffensiveStat: 'def',
        onModifyMove(move, pokemon) {
			const def = pokemon.getStat('def', true, true);
			const spd = pokemon.getStat('spd', true, true);
			if (def > spd) {
				overrideOffensiveStat: 'def';
			} else {
				overrideOffensiveStat: 'spd';
			}
		},
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Steel",
        contestType: "Clever",
        desc: "Damage is calculated using the higher of the user's Defense or Special Defence stat as its Attack, including stat stage changes. Other effects that modify the Attack stat are used as normal.",
		shortDesc: "Uses highest Def stat as Atk in damage calculation.",
	},
    starfall: {
		num: -81,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		name: "Starfall",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Fairy",
		contestType: "Beautiful",
        desc: "Lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2. Hits foe(s).",
	},
    primordialtusks: {
		num: -82,
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		name: "Primordial Tusks",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: null,
        ignoreImmunity: {'Ground': true},
		target: "normal",
		type: "Ground",
		contestType: "Tough",
        desc: "This move can hit airborne Pokemon, which includes Flying-type Pokemon, Pokemon with the Levitate Ability, Pokemon holding an Air Balloon, and Pokemon under the effect of Magnet Rise or Telekinesis.",
		shortDesc: "Hits Flying Pokemon.",
	},
    psychelullaby: {
		num: -83,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Psyche Lullaby",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		secondary: {
			chance: 30,
			status: 'slp',
		},
		target: "allAdjacentFoes",
		type: "Psychic",
		contestType: "Clever",
        desc: "Has a 30% chance to put the target to sleep",
		shortDesc: "30% chance to sleep the foe(s)",
	},
    gloomspores: {
		num: -84,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		name: "Gloom Spores",
		pp: 10,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
        secondary: {
			chance: 100,
			status: 'slp',
            volatileStatus: 'confusion',
		},
        onHit(target, source) {
			if (target.hasType('Grass')) return null;
			target.addVolatile('leechseed', source);
		},
		target: "allAdjacentFoes",
		type: "Grass",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Clever",
        desc: "This move summons Leech Seed on the foe, causes them target to become confused, and influcts sleep.",
		shortDesc: "Hits Foe(s). Sets Leech Seed, Confusion, Sleep",
	},
    ephemeralphantasma: {
		num: -85,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Ephemeral Phantasma",
		pp: 15,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
        desc: "No additional effect.",
		shortDesc: "Usually goes first.",
	},
    fablebreaker: {
		num: -86,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Fable Breaker",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Fairy') return 1;
		},
		target: "normal",
        secondary: null,
		type: "Bug",
		contestType: "Beautiful",
        desc: "This move's type effectiveness against Fairy is changed to be super effective no matter what this move's type is.",
		shortDesc: "Super effective on Fairy.",
	},
    ferromagneticfissure: {
		num: -87,
		accuracy: 80,
		basePower: 120,
		category: "Special",
		name: "Ferromagnetic Fissure",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: null,
        onModifyMove(move, source, target) {
			if (target.hasType('Steel')) {
				move.accuracy = true;
			}
		},
		target: "normal",
		type: "Ground",
		contestType: "Beautiful",
        desc: " If the target is a steel type, this move does not check accuracy.",
		shortDesc: "Can't miss steel types.",
	},
    // Just wanna say I started using ChatGPT from here on out and it fucking works!
    draconiceclipse: {
        num: -88,
        accuracy: 95,
        basePower: 100,
        category: "Physical",
        name: "Draconic Eclipse",
        pp: 5,
        flags: {contact: 1, protect: 1, mirror: 1},
        priority: 0,
        type: "Dark",
        target: "normal",
        secondary: {
            chance: 10,
            status: 'slp',
        },
        shortDesc: "10% chance to put the target to sleep.",
        desc: "Has a 10% chance to put the target to sleep.",
        contestType: "Clever",
    },
    metallicgearwheel: {
        num: -89,
        accuracy: 90,
        basePower: 20,
        basePowerCallback(pokemon, target, move) {
            return move.hit * 20;
        },
        category: "Physical",
        name: "Metallic Gearwheel",
        pp: 10,
        flags: {contact: 1, protect: 1, mirror: 1},
        priority: 0,
        type: "Steel",
        target: "normal",
        multihit: 3,
        secondary: {
            chance: 10,
            status: 'par',
        },
        multiaccuracy: true,
        contestType: "Cool",
        shortDesc: "3 Hits. Each can miss, but power rises. 10% Prz. ",
        desc: "Hits 3 times. Each hit gains +20 power, and there's a 10% chance to paralyze the target with each hit. Each hit checks accuracy seperatly",
    },
    glacialcannonade: {
        num: -90,
        accuracy: 95,
        basePower: 20,
        category: "Special",
        name: "Glacial Cannonade",
        pp: 30,
        flags: {distance: 1, protect: 1, mirror: 1, bullet: 1},
        priority: 0,
        type: "Ice",
        target: "allAdjacentFoes",
        multihit: [2, 5],
        secondary: {
            chance: 5,
            status: 'frz',
        },
        shortDesc: "Hits foe(s) 2-5 times. 5% frz chance each hit.",
        desc: "Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times. Each hit has a 5% chance to freeze the target.",
        contestType: "Beautiful",
    },
    gigawattwallop: {
        num: -91,
        accuracy: 90,
        basePower: 130,
        category: "Physical",
        name: "Gigawatt Wallop",
        pp: 5,
        flags: {contact: 1, mirror: 1, protect: 1},
        priority: 0,
        type: "Electric",
        target: "normal",
        secondary: {
            chance: 10,
            status: 'par',
        },
        recoil: [33, 100],
        desc: "Has a 10% chance to paralyze the target. If the target lost HP, the user takes recoil damage equal to 33% of the HP lost by the target, rounded half up, but not less than 1 HP.",
        shortDesc: "Has 33% recoil. 10% chance to paralyze.",
        contestType: "Cool",
    },
    abyssalray: {
        num: -92,
        accuracy: 90,
        basePower: 130,
        category: "Special",
        name: "Abyssal Ray",
        pp: 5,
        flags: {mirror: 1, protect: 1},
        priority: 0,
        type: "Dark",
        target: "normal",
        ignoreDefensive: true,
        ignoreEvasion: true,
        self: {
            boosts: {
                spa: -2,
            },
        },
        desc: "Ignores the target's stat stage changes, including evasiveness. Lowers the user's Special Attack by 2 stages.",
        shortDesc: "Ignores target's stats, lowers user's SpA by 2.",
        contestType: "Tough",
    },
    solarburst: {
        num: -93,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Solar Burst",
        pp: 5,
        flags: {charge: 1, protect: 1, mirror: 1},
        priority: 0,
        type: "Fire",
        target: "normal",
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, "Solar Beam");
            this.boost({spa: 1, spd: 1, spe: 1}, attacker, attacker, move);
            if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
                this.attrLastMove('[still]');
                return;
            }
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        secondary: null,
        shortDesc: "Turn 1; +1 SpA/SpD/Spe. Turn 2 hits. No charge in sun.",
        desc: "This attack charges on the first turn, raising the user's Special Attack, Special Defense, and Speed, and then executes on the second. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.",
        contestType: "Beautiful",
    },
    titaniumstonestorm: {
        num: -94,
        accuracy: 85,
        basePower: 100,
        category: "Physical",
        name: "Titanium Stonestorm",
        pp: 5,
        flags: {protect: 1, mirror: 1},
        priority: 0,
        type: "Steel",
        target: "allAdjacentFoes",
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('titaniumstonestorm');
				}
			},
		},
		condition: {
			duration: 2,
			onSideStart(targetSide, target) {
				this.add('-sidestart', targetSide, 'Titanium Stonestorm');
                this.add('-message', `${target.name} whirled up a steelstorm!`);
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
				this.damage(target.baseMaxhp / 8, target);
                this.add('-message', `${target.name} is pummeled by metal scrap!`);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'Titanium Stonestorm');
			},
            onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
		},
        secondary: null,
        shortDesc: "Traps and damages foes for 1 turn.",
        desc: "The user creates a Titanium Stonestorm that traps and damages all adjacent foes for 1 turn.",
        contestType: "Cool",
    },
    feyknightsblade: {
        num: -95,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Fey Knight's Blade",
        pp: 5,
        flags: {protect: 1, mirror: 1, slicing: 1, contact: 1},
        priority: 0,
        type: "Fairy",
        target: "normal",
        multihit: 2,
        onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) < pokemon.getStat('spa', false, true)) move.category = 'Special';
		},
        onHit(target, source, move) {
            if (move.hit === 1) {
                this.add('-message', `${source.name} struck with Fairy-type power!`);
                move.type = 'Fighting'; // changes follow up hit to Fighting type
            } else {
                this.add('-message', `${source.name} struck with Fighting-type power!`);
            }
        },
        secondary: null,
        shortDesc: "Special if Atk > SpA. 1st hit is Fairy, 2nd is Fighting.",
        desc: "This move becomes a special attack if the user's Attack is less than its Special Attack, including stat stage changes. The user strikes twice in one turn. The first hit is Fairy type, and the second hit is Fighting type. A target immune to the first hit is immune to both.",
        contestType: "Beautiful",
    },
    neurotoxin: {
        num: -96,
        accuracy: 95,
        basePower: 100,
        category: "Special",
        name: "Neurotoxin",
        pp: 10,
        flags: {mirror: 1, protect: 1},
        priority: 0,
        type: "Poison",
        target: "normal",
        onHit(target, source, move) {
            this.damage(target.baseMaxhp / 8, target);
			for (const ally of target.adjacentAllies()) {
				this.damage(ally.baseMaxhp / 8, ally, source, this.dex.conditions.get('Neurotoxin'));
                this.add('-message', `The noxious spray hit ${target.name}!`);
			}
		},
		onAfterSubDamage(damage, target, source, move) {
            this.damage(target.baseMaxhp / 8, target);
			for (const ally of target.adjacentAllies()) {
				this.damage(ally.baseMaxhp / 8, ally, source, this.dex.conditions.get('Neurotoxin'));
                this.add('-message', `The noxious spray hit ${target.name}!`);
			}
		},
        secondary: {
			chance: 30,
			status: 'par',
		},
        shortDesc: "30% Prz. Damages Pokemon next to the target as well.",
        desc: "Deals 1/8th additional damage to the target and Pokémon adjacent to the target. Has a 30% chance to Paralyze the target.",
        contestType: "Clever",
    },
    flexup: {
        num: -97,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Flex Up",
        pp: 10,
        flags: {charge: 1},
        priority: 0,
        type: "Fighting",
        target: "self",
        onPrepareHit(pokemon) {
            this.add('-anim', pokemon, 'Geomancy');
        },
        onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		boosts: {
			atk: 2,
			def: 2,
			spe: 2,
		},
        secondary: null,
        shortDesc: "Charges, then +2 Atk, Def, Spe.",
        desc: "Raises the user's Attack, Defense, and Speed by 2 stages. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.",
        contestType: "Tough",
        zMove: {boost: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1}},
    },
    gracefulblitz: {
        num: -98,
        accuracy: true,
        basePower: 20,
        category: "Physical",
        name: "Graceful Blitz",
        pp: 10,
        flags: {contact: 1, mirror: 1, protect: 1},
        priority: 0,
        type: "Fighting",
        target: "normal",
        multihit: 3, // Hits 3 times
        multiaccuracy: true,
        onModifyMove(move, source) {
            if (source.getStat('spa', false, true) > source.getStat('atk', false, true)) {
                move.category = 'Special';
            }
        },
        basePowerCallback(pokemon, target, move) {
            return 20 * move.hit;
        },
        secondary: null,
        hortDesc: "3 Hits. +2OBP/hit-each can miss. Spec if SpA>Atk.",
        desc: "Hits 3 times. Each hit gains +20 power. Each hit checks accuracy seperatly. his move is Special if the user's Special Attack is higher than its Attack.",
        contestType: "Beutiful",
    },
    voltageoverload: {
        num: -99,
        accuracy: 100,
        basePower: 120,
        category: "Special",
        name: "Voltage Overload",
        pp: 5,
        flags: {protect: 1, mirror: 1, charge: 1},
        priority: 0,
        type: "Electric",
        target: "normal",
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            this.boost({spa: 1}, attacker, attacker, move);
            if (this.field.isTerrain('electricterrain')) {
                this.attrLastMove('[still]');
                this.addMove('-anim', attacker, move.name, defender);
                this.add('-message', `${attacker.name} absorbs electrical energy from the surrounding terrain!`);
                return;
            }
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        secondary: null,
        shortDesc: "+1 SpA on turn 1. Hits turn 2. No Charge in Electric Terrain.",
        desc: "The user charges power on the first turn, gaining +1 Special Attack. It hits the target on the second turn. There is no charge turn if Electric Terrain is active.",
        contestType: "Cool",
    },
    rocketblast: {
        num: -100,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Rocket Blast",
        pp: 10,
        flags: {protect: 1, mirror: 1, bullet: 1},
        priority: 0,
        type: "Steel",
        target: "normal",
        secondaries: [
            {
                chance: 100,
                self: {
                    boosts: {spe: 1},
                },
            },
            {
                chance: 20,
                status: 'brn',
            },
        ],
        shortDesc: "Raises user's Speed by 1. 20% chance to burn.",
        desc: "Raises the user's Speed by 1 stage. Has a 20% chance to burn the target.",
        contestType: "Cool",
    },
    foldedblade: {
        num: -101,
        accuracy: 100,
        basePower: 75,
        category: "Physical",
        name: "Folded Blade",
        pp: 10,
        flags: {protect: 1, mirror: 1, contact: 1, slicing: 1},
        priority: 0,
        type: "Steel",
        target: "normal",
        onEffectiveness(typeMod, target, type) {
            if (type === 'Steel') {
                return 1;
            }
        },
        shortDesc: "Supereffective vs Steel types.",
        desc: "This move's type effectiveness against Steel is changed to be super effective no matter what this move's type is.",
        contestType: "Cool",
    },
    devour: {
        num: -102,
        accuracy: 100,
        basePower: 75,
        category: "Physical",
        name: "Devour",
        pp: 20,
        flags: {protect: 1, mirror: 1, contact: 1, bite: 1, heal: 1},
        priority: 0,
        type: "Dark",
        target: "allAdjacent",
        drain: [3, 4],
        shortDesc: "Heals the user by 75% of the damage dealt.",
        desc: "Deals damage to all Adjacent pokemon and heals the user by 75% of the damage dealt.",
        contestType: "Tough",
    },
    venomousnova: {
        num: -103,
        accuracy: 95,
        basePower: 105,
        category: "Special",
        name: "Venomous Nova",
        pp: 5,
        flags: {protect: 1, mirror: 1},
        priority: 0,
        type: "Poison",
        target: "normal",
        secondary: {
            chance: 30,
            status: 'tox',
        },
        shortDesc: "30% chance to badly poison the target.",
        desc: "Has a 30% chance to badly poison the target.",
        contestType: "Clever",
    },
    wallup: {
        num: -104,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Wall Up",
        pp: 10,
        flags: {},
        priority: 2,
        type: "Rock",
        target: "self",
        boosts: {
            def: 1,
            spd: 1,
        },
        volatileStatus: 'followme',
        onPrepareHit(pokemon) {
            this.add('-anim', pokemon, 'Follow Me');
        },
        shortDesc: "+1 Def/SpD. Redirects all moves to the user this turn.",
        desc: "Redirects all moves to the user this turn. Raises the user's Defense and Special Defense by 1 stage.",
        contestType: "Tough",
    },
    boltedovergrowth: {
        num: -104,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Bolted Overgrowth",
        pp: 10,
        flags: {protect: 1, mirror: 1, contact: 1},
        priority: 0,
        type: "Grass",
        target: "normal",
        secondary: {
            chance: 10,
            status: "par",
        },
        basePowerCallback(source, target, move) {
            if (this.field.isTerrain('electricterrain') && target.isGrounded()) {
                if (!source.isAlly(target)) this.hint(`${move.name}'s BP is 1.5x on grounded target.`);
                return move.basePower * 1.5;
            }
            return move.basePower;
        },
        shortDesc: "10% chance to paralyze. +50% power on Electric Terrain.",
        desc: "Has a 10% chance to paralyze the target. If teh target is on Electric Terrain, this move gains +50% power.",
        contestType: "Beautiful",
    },
    lavalunge: {
        num: -105,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Lava Lunge",
        pp: 10,
        flags: {protect: 1, mirror: 1, contact: 1},
        priority: 0,
        type: "Fire",
        willCrit: true,
        secondary: null,
        shortDesc: "Always results in a critical hit.",
        contestType: "Cool",
    },
    purifyingcascade: {
        num: -106,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Purifying Cascade",
        pp: 10,
        flags: {mirror: 1, protect: 1},
        priority: 0,
        type: "Water",
        self: {
			onHit(source) {
				for (const ally of source.side.pokemon) {
					ally.cureStatus();
				}
			},
		},
        secondary: null,
        shortDesc: "Cures the user and allies' status conditions.",
        desc: "The user and its allies are cured of their status conditions.",
        contestType: "Beautiful",
    },
    hydroforge: {
        num: -107,
        accuracy: 90,
        basePower: 110,
        category: "Physical",
        name: "Hydroforge",
        pp: 10,
        flags: {mirror: 1, protect: 1, contact: 1},
        priority: 0,
        type: "Water",
        secondary: {
            chance: 30,
            status: "brn",
        },
        shortDesc: "30% chance to burn the target.",
        desc: "Has a 30% chance to burn the target.",
        contestType: "Beautiful",
    },
    curseofthemummy: {
        num: -108,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Curse of the Mummy",
        pp: 10,
        flags: {mirror: 1, protect: 1},
        priority: 0,
        type: "Ghost",
        onHit(target) {
			if (target.getAbility().isPermanent || target.ability === 'mummy') {
				return;
			}
            const oldAbility = target.setAbility('mummy');
			if (oldAbility) {
				this.add('-ability', target, 'Mummy', '[from] move: Curse of the Mummy');
				return;
			}
			return oldAbility as false | null;
		},
        shortDesc: "Target's ability becomes Mummy.",
        desc: "The target's ability is changed to Mummy. Cannot effect abilities that are marked as permanent.",
        contestType: "Clever",
    },
    venomousgemstorm: {
        num: -109,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Venomous Gemstorm",
        pp: 5,
        flags: {mirror: 1, protect: 1},
        priority: 0,
        type: "Rock",
        target: "allAdjacentFoes",
        secondary: {
            chance: 30,
            status: "tox",
        },
        shortDesc: "30% chance to badly poison the target(s).",
        desc: "Has a 30% chance to badly poison the target(s).",
        contestType: "Tough",
    },
    ghastlygrimoire: {
        num: -110,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Ghastly Grimoire",
        pp: 10,
        type: "Ghost",
        flags: {mirror: 1, protect: 1},
        priority: 0,
        target: "normal",
        volatileStatus: 'curse',
        onTryHit(target, source) {
            if (source.species.baseSpecies !== "Venomicon") {
                this.hint("Only a Pokemon whose base species is Venomicon can use this move.");
                this.add('-fail', source, "move: Ghastly Grimoire");
                this.attrLastMove('[still]');
                return null;
            }
        },
        onModifyMove(move, source) {
            if (source.species.forme === "Epilogue") {
                move.category = "Physical";
                move.flags.protect = null;
                delete move.volatileStatus;
            }
        },
        shortDesc: "Venomicon; Prologue: Curses. Epilogue: Phys, Ignore Protect.",
        desc: "Fails unless used by Venomicon. In Prologue forme, it curses the target. In Epilogue forme, the move becomes physical and bypasses Protect.",
        contestType: "Clever",
    },
    dreamboundsnare: {
        num: -111,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Dreambound Snare",
        pp: 10,
        flags: {protect: 1, mirror: 1},
        priority: 0,
        type: "Ghost",
        target: "normal",
        secondaries: [
            {
                chance: 100,
                onHit(target, source, move) {
                    if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
                },
            },
            {
                chance: 30,
                status: 'slp',
            },
        ],
        volatileStatus: 'nightmare',
        desc: "Traps the target, preventing them from switching. Has a 30% chance to inflict sleep. If the target is already asleep, inflicts the target with Nightmare.",
        shortDesc: "Traps target. 30% chance to sleep. Inflicts Nightmare.",
        contestType: "Clever",
    },
    slimewave: {
        num: -112,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Slime Wave",
        pp: 10,
        flags: {protect: 1, mirror: 1},
        priority: 0,
        type: "Dragon",
        target: "allAdjacentFoes",
        secondary: {
            chance: 100,
            boosts: {
                spe: -1,
            },
        },
        desc: "Lowers foe(s) Speed by 1 stage.",
        shortDesc: "Lowers the Speed of all adjacent foes by 1 stage.",
        contestType: "Cool",
    },
    pledgeplague: {
        num: -113,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Pledge Plague",
        pp: 10,
        flags: {protect: 1, mirror: 1},
        priority: 0,
        type: "Poison",
        onBasePower(basePower, pokemon, target) {
            if (target && (target.status === 'psn' || target.status === 'tox')) {
                return this.chainModify(2);
            }
        },
        onModifyMove(move, pokemon) {
            if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
                move.category = 'Physical';
            }
        },
        desc: "x2 power if target is PSN. Phys if Atk > SpA.",
        shortDesc: "Doubles power if the target is poisoned. Changes to Physical if the user's Atk > SpA.",
        contestType: "Clever",
    },

    
};
