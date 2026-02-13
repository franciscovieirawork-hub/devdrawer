const Footer = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full p-4 text-center text-sm text-[var(--muted-foreground)]">
      <p className="text-xs text-[var(--muted-foreground)]">created by <a className="text-[var(--foreground)] hover:underline" href="https://f-vdev.vercel.app/" target="_blank" rel="noopener noreferrer">fvdev</a> for devs.</p>
    </div>
  );
};

export default Footer;