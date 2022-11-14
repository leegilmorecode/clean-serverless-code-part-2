export type CustomerPlaylistProps = {
  id: string;
  created: string;
  updated: string;
  playlistName: string;
  songIds: string[];
};

export type CreateCustomerPlaylistProps = {
  id?: string;
  created?: string;
  updated?: string;
  playlistName: string;
  songIds: string[];
};

export type NewCustomerPlaylistProps = {
  playlistName: string;
};
