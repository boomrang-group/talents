const Footer = () => {
  return (
    <footer className="border-t py-8 bg-secondary/50">
      <div className="container text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Talents Bantudemy. Tous droits réservés.</p>
        <p className="text-sm mt-1">Une initiative de Bantudemy – Talents Bantudemy.</p>
      </div>
    </footer>
  );
};

export default Footer;
