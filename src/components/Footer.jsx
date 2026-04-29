export default function Footer() {
  return (
    <footer className="bg-surface/70 mt-16 py-10 border-t border-border">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-75 transition"
          aria-label="The Movie Database"
        >
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
            alt="TMDB"
            className="h-6"
          />
        </a>
        <p className="text-muted text-sm max-w-md">
          Este produto usa a API do TMDB mas não é endossado ou certificado pelo TMDB.
        </p>
        <p className="text-muted text-sm">
          © {new Date().getFullYear()} Movie Atlas — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
