import { useDHConnect } from "@daohaus/connect";
import styled from "styled-components";
import { BiColumnLayout, Button, Link, ParSm } from "@daohaus/ui";
import { Link as RouterLink } from "react-router-dom";
import { supportedNetorks } from "../main";
import { ADMIN_URL } from "../utils/constants";
import { UserDaos } from "../components/UserDaos";

const LinkButton = styled(RouterLink)`
  text-decoration: none;
`;

const ExternalLinkButton = styled(Link)`
  text-decoration: none;
  color: unset;
  &:hover {
    text-decoration: none;
  }
`;

const InsideConatiner = styled.div`
  > * {
    margin-bottom: 2rem;
  }
`;

const Landing = () => {
  const { chainId, isConnected, address } = useDHConnect();

  return (
    <>
      {chainId && chainId in supportedNetorks ? (
        <BiColumnLayout
          subtitle="Welcome to the DIN summoner"
          title="DIN- Decentralized Information Netowrk"
          left={
            <InsideConatiner>
              <h1>Create Topic Hub</h1>
              <p>
                Create a topic hub to organize and fund projects, events, and
                more.
              </p>
              <LinkButton to="/summon/topic">
                <Button variant="outline">Summon a Topic</Button>
              </LinkButton>
            </InsideConatiner>
          }
          right={
            <InsideConatiner>
              <UserDaos />

              <ExternalLinkButton
                showExternalIcon={true}
                target="_blank"
                href={`${ADMIN_URL}`}
              >
                <ParSm>Continue To Topic List</ParSm>
              </ExternalLinkButton>
            </InsideConatiner>
          }
        />
      ) : (
        <InsideConatiner>
          {!isConnected && (
            <>
              <h1>Not Connected</h1>
              <p>Please connect your wallet to continue.</p>
            </>
          )}
          {isConnected && <h1>Unsupported Network. Switch to sepolia</h1>}
          <ExternalLinkButton
            showExternalIcon={true}
            target="_blank"
            href={`${ADMIN_URL}`}
          >
            Continue To Topic List
          </ExternalLinkButton>
        </InsideConatiner>
      )}
    </>
  );
};

export default Landing;
