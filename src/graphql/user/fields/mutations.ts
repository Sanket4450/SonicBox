const createUser: string[] = ['accessToken', 'refreshToken']
const loginUser: string[] = ['accessToken', 'refreshToken']
const resetForgotPassword: string[] = ['success']
const resetPassword: string[] = ['success']
const followUnfollowUser: string[] = ['isFollowed']
const updateUser: string[] = ['userId']
const addRemoveLibraryPlaylist: string[] = ['isAdded']
const addRemoveLibraryArtist: string[] = ['isAdded']
const addRemoveLibraryAlbum: string[] = ['isAdded']
const deleteUser: string[] = ['success']
const verifyUser: string[] = ['isVerified']

export default {
  createUser,
  loginUser,
  resetForgotPassword,
  resetPassword,
  followUnfollowUser,
  updateUser,
  addRemoveLibraryPlaylist,
  addRemoveLibraryArtist,
  addRemoveLibraryAlbum,
  deleteUser,
  verifyUser,
}
