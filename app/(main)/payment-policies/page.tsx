import React from "react";
import { CreditCard, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentPolicies() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment & Cancellation Policies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please review our payment and cancellation policies carefully before
            making your booking.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Payment Policy Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Policy
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                We require a structured payment schedule to secure your booking
                and ensure smooth travel arrangements.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                      <span className="text-gray-700">
                        25% deposit required upon booking confirmation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                      <span className="text-gray-700">
                        25% payment due within 3 weeks of travel date
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                      <span className="text-gray-700">
                        25% payment due within 2 weeks of travel date
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                      <span className="text-gray-700">
                        Full payment required within 8 days of travel date
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cancellation Policy Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Cancellation Policy
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                Cancellation charges apply once booking is confirmed. Refunds
                are processed according to the following schedule:
              </p>
              <div className="bg-red-50 p-6 rounded-lg">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="text-gray-700">
                      <strong className="text-red-800">
                        15+ days before arrival:
                      </strong>{" "}
                      85% refund of total amount
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="text-gray-700">
                      <strong className="text-red-800">
                        7-15 days before arrival:
                      </strong>{" "}
                      70% refund of total amount
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="text-gray-700">
                      <strong className="text-red-800">
                        72 hours to 7 days before arrival:
                      </strong>{" "}
                      45% refund of total amount
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="text-gray-700">
                      <strong className="text-red-800">
                        Within 72 hours of arrival:
                      </strong>{" "}
                      No refund (treated as no-show)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            For any questions regarding payments or cancellations, please
            contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
