export const Abilities: {[abilityid: string]: ModdedAbilityData} = {
	asonetorkoal: {
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spe: 1});
			}
		},
		onStart(source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'groudon') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('sunnyday');
		},
		name: "As One (Torkoal)",
		shortDesc: "The combination of Drought and Speed Boost.",
	},
	asonetentacruel: {
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onStart(source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'kyogre') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('raindance');
		},
		name: "As One (Tentacruel)",
		shortDesc: "The combination of Drizzle and Rain Dish.",
	},
	asonegigalith: {
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
		onStart(source) {
			this.field.setWeather('sandstorm');
		},
		name: "As One (Gigalith)",
		shortDesc: "The combination of Sand Stream and Sand Force.",
	},
	asonebeartic: {
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
		},
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('hail')) {
				return this.chainModify(2);
			}
		},
		onStart(source) {
			this.field.setWeather('hail');
		},
		name: "As One (Beartic)",
		shortDesc: "The combination of Snow Warning and Slush Rush.",
	},
};
