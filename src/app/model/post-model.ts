import {FilePayload} from "./file-payload";

export class PostModel {
  id: number;
  postName: string;
  description: string;
  userName: string;
  topicName: string;
  voteCount: number;
  duration: string;
  upVote: boolean;
  downVote: boolean;
  commentCount: number;
  files: FilePayload[];
}
