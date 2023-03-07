module.exports = {
  up: "CREATE TABLE IF NOT EXISTS `api` (\
        `api_id` bigint unsigned NOT NULL AUTO_INCREMENT,\
        `datasource_id` bigint unsigned NOT NULL,\
        `slug` varchar(63) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\
        `method` varchar(63) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\
        `query` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\
        `override` json NOT NULL,\
        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
        `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
        PRIMARY KEY (`api_id`),\
        UNIQUE KEY `datasource_id` (`datasource_id`,`slug`,`method`),\
        KEY `slug` (`slug`),\
        CONSTRAINT `datasource_id` FOREIGN KEY (`datasource_id`) REFERENCES `datasource` (`datasource_id`) ON DELETE CASCADE\
        ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  down: "DROP TABLE IF EXISTS `api`;",
};
