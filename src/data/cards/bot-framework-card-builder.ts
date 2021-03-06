import { CardBuilder } from "@/domain/contracts/card-builder.interface";
import { Message } from "@/domain/contracts/chatbot.interface";
import { CardType } from "@/domain/enums/card-type.enum";
import { Knowledge } from "@/domain/models/knowledge";
import { createKnowledgeCard } from "@/data/cards/knowledge-card-factory";
import { createTrophyCard } from "@/data/cards/trophy-card-factory";

export class BotFrameworkCardBuilder implements CardBuilder {
  build (card: CardType, message: unknown): Promise<any> {
    switch (card) {
      case CardType.knowledge:
        return createKnowledgeCard(message as Message<Knowledge>)
      case CardType.trophy:
        return createTrophyCard(message as Message<{ value: string }>)
      default:
        throw new Error('Invalid card type!')
    }
  }
}
