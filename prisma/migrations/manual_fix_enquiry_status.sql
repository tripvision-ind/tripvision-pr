-- Update existing enquiry statuses
UPDATE "enquiries" SET status = 'PENDING' WHERE status = 'NEW';
UPDATE "enquiries" SET status = 'CONFIRMED' WHERE status = 'CONVERTED';

-- Now alter the enum
ALTER TYPE "EnquiryStatus" RENAME VALUE 'NEW' TO 'PENDING_OLD';
ALTER TYPE "EnquiryStatus" RENAME VALUE 'CONVERTED' TO 'CONFIRMED_OLD';

-- Create new enum with correct values
CREATE TYPE "EnquiryStatus_new" AS ENUM ('PENDING', 'CONTACTED', 'IN_PROGRESS', 'CONFIRMED', 'REJECTED', 'CLOSED');

-- Alter the column to use new enum
ALTER TABLE "enquiries" ALTER COLUMN "status" TYPE "EnquiryStatus_new" 
  USING (
    CASE "status"::text
      WHEN 'NEW' THEN 'PENDING'
      WHEN 'CONVERTED' THEN 'CONFIRMED'
      ELSE "status"::text
    END
  )::"EnquiryStatus_new";

-- Drop old enum
DROP TYPE "EnquiryStatus";

-- Rename new enum to correct name
ALTER TYPE "EnquiryStatus_new" RENAME TO "EnquiryStatus";
