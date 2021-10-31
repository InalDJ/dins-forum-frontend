import {FilePayload} from "./file-payload";

export class PostPayload {
  postId?: number
  postName: string;
  topicId?: number;
  url?: string;
  description: string;
  files?: FilePayload[];
}
