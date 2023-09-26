export const TypeChart: {[k: string]: TypeData} = {
	fire: {
        inherit: true,
		damageTaken: {
			inherit: true,
            snow: 3,
            hail: 3,
        },
	},
	ice: {
		damageTaken: {
            inherit: true,
            snow: 3,
			Water: 2,
		},
	},
    water: {
        inherit: true,
		damageTaken: {
            snow: 3,
            hail: 3,
	   },
    },
};
