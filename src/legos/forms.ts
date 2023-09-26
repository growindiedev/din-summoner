import { CustomFormLego } from "./fieldConfig";
import { APP_FIELD } from "./fields";
import { APP_TX } from "./tx";

// todo: support a link under description - do on page
// description font is data instead of body
// custom nft collection field
// move submitButtonText to lego level in package

export const APP_FORM: Record<string, CustomFormLego> = {
  SUMMON_RDF: {
    id: "SUMMON_RDF",
    title: "Summon an NFT DAO",
    description:
      "Use Silo’s RDF tool to setup an airdrop to turn any NFT collection into a DAO with its own meme token.",
    submitButtonText: "Summon NFT DAO",
    requiredFields: {
      daoName: true,
      lootTokenName: true,
      lootTokenSymbol: true,
      // lootTokenSupply: true,
      // lootTokenAllocation: true,
      lootToShaman: true,
      lootToVault: true,
      nftContractAddress: true,
      lootPerNft: true,
    },
    log: true,
    tx: APP_TX.CLAIM_SUMMON,
    fields: [
      {
        id: "nameSegment",
        type: "formSegment",
        fields: [
          {
            id: "daoName",
            type: "input",
            label: "DAO Name",
            placeholder: "DAO Name",
          },
        ],
      },
      {
        id: "tokenSegment",
        type: "formSegment",
        title: "Meme Token",
        description:
          "Create a meme token to be claimed by holders and the remaining supply will be managed by the DAO.",
        fields: [
          {
            id: "lootTokenSegment",
            type: "formSegment",
            showDivider: false,
            fields: [
              {
                id: "lootToken",
                type: "splitColumn",
                rows: [
                  {
                    rowId: "row1",
                    left: {
                      id: "lootTokenName",
                      type: "input",
                      label: "Meme Token Name",
                      placeholder: "Meme Token",
                      rules: {
                        maxLength: {
                          value: 50,
                          message:
                            "Token name cannot be longer than 50 characters",
                        },
                      },
                    },
                    right: {
                      id: "lootTokenSymbol",
                      type: "input",
                      label: "Meme Token Symbol",
                      placeholder: "MEME",
                      rules: {
                        maxLength: {
                          value: 10,
                          message:
                            "Token symbol cannot be longer than 10 characters",
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "supplyAllocationSegment",
            type: "formSegment",
            showDivider: false,
            fields: [
              {
                id: "supplyAllocation",
                type: "splitColumn",
                rows: [
                  {
                    rowId: "row2",
                    left: {
                      id: "lootToShaman",
                      type: "toWeiInput",
                      label: "Claimable Supply",
                      placeholder: "69,420",
                      expectType: "number",
                    },
                    right: {
                      id: "lootToVault",
                      type: "toWeiInput",
                      label: "Remaining Supply",
                      placeholder: "69,420,000",
                      expectType: "number",
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "lootPerNftSegment",
            type: "formSegment",
            showDivider: false,
            fields: [
              {
                id: "lootPerNftRow",
                type: "splitColumn",
                rows: [
                  {
                    rowId: "row3",
                    right: {
                      id: "lootPerNft",
                      type: "toWeiInput",
                      label: "Airdrop Per Nft",
                      placeholder: "100",
                      expectType: "number",
                    },
                    left: APP_FIELD.TOTAL_SUPPLY_DISPLAY,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "nftCollectionSegment",
        type: "formSegment",
        title: "NFT Collection",
        description:
          "Enter the NFT collection contract address below to whitelist them for the claim.",
        fields: [APP_FIELD.NFT_COLLECTION],
      },
    ],
  },
};

// {
//   id: "supplyAllocationSegment",
//   type: "formSegment",
//   showDivider: false,
//   fields: [
//     {
//       id: "supplyAllocation",
//       type: "splitColumn",
//       rows: [
//         {
//           rowId: "row2",
//           left: {
//             id: "lootTokenSupply",
//             type: "input",
//             label: "Meme Token Supply",
//             placeholder: "69,420,000",
//             expectType: "number",
//           },
//           right: {
//             id: "lootTokenAllocation",
//             type: "input",
//             label: "Holder Allocation %",
//             placeholder: "30",
//             expectType: "percent",
//           },
//         },
//       ],
//     },
//   ],
// },
