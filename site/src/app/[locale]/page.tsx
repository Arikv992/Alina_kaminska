import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import Servicios from "@/components/sections/Servicios";
import Academia from "@/components/sections/Academia";
import Galeria from "@/components/sections/Galeria";
import Historia from "@/components/sections/Historia";
import Contacto from "@/components/sections/Contacto";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-16">
      <Hero />
      <Servicios />
      <Academia />
      <Galeria />
      <Historia />
      <Contacto />
    </main>
  );
}
