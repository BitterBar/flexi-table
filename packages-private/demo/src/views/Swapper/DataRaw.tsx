import { NCode } from 'naive-ui'

export default function DataRaw({ data }: { data: any[] }) {
  return (
    <NCode
      code={`[\n${data
        .map(
          item =>
            `    { "id": ${item.id.toString().padEnd(10, '0')}, "no": ${item.no.toString().padEnd(2)}, "title": "${item.title.toString().padEnd(7)}", "length": ${item.length.toString().padEnd(2)} }`,
        )
        .join(',\n')}\n]`}
      language="json"
    />
  )
}
