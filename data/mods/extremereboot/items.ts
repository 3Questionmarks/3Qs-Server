export const Items: {[itemid: string]: ItemData} = {
	bloodvial: {
		name: "Blood Vial",
		num: 1001,
		desc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP and Poisons the attacker.",
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				if (target.useItem()) {
					source.trySetStatus('psn', target);
					return target.hp - 1;
				}
			}
		},
		num: 275,
		gen: 4,
		gen: 8,
	},
	calmingsalt: {
		name: "Calming Salt",
		num: 1002,
		desc: "Clear any status. Single use.",
		onAfterSetStatus(status, pokemon) {
			pokemon.eatItem();
		},
		onUpdate(pokemon) {
			if (pokemon.status || pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
		},
		gen: 8,
	},
	cursedorb: {
		name: "Cursed Orb",
		num: 1003,
		desc: "Does nothing. If this item is disturbed or passed on to a different holder, said holder will lose 1/8th of their max HP per turn.",
		gen: 8,
	},
	emblematicscarf: {
		name: "Emblematic Scarf",
		num: 1004,
		desc: "Holder's Speed is 1.5x, but it can only select moves that match the holder's primary type (including status moves).",
		gen: 8,
	},
	enigmaticshield: {
		name: "Enigmatic Shield",
		num: 1005,
		desc: "Reduces damage taken from Supereffective attakcs by 25%.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				return this.chainModify(0.75);
			}
		},
		gen: 8,
	},
	fellscythe: {
		name: "Fell Scythe",
		num: 1006,
		desc: "The holder's moves have 1.3x power, but it loses 1/10 of its max HP after successfully damaging an opponent with a move. Instead restores 1/16 max HP if the holder is an Autumn type.",
		onModifyDamage(damage, source, target, move) {
			if (!(pokemon.hasType("Autumn"))) return this.chainModify([0x14CC, 0x1000]);
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (pokemon.hasType("Autumn")) return;
			if (source && source !== target && move && move.category !== 'Status') {
				this.damage(source.baseMaxhp / 10, source, source, this.dex.getItem('fellscythe'));
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hasType("Autumn")) this.heal(pokemon.baseMaxhp / 16);
		},
		gen: 8,
	},
	gospelnotes: {
		name: "Gospel Notes",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				// any moves that don't get modified, for instance those that can change type
			];
			if (move.flags['sound'] && !noModifyType.includes(move.id)) {
				move.type = 'Serenity';
			}
		},
		num: 1007,
		desc: "This Pokemon's sound moves become Serenity type.",
		gen: 8,
	},
	lifegem: {
		name: "Life Gem",
		num: 1008,
		desc: "Recover 10% of your max HP when using an attacking move.",
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status') {
				this.heal(source.baseMaxhp / 10);
			}
		},
		gen: 8,
	},
	maiddress: {
		name: "Maid Dress",
		num: 1009,
		desc: "Increases the power of all moves used by active pokemon by 1.3x",
		onModifyDamage(damage, source, target, move) {
			return this.chainModify([0x14CC, 0x1000]);
		},
		onSourceModifyDamage(damage, source, target, move) {
			return this.chainModify([0x14CC, 0x1000]);
		},
		gen: 8,
	},
	metalmorph: {
		name: "Metalmorph",
		num: 1010,
		desc: "Grants the holder the Shield Dust effect. If the holder is Manmade, they also gain 1.2x Attack.",
		onModifySecondaries(secondaries) {
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hasType("Manmade")) return this.chainModify(1.2);
		},
		gen: 8,
	},
	pokemonstandard: {
		name: "Pokemon Standard",
		num: 1011,
		desc: "This Pokémon's STAB moves are boosted by 25%.",
		onModifyDamage(damage, source, target, move) {
			if (source.hasType(move.type)) return this.chainModify(1.25);
		},
		gen: 8,
	},
	powerstone: {
		name: "Power Stone",
		desc: "Boosts the power of the first move in the user's moveset by 1.3x. All of its other moves deal 0.9x damage.",
		num: 1012,
		gen: 8,
	},
	seasonsgem: {
		name: "Seasons Gem",
		num: 1013,
		desc: "Your first Spring, Summer, Autumn or Winter move will have its power multiplied by x1.5. Consumed when used.",
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			const seasons = ["Spring", "Summer", "Autumn", "Winter"];
			if (target === source || move.category === 'Status') return;
			if (seasons.includes(move.type) && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		gen: 8,
	},
	trickyhourglass: {//mostly coded in the field conditions themselves
		name: "Tricky Hourglass",
		num: 1014,
		desc: "Holder's moves and effects that last 4 or 5 turns last 8 turns instead, except Rules Rewrite, which lasts 2 turns.",
		gen: 8,
	},
};