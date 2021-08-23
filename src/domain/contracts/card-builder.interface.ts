import { CardType } from "../enums/card-type.enum";

export interface CardBuilder {
  build: (card: CardType, message: unknown) => Promise<any>
}
