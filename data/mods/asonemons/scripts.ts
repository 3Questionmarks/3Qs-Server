export const Scripts: {[k: string]: ModdedBattleScriptsData} = {
	pokemon: {
		isGrounded(negateImmunity = false) {
		if ('gravity' in this.battle.field.pseudoWeather) return true;
		if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
		if ('smackdown' in this.volatiles) return true;
		const item = (this.ignoringItem() ? '' : this.item);
		if (item === 'ironball') return true;
		// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
		if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
		if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
		if ('magnetrise' in this.volatiles) return false;
		if ('telekinesis' in this.volatiles) return false;
		if ('float' in this.volatiles) return false;
		return item !== 'airballoon';
		},
		setStatus(
		status: string | Condition,
		source: Pokemon | null = null,
		sourceEffect: Effect | null = null,
		ignoreImmunities = false
	) {
    if (!ignoreImmunities && status.id &&
				!(source?.hasAbility('asonesalazzle') && ['tox', 'psn'].includes(status.id))) {
			// the game currently never ignores immunities
			if (!this.runStatusImmunity(status.id === 'tox' ? 'psn' : status.id)) {
				this.battle.debug('immune to status');
				if ((sourceEffect as Move)?.status) {
					this.battle.add('-immune', this);
				}
				return false;
				}
			}
   	}
	},	
	init(){
		for (const id in this.dataCache.Pokedex) {//check the dex for fusions
			const fusionEntry = this.dataCache.Pokedex[id];
			if (fusionEntry.fusion) {//if the pokedex entry has a fusion field, it's a fusion
				const learnsetFusionList = [];//list of pokemon whose learnsets need to be fused
				for (let name of fusionEntry.fusion) {
					let prevo = true;
					while (prevo) {//make sure prevos of both fused pokemon are added to the list
						learnsetFusionList.push(name);
						const dexEntry = this.dataCache.Pokedex[this.toID(name)];
						if (dexEntry.prevo) name = dexEntry.prevo;
						else prevo = false;
					}
				}
				if (!this.dataCache.Learnsets[id]) this.dataCache.Learnsets[id] = { learnset: {}};//create a blank learnset entry so we don't need a learnsets file
				for (let name of learnsetFusionList) {					
					const learnset = this.dataCache.Learnsets[this.toID(name)].learnset;//get the learnset of each pokemon in the list
					for (const moveid in learnset) {
						this.modData('Learnsets', id).learnset[moveid] = ['8L1', '7L1', '6L1', '5L1', '4L1'];//all moves are compatible with the fusion's only ability, so just set it to 8L1
					}
				}
			}
		}
		this.modData('Learnsets', 'yanmegashell').learnset.coalsting = ['8L1'];
		delete this.modData('Learnsets', 'yanmegashell').learnset.shellsmash;
		
		this.modData('Learnsets', 'pelipperink').learnset.inkgulp = ['8L1'];
		
		this.modData('Learnsets', 'excadrillboulder').learnset.bouldertoss = ['8L1'];
		
		this.modData('Learnsets', 'vanilluxefur').learnset.icescream = ['8L1'];
		
		this.modData('Learnsets', 'butterfreeangler').learnset.baitsplash = ['8L1'];
		
		this.modData('Learnsets', 'dedenneluchador').learnset.hamsterslam = ['8L1'];
		
		this.modData('Learnsets', 'shucklebrick').learnset.shellstack = ['8L1'];
		
		this.modData('Learnsets', 'munchlaxforest').learnset.biobelly = ['8L1'];
		
		this.modData('Learnsets', 'bunnelbyworker').learnset.hardwork = ['8L1'];
		
		this.modData('Learnsets', 'sirfetchdfantasy').learnset.excaliburslash = ['8L1'];
		
		this.modData('Learnsets', 'frogadierbeetle').learnset.bubbleblades = ['8L1'];
		
		this.modData('Learnsets', 'chandelureballoon').learnset.balloonburner = ['8L1'];

		this.modData('Learnsets', 'infernapeclimber').learnset.extendneck = ['8L1'];
		
		this.modData('Learnsets', 'ribombeecharmer').learnset.pungiblow = ['8L1'];
		
		this.modData('Learnsets', 'sableyedoom').learnset.darkfractals = ['8L1'];
		
		this.modData('Learnsets', 'mareaniemagma').learnset.sulfuricacid = ['8L1'];
	},
};
