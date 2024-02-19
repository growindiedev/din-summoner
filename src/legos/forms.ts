import { CustomFormLego } from "./fieldConfig";
import { APP_FIELD } from "./fields";
import { APP_TX } from "./tx";

// todo: support a link under description - do on page
// description font is data instead of body
// custom nft collection field
// move submitButtonText to lego level in package

export const APP_FORM: Record<string, CustomFormLego> = {
  SUMMON_CURRATOR_NFT: {
    id: "SUMMON_CURRATOR_NFT",
    title: "Summon a Currator DIN DAO",
    description:
      "Start Your own Decentralixed Inteligence Network.",
    submitButtonText: "Summon DIN",
    requiredFields: {
      daoName: true,
      price: true,
      article: true,
      image: true
    },
    log: true,
    tx: APP_TX.CURRATOR_NFT_SUMMON,
    fields: [
      {
        id: "nameSegment",
        type: "formSegment",
        fields: [
          {
            id: "daoName",
            type: "input",
            label: "Publication Name",
            placeholder: "DAO Name",
          },
        ],
      },
      {
        id: "collectorPrice",
        type: "toWeiInput",
        label: "Initial Price",
        placeholder: ".00069,420",
        expectType: "number",
        info: "The initial price of the collector NFT. Can be changed by the org later.",
      },
      {
        id: "image",
        type: "input",
        label: "Article Header Image",
        placeholder: "make sure image works",
        expectType: "url",
        info: "Type something to kick it off.",
      },
      {
        id: "article",
        type: "markdownField",
        label: "Introduction Article",
        placeholder: "# We Currate and Collect....\n## We are the future of media.\nThis is a markdown editor.",
        info: "Type something to kick it off.",
      },
      APP_FIELD.SALT_NONCE_FIELD,
      APP_FIELD.DAO_ADDRESS_FIELD,
      APP_FIELD.SHAMAN_ADDRESS_FIELD,
      {
        id: "parentCheckGateRender",
        type: "checkGateRender",
        gateLabel:
          "Is this a sub dao of another DAO? (optional)",
        clearFieldIdsOnUnchecked: [
          "parentDAOAddress"
        ],
        components: [
          
      {
        id: "parentDAOSegment",
        type: "formSegment",
        title: "Sub DAO",
        description:
          "If you are creating a sub DAO, enter the parent DAO address here.",
        fields: [
          {
            id: "parentDAOAddress",
            type: "input",
            label: "Parent DAO Address",
          }
        ],
      },
    ],
  }
]
}};

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
