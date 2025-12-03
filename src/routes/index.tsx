import { Title } from "@solidjs/meta";
import UserFileReader from "~/components/UserFileReader";

export default function Home() {
  return (
    <main>
      <Title>GFL MA Organizer</Title>
      <h1>Organizer</h1>
      <UserFileReader />
    </main>
  );
}
