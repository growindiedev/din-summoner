import { useNavigate } from "react-router-dom";

import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useDHConnect } from "@daohaus/connect";

const Home = () => {
  const navigate = useNavigate();
  const { chainId } = useDHConnect();

  const onFormComplete = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any
  ) => {
    const daoAddress = result?.data?.transaction?.daoAddress;
    navigate(`/success/${daoAddress}`);
  };

  // todo: check chainId here is a valid one

  return (
    <FormBuilder
      form={APP_FORM.SUMMON_RDF}
      customFields={AppFieldLookup}
      targetNetwork={chainId}
      submitButtonText="Summon NFT DAO"
      lifeCycleFns={{
        onPollSuccess: (result) => {
          onFormComplete(result);
        },
      }}
    />
  );
};

export default Home;
