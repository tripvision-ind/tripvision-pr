"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Mail,
  Phone,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  AlertCircle,
  Ban,
  Loader2,
  MapPin,
  Calendar,
  Users,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { AdminEnquiriesFilters } from "@/components/admin/enquiries-filters";

interface Package {
  id: string;
  title: string;
  slug: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  source: string;
  packageId: string | null;
  package: Package | null;
  destination: string | null;
  travelDate: string | null;
  travelers: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StatusCounts {
  NEW: number;
  CONTACTED: number;
  IN_PROGRESS: number;
  CONVERTED: number;
  CLOSED: number;
}

const statusConfig = {
  NEW: {
    label: "New Enquiries",
    color:
      "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800 dark:text-blue-100",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: Clock,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  CONTACTED: {
    label: "Contacted",
    color:
      "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-900 dark:from-yellow-950 dark:to-yellow-900 dark:border-yellow-800 dark:text-yellow-100",
    badgeColor:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: PhoneCall,
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color:
      "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-900 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800 dark:text-purple-100",
    badgeColor:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    icon: AlertCircle,
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  CONVERTED: {
    label: "Converted",
    color:
      "bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-900 dark:from-green-950 dark:to-green-900 dark:border-green-800 dark:text-green-100",
    badgeColor:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle2,
    iconColor: "text-green-600 dark:text-green-400",
  },
  CLOSED: {
    label: "Closed",
    color:
      "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-900 dark:from-gray-950 dark:to-gray-900 dark:border-gray-800 dark:text-gray-100",
    badgeColor: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    icon: XCircle,
    iconColor: "text-gray-600 dark:text-gray-400",
  },
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [currentFilters, setCurrentFilters] = useState<any>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    NEW: 0,
    CONTACTED: 0,
    IN_PROGRESS: 0,
    CONVERTED: 0,
    CLOSED: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const fetchEnquiries = useCallback(async (filters?: any) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.source) params.append("source", filters.source);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.destination)
        params.append("destination", filters.destination);
      if (filters?.packageId) params.append("packageId", filters.packageId);
      if (filters?.dateFrom)
        params.append("dateFrom", filters.dateFrom.toISOString());
      if (filters?.dateTo)
        params.append("dateTo", filters.dateTo.toISOString());
      if (filters?.dateRange) params.append("dateRange", filters.dateRange);

      const queryString = params.toString();
      const url = `/api/admin/enquiries${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const enquiriesList = data.enquiries || data; // Handle both new and old response formats
        setEnquiries(enquiriesList);
        setFilteredEnquiries(enquiriesList);

        // Calculate status counts
        const counts: StatusCounts = {
          NEW: 0,
          CONTACTED: 0,
          IN_PROGRESS: 0,
          CONVERTED: 0,
          CLOSED: 0,
        };

        enquiriesList.forEach((enquiry: Enquiry) => {
          if (enquiry.status in counts) {
            counts[enquiry.status as keyof StatusCounts]++;
          }
        });

        setStatusCounts(counts);
      }
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFiltersChange = useCallback(
    (filters: any) => {
      setCurrentFilters(filters);
      fetchEnquiries(filters);
    },
    [fetchEnquiries],
  );

  const handleFiltersReset = useCallback(() => {
    setCurrentFilters(null);
    fetchEnquiries();
  }, [fetchEnquiries]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleViewEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setNotes(enquiry.notes || "");
    setViewModalOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedEnquiry) return;

    try {
      setStatusUpdateLoading(true);
      const response = await fetch(
        `/api/admin/enquiries/${selectedEnquiry.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, notes }),
        },
      );

      if (response.ok) {
        toast.success("Status updated successfully");
        await fetchEnquiries(currentFilters);
        setViewModalOpen(false);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleDeleteEnquiry = async () => {
    if (!enquiryToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/admin/enquiries/${enquiryToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Enquiry deleted successfully");
        await fetchEnquiries(currentFilters);
        setDeleteDialogOpen(false);
        setEnquiryToDelete(null);
        if (selectedEnquiry?.id === enquiryToDelete) {
          setViewModalOpen(false);
        }
      } else {
        toast.error("Failed to delete enquiry");
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      toast.error("Failed to delete enquiry");
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setEnquiryToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Enquiries</h1>
            <p className="text-muted-foreground">
              Manage customer enquiries and leads
            </p>
          </div>
        </div>

        {/* Filters */}
        <AdminEnquiriesFilters
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />

        {/* Status Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            const count = statusCounts[status as keyof StatusCounts];

            return (
              <Card
                key={status}
                className={`border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${config.color}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-semibold tracking-tight">
                      {config.label}
                    </CardTitle>
                    <div className="text-2xl font-bold">{count}</div>
                  </div>
                  <div
                    className={`p-2 rounded-full bg-white/20 backdrop-blur-sm ${config.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${config.iconColor} bg-current`}
                      />
                      <span className="font-medium">
                        {count === 0
                          ? "No enquiries"
                          : count === 1
                            ? "1 enquiry"
                            : `${count} enquiries`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enquiries Table */}
        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Package/Destination
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Travel Date
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No enquiries yet
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnquiries.map((enquiry) => {
                      const StatusIcon =
                        statusConfig[
                          enquiry.status as keyof typeof statusConfig
                        ]?.icon || Clock;

                      return (
                        <TableRow key={enquiry.id}>
                          <TableCell className="font-medium">
                            {enquiry.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <a
                                href={`mailto:${enquiry.email}`}
                                className="text-xs flex items-center gap-1 hover:text-primary truncate max-w-[200px]"
                                title={enquiry.email}
                              >
                                <Mail className="size-3 flex-shrink-0" />
                                <span className="truncate">
                                  {enquiry.email}
                                </span>
                              </a>
                              <a
                                href={`tel:${enquiry.phone}`}
                                className="text-xs flex items-center gap-1 hover:text-primary"
                              >
                                <Phone className="size-3 flex-shrink-0" />
                                {enquiry.phone}
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {enquiry.source.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {enquiry.package ? (
                              <Link
                                href={`/packages/${enquiry.package.slug}`}
                                className="text-sm hover:text-primary truncate block max-w-[200px]"
                                target="_blank"
                                title={enquiry.package.title}
                              >
                                {enquiry.package.title}
                              </Link>
                            ) : enquiry.destination ? (
                              <span className="text-sm">
                                {enquiry.destination}
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {enquiry.travelDate
                              ? formatDate(new Date(enquiry.travelDate))
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusConfig[
                                  enquiry.status as keyof typeof statusConfig
                                ]?.badgeColor || "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <StatusIcon className="size-3" />
                              {statusConfig[
                                enquiry.status as keyof typeof statusConfig
                              ]?.label || enquiry.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                            {formatDate(new Date(enquiry.createdAt))}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewEnquiry(enquiry)}
                                title="View details"
                              >
                                <Eye className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete(enquiry.id)}
                                title="Delete enquiry"
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* View/Edit Enquiry Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>
              View and update enquiry information
            </DialogDescription>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                  Customer Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Name
                    </Label>
                    <p className="text-sm font-medium">
                      {selectedEnquiry.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Email
                    </Label>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Mail className="size-3" />
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Phone
                    </Label>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Phone className="size-3" />
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Source
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {selectedEnquiry.source.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                  Trip Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedEnquiry.package && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Package
                      </Label>
                      <Link
                        href={`/packages/${selectedEnquiry.package.slug}`}
                        className="text-sm text-primary hover:underline block"
                        target="_blank"
                      >
                        {selectedEnquiry.package.title}
                      </Link>
                    </div>
                  )}
                  {selectedEnquiry.destination && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" />
                        Destination
                      </Label>
                      <p className="text-sm">{selectedEnquiry.destination}</p>
                    </div>
                  )}
                  {selectedEnquiry.travelDate && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3" />
                        Travel Date
                      </Label>
                      <p className="text-sm">
                        {formatDate(new Date(selectedEnquiry.travelDate))}
                      </p>
                    </div>
                  )}
                  {selectedEnquiry.travelers && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="size-3" />
                        Travelers
                      </Label>
                      <p className="text-sm">{selectedEnquiry.travelers}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              {selectedEnquiry.message && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="size-3" />
                    Message
                  </Label>
                  <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select
                  value={selectedEnquiry.status}
                  onValueChange={handleStatusChange}
                  disabled={statusUpdateLoading}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([status, config]) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <Icon className="size-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold">
                  Internal Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this enquiry..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  disabled={statusUpdateLoading}
                />
              </div>

              {/* Timestamps */}
              <div className="grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground pt-2 border-t">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(new Date(selectedEnquiry.createdAt))}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {formatDate(new Date(selectedEnquiry.updatedAt))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() =>
                selectedEnquiry && confirmDelete(selectedEnquiry.id)
              }
              disabled={statusUpdateLoading}
              className="w-full sm:w-auto"
            >
              <Trash2 className="size-4" />
              Delete Enquiry
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setViewModalOpen(false)}
                disabled={statusUpdateLoading}
                className="flex-1 sm:flex-none"
              >
                Close
              </Button>
              <Button
                onClick={async () => {
                  if (selectedEnquiry && notes !== selectedEnquiry.notes) {
                    await handleStatusChange(selectedEnquiry.status);
                  }
                }}
                disabled={
                  statusUpdateLoading || notes === selectedEnquiry?.notes
                }
                className="flex-1 sm:flex-none"
              >
                {statusUpdateLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Notes"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              enquiry from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEnquiry}
              disabled={deleteLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
