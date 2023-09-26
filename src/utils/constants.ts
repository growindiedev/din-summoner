import { KeychainList } from "@daohaus/keychain-utils";

export const SILO_CONTRACTS: KeychainList = {
  FIXED_LOOT_SUMMONER: {
    "0x1": "0xB5A8838d27df4633894feAA4e5b902A874EC8E7e",
    "0x5": "0xB5A8838d27df4633894feAA4e5b902A874EC8E7e",
    "0xa": "0xB5A8838d27df4633894feAA4e5b902A874EC8E7e",
  },
  FIXED_LOOT_SINGLETON: {
    "0x1": "0x9d42696A9C3c54952b8918dcbcb82Dd710347c77",
    "0x5": "0x9d42696A9C3c54952b8918dcbcb82Dd710347c77",
    "0xa": "0x9d42696A9C3c54952b8918dcbcb82Dd710347c77",
  },
  CLAIM_SHAMAN_SINGLETON: {
    "0x1": "0xFBf7607Dc4a9A32b8f5ab534E6d290F29B67E473",
    "0x5": "0xFBf7607Dc4a9A32b8f5ab534E6d290F29B67E473",
    "0xa": "0xFBf7607Dc4a9A32b8f5ab534E6d290F29B67E473",
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
