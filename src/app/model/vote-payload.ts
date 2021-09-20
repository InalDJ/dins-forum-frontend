import {VoteType} from "./vote-type";
import {VoteCategory} from "./vote-category";

export class VotePayload {
  voteCategory: VoteCategory;
  voteType?: VoteType;
  postId?: number;
  commentId?: number;
}
