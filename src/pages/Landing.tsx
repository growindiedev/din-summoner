
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


const Landing = () => {
  const { chainId, isConnected, address } = useDHConnect();


  return (
    <>
      {chainId && chainId in supportedNetorks ? (
        <BiColumnLayout
          subtitle="Welcome to the DIN summoner"
          title="DIN- Decentralized Information Netowrk"
          left={(
            <div>
              <h1>Create Topic Hub</h1>
              <p>
                Create a topic hub to organize and fund projects, events, and more.
              </p>
              <LinkButton to="/summon/topic">
                <Button variant="outline">Summon a Topic</Button>
              </LinkButton>
            </div>
          )}
          right={(
            <div>

              <UserDaos />

              <ExternalLinkButton
                showExternalIcon={true}
                target="_blank"
                href={`${ADMIN_URL}`}
              >

                <ParSm>Continue To Topic List</ParSm>
              </ExternalLinkButton>
            </div>
          )}
        />

      ) :
        (
          <div>
            {!isConnected && (<><h1>Not Connected</h1>
              <p>
                Please connect your wallet to continue.
              </p>
            </>
            )}
            {isConnected && (
              <h1>Unsupported Network. Switch to sepolia</h1>
            )}
            <ExternalLinkButton
              showExternalIcon={true}
              target="_blank"
              href={`${ADMIN_URL}`}
            >
              Continue To Topic List
            </ExternalLinkButton>
          </div>)
      }

    </>

  );
};

export default Landing;
