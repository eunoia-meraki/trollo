export enum Path {
  Welcome = '/',
  Home = '/home',
  Board = 'board/:boardId',
  Error404 = '/error404',
  SignUp = '/signup',
  SignIn = '/signin',
  EditProfile = '/editprofile',
  Any = '*',
}

export enum Draggable {
  Column = 'COLUMN',
  Task = 'TASK',
}
