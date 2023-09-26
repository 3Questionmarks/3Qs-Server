export const Conditions: {[k: string]: ConditionData} = {
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'par');
			}
		},
		onModifySpe(spe, pokemon) {
			// Paralysis occurs after all other Speed modifiers, so evaluate all modifiers up to this point first
			spe = this.finalModify(spe);
			if (!pokemon.hasAbility('quickfeet')) {
				spe = Math.floor(spe * 50 / 100);
			}
			return spe;
		},
        onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
        },
        startFromItem: "  [POKEMON] was paralyzed by the [ITEM]!",
        damage: "  [POKEMON] was hurt by its paralysis!",
    },
    slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
        onModifyDef(def, pokemon) {
			def = this.finalModify(def);
			def = Math.floor(def * 75 / 100);
			return def;
		},
        onModifySpD(spd, pokemon) {
			spd = this.finalModify(spd);
			spd = Math.floor(spd * 75 / 100);
			return spd;
		},
        onModifyAtk(atk, pokemon) {
			atk = this.finalModify(atk);
			atk = Math.floor(atk * 75 / 100);
			return atk;
		},
        onModifySpA(spa, pokemon) {
			spa = this.finalModify(spa);
			spa = Math.floor(spa * 75 / 100);
			return spa;
		},
	},
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'frz');
			}
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}
		},
		onModifySpA(spa, pokemon) {
			spa = this.finalModify(spa);
			spa = Math.floor(spa * 75 / 100);
			return spa;
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
        startFromItem: "  [POKEMON] was frozen by the [ITEM]!",
        damage: "  [POKEMON] was hurt by its frostbite!",
	},
	gem: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify([3, 2]);
		},
	},

	// weather is implemented here since it's so important to the game

	hail: {
		inherit: true,
        onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice') && this.field.isWeather('Hail')) {
				return this.modify(def, 1.5);
			}
		},
	},
	snow: {
		inherit: true,
        onWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
        damage: "  [POKEMON] is buffeted by the snow!",
	},
};
