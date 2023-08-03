import dotenv from 'dotenv'

dotenv.config()

type Env = 'test' | 'development' | 'production'
export type Config = {
  nodeEnv: Env
  githubWebhookSecret: string
}

const config: Config = {
  nodeEnv: (process.env.NODE_ENV as Env) || 'development',
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET as string,
}

export default config
