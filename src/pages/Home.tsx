import { useNavigate } from "react-router-dom";

import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useDHConnect } from "@daohaus/connect";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "@daohaus/ui";
import { ADMIN_URL } from "../utils/constants";

const LinkButton = styled(Link)`
  text-decoration: none;
  color: unset;
  &:hover {
    text-decoration: none;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { chainId } = useDHConnect();
  const [txSuccess, setTxSuccess] = useState(false);


  const onFormComplete = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any
  ) => {
    console.log("result on success handle", result);
    const daoAddress = result?.items[0]?.id;
    navigate(`/success/${daoAddress}`);
  };

  // todo: check chainId here is a valid one and pass to formbuilder
  console.log("chainId", chainId);

  return (
    <>
      <FormBuilder
        form={APP_FORM.SUMMON_CURATOR_NFT}
        customFields={AppFieldLookup}
        targetNetwork={chainId}
        submitButtonText="Summon NFT DAO"
        lifeCycleFns={{
          onPollSuccess: (result) => {
            console.log("poll success", result);
            onFormComplete(result);
          },
          onTxSuccess: (result) => {
            setTxSuccess(true);
          }
        }}
      />
      {txSuccess && <LinkButton
        showExternalIcon={true}
        target="_blank"
        href={`${ADMIN_URL}`}
      >
        Go to Hub
      </LinkButton>}
    </>
  );
};

export default Home;
