-- CreateTable
CREATE TABLE `server_config` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `serverId` VARCHAR(100) NULL,
    `prefix` VARCHAR(191) NOT NULL DEFAULT '>/',
    `logChannel` TEXT NULL,
    `apiKey` TEXT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `apiErrorMessage` VARCHAR(191) NULL,
    `apiErrorTimestamp` DATETIME(3) NULL,

    UNIQUE INDEX `server_config_serverId_key`(`serverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invite_words_blacklist` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `word` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `invite_words_blacklist_word_key`(`word`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `domain_whitelist` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `domain` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `whitelistImportType` ENUM('manual', 'api') NOT NULL DEFAULT 'manual',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `domain_whitelist_domain_key`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dictionary_blacklist` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `domain` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `blacklistImportType` ENUM('api', 'dictionary') NOT NULL DEFAULT 'dictionary',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `dictionary_blacklist_domain_key`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
