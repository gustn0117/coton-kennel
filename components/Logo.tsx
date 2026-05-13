export default function Logo() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo.png"
      alt="Coton Kennel"
      width={76}
      height={100}
      className="h-8 w-auto select-none transition-transform hover:scale-[1.03] sm:h-9 lg:h-10 xl:h-11 2xl:h-12"
    />
  );
}
