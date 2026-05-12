export default function Logo() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo.png"
      alt="Coton Kennel"
      width={76}
      height={100}
      className="h-10 w-auto select-none transition-transform hover:scale-[1.03] sm:h-12 lg:h-14 2xl:h-[100px]"
    />
  );
}
