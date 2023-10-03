import {
  ArbitraryState,
  EthAddress,
  POSTER_TAGS,
  encodeFunction,
  encodeValues,
  getNonce,
  isEthAddress,
  isNumberish,
  isString,
} from "@daohaus/utils";
import { CONTRACT_KEYCHAINS, ValidNetwork } from "@daohaus/keychain-utils";
import { LOCAL_ABI } from "@daohaus/abis";
import { SummonParams, handleKeychains } from "@daohaus/contract-utils";

import {
  CLAIM_SHAMAN_PERMISSIONS,
  DEFAULT_SUMMON_VALUES,
  SHARE_NAME,
  SHARE_PER_NFT,
  SHARE_SYMBOL,
  SILO_CONTRACTS,
} from "./constants";

export const calcAmountPerNft = ({
  lootTokenSupply,
  airdropAllocation,
  maxClaims,
}: {
  lootTokenSupply: string | number;
  airdropAllocation: string | number;
  maxClaims: string | number;
}) => {
  const lootToVault =
    BigInt(lootTokenSupply) -
    (BigInt(lootTokenSupply) * BigInt(airdropAllocation)) / 100n;
  const lootToShaman = BigInt(lootTokenSupply) - lootToVault;
  return BigInt(lootToShaman) / BigInt(maxClaims);
};

export const assembleFixedLootSummonerArgs = (args: ArbitraryState) => {
  const formValues = args.appState.formValues as Record<string, unknown>;
  const chainId = args.chainId as ValidNetwork;

  const initializationLootTokenParams = assembleLootTokenParams({
    formValues,
    chainId,
  });

  const initializationShareTokenParams = assembleShareTokenParams({
    chainId,
  });

  const initializationShamanParams = assembleShamanParams({
    formValues,
    chainId,
  });

  const postInitializationActions = assembleInitActions({
    formValues,
    chainId,
  });

  const txArgs = [
    initializationLootTokenParams,
    initializationShareTokenParams,
    initializationShamanParams,
    postInitializationActions,
    getNonce(),
  ];
  console.log("txArgs", txArgs);

  return txArgs;
};

const assembleLootTokenParams = ({
  formValues,
  chainId,
}: {
  formValues: Record<string, unknown>;
  chainId: ValidNetwork;
}) => {
  const tokenName = formValues["lootTokenName"];
  const tokenSymbol = formValues["lootTokenSymbol"];
  const lootSingleton = SILO_CONTRACTS["FIXED_LOOT_SINGLETON"][chainId];
  const initialHolders = [] as EthAddress[];
  const lootTokenSupply = formValues["lootTokenSupply"];
  const airdropAllocation = formValues["airdropAllocation"];

  if (
    !isString(tokenName) ||
    !isString(tokenSymbol) ||
    !lootSingleton ||
    !isNumberish(lootTokenSupply) ||
    !isNumberish(airdropAllocation)
  ) {
    console.log("ERROR: Form Values", formValues);

    throw new Error(
      "assembleLootTokenParams recieved arguments in the wrong shape or type"
    );
  }
  const lootToVault =
    BigInt(lootTokenSupply) -
    (BigInt(lootTokenSupply) * BigInt(airdropAllocation)) / 100n;

  const lootToShaman = BigInt(lootTokenSupply) - lootToVault;

  console.log(
    "loot token: lootTokenSupply, airdropAllocation, lootToShaman, lootToVault",
    lootTokenSupply,
    airdropAllocation,
    lootToShaman,
    lootToVault
  );

  const lootParams = encodeValues(
    ["string", "string", "address[]", "uint256[]"],
    [tokenName, tokenSymbol, initialHolders, [lootToShaman, lootToVault]]
  );

  return encodeValues(["address", "bytes"], [lootSingleton, lootParams]);
};

const assembleShareTokenParams = ({ chainId }: { chainId: ValidNetwork }) => {
  const shareSingleton = CONTRACT_KEYCHAINS["SHARES_SINGLETON"][chainId];

  if (!shareSingleton) {
    console.log("ERROR: passed args");

    throw new Error(
      "assembleShareTokenParams recieved arguments in the wrong shape or type"
    );
  }

  const shareParams = encodeValues(
    ["string", "string"],
    [SHARE_NAME, SHARE_SYMBOL]
  );

  return encodeValues(["address", "bytes"], [shareSingleton, shareParams]);
};

const assembleShamanParams = ({
  formValues,
  chainId,
}: {
  formValues: Record<string, unknown>;
  chainId: ValidNetwork;
}) => {
  const nftAddress = formValues["nftContractAddress"];
  const registryAddress = SILO_CONTRACTS["TBA_REGISTRY"][chainId];
  const tbaImplementationAddress =
    SILO_CONTRACTS["TBA_IMPLEMENTATION"][chainId];
  const claimShamanSingleton =
    SILO_CONTRACTS["CLAIM_SHAMAN_SINGLETON"][chainId];
  const lootTokenSupply = formValues["lootTokenSupply"];
  const airdropAllocation = formValues["airdropAllocation"];
  const maxClaims = formValues["maxClaims"];

  if (
    !isEthAddress(nftAddress) ||
    !registryAddress ||
    !tbaImplementationAddress ||
    !isNumberish(maxClaims) ||
    !isNumberish(lootTokenSupply) ||
    !isNumberish(airdropAllocation) ||
    !claimShamanSingleton
  ) {
    console.log("ERROR: Form Values", formValues);

    throw new Error(
      "assembleShamanParams recieved arguments in the wrong shape or type"
    );
  }

  const lootPerNft = calcAmountPerNft({
    lootTokenSupply,
    airdropAllocation,
    maxClaims,
  });

  console.log("shaman maxClaims, lootPerNft", maxClaims, lootPerNft);

  const shamanParams = encodeValues(
    ["address", "address", "address", "uint256", "uint256"],
    [
      nftAddress,
      registryAddress,
      tbaImplementationAddress,
      lootPerNft,
      SHARE_PER_NFT,
    ]
  );

  return encodeValues(
    ["address[]", "uint256[]", "bytes[]"],
    [[claimShamanSingleton], [CLAIM_SHAMAN_PERMISSIONS], [shamanParams]]
  );
};

const assembleInitActions = ({
  formValues,
  chainId,
}: {
  formValues: Record<string, unknown>;
  chainId: ValidNetwork;
}) => {
  const { POSTER } = handleKeychains(chainId);

  return [
    // tokenConfigTX(DEFAULT_SUMMON_VALUES),
    governanceConfigTX(DEFAULT_SUMMON_VALUES),
    metadataConfigTX(formValues, POSTER),
  ];
};

const governanceConfigTX = (formValues: SummonParams) => {
  const {
    votingPeriodInSeconds,
    gracePeriodInSeconds,
    newOffering,
    quorum,
    sponsorThreshold,
    minRetention,
  } = formValues;

  if (
    !isNumberish(votingPeriodInSeconds) ||
    !isNumberish(gracePeriodInSeconds) ||
    !isNumberish(newOffering) ||
    !isNumberish(quorum) ||
    !isNumberish(sponsorThreshold) ||
    !isNumberish(minRetention)
  ) {
    throw new Error(
      "governanceConfigTX recieved arguments in the wrong shape or type"
    );
  }

  const encodedValues = encodeValues(
    ["uint32", "uint32", "uint256", "uint256", "uint256", "uint256"],
    [
      votingPeriodInSeconds,
      gracePeriodInSeconds,
      newOffering,
      quorum,
      sponsorThreshold,
      minRetention,
    ]
  );
  const encoded = encodeFunction(LOCAL_ABI.BAAL, "setGovernanceConfig", [
    encodedValues,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error("Encoding Error");
};

const tokenConfigTX = (formValues: SummonParams) => {
  const pauseVoteToken = !formValues.votingTransferable;
  const pauseNvToken = !formValues.nvTransferable;

  const encoded = encodeFunction(LOCAL_ABI.BAAL, "setAdminConfig", [
    pauseVoteToken,
    pauseNvToken,
  ]);

  if (isString(encoded)) {
    return encoded;
  }
  throw new Error("Encoding Error");
};

const metadataConfigTX = (formValues: SummonParams, posterAddress: string) => {
  const { daoName } = formValues;
  if (!isString(daoName)) {
    console.log("ERROR: Form Values", formValues);
    throw new Error("metadataTX recieved arguments in the wrong shape or type");
  }

  const METADATA = encodeFunction(LOCAL_ABI.POSTER, "post", [
    JSON.stringify({ name: daoName }),
    POSTER_TAGS.summoner,
  ]);

  const encoded = encodeFunction(LOCAL_ABI.BAAL, "executeAsBaal", [
    posterAddress,
    0,
    METADATA,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error("Encoding Error");
};
