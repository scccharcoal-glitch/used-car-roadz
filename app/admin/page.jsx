import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "ROADZ Admin | จัดการรถมือสอง",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return <AdminDashboard />;
}
