export const Items: {[itemid: string]: ItemData} = {
	normalgem: {
		inherit: true,
		desc: "Holder's first successful Normal-type attack will have 1.5x power. Single use.",
	},
    poisongem: {
		inherit: true,
		desc: "Holder's first successful Poison-type attack will have 1.5x power. Single use.",
	},
    psychicgem: {
		inherit: true,
		desc: "Holder's first successful Psychic-type attack will have 1.5x power. Single use.",
	},
    rockgem: {
		inherit: true,
		desc: "Holder's first successful Rock-type attack will have 1.5x power. Single use.",
	},
    steelgem: {
		inherit: true,
		desc: "Holder's first successful Steel-type attack will have 1.5x power. Single use.",
	},
    watergem: {
		inherit: true,
		desc: "Holder's first successful Water-type attack will have 1.5x power. Single use.",
	},
    buggem: {
		inherit: true,
		desc: "Holder's first successful Bug-type attack will have 1.5x power. Single use.",
	},
    darkgem: {
		inherit: true,
		desc: "Holder's first successful Dark-type attack will have 1.5x power. Single use.",
	},
    dragongem: {
		inherit: true,
		desc: "Holder's first successful Dragon-type attack will have 1.5x power. Single use.",
	},
    electricgem: {
		inherit: true,
		desc: "Holder's first successful Electric-type attack will have 1.5x power. Single use.",
	},
    fairygem: {
		name: "Fairy Gem",
		desc: "Holder's first successful Fairy-type attack will have 1.5x power. Single use.",
		spritenum: 611,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Fairy' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 715,
	},
    fightinggem: {
		inherit: true,
		desc: "Holder's first successful Fighting-type attack will have 1.5x power. Single use.",
	},
    firegem: {
		inherit: true,
		desc: "Holder's first successful Fire-type attack will have 1.5x power. Single use.",
	},
    flyinggem: {
		inherit: true,
		desc: "Holder's first successful Flying-type attack will have 1.5x power. Single use.",
	},
    ghostgem: {
		inherit: true,
		desc: "Holder's first successful Ghost-type attack will have 1.5x power. Single use.",
	},
    grassgem: {
		inherit: true,
		desc: "Holder's first successful Grass-type attack will have 1.5x power. Single use.",
	},
    groundgem: {
		inherit: true,
		desc: "Holder's first successful Ground-type attack will have 1.5x power. Single use.",
	},
    icegem: {
		inherit: true,
		desc: "Holder's first successful Ice-type attack will have 1.5x power. Single use.",
	},
    
    inciniumz: {
		inherit: true,
		zMove: "Blazing Moonsault",
		zMoveFrom: "Inferno Slam",
		desc: "If held by an Incineroar with Inferno Slam, it can use Blazing Moonsault.",
	},
    
    // Custom Items
    
     butterite: {
        name: "Butterite",
        spritenum: 628,
        megaStone: "Butterfree-Mega",
        megaEvolves: "Butterfree",
        itemUser: ["Butterfree"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -3,
        gen: 9,
        desc: "If held by a Butterfree, this item allows it to Mega Evolve in battle.",
    },
    laprasite: {
        name: "Laprasite",
        spritenum: 583,
        megaStone: "Lapras-Mega",
        megaEvolves: "Lapras",
        itemUser: ["Lapras"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -5,
        gen: 9,
        desc: "If held by a Lapras, this item allows it to Mega Evolve in battle.",
    },
    snorlaxite: {
        name: "Snorlaxite",
        spritenum: 590,
        megaStone: "Snorlax-Mega",
        megaEvolves: "Snorlax",
        itemUser: ["Snorlax"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -6,
        gen: 9,
        desc: "If held by a Snorlax, this item allows it to Mega Evolve in battle.",
    },
    kinglerite: {
        name: "Kinglerite",
        spritenum: 629,
        megaStone: "Kingler-Mega",
        megaEvolves: "Kingler",
        itemUser: ["Kingler"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -7,
        gen: 9,
        desc: "If held by a Kingler, this item allows it to Mega Evolve in battle.",
    },
    corviknite: {
        name: "Corviknite",
        spritenum: 621,
        megaStone: "Corviknight-Mega",
        megaEvolves: "Corviknight",
        itemUser: ["Corviknight"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -8,
        gen: 9,
        desc: "If held by a Corviknight, this item allows it to Mega Evolve in battle.",
    },
    sandacite: {
        name: "Sandacite",
        spritenum: 602,
        megaStone: "Sandaconda-Mega",
        megaEvolves: "Sandaconda",
        itemUser: ["Sandaconda"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -9,
        gen: 9,
        desc: "If held by a Sandaconda, this item allows it to Mega Evolve in battle.",
    },
    hatterenite: {
        name: "Hatterenite",
        spritenum: 587,
        megaStone: "Hatterene-Mega",
        megaEvolves: "Hatterene",
        itemUser: ["Hatterene"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -10,
        gen: 9,
        desc: "If held by a Hatterene, this item allows it to Mega Evolve in battle.",
    },
    orbite: {
        name: "Orbite",
        spritenum: 588,
        megaStone: "Orbeetle-Mega",
        megaEvolves: "Orbeetle",
        itemUser: ["Orbeetle"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -11,
        gen: 9,
        desc: "If held by an Orbeetle, this item allows it to Mega Evolve in battle.",
    },
    flappnite: {
        name: "Flappnite",
        spritenum: 613,
        megaStone: "Flapple-Mega",
        megaEvolves: "Flapple",
        itemUser: ["Flapple"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -12,
        gen: 9,
        desc: "If held by a Flapple, this item allows it to Mega Evolve in battle.",
    },
    appleite: {
        name: "Appleite",
        spritenum: 613,
        megaStone: "AppletunAppletun-Mega",
        megaEvolves: "Appletun",
        itemUser: ["Appletun"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -13,
        gen: 9,
        desc: "If held by an Appletun, this item allows it to Mega Evolve in battle.",
    },
    venusauriteg: {
        name: "Venusaurite G",
        spritenum: 613,
        megaStone: "Venusaur-Mega-G",
        megaEvolves: "Venusaur",
        itemUser: ["Venusaur"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -14,
        gen: 9,
        desc: "If held by a Venusaur, this item allows it to Mega Evolve in battle.",
    },
    charizarditeg: {
        name: "Charizardite G",
        spritenum: 605,
        megaStone: "Charizard-Mega-G",
        megaEvolves: "Charizard",
        itemUser: ["Charizard"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -15,
        gen: 9,
        desc: "If held by a Charizard, this item allows it to Mega Evolve in battle.",
    },
    blastoisiniteg: {
        name: "Blastoisinite G",
        spritenum: 615,
        megaStone: "Blastoise-Mega-G",
        megaEvolves: "Blastoise",
        itemUser: ["Blastoise"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -16,
        gen: 9,
        desc: "If held by a Blastoise, this item allows it to Mega Evolve in battle.",
    },
    greninjanite: {
        name: "Greninjanite",
        spritenum: 576,
        megaStone: "Greninja-Ash",
        megaEvolves: "Greninja",
        itemUser: ["Greninja"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -17,
        gen: 9,
        desc: "If held by a Greninja, this item allows it to Mega Evolve in battle.",
    },
    rillabite: {
        name: "Rillabite",
        spritenum: 590,
        megaStone: "Rillaboom-Mega",
        megaEvolves: "Rillaboom",
        itemUser: ["Rillaboom"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -18,
        gen: 9,
        desc: "If held by a Rillaboom, this item allows it to Mega Evolve in battle.",
    },
    cinderite: {
        name: "Cinderite",
        spritenum: 591,
        megaStone: "Cinderace-Mega",
        megaEvolves: "Cinderace",
        itemUser: ["Cinderace"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -19,
        gen: 9,
        desc: "If held by a Cinderace, this item allows it to Mega Evolve in battle.",
    },
    inteleonite: {
        name: "Inteleonite",
        spritenum: 630,
        megaStone: "Inteleon-Mega",
        megaEvolves: "Inteleon",
        itemUser: ["Inteleon"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -20,
        gen: 9,
        desc: "If held by an Inteleon, this item allows it to Mega Evolve in battle.",
    },
    eternalflower: {
		name: "Eternal Flower",
		spritenum: 708,
		forcedForme: "Floette-Eternal",
		itemUser: ["Floette-Eternal"],
        zMove: "Light of Ruin",
        zMoveFrom: "Moonblast",
		num: -21,
		gen: 9,
        desc: "A Floette that holds this becomes Eternal Floette and can use a Z-move with Moonblast.",
	},
    bestboiolite: {
        name: "Bestboiolite",
        spritenum: 667,
        onModifyAtkPriority: 1,
        onModifyAtk(atk, pokemon) {
            if (pokemon.baseSpecies.baseSpecies === 'Turtwig') {
                return this.chainModify(1.5);
            }
        },
        onModifySpAPriority: 1,
        onModifySpA(spa, pokemon) {
            if (pokemon.baseSpecies.baseSpecies === 'Turtwig') {
                return this.chainModify(1.5);
            }
        },
        onModifyDefPriority: 1,
        onModifyDef(def, pokemon) {
            if (pokemon.baseSpecies.baseSpecies === 'Turtwig') {
                return this.chainModify(1.5);
            }
        },
        onModifySpDPriority: 1,
        onModifySpD(spd, pokemon) {
            if (pokemon.baseSpecies.baseSpecies === 'Turtwig') {
                return this.chainModify(1.5);
            }
        },
        zMove: "Bestboi Sap",
        zMoveFrom: "Sappy Seed",
        itemUser: ["Turtwig"],
        num: -22,
        gen: 9,
        desc: "Turtwig; 1.5x atk/spa/def/spd. Can use a Secial Z-move with Sappy Seed.",
	},
    melmite: {
        name: "Melmite",
        spritenum: 578,
        megaStone: "Melmetal-Mega",
        megaEvolves: "Melmetal",
        itemUser: ["Melmetal"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
                return true;
	       },
        num: -23,
        gen: 9,
        desc: "If held by a Melmetal, this item allows it to Mega Evolve in battle.",
    },
    urshifusite: {
		name: "Urshifusite",
		spritenum: 594,
		megaStone: "Urshifu-Mega",
		megaEvolves: "Urshifu",
		itemUser: ["Urshifu"],
		onTakeItem(item, source) {
			if (source.baseSpecies.name.includes('Urshifu')) return false;
			return true;
		},
		num: -24,
		gen: 9,
		desc: "If held by an Urshifu, this item allows it to Mega Evolve in battle.",
	},
    gengariteg: {
		name: "Gengarite G",
		spritenum: 588,
		megaStone: "Gengar-Mega",
		megaEvolves: "Gengar",
		itemUser: ["Gengar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -25,
		gen: 9,
	   desc: "If held by a Gengar, this item allows it to Mega Evolve in battle.",
	},
    pikachite: {
		name: "Pikachite",
		spritenum: 583,
		megaStone: "Pikachu-Mega",
		megaEvolves: "Pikachu",
		itemUser: [
			"Pikachu",
			"Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", // Gen 7 formes
			"Pikachu-World", // Gen 8 forme (indexed as Pikachu 9 in datamine)
			"Pikachu-Rock-Star", "Pikachu-Belle", "Pikachu-Pop-Star", "Pikachu-PhD", "Pikachu-Libre", "Pikachu-Cosplay", // formes 1-6 from Gen 6
		],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -26,
		gen: 9,
	   desc: "If held by a Pikachu, this item allows it to Mega Evolve in battle.",
	},
    eeveeolite: {
		name: "Eeveeolite",
		spritenum: 583,
		megaStone: "Eevee-Mega",
		megaEvolves: "Eevee",
		itemUser: ["Eevee"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -27,
		gen: 9,
	   desc: "If held by an Eevee, this item allows it to Mega Evolve in battle.",
	},
    meowite: {
		name: "Meowite",
		spritenum: 583,
		megaStone: "Meowth-Mega",
		megaEvolves: "Mewoth",
		itemUser: ["Meowth", "Meowth-Alola", "Meowth-Galar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -27,
		gen: 9,
	    desc: "If held by a Meowth, this item allows it to Mega Evolve in battle.",
	},
    greenorb: {
		name: "Green Orb",
		spritenum: 0,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Rayquaza') {
				this.queue.insertChoice({choice: 'runPrimal', pokemon: pokemon});
			}
		},
		onPrimal(pokemon) {
			pokemon.formeChange('Rayquaza-Mega', this.effect, true);
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Rayquaza') return false;
			return true;
		},
		itemUser: ["Rayquaza"],
        desc: "If held by a Rayquaza, this item triggers its Primal Reversion in battle.",
		num: -28,
	},
    garborite: {
		name: "Garborite",
		spritenum: 588,
		megaStone: "Garbordor-Mega",
		megaEvolves: "Garbordor",
		itemUser: ["Garbordor"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -29,
		gen: 9,
	    desc: "If held by a Garbordor, this item allows it to Mega Evolve in battle.",
	},
    drednite: {
		name: "Drednite",
		spritenum: 575,
		megaStone: "Drednaw-Mega",
		megaEvolves: "Drednaw",
		itemUser: ["Drednaw"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -30,
		gen: 9,
	    desc: "If held by a Drednaw, this item allows it to Mega Evolve in battle.",
	},
    coalossite: {
		name: "Coalossite",
		spritenum: 625,
		megaStone: "Coalossal-Mega",
		megaEvolves: "Coalossal",
		itemUser: ["Coalossal"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -31,
		gen: 9,
	    desc: "If held by a Coalossal, this item allows it to Mega Evolve in battle.",
	},
    toxtricite: {
		name: "Toxtricite",
		spritenum: 582,
		megaStone: "Toxtricity-Mega",
		megaEvolves: "Toxtricity",
		itemUser: ["Toxtricity"],
		onTakeItem(item, source) {
			if (source.baseSpecies.name.includes('Toxtricity')) return false;
			return true;
		},
		num: -32,
		gen: 9,
		desc: "If held by a Toxtricity, this item allows it to Mega Evolve in battle.",
	},
    centiskite: {
		name: "Centiskite",
		spritenum: 586,
		megaStone: "Centiskorch-Mega",
		megaEvolves: "Centiskorch",
		itemUser: ["Centiskorch"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -33,
		gen: 9,
		desc: "If held by a Centiskorch, this item allows it to Mega Evolve in battle.",
	},
    grimmsnite: {
		name: "Grimmsnite",
		spritenum: 586,
		megaStone: "Grimmsnarl-Mega",
		megaEvolves: "Grimmsnarl",
		itemUser: ["Grimmsnarl"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -33,
		gen: 9,
		desc: "If held by a Grimmsnarl, this item allows it to Mega Evolve in battle.",
	},
    alcremite: {
		name: "Alcremite",
		spritenum: 620,
		megaStone: "Alcremie-Mega",
		megaEvolves: "Alcremie",
		itemUser: ["Alcremie"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -34,
		gen: 9,
		desc: "If held by an Alcremie, this item allows it to Mega Evolve in battle.",
	},
    copperajite: {
		name: "Copperajite",
		spritenum: 605,
		megaStone: "Copperajah-Mega",
		megaEvolves: "Copperajah",
		itemUser: ["Copperajah"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -35,
		gen: 9,
		desc: "If held by a Copperajah, this item allows it to Mega Evolve in battle.",
	},
    duraludite: {
		name: "Duraludite",
		spritenum: 577,
		megaStone: "Duraludon-Mega",
		megaEvolves: "Duraludon",
		itemUser: ["Duraludon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -36,
		gen: 9,
		desc: "If held by a Duraludon, this item allows it to Mega Evolve in battle.",
	},
    eternalcrystal: {
		name: "Eternal Crystal",
		spritenum: 145,
		itemUser: ["Eternatus"],
		onTakeItem: false,
		num: -37,
		gen: 9,
		desc: "If held by an Eternatus, this item allows it to Eternamax in battle.",
	},
    dudunspite: {
		name: "Dudunspite",
		spritenum: 580,
		megaStone: "Dudunsparce-Three-Segment",
		megaEvolves: "Dudunsparce",
		itemUser: ["Dudunsparce"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -38,
		gen: 9,
		desc: "If held by a Dudunsparce, this item allows it to Mega Evolve in battle.",
	},
    rearguard: {
		name: "Rear Guard",
		spritenum: 410,
		fling: {
			basePower: 10,
		},
		onTryHit(target, source, move) {
			if (target !== source && target.isAlly(source) && move.category !== 'Status') {
                this.add('-hint', "The Pokemon's Rear Guard protects it from it's ally's attack!");
				return null;
			}
		},
		num: -39,
        gen: 9,
		desc: "Holder is immune from damage dealt from attacks made by its allies.",
        
        block: "  [POKEMON]'s Rear Guard protects it from it's ally's attack!",
	},
    evictionnotice: {
		name: "Eviction Notice",
		spritenum: 403,
		fling: {
			basePower: 100,
		},
		onStart(pokemon) {
            if (!pokemon.ignoringItem() && this.field.getPseudoWeather('trickroom')) {
				pokemon.useItem();
                pokemon.switchFlag = true;
			}
		},
		onAnyPseudoWeatherChange(target) {
			const pokemon = this.effectState.target;
			 if (this.field.getPseudoWeather('trickroom')) {
				pokemon.useItem(pokemon);
                pokemon.switchFlag = true;
            }
		},
		num: -40,
		gen: 9,
        desc: "If Trick Room is active, the holder's switches to a chosen ally. Single use.",
        
        end: "  [POKEMON] was evicted from it's room!",
	},
    prisonbottle: {
		name: "Prison Bottle",
		spritenum: 752,
		megaStone: "Hoopa-Unbound",
		megaEvolves: "Hoopa",
		itemUser: ["Hoopa"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -41,
		gen: 9,
		desc: "If held by a Hoopa, this item allows it to be Unbound in battle.",
	},
};