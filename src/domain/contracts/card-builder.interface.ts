import { CardType } from "@/domain/enums/card-type.enum";

export interface CardBuilder {
  build: (card: CardType, message: unknown) => Promise<any>
}
