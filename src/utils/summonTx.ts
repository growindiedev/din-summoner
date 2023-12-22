import { parseEther } from "viem";
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
  LOOT_NAME,
  LOOT_SYMBOL,
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
  const loot = BigInt(lootToShaman) / BigInt(maxClaims);

  return parseEther(loot.toString());
};

export const assembleLootSummonerArgs = (args: ArbitraryState) => {
  const formValues = args.appState.formValues as Record<string, unknown>;
  const chainId = args.chainId as ValidNetwork;
  let txArgs: [string, string, string, string[], string];
  console.log(">>>>>", formValues["lootTokenName"]);
  if (
    formValues["lootTokenName"] !== "" &&
    formValues["lootTokenName"] !== undefined
  ) {
    // if any of the fields are empty throw an error
    if (
      formValues["lootTokenName"] === "" ||
      formValues["lootTokenSymbol"] === "" ||
      formValues["maxClaims"] === 0 ||
      formValues["lootTokenSupply"] === 0 ||
      formValues["airdropAllocation"] === 0
    ) {
      console.log("ERROR: Form Values", formValues);

      throw new Error(
        "Invalid form values. Please make sure all fields are filled out."
      );
    }

    const initializationFixedLootTokenParams = assembleFixedLootTokenParams({
      formValues,
      chainId,
    });

    const initializationShareTokenParams = assembleShareTokenParams({
      formValues,
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

    txArgs = [
      initializationFixedLootTokenParams,
      initializationShareTokenParams,
      initializationShamanParams,
      postInitializationActions,
      getNonce(),
    ];
  } else {
    console.log(">>>>> no loot token name");
    const initializationLootTokenParams = assembleLootTokenParams({
      formValues,
      chainId,
    });

    const initializationShareTokenParams = assembleShareTokenParams({
      formValues,
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

    txArgs = [
      initializationLootTokenParams,
      initializationShareTokenParams,
      initializationShamanParams,
      postInitializationActions,
      getNonce(),
    ];
  }

  console.log("txArgs", txArgs);

  return txArgs;
};

const assembleFixedLootTokenParams = ({
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
      "assembleFixedLootTokenParams recieved arguments in the wrong shape or type"
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

const assembleLootTokenParams = ({
  formValues,
  chainId,
}: {
  formValues: Record<string, unknown>;
  chainId: ValidNetwork;
}) => {

  const lootSingleton = SILO_CONTRACTS["GOV_LOOT_SINGLETON"][chainId];
  const daoName = formValues["daoName"] as string;

  if (
    !isString(daoName) ||
    !lootSingleton
  ) {
    console.log("ERROR: Form Values", formValues);

    throw new Error(
      "assembleLootTokenParams recieved arguments in the wrong shape or type"
    );
  }

  const lootParams = encodeValues(
    ["string", "string", "address[]", "uint256[]"],
    ["", "", [], []]
  );

  return encodeValues(["address", "bytes"], [lootSingleton, lootParams]);
};

const assembleLootTokenParamsOld = ({
  chainId,
  formValues,
}: {
  chainId: ValidNetwork;
  formValues: Record<string, unknown>;
}) => {
  const lootSingleton = SILO_CONTRACTS["GOV_LOOT_SINGLETON"][chainId];
  const daoName = formValues["daoName"] as string;



  if (!lootSingleton) {
    console.log("ERROR: passed args");

    throw new Error(
      "assembleLootTokenParams recieved arguments in the wrong shape or type"
    );
  }
  console.log(
    ">>>>> assembleLootTokenParams",
    daoName + " " + LOOT_NAME,
    daoName.substring(0, 3).toUpperCase() + "-" + LOOT_SYMBOL
  );

  const lootParams = encodeValues(
    ["string", "string"],
    [
      daoName + " " + LOOT_NAME,
      daoName.substring(0, 3).toUpperCase() + "-" + LOOT_SYMBOL,
    ]
  );

  return encodeValues(["address", "bytes"], [lootSingleton, lootParams]);
};

const assembleShareTokenParams = ({
  chainId,
  formValues,
}: {
  chainId: ValidNetwork;
  formValues: Record<string, unknown>;
}) => {
  const shareSingleton = CONTRACT_KEYCHAINS["SHARES_SINGLETON"][chainId];
  const daoName = formValues["daoName"] as string;

  if (!shareSingleton) {
    console.log("ERROR: passed args");

    throw new Error(
      "assembleShareTokenParams recieved arguments in the wrong shape or type"
    );
  }

  const shareParams = encodeValues(
    ["string", "string"],
    [
      daoName + " " + SHARE_NAME,
      daoName.substring(0, 3).toUpperCase() + "-" + SHARE_SYMBOL,
    ]
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
  const tbaProxyImplementationAddress =
    SILO_CONTRACTS["TBA_PROXY_IMPLEMENTATION"][chainId];
  const claimShamanSingleton =
    SILO_CONTRACTS["CLAIM_SHAMAN_SINGLETON"][chainId];
  const lootTokenSupply = formValues["lootTokenSupply"] || 0;
  const airdropAllocation = formValues["airdropAllocation"] || 0;
  const maxClaims = formValues["maxClaims"];

  if (
    !isEthAddress(nftAddress) ||
    !registryAddress ||
    !tbaImplementationAddress ||
    !tbaProxyImplementationAddress ||
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

  console.log("airdropAllocation", airdropAllocation);
  console.log("lootTokenSupply", lootTokenSupply);
  console.log("shaman maxClaims, lootPerNft", maxClaims, lootPerNft);

  const shamanParams = encodeValues(
    ["address", "address", "address", "address", "uint256", "uint256"],
    [
      nftAddress,
      registryAddress,
      tbaImplementationAddress,
      tbaProxyImplementationAddress,
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
