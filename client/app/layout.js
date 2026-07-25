import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}