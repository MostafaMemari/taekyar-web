-- Post.date: convert Persian display strings to real timestamps
-- Values parsed from Jalali strings (e.g. "۲۵ مرداد ۱۴۰۵" => 2026-08-16),
-- stored at 12:00 UTC so the date is stable across display timezones.
ALTER TABLE "Post" ADD COLUMN "date_new" TIMESTAMP(3);

UPDATE "Post" SET "date_new" = CASE "id"
  WHEN 1 THEN '2026-08-16 12:00:00'::timestamp
  WHEN 2 THEN '2026-08-01 12:00:00'::timestamp
  WHEN 3 THEN '2026-07-24 12:00:00'::timestamp
  WHEN 4 THEN '2026-08-09 12:00:00'::timestamp
  WHEN 5 THEN '2026-07-19 12:00:00'::timestamp
  WHEN 6 THEN '2026-07-11 12:00:00'::timestamp
  WHEN 12 THEN '2026-08-30 12:00:00'::timestamp
  WHEN 24 THEN '2026-09-01 12:00:00'::timestamp
END
WHERE "date" IS NOT NULL AND "date" <> '';

ALTER TABLE "Post" DROP COLUMN "date";
ALTER TABLE "Post" RENAME COLUMN "date_new" TO "date";
