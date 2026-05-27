export async function* parseSseStream(
  _reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncIterable<string> {
  throw new Error('not implemented')
}
