import HomePage from "../components/Home/Shell";
import { databasesApi } from "../lib/api/databases";

export const dynamic = "force-dynamic";

export default async function Home() {
  const response = await databasesApi.getAll();

  const databases = response.data || [];
  return <HomePage databases={databases} />;
}
