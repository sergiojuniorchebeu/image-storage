export function Footer() {
    return (
        <footer className="border-t border-line px-6 py-6 text-center text-xs text-ink-soft">
            <p>
                © {new Date().getFullYear()} StockImg — Hébergé chez
                KENNHOSTING
            </p>
            <p className="mt-1">Designed by Sergio Junior Chebeu</p>
        </footer>
    );
}
