export const getYoutubeId = (input: string) =>
  input.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )?.[1] ?? null;
