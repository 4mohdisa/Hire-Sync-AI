import { getGlobalTag, getIdTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getUserResumeGlobalTag() {
  return getGlobalTag("userResumes")
}

export function getUserResumeIdTag(userId: string) {
  return getIdTag("userResumes", userId)
}

export function revalidateUserResumeCache(userId: string) {
  const globalTag = getUserResumeGlobalTag()
  const userTag = getUserResumeIdTag(userId)
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🗄️ Revalidating cache tags: ${globalTag}, ${userTag}`)
  }
  
  revalidateTag(globalTag)
  revalidateTag(userTag)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Cache revalidation completed')
  }
}
