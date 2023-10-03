import { useFormContext } from "react-hook-form";
import { styled } from "styled-components";

import { Buildable, DataMd, Field, Label } from "@daohaus/ui";
import { formatValueTo, fromWei, isNumberish } from "@daohaus/utils";
import { calcAmountPerNft } from "../../utils/summonTx";
import { useMemo } from "react";

const SupplyValue = styled(DataMd)`
  margin-top: 2.5rem;
`;

export const AmountPerNft = (props: Buildable<Field>) => {
  const { watch } = useFormContext();

  const lootTokenSupply = watch("lootTokenSupply");
  const airdropAllocation = watch("airdropAllocation");
  const maxClaims = watch("maxClaims");

  const lootPerNft = useMemo(() => {
    if (
      !isNumberish(maxClaims) ||
      !isNumberish(lootTokenSupply) ||
      !isNumberish(airdropAllocation) ||
      maxClaims === "0"
    )
      return null;
    return calcAmountPerNft({
      lootTokenSupply,
      airdropAllocation,
      maxClaims,
    });
  }, [lootTokenSupply, airdropAllocation, maxClaims]);

  return (
    <div>
      <Label>Amount per NFT</Label>
      {lootPerNft !== null ? (
        <SupplyValue>{lootPerNft.toString()}</SupplyValue>
      ) : null}
    </div>
  );
};
