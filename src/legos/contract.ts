import { ContractLego } from "@daohaus/utils";

import basicHOSSummonerAbi from "../abis/basicHOSSummoner.json";
import { CURATOR_CONTRACTS } from "../utils/constants";

export const APP_CONTRACT: Record<string, ContractLego> = {
  HOS_SUMMONER: {
    type: "static",
    contractName: "HOSSummoner",
    abi: basicHOSSummonerAbi,
    targetAddress: CURATOR_CONTRACTS["NFT_CURATOR_SUMMONER"],
  },
};
