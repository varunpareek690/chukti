import {
  http,
  type Client,
  type PublicActions,
  type TestActions,
  type TestClientConfig,
  type WalletActions,
  createTestClient,
  publicActions,
  walletActions,
} from "viem";
import { anvil, hardhat } from "viem/chains";
import { ProjectType } from "../internal/types.js";
import { ERROR_MESSAGES } from "../internal/utils/errorMessages.js";
import { getProjectType } from "../internal/utils/projectConfig.js";

// TODO: Fine tune the return type
export const getTestClient = (): Client &
  TestActions &
  PublicActions &
  WalletActions => {
  const projectType = getProjectType(process.cwd());

  if (!projectType) {
    throw new Error(ERROR_MESSAGES.CHUKTI_PROJECT_NOT_FOUND);
  }

  const testClientConfigOverride: Partial<TestClientConfig> = {};
  if (projectType === ProjectType.ForgeAnvil) {
    testClientConfigOverride.chain = anvil;
    testClientConfigOverride.mode = "anvil";
  }

  const testClient = createTestClient({
    chain: hardhat,
    mode: "hardhat" as "anvil" | "hardhat" | "ganache",
    transport: http(),
    ...testClientConfigOverride,
  })
    .extend(publicActions)
    .extend(walletActions);

  return testClient;
};
