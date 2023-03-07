module.exports = {
  up: "CREATE TABLE IF NOT EXISTS `datasource` (\
        `datasource_id` bigint unsigned NOT NULL AUTO_INCREMENT,\
        `name` varchar(63) NOT NULL,\
        `type` varchar(15) NOT NULL COMMENT 'Datasource types Examples: MYSQL, MARIADB, POSTGRE, ORACLEDB, MONGO',\
        `config` json NOT NULL,\
        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
        `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
        PRIMARY KEY (`datasource_id`),\
        UNIQUE KEY `name` (`name`)\
        ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  down: "DROP TABLE IF EXISTS `datasource`",
};
