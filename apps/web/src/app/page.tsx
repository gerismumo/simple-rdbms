import HomePage from "../components/Home/Shell";
import { databasesApi } from "../lib/api/databases";

export default async function Home() {
  const response = await databasesApi.getAll();

  if(!response.statusCode) {
  }

  const databases = response.data || [];

  console.log("response", response);

  console.log("databases", databases);
  return <HomePage databases={databases} />;
}
