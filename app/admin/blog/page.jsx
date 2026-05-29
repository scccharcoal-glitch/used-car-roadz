import AdminBlogDashboard from "@/components/AdminBlogDashboard";

export const metadata = {
  title: "ROADZ Admin Blog | จัดการบทความ",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminBlogPage() {
  return <AdminBlogDashboard />;
}
