import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  EnquiryChart,
  TopPackagesChart,
  DestinationPieChart,
  RevenueChart,
} from "@/components/admin/dashboard-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  MapPin,
  FileText,
  Star,
  Mail,
  Eye,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [
    packagesCount,
    destinationsCount,
    blogsCount,
    reviewsCount,
    enquiriesCount,
    pendingEnquiries,
    activePackages,
    publishedBlogs,
  ] = await Promise.all([
    prisma.package.count(),
    prisma.destination.count(),
    prisma.blog.count(),
    prisma.review.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.package.count({ where: { isActive: true } }),
    prisma.blog.count({ where: { isPublished: true } }),
  ]);

  return {
    packages: packagesCount,
    destinations: destinationsCount,
    blogs: blogsCount,
    reviews: reviewsCount,
    enquiries: enquiriesCount,
    pendingEnquiries,
    activePackages,
    publishedBlogs,
  };
}

async function getRecentEnquiries() {
  return prisma.enquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      package: { select: { title: true } },
    },
  });
}

// Generate dynamic chart data from database (last 6 months)
async function getChartData() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Get enquiry data by month
  const enquiryData = await prisma.enquiry.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Get conversion data
  const conversionData = await prisma.enquiry.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
      status: "CONVERTED",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Format monthly data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleString("en-US", { month: "short" });
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const enquiriesCount = await prisma.enquiry.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const conversionsCount = await prisma.enquiry.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
        status: "CONVERTED",
      },
    });

    months.push({
      month: monthKey,
      enquiries: enquiriesCount,
      conversions: conversionsCount,
    });
  }

  // Get top packages by enquiry count
  const topPackages = await prisma.package.findMany({
    include: {
      _count: {
        select: {
          enquiries: true,
        },
      },
    },
    orderBy: {
      enquiries: {
        _count: "desc",
      },
    },
    take: 5,
    where: {
      isActive: true,
    },
  });

  const packageData = topPackages.map((pkg) => ({
    name:
      pkg.title.length > 20 ? pkg.title.substring(0, 20) + "..." : pkg.title,
    bookings: pkg._count.enquiries,
  }));

  // Get popular destinations from package enquiries
  const destinationStats = await prisma.enquiry.groupBy({
    by: ["destination"],
    _count: {
      id: true,
    },
    where: {
      destination: {
        not: null,
      },
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 4,
  });

  const otherDestinationsCount = await prisma.enquiry.count({
    where: {
      destination: {
        notIn: destinationStats.map((d) => d.destination as string),
      },
    },
  });

  const destinationData = [
    ...destinationStats.map((stat) => ({
      name: stat.destination || "Unknown",
      value: stat._count.id,
    })),
    ...(otherDestinationsCount > 0
      ? [{ name: "Others", value: otherDestinationsCount }]
      : []),
  ];

  // Calculate revenue trend (using package starting prices as proxy)
  const revenueData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleString("en-US", { month: "short" });
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const convertedEnquiries = await prisma.enquiry.findMany({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
        status: "CONVERTED",
      },
      include: {
        package: {
          select: {
            startingPrice: true,
          },
        },
      },
    });

    const monthRevenue = convertedEnquiries.reduce((total, enquiry) => {
      return total + (enquiry.package?.startingPrice?.toNumber() || 50000); // Default package price if not found
    }, 0);

    revenueData.push({
      month: monthKey,
      revenue: monthRevenue,
    });
  }

  return { enquiryData: months, packageData, destinationData, revenueData };
}

export default async function AdminDashboard() {
  const [stats, recentEnquiries, chartData] = await Promise.all([
    getStats(),
    getRecentEnquiries(),
    getChartData(),
  ]);

  const statCards = [
    {
      title: "Total Packages",
      value: stats.packages,
      description: `${stats.activePackages} active`,
      icon: Package,
      href: "/admin/packages",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Destinations",
      value: stats.destinations,
      description: "Locations covered",
      icon: MapPin,
      href: "/admin/destinations",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Blog Posts",
      value: stats.blogs,
      description: `${stats.publishedBlogs} published`,
      icon: FileText,
      href: "/admin/blogs",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Reviews",
      value: stats.reviews,
      description: "Customer reviews",
      icon: Star,
      href: "/admin/reviews",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Enquiries",
      value: stats.enquiries,
      description: `${stats.pendingEnquiries} pending`,
      icon: Mail,
      href: "/admin/enquiries",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your travel platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`size-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <EnquiryChart data={chartData.enquiryData} />
          {chartData.packageData.length > 0 && (
            <TopPackagesChart data={chartData.packageData} />
          )}
          {chartData.destinationData.length > 0 && (
            <DestinationPieChart data={chartData.destinationData} />
          )}
          <RevenueChart data={chartData.revenueData} />
        </div>

        {/* Recent Enquiries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Enquiries</CardTitle>
                <CardDescription>
                  Latest customer enquiries and requests
                </CardDescription>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentEnquiries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No enquiries yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{enquiry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {enquiry.package?.title || enquiry.source}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          enquiry.status === "NEW"
                            ? "bg-blue-100 text-blue-800"
                            : enquiry.status === "CONTACTED"
                              ? "bg-yellow-100 text-yellow-800"
                              : enquiry.status === "CONVERTED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Add Package",
              href: "/admin/packages/new",
              icon: Package,
            },
            {
              label: "Add Destination",
              href: "/admin/destinations/new",
              icon: MapPin,
            },
            { label: "Write Blog", href: "/admin/blogs/new", icon: FileText },
            { label: "View Site", href: "/", icon: Eye },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <action.icon className="size-6 text-primary" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
