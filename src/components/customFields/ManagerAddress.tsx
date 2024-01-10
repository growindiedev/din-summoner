import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Buildable, WrappedInput, Field } from "@daohaus/ui";
import { EthAddress, isEthAddress } from "@daohaus/utils";

import { fetchNftContractMetadata } from "../../utils/sequenceHelper";
import { ValidNetwork } from "@daohaus/keychain-utils";
import { useDHConnect } from "@daohaus/connect";
import { calculateCreateProxyWithNonceAddress } from "../../utils/summonTx";

export const ManagerAddress = (props: Buildable<Field>) => {
  const { watch, setValue } = useFormContext();
  const { chainId } = useDHConnect();

  const managerAccountAddress = watch("managerAccountAddress");
  const saltNonce = watch("saltNonce");

  useEffect(() => {
    const getTreasuryAddress = async () => {
      
      setValue("calculatedTreasuryAddress", await calculateCreateProxyWithNonceAddress(saltNonce, chainId as ValidNetwork));
    };

    if (isEthAddress(managerAccountAddress) && saltNonce && chainId) {
      getTreasuryAddress();
    }
  }, [managerAccountAddress, saltNonce, chainId]);

  return (
    <WrappedInput
      {...props}
      helperText={
        "address"
      }
      warning={
        {
              type: "warning",
              message: "Cannot find this...",
            }

      }
    />
  );
};
