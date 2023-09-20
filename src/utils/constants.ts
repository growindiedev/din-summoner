import { KeychainList } from "@daohaus/keychain-utils";

export const SILO_CONTRACTS: KeychainList = {
  FIXED_LOOT_SUMMONER: {
    "0x1": "0x41AF243572381B327e1cB7B0B76Fc1EbBBb8bE0c",
    "0x5": "0x41AF243572381B327e1cB7B0B76Fc1EbBBb8bE0c",
    "0xa": "0x41AF243572381B327e1cB7B0B76Fc1EbBBb8bE0c",
  },
  FIXED_LOOT_SINGLETON: {
    "0x1": "0xf84A8AfA1Ba33bAB1ac8e82035e11bF3971888ab",
    "0x5": "0xf84A8AfA1Ba33bAB1ac8e82035e11bF3971888ab",
    "0xa": "0xf84A8AfA1Ba33bAB1ac8e82035e11bF3971888ab",
  },
  CLAIM_SHAMAN_SINGLETON: {
    "0x1": "0x70132cd79f90306bC68C1930F4364452a17aa552",
    "0x5": "0x70132cd79f90306bC68C1930F4364452a17aa552",
    "0xa": "0x70132cd79f90306bC68C1930F4364452a17aa552",
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
