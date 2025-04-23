"use client";

import { usePathname } from "next/navigation";
import pages from "../_data/pages.json";

export default function PageInfo() {
  const pathname = usePathname();
  const page = pages[pathname as keyof typeof pages];
  return (
    <hgroup className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{page?.title}</h1>
      <p className="text-lg"> {page?.description}</p>
    </hgroup>
  );
}
