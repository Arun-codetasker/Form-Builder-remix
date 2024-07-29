/*
  Warnings:

  - The primary key for the `Template` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Template` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Template` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `form_title` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `htmlStructure` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "form_title" TEXT NOT NULL,
    "htmlStructure" TEXT NOT NULL
);
INSERT INTO "new_Template" ("id") SELECT "id" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
