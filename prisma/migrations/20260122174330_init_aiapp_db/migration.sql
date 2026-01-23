-- CreateTable
CREATE TABLE `mydata` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parent` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `mydata_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `parent_mydata_id_key`(`mydata_id`),
    INDEX `fk_parent_mydata`(`mydata_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `child` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER UNSIGNED NOT NULL,
    `born_date` DATE NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `profile_pic` VARCHAR(255) NULL,
    `goal_money` BIGINT UNSIGNED NULL,
    `monthly_money` BIGINT UNSIGNED NULL,
    `is_promise_fixed` BOOLEAN NOT NULL DEFAULT false,
    `invest_type` VARCHAR(20) NULL,
    `identity_hash` VARCHAR(255) NOT NULL,

    CONSTRAINT `chk_child_money_logic` CHECK (
        (`is_promise_fixed` = 1 AND `goal_money` IS NOT NULL AND `monthly_money` IS NOT NULL) OR
        (`is_promise_fixed` = 0 AND (
            (`goal_money` IS NULL AND `monthly_money` IS NULL) OR 
            (`goal_money` IS NOT NULL AND `monthly_money` IS NOT NULL)
        ))
    ),

    INDEX `fk_child_parent`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fund` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `danger` ENUM('LOW', 'MID', 'HIGH') NOT NULL,
    `type` ENUM('STOCK', 'BOND', 'MIXED', 'ETF') NOT NULL,
    `company` VARCHAR(50) NOT NULL,
    `total_fee` DECIMAL(5, 4) NOT NULL,
    `sell_fee` DECIMAL(5, 4) NOT NULL,
    `set_date` DATE NOT NULL,
    `plus_1` DECIMAL(7, 2) NULL,
    `plus_5` DECIMAL(7, 2) NULL,
    `plus_10` DECIMAL(7, 2) NULL,
    `total_money` BIGINT UNSIGNED NOT NULL,
    `image` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `child_id` INTEGER UNSIGNED NOT NULL,
    `fund_id` INTEGER UNSIGNED NULL,
    `acc_num` VARCHAR(30) NOT NULL,
    `acc_type` ENUM('DEPOSIT', 'FUND', 'PENSION') NOT NULL,
    `opened_at` DATE NOT NULL,
    `closed_at` DATE NULL,
    `deposit` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `in_type` BOOLEAN NOT NULL DEFAULT false,
    `plus_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `plus_money` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `in_month` TINYINT NULL,

    CONSTRAINT `chk_account_in_month` CHECK (
        (`in_type` = 1 AND `in_month` IS NOT NULL) OR (`in_type` = 0)
    ),

    INDEX `fk_account_child`(`child_id`),
    INDEX `fk_account_fund`(`fund_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `money` BIGINT UNSIGNED NOT NULL,
    `source_account_id` INTEGER UNSIGNED NOT NULL,
    `target_account_id` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_history_source`(`source_account_id`),
    INDEX `fk_history_target`(`target_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatlog` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `child_id` INTEGER UNSIGNED NOT NULL,
    `log` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `is_sent` BOOLEAN NOT NULL DEFAULT false,

    INDEX `fk_chatlog_child`(`child_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alert` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `child_id` INTEGER UNSIGNED NOT NULL,
    `type` VARCHAR(25) NOT NULL,
    `title` VARCHAR(25) NOT NULL,
    `description` TEXT NULL,
    `button_text` VARCHAR(20) NOT NULL DEFAULT '확인',
    `status` BOOLEAN NOT NULL DEFAULT false,
    `priority` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `screen` VARCHAR(50) NOT NULL,

    INDEX `fk_alert_child`(`child_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `parent` ADD CONSTRAINT `fk_parent_mydata` FOREIGN KEY (`mydata_id`) REFERENCES `mydata`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `child` ADD CONSTRAINT `fk_child_parent` FOREIGN KEY (`parent_id`) REFERENCES `parent`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `fk_account_child` FOREIGN KEY (`child_id`) REFERENCES `child`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `fk_account_fund` FOREIGN KEY (`fund_id`) REFERENCES `fund`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `fk_history_source` FOREIGN KEY (`source_account_id`) REFERENCES `account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `fk_history_target` FOREIGN KEY (`target_account_id`) REFERENCES `account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chatlog` ADD CONSTRAINT `fk_chatlog_child` FOREIGN KEY (`child_id`) REFERENCES `child`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alert` ADD CONSTRAINT `fk_alert_child` FOREIGN KEY (`child_id`) REFERENCES `child`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
