import Vapi from "@vapi-ai/web"

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!) //The ! tells TypeScript: "I know this value might be undefined, but I'm certain it will exist at runtime, so treat it as non-null."