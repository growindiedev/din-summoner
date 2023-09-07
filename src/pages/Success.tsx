import styled from "styled-components";
import { useParams } from "react-router-dom";

import { Button, DataSm, H3, Link, SingleColumnLayout } from "@daohaus/ui";
import { useDHConnect } from "@daohaus/connect";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LinkButton = styled(Link)`
  text-decoration: none;
  color: unset;
  &:hover {
    text-decoration: none;
  }
`;

const Success = () => {
  const { daoId } = useParams();
  const { chainId } = useDHConnect();

  return (
    <SingleColumnLayout>
      <H3 style={{ marginBottom: "3rem" }}>You summoned your DAO.</H3>
      <ButtonContainer>
        <Button color="secondary" fullWidth>
          <LinkButton
            showExternalIcon={false}
            target="_blank"
            href={`${chainId}/${daoId}/`}
          >
            View DAO
          </LinkButton>
        </Button>
        <Button color="secondary" fullWidth>
          <LinkButton
            showExternalIcon={false}
            target="_blank"
            href="https://docs.daohaus.club/"
          >
            Read Docs
          </LinkButton>
        </Button>
        <Button color="secondary" fullWidth>
          <LinkButton
            showExternalIcon={false}
            target="_blank"
            href={`${chainId}/${daoId}/settings`}
          >
            Update DAO Settings
          </LinkButton>
        </Button>
      </ButtonContainer>
    </SingleColumnLayout>
  );
};

export default Success;
