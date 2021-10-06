import { BotFrameworkAdapter } from "botbuilder";
import { BotFramework } from '@/config/config'

export class BotFrameworkProvider {
  private static framework: BotFrameworkAdapter = null

  async getInstance(): Promise<BotFrameworkAdapter> {
    if (!BotFrameworkProvider.framework) {
      BotFrameworkProvider.framework = new BotFrameworkAdapter({
        appId: BotFramework.botId,
        appPassword: BotFramework.botPassword
      });
    }
    return BotFrameworkProvider.framework
  }
}
