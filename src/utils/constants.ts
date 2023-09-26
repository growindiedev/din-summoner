import { KeychainList } from "@daohaus/keychain-utils";

export const SILO_CONTRACTS: KeychainList = {
  FIXED_LOOT_SUMMONER: {
    "0x1": "0x191A8D98e43D7f4fA46b000F9eb5597BD5B6b924",
    "0x5": "0x191A8D98e43D7f4fA46b000F9eb5597BD5B6b924",
    "0xa": "0x191A8D98e43D7f4fA46b000F9eb5597BD5B6b924",
  },
  FIXED_LOOT_SINGLETON: {
    "0x1": "0x24c2cA1152AbE7F34b4ecD82A3D1D18876533620",
    "0x5": "0x24c2cA1152AbE7F34b4ecD82A3D1D18876533620",
    "0xa": "0x24c2cA1152AbE7F34b4ecD82A3D1D18876533620",
  },
  CLAIM_SHAMAN_SINGLETON: {
    "0x1": "0xEc0D1f8bAeD05ED6516fE0f9304566115f2DbbdE",
    "0x5": "0xEc0D1f8bAeD05ED6516fE0f9304566115f2DbbdE",
    "0xa": "0xEc0D1f8bAeD05ED6516fE0f9304566115f2DbbdE",
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
export const SHARE_SYMBOL = "Vote NFT";
export const DEFAULT_SUMMON_VALUES = {
  //   votingPeriodInSeconds: 259200,
  votingPeriodInSeconds: 120,
  //   gracePeriodInSeconds: 172800,
  gracePeriodInSeconds: 60,
  newOffering: "10000000000000000",
  //   quorum: "20",
  quorum: "0",
  sponsorThreshold: SHARE_PER_NFT,
  minRetention: "66",
  votingTransferable: false,
  nvTransferable: true,
};
