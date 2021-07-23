import { MUBERT } from '../../shared/config';
import { PlaylistsDTO } from './Mubert.model';

export const getToken = async ({ email }: { email: string }): Promise<null | string> => {
  const local = localStorage.getItem(MUBERT.localField);
  if (local) return local;
  else {
    const res = await fetch('https://api-b2b.mubert.com/v2/GetServiceAccess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        method: 'GetServiceAccess',
        params: {
          email,
          phone: '+11234567890',
          license: MUBERT.license,
          token: MUBERT.token,
        },
      }),
    }).then(r => r.json());

    if (res.status === 1) {
      localStorage.setItem(MUBERT.localField, res.data.pat);
      return res.data.pat;
    } else {
      console.error('ERROR getting Mubert PAT token', res);
      return null;
    }
  }
};

export const getPlaylists = async (pat: string): Promise<null | PlaylistsDTO> => {
  const res: PlaylistsDTO = await fetch('https://api-b2b.mubert.com/v2/GetPlayMusic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      method: 'GetPlayMusic',
      params: {
        pat,
      },
    }),
  }).then(r => r.json());

  if (res.status === 1) {
    return res;
  } else {
    console.error('ERROR getting Mubert playlists', res);
    return null;
  }
};
