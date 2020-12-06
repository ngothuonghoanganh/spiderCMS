import * as response from '../constants/response';

export default function errorHandler(key) {
  switch (key) {
    case response.authen:
      return (window.location.href = '/signin');
    case response.emailExisted:
      return 'Email already exists';
    case response.usernameExisted:
      return 'Username already exists';
    case response.wrongPass:
      return 'The username or password is incorrect';
    case response.missingParam:
      return 'Please fill in all of the fields';
    case response.notFoundEmail:
      return 'Not found the email you provided';
    case response.notFound:
      return 'Not found data';
    case response.objExisted:
      return 'This name is existed';
    case response.noPermission:
      return 'You have no permission on this page';
    case response.noFileUpload:
      return 'No File Upload';
    case response.notFoundAccount:
      return 'Not found the account';
    default:
      return 'Unexpected error';
  }
}
