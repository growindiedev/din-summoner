import { ContractLego } from "@daohaus/utils";

import fixedLootShamanSummonerAbi from "../abis/fixedLootShamanSummoner.json";
import { SILO_CONTRACTS } from "../utils/constants";

export const APP_CONTRACT: Record<string, ContractLego> = {
  CLAIM_SUMMONER: {
    type: "static",
    contractName: "ClaimSummoner",
    abi: fixedLootShamanSummonerAbi,
    targetAddress: SILO_CONTRACTS["BASE_SUMMONER"],
  },
};
