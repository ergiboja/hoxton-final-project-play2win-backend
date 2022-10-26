/*
  Warnings:

  - Added the required column `payout` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "ammount" INTEGER NOT NULL,
    "odd" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "payout" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("ammount", "date", "id", "odd", "status", "userId") SELECT "ammount", "date", "id", "odd", "status", "userId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
