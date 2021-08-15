import { PrismaClient } from '@prisma/client'

export class PrismaProvider {
  private static prisma: PrismaClient = null
  async getConnection(): Promise<PrismaClient> {
    if (!PrismaProvider.prisma) {
      PrismaProvider.prisma = new PrismaClient()
    }
    return PrismaProvider.prisma
  }
}
