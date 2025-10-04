/**
 * Footer Component - Application footer
 *
 * @returns {JSX.Element} Footer component
 *
 * @example
 * <Footer />
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-zinc-800 py-3 text-center absolute bottom-0"
      role="contentinfo"
    >
      <p className="text-white text-sm">
        JudgeNot0 | An Online Judge © {currentYear}
      </p>
    </footer>
  );
}

export default Footer;
