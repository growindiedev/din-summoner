import { ArbitraryState } from "@daohaus/utils";
import { ValidNetwork } from "@daohaus/keychain-utils";
import { assembleTxArgs } from "@daohaus/contract-utils";

export const SUMMONER_FIELD_MEMBER = "memberAddresses";
export const SUMMONER_FIELD_SHARES = "memberShares";
export const SUMMONER_FIELD_LOOT = "memberLoot";

const DEFAULT_ARGS = {
  votingPeriodInSeconds: "10800",
  gracePeriodInSeconds: "7200",
  newOffering: "0",
  quorum: "0",
  sponsorThreshold: "1000000000000000000",
  minRetention: "66",
  votingTransferable: false,
  nvTransferable: false,
};

export const assembleSummonArgs = (args: ArbitraryState) => {
  const formValues = args.appState.formValues as Record<string, unknown>;
  const chainId = args.chainId as ValidNetwork;

  const txArgs = assembleTxArgs({ ...formValues, ...DEFAULT_ARGS }, chainId);

  console.log("txArgs", txArgs);

  return txArgs;
};
