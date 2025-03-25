import type { ApiClient } from "./client.js";
import { createApiClient } from "./client.js";
import { InfoSdk } from "./info.js";
import { MessageSdk } from "./message.js";
import { TwitterSdk } from "./twitter.js";
import { WalletSdk } from "./wallet.js";

export * from "./message.js";
export * from "./info.js";
export * from "./twitter.js";
export * from "./wallet.js";

export class LaunchpadSdk {
  private apiClient: ApiClient;

  private twitterSdk: TwitterSdk;
  private walletSdk: WalletSdk;
  private messageSdk: MessageSdk;
  private infoSdk: InfoSdk;

  constructor(config?: { apiRoot?: string; apiKey?: string }) {
    this.apiClient = createApiClient(config);

    this.twitterSdk = new TwitterSdk(this.apiClient);
    this.walletSdk = new WalletSdk(this.apiClient);
    this.messageSdk = new MessageSdk(this.apiClient);
    this.infoSdk = new InfoSdk(this.apiClient);
  }

  get twitter() {
    return this.twitterSdk;
  }

  get message() {
    return this.messageSdk;
  }

  get wallet() {
    return this.walletSdk;
  }

  get info() {
    return this.infoSdk;
  }
}
