
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex flex-col gap-6 md:flex-row md:justify-between px-4 md:px-6">
        <div className="flex flex-col gap-2 md:gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 bg-brand-purple rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-base">ProductHunt</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The place to discover your next favorite thing.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mt-6 md:mt-8 px-4 md:px-6">
        <p className="text-xs text-muted-foreground text-center md:text-left">
          © 2023 ProductHunt. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
