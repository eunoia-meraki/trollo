export enum Path {
  Welcome = '/',
  Home = '/home',
  Board = 'board/:boardId',
  EditProfile = 'editprofile',
  Error404 = '/error404',
  SignUp = 'signup',
  SignIn = 'signin',
  Any = '*',
}

export enum Draggable {
  Column = 'COLUMN',
  Task = 'TASK',
}
