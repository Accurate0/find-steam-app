import fs from 'fs-extra';
import path from 'path';
import vdf from 'vdf-extra';

interface LibraryFolders {
  [id: string]: {
    path: string
    label: string,
    contentid: number,
    totalsize: number,
    update_clean_bytes_tally: number,
    time_last_update_corruption: number,
    apps: { [id:string]: number }
  };
}

export async function loadSteamLibraries(steam: string) {
  const mainSteamApps = path.join(steam, 'steamapps');
  const libraryFoldersPath = path.join(mainSteamApps, 'libraryfolders.vdf');
  const libraryFoldersContent = await fs.readFile(libraryFoldersPath, 'utf8');
  const libraryFoldersData = vdf.parse<LibraryFolders>(libraryFoldersContent);

  const libraries = Object.entries(libraryFoldersData)
    .filter(([id]) => !isNaN(Number(id)))
    .map(([, libPath]) => path.join(libPath.path, 'steamapps'));

  return [mainSteamApps, ...libraries];
}
