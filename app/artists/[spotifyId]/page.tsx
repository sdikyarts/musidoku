export default function ArtistPage({ params }: { params: { spotifyId: string } }) {
  return (
    <div>
      <h1>{params.spotifyId}</h1>
    </div>
  );
}
