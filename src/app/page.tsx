'use client'
import Main from "@/components/Main";
import { useAppContext } from "@/context/appContext";
export default function Home() {
  const { userInfo } = useAppContext();
  return (
    <Main />
  );
}
