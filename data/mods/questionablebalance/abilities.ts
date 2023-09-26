/*

Ratings and how they work:

-1: Detrimental
	  An ability that severely harms the user.
	ex. Defeatist, Slow Start

 0: Useless
	  An ability with no overall benefit in a singles battle.
	ex. Color Change, Plus

 1: Ineffective
	  An ability that has minimal effect or is only useful in niche situations.
	ex. Light Metal, Suction Cups

 2: Useful
	  An ability that can be generally useful.
	ex. Flame Body, Overcoat

 3: Effective
	  An ability with a strong effect on the user or foe.
	ex. Chlorophyll, Sturdy

 4: Very useful
	  One of the more popular abilities. It requires minimal support to be effective.
	ex. Adaptability, Magic Bounce

 5: Essential
	  The sort of ability that defines metagames.
	ex. Imposter, Shadow Tag

*/

export const Abilities: {[abilityid: string]: AbilityData} = {
	aerilate: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball', 'chromaticblast',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Flying';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		rating: 4,
        desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
        shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.3x power.",
	},
	airlock: {
		inherit: true,
		onStart(pokemon) {
			// Air Lock does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			if (this.effectState.switchingIn) {
				this.add('-ability', pokemon, 'Air Lock');
				this.effectState.switchingIn = false;
			}
			this.eachEvent('WeatherChange', this.effect);
            this.actions.useMove('tailwind', pokemon);
		},
		rating: 4,
        desc: "While this Pokemon is active, the effects of weather conditions are disabled. On switch in, sets tailwind on this Pokemon's side of the field.",
		shortDesc: "Supresses the effects of weather. On switch in, sets tailwind.",
	},
	arenatrap: {
         onFoeSwitchOut(source) {
            if (source.ability === 'runaway' || source.item === 'shedshell' || source.hasType('Ghost')) return;
            if (pokemon.isGrounded()) {
				this.damage(source.baseMaxhp / 4); 
			}
		},
		name: "Arena Trap",
		rating: 3.5,
		num: 71,
        desc: "When an opposing Pokemon switches, it loses 1/4th of its maximum HP, unless they are airborne, are holding a Shed Shell, are a Ghost type, or have the Run Away ability.",
		shortDesc: "When a foe switches, that pokemon loses 1/4 its max HP, unless they are airborne.",
	},
	aurabreak: {
        onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Aura Break');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (move.category === 'Status') return;
			if (move.type === 'Dark') return this.chainModify([3072, 4096]);
            if (move.type === 'Fairy') return this.chainModify([3072, 4096]);
		},
		isBreakable: true,
		name: "Aura Break",
        shortDesc: "While this Pokemon is active, the power of Dark and Fairy moves is reduced by 25%.",
        start: "  [POKEMON] is weakening the power of Dark and Fairy moves!",
		rating: 3,
		num: 188,
	},
	battlearmor: {
		inherit: true,
        onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
            if (effect && effect.id === 'spikes') {
				return false;
			}
            if (effect && effect.id === 'gmaxsteelsurge') {
				return false;
			}
		},
		isBreakable: true,
		name: "Battle Armor",
        desc: "This Pokemon cannot be struck by a critical hit and is immune to damage from Stealth Rocks, Copper Mines, or Spikes.",
		shortDesc: "This Pokemon cannot be struck by a critical hit and is immune to and Hazard damage.",
		rating: 3,
		num: 4,
	},
    bigpecks: {
        onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('Big Pecks boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('Big Pecks boost');
				return this.chainModify(1.5);
			}
		},
		name: "Big Pecks",
        shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Flying-type attack.",
		rating: 3.5,
		num: 145,
	},
	blaze: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			} else {
                this.debug('Blaze boost');
				return this.chainModify(1.2);
            }
		},
		onModifySpA(spa, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			} else {
                this.debug('Blaze boost');
				return this.chainModify(1.2);
            }
		},
		rating: 3,
        desc: "This Pokemon's offensive stat is multiplied by 1.2 while using a Fire-type attack. When this Pokemon has 1/3 or less of its maximum HP, rounded down, this bonus increases to 1.5",
        shortDesc: "Offensive stat is 1.2x when using a Fire-type move; increases to 1.5x at 1/3 HP or less.",
	},
	bulletproof: {
		inherit: true,
		rating: 3.5,
	},
	colorchange: {
		onBeforeMoveSecondary(target, source, move) {
			if (!target.hp) return;
			const type = move.type;
			if (
				target.isActive && move.effectType === 'Move' && move.category !== 'Status' &&
				type !== '???' && !target.hasType(type)
			) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') {
						action.targetLoc = -1;
					}
				}
			}
		},
		name: "Color Change",
        desc: "This Pokemon's type changes to match the type of the move that is about to hit it, unless that type is already one of its types. This effect is prevented if the move had a secondary effect removed by the Sheer Force Ability.",
		shortDesc: "This Pokemon's type changes to match the type of the move that is about to hit it.",
		rating: 3,
		num: 16,
	},
	corrosion: {
        inherit: true,
		// Implemented in sim/pokemon.js:Pokemon#setStatus
        onModifyMove(move) {
            if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
            }
            if (move.type === 'Poison') {
				move.ignoreAbility = true;
			}
		},
		rating: 3.5,
        shortDesc: "This Pokemon ignores immunity when using a Poison-type move.",
	},
	curiousmedicine: {
		onStart(pokemon) {
			this.actions.useMove('haze', pokemon);
		},
		name: "Curious Medicine",
        shortDesc: "On switch-in, this all Pokemon have their stat stages reset to 0.",
		rating: 2,
		num: 261,
	},
	dauntlessshield: {
        inherit: true,
		onStart(pokemon) {
            this.boost({def: 1}, pokemon);
            this.boost({spd: 1}, pokemon);
		},
		shortDesc: "On switch-in, this Pokemon's Defence and Special Defence is raised by 1 stage.",
	},
	deltastream: {
        inherit: true,
		onStart(source, pokemon) {
			this.field.setWeather('deltastream');
            this.actions.useMove('tailwind', pokemon);
		},
        desc: "On switch-in, sets tailwind on the users side and the weather becomes Delta Stream, which removes the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by the Desolate Land or Primordial Sea Abilities.",
		shortDesc: "On switch-in, strong winds begin until this Ability is not active in battle.",
	},
	disguise: {
		inherit: true,
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
			}
		},
		rating: 4,
        desc: "On switch-in, the weather becomes Desolate Land, which includes all the effects of Sunny Day and prevents damaging Water-type moves from executing. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by the Delta Stream or Primordial Sea Abilities.",
		shortDesc: "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.",
	},
	emergencyexit: {
		onBeforeTurn(pokemon) {
			pokemon.abilityState.originalHP = pokemon.hp;
		},
		onStart(pokemon) {
			pokemon.abilityState.originalHP = pokemon.hp;
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.abilityState.originalHP > pokemon.maxhp / 2) {
				if (!this.canSwitch(pokemon.side) || pokemon.forceSwitchFlag || pokemon.switchFlag) return;
				for (const side of this.sides) {
					for (const active of side.active) {
						active.switchFlag = false;
					}
				}
				pokemon.switchFlag = true;
				this.add('-activate', pokemon, 'ability: Emergency Exit');
			}
		},
		name: "Emergency Exit",
		rating: 2,
		num: 194,
        desc: "At the end of the turn, if this Pokemon has less than 1/2 of its maximum HP, it switches out to a chosen ally.",
		shortDesc: "If this Pokemon is below 1/2 HP at the end of the turn, it switches out.",
	},
	forecast: {
        inherit: true,
		onStart(pokemon) {
            if (pokemon.hasItem('damprock')) {
				this.field.setWeather('raindance');
			} else if (pokemon.hasItem('heatrock')) {
				this.field.setWeather('sunnyday');
			} else if (pokemon.hasItem('smoothrock')) {
				this.field.setWeather('sandstorm');
			} else if (pokemon.hasItem('icyrock')) {
				this.field.setWeather('hail');
			}
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		rating: 3,
        desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm. This effect is prevented if this Pokemon is holding a Utility Umbrella and the weather is Rain Dance or Sunny Day. If this pokemon is holding a weather rock, it will set the weather corrosponding to the rock it is holding.",
		shortDesc: "Summons weather based on held weather rock; changes Castform's form to the current weather.",
	},
	galewings: {
        inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Flying') return priority + 1;
		},
		rating: 4,
        shortDesc: "This Pokemon's Flying-type moves have their priority increased by 1.",
	},
	galvanize: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball', 'chromaticblast',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Electric';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		desc: "This Pokemon's Normal-type moves become Electric-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Electric type and have 1.3x power.",
	},
	gorillatactics: {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Gorilla Tactics Atk Boost');
			return this.chainModify(1.3);
		},
		rating: 3.5,
        desc: "This Pokemon's Attack is multiplied by 1.3, but it can only select the first move it executes. These effects are prevented while this Pokemon is Dynamaxed.",
		shortDesc: "This Pokemon's Attack is 1.3x, but it can only select the first move it executes.",
	},
	gulpmissile: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, effect) {
			if (
				effect && effect.id === 'surf' && source.hasAbility('gulpmissile') &&
				source.species.name === 'Cramorant' && !source.transformed
			) {
				const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				source.formeChange(forme, effect);
                this.heal(source.baseMaxhp / 4);
			}
		},
		rating: 3.5,
		desc: "If this Pokemon is a Cramorant, it changes forme when it hits a target with Surf or uses the first turn of Dive successfully. It then Heals 1/4th of its maximum HP, rounded down. It becomes Gulping Form with an Arrokuda in its mouth if it has more than 1/2 of its maximum HP remaining, or Gorging Form with a Pikachu in its mouth if it has 1/2 or less of its maximum HP remaining. If Cramorant gets hit in Gulping or Gorging Form, it spits the Arrokuda or Pikachu at its attacker, even if it has no HP remaining. The projectile deals damage equal to 1/4 of the target's maximum HP, rounded down; this damage is blocked by the Magic Guard Ability but not by a substitute. An Arrokuda also lowers the target's Speed by 1 stage, and a Pikachu paralyzes the target. Cramorant will return to normal if it spits out a projectile, switches out, or Dynamaxes.",
		shortDesc: "After Surf/Dive heal 1/4 max HP and if Hit, attacker takes 1/4 max HP and -1 Spe or paralysis.",
	},
	healer: {
        inherit: true,
		onResidual(pokemon) {
			for (const allyActive of pokemon.adjacentAllies()) {
                this.add('-activate', pokemon, 'ability: Healer');
                allyActive(target.baseMaxhp / 8);
				if (allyActive.status) {
					allyActive.cureStatus();
				}
			}
		},
        desc: "Heals allies by 1/8th and cures their non-volatile status contions at the end of each turn.",
		shortDesc: "Heals allies by 1/8th and cures their status contion at the end of each turn.",
	},
	heatproof: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				this.add('-immune', target, '[from] ability: Heatproof');
                return null;
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Heatproof');
			}
			return false;
		},
		isBreakable: true,
		name: "Heatproof",
        shortDesc: "This Pokemon is immune to Fire type moves and Burn.",
		rating: 3,
		num: 85,
	},
	honeygather: {
		name: "Honey Gather",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		rating: 3,
		shortDesc: "At the end of every turn, this Pokemon restores 1/16 of its max HP.",
		num: 118,
	},
	hypercutter: {
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		name: "Hyper Cutter",
        shortDesc: "This Pokemon's critical hit ratio is raised by 1 stage.",
		rating: 2,
		num: 52,
	},
	icebody: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'hail' || type === 'snow') return false;
		},
		desc: "If Snow or Hail is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Snow or Hail is active, this Pokemon heals 1/16 of its max HP each turn.",
	},
	illuminate: {
		name: "Illuminate",
        onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('illuminate - enhancing accuracy');
			return accuracy + 20;
		},
		rating: 3,
		num: 35,
        shortDesc: "This Pokemon's moves have their accuracy increased by +20%.",
	},
	illusion: {
		onBeforeSwitchIn(pokemon) {
			pokemon.illusion = null;
			// yes, you can Illusion an active pokemon but only if it's to your right
			for (let i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				const possibleTarget = pokemon.side.pokemon[i];
				if (!possibleTarget.fainted) {
					pokemon.illusion = possibleTarget;
					break;
				}
			}
		},
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
					(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
			}
		},
		onFaint(pokemon) {
            if (pokemon.illusion) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
					(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
			}
            pokemon.illusion = null;
		},
		name: "Illusion",
		rating: 4.5,
		num: 149,
        desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it faints. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it faints.",
	}, 
	immunity: {
        inherit: true,
        onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Poison') {
				this.add('-immune', target, '[from] ability: Immunity');
                return null;
			}
		},
		rating: 3,
        desc: "This Pokemon is immune to Poison type moves and the Poisoned Condition, unless the attacker has the Corrosion ability.",
		shortDesc: "This Pokemon is immune to Poison type moves and the Poisoned Condition.",
	},
	
	innerfocus: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', '[of] ' + target);
			} else if (effect.name === 'Pressure' && boost.spa) {
				delete boost.spa;
				this.add('-fail', target, 'unboost', 'Special Attack', '[from] ability: Inner Focus', '[of] ' + target);
			}
		},
		desc: "This Pokemon cannot be made to flinch. This Pokemon is immune to the effect of the Intimidate and Pressure Abilities.",
		shortDesc: "This Pokemon cannot be made to flinch. Immune to Intimidate and Pressure.",
	},
	intrepidsword: {
        inherit: true,
		onStart(pokemon) {
			this.boost({atk: 1}, pokemon);
            this.boost({spa: 1}, pokemon);
        },
		shortDesc: "On switch-in, this Pokemon's Attack and Special Attack is raised by 1 stage.",
	},
	ironfist: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([5325, 4096]);
			}
		},
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.3.",
		shortDesc: "This Pokemon's punch-based attacks have 1.3x power.",
	},
	keeneye: {
		inherit: true,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('keeneye - enhancing accuracy');
			return this.chainModify([4915, 4096]);
		},
		rating: 3,
        desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon's moves have their accuracy multiplied by 1.2. .",
		shortDesc: "This Pokemon's accuracy can't be lowered; This Pokemon's moves have 1.2x accuracy.",
	},
	leafguard: {
        inherit: true,
		onSetStatus(status, target, source, effect) {
            if ((effect as Move)?.status) {
                this.add('-immune', target, '[from] ability: Leaf Guard');
            }
            return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Leaf Guard');
				return null;
			}
		},
		rating: 4,
        desc: "This Pokemon cannot become affected by a non-volatile status condition or Yawn, and Rest will fail for it.",
		shortDesc: "This Pokemon cannot be statused and Rest will fail for it.",
	},
	liquidvoice: {
		inherit: true,
        onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound'] && !attacker.volatiles['dynamax']) {
				return this.chainModify([5325, 4096]);
			}
		},
		rating: 3.5,
        desc: "This Pokemon's sound-based moves become Water-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Water type and have 1.3x power.",
	},
	magmaarmor: {
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(2);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Magma Armor');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'frz') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Magma Armor');
			}
			return false;
		},
		isBreakable: true,
		name: "Magma Armor",
		rating: 4.5,
		num: 40,
        desc: "This Pokemon's offensive stat is doubled while using a Fire-type attack. If a Pokemon uses a Water-type attack against this Pokemon, that Pokemon's offensive stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be frozen. Gaining this Ability while forzen cures it.",
		shortDesc: "This Pokemon's Fire power is 2x; it can't be frozen; Water power against it is halved.",
	},
	megalauncher: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse'] || move.flags['bullet']) {
				return this.chainModify(1.5);
			}
		},
        desc: "This Pokemon's pulse and ballistic moves have their power multiplied by 1.5. Heal Pulse restores 3/4 of a target's maximum HP, rounded half down.",
		shortDesc: "This Pokemon's pulse and ballistic moves have 1.5x power. Heal Pulse heals 3/4 HP.",
	},
	merciless: {
		inherit: true,
        onModifyMove(move, pokemon, target) {
			if (target && ['psn', 'tox'].includes(target.status)) {
				move.accuracy = true;
			}
		},
		rating: 2.5,
        shortDesc: "This Pokemon's attacks never miss and are critical hits if the target is poisoned.",
	},
	minus: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['plus'])) {
					return this.chainModify(2);
				}
			}
		},
        onModifyAtk(atk, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['plus'])) {
					return this.chainModify(2);
				}
			}
		},
        onModifyDef(def, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['plus'])) {
					return this.chainModify(2);
				}
			}
		},
        onModifySpD(spd, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['plus'])) {
					return this.chainModify(2);
				}
			}
		},
        onModifySpe(spe, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['plus'])) {
					return this.chainModify(2);
				}
			}
		},
		name: "Minus",
		rating: 0,
		num: 58,
        desc: "If an active ally has the Plus Ability, this Pokemon's Attack, Defence, Special Attack, Special Defence, and Speed is Doubled.",
		shortDesc: "If an active ally has the Plus Ability, this Pokemon's Stats are Doubled.",
	},
	myceliummight: {
		onModifyMove(move) {
			if (move.category === 'Status') {
				move.ignoreAbility = true;
			}
		},
		name: "Mycelium Might",
		rating: 4,
		num: 298,
        desc: "This Pokemon's Status moves ignore certain Abilities of other Pokemon.",
		shortDesc: "This Pokemon's Status moves ignore Abilities.",
	},
	normalize: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'terrainpulse', 'weatherball', 'chromaticblast',
			];
			if (!(move.isZ && move.category !== 'Status') && !noModifyType.includes(move.id) &&
				// TODO: Figure out actual interaction
				!(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Normal';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([6144, 4096]);
		},
		rating: 3,
        desc: "This Pokemon's moves are changed to be Normal type and have their power multiplied by 1.5. This effect comes before other effects that change a move's type.",
		shortDesc: "This Pokemon's moves are changed to be Normal type and have 1.5x power.",
	},
	overcoat: {
        inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'snow' || type === 'powder') return false;
		},
        onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
            if (effect && effect.id === 'spikes') {
				return false;
			}
            if (effect && effect.id === 'gmaxsteelsurge') {
				return false;
			}
		},
		rating: 3.5,
        desc: "This Pokemon is immune to powder moves; damage from Sandstorm, Hail, or Snow; Damage from Stealth Rocks, Copper Mines, or Spikes; and the effects of Rage Powder and the Effect Spore Ability.",
		shortDesc: "Immunity to Powder moves, Weather damage, Effect Spore, and Hazard damage.",
	},
	overgrow: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			} else {
                this.debug('Overgrow boost');
				return this.chainModify(1.2);
            }
		},
		onModifySpA(spa, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			} else {
                this.debug('Overgrow boost');
				return this.chainModify(1.2);
            }
		},
		rating: 3,
		desc: "This Pokemon's offensive stat is multiplied by 1.2 while using a Grass-type attack. When this Pokemon has 1/3 or less of its maximum HP, rounded down, this bonus increases to 1.5",
        shortDesc: "Offensive stat is 1.2x when using a Grass-type move; increases to 1.5x at 1/3 HP or less.",
	},
	pastelveil: {
        inherit: true,
		onStart(pokemon) {
			for (const ally of pokemon.alliesAndSelf()) {
				if (ally.status) {
					this.add('-activate', pokemon, 'ability: Pastel Veil');
					ally.cureStatus();
				}
			}
		},
		onUpdate(pokemon) {
			if (ally.status) {
				this.add('-activate', pokemon, 'ability: Pastel Veil');
				pokemon.cureStatus();
			}
		},
		onAllySwitchIn(pokemon) {
			if (pokemon.status) {
				this.add('-activate', this.effectState.target, 'ability: Pastel Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Pastel Veil');
			}
			return false;
		},
		onAllySetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Pastel Veil', '[of] ' + effectHolder);
			}
			return false;
		},
		rating: 4,
        desc: "This Pokemon and its allies cannot be affected by a non-volatile status condition. Gaining this Ability while this Pokemon or its ally has a non-volatile status condition cures them. If this Ability is being ignored during an effect that causes a non-volatile status condition, this Pokemon is cured immediately but its ally is not.",
		shortDesc: "This Pokemon and its allies cannot statused. On switch-in, cures allies status.",
	},
	perishbody: {
        inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (!this.checkMoveMakesContact(move, source, target)) return;

			let announced = false;
			for (const pokemon of [target, source]) {
				if (pokemon.volatiles['perishsong']) continue;
				if (!announced) {
					this.add('-ability', target, 'Perish Body');
					announced = true;
				}
				source.addVolatile('perishsong');
			}
		},
		rating: 2.5,
        shortDesc: "Making contact with this Pokemon starts the Perish Song effect for the attacker.",
	},
	pixilate: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball', 'chromaticblast',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		rating: 4,
		desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
        shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.3x power.",
	},
	plus: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus'])) {
					return this.chainModify(2);
				}
			}
		},
        onModifyAtk(atk, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus'])) {
					return this.chainModify(2);
				}
			}
		},
        onModifyDef(def, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus'])) {
					return this.chainModify(2);
				}
			}
		},
        onModifySpD(spd, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus'])) {
					return this.chainModify(2);
				}
			}
		},
        onModifySpe(spe, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus'])) {
					return this.chainModify(2);
				}
			}
		},
		name: "Plus",
		rating: 0,
		num: 57,
        desc: "If an active ally has the Minus Ability, this Pokemon's Attack, Defence, Special Attack, Special Defence, and Speed is Doubled.",
		shortDesc: "If an active ally has the Minus Ability, this Pokemon's Stats are Doubled.",
	},
	poisonpoint: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(1, 3)) {
					source.trySetStatus('tox', target);
				}
			}
		},
		name: "Poison Point",
		rating: 2.5,
		num: 38,
        shortDesc: "1/3 chance a Pokemon making contact with this Pokemon will be badly poisoned.",
	},
	pressure: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Pressure', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
		name: "Pressure",
		rating: 3.5,
		num: 46,
        desc: "On switch-in, this Pokemon lowers the Special Attack of opposing Pokemon by 1 stage. Pokemon with the Inner Focus, Oblivious, Own Tempo, Idealist, or Scrappy Abilities and Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Special Attack of opponents by 1 stage.",
	},
	propellertail: {
		inherit: true,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
            if (move?.type === 'Water') {
            move.tracksTarget = move.target !== 'scripted';
            return priority + 1;
            }	
		},
		rating: 4,
		shortDesc: "This Pokemon's Water-type moves have their priority increased by 1 and can't be redirected.",
	},
	rattled: {
		inherit: true,
		onAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Intimidate' || effect?.name === 'Pressure') {
				this.boost({spe: 1});
			}
		},
		rating: 2,
        desc: "This Pokemon's Speed is raised by 1 stage if hit by a Bug-, Dark-, or Ghost-type attack, or if an opposing Pokemon affected this Pokemon with the Intimidate or Pressure Abilities.",
		shortDesc: "+1 Speed if hit by a Bug-, Dark-, or Ghost-type attack, or Pressured/Intimidated.",
	},
	refrigerate: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball', 'chromaticblast',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Ice';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		rating: 4,
		desc: "This Pokemon's Normal-type moves become Ice-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Ice type and have 1.3x power.",
	},
	rivalry: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.5);
				}
			}
		},
		rating: 3,
		desc: "This Pokemon's attacks have their power multiplied by 1.5 against targets of the same gender. There is no modifier if either this Pokemon or the target is genderless.",
		shortDesc: "This Pokemon's attacks do 1.5x on same gender targets.",
	},
	runaway: {
		name: "Run Away",
		rating: 2,
		num: 50,
        onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
        shortDesc: "This pokemon may switch out even when trapped by another Pokemon, or by Ingrain.",
	},
	sandforce: {
        onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.5);
			}
		},
        onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.5);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		name: "Sand Force",
        desc: "If Sandstorm is active, this Pokemon's Attack abd Special Attack is multiplied by 1.5. This effect is prevented if the Pokemon is holding a Utility Umbrella. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Atk and Sp. Atk is 1.5x; immunity to it.",
		rating: 3,
		num: 159,
	},
	sandveil: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
        onModifyDefPriority: 6,
        onModifyDef(def) {
            if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.25);
			}
			
		},
        onModifySpdPriority: 6,
        onModifySpd(spd) {
            if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.25);
			}
			
		},
		isBreakable: true,
		name: "Sand Veil",
        desc: "If Sandstorm is active, this Pokemon's Defence and Special Defence is multiplied by 1.25x. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Def and Sp. Def is 1.25x; immunity to Sandstorm.",
		rating: 3,
		num: 8,
	},
	schooling: {
		inherit: true,
        onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 4);
		},
		rating: 4,
        desc: "On switch-in, if this Pokemon is a Wishiwashi that is level 20 or above and has more than 1/4 of its maximum HP left, it changes to School Form. If it is in School Form and its HP drops to 1/4 of its maximum HP or less, it changes to Solo Form at the end of the turn. If it is in Solo Form and its HP is greater than 1/4 its maximum HP at the end of the turn, it changes to School Form. This Pokemon restores 1/4 of its maximum HP, rounded down, when it switches out.",
		shortDesc: "Restores 1/4 HP, when switching out. Wishiwashi: School Form if > 1/4 HP, else Solo Form.",
	},
	scrappy: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', '[of] ' + target);
			} else if (effect.name === 'Pressure' && boost.spa) {
				delete boost.spa;
				this.add('-fail', target, 'unboost', 'Special Attack', '[from] ability: Scrappy', '[of] ' + target);
			}
		},
		rating: 3,
		desc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves. This Pokemon is immune to the effect of the Intimidate/Pressure Abilities.",
		shortDesc: "Fighting, Normal moves hit Ghost. Immune to Intimidate and Pressure.",
	},
	shadowtag: {
        onFoeSwitchOut(source) {
            if (source.ability === 'runaway' || source.item === 'shedshell' || source.hasType('Ghost')) return;
            this.damage(source.baseMaxhp / 4); 
		},
		name: "Shadow Tag",
		rating: 4,
		num: 23,
        desc: "When an opposing Pokemon switches, it loses 1/4th of its maximum HP, unless they are holding a Shed Shell, or have the ability Run Away.",
		shortDesc: "When a foe switches, that pokemon loses 1/4 its max HP.",
	},
	
	shedskin: {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.hp && pokemon.status) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
			}
		},
		rating: 4,
		shortDesc: "This Pokemon curses its non-volatile status condition at the end of each turn.",
	},
	shellarmor: {
		inherit: true,
        onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
            if (effect && effect.id === 'spikes') {
				return false;
			}
            if (effect && effect.id === 'gmaxsteelsurge') {
				return false;
			}
		},
		rating: 3.5,
        desc: "This Pokemon cannot be struck by a critical hit and is immune to damage from Stealth Rocks, Copper Mines, or Spikes.",
		shortDesc: "This Pokemon cannot be struck by a critical hit and is immune to and Hazard damage.",
	},
	slushrush: {
        inherit: true,
        onImmunity(type, pokemon) {
			if (type === 'hail' || type === 'snow') return false;
		},
		shortDesc: "If Snow/Hail is active, this Pokemon's Speed is doubled; immunity to Snow/Hail.",
	},
	
	snowcloak: {
        onImmunity(type, pokemon) {
			if (type === 'hail' || type === 'snow') return false;
		},
        onModifyDefPriority: 6,
        onModifyDef(def) {
            if (this.field.isWeather(['hail', 'snow'])) {
				return this.chainModify(1.25);
			}
			
		},
        onModifySpdPriority: 6,
        onModifySpd(spd) {
            if (this.field.isWeather(['hail', 'snow'])) {
				return this.chainModify(1.25);
			}
			
		},
		isBreakable: true,
		name: "Snow Cloak",
		rating: 3,
		num: 81,
        desc: "If Hail or Snow is active, this Pokemon's Defence and Special Defence is multiplied by 1.25x. This Pokemon takes no damage from Snow and Hail.",
		shortDesc: "If Hail/Snow is active, Def and Sp. Def is 1.25x; immunity to Hail/Snow.",
	},
	solarpower: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
        onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		name: "Solar Power",
		rating: 3,
		num: 94,
        desc: "If Sunny Day is active, this Pokemon's Attack abd Special Attack is multiplied by 1.5. This effect is prevented if the Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Sunny Day is active, this Pokemon's Atk and Sp. Atk is 1.5x.",
	},
	stalwart: {
		inherit: true,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
			move.tracksTarget = move.target !== 'scripted';
            move.mindBlownRecoil = false;
		},
        onTryBoost(boost, target, source, effect) {
			if (source && target !== source) return;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
				}
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		rating: 4,
		shortDesc: "This Pokemon's offensive stat is doubled against a target that switched in this turn.",
	},
	stamina: {
        onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({def: 1});
			}
		},
		name: "Stamina",
		rating: 3.5,
		num: 192,
        desc: "This Pokemon's Defence is raised by 1 stage at the end of each full turn it has been on the field.",
		shortDesc: "This Pokemon's Defence is raised 1 stage at the end of each full turn on the field.",
	},
	stancechange: {
		inherit: true,
		onModifyMove(move, attacker, defender) {
			if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			// if (move.category === 'Status' && move.id !== 'kingsshield') return;
			const targetForme = (move.category === 'Status' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
		},
		desc: "If this Pokemon is an Aegislash, it changes to Blade Forme before using an attacking move, and changes to Shield Forme before using a status move",
		shortDesc: "If Aegislash, changes Forme to Blade before attacks and Shield before status moves.",
	},
	steamengine: {
        onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
                this.boost({spe: 3});
				this.add('-immune', target, '[from] ability: Steam Engine');
                return null;
			}
            if (target !== source && move.type === 'Water') {
                this.boost({spe: 3});
				this.add('-immune', target, '[from] ability: Steam Engine');
                return null;
			}
		},
		name: "Steam Engine",
		rating: 4.5,
		num: 243,
        shortDesc: "This Pokemon's Speed is raised 3 stages if hit by a Water/Fire move; Water/Fire immunity.",
	},
	stench: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		name: "Stench",
		rating: 2.5,
		num: 1,
        desc: "Pokemon making contact with this Pokemon lose 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/8 of their max HP.",
		damage: "#roughskin",
	},
    swarm: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			} else {
                this.debug('Swarm boost');
				return this.chainModify(1.2);
            }
		},
		onModifySpA(spa, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			} else {
                this.debug('Swarm boost');
				return this.chainModify(1.2);
            }
		},
		rating: 3,
        desc: "This Pokemon's offensive stat is multiplied by 1.2 while using a Bug-type attack. When this Pokemon has 1/3 or less of its maximum HP, rounded down, this bonus increases to 1.5",
        shortDesc: "Offensive stat is 1.2x when using a Bug-type move; increases to 1.5x at 1/3 HP or less.",
	},
	teravolt: {
		inherit: true,
        onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Teravolt boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Teravolt boost');
				return this.chainModify(1.5);
			}
		},
		rating: 4.5,
		desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon. This Pokemon's offensive stat is multiplied by 1.5 while using an Electric-type attack.",
		shortDesc: "Moves ignore the Abilities of Pokemon. Offensive stat is 1.5x while using Electric moves.",
	},
	thermalexchange: {
        onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				this.add('-immune', target, '[from] ability: Thermal Exchange');
                this.boost({atk: 1});
				return null;
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Thermal Exchange');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Thermal Exchange');
			}
			return false;
		},
		name: "Thermal Exchange",
		rating: 4,
		num: 270,
        desc: "This Pokemon's Attack is raised 1 stage after it is hit by a Fire-type move. This Pokemon is immune to Fire moves. and this Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's This Pokemon's Attack is raised by 1 when hit by Fire moves; Immune to Fire.",
	},
	torrent: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			} else {
                this.debug('Torrent boost');
				return this.chainModify(1.2);
            }
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			} else {
                this.debug('Torrent boost');
				return this.chainModify(1.2);
            }
		},
		rating: 3,
		desc: "This Pokemon's offensive stat is multiplied by 1.2 while using a Water-type attack. When this Pokemon has 1/3 or less of its maximum HP, rounded down, this bonus increases to 1.5",
        shortDesc: "Offensive stat is 1.2x when using a Water-type move; increases to 1.5x at 1/3 HP or less.",
	},
	toxicboost: {
        inherit: true,
        onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				return false;
			}
		},
        desc: "This Pokemon is immune to damage from being poisoned, and while this Pokemon is poisoned the power of its physical attacks is multiplied by 1.5.",
		shortDesc: "Immunity to poison damage; While poisoned, physical attacks have 1.5x power.",
	},
	
	transistor: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify(1.5);
			}
		},
		shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using an Electric-type attack.",
	},
	
	truant: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				if (move.category !== 'Status') {
					this.add('cant', pokemon, 'ability: Truant');
					return false;
				}
				return true;
			}
			pokemon.addVolatile('truant');
		},
        shortDesc: "This Pokemon can only use status moves every other turn.",
	},
	turboblaze: {
		inherit: true,
        onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Turboblaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Turboblaze boost');
				return this.chainModify(1.5);
			}
		},
		rating: 4.5,
        desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon. This Pokemon's offensive stat is multiplied by 1.5 while using a Fire-type attack.",
		shortDesc: "Moves ignore the Abilities of Pokemon. Offensive stat is 1.5x while using Fire moves.",
	},
	watercompaction: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({def: 2})) {
					this.add('-immune', target, '[from] ability: Water Compaction');
				}
				return null;
			}
		},
		isBreakable: true,
		name: "Water Compaction",
        shortDesc: "This Pokemon's Defence is raised 2 stages if hit by a Water move; Water immunity.",
		rating: 3.5,
		num: 195,
	},
	waterveil: {
		onModifyDefPriority: 6,
        onModifyDef(def) {
            if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.25);
			}
			
		},
        onModifySpdPriority: 6,
        onModifySpd(spd) {
            if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.25);
			}
			
		},
		isBreakable: true,
		name: "Water Veil",
        desc: "If Rain Dance is active, this Pokemon's Defence and Special Defence is multiplied by 1.25x.",
		shortDesc: "If Rain is active, this Pokemon's Def and Sp. Def is 1.25x",
		rating: 3,
		num: 41,
	},
	windpower: {
        onStart(pokemon) {
			if (pokemon.side.sideConditions['tailwind']) {
				this.boost({spa: 1}, pokemon, pokemon);
			}
		},
		onDamagingHitOrder: 1,
        onTryHit(target, source, move) {
			if (target !== source && move.flags['wind']) {
				if (!this.boost({spa: 1}, target, target)) {
					this.add('-immune', target, '[from] ability: Wind Power');
				}
				return null;
			}
		},
		onAllySideConditionStart(target, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				this.boost({spa: 1}, pokemon, pokemon);
			}
		},
		rating: 3.5,
		name: "Wind Power",
        desc: "This Pokemon is immune to wind moves and raises its Special Attack by 1 stage when hit by a wind move or when Tailwind begins on this Pokemon's side.",
		shortDesc: "Special Attack raised by 1 if hit by a wind move or Tailwind begins. Wind move immunity.",
		num: 277,
	},
	wonderguard: {
        inherit: true,
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
            if (target.terastallized) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-immune', target, '[from] ability: Wonder Guard');
				}
				return null;
			}
		},
        shortDesc: "This Pokemon is only damaged by supereffective moves/indirect damage unless Terastlized.",
	},
	wonderskin: {
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source) {
				this.add('-immune', target, '[from] ability: Wonder Skin');
				return null;
			}
		},
		isBreakable: true,
		name: "Wonder Skin",
        shortDesc: "This Pokemon is immune to Status moves.",
		rating: 5,
		num: 147,
	},
	
	// Custom
	mountaineer: {
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Rock') {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
		isBreakable: true,
		name: "Mountaineer",
        shortDesc: "This Pokemon is immune to Rock-type attacks, including Stealth Rock.",
		rating: 3.5,
		num: -2,
	},
	rebound: {
		name: "Rebound",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, source);
			return null;
		},
		condition: {
			duration: 1,
		},
		isBreakable: true,
		rating: 4,
		num: -3,
        desc: "This Pokemon is unaffected by certain non-damaging moves directed at it and will instead use such moves against the original user. Moves reflected in this way are unable to be reflected again by this or Magic Coat's effect. Spikes, Stealth Rock, Sticky Web, and Toxic Spikes can only be reflected once per side, by the leftmost Pokemon under this or Magic Coat's effect. The Lightning Rod and Storm Drain Abilities redirect their respective moves before this Ability takes effect.",
		shortDesc: "This Pokemon blocks certain Status moves and bounces them back to the user.",
	},
	persistent: {
		name: "Persistent",
		// implemented in the corresponding move
		rating: 3,
		num: -4,
        desc: "The duration of Gravity, Heal Block, Magic Room, Safeguard, Tailwind, Trick Room, and Wonder Room is increased by 2 turns if the effect is started by this Pokemon.",
		shortDesc: "When used, Gravity/Heal Block/Safeguard/Tailwind/Room effects last 2 more turns.",

		activate: "  [POKEMON] extends [MOVE] by 2 turns!",
	},
    amplifier: {
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Amplifier boost');
				return this.chainModify([5325, 4096]);
			}
		},
		name: "Amplifier",
		rating: 3,
		num: -5,
        shortDesc: "This Pokemon's sound-based moves have their power boosted by 1.3x.",
	},
    timewarp: {
		name: "Time Warp",
        onStart(pokemon) {
			pokemon.lastItem = (pokemon.item);
		},
        onSwitchOut(pokemon) {
            if (pokemon.hp && pokemon.item !=pokemon.lastItem) {
                pokemon.setItem(pokemon.lastItem);
                this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Time Warp');
            }
		},
		rating: 3,
		num: -6,
        shortDesc: "When switching out, this pokemon restores the held item it had on switch in",
	},
    auraofruin: {
		onModifyDamage(damage, source, target, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				return this.chainModify([5120, 4096]);
			}
		},
		name: "Aura of Ruin",
		rating: 2.5,
		num: -6,
        shortDesc: "This Pokemon's attacks that are super effective against the target do 1.25x damage.",
	},
    reaper: {
		onAnyFaintPriority: 1,
		onAnyFaint(source) {
            this.heal(source.baseMaxhp / 3, this.effectState.target);
		},
		name: "Reaper",
		rating: 3,
		num: -7,
        shortDesc: "Whenever a pokemon faints, recover 1/3 of the fainted pokemon maximum HP.",
        activate: "  [POKEMON] abosrbed some of the life essence of the fallen to heal itself",
	},
    excavate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Ground';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		name: "Excavate",
		rating: 4,
		num: -8,
        shortDesc: "This Pokemon's Normal-type moves become Ground type and have 1.3x power.",
	},
    guardiansofalola: {
		name: "Guardians of Alola",
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== this.effectState.target && target.isAlly(this.effectState.target)) {
				this.debug('Guardians of Alola weaken');
				return this.chainModify(0.75);
			}
		},
		isBreakable: false,
		rating: 0,
		num: -9,
        shortDesc: "This Pokemon's allies receive 3/4 damage from other Pokemon's attacks.",
	},
    calmingtides: {
		desc: "Water-type Pokemon on this Pokemon's side cannot have their stat stages lowered by other Pokemon or have a major status condition inflicted on them by other Pokemon.",
		shortDesc: "This side's Water types can't have stats lowered or status inflicted by other Pokemon.",
		onAllyBoost(boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Water')) return;
			let showMsg = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				const effectHolder = this.effectData.target;
				this.add('-block', target, 'ability: Calming Tides', '[of] ' + effectHolder);
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if (target.hasType('Water') && source && target !== source && effect && effect.id !== 'yawn') {
				this.debug('interrupting setStatus with Calming Tides');
				if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					const effectHolder = this.effectData.target;
					this.add('-block', target, 'ability: Calming Tides', '[of] ' + effectHolder);
				}
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (target.hasType('Water') && status.id === 'yawn') {
				this.debug('Calming Tides blocking yawn');
				const effectHolder = this.effectData.target;
				this.add('-block', target, 'ability: Calming Tides', '[of] ' + effectHolder);
				return null;
			}
		},
		name: "Calming Tides",
		rating: 4,
        num: -10,
	},
    nemesis: {
        desc: "On switch-in, this Pokemon uses Psych Up, targeting the pokemon opposite this one in battle.",
		shortDesc: "On switch-in, this Pokemon uses Psych Up.",
		onStart(pokemon) {
			this.actions.useMove('psychup', pokemon);
		},
		name: "Nemesis",
		rating: 4,
        num: -11,
	},
    mentalize: {
		desc: "This Pokemon's Normal-type moves become Psychic-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Psychic type and have 1.3x power.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Psychic';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		name: "Mentalize",
		rating: 4,
        num: -12,
	},
    awakenedmind: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Psychic') {
				this.debug('Awakened mind boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Psychic') {
				this.debug('Awakened mind boost');
				return this.chainModify(1.5);
			}
		},
        name: "Awakened Mind",
        shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Psychic-type attack.",
		rating: 3.5,
        num: -13,
	},
    tribond: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.selfdestruct || move.multihit) return;
			if (['dynamaxcannon', 'endeavor', 'fling', 'iceball', 'rollout'].includes(move.id)) return;
			if (!move.flags['charge'] && !move.isZ && !move.isMax) {
                move.tribondBoosted = this.effect;
				move.multihit = 3;
			}
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'tribondBoosted' && move.id === 'secretpower' && move.hit < 3) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
        onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.tribondBoosted === this.effect) return this.chainModify([2, 5]);
		},
        desc: "This Pokemon's damaging moves become multi-hit moves that hit three times. Each hit does 40% damage. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit thrice. Each hit hit does 40% damage.",
		name: "Tribond",
		rating: 4.5,
		num: -14,
	},
    hypnoticsuggestion: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (defender.status === 'slp') {
				return this.chainModify(1.5);
			}
		},
		name: "Hypnotic Suggestion",
		rating: 2.5,
		num: -15,
		shortDesc: "This Pokemon's move power is multiplied by 1.5 when attacking a sleeping target.",
	},
    unstable: {
		shortDesc: "When this pokemon faints, it uses Explosion.",
		onFaint(pokemon) {
			this.actions.useMove('explosion', pokemon);
		},
		name: "Unstable",
		rating: 3,
        num: -16,
	},
    steeltoe: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['kick']) {
				this.debug('Steel Toe boost');
				return this.chainModify([5325, 4096]);
			}
		},
		name: "Steel Toe",
		rating: 3,
		num: -17,
        desc: "This Pokemon's kick-based attacks have their power multiplied by 1.3.",
		shortDesc: "This Pokemon's kick-based attacks have 1.3x power.",
	},
    blitzboxer: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.flags['punch']) return priority + 1;
		},
		name: "Blitz Boxer",
		rating: 3,
		num: -18,
        shortDesc: "This Pokemon's Punching moves have their priority increased by 1.",
	},
    deepfreeze: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice') {
				this.debug('Deep Freeze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice') {
				this.debug('Deep Freeze boost');
				return this.chainModify(1.5);
			}
		},
		isBreakable: true,
		name: "Deep Freeze",
		rating: 3.5,
		num: -19,
        shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using an Ice-type attack.",
	},
    lightpower: {
		shortDesc: "This Pokemon's Attack and Special Attack are doubled.",
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
            return this.chainModify(2);
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
            return this.chainModify(2);
		},
		name: "Light Power",
        rating: 5,
		num: -20,
	},
    proteanmaxima: {
		desc: "This Pokemon's Defence and Special Defence is mulitplied by 1.5. This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type. This effect can only happen if this Pokemon is not Terastallized.",
		shortDesc: "1.5x Def and Sp. Def. This Pokemon's type changes to the type of the move it is using.",
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(1.5);
		},
		onModifySpaPriority: 6,
		onModifySpa(spa) {
			return this.chainModify(1.5);
		},
        onPrepareHit(source, target, move) {
			if (move.hasBounced || move.isFutureMove || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean Maxima');
			}
		},
		name: "Protean Maxima",
        rating: 5,
		num: -21,
	},
    shininggold: {
        Desc: "This Pokemon's Attack, Defence, Special Attack, and Special Defence is multiplied by 1.3.",
		shortDesc: "This Pokemon's Atk, Def, Sp. Atk, and Sp. Def is 1.3x.",
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
            return this.chainModify(1.3);
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
            return this.chainModify(1.3);
		},
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(1.3);
		},
		onModifySpaPriority: 6,
		onModifySpa(spa) {
			return this.chainModify(1.3);
		},
		name: "Shining Gold",
        rating: 5,
		num: -22,
	},
    psychokinesis: {
		shortDesc: "This Pokemon's Psychic type attacks always result in a critical hit.",
        onModifyMove(move) {
            if (move.type === 'Psychic') {
                move.willCrit = true;
            }
		},
		name: "Psychokinesis",
        rating: 3,
		num: -23,
	},
    runicpower: {
		desc: "Hidden Power used by this pokemon has a base power of 100. This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type. This effect can only happen if this Pokemon is not Terastallized.",
		shortDesc: "Hidden Power is 100bp. Type changes to the type of the move it is using.",
        onPrepareHit(source, target, move) {
			if (move.hasBounced || move.isFutureMove || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Ruinic Power');
			}
		},
		name: "Runic Power",
        rating: 5,
		num: -24,
	},
    seaguardian: {
        shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Water-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Sea Guardian boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Sea Guardian boost');
				return this.chainModify(1.5);
			}
		},
		name: "Sea Guardian",
		rating: 3.5,
		num: -25,
	},
    pheonix: {
		onSwitchIn(pokemon, source, effect) {
			if (!pokemon.side.totalFainted) return;
            if (pokemon.abilityState.pheonixTriggered) return;
			this.actions.useMove('revivalblessing', pokemon);
            pokemon.abilityState.pheonixTriggered = true;	
		},
		isPermanent: true,
		name: "Pheonix",
		gen: 9,
        num: -26,
		rating: 5,
		desc: "Once per battle, if one of this pokemon's allies has fainted, this pokemon will use revival blessing on switch in.",
		shortDesc: "Once per battle, on switch in, uses Revival Blessing if this pokemon has any fainted allies.",
	},
    doublejaw: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.selfdestruct || move.multihit || !move.flags['bite']) return;
			if (['dynamaxcannon', 'endeavor', 'fling', 'iceball', 'rollout'].includes(move.id)) return;
			if (!move.flags['charge'] && !move.isZ && !move.isMax) {
                move.doubleJawBoosted = this.effect;
				move.multihit = 2;
			}
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'doubleJaw' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
        desc: "This Pokemon's Bite-based damaging moves become multi-hit moves that hit two times. Does not affect multi-hit moves.",
		shortDesc: "This Pokemon's Bite-based damaging moves hit twice.",
		name: "Double Jaw",
		rating: 4.5,
		num: -27,
	},
    plasmaarc: {
        shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Fire-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Plasma Arc boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Plasma Arc boost');
				return this.chainModify(1.5);
			}
		},
		name: "Plasma Arc",
		rating: 3.5,
		num: -28,
	},
    fabulous: {
        desc: "Priority moves used by opposing Pokemon targeting this Pokemon are prevented from having an effect. If a Pokemon uses a Fairy-type attack against this Pokemon, that Pokemon's offensive stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "This Pokemon is protected from foe's priority moves; half damage from Fairy moves.",
		onFoeTryMove(target, source, move) {
            if (move.target === 'foeSide') return;
			if ((move.priority > 0.1) && !(move.name === 'perishsong') && !(move.name === 'flowershield') && !(move.name === 'rototiller')) {
				this.attrLastMove('[still]');
				this.add('cant', target, 'ability: Fabulous', move, '[of] ' + target);
				return false;
			}
		},
        onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fairy') {
				this.debug('Fabulous weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(spa, attacker, defender, move) {
			if (move.type === 'Fairy') {
				this.debug('Fabulous weaken');
				return this.chainModify(0.5);
			}
		},
		isBreakable: true,
		name: "Fabulous",
		rating: 3.5,
		num: -29,
	},
    spin2win: {
        desc: "On switch-in, this Pokemon uses Rapid Spin, targeting the pokemon opposite this one in battle.",
		shortDesc: "On switch-in, this Pokemon uses Rapid Spin.",
		onStart(pokemon) {
			this.actions.useMove('rapidspin', pokemon);
		},
		name: "Spin 2 Win",
		rating: 3.5,
        num: -30,
	},
    fatalprecision: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (defender.runEffectiveness(move) > 0) {
				this.debug('Fatal Precision boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onModifyMove(move, pokemon, target) {
			if (target && target.runEffectiveness(move) > 0) {
				move.accuracy = true;
			}
		},
		name: "Fatal Precision",
		rating: 3,
		shortDesc: "Super Effective Moves from this Pokemon can’t miss and receive a 20% damage boost.",
        num: -31,
	},
    solarsymbol: {
        shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Fire-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Solar Symbol boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Solar Symbol boost');
				return this.chainModify(1.5);
			}
		},
		name: "Solar Symbol",
		rating: 3.5,
		num: -32,
	},
    lunarsymbol: {
        shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Fairy-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fairy') {
				this.debug('Lunar Symbol boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fairy') {
				this.debug('Lunar Symbol boost');
				return this.chainModify(1.5);
			}
		},
		name: "Lunar Symbol",
		rating: 3.5,
		num: -33,
	},
    aura: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
            if (attacker.hp = 1 ) {
				this.debug('Aura boost');
				return this.chainModify(2);
			} else if (attacker.hp <= attacker.maxhp * 0.1 ) {
				this.debug('Aura boost');
				return this.chainModify(1.9);
			} else if (attacker.hp <= attacker.maxhp * 0.2) {
                this.debug('Aura boost');
				return this.chainModify(1.8);
            } else if (attacker.hp <= attacker.maxhp * 0.3) {
                this.debug('Aura boost');
				return this.chainModify(1.7);
            } else if (attacker.hp <= attacker.maxhp * 0.4) {
                this.debug('Aura boost');
				return this.chainModify(1.6);
            } else if (attacker.hp <= attacker.maxhp * 0.5) {
                this.debug('Aura boost');
				return this.chainModify(1.5);
            } else if (attacker.hp <= attacker.maxhp * 0.6) {
                this.debug('Aura boost');
				return this.chainModify(1.4);
            } else if (attacker.hp <= attacker.maxhp * 0.7) {
                this.debug('Aura boost');
				return this.chainModify(1.3);
            } else if (attacker.hp <= attacker.maxhp * 0.8) {
                this.debug('Aura boost');
				return this.chainModify(1.2);
            } else if (attacker.hp <= attacker.maxhp * 0.9) {
                this.debug('Aura boost');
				return this.chainModify(1.1);
            } else {
                this.debug('Aura boost');
				return this.chainModify(1);
            }
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, attacker, defender, move) {
            if (attacker.hp = 1 ) {
				this.debug('Aura boost');
				return this.chainModify(2);
			} else if (attacker.hp <= attacker.maxhp * 0.1 ) {
				this.debug('Aura boost');
				return this.chainModify(1.9);
			} else if (attacker.hp <= attacker.maxhp * 0.2) {
                this.debug('Aura boost');
				return this.chainModify(1.8);
            } else if (attacker.hp <= attacker.maxhp * 0.3) {
                this.debug('Aura boost');
				return this.chainModify(1.7);
            } else if (attacker.hp <= attacker.maxhp * 0.4) {
                this.debug('Aura boost');
				return this.chainModify(1.6);
            } else if (attacker.hp <= attacker.maxhp * 0.5) {
                this.debug('Aura boost');
				return this.chainModify(1.5);
            } else if (attacker.hp <= attacker.maxhp * 0.6) {
                this.debug('Aura boost');
				return this.chainModify(1.4);
            } else if (attacker.hp <= attacker.maxhp * 0.7) {
                this.debug('Aura boost');
				return this.chainModify(1.3);
            } else if (attacker.hp <= attacker.maxhp * 0.8) {
                this.debug('Aura boost');
				return this.chainModify(1.2);
            } else if (attacker.hp <= attacker.maxhp * 0.9) {
                this.debug('Aura boost');
				return this.chainModify(1.1);
            } else {
                this.debug('Aura boost');
				return this.chainModify(1);
            }
		},
        shortDesc: "This Pokemon's offensive stat is increased by 10% for every 10% HP it is missing.",
		name: "Aura",
		rating: 3,
		num: -34,
	},
    temporalinvertion: {
		shortDesc: "On switch-in, this Pokemon uses Trick Room.",
		onStart(pokemon) {
			this.actions.useMove('trickroom', pokemon);
		},
		name: "Temporal Invertion",
		rating: 5,
        num: -35,
	},
    spacialwarp: {
        onModifySecondaries(secondaries) {
			this.debug('Spacial Warp prevent secondary');
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
		name: "Spacial Warp",
		rating: 2.5,
		num: -36,
        shortDesc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack.",
	},
    gravitymagnification: {
		shortDesc: "On switch-in, this Pokemon uses Gravity.",
		onStart(pokemon) {
			this.actions.useMove('gravity', pokemon);
		},
		name: "Gravity Magnification",
		rating: 4,
        num: -37,
	},
    distortion: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Distortion neutralize');
				return this.chainModify(0.5);
			}
		},
		name: "Distortion",
		rating: 5,
		num: -38,
        shortDesc: "This Pokemon receives 1/2 damage from supereffective attacks.",
	},
    distortreality: {
		shortDesc: "On switch-in, this Pokemon uses Wonder Room, and Magic Room.",
		onStart(pokemon) {
			this.actions.useMove('wonderroom', pokemon);
			this.actions.useMove('magicroom', pokemon);
		},
		name: "Distort Reality",
		rating: 4,
        num: -39,
	},
    blazingsoul: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Fire') return priority + 1;
		},
		name: "Blazing Soul",
		rating: 4,
        num: -40,
		shortDesc: "This Pokemon's Fire-type moves have their priority increased by 1.",
	},
    icysoul: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Ice') return priority + 1;
		},
		name: "Icy Soul",
		rating: 4,
        num: -41,
		shortDesc: "This Pokemon's Ice-type moves have their priority increased by 1.",
	},
    parasiticwaste: {
		onModifyMove(move) {
			if (!move.secondaries) return;
			for (const secondary of move.secondaries) {
				if ((move.category !== 'Status') && (secondary.status === 'psn' || secondary.status === 'tox')) {
					move.drain = [1, 2];
					move.parasiticWasteBoosted = true;
				}
			}
		},
		onTryHeal(damage, target, source, effect) {
			if (effect?.id === 'drain' && this.activeMove?.parasiticWasteBoosted) {
				this.add('-activate', target, 'ability: Parasitic Waste');
			}
		},
		name: "Parasitic Waste",
		num: -42,
		rating: 2.5,
		shortDesc: "Attacks that can poison also heal for 50% of the damage dealt.",
	},
    ambidextrous: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.selfdestruct || !move.flags['contact']) return;
			if (['dynamaxcannon', 'endeavor', 'fling', 'iceball', 'rollout'].includes(move.id)) return;
			if (!move.flags['charge'] && !move.isZ && !move.isMax) {
                move.ambidextrousBoosted = this.effect;
				move.multihit = 2;
			}
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'ambidextrousBoosted' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
        onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.ambidextrousBoosted === this.effect) return this.chainModify([3, 4]);
		},
        desc: "This Pokemon's contact moves become multi-hit moves that hit two times. Each hit does 75% damage.",
		shortDesc: "This Pokemon's contact moves hit twice. Each hit hit does 75% damage.",
		name: "Ambidextrous",
		rating: 4,
		num: -43,
	},
    mentalfists: {
		onModifyMove(move) {
            if (move.category === 'Physical') {
				move.overrideOffensiveStat = spa;
			}
		},
		name: "Mental Fists",
		rating: 2.5,
		num: -44,
        desc: "Damage for this Pokemon's physical moves is calculated using the user's Special Attack stat regardless of what stat would normally be used, including stat stage changes.",
		shortDesc: "This Pokemon's physical moves use the user's SpA stat as in damage calculation.",
	},
    seasonsurge: {
       onBasePowerPriority: 19,
       onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Grass') {
				this.debug('Season Surge boost');
				return this.chainModify(1.3);
			} else if (attacker.species.id === 'sawsbuck' && move.type === 'Fairy') {
                this.debug('Season Surge boost');
				return this.chainModify(1.3);
            } else if (attacker.species.id === 'sawsbucksummer' && move.type === 'Fire') {
                this.debug('Season Surge boost');
				return this.chainModify(1.3);
            } else if (attacker.species.id === 'sawsbuckautumn' && move.type === 'Dark') {
                this.debug('Season Surge boost');
				return this.chainModify(1.3);
            } else if (attacker.species.id === 'sawsbuckwinter' && move.type === 'Ice') {
                this.debug('Season Surge boost');
				return this.chainModify(1.3);
            } else {
                return;
			}
		},
		name: "Season Surge",
		rating: 3.5,
		num: -45,
        desc: "The power of this Pokemon's Grass type moves is multiplied by 1.3 and a moves of a type depending on the user's form: Spring - Fairy, Summer - Fire, Autumn - Dark, Winter - Ice",
		shortDesc: "Grass power is 1.3x. Form dictates another 1.3x boost: Sp-Fairy, Su-Fire, A-Dark, W-Ice.",
	},
    deepfocus: {
		shortDesc: "On switch in, this Pokemon's crit ratio is raised by 2 until it is damaged by an attack.",
        activate: "  [POKEMON] lost it's focus!",
        onStart(pokemon) {
			let deepFocus = true;
		},
        onDamagingHit(damage, target, source, move) {
			if (target.hp) {
				deepFocus = false;
                this.add('-ability', pokemon, 'Deep Focus');
			}
		},
		onModifyCritRatio(critRatio, source, target) {
			if (deepFocus === true) return critRatio + 2;
		},
		name: "Deep Focus",
		rating: 2,
        num: -46,
	},
    aquatic: {
		shortDesc: "On switch in, this pokemon gains the Water Typing.",
        onStart(pokemon) {
			this.add('-start', pokemon, 'typeadd', 'Water', '[from] ability: Aquatic');
		},
		name: "Aquatic",
		rating: 3,
        num: -47,
	},
    contacttrap: {
        shortDesc: "When a pokemon makes contact with this Pokemon, this Pokemon uses Snap Trap.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.actions.useMove('contacttrap', pokemon);
			}
		},
		name: "Contact Trap",
		rating: 3,
		num: -48,
	},
    bullrush: {
		onModifyAtk(atk, attacker, defender, move) {
			if (attacker.activeMoveActions > 1) return;
			this.debug('Bull Rush attack boost');
			return this.chainModify(1.5);
		},
		onModifySpe(spe, pokemon) {
			// probably not > 1 because speed is determined before the move action is run
			if (pokemon.activeMoveActions > 0) return;
			return this.chainModify(1.5);
		},
		name: "Bull Rush",
		rating: 4,
		num: -49,
		desc: "On the first turn this Pokemon is out on the field for, it gets a 1.5x Boost to Attack and Speed.",
		shortDesc: "On first turn out, 1.5x Attack and Speed.",
	},
    truthseaker: {
		onStart(pokemon) {
			for (const target of pokemon.foes()) {
				if (target.item) {
					this.add('-item', target, target.getItem().name, '[from] ability: Truthseaker', '[of] ' + pokemon, '[identify]');
				}
                for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, pokemon) > 0 ||
						move.ohko
					) {
						this.add('-ability', pokemon, 'Truthseaker');
						return;
					}
				}
			}
		},
        onTryHit(target, source, move) {
			if (target !== source && target.isAlly(source) && move.category !== 'Status') {
				this.add('-activate', target, 'ability: Truthseaker');
				return null;
			}
		},
        onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
        desc: "This Pokemon is alerted if any opposing Pokemon has an attack that is super effective against this Pokemon, or an OHKO move on switch in. This effect considers any move that deals direct damage as an attacking move of its respective type, Hidden Power counts as its determined type, and Judgment, Multi-Attack, Natural Gift, Revelation Dance, Techno Blast, and Weather Ball are considered Normal-type moves. This Pokemon does not take damage from attacks made by its allies. This Pokemon identifies the held items of all opposing Pokemon on switch in. This Pokemon can only be damaged by direct attacks.",
        shortDesc: "Switch In: Alerted to supereffective move/items. Immnue to ally attacks and indirect Damage.",
        activate: "#anticipation",
        block: "  [POKEMON] can't be hit by attacks from its ally Pok\u00E9mon!",
		name: "Truthseaker",
		rating: 5,
		num: -50,
	},
    idealist: {
		name: "Idealist",
        onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Idealist');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Idealist');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Idealist');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
        onModifyMove(move) {
			move.ignoreAbility = true;
		},
		onImmunity(type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Idealist');
				return null;
			}
            if (target !== source && target.isAlly(source) && move.category !== 'Status') {
				this.add('-activate', target, 'ability: Idealist');
				return null;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Idealist', '[of] ' + target);
			} else if (effect.name === 'Pressure' && boost.spa) {
				delete boost.spa;
				this.add('-fail', target, 'unboost', 'Special Attack', '[from] ability: Idealist', '[of] ' + target);
			}
		},
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
                boosts['spe'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		rating: 5,
		num: -51,
        desc: "This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage. This Pokemon cannot be infatuated or taunted. Gaining this Ability while infatuated or taunted cures it. This Pokemon is immune to the effect of the Intimidate and Pressure Abilities. This Pokemon's moves and their effects ignore the Abilities of other Pokemon. This Pokemon does not take damage from attacks made by its allies. ",
		shortDesc: "Ignores foes stat stages + Abilitys. Immune: Attract, Taunt, Intimidate, Pressure, Ally Attacks",
        block: "  [POKEMON] can't be hit by attacks from its ally Pok\u00E9mon, Nor can it be Taunted, or Ifatuated!",
	},
    emptyvessel: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice') {
				this.debug('Empty Vessel boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice') {
				this.debug('Empty Vessel boost');
				return this.chainModify(1.5);
			}
		},
        onEffectiveness(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Ice' && typeMod > 0) {
				this.add('-activate', target, 'ability: Empty Vessel');
				return 0;
			}
		},
		name: "Empty Vessel",
		rating: 4.5,
		num: -52,
        start: "The chilling void draws closer!",
        activate: "The chilling void strengthens [POKEMON]\'s resistances",
        desc: "This Pokemon's offensive stat is multiplied by 1.5 while using an Ice-type attack, and has its weaknesses for Ice-type removed.",
        shortDesc: "Offensive stat is 1.5x when using an Ice-type attack; weaknesses for ice suppresed.",
	},
    antimiasmic: {
        onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Poison') {
				this.add('-immune', target, '[from] ability: Anti Miasmic');
                return null;
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Anti Miasmic');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Anti Miasmic');
			}
			return false;
		},
		isBreakable: true,
        shortDesc: "This Pokemon is immune to Poison type moves and the Poisoned Condition.",
		name: "Anti Miasmic",
		rating: 3,
		num: -53,
	},
    titanlord: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Steel') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Ice') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Dragon') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Electric') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Steel') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Ice') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Dragon') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Electric') {
				this.debug('Titan Lord boost');
				return this.chainModify(1.5);
			}
		},
		name: "Titan Lord",
		rating: 4.5,
		num: -54,
        shortDesc: "Offensive stat is 1.5x while using Rock, Steel, Ice, Dragon and Electric Moves",
	},
    geoforce: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Geoforce boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Geoforce boost');
				return this.chainModify(1.5);
			}
		},
		name: "Geoforce",
		rating: 3.5,
		num: -55,
        shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Rock-type attack.",
	},
    riftmaster: {
		onModifyMove(move) {
			delete move.flags['protect'];
            delete move.flags['contact'];
            if (move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				boosts: {
                    spd: -1,
                    def: -1,
                },
				ability: this.dex.abilities.get('riftmaster'),
			});
		},
		name: "Riftmaster",
		rating: 4,
		num: -56,
        desc: "This Pokemon's attacks do not make contact with the target and ignore the target's protection, except Max Guard. This Pokemon's moves gain a 30% chance to lower the foe(s) Defence and Special Defence by 1.",
        shortDesc: "User's moves bypass Contact, Protection, and may (30%) lower foe(s) Def/SpD by 1.",
	},
};
