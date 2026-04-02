import WinnersClient from "./winners-client"

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default function DeclareWinnersPage({ params }: { params: { id: string } }) {
  return <WinnersClient id={params.id} />
}
