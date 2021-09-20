export class CommentPayload {
  id: number;
  text: string;
  postId: number;
  userName:string;
  duration: string;
  parentCommentId: number;
  subCommentsHidden: boolean;
  subCommentCount: number;
  upVoted: boolean;
  downVoted: boolean;
  voteCount: number;
}
