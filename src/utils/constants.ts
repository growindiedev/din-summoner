import { KeychainList } from "@daohaus/keychain-utils";

export const SILO_CONTRACTS: KeychainList = {
  FIXED_LOOT_SUMMONER: {
    "0x1": "0x978f57E07d75873C82CD70CAa1725477FeA92712",
    "0x5": "0x978f57E07d75873C82CD70CAa1725477FeA92712",
    "0xa": "0x978f57E07d75873C82CD70CAa1725477FeA92712",
  },
  FIXED_LOOT_SINGLETON: {
    "0x1": "0xBE6bbE0146528aE991D2f54258E07950165BDf96",
    "0x5": "0xBE6bbE0146528aE991D2f54258E07950165BDf96",
    "0xa": "0xBE6bbE0146528aE991D2f54258E07950165BDf96",
  },
  CLAIM_SHAMAN_SINGLETON: {
    "0x1": "0x54395A54e506B18b4e155900426A5187a114AC0C",
    "0x5": "0x54395A54e506B18b4e155900426A5187a114AC0C",
    "0xa": "0x54395A54e506B18b4e155900426A5187a114AC0C",
  },
  TBA_REGISTRY: {
    "0x1": "0x02101dfB77FDE026414827Fdc604ddAF224F0921",
    "0x5": "0x02101dfB77FDE026414827Fdc604ddAF224F0921",
    "0xa": "0x02101dfB77FDE026414827Fdc604ddAF224F0921",
  },
  TBA_IMPLEMENTATION: {
    "0x1": "0x2d25602551487c3f3354dd80d76d54383a243358",
    "0x5": "0x2d25602551487c3f3354dd80d76d54383a243358",
    "0xa": "0x2d25602551487c3f3354dd80d76d54383a243358",
  },
};

/// https://docs.tokenbound.org/contracts/deployments

export const SHARE_PER_NFT = "1000000000000000000";
export const CLAIM_SHAMAN_PERMISSIONS = "2";
export const SHARE_NAME = "vNFT";
export const SHARE_SYMBOL = "NFT";
export const DEFAULT_SUMMON_VALUES = {
  votingPeriodInSeconds: 259200,
  //   votingPeriodInSeconds: 120,
  gracePeriodInSeconds: 172800,
  //   gracePeriodInSeconds: 60,
  newOffering: "10000000000000000",
  quorum: "20",
  sponsorThreshold: SHARE_PER_NFT,
  minRetention: "66",
  votingTransferable: false,
  nvTransferable: true,
};
