////////////////////
////// BOARD //////
////////////////////

export type APIBoardsData = {
  id: string;
  title: string;
}[];

export interface APIBoardData {
  id: string;
  title: string;
  description: string;
  columns: APIColumnData[];
}

export interface APIAddBoardPayload {
  title: string;
}

////////////////////
////// COLUMN //////
////////////////////

export interface APIColumnData {
  id: string;
  title: string;
  order: number;
  tasks: APITaskData[];
}

export interface APIAddColumnPayload {
  title: string;
}

export interface APIEditColumnPayload extends APIAddColumnPayload {
  id?: string;
  order: number;
}

export interface APIEditColumnResponse {
  id: string;
  title: string;
  order: number;
}

////////////////////
////// TASK //////
////////////////////

export interface APITaskData {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  files: string[];
}

export interface APIAddTaskPayload {
  title: string;
  description: string;
  userId: string;
}

export interface APIEditTaskPayload extends APIAddTaskPayload {
  order: number;
  columnId: string;
  id?: string;
  boardId?: string;
}

export interface APIEditTaskResponse extends APIAddTaskPayload {
  id: string;
  order: number;
  columnId: string;
  boardId: string;
}

////////////////////
////// USER //////
////////////////////

export interface APIUserData {
  id: string;
  name: string;
  login: string;
}

export type APIUsersData = Array<APIUserData>;

////////////////////
////// ERROR //////
////////////////////

export interface APIError {
  message: string;
}
