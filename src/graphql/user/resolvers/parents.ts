import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import { pageAndLimitSchema } from '../../../validations/common'
import fields from '../fields/parents'
import constants from '../../../constants'
import { userService, playlistService, libraryService } from '../../../services'

export default {
  SingleUser: {
    followers: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<user[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.users)

        const followers = await userService.getUserFollowers({
          userId,
          page,
          limit,
        })

        return followers
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    followings: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<user[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.users)

        const followings = await userService.getUserFollowings({
          userId,
          page,
          limit,
        })

        return followings
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    playlists: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<publicPlaylist[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.playlists)

        const playlists = await playlistService.getUserPlaylists({
          userId,
          page,
          limit,
        })

        return playlists
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },
  },

  profile: {
    followers: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<user[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.users)

        const followers = await userService.getUserFollowers({
          userId,
          page,
          limit,
        })

        return followers
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    followings: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<user[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.users)

        const followings = await userService.getUserFollowings({
          userId,
          page,
          limit,
        })

        return followings
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    playlists: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<playlist[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.playlists)

        const playlists = await playlistService.getProfilePlaylists({
          userId,
          page,
          limit,
        })

        return playlists
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    libraryPlaylists: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<playlist[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.playlists)

        const playlists = await libraryService.getUserLibraryPlaylists({
          userId,
          page,
          limit,
        })

        return playlists
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    libraryArtists: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<artist[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.artists)

        const artists = await libraryService.getUserLibraryArtists({
          userId,
          page,
          limit,
        })

        return artists
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    libraryAlbums: async (
      { userId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<album[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.albums)

        const albums = await libraryService.getUserLibraryAlbums({
          userId,
          page,
          limit,
        })

        return albums
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },
  },

  SingleArtist: {
    followers: async (
      { artistId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<user[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.users)

        const followers = await userService.getUserFollowers({
          userId: artistId,
          page,
          limit,
        })

        return followers
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    followings: async (
      { artistId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<user[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.users)

        const followings = await userService.getUserFollowings({
          userId: artistId,
          page,
          limit,
        })

        return followings
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },

    playlists: async (
      { artistId }: any,
      { page, limit }: pageAndLimit,
      __: any,
      info: GraphQLResolveInfo
    ): Promise<publicPlaylist[]> => {
      try {
        validateSchema({ page, limit }, pageAndLimitSchema)

        validateSelection(info.fieldNodes[0].selectionSet, fields.playlists)

        const playlists = await playlistService.getUserPlaylists({
          userId: artistId,
          page,
          limit,
        })

        return playlists
      } catch (error: any) {
        throw new GraphQLError(
          error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
          {
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          }
        )
      }
    },
  },
}

interface pageAndLimit {
  page: number
  limit: number
}

interface user {
  userId: string
  username: string
  name: string
  email: string
  gender: string
  dateOfBirth: string
  state: string
  country: string
  profileImage: string
  description: string
  isVerified: boolean
}

interface publicPlaylist {
  playlistId: string
  name: string
  image: string
  description: string
}

interface playlist {
  playlistId: string
  name: string
  image: string
  description: string
  isPrivate: boolean
}

interface artist {
  artistId: string
  username: string
  name: string
  email: string
  gender: string
  dateOfBirth: string
  state: string
  country: string
  profileImage: string
  description: string
  isVerified: boolean
}

interface album {
  albumId: string
  name: string
  image: string
}
