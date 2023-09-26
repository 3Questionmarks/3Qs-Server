export const Tags: {[id: string]: TagData} = {
	// Move tags
	// ---------
	contact: {
		inherit: true,
		desc: "Affected by a variety of moves, abilities, and items. Moves affected by contact moves include: Spiky Shield, King's Shield. Abilities affected by contact moves include: Iron Barbs, Rough Skin, Stench, Gooey, Flame Body, Static, Tough Claws. Items affected by contact moves include: Rocky Helmet, Sticky Barb.",
	},
	sound: {
		inherit: true,
		desc: "Doesn't affect Soundproof Pokémon, is boosted 1.3x by Amplifier and Punk Rock, and deals 50% damage agaisnt Punk Rock Pokemon.  (All sound moves also bypass Substitute.)",
	},
	fist: {
		inherit: true,
		desc: "Boosted 1.3x by Iron Fist.",
	},
    kick: {
		name: "Kick",
		desc: "Boosted 1.3x by Steel Toe.",
		moveFilter: move => 'kick' in move.flags,
	},
	ballistic: {
		inherit: true,
		desc: "Doesn't affect Bulletproof Pokémon, and Boosted 1.5x by Mega Launcher.",
	},
};
