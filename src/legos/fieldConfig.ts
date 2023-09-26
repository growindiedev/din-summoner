import { MolochFields } from "@daohaus/moloch-v3-fields";
import { FieldLegoBase, FormLegoBase } from "@daohaus/utils";
import { TotalSupplyDisplay } from "../components/customFields/TotalSupplyDisplay";
import { NftAddress } from "../components/customFields/NftAddress";

export const AppFieldLookup = {
  ...MolochFields,
  totalSupplyDisplay: TotalSupplyDisplay,
  nftAddress: NftAddress,
};

export type CustomFieldLego = FieldLegoBase<typeof AppFieldLookup>;
export type CustomFormLego = FormLegoBase<typeof AppFieldLookup>;
