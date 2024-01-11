import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Buildable, WrappedInput, Field } from "@daohaus/ui";
import { EthAddress, isEthAddress } from "@daohaus/utils";
import { getSaltNonce } from "../../utils/summonTx";


export const SaltNonce = (props: Buildable<Field>) => {
  const { setValue } = useFormContext();


  useEffect(() => {
    setValue(props.id, getSaltNonce());
    
  }, []);

  return null;
};
