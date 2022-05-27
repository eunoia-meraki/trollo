import { APIColumnData, APITaskData } from '../interfaces';

export * from './enums';

export type DragColumnData = Pick<APIColumnData, 'id'>;

export type DragTaskData = Pick<APITaskData, 'id'> & { columnId: string };
