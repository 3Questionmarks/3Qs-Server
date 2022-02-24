export const Abilities: {[abilityid: string]: ModdedAbilityData} = {
	// Coded
	absorptive: {
		num: 1001,
		name: "Absorptive",
		desc: "Draining moves restore 1.5x more HP than normal",
		onTryHealPriority: 1,
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain'];
			if (heals.includes(effect.id)) {
				return this.chainModify(1.5);
			}
		},
	},
	// Coded
	acrid: {
		num: 1002,
		name: "Acrid",
		desc: "Lowers an opponent's speed in switch-in",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Acrid', 'boost');
					activated = true;
				}
				if (target.volatiles['decoy']) {
					this.add('-immune', target);
				} else {
					this.boost({spe: -1}, target, pokemon, null, true);
				}
			}
		},
	},
	// Not Fully Implemented
	alchemy: {
		num: 1003,
		name: "Alchemy",
		desc: "When this pokemon attacks a Poisoned pokemon, it does a random effect from the list. (Replaces Poison with Fear, Curse, or Sleep; Inflicts the target with the Taunt, Torment, or Encore effect; Choosing 2 stats and lowering or raising each one by 1.)",
	},
	// Not Fully Implemented
	allseeingeye: {
		num: 1004,
		name: "All-Seeing Eye",
		desc: "Bypasses accuracy checks, but takes 15% more damage from attacks.",
	},
	// Not Fully Implemented
	almsgiver: {
		num: 1005,
		name: "Almsgiver",
		desc: "Upon switching out, if the incoming ally is not holding an item, they will recieve a copy of this Pokémon's item.",
	},
	// Coded
	amplify: {
		num: 1006,
		name: "Amplify",
		desc: "Increases power of pulse and sound moves by 1.3x.",
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound'] || moves.flags['pulse']) {
				this.debug('Amplify boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
	},
	// Not Fully Implemented
	arbiter: {
		num: 1007,
		name: "Arbiter",
		desc: "Extends the duration of Rules Rewrite by 2 turns when used by this pokemon.",
	},
	// Coded
	ataraxia: {
		num: 1008,
		name: "Ataraxia",
		desc: "Immune to moves' secondary effects",
		onModifySecondaries(secondaries) {
			this.debug('Ataraxia prevent secondary');
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
	},
	// Coded
	berserk: {
		num: 1009,
		name: "Berserker",
		desc: "This pokemon's attack is raised by 1 if it falls below 50% HP.",
		onAfterMoveSecondary(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({atk: 1});
			}
		},
	},
	// Coded
	bigbellied: { // implemented in Rice Field
		num: 1010,
		name: "Big Bellied",
		desc: "If rice feild is active when this pokemon switches in, it instatnly get's the healing without waiting for a countdown. Immune to rice feild damage.",
	},
	// Coded
	bingchilling: {
		num: 1011,
		name: "Bing Chilling",
		desc: "This Pokémon's Typless moves become Winter-type and gain a 1.2x. power boost. Existing Winter-type moves also get the power boost.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			// const noModifyType = [
			
			// ];
			if (move.type === 'Typeless' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Winter';
				move.bingChillingBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.bingChillingBoosted || move.type === "Winter") return this.chainModify([0x1333, 0x1000]);
		},
	},
	// Not Fully Implemented
	bipolar: {
		num: 1012,
		name: "Bipolar",
		desc: "Turns Storm-type moves into Serenity-type moves and Serenity-type moves into Storm-type moves, and boosts them by x1.2.",
	},
	// Not Fully Implemented
	blessed: {
		num: 1013,
		name: "Blessed",
		desc: "This Pokemon cannot be cursed, and is considered to have Serenity type as its secondary type.",
	},
	// Not Fully Implemented
	blightboost: {
		num: 1014,
		name: "Blight Boost",
		desc: "While this Pokemon is cursed, the power of its special attacks is multiplied by 1.5 and takes no HP loss from it.",
	},
	// Not Fully Implemented
	blindrage: {
		num: 1015,
		name: "Blind Rage",
		desc: "Hustle",
	},
	// Coded
	blossom: {
		num: 1016,
		name: "Blossom",
		desc: "The first time this pokemon uses a damaging Spring move, its attacking stats will be multiplied by 1.5x when using his next Spring moves.",
		onSourceHit(target, source, move) {
			if (!move || !target || move.type !== "Spring") return;
			if (target !== source && move.category !== 'Status') {
				source.addVolatile("blossom");
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Blossom');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Spring' && attacker.hasAbility('blossom')) {
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Spring' && attacker.hasAbility('blossom')) {
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Blossom', '[silent]');
			},
		},
	},
	// Not Fully Implemented
	burningrage: {
		num: 1017,
		name: "Burning Rage",
		desc: "Whenever this Pokemon has Sunburn, its highest attacking stat gains a 1.2x boost.",
	},
	// Not Fully Implemented
	burnout: {
		num: 1018,
		name: "Burnout",
		desc: "This Pokemon's moves that lower its stats have 1.3x power, but the amount the stat is lowered is doubled.",
	},
	// Not Fully Implemented
	celestial: {
		num: 1019,
		name: "Celestial",
		desc: "Status conditions are cured after 2 active turns. 1 for sleep.",
	},
	// Not Fully Implemented
	checkmate: {
		num: 1020,
		name: "Checkmate",
		desc: "If the enemy has 33% health or less, it is trapped and cannot escape.",
	},
	// Not Fully Implemented
	chill: {
		num: 1021,
		name: "Chill",
		desc: "Pokemon making contact with this pokemon have a 30% chance to be inflicted with chill.",
	},
	// Not Fully Implemented
	climaticchange: {
		num: 1022,
		name: "Climatic Change",
		desc: "Every Season type attack became the next one.(Spring become summer,summer become autumn,autumn become winter and winter become spring)",
	},
	// Coded
	contagious: {
		num: 1023,
		name: "Contagious",
		desc: "Contact moves used against this pokemon have a 25% chance to poison the one who made contact.",
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (this.randomChance(1, 4)) {
					source.trySetStatus('psn', target);
				}
			}
		},
	},
	// Coded
	contrary: {
		num: 1024,
		name: "Contrary",
		desc: "Inverts stat boosts",
		onBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostName;
			for (i in boost) {
				boost[i]! *= -1;
			}
		},
	},
	// Not Fully Implemented
	conversion: {
		num: 1025,
		name: "Conversion",
		desc: "This pokemon's typeless moves change to match its primary type and deal 1.2x damage.",
	},
	// Not Fully Implemented
	counterswirl: {
		num: 1026,
		name: "Counterswirl",
		desc: "This Pokemon is immune to Storm attacks, and if it were to be hit by one, the attacker loses 1/8 of their max health.",
	},
	// Not Fully Implemented
	courageous: {
		num: 1027,
		name: "Courageous",
		desc: "This Pokemon is immume to fear, and its Atk and SpA cannot be lowered by other Pokemon. Gaining this Ability while under fear cures it.",
	},
	// Not Fully Implemented
	dataupgrade: {
		num: 1028,
		name: "Data Upgrade",
		desc: "When hit by a Special move, raises SpD by 1, but lowers Def by 1. When hit by a Physical move, raises Def by 1, but lowers SpD by 1.",
	},
	// Not Fully Implemented
	decay: {
		num: 1029,
		name: "Decay",
		desc: "The first time this pokemon uses a damaging Autumn move, its attacking stats will be multiplied by 1.5x when using his next Autumn moves.",
		onSourceHit(target, source, move) {
			if (!move || !target || move.type !== "Autumn") return;
			if (target !== source && move.category !== 'Status') {
				source.addVolatile("decay");
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Decay');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Autumn' && attacker.hasAbility('decay')) {
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Autumn' && attacker.hasAbility('decay')) {
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Decay', '[silent]');
			},
		},
	},
	// Not Fully Implemented
	equivalentexchange: {
		num: 1030,
		name: "Equivalent Exchange",
		desc: "When this Pokémon's Attack is modified, its Special Attack is modified in the opposite way, and vice versa. The same is true for its Defense and Special Defense.",
	},
	// Not Fully Implemented
	farreach: {
		num: 1031,
		name: "Far Reach",
		desc: "This pokemon's non-contact moves to 1.2x damage.",
	},
	// Not Fully Implemented
	fluffyfloat: {
		num: 1032,
		name: "Fluffy Float",
		desc: "If Cotton Field is active, this Pokemon's Defense and Speed are boosted by x1.5. This Pokemon takes no damage from Cotton Field.",
		onModifyDef(pokemon) {
			if (this.field.isTerrain('cottonfield')) return this.chainModify(1.5);
		},
		onModifySpe(pokemon) {
			if (this.field.isTerrain('cottonfield')) return this.chainModify(1.5);
		},
	},
	// Coded
	glide: {
		num: 1033,
		name: "Glide",
		desc: "This pokemon has it's speed raised by 1 when a Pokemon on the feild uses a sky move.",
		onHit(target, source, move) {
			if (move.type !== "Sky") return;
			for (const side of this.sides) {
				for (const pokemon of side.active) {
					if (!pokemon.hasAbility("Glide")) continue;
					if (!pokemon.m.glideBoost || pokemon.m.glideBoost !== this.turn) {
						pokemon.m.glideBoost = this.turn;
						this.boost({spe:1});
					}
				}
			}
		}
	},
	// Coded
	hotfeet: {
		num: 1034,
		name: "Hot Feet",
		desc: "If this Pokemon is sunburned, its Speed is multiplied by 2",
		onModifySpe(spe, pokemon) {
			if (pokemon.status === 'brn') {
				return this.chainModify(2);
			}
		},
	},
	// Not Fully Implemented
	ignorance: {
		num: 1035,
		name: "Ignorance",
		desc: "All Pokemon on the field ignore each others' stat changes.",
	},
	// Not Fully Implemented
	infinitescaling: {
		num: 1036,
		name: "Infinite Scaling",
		desc: "The damage of this Pokémon increases infinitely. (Turn 1: 0.8x, Turn 2: 0.9x, Turn 3: 1x, Turn 4: 1.1x, etc.) Resets upon switching out.",
	},
	// Not Fully Implemented
	internetrage: {
		num: 1037,
		name: "Internet Rage",
		desc: "This Pokemon's Manmade-type moves become Storm-type, and Storm-type moves become Manmade-type.",
	},
	// Coded
	jacko: {
		num: 1038,
		name: "Jack-o'",
		desc: "This Pokemon is immune to the effects of Pumpkin Field. If Pumpkin Field is set on the field, the power of this Pokemon's physical and special attacks is multiplied by 1.3.",
		onModifyDamage(damage, source, target, move) {
			if (this.field.isTerrain("pumpkinfield")) return this.chainModify([0x14CC, 0x1000]);
		},
	},
	// Coded
	lesspell: {
		num: 1039,
		name: "Lesspell",
		desc: "Lowers opposing Pokemon Special Attack by 1 stage when switching in.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Acrid', 'boost');
					activated = true;
				}
				if (target.volatiles['decoy']) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
	},
	// Coded
	linger: {
		num: 1040,
		name: "Linger",
		desc: "The first time this pokemon uses a damaging Winter move, its attacking stats will be multiplied by 1.5x when using his next Winter moves.",
		onSourceHit(target, source, move) {
			if (!move || !target || move.type !== "Winter") return;
			if (target !== source && move.category !== 'Status') {
				source.addVolatile("linger");
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Linger');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Winter' && attacker.hasAbility('linger')) {
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Winter' && attacker.hasAbility('linger')) {
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Linger', '[silent]');
			},
		},
	},
	// Not Fully Implemented
	megatonburst: {
		num: 1041,
		name: "Megaton Burst",
		desc: "This Pokemon uses a 60 BP physical Earth-type move (uses the user's Attack stat) after using a Sound-based move.",
	},
	// Not Fully Implemented
	metalcoat: {
		num: 1042,
		name: "Metal Coat",
		desc: "This pokemon is immune to moves that are 60 bp or lower.",
	},
	// Not Fully Implemented
	modernadaptation: {
		num: 1043,
		name: "Modern Adaptation",
		desc: "Transform any Folklore type move used by the pokemon into Manmade type.",
	},
	// Not Fully Implemented
	nanobarrier: {
		num: 1044,
		name: "Nanobarrier",
		desc: "This pokemon receives 3/4 damage from neutrally effective attacks.",
	},
	// Not Fully Implemented
	necromancer: {
		num: 1045,
		name: "Necromancer",
		desc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Folklore-type attack.",
	},
	// Coded
	nocturnal: {
		num: 1046,
		name: "Nocturnal",
		desc: "Immune to Night-type moves, raises Spe by  1 if hit by one",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Night') {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[from] ability: Sap Sipper');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Night') {
				this.boost({spe: 1}, this.effectData.target);
			}
		},
	},
	// Not Fully Implemented
	nonbeliever: {
		num: 1047,
		name: "Non-Believer",
		desc: "This Pokemon is immune to Folklore-type moves (yes i'm planning to give this another effect like flash fire and -absorb clones)",
	},
	// Coded
	petalbody: {
		num: 1048,
		name: "Petal Body",
		desc: "If Rose Field is active, this Pokemon restores 1/8 of its maximum HP, rounded down, at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (this.field.isTerrain('rosefield')) this.heal(target.baseMaxhp / 8);
		}
	},
	// Not Fully Implemented
	prudentplow: {
		num: 1049,
		name: "Prudent Plow",
		desc: "This Pokemon's Autumn-type moves become two-hit moves, including Status moves. The second hit has its damage/HP recovery quartered. Does not affect moves that are already multi-hit.",
	},
	// Not Fully Implemented
	ragingsea: {
		num: 1050,
		name: "Raging Sea",
		desc: "Increases the power of Sea-type moves by up to 40% the lower its HP gets.",
	},
	// Not Fully Implemented
	rainbringer: {
		num: 1051,
		name: "Rainbringer",
		desc: "Sets weather to Rain for the next 5 turns. Spring and Sea deals 1.3x damage.",
		onStart(source) {
			this.field.setWeather('rainyseason');
		},
	},
	// Coded
	reality: {
		num: 1052,
		name: "Reality",
		desc: "Immune to Folklore-type, boosts its Attack by 1 stage if hit by Folklore-type moves.",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Folklore') {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[from] ability: Reality');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Folklore') {
				this.boost({atk: 1}, this.effectData.target);
			}
		},
	},
	// Not Fully Implemented
	reaper: {
		num: 1053,
		name: "Reaper",
		desc: "This Pokemon's Autumn-type moves do 1.2x damage and restore the user 50% of the damage dealt.",
	},
	// Coded
	regenerator: {
		num: 1054,
		name: "Regenerator",
		desc: "This pokemon has 1/4 of its max hp, rounded down, restored when it switches out",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 4);
		},
	},
	// Not Fully Implemented
	rigormortis: {
		num: 1055,
		name: "Rigor Mortis",
		desc: "If the user takes a physical hit, it gains +1 defense stage.",
	},
	// Not Fully Implemented
	sacrificer: {
		num: 1056,
		name: "Sacrificer",
		desc: "This Pokemon loses 1/3 of its max HP when it switches out. Next Pokemon gets those HP.",
	},
	// Not Fully Implemented
	scavenge: {
		num: 1057,
		name: "Scavenge",
		desc: "This Pokemon restores 1/3 of its max health if another Pokemon on the field faints.",
	},
	// Not Fully Implemented
	shatter: {
		num: 1058,
		name: "Shatter",
		desc: "This pokemon's attacks are guaranteed to be critical hits if the opponent is statused.",
	},
	// Coded
	shine: {
		num: 1059,
		name: "Shine",
		desc: "The first time this pokemon uses a damaging Summer move, its attacking stats will be multiplied by 1.5x when using his next Summer moves.",
		onSourceHit(target, source, move) {
			if (!move || !target || move.type !== "Summer") return;
			if (target !== source && move.category !== 'Status') {
				source.addVolatile("shine");
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Shine');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Summer' && attacker.hasAbility('shine')) {
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Summer' && attacker.hasAbility('shine')) {
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Shine', '[silent]');
			},
		},
	},
	// Not Fully Implemented
	smite: {
		num: 1060,
		name: "Smite",
		desc: "Moves' power is boosted by 1.3x if the target is below half health",
	},
	// Not Fully Implemented
	snowbringer: {
		num: 1061,
		name: "Snowbringer",
		desc: "Sets weather to Snow for the next 5 turns. Winter deals 1.5x damage, Summer deals 0.5x",
		onStart(source) {
			this.field.setWeather('snowfall');
		},
	},
	// Not Fully Implemented
	spectralshifter: {
		num: 1062,
		name: "Spectral Shifter",
		desc: "While this Pokemon is active, opposing Pokemons' stat raises will be lowers instead, and vice versa.",
	},
	// Not Fully Implemented
	steadfast: {
		num: 1063,
		name: "Steadfast",
		desc: "Inverts Sunburn and Chill effects on the user.",
	},
	// Not Fully Implemented
	stoneskin: {
		num: 1064,
		name: "Stone Skin",
		desc: "User takes 25% less damage from contact moves.",
	},
	// Coded
	stormwatch: {
		num: 1065,
		name: "Storm Watch",
		desc: "Immunity to Storm, being targeted by a Storm move will boost both defenses by 1 stage.",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Storm') {
				if (!this.boost({def: 1, spd: 1})) {
					this.add('-immune', target, '[from] ability: Storm Watch');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Storm') {
				this.boost({def: 1, spd: 1}, this.effectData.target);
			}
		},
	},
	// Coded
	strategicretreat: {
		num: 1066,
		name: "Strategic Retreat",
		desc: "emergency exit but activates in 25% of max HP and heals 25% of max HP on switch",
		onUpdate(pokemon){
			if (pokemon.hp >= pokemon.maxhp / 4) return;
			if (!this.canSwitch(pokemon.side) || pokemon.forceSwitchFlag || pokemon.switchFlag) return;
			for (const side of this.sides) {
				for (const active of side.active) {
					active.switchFlag = false;
				}
			}
			pokemon.switchFlag = true;
			this.add('-activate', target, 'ability: Strategic Retreat');
		}
	},
	// Coded
	subrosa: {
		num: 1067,
		name: "Sub Rosa",
		desc: "This Pokemon is unharmed by Rose Field. This Pokemon restores 1/8 of its maximum HP, rounded down, if any Pokemon (including itself) switches into Rose Field.",
	},
	// Coded
	sunbringer: {
		num: 1068,
		name: "Sunbringer",
		desc: "Sets weather to Sun for the next 5 turns. Summer deals 1.5x damage, Winter deals 0.5x",
		onStart(source) {
			this.field.setWeather('highnoon');
		},
	},
	// Not Fully Implemented
	supersapience: {
		num: 1069,
		name: "Super Sapience",
		desc: "Boosts moves that start with S by 1.5x. Moves that start with any other letter receive a 0.5x  decrease in power.",
	},
	// Not Fully Implemented
	thickheaded: {
		num: 1070,
		name: "Thick Headed",
		desc: "When this pokemon makes contact with the foe, nullifies their type-based immunities.",
	},
	// Not Fully Implemented
	thickskin: {
		num: 1071,
		name: "Thick Skin",
		desc: "This Pokemon is immune to the negative effects of Sunburn, and its defenses are 1.5x if it is Sunburned.",
	},
	// Not Fully Implemented
	toughclaws: {
		num: 1072,
		name: "Tough Claws",
		desc: "No Changes",
	},
	// Not Fully Implemented
	transcription: {
		num: 1073,
		name: "Transcription",
		desc: "Turns the Pokémon's first type to Folklore and the moves of the type into Folklore. They also receive a 1.1 boost in power.",
	},
	// Not Fully Implemented
	tropicalspirit: {
		num: 1074,
		name: "Tropical Spirit",
		desc: "This Pokemon's attacks are critical hits if the target is sunburnt. Winter-type moves against this Pokemon deal half damage.",
	},
	// Coded
	unstable: {
		num: 1075,
		name: "Unstable",
		desc: "The pokemon is immune to serenity move.But the fear status is doubled if applied on the pokemon with the ability.",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Storm') {
				this.add('-immune', target, '[from] ability: Storm Watch');
				return null;
			}
		},
	},
	// Coded
	wavecrasher: {
		num: 1076,
		name: "Wave Crasher",
		desc: "After another Pokemon uses a Sea-type move, the user uses the same move. Sea-type moves against this Pokemon deal half damage. Other Pokemon cannot force the user to switch out.",
		onSourceBasePowerPriority: 18,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Sea') {
				return this.chainModify(0.5);
			}
		},
		onDragOutPriority: 1,
		onDragOut(pokemon) {
			this.add('-activate', pokemon, 'ability: Suction Cups');
			return null;
		},
	},
	// Coded
	wintercoat: {
		num: 1077,
		name: "Winter Coat",
		desc: "This Pokemon is immune to Winter-type moves and is immune to chill. Gaining this Ability while under chill cures it.",
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Immunity');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'frz') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Winter Coat');
			}
			return false;
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Winter') {
				this.add('-immune', target, '[from] ability: Storm Watch');
				return null;
			}
		},
	},
};