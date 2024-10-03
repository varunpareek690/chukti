import { handleError } from "../internal/utils/errorHandler.js";
import { ERROR_MESSAGES } from "../internal/utils/errorMessages.js";
import { log } from "../internal/utils/logger.js";
import { getProjectType } from "../internal/utils/projectConfig.js";
import { AnvilManager } from "../local-blockchain/blockchain-managers/AnvilManager.js";
import { HardhatManager } from "../local-blockchain/blockchain-managers/HardhatManager.js";

let blockchainManager: HardhatManager | AnvilManager;

export const beforeAll = async () => {
  try {
    log("info", "🚀 Starting test environment...");

    const projectType = getProjectType(process.cwd());
    if (!projectType) {
      throw new Error(ERROR_MESSAGES.CHUKTI_PROJECT_NOT_FOUND);
    }

    if (projectType === "hardhat-viem") {
      blockchainManager = new HardhatManager();
      await blockchainManager.startHardhatBlockchain();
    } else if (projectType === "forge-anvil") {
      blockchainManager = new AnvilManager();
      await blockchainManager.startAnvilBlockchain();
    }
  } catch (error) {
    handleError(error as Error);
  }
};

export const afterAll = () => {
  log("info", "Finished running tests. Stopping test environment...");
  if (blockchainManager) {
    blockchainManager.stopLocalBlockchain();
  }
};
