import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validator/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if(!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = SubredditValidator.parse(body)
    
    //Check if subreddit already exists
    const subredditsExists = await db.subreddit.findFirst({
      where: {
        name
      }
    })
    
    if(subredditsExists) {
      return new Response('Subreddit already exists', { status: 409 })
    }

    // create subreddit and associate it with the user
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id
      }
    })

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      }
    })

    return new Response(subreddit.name)

  } catch (error) {
    if(error instanceof z.ZodError) {
      return new Response(error.message, { status: 422})
    }

    return new Response('Could not create subreddit', { status: 500 })
  }
}