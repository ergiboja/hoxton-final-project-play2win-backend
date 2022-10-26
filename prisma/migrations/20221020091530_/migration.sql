-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT,
    "ammount" INTEGER,
    "odd" INTEGER,
    "status" TEXT,
    "payout" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("ammount", "date", "id", "odd", "payout", "status", "userId") SELECT "ammount", "date", "id", "odd", "payout", "status", "userId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
