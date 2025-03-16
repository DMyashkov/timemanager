import { Redirect } from "expo-router";
import "@/globalSetup";

export default function StartPage() {
  return <Redirect href="/authSelection" />;
}
