'use server';

/**
 * 获取歌词内容
 * @param lrcUrl - LRC文件的URL
 * @returns 歌词文本内容
 */
export async function fetchLyrics(lrcUrl: string): Promise<string> {
  console.log('🚀 Server: Fetching lyrics from:', lrcUrl);
  try {
    const response = await fetch(lrcUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch lyrics: ${response.status}`);
    }
    const text = await response.text();
    console.log(
      '✅ Server: Lyrics fetched successfully, first 100 chars:',
      text.slice(0, 100)
    );
    return text;
  } catch (error) {
    console.error('❌ Server: Error fetching lyrics:', error);
    throw error;
  }
}
