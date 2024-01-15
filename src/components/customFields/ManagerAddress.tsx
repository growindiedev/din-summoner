import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Buildable, WrappedInput, Field } from "@daohaus/ui";
import { EthAddress, isEthAddress } from "@daohaus/utils";

import { fetchNftContractMetadata } from "../../utils/sequenceHelper";
import { ValidNetwork } from "@daohaus/keychain-utils";
import { useDHConnect } from "@daohaus/connect";
import { calculateCreateProxyWithNonceAddress } from "../../utils/summonTx";
import { SafeInfo, fetchSafe } from "../../utils/safes";
import { IFindQueryResult } from "@daohaus/data-fetch-utils";

export const ManagerAddress = (props: Buildable<Field>) => {
  const { watch, setValue } = useFormContext();
  const { chainId } = useDHConnect();
  const [safeData, setSafeData] = useState<IFindQueryResult<SafeInfo>>();
  

  const managerAccountAddress = watch("managerAccountAddress");
  const saltNonce = watch("saltNonce");

  useEffect(() => {
    const getTreasuryAddress = async () => {
      
      setValue("calculatedTreasuryAddress", await calculateCreateProxyWithNonceAddress(saltNonce, chainId as ValidNetwork));
    };

    const getSafeInfo = async (managerAccountAddress: EthAddress) => {
      const safeInfo = await fetchSafe({
        safeAddress: managerAccountAddress,
        networkId: chainId as ValidNetwork,
      });

      setSafeData(safeInfo);
    }

    if (isEthAddress(managerAccountAddress) && saltNonce && chainId) {
      getTreasuryAddress();
      getSafeInfo(managerAccountAddress);
    }
  }, [managerAccountAddress, saltNonce, chainId]);

  

  return (
    <WrappedInput
      {...props}
      helperText={
        "Enter delegated Manager Safe address"
      }
      success={
        safeData?.data && ({
          type: "success",
          message: "Valid Safe Address",
        })
      }
      warning={
        safeData?.error && ({
              type: "warning",
              message: "This address does not appear to be a Safe...",
            })

      }
    />
  );
};
