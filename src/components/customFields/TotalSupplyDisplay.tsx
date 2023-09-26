import { useFormContext } from "react-hook-form";
import { styled } from "styled-components";

import { Buildable, DataMd, Field, Label } from "@daohaus/ui";
import { formatValueTo, fromWei, isNumberish } from "@daohaus/utils";

const SupplyValue = styled(DataMd)`
  margin-top: 2.5rem;
`;

export const TotalSupplyDisplay = (props: Buildable<Field>) => {
  const { watch } = useFormContext();

  const lootToShaman = watch("lootToShaman");
  const lootToVault = watch("lootToVault");
  const tokenSymbol = watch("lootTokenSymbol");

  const bigShaman = isNumberish(lootToShaman)
    ? BigInt(lootToShaman || "0")
    : BigInt(0);
  const bigVault = isNumberish(lootToVault)
    ? BigInt(lootToVault || "0")
    : BigInt(0);
  const totalSupply = bigShaman + bigVault;

  return (
    <div>
      <Label>Total Supply</Label>
      <SupplyValue>
        {`${formatValueTo({
          value: fromWei(totalSupply.toString()),
          format: "number",
        })} ${tokenSymbol}`}
      </SupplyValue>
    </div>
  );
};
