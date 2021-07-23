export interface Available_bitrate {
  bitrate: number;
}

export interface Available_intensity {
  intensity: string;
}

export interface Stream {
  url: string;
}

export interface Channel {
  channel_id: number;
  name: string;
  playlist: string;
  emoji: string;
  icon: string;
  stream: Stream;
}

export interface Stream {
  url: string;
}

export interface Group {
  group_id: number;
  name: string;
  playlist: string;
  channels: Channel[];
  stream: Stream;
}

export interface Stream {
  url: string;
}

export interface Category {
  category_id: number;
  name: string;
  playlist: string;
  groups: Group[];
  stream: Stream;
}

export interface PlaylistsData {
  available_bitrates: Available_bitrate[];
  available_intensities: Available_intensity[];
  categories: Category[];
}

export interface PlaylistsDTO {
  method: string;
  status: number;
  data: PlaylistsData;
  api_ver: string;
}
