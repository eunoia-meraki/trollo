export type APIBoardsData = {
  id: string;
  title: string;
}[];

export interface APIAddBoardPayload {
  title: string;
}

export interface APIAddColumnPayload {
  title: string;
}

export interface APIEditColumnPayload extends APIAddColumnPayload {
  order: number;
  columnId?: string;
}

export interface APIEditColumnResponse {
  title: string;
  order: number;
  id: string;
}

export interface APIAddTaskPayload {
  title: string;
  order: number;
  description: string;
  userId: string;
}

export interface APIBoardData {
  id: string;
  title: string;
  columns: APIColumnData[];
}

export interface APIColumnData {
  id: string;
  title: string;
  order: number;
  tasks: APITaskData[];
}

export interface APITaskData {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  // columnId: string;
}

export interface APIUserData {
  id: string;
  name: string;
  login: string;
}

export type APIUsersData = Array<APIUserData>;

export interface APIError {
  message: string;
}
