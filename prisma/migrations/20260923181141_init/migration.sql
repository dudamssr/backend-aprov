/*
  Warnings:

  - You are about to drop the column `cor` on the `materia` table. All the data in the column will be lost.
  - You are about to drop the column `icone` on the `materia` table. All the data in the column will be lost.
  - You are about to drop the column `foto` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `agenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `desempenho` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historicoestudo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mensagemia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `redacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `agenda` DROP FOREIGN KEY `Agenda_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `desempenho` DROP FOREIGN KEY `Desempenho_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `historicoestudo` DROP FOREIGN KEY `HistoricoEstudo_conteudoId_fkey`;

-- DropForeignKey
ALTER TABLE `historicoestudo` DROP FOREIGN KEY `HistoricoEstudo_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `mensagemia` DROP FOREIGN KEY `MensagemIA_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `redacao` DROP FOREIGN KEY `Redacao_usuarioId_fkey`;

-- AlterTable
ALTER TABLE `materia` DROP COLUMN `cor`,
    DROP COLUMN `icone`;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `foto`,
    ADD COLUMN `tipo` VARCHAR(191) NOT NULL DEFAULT 'ALUNO';

-- DropTable
DROP TABLE `agenda`;

-- DropTable
DROP TABLE `desempenho`;

-- DropTable
DROP TABLE `historicoestudo`;

-- DropTable
DROP TABLE `mensagemia`;

-- DropTable
DROP TABLE `redacao`;
