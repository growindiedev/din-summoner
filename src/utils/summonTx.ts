import { parseEther } from "viem";
import {
  ArbitraryState,
  EthAddress,
  POSTER_TAGS,
  ZERO_ADDRESS,
  encodeFunction,
  encodeValues,
  getNonce,
  isEthAddress,
  isNumberish,
  isString,
} from "@daohaus/utils";
import { CONTRACT_KEYCHAINS, HAUS_RPC, Keychain, ValidNetwork } from "@daohaus/keychain-utils";
import { LOCAL_ABI } from "@daohaus/abis";
import safeAbi from "../abis/safe.json";
import safeFactoryAbi from "../abis/safeFactory.json";

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
import { createEthersContract } from "@daohaus/tx-builder";
import { BigNumber, ethers } from "ethers";

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
  console.log(">>>>>", formValues);

  if(!isString(formValues["saltNonce"])  ) {
    throw new Error("Invalid nonce");
  }


  const saltNonce = formValues["saltNonce"].toString() || "8441";

  

  if (
    formValues["lootTokenName"] !== "" &&
    formValues["lootTokenName"] !== undefined &&
    formValues["lootTokenName"] !== null
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
      saltNonce
    });

    txArgs = [
      initializationFixedLootTokenParams,
      initializationShareTokenParams,
      initializationShamanParams,
      postInitializationActions,
      saltNonce,
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
      saltNonce
    });

    txArgs = [
      initializationLootTokenParams,
      initializationShareTokenParams,
      initializationShamanParams,
      postInitializationActions,
      saltNonce,
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

const assembleLootTokenParamsNew = ({
  formValues,
  chainId,
}: {
  formValues: Record<string, unknown>;
  chainId: ValidNetwork;
}) => {
  const lootSingleton = SILO_CONTRACTS["GOV_LOOT_SINGLETON"][chainId];
  const daoName = formValues["daoName"] as string;
  const tokenName = formValues["lootTokenName"] as string;
  const tokenSymbol = formValues["lootTokenSymbol"] as string;

  if (!isString(daoName) || !lootSingleton) {
    console.log("ERROR: Form Values", formValues);

    throw new Error(
      "assembleLootTokenParams recieved arguments in the wrong shape or type"
    );
  }

  const lootParams = encodeValues(
    ["string", "string", "address[]", "uint256[]"],
    [tokenName, tokenSymbol, [], []]
  );

  return encodeValues(["address", "bytes"], [lootSingleton, lootParams]);
};

const assembleLootTokenParams = ({
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
    ["string", "string", "address[]", "uint256[]"],
    [
      daoName + " " + LOOT_NAME,
      daoName.substring(0, 3).toUpperCase() + "-" + LOOT_SYMBOL,
      [],
      [],
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
  const maxClaims = formValues["maxClaims"] || 0;

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

  const lootPerNft =
    Number(maxClaims) > 0
      ? calcAmountPerNft({
          lootTokenSupply,
          airdropAllocation,
          maxClaims,
        })
      : 0;

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
  saltNonce
}: {
  formValues: Record<string, unknown>;
  chainId: ValidNetwork;
  saltNonce: string;
}) => {
  const { POSTER } = handleKeychains(chainId);

  return [
    // tokenConfigTX(DEFAULT_SUMMON_VALUES),
    governanceConfigTX(DEFAULT_SUMMON_VALUES),
    metadataConfigTX(formValues, POSTER),
    managerAccountConfigTX(formValues, saltNonce, chainId),
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

const managerAccountConfigTX = (formValues: Record<string, unknown>, saltNonce: string, chainId: ValidNetwork) => {

  const { managerAccountAddress, calculatedTreasuryAddress } = formValues;
  
  if (!isEthAddress(managerAccountAddress) || !isEthAddress(calculatedTreasuryAddress)) {
    console.log("ERROR: Form Values", formValues);
    throw new Error("Manager addresses recieved arguments in the wrong shape or type");
  }

  // calculated address
  console.log(">>>>>>>>>>>>>>. treasuryAddress", calculatedTreasuryAddress, isEthAddress(calculatedTreasuryAddress));

  console.log(">>>>>>>>>>>>>>. managerAccountAddress", managerAccountAddress);
  
  const ADD_MODULE = encodeFunction(safeAbi, "enableModule", [
    managerAccountAddress
  ]);
  console.log("ADD_MODULE", ADD_MODULE);

  const EXEC_TX_FROM_MODULE = encodeFunction(safeAbi, "execTransactionFromModule", [
    calculatedTreasuryAddress, // to
    "0", //value
    ADD_MODULE, // data
    "0", // operation
  ]);
  console.log("EXEC_TX_FROM_MODULE", EXEC_TX_FROM_MODULE);

  const encoded = encodeFunction(LOCAL_ABI.BAAL, "executeAsBaal", [
    calculatedTreasuryAddress as EthAddress,
    0,
    EXEC_TX_FROM_MODULE,
  ]);
  
  if (isString(encoded)) {
    console.log("*******************", encoded, chainId, saltNonce);
    return encoded;
  }
  throw new Error("***********Encoding Error***************");
};

// util to get the address of a safe before it is deployed

export const calculateCreateProxyWithNonceAddress = async (
  saltNonce: string,
  chainId: ValidNetwork
) => {
  const gnosisSafeProxyFactoryAddress = SILO_CONTRACTS["GNOSIS_SAFE_PROXY_FACTORY"][chainId] || ZERO_ADDRESS;
  const masterCopyAddress = SILO_CONTRACTS["GNOSIS_SAFE_MASTER_COPY"][chainId];
  const initializer = "0x";
  if (!isEthAddress(gnosisSafeProxyFactoryAddress) || !isEthAddress(masterCopyAddress)) {
    throw new Error("Invalid address");
  }
  const gnosisSafeProxyFactory = createEthersContract({address: gnosisSafeProxyFactoryAddress, abi: safeFactoryAbi, chainId: chainId, rpcs: HAUS_RPC});
  let expectedSafeAddress = ZERO_ADDRESS;

  try {
    await gnosisSafeProxyFactory.estimateGas.calculateCreateProxyWithNonceAddress(
      masterCopyAddress,
      initializer,
      BigNumber.from(saltNonce),
      {from: gnosisSafeProxyFactoryAddress}
    );
  } catch (e: any) {
    expectedSafeAddress = getSafeAddressFromRevertMessage(e);
  }

  return expectedSafeAddress;
}

const getSafeAddressFromRevertMessage =  (e: any): string => {

  console.log("e message", e);
  let safeAddress;
  if (e.error.error.data) {
    console.log("get address")
    safeAddress = ethers.utils.getAddress(e.error.error.data.slice(138, 178));
    console.log("safeAddress", safeAddress)
  } else {
    let messages: string[] = e.error.split(' ');
    console.log("messages", messages);
    safeAddress = messages.find((m) => m.match(/^0x[a-fA-F0-9]{40,44}$/))?.replace(',', '') ?? ZERO_ADDRESS;
  }
  return safeAddress;
}

export const getSaltNonce = (length = 32) => {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};