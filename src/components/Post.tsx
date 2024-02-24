import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
// import Link from 'next/link'
import { FC, useRef } from 'react'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostsProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  subredditName: string
  commentAmt: number
  votesAmt: number
  currentVote?: PartialVote
}

const Post: FC<PostsProps> = ({subredditName, post, commentAmt, votesAmt, currentVote}) => {
  const pRef = useRef<HTMLDivElement>(null)

  return (
    <div className='rounded-md bg-white shadow'>
      <div className='px-6 py-4 flex justify-between'>
        {/* TODO: PostVotes */}
        <PostVoteClient postId={post.id} initialVote={currentVote?.type} initialVotesAmt={votesAmt} />
        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500'>
            {subredditName ? (
              <>
              {/* Subredit Name */}
                <a className='underline text-zinc-900 text-sm underline-offset-2' href={`/r/${subredditName}`}>
                  r/{subredditName}
                </a>
                <span className='px-1'>.</span>
              </>
            ) : null}
            {/* author name and time */}
            <span>Posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          {/* Title */}
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
              {post.title}
            </h1>
          </a>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}
          >
            {/* Displaying content of the post */}
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'></div>
            ) : null}
          </div>
        </div>
      </div>
      <div className='bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6'>
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className='w-fit flex items-center gap-2'>
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </a>
      </div>
    </div>
  )
}

export default Post