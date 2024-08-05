export const enum IMessageStatus {
  UnRead = 1,
  Readed = 2,
}

export interface IMessageItem {
  id: string;
  title: string;
  content: string;
  created_at: string;

  status: IMessageStatus;
}
