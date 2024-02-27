import { POSTER_TAGS } from "@daohaus/utils";
import { buildMultiCallTX } from "@daohaus/tx-builder";
import { APP_CONTRACT } from "./contract";
import { pollLastTX, testLastTX } from "../utils/customTxPoll";

export enum ProposalTypeIds {
  Signal = "SIGNAL",
  IssueSharesLoot = "ISSUE",
  AddShaman = "ADD_SHAMAN",
  TransferErc20 = "TRANSFER_ERC20",
  TransferNetworkToken = "TRANSFER_NETWORK_TOKEN",
  UpdateGovSettings = "UPDATE_GOV_SETTINGS",
  UpdateTokenSettings = "TOKEN_SETTINGS",
  TokensForShares = "TOKENS_FOR_SHARES",
  GuildKick = "GUILDKICK",
  WalletConnect = "WALLETCONNECT",
}

export const APP_TX = {
  CURATOR_NFT_SUMMON: {
    id: "CURATOR_NFT_SUMMON",
    contract: APP_CONTRACT.HOS_SUMMONER,
    method: "summonBaalFromReferrer",
    argCallback: "assembleCuratorSummonerArgs",
    // customPoll: {
    //   fetch: pollLastTX,
    //   test: testLastTX,
    // },
  },
};
