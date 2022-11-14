import {
  CustomerPlaylistProps,
  NewCustomerPlaylistProps,
} from '@models/customer-playlist-types';

import { CustomerPlaylist } from '@domain/customer-playlist';
import { CustomerPlaylistDto } from '@dto/customer-playlist';

let customerPlaylist: CustomerPlaylistDto = {
  created: '2022-01-01T00:00:00.000Z',
  id: 'f39e49ad-8f88-448f-8a15-41d560ad6d70',
  updated: '2022-01-01T00:00:00.000Z',
  songIds: ['123', '345'],
  playlistName: 'testplaylist',
};

describe('customer-playlist', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterAll(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('create playlist', () => {
    it('should fail creating a new account with an invalid customerPlaylist', () => {
      // arrange
      const newCustomerPlaylist: NewCustomerPlaylistProps = {
        ...customerPlaylist,
        playlistName: '±',
      };

      // act / assert
      expect(() =>
        CustomerPlaylist.createPlaylist(newCustomerPlaylist)
      ).toThrowErrorMatchingInlineSnapshot(
        `"[{\\"instancePath\\":\\"/playlistName\\",\\"schemaPath\\":\\"#/properties/playlistName/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z]+$\\\\\\"\\"}]"`
      );
    });

    it('should create the new account successfully with a valid customerPlaylist', () => {
      // arrange
      const newCustomerPaylist: NewCustomerPlaylistProps = {
        ...customerPlaylist,
        playlistName: 'testplaylist',
      };

      // act
      const newPlaylist = CustomerPlaylist.createPlaylist(newCustomerPaylist);

      // assert
      expect(newPlaylist).toMatchSnapshot();
    });
  });

  describe('toDto', () => {
    it('should create the correct dto', () => {
      // arrange
      const newCustomerPlaylist: NewCustomerPlaylistProps = {
        playlistName: 'testplaylist',
      };

      // act
      const newPlaylist = CustomerPlaylist.createPlaylist(newCustomerPlaylist);

      // assert
      expect(newPlaylist.toDto()).toMatchSnapshot();
    });
  });

  describe('toDomain', () => {
    it('should create a domain object based on a dto', () => {
      // arrange
      const customerPlaylistProps: CustomerPlaylistProps = {
        ...customerPlaylist,
      };

      // act
      const playlist: CustomerPlaylist = CustomerPlaylist.toDomain(
        customerPlaylistProps
      );

      // assert
      expect(playlist).toMatchSnapshot();
    });
  });

  describe('addSongToPlaylist', () => {
    it('should successfully add the song to the playlist', () => {
      // arrange
      const newCustomerPaylist: NewCustomerPlaylistProps = {
        ...customerPlaylist,
        playlistName: 'testplaylist',
      };
      const newPlaylist = CustomerPlaylist.createPlaylist(newCustomerPaylist);

      // act
      newPlaylist.addSongToPlaylist('songone');

      // assert
      expect(newPlaylist).toMatchInlineSnapshot(`
CustomerPlaylist {
  "_created": "2022-01-01T00:00:00.000Z",
  "_domainEvents": Array [
    Object {
      "event": Object {
        "created": "2022-01-01T00:00:00.000Z",
        "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
        "playlistName": "testplaylist",
        "songIds": Array [
          "songone",
        ],
        "updated": "2022-01-01T00:00:00.000Z",
      },
      "eventDateTime": "2022-01-01T00:00:00.000Z",
      "eventName": "CustomerPlaylistCreated",
      "eventVersion": "1",
      "source": "com.customer-account-onion",
    },
    Object {
      "event": Object {
        "created": "2022-01-01T00:00:00.000Z",
        "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
        "playlistName": "testplaylist",
        "songIds": Array [
          "songone",
        ],
        "updated": "2022-01-01T00:00:00.000Z",
      },
      "eventDateTime": "2022-01-01T00:00:00.000Z",
      "eventName": "SongAddedToPlaylist",
      "eventVersion": "1",
      "source": "com.customer-account-onion",
    },
  ],
  "_id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
  "_updated": "2022-01-01T00:00:00.000Z",
  "props": Object {
    "created": "2022-01-01T00:00:00.000Z",
    "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
    "playlistName": "testplaylist",
    "songIds": Array [
      "songone",
    ],
    "updated": "2022-01-01T00:00:00.000Z",
  },
}
`);
    });

    it('should throw an error if there are more than 4 songs on the playlist', () => {
      // arrange
      const newCustomerPaylist: NewCustomerPlaylistProps = {
        ...customerPlaylist,
        playlistName: 'testplaylist',
      };
      const newPlaylist = CustomerPlaylist.createPlaylist(newCustomerPaylist);

      // act
      newPlaylist.addSongToPlaylist('songone');
      newPlaylist.addSongToPlaylist('songtwo');
      newPlaylist.addSongToPlaylist('songthree');
      newPlaylist.addSongToPlaylist('songfour');

      // assert
      expect(() =>
        newPlaylist.addSongToPlaylist('songfive')
      ).toThrowErrorMatchingInlineSnapshot(
        `"the maximum playlist length is 4"`
      );
    });
  });
});
