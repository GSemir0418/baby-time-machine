import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

// 防止开发环境的热重载建立过多的数据库连接
// globalThis 不会受到 hot reload 的影响
if (process.env.NODE_ENV !== 'production')
  globalThis.prisma = db
