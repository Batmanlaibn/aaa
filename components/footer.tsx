import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">Z</span>
              </div>
              <span className="text-xl font-bold text-foreground">ZamZuur</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Таны цагийг хэмнэх, амьдралыг хялбарчлах зорилготой.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Холбоосууд</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/stores" className="hover:text-foreground">
                  Дэлгүүрүүд
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-foreground">
                  Төлөвлөгөө
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  Бидний тухай
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Үйлчилгээ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Ойр дэлгүүр хайх</li>
              <li>Урьдчилан захиалах</li>
              <li>Маршрут төлөвлөх</li>
              <li>Төсөв тооцоолох</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Холбоо барих</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Улаанбаатар, Монгол
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +976 9900 0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@zamzuur.mn
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 ZamZuur. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}
