import { POSTER_TAGS } from "@daohaus/utils";
import { buildMultiCallTX } from "@daohaus/tx-builder";
import { APP_CONTRACT } from "./contract";
import { pollLastTXSilo, testLastTXSilo } from "../utils/customTxPoll";

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
  CLAIM_SUMMON: {
    id: "CLAIM_SUMMON",
    contract: APP_CONTRACT.CLAIM_SUMMONER,
    method: "summonBaalFromReferrer",
    argCallback: "assembleLootSummonerArgs",
    customPoll: {
      fetch: pollLastTXSilo,
      test: testLastTXSilo,
    },
  },
};
